import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1/+esm';

env.allowLocalModels = false;
const cache = new Map();

const DEVICE_CONFIG = {
  webgpu:{device:'webgpu',dtype:{encoder_model:'fp32',decoder_model_merged:'q4'}},
  wasm:{device:'wasm',dtype:'q8'},
};

async function getTranscriber(model, preferredDevice){
  const key=`${model}:${preferredDevice}`;if(cache.has(key))return {pipe:cache.get(key),device:preferredDevice};
  const progress_callback=(x)=>{if(x?.status==='progress')postMessage({type:'model-progress',progress:Number(x.progress)||0,file:x.file||x.name||''})};
  try{const pipe=await pipeline('automatic-speech-recognition',model,{...DEVICE_CONFIG[preferredDevice],progress_callback});cache.set(key,pipe);return {pipe,device:preferredDevice}}catch(err){
    if(preferredDevice==='webgpu'){postMessage({type:'device',device:'wasm'});const wasmKey=`${model}:wasm`;if(cache.has(wasmKey))return {pipe:cache.get(wasmKey),device:'wasm'};const pipe=await pipeline('automatic-speech-recognition',model,{...DEVICE_CONFIG.wasm,progress_callback});cache.set(wasmKey,pipe);return {pipe,device:'wasm'}}throw err;
  }
}

self.onmessage=async({data})=>{
  if(data.type!=='transcribe')return;
  try{
    const audio=new Float32Array(data.audio);let device=data.device==='webgpu'?'webgpu':'wasm';const loaded=await getTranscriber(data.model||'onnx-community/whisper-tiny',device);device=loaded.device;postMessage({type:'device',device});const pipe=loaded.pipe;
    const sampleRate=16000,chunkSeconds=25,chunkSamples=chunkSeconds*sampleRate,total=Math.ceil(audio.length/chunkSamples);const words=[];
    for(let i=0;i<total;i++){
      const start=i*chunkSamples,end=Math.min(audio.length,start+chunkSamples),part=audio.slice(start,end),offset=start/sampleRate;
      const opts={return_timestamps:'word',task:'transcribe'};if(data.language&&data.language!=='auto')opts.language=data.language;
      let out;try{out=await pipe(part,opts)}catch{const fallback={return_timestamps:true,task:'transcribe'};if(data.language&&data.language!=='auto')fallback.language=data.language;out=await pipe(part,fallback)}
      const chunks=Array.isArray(out?.chunks)?out.chunks:[];
      if(chunks.length){for(const c of chunks){const text=String(c.text||'').trim();if(!text)continue;let ts=Array.isArray(c.timestamp)?c.timestamp:[0,part.length/sampleRate],a=Number(ts[0]??0),b=Number(ts[1]??a+.3);if(!Number.isFinite(a))a=0;if(!Number.isFinite(b)||b<=a)b=a+.3;const tokens=text.split(/\s+/).filter(Boolean);if(tokens.length===1){words.push({word:tokens[0],start:offset+a,end:offset+b})}else{const dur=Math.max(.05,b-a)/tokens.length;tokens.forEach((word,j)=>words.push({word,start:offset+a+j*dur,end:offset+a+(j+1)*dur}))}}
      }else if(out?.text){const tokens=String(out.text).trim().split(/\s+/).filter(Boolean),dur=(part.length/sampleRate)/Math.max(1,tokens.length);tokens.forEach((word,j)=>words.push({word,start:offset+j*dur,end:offset+(j+1)*dur}))}
      postMessage({type:'transcribe-progress',progress:((i+1)/total)*100,current:i+1,total,seconds:Math.min(data.duration||Infinity,end/sampleRate)});
    }
    postMessage({type:'result',words});
  }catch(e){postMessage({type:'error',message:e?.message||String(e)})}
};
