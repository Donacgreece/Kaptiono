let pipelineFn = null;
let envRef = null;
const cache = new Map();

async function loadTransformers(){
  if(pipelineFn) return;
  postMessage({type:'worker-ready'});
  const mod = await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1/+esm');
  pipelineFn = mod.pipeline;
  envRef = mod.env;
  envRef.allowLocalModels = false;
  // CacheStorage is only guaranteed in secure contexts (HTTPS / localhost).
  // Never force browser caching when it is unavailable, otherwise
  // Transformers.js aborts before loading Whisper.
  const browserCacheAvailable =
    self.isSecureContext === true &&
    typeof self.caches !== 'undefined';
  envRef.useBrowserCache = browserCacheAvailable;
  postMessage({type:'cache-status',enabled:browserCacheAvailable});
}

async function getTranscriber(model){
  await loadTransformers();
  const key = `${model}:wasm:q8`;
  if(cache.has(key)) return cache.get(key);
  const progress_callback = (x)=>{
    if(x?.status === 'progress'){
      postMessage({type:'model-progress',progress:Number(x.progress)||0,file:x.file||x.name||''});
    }
  };
  const pipe = await pipelineFn('automatic-speech-recognition', model, {
    device:'wasm',
    dtype:'q8',
    progress_callback,
  });
  cache.set(key, pipe);
  postMessage({type:'model-ready'});
  return pipe;
}

function normalizeChunks(out,audioDuration){
  const chunks = Array.isArray(out?.chunks) ? out.chunks : [];
  const words = [];
  for(const c of chunks){
    const text = String(c?.text || '').trim();
    if(!text) continue;
    const ts = Array.isArray(c.timestamp) ? c.timestamp : [0,audioDuration];
    let a = Number(ts[0] ?? 0), b = Number(ts[1] ?? a + .35);
    if(!Number.isFinite(a)) a = 0;
    if(!Number.isFinite(b) || b <= a) b = a + .35;
    const tokens = text.split(/\s+/).filter(Boolean);
    if(tokens.length === 1){
      words.push({word:tokens[0],start:a,end:b});
    }else{
      const dur = Math.max(.08,b-a) / tokens.length;
      tokens.forEach((word,i)=>words.push({word,start:a+i*dur,end:a+(i+1)*dur}));
    }
  }
  if(words.length) return words;
  const text = String(out?.text || '').trim();
  if(!text) return [];
  const tokens = text.split(/\s+/).filter(Boolean);
  const dur = audioDuration / Math.max(1,tokens.length);
  return tokens.map((word,i)=>({word,start:i*dur,end:(i+1)*dur}));
}


const NON_SPEECH_MARKERS = new Set([
  'music','musical','instrumental',
  'μουσικη','μουσική'
]);

function markerToken(value){
  return String(value||'')
    .toLocaleLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g,'')
    .replace(/[\[\](){}<>♪♫♬♩.,!?;:'"…_-]+/g,'')
    .trim();
}

function transcriptTokens(text){
  return String(text||'')
    .split(/\s+/)
    .map(markerToken)
    .filter(Boolean);
}

function isMusicMarkerToken(token){
  return NON_SPEECH_MARKERS.has(markerToken(token));
}

function shouldVoiceBoostRetry(text,words,duration){
  const tokens=transcriptTokens(text);
  const wordTokens=(Array.isArray(words)?words:[])
    .map(w=>markerToken(w?.word))
    .filter(Boolean);

  const all=[...tokens,...wordTokens];
  if(!all.length)return false;

  const markerCount=all.filter(isMusicMarkerToken).length;
  const markerRatio=markerCount/Math.max(1,all.length);
  const spoken=all.filter(t=>!isMusicMarkerToken(t)).length;

  // Conservative trigger: only explicit music-dominated results are retried.
  const markerOnly=markerCount>0&&spoken===0;
  const markerDominated=
    Number(duration)>=6 &&
    markerCount>=1 &&
    markerRatio>=0.60 &&
    spoken<=2;

  return markerOnly||markerDominated;
}

function biquadCoefficients(type,frequency,q,gainDb,sampleRate){
  const w0=2*Math.PI*frequency/sampleRate;
  const cos=Math.cos(w0),sin=Math.sin(w0);
  const alpha=sin/(2*q);
  let b0,b1,b2,a0,a1,a2;

  if(type==='highpass'){
    b0=(1+cos)/2;
    b1=-(1+cos);
    b2=(1+cos)/2;
    a0=1+alpha;
    a1=-2*cos;
    a2=1-alpha;
  }else if(type==='peaking'){
    const A=Math.pow(10,gainDb/40);
    b0=1+alpha*A;
    b1=-2*cos;
    b2=1-alpha*A;
    a0=1+alpha/A;
    a1=-2*cos;
    a2=1-alpha/A;
  }else{
    throw new Error('Unsupported filter type');
  }

  return{
    b0:b0/a0,b1:b1/a0,b2:b2/a0,
    a1:a1/a0,a2:a2/a0
  };
}

function applyBiquad(input,c){
  const out=new Float32Array(input.length);
  let x1=0,x2=0,y1=0,y2=0;
  for(let i=0;i<input.length;i++){
    const x=input[i];
    const y=c.b0*x+c.b1*x1+c.b2*x2-c.a1*y1-c.a2*y2;
    out[i]=Number.isFinite(y)?y:0;
    x2=x1;x1=x;y2=y1;y1=y;
  }
  return out;
}

function voiceBoost16k(input){
  if(!(input instanceof Float32Array)||!input.length)return input;

  // Remove low-frequency rumble, mildly emphasize speech intelligibility,
  // then normalize/compress. This buffer is used only for the retry.
  let out=applyBiquad(
    input,
    biquadCoefficients('highpass',110,.707,0,16000)
  );

  out=applyBiquad(
    out,
    biquadCoefficients('peaking',2100,.85,4.5,16000)
  );

  let sum=0;
  for(let i=0;i<out.length;i++)sum+=out[i]*out[i];
  const rms=Math.sqrt(sum/Math.max(1,out.length));
  const targetRms=.16;
  const gain=Math.min(4.0,Math.max(.85,targetRms/Math.max(.008,rms)));

  const shaped=new Float32Array(out.length);
  const drive=1.35;
  const norm=Math.tanh(drive);
  let peak=0;
  for(let i=0;i<out.length;i++){
    const boosted=out[i]*gain;
    const value=Math.tanh(boosted*drive)/norm;
    shaped[i]=value;
    peak=Math.max(peak,Math.abs(value));
  }

  if(peak>.98){
    const scale=.98/peak;
    for(let i=0;i<shaped.length;i++)shaped[i]*=scale;
  }

  return shaped;
}

async function transcribeWithTimestampFallback(pipe,audio,opts){
  try{
    return await pipe(audio,opts);
  }catch(first){
    console.warn('Word timestamps failed, retrying segment timestamps',first);
    const fallback={
      task:'transcribe',
      return_timestamps:true,
      chunk_length_s:29,
      stride_length_s:5
    };
    if(opts.language&&opts.language!=='auto')fallback.language=opts.language;
    return await pipe(audio,fallback);
  }
}

function transcriptionQuality(text,words){
  const tokens=transcriptTokens(text);
  const markers=tokens.filter(isMusicMarkerToken).length;
  const lexical=tokens.length-markers;
  const timed=(Array.isArray(words)?words:[]).filter(
    w=>markerToken(w?.word)&&!isMusicMarkerToken(w?.word)
  ).length;

  return lexical*4+timed*2-markers*8;
}

self.onmessage = async ({data})=>{
  if(data.type!=='transcribe'&&data.type!=='transcribe-isolated')return;
  try{
    const audio = new Float32Array(data.audio);
    const duration = audio.length / 16000;
    const isolatedPass=data.type==='transcribe-isolated';
    postMessage({type:'device',device:'wasm'});
    const pipe = await getTranscriber(data.model || 'onnx-community/whisper-base_timestamped');
    postMessage({type:'transcribe-start'});

    const opts = {
      task:'transcribe',
      return_timestamps:'word',
      chunk_length_s:29,
      stride_length_s:5,
    };
    if(data.language && data.language !== 'auto') opts.language = data.language;

    const firstOut = await transcribeWithTimestampFallback(pipe,audio,opts);
    const firstWords = normalizeChunks(firstOut,duration);
    const firstText = String(firstOut?.text||'');

    let finalOut=firstOut;
    let finalWords=firstWords;
    let voiceRetry=false;
    let voiceRetryImproved=false;

    if(!isolatedPass&&shouldVoiceBoostRetry(firstText,firstWords,duration)){
      voiceRetry=true;
      postMessage({type:'voice-retry-start',reason:'music'});

      try{
        const boosted=voiceBoost16k(audio);
        const retryOut=await transcribeWithTimestampFallback(pipe,boosted,opts);
        const retryWords=normalizeChunks(retryOut,duration);
        const retryText=String(retryOut?.text||'');

        const firstScore=transcriptionQuality(firstText,firstWords);
        const retryScore=transcriptionQuality(retryText,retryWords);

        if(
          retryScore>=firstScore+4 &&
          !shouldVoiceBoostRetry(retryText,retryWords,duration)
        ){
          finalOut=retryOut;
          finalWords=retryWords;
          voiceRetryImproved=true;
        }

        postMessage({type:'voice-retry-result',improved:voiceRetryImproved});
      }catch(retryError){
        console.warn('Automatic Voice Boost retry failed; keeping first Whisper result',retryError);
        postMessage({type:'voice-retry-result',improved:false});
      }
    }

    postMessage({type:'transcribe-progress',progress:100});
    const resultMessage={
      type:'result',
      words:finalWords,
      text:String(finalOut?.text||''),
      voiceRetry,
      voiceRetryImproved,
      lyricsPass:isolatedPass,
    };

    if(!isolatedPass&&voiceRetry&&!voiceRetryImproved){
      resultMessage.lyricsAudio=audio.buffer;
      postMessage(resultMessage,[audio.buffer]);
    }else{
      postMessage(resultMessage);
    }
  }catch(error){
    postMessage({type:'error',message:error?.message||String(error),stack:error?.stack||''});
  }
};
