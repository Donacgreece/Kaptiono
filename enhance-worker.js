let pipelineFn = null;
let envRef = null;
let enhancer = null;

const ENHANCE_MODEL = 'onnx-community/Qwen2.5-0.5B-Instruct';

async function loadTransformers(){
  if(pipelineFn) return;
  postMessage({type:'enhance-worker-ready'});
  const mod = await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1/+esm');
  pipelineFn = mod.pipeline;
  envRef = mod.env;
  envRef.allowLocalModels = false;

  const browserCacheAvailable =
    self.isSecureContext === true &&
    typeof self.caches !== 'undefined';

  envRef.useBrowserCache = browserCacheAvailable;
  postMessage({type:'enhance-cache-status',enabled:browserCacheAvailable});
}

async function getEnhancer(){
  await loadTransformers();
  if(enhancer) return enhancer;

  const progress_callback = (x)=>{
    if(x?.status === 'progress'){
      postMessage({
        type:'enhance-model-progress',
        progress:Number(x.progress)||0
      });
    }
  };

  enhancer = await pipelineFn('text-generation', ENHANCE_MODEL, {
    device:'wasm',
    dtype:'q4',
    progress_callback,
  });

  postMessage({type:'enhance-model-ready'});
  return enhancer;
}

function normalizeToken(value){
  return String(value||'')
    .toLocaleLowerCase()
    .normalize('NFKC')
    .replace(/[^\p{L}\p{N}]+/gu,'');
}

function tokenize(text){
  return String(text||'').trim().split(/\s+/).filter(Boolean);
}

function extractText(output){
  const generated = output?.[0]?.generated_text;

  if(Array.isArray(generated)){
    for(let i=generated.length-1;i>=0;i--){
      const item=generated[i];
      if(item?.role==='assistant' && typeof item.content==='string'){
        return item.content.trim();
      }
    }
  }

  if(typeof generated==='string'){
    return generated.trim();
  }

  if(typeof output?.[0]?.text==='string'){
    return output[0].text.trim();
  }

  return '';
}

function cleanModelText(text){
  let value=String(text||'').trim();
  value=value.replace(/^```(?:text)?\s*/i,'').replace(/\s*```$/,'').trim();
  value=value.replace(/^(corrected transcript|corrected text|transcript|output)\s*:\s*/i,'').trim();
  if((value.startsWith('"')&&value.endsWith('"'))||(value.startsWith('“')&&value.endsWith('”'))){
    value=value.slice(1,-1).trim();
  }
  return value;
}

function editDistanceTokens(a,b){
  const n=a.length,m=b.length;
  const dp=Array.from({length:n+1},()=>new Array(m+1).fill(0));
  for(let i=0;i<=n;i++)dp[i][0]=i;
  for(let j=0;j<=m;j++)dp[0][j]=j;
  for(let i=1;i<=n;i++){
    for(let j=1;j<=m;j++){
      const same=normalizeToken(a[i-1])===normalizeToken(b[j-1]);
      dp[i][j]=Math.min(
        dp[i-1][j]+1,
        dp[i][j-1]+1,
        dp[i-1][j-1]+(same?0:1)
      );
    }
  }
  return dp[n][m];
}

function correctionLooksSafe(originalTokens, correctedTokens){
  if(!correctedTokens.length) return false;
  const ratio=correctedTokens.length/Math.max(1,originalTokens.length);
  if(ratio<0.70 || ratio>1.35) return false;

  const distance=editDistanceTokens(originalTokens,correctedTokens);
  const normalizedDistance=distance/Math.max(1,originalTokens.length,correctedTokens.length);

  // The feature is intentionally conservative. If the language model rewrites too
  // much of a chunk, keep the original Whisper words instead of risking hallucination.
  return normalizedDistance<=0.62;
}

function alignCorrectedWords(originalWords, correctedText){
  const correctedTokens=tokenize(correctedText);
  const originalTokens=originalWords.map(x=>x.word);

  if(!correctionLooksSafe(originalTokens,correctedTokens)){
    return originalWords.map(x=>({...x}));
  }

  const n=originalTokens.length,m=correctedTokens.length;
  const dp=Array.from({length:n+1},()=>new Array(m+1).fill(0));
  const op=Array.from({length:n+1},()=>new Array(m+1).fill(''));

  for(let i=1;i<=n;i++){dp[i][0]=i;op[i][0]='del'}
  for(let j=1;j<=m;j++){dp[0][j]=j;op[0][j]='ins'}

  for(let i=1;i<=n;i++){
    for(let j=1;j<=m;j++){
      const same=normalizeToken(originalTokens[i-1])===normalizeToken(correctedTokens[j-1]);
      const sub=dp[i-1][j-1]+(same?0:1);
      const del=dp[i-1][j]+1;
      const ins=dp[i][j-1]+1;
      const best=Math.min(sub,del,ins);
      dp[i][j]=best;
      op[i][j]=best===sub?'diag':best===del?'del':'ins';
    }
  }

  const mapping=new Array(m).fill(null);
  let i=n,j=m;
  while(i>0||j>0){
    const action=op[i][j];
    if(action==='diag'){
      mapping[j-1]=i-1;i--;j--;
    }else if(action==='del'){
      i--;
    }else{
      j--;
    }
  }

  const result=correctedTokens.map((word,idx)=>{
    const oi=mapping[idx];
    if(oi!==null){
      return {word,start:originalWords[oi].start,end:originalWords[oi].end};
    }
    return {word,start:null,end:null};
  });

  // Give inserted correction tokens a small interpolated timing window. Matching and
  // substituted tokens keep their original Whisper timing.
  let k=0;
  while(k<result.length){
    if(Number.isFinite(result[k].start)){k++;continue}
    const startIdx=k;
    while(k<result.length&&!Number.isFinite(result[k].start))k++;
    const endIdx=k-1;
    const left=startIdx>0?result[startIdx-1]:null;
    const right=k<result.length?result[k]:null;

    const chunkStart=Number.isFinite(left?.end)
      ? left.end
      : Number(originalWords[0]?.start||0);

    const chunkEnd=Number.isFinite(right?.start)
      ? right.start
      : Number(originalWords[originalWords.length-1]?.end||chunkStart+.4);

    const count=endIdx-startIdx+1;
    const available=Math.max(.06,chunkEnd-chunkStart);
    const step=available/count;

    for(let x=0;x<count;x++){
      result[startIdx+x].start=chunkStart+step*x;
      result[startIdx+x].end=chunkStart+step*(x+1);
    }
  }

  return result;
}

function buildChunks(words,maxWords=44){
  const chunks=[];
  let current=[];
  for(const word of words){
    current.push(word);
    const terminal=/[.!?…]$/.test(String(word.word||''));
    if(current.length>=maxWords || (terminal&&current.length>=18)){
      chunks.push(current);
      current=[];
    }
  }
  if(current.length)chunks.push(current);
  return chunks;
}

async function correctChunk(pipe,chunk,language){
  const original=chunk.map(x=>x.word).join(' ').replace(/\s+([,.!?;:])/g,'$1');
  const languageHint=language==='auto'
    ? 'Keep exactly the language used in the transcript.'
    : `Expected spoken language: ${language}. Keep that language and do not translate.`;

  const messages=[
    {
      role:'system',
      content:
        'You are a conservative speech-transcription correction engine. '+
        'Your job is to repair words that were likely misrecognized by ASR using sentence context. '+
        'Do not summarize. Do not add facts. Do not invent missing speech. Do not translate. '+
        'Keep the same meaning and order. Fix only likely recognition errors and necessary punctuation. '+
        'Return only the corrected transcript, with no explanation.'
    },
    {
      role:'user',
      content:`${languageHint}\n\nASR transcript:\n${original}`
    }
  ];

  const maxNew=Math.min(220,Math.max(64,chunk.length*4));
  const output=await pipe(messages,{
    max_new_tokens:maxNew,
    do_sample:false,
    temperature:0,
    repetition_penalty:1.04,
  });

  const corrected=cleanModelText(extractText(output));
  if(!corrected)return chunk.map(x=>({...x}));
  return alignCorrectedWords(chunk,corrected);
}

self.onmessage=async({data})=>{
  if(data.type!=='enhance')return;

  const originalWords=Array.isArray(data.words)?data.words:[];
  if(!originalWords.length){
    postMessage({type:'enhance-result',words:originalWords,changed:false});
    return;
  }

  try{
    const pipe=await getEnhancer();
    const chunks=buildChunks(originalWords);
    const result=[];
    let changed=false;

    for(let i=0;i<chunks.length;i++){
      const chunk=chunks[i];
      let enhanced;
      try{
        enhanced=await correctChunk(pipe,chunk,data.language||'auto');
      }catch(chunkError){
        console.warn('Enhanced correction chunk failed; preserving Whisper output',chunkError);
        enhanced=chunk.map(x=>({...x}));
      }

      if(
        enhanced.length!==chunk.length ||
        enhanced.some((w,j)=>String(w.word)!==String(chunk[j]?.word))
      ) changed=true;

      result.push(...enhanced);
      postMessage({
        type:'enhance-pass-progress',
        progress:((i+1)/chunks.length)*100
      });
    }

    postMessage({type:'enhance-result',words:result,changed});
  }catch(error){
    postMessage({
      type:'enhance-error',
      message:error?.message||String(error),
      stack:error?.stack||''
    });
  }
};
