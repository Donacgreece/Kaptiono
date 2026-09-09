
importScripts('https://cdn.jsdelivr.net/npm/onnxruntime-web@1.21.0/dist/ort.all.min.js');

const MODEL_URL='https://huggingface.co/elicwhite/scnet-browser-onnx/resolve/main/scnet_base.onnx';
const MODEL_SIZE_MB=44.5;

const SR=44100;
const INPUT_SR=16000;
const N_FFT=4096;
const HOP_SIZE=1024;
const CHUNK_SIZE=485100;
const TARGET_PADDED=(476-1)*HOP_SIZE+N_FFT;
const VOCALS_INDEX=3;

let session=null;

ort.env.wasm.wasmPaths='https://cdn.jsdelivr.net/npm/onnxruntime-web@1.21.0/dist/';
ort.env.wasm.simd=true;
ort.env.wasm.numThreads=(typeof SharedArrayBuffer!=='undefined')
  ? Math.max(1,Math.min(4,navigator.hardwareConcurrency||2))
  : 1;

function post(type,extra={},transfer=[]){
  self.postMessage({type,...extra},transfer);
}

function resampleLinear(input,fromRate,toRate){
  if(fromRate===toRate)return input.slice();
  const ratio=fromRate/toRate;
  const len=Math.max(1,Math.round(input.length/ratio));
  const out=new Float32Array(len);
  for(let i=0;i<len;i++){
    const pos=i*ratio;
    const a=Math.floor(pos);
    const b=Math.min(input.length-1,a+1);
    const f=pos-a;
    out[i]=(input[a]||0)*(1-f)+(input[b]||0)*f;
  }
  return out;
}

function fft(reIn,imIn,N){
  let j=0;
  for(let i=0;i<N-1;i++){
    if(i<j){
      let tmp=reIn[i];reIn[i]=reIn[j];reIn[j]=tmp;
      tmp=imIn[i];imIn[i]=imIn[j];imIn[j]=tmp;
    }
    let m=N>>1;
    while(m>=1&&j>=m){j-=m;m>>=1}
    j+=m;
  }
  for(let size=2;size<=N;size*=2){
    const half=size/2;
    const step=-2*Math.PI/size;
    for(let i=0;i<N;i+=size){
      for(let k=0;k<half;k++){
        const angle=step*k;
        const wr=Math.cos(angle),wi=Math.sin(angle);
        const idx1=i+k,idx2=i+k+half;
        const tr=wr*reIn[idx2]-wi*imIn[idx2];
        const ti=wr*imIn[idx2]+wi*reIn[idx2];
        reIn[idx2]=reIn[idx1]-tr;
        imIn[idx2]=imIn[idx1]-ti;
        reIn[idx1]+=tr;
        imIn[idx1]+=ti;
      }
    }
  }
}

function ifft(reIn,imIn,N){
  for(let i=0;i<N;i++)imIn[i]=-imIn[i];
  fft(reIn,imIn,N);
  for(let i=0;i<N;i++){
    reIn[i]/=N;
    imIn[i]=-imIn[i]/N;
  }
}

function stft(signal,nFft,hopSize){
  const nFreqs=nFft/2+1;
  const nFrames=Math.floor((signal.length-nFft)/hopSize)+1;
  const realPart=new Float32Array(nFreqs*nFrames);
  const imagPart=new Float32Array(nFreqs*nFrames);
  const scale=1/Math.sqrt(nFft);
  const re=new Float32Array(nFft),im=new Float32Array(nFft);

  for(let t=0;t<nFrames;t++){
    const offset=t*hopSize;
    re.fill(0);im.fill(0);
    for(let n=0;n<nFft;n++)re[n]=signal[offset+n];
    fft(re,im,nFft);
    for(let k=0;k<nFreqs;k++){
      realPart[k*nFrames+t]=re[k]*scale;
      imagPart[k*nFrames+t]=im[k]*scale;
    }
  }
  return{real:realPart,imag:imagPart,nFreqs,nFrames};
}

function istft(real,imag,nFreqs,nFrames,nFft,hopSize){
  const outLen=(nFrames-1)*hopSize+nFft;
  const output=new Float32Array(outLen);
  const windowSum=new Float32Array(outLen);
  const scale=1/Math.sqrt(nFft);
  const re=new Float32Array(nFft),im=new Float32Array(nFft);

  for(let t=0;t<nFrames;t++){
    const offset=t*hopSize;
    re.fill(0);im.fill(0);
    for(let k=0;k<nFreqs;k++){
      re[k]=real[k*nFrames+t];
      im[k]=imag[k*nFrames+t];
    }
    for(let k=1;k<nFreqs-1;k++){
      re[nFft-k]=re[k];
      im[nFft-k]=-im[k];
    }
    ifft(re,im,nFft);
    for(let n=0;n<nFft;n++){
      output[offset+n]+=re[n]*scale*nFft;
      windowSum[offset+n]+=1;
    }
  }
  for(let i=0;i<outLen;i++){
    if(windowSum[i]>0)output[i]/=windowSum[i];
  }
  return output;
}

function audioToModelInput(leftStft,rightStft){
  const Fr=leftStft.nFreqs,T=leftStft.nFrames;
  const input=new Float32Array(4*Fr*T);
  input.set(leftStft.real,0);
  input.set(leftStft.imag,Fr*T);
  input.set(rightStft.real,2*Fr*T);
  input.set(rightStft.imag,3*Fr*T);
  return{data:input,dims:[1,4,Fr,T]};
}

function extractVocals(output,nFreqs,nFrames,padding){
  const Fr=nFreqs,T=nFrames;
  const base=VOCALS_INDEX*4*Fr*T;

  const left=istft(
    output.subarray(base,base+Fr*T),
    output.subarray(base+Fr*T,base+2*Fr*T),
    Fr,T,N_FFT,HOP_SIZE
  );
  const right=istft(
    output.subarray(base+2*Fr*T,base+3*Fr*T),
    output.subarray(base+3*Fr*T,base+4*Fr*T),
    Fr,T,N_FFT,HOP_SIZE
  );

  const trimLen=Math.max(0,left.length-padding);
  return{
    left:left.subarray(0,trimLen),
    right:right.subarray(0,trimLen)
  };
}

function normalizeVocals(input){
  let sum=0,peak=0;
  for(let i=0;i<input.length;i++){
    const v=input[i];
    sum+=v*v;
    peak=Math.max(peak,Math.abs(v));
  }
  const rms=Math.sqrt(sum/Math.max(1,input.length));
  const gain=Math.min(3.2,Math.max(.9,.15/Math.max(.008,rms)));

  const out=new Float32Array(input.length);
  const drive=1.15;
  const norm=Math.tanh(drive);
  let outPeak=0;

  for(let i=0;i<input.length;i++){
    const v=Math.tanh(input[i]*gain*drive)/norm;
    out[i]=v;
    outPeak=Math.max(outPeak,Math.abs(v));
  }

  if(outPeak>.98){
    const scale=.98/outPeak;
    for(let i=0;i<out.length;i++)out[i]*=scale;
  }
  return out;
}

async function getSession(){
  if(session)return session;

  post('lyrics-model-loading',{
    modelSizeMb:MODEL_SIZE_MB,
    threaded:typeof SharedArrayBuffer!=='undefined'
  });

  const options={
    executionProviders:['wasm'],
    graphOptimizationLevel:'all',
    enableCpuMemArena:true,
    enableMemPattern:true
  };

  session=await ort.InferenceSession.create(MODEL_URL,options);
  post('lyrics-model-ready',{
    modelSizeMb:MODEL_SIZE_MB,
    threaded:typeof SharedArrayBuffer!=='undefined'
  });
  return session;
}

async function isolateVocals(audio16k){
  const sess=await getSession();

  post('lyrics-preparing');
  const mono44=resampleLinear(audio16k,INPUT_SR,SR);
  const totalSamples=mono44.length;
  const totalChunks=Math.max(1,Math.ceil(totalSamples/CHUNK_SIZE));
  const output44=new Float32Array(totalSamples);

  for(let ci=0;ci<totalChunks;ci++){
    const start=ci*CHUNK_SIZE;
    const thisChunkSize=Math.min(CHUNK_SIZE,totalSamples-start);

    const padded=new Float32Array(TARGET_PADDED);
    padded.set(mono44.subarray(start,start+thisChunkSize));
    const padding=TARGET_PADDED-CHUNK_SIZE;

    const leftStft=stft(padded,N_FFT,HOP_SIZE);
    const rightStft=leftStft;
    const modelIn=audioToModelInput(leftStft,rightStft);
    const inputTensor=new ort.Tensor('float32',modelIn.data,modelIn.dims);

    post('lyrics-separation-progress',{
      chunk:ci+1,
      totalChunks,
      progress:Math.round((ci/totalChunks)*100)
    });

    const results=await sess.run({spectrogram:inputTensor});
    const separated=results.separated?.data;
    if(!separated)throw new Error('SCNET_NO_OUTPUT');

    const vocals=extractVocals(
      separated,
      leftStft.nFreqs,
      leftStft.nFrames,
      padding
    );

    const copyLen=Math.min(thisChunkSize,vocals.left.length,vocals.right.length);
    for(let i=0;i<copyLen;i++){
      output44[start+i]=(vocals.left[i]+vocals.right[i])*.5;
    }

    inputTensor.dispose?.();
    results.separated?.dispose?.();

    post('lyrics-separation-progress',{
      chunk:ci+1,
      totalChunks,
      progress:Math.round(((ci+1)/totalChunks)*100)
    });

    await new Promise(r=>setTimeout(r,0));
  }

  const cleaned44=normalizeVocals(output44);
  return resampleLinear(cleaned44,SR,INPUT_SR);
}

self.onmessage=async({data})=>{
  if(data?.type!=='separate-vocals')return;

  try{
    const input=new Float32Array(data.audio);
    const vocals16k=await isolateVocals(input);
    post('lyrics-result',{audio:vocals16k.buffer},[vocals16k.buffer]);
  }catch(error){
    post('lyrics-error',{
      message:error?.message||String(error),
      stack:error?.stack||''
    });
  }
};
