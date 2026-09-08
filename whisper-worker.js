import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1/+esm';

env.allowLocalModels = false;
env.useBrowserCache = true;
const cache = new Map();

function configFor(device){
  if(device==='webgpu')return {device:'webgpu',dtype:{encoder_model:'q8',decoder_model_merged:'q4'}};
  return {device:'wasm',dtype:{encoder_model:'q8',decoder_model_merged:'q8'}};
}

async function getTranscriber(model,preferredDevice){
  const progress_callback=(x)=>{if(x?.status==='progress')postMessage({type:'model-progress',progress:Number(x.progress)||0,file:x.file||x.name||''})};
  const load=async(device)=>{const key=`${model}:${device}`;if(cache.has(key))return cache.get(key);const pipe=await pipeline('automatic-speech-recognition',model,{...configFor(device),progress_callback});cache.set(key,pipe);return pipe};
  if(preferredDevice==='webgpu'){
    try{return {pipe:await load('webgpu'),device:'webgpu'}}catch(error){console.warn('WebGPU Whisper failed, falling back to WASM',error);postMessage({type:'device',device:'wasm'});return {pipe:await load('wasm'),device:'wasm'}}
  }
  return {pipe:await load('wasm'),device:'wasm'};
}

function normalizeChunks(out,audioDuration){
  const chunks=Array.isArray(out?.chunks)?out.chunks:[];const words=[];
  for(const c of chunks){
    const text=String(c?.text||'').trim();if(!text)continue;
    const ts=Array.isArray(c.timestamp)?c.timestamp:[0,audioDuration];let a=Number(ts[0]??0),b=Number(ts[1]??a+.35);if(!Number.isFinite(a))a=0;if(!Number.isFinite(b)||b<=a)b=a+.35;
    const tokens=text.split(/\s+/).filter(Boolean);
    if(tokens.length===1)words.push({word:tokens[0],start:a,end:b});
    else{const dur=Math.max(.08,b-a)/tokens.length;tokens.forEach((word,i)=>words.push({word,start:a+i*dur,end:a+(i+1)*dur}))}
  }
  if(words.length)return words;
  const text=String(out?.text||'').trim();if(!text)return[];const tokens=text.split(/\s+/).filter(Boolean),dur=audioDuration/Math.max(1,tokens.length);return tokens.map((word,i)=>({word,start:i*dur,end:(i+1)*dur}));
}

self.onmessage=async({data})=>{
  if(data.type!=='transcribe')return;
  try{
    const audio=new Float32Array(data.audio);const duration=audio.length/16000;let preferred=data.device==='webgpu'?'webgpu':'wasm';const loaded=await getTranscriber(data.model||'onnx-community/whisper-small_timestamped',preferred);postMessage({type:'device',device:loaded.device});postMessage({type:'transcribe-start'});
    const opts={task:'transcribe',return_timestamps:'word',chunk_length_s:30,stride_length_s:5};
    if(data.language&&data.language!=='auto')opts.language=data.language;
    let out;
    try{out=await loaded.pipe(audio,opts)}catch(first){
      console.warn('Word timestamps failed, retrying segment timestamps',first);
      const fallback={task:'transcribe',return_timestamps:true,chunk_length_s:30,stride_length_s:5};if(data.language&&data.language!=='auto')fallback.language=data.language;out=await loaded.pipe(audio,fallback);
    }
    postMessage({type:'result',words:normalizeChunks(out,duration),text:String(out?.text||'')});
  }catch(error){postMessage({type:'error',message:error?.message||String(error),stack:error?.stack||''})}
};
