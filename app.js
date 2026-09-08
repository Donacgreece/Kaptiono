const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

const i18n = {
  el:{localPrivate:"Τοπικό & ιδιωτικό",heroTitle:"Υπότιτλοι μέσα στον browser. Χωρίς upload.",heroText:"Διάλεξε ένα video. Η απομαγνητοφώνηση γίνεται στη συσκευή σου με Whisper και το αρχείο δεν ανεβαίνει σε server.",sameLanguage:"Auto language · ίδια γλώσσα captions",chooseVideo:"Διάλεξε video",dropHint:"ή σύρε MP4 / MOV / WebM εδώ",privacyTitle:"Το video μένει στη συσκευή σου.",privacyText:"Μόνο ο κώδικας της εφαρμογής και το AI model κατεβαίνουν από το internet.",livePreview:"Ζωντανή προεπισκόπηση",loadingVideo:"Φόρτωση video…",tabCaptions:"Captions",tabStyle:"Στυλ",tabExport:"Export",localAi:"LOCAL AI",generateTitle:"Δημιουργία captions",aiModel:"AI model",speechLanguage:"Γλώσσα ομιλίας",autoDetect:"Αυτόματη ανίχνευση",generateButton:"Δημιουργία captions",preparingAi:"Προετοιμασία AI…",noCaptions:"Δεν υπάρχουν captions ακόμη.",noCaptionsHint:"Πάτησε «Δημιουργία captions» για να ξεκινήσεις.",design:"DESIGN",styleTitle:"Στυλ υποτίτλων",fontSize:"Μέγεθος",position:"Θέση",textColor:"Χρώμα κειμένου",outlineColor:"Outline",uppercase:"UPPERCASE",uppercaseHint:"Χωρίς τόνους στα ελληνικά κεφαλαία",exportTitle:"Αποθήκευση αποτελέσματος",srtHint:"Υπότιτλοι με timestamps",txtHint:"Καθαρό transcript",webmHint:"Πειραματικό local video export",exporting:"Local export…",mp4Next:"MP4 browser export: επόμενο βήμα.",mp4NextHint:"Η πρώτη έκδοση δοκιμάζει πρώτα local AI, preview, SRT και WebM σε Chromium.",browserCheck:"BROWSER CHECK",systemTitle:"Τι θα χρησιμοποιήσει η συσκευή σου",fileStatus:"Αρχείο",footer:"Free · Local · Private · No watermark"},
  en:{localPrivate:"Local & private",heroTitle:"Captions in your browser. No upload.",heroText:"Choose a video. Speech recognition runs on your device with Whisper and your media is never uploaded to a processing server.",sameLanguage:"Auto language · same-language captions",chooseVideo:"Choose video",dropHint:"or drop MP4 / MOV / WebM here",privacyTitle:"Your video stays on your device.",privacyText:"Only the app code and AI model are downloaded from the internet.",livePreview:"Live preview",loadingVideo:"Loading video…",tabCaptions:"Captions",tabStyle:"Style",tabExport:"Export",localAi:"LOCAL AI",generateTitle:"Generate captions",aiModel:"AI model",speechLanguage:"Speech language",autoDetect:"Auto detect",generateButton:"Generate captions",preparingAi:"Preparing AI…",noCaptions:"No captions yet.",noCaptionsHint:"Press “Generate captions” to start.",design:"DESIGN",styleTitle:"Caption style",fontSize:"Size",position:"Position",textColor:"Text color",outlineColor:"Outline",uppercase:"UPPERCASE",uppercaseHint:"Greek uppercase removes tonos while keeping diaeresis",exportTitle:"Save result",srtHint:"Captions with timestamps",txtHint:"Plain transcript",webmHint:"Experimental local video export",exporting:"Local export…",mp4Next:"Browser MP4 export: next step.",mp4NextHint:"The first build validates local AI, preview, SRT and WebM in Chromium first.",browserCheck:"BROWSER CHECK",systemTitle:"What your device will use",fileStatus:"File",footer:"Free · Local · Private · No watermark"}
};

const presets = {
  viral:{title:"Viral Bold",sample:"THIS changes it",text:"#FFFFFF",outline:"#000000",size:58,pos:76,weight:900,box:false,upper:true},
  yellow:{title:"Creator Yellow",sample:"DON’T skip this",text:"#FFD84D",outline:"#000000",size:56,pos:78,weight:900,box:false,upper:false},
  clean:{title:"Clean",sample:"Clean subtitle",text:"#FFFFFF",outline:"#000000",size:46,pos:84,weight:750,box:false,upper:false,clean:true},
  karaoke:{title:"Karaoke",sample:"word by word",text:"#FFFFFF",outline:"#000000",size:52,pos:78,weight:900,box:false,upper:false,karaoke:true},
  podcast:{title:"Podcast",sample:"Clear conversation",text:"#FFFFFF",outline:"#000000",size:45,pos:82,weight:750,box:true,upper:false},
  gaming:{title:"Gaming",sample:"WHAT happened?",text:"#B8FF31",outline:"#000000",size:58,pos:75,weight:900,box:false,upper:true},
  news:{title:"News",sample:"The story in brief",text:"#FFFFFF",outline:"#000000",size:44,pos:86,weight:800,box:true,upper:false},
  minimal:{title:"Minimal",sample:"Less is more",text:"#FFFFFF",outline:"#111111",size:40,pos:84,weight:650,box:false,upper:false,clean:true},
};

const state = {file:null,url:null,captions:[],words:[],lang:'el',preset:'yellow',style:{...presets.yellow},worker:null,workerReady:false,startedAt:0,exporting:false};

function setLang(lang){state.lang=lang;document.documentElement.lang=lang;$$('[data-lang]').forEach(b=>b.classList.toggle('active',b.dataset.lang===lang));$$('[data-i18n]').forEach(el=>{const key=el.dataset.i18n;const value=i18n[lang][key];if(value)el.textContent=value});localStorage.setItem('kaptiono-lang',lang)}
$$('[data-lang]').forEach(b=>b.addEventListener('click',()=>setLang(b.dataset.lang)));
setLang(localStorage.getItem('kaptiono-lang')||'el');

function formatTime(sec){sec=Math.max(0,Number(sec)||0);const h=Math.floor(sec/3600),m=Math.floor((sec%3600)/60),s=Math.floor(sec%60).toString().padStart(2,'0');return h?`${h}:${String(m).padStart(2,'0')}:${s}`:`${m}:${s}`}
function bytes(n){if(n<1024*1024)return `${(n/1024).toFixed(0)} KB`;return `${(n/1024/1024).toFixed(1)} MB`}
function greekUpperNoTonos(v){return (v||'').normalize('NFD').toLocaleUpperCase('el-GR').replace(/[\u0300\u0301\u0342]/g,'').normalize('NFC')}
function captionText(v){return state.style.upper?greekUpperNoTonos(v):v}

const video=$('#video'),fileInput=$('#fileInput'),dropzone=$('#dropzone'),workspace=$('#workspace');
dropzone.addEventListener('click',()=>fileInput.click());
fileInput.addEventListener('change',()=>fileInput.files?.[0]&&loadFile(fileInput.files[0]));
['dragenter','dragover'].forEach(e=>dropzone.addEventListener(e,ev=>{ev.preventDefault();dropzone.classList.add('drag')}));
['dragleave','drop'].forEach(e=>dropzone.addEventListener(e,ev=>{ev.preventDefault();dropzone.classList.remove('drag')}));
dropzone.addEventListener('drop',e=>{const f=e.dataTransfer.files?.[0];if(f)loadFile(f)});

function loadFile(file){
  if(!file.type.startsWith('video/')&&!/\.(mp4|mov|webm|m4v)$/i.test(file.name)){alert(state.lang==='el'?'Διάλεξε αρχείο video.':'Choose a video file.');return}
  if(state.url)URL.revokeObjectURL(state.url);state.file=file;state.url=URL.createObjectURL(file);state.captions=[];state.words=[];
  $('#videoLoading').classList.remove('hidden');video.src=state.url;video.load();workspace.classList.remove('hidden');$('#startCard').classList.add('hidden');
  $('#systemFile').textContent=`${file.name} · ${bytes(file.size)}`;$('#emptyCaptions').classList.remove('hidden');$('#captionEditor').classList.add('hidden');updateExportButtons();
  workspace.scrollIntoView({behavior:'smooth',block:'start'});
}
video.addEventListener('loadedmetadata',()=>{ $('#videoLoading').classList.add('hidden');$('#videoMeta').textContent=`${video.videoWidth}×${video.videoHeight} · ${formatTime(video.duration)} · ${state.file?bytes(state.file.size):''}`;$('#duration').textContent=formatTime(video.duration);$('#seek').max=video.duration||1;applyStageAspect();});
video.addEventListener('loadeddata',()=>$('#videoLoading').classList.add('hidden'));
video.addEventListener('timeupdate',()=>{$('#currentTime').textContent=formatTime(video.currentTime);$('#seek').value=video.currentTime;updateCaptionOverlay()});
video.addEventListener('play',()=>$('#playBtn').textContent='Ⅱ');video.addEventListener('pause',()=>$('#playBtn').textContent='▶');
$('#playBtn').addEventListener('click',()=>video.paused?video.play():video.pause());$('#seek').addEventListener('input',e=>video.currentTime=Number(e.target.value));$('#muteBtn').addEventListener('click',()=>{video.muted=!video.muted;$('#muteBtn').textContent=video.muted?'×':'♪'});
function applyStageAspect(){const stage=$('#videoStage');if(!video.videoWidth)return;stage.style.aspectRatio=`${video.videoWidth}/${video.videoHeight}`}

$$('.tabs button').forEach(btn=>btn.addEventListener('click',()=>{$$('.tabs button').forEach(b=>b.classList.toggle('active',b===btn));$$('.tab-panel').forEach(p=>p.classList.toggle('active',p.dataset.panel===btn.dataset.tab))}));

function renderPresets(){const grid=$('#presetGrid');grid.innerHTML='';Object.entries(presets).forEach(([key,p])=>{const b=document.createElement('button');b.className=`preset-btn ${state.preset===key?'active':''}`;b.type='button';b.innerHTML=`<span class="preset-preview" style="color:${p.text};font-weight:${p.weight};${p.box?'background:#273027;':''}">${p.sample}</span><span><strong>${p.title}</strong><small>${key==='minimal'?'Subtle & clean':key==='yellow'?'High attention':key==='viral'?'Reels · Shorts':key==='clean'?'Long-form':key==='karaoke'?'Word highlight':key==='podcast'?'Lower third':key==='gaming'?'Punchy':key==='news'?'Structured':''}</small></span>`;b.addEventListener('click',()=>selectPreset(key));grid.appendChild(b)})}
function selectPreset(key){state.preset=key;state.style={...presets[key]};$('#fontSize').value=state.style.size;$('#position').value=state.style.pos;$('#textColor').value=state.style.text;$('#outlineColor').value=state.style.outline;$('#uppercase').checked=state.style.upper;syncStyleControls();renderPresets();updateCaptionOverlay()}
function syncStyleControls(){$('#fontSizeValue').textContent=state.style.size;$('#positionValue').textContent=`${state.style.pos}%`}
renderPresets();syncStyleControls();
$('#fontSize').addEventListener('input',e=>{state.style.size=Number(e.target.value);syncStyleControls();updateCaptionOverlay()});$('#position').addEventListener('input',e=>{state.style.pos=Number(e.target.value);syncStyleControls();updateCaptionOverlay()});$('#textColor').addEventListener('input',e=>{state.style.text=e.target.value;updateCaptionOverlay()});$('#outlineColor').addEventListener('input',e=>{state.style.outline=e.target.value;updateCaptionOverlay()});$('#uppercase').addEventListener('change',e=>{state.style.upper=e.target.checked;updateCaptionOverlay()});

function updateCaptionOverlay(){
  const overlay=$('#captionOverlay');const seg=state.captions.find(c=>video.currentTime>=c.start&&video.currentTime<=c.end);if(!seg){overlay.textContent='';return}
  overlay.style.top=`${state.style.pos}%`;overlay.style.color=state.style.text;overlay.style.fontSize=`clamp(18px,4vw,${state.style.size}px)`;overlay.style.fontWeight=state.style.weight;overlay.style.textShadow=state.style.clean?'0 2px 5px rgba(0,0,0,.75)':`-2px -2px 0 ${state.style.outline},2px -2px 0 ${state.style.outline},-2px 2px 0 ${state.style.outline},2px 2px 0 ${state.style.outline},0 3px 7px rgba(0,0,0,.6)`;overlay.classList.toggle('box',!!state.style.box);overlay.classList.toggle('clean',!!state.style.clean);
  if(state.style.karaoke&&seg.words?.length){overlay.innerHTML=seg.words.map(w=>`<span style="color:${video.currentTime>=w.start&&video.currentTime<=w.end?'#FFD84D':state.style.text}">${escapeHtml(captionText(w.word))}</span>`).join(' ')}else overlay.textContent=captionText(seg.text);
}
function escapeHtml(s){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}

function createWorker(){if(state.worker)return state.worker;state.worker=new Worker('./whisper-worker.js',{type:'module'});state.worker.onmessage=onWorkerMessage;state.worker.onerror=e=>failProgress(e.message||'Worker error');return state.worker}
$('#generateBtn').addEventListener('click',generateCaptions);
async function generateCaptions(){
  if(!state.file)return;const btn=$('#generateBtn');btn.disabled=true;state.startedAt=performance.now();showProgress('audio',0,state.lang==='el'?'Αποκωδικοποίηση ήχου…':'Decoding audio…');
  try{const audio=await decodeTo16kMono(state.file);showProgress('model',1,state.lang==='el'?'Φόρτωση Whisper model…':'Loading Whisper model…');const worker=createWorker();const device='gpu' in navigator?'webgpu':'wasm';$('#engineBadge').textContent=device.toUpperCase();worker.postMessage({type:'transcribe',audio:audio.buffer,duration:video.duration,device,model:$('#modelSelect').value,language:$('#languageSelect').value},[audio.buffer]);}catch(e){failProgress(e.message||String(e));btn.disabled=false}
}
async function decodeTo16kMono(file){
  const array=await file.arrayBuffer();const AC=window.AudioContext||window.webkitAudioContext;if(!AC)throw new Error('AudioContext is not supported by this browser.');const ac=new AC();let decoded;try{decoded=await ac.decodeAudioData(array.slice(0))}catch{await ac.close();throw new Error(state.lang==='el'?'Ο browser δεν μπόρεσε να διαβάσει το audio track αυτού του video. Δοκίμασε Chrome/Edge ή MP4 με AAC.':'The browser could not decode this video audio track. Try Chrome/Edge or MP4 with AAC.')}
  const mono=new Float32Array(decoded.length);for(let ch=0;ch<decoded.numberOfChannels;ch++){const data=decoded.getChannelData(ch);for(let i=0;i<data.length;i++)mono[i]+=data[i]/decoded.numberOfChannels}
  const offline=new OfflineAudioContext(1,Math.ceil(decoded.duration*16000),16000);const buffer=offline.createBuffer(1,mono.length,decoded.sampleRate);buffer.copyToChannel(mono,0);const source=offline.createBufferSource();source.buffer=buffer;source.connect(offline.destination);source.start();const rendered=await offline.startRendering();const out=rendered.getChannelData(0).slice();await ac.close();return out;
}
function onWorkerMessage({data}){
  if(data.type==='model-progress'){const p=Math.round(data.progress||0);showProgress('model',Math.min(48,p*.48),data.file||'AI model')}
  if(data.type==='device'){ $('#engineBadge').textContent=data.device.toUpperCase();$('#systemAi').textContent=data.device==='webgpu'?'WebGPU + Whisper':'WASM + Whisper';}
  if(data.type==='transcribe-progress'){const p=50+(data.progress||0)*.5;showProgress('transcribe',p,`${data.current}/${data.total} · ${formatTime(data.seconds||0)} / ${formatTime(video.duration)}`)}
  if(data.type==='result'){state.words=data.words||[];state.captions=buildCaptions(state.words,video.duration);renderCaptionEditor();$('#captionCountBadge').textContent=`${state.captions.length} captions`;showProgress('done',100,state.lang==='el'?'Ολοκληρώθηκε':'Done');setTimeout(()=>$('#progressBox').classList.add('hidden'),900);$('#generateBtn').disabled=false;updateExportButtons();updateCaptionOverlay();}
  if(data.type==='error'){failProgress(data.message);$('#generateBtn').disabled=false}
}
function showProgress(stage,pct,detail){const box=$('#progressBox');box.classList.remove('hidden');$('#progressBar').style.width=`${Math.max(0,Math.min(100,pct))}%`;$('#progressPercent').textContent=`${Math.round(pct)}%`;$('#progressDetail').textContent=detail;$('#progressTitle').textContent=stage==='audio'?(state.lang==='el'?'Προετοιμασία audio':'Preparing audio'):stage==='model'?(state.lang==='el'?'Φόρτωση AI model':'Loading AI model'):stage==='transcribe'?(state.lang==='el'?'Απομαγνητοφώνηση':'Transcribing'):(state.lang==='el'?'Έτοιμο':'Done');updateElapsed()}
function updateElapsed(){if(!state.startedAt)return;$('#elapsed').textContent=formatTime((performance.now()-state.startedAt)/1000);if(!$('#progressBox').classList.contains('hidden'))requestAnimationFrame(()=>setTimeout(updateElapsed,500))}
function failProgress(msg){showProgress('error',0,msg);$('#progressTitle').textContent=state.lang==='el'?'Αποτυχία επεξεργασίας':'Processing failed';$('#progressBar').style.background='var(--danger)'}

function normalizeWord(w){return String(w||'').trim()}
function buildCaptions(words,duration){
  if(!words.length)return[];const result=[];let current=[];const flush=()=>{if(!current.length)return;result.push({start:current[0].start,end:current[current.length-1].end,text:current.map(x=>x.word).join(' ').replace(/\s+([,.!?;:])/g,'$1'),words:[...current]});current=[]};
  words.forEach((w,i)=>{if(!w.word)return;const next=words[i+1];if(current.length){const proposed=[...current,w];const chars=proposed.map(x=>x.word).join(' ').length;const dur=w.end-current[0].start;if(current.length>=4||chars>34||dur>1.65)flush()}current.push(w);const gap=next?Math.max(0,next.start-w.end):999;const dur=current[current.length-1].end-current[0].start;if(/[.!?…]$/.test(w.word)||gap>.34||current.length>=4||dur>1.35||!next)flush()});return result;
}
function renderCaptionEditor(){const editor=$('#captionEditor');editor.innerHTML='';$('#emptyCaptions').classList.toggle('hidden',state.captions.length>0);editor.classList.toggle('hidden',!state.captions.length);state.captions.forEach((c,i)=>{const row=document.createElement('div');row.className='caption-row';row.innerHTML=`<span class="caption-time">${formatTime(c.start)}<br>${formatTime(c.end)}</span><textarea rows="2"></textarea>`;const ta=row.querySelector('textarea');ta.value=c.text;ta.addEventListener('input',()=>{c.text=ta.value;updateCaptionOverlay()});editor.appendChild(row)})}
function updateExportButtons(){const ok=state.captions.length>0;$('#srtBtn').disabled=!ok;$('#txtBtn').disabled=!ok;$('#webmBtn').disabled=!ok||!canWebmExport()}
function srtTime(sec){const ms=Math.round(sec*1000),h=Math.floor(ms/3600000),m=Math.floor(ms%3600000/60000),s=Math.floor(ms%60000/1000),r=ms%1000;return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')},${String(r).padStart(3,'0')}`}
function downloadBlob(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1000)}
$('#srtBtn').addEventListener('click',()=>{const s=state.captions.map((c,i)=>`${i+1}\n${srtTime(c.start)} --> ${srtTime(c.end)}\n${captionText(c.text)}\n`).join('\n');downloadBlob(new Blob([s],{type:'text/plain;charset=utf-8'}),baseName()+'.srt')});
$('#txtBtn').addEventListener('click',()=>downloadBlob(new Blob([state.captions.map(c=>c.text).join(' ')],{type:'text/plain;charset=utf-8'}),baseName()+'.txt'));
function baseName(){return (state.file?.name||'kaptiono').replace(/\.[^.]+$/,'')+'-kaptiono'}

function canWebmExport(){return !!window.MediaRecorder&&!!HTMLCanvasElement.prototype.captureStream&&!!window.AudioContext}
$('#webmBtn').addEventListener('click',exportWebm);
async function exportWebm(){
  if(state.exporting||!state.file||!state.captions.length)return;state.exporting=true;$('#webmBtn').disabled=true;$('#exportProgress').classList.remove('hidden');try{
    const src=document.createElement('video');src.src=state.url;src.preload='auto';src.playsInline=true;await new Promise((res,rej)=>{src.onloadedmetadata=res;src.onerror=()=>rej(new Error('Video load failed'))});
    const maxDim=1080;const scale=Math.min(1,maxDim/Math.max(src.videoWidth,src.videoHeight));const w=Math.max(2,Math.round(src.videoWidth*scale/2)*2),h=Math.max(2,Math.round(src.videoHeight*scale/2)*2);const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;const ctx=canvas.getContext('2d');
    const stream=canvas.captureStream(30);const ac=new AudioContext();await ac.resume();const node=ac.createMediaElementSource(src);const dest=ac.createMediaStreamDestination();node.connect(dest);dest.stream.getAudioTracks().forEach(t=>stream.addTrack(t));
    const types=['video/webm;codecs=vp9,opus','video/webm;codecs=vp8,opus','video/webm'];const mime=types.find(t=>MediaRecorder.isTypeSupported(t))||'';const rec=new MediaRecorder(stream,mime?{mimeType:mime,videoBitsPerSecond:6_000_000}:undefined);const blobs=[];rec.ondataavailable=e=>e.data.size&&blobs.push(e.data);const stopped=new Promise(r=>rec.onstop=r);rec.start(1000);
    const draw=()=>{ctx.drawImage(src,0,0,w,h);drawCanvasCaption(ctx,w,h,src.currentTime);const pct=Math.min(100,src.duration?src.currentTime/src.duration*100:0);$('#exportBar').style.width=`${pct}%`;$('#exportDetail').textContent=`${Math.round(pct)}%`;if(!src.paused&&!src.ended)requestAnimationFrame(draw)};src.currentTime=0;await src.play();draw();await new Promise(r=>src.onended=r);rec.stop();await stopped;await ac.close();downloadBlob(new Blob(blobs,{type:mime||'video/webm'}),baseName()+'.webm');$('#exportBar').style.width='100%';$('#exportDetail').textContent='100%';setTimeout(()=>$('#exportProgress').classList.add('hidden'),1000);
  }catch(e){alert(`${state.lang==='el'?'Το πειραματικό WebM export απέτυχε':'Experimental WebM export failed'}: ${e.message||e}`)}finally{state.exporting=false;updateExportButtons()}
}
function drawCanvasCaption(ctx,w,h,t){const seg=state.captions.find(c=>t>=c.start&&t<=c.end);if(!seg)return;const text=captionText(seg.text);const font=Math.max(22,Math.round(state.style.size*(w/576)*.72));ctx.save();ctx.font=`${state.style.weight} ${font}px Arial, sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';const maxWidth=w*.84;const lines=wrapCanvas(ctx,text,maxWidth,2);const lineH=font*1.1,y=h*(state.style.pos/100)-(lines.length-1)*lineH/2;if(state.style.box){const widest=Math.max(...lines.map(x=>ctx.measureText(x).width));ctx.fillStyle='rgba(0,0,0,.72)';ctx.fillRect(w/2-widest/2-font*.25,y-lineH*.62,widest+font*.5,lineH*lines.length+font*.18)}ctx.lineJoin='round';ctx.strokeStyle=state.style.outline;ctx.lineWidth=Math.max(2,font*.09);ctx.fillStyle=state.style.text;lines.forEach((line,i)=>{ctx.strokeText(line,w/2,y+i*lineH,maxWidth);ctx.fillText(line,w/2,y+i*lineH,maxWidth)});ctx.restore()}
function wrapCanvas(ctx,text,maxWidth,maxLines){const words=text.split(/\s+/);let lines=[],line='';for(const word of words){const test=line?`${line} ${word}`:word;if(ctx.measureText(test).width<=maxWidth||!line)line=test;else{lines.push(line);line=word;if(lines.length===maxLines-1)break}}if(line&&lines.length<maxLines)lines.push(line);if(lines.join(' ').split(/\s+/).length<words.length)lines[lines.length-1]+='…';return lines}

function detectCapabilities(){const webgpu=!!navigator.gpu;$('#webgpuBadge').textContent=webgpu?'WebGPU · available':'WebGPU · unavailable';$('#systemAi').textContent=webgpu?'WebGPU preferred · WASM fallback':'WASM fallback';$('#systemAudio').textContent=(window.AudioContext||window.webkitAudioContext)?'Web Audio · ready':'Unsupported';$('#systemExport').textContent=canWebmExport()?'WebM · experimental':'SRT/TXT only';$('#wasmBadge').textContent='WASM · available'}
detectCapabilities();
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
