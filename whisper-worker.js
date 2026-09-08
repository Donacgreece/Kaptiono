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
    typeof caches !== 'undefined' &&
    (typeof self.isSecureContext === 'undefined' || self.isSecureContext === true);
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

self.onmessage = async ({data})=>{
  if(data.type !== 'transcribe') return;
  try{
    const audio = new Float32Array(data.audio);
    const duration = audio.length / 16000;
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
    let out;
    try{
      out = await pipe(audio, opts);
    }catch(first){
      console.warn('Word timestamps failed, retrying segment timestamps', first);
      const fallback = {task:'transcribe',return_timestamps:true,chunk_length_s:29,stride_length_s:5};
      if(data.language && data.language !== 'auto') fallback.language = data.language;
      out = await pipe(audio, fallback);
    }
    postMessage({type:'transcribe-progress',progress:100});
    postMessage({type:'result',words:normalizeChunks(out,duration),text:String(out?.text||'')});
  }catch(error){
    postMessage({type:'error',message:error?.message||String(error),stack:error?.stack||''});
  }
};
