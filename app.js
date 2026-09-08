import { Input, ALL_FORMATS, BlobSource, AudioSampleSink } from 'https://cdn.jsdelivr.net/npm/mediabunny@1.55.7/+esm';

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
function trackEvent(name, params={}){
  try{ if(typeof window.gtag==='function') window.gtag('event', name, params); }catch{}
}
function trackVirtualPage(path, title){
  try{ if(typeof window.gtag==='function') window.gtag('event','page_view',{page_path:path,page_title:title}); }catch{}
}
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
const coarsePointer = window.matchMedia?.('(pointer: coarse)').matches ?? false;
if(coarsePointer){
  ['gesturestart','gesturechange','gestureend'].forEach(name=>document.addEventListener(name,e=>e.preventDefault(),{passive:false}));
  let lastTouchEnd=0;
  document.addEventListener('touchend',e=>{const now=Date.now();if(now-lastTouchEnd<=300)e.preventDefault();lastTouchEnd=now},{passive:false});
}

const i18n = {
  el:{localPrivate:'Τοπικό & ιδιωτικό',heroTitle:'Υπότιτλοι μέσα στον browser. Χωρίς upload.',heroText:'Διάλεξε ένα video. Η απομαγνητοφώνηση γίνεται στη συσκευή σου και το αρχείο δεν ανεβαίνει σε server.',chooseVideo:'Διάλεξε video',dropHint:'ή σύρε MP4 / MOV / WebM εδώ',privacyTitle:'Το video μένει στη συσκευή σου.',privacyText:'Μόνο ο κώδικας της εφαρμογής και το AI model κατεβαίνουν από το internet.',liveChanges:'LIVE PREVIEW',changeVideo:'Άλλο video',livePreview:'Ζωντανή προεπισκόπηση',previewHint:'Οι αλλαγές εφαρμόζονται αμέσως.',loadingVideo:'Φόρτωση video…',tabCaptions:'Κείμενο',tabDesign:'Σχεδίαση',tabExport:'Export',generateTitle:'Δημιουργία captions',qualityHint:'Για ποιότητα κοντά στο desktop χρησιμοποίησε Small και δήλωσε Ελληνικά.',aiModel:'AI model',speechLanguage:'Γλώσσα ομιλίας',autoDetect:'Αυτόματη ανίχνευση',languageHint:'Η ρητή επιλογή γλώσσας βελτιώνει πολύ τα σύντομα clips.',generateButton:'Δημιουργία captions',noCaptions:'Δεν υπάρχουν captions ακόμη.',noCaptionsHint:'Πάτησε «Δημιουργία captions» για να ξεκινήσεις.',styleTitle:'Στυλ υποτίτλων',designHint:'Ίδια λογική ρυθμίσεων με το desktop Caption Studio.',typography:'Τυπογραφία',typographySub:'Γραμματοσειρά, μέγεθος και έμφαση',colorContrast:'Χρώμα & αντίθεση',colorSub:'Κείμενο, highlight και outline',positionFrame:'Θέση & κάδρο',positionSub:'Τοποθέτηση, πλάτος και στοίχιση',flow:'Ροή',flowSub:'Λέξεις ανά caption και ταχύτητα',motion:'Κίνηση & έμφαση',motionSub:'Animation και ενεργή λέξη',effects:'Εφέ & φόντο',effectsSub:'Σκιά, box και padding',fontFamily:'Γραμματοσειρά',fontSize:'Μέγεθος',letterSpacing:'Απόσταση γραμμάτων',scale:'Κλίμακα',text:'Κείμενο',background:'Φόντο',textOpacity:'Αδιαφάνεια κειμένου',quickPosition:'Γρήγορη θέση',horizontal:'Οριζόντια',vertical:'Κάθετα',captionWidth:'Πλάτος caption',rotation:'Περιστροφή',alignment:'Στοίχιση',left:'Αριστερά',center:'Κέντρο',right:'Δεξιά',maxWords:'Λέξεις ανά caption',maxLines:'Μέγιστες γραμμές',captionSpeed:'Ταχύτητα',fast:'Γρήγορη',balanced:'Ισορροπημένη',relaxed:'Χαλαρή',none:'Χωρίς',animationStrength:'Ένταση animation',wordHighlight:'Highlight ανά λέξη',shadow:'Σκιά',boxOpacity:'Αδιαφάνεια box',boxPadding:'Padding box',exportTitle:'Αποθήκευση αποτελέσματος',exportHint:'Το αρχείο δημιουργείται τοπικά στον browser.',downloadVideo:'Λήψη video με υπότιτλους',downloadVideoHint:'Δημιουργείται τοπικά στη συσκευή σου.',burnedCaptions:'BURNED-IN CAPTIONS',videoExportLocal:'Το video δημιουργείται τοπικά.',videoExportLocalHint:'Η διαθέσιμη μορφή εξαρτάται από τον browser σου.',srtHint:'Υπότιτλοι με timestamps',txtHint:'Καθαρό transcript',webmHint:'Burned captions, Chromium',exporting:'Local export…',mp4Next:'MP4 export βρίσκεται ακόμη σε ανάπτυξη.',mp4NextHint:'Πρώτα σταθεροποιούμε transcription και iPhone compatibility.',supportBack:'Πίσω στο Kaptiono',supportTitle:'Γιατί υπάρχει το Kaptiono',supportIntro:'Το Kaptiono δημιουργήθηκε για creators που θέλουν γρήγορους, καθαρούς υπότιτλους χωρίς upload των video τους, λογαριασμούς, credits ή watermark.',supportPrivateTitle:'Ιδιωτικό από σχεδιασμό',supportPrivateText:'Η επεξεργασία γίνεται τοπικά στη συσκευή. Το video και το κείμενο των captions δεν αποστέλλονται στο Google Analytics. Χρησιμοποιούμε Google Analytics μόνο για μέτρηση επισκεψιμότητας και βασικών ανώνυμων ενεργειών χρήσης.',supportFreeTitle:'Δωρεάν για creators',supportFreeText:'Το Kaptiono χτίζεται χωρίς credits, watermark και υποχρεωτική συνδρομή για τις βασικές λειτουργίες δημιουργίας captions.',supportBuiltTitle:'Χτίζεται σαν πραγματικό εργαλείο',supportBuiltText:'Desktop, web και mobile σχεδιάζονται με κοινή λογική ώστε το workflow να παραμένει απλό, γρήγορο και οικείο.',supportRoadmapTitle:'Τι θέλουμε να ακολουθήσει',supportRoadmapText:'Οι παρακάτω κατευθύνσεις είναι στόχοι ανάπτυξης και θα προχωρούν μόνο όταν είναι αρκετά σταθερές.',roadmapAi:'Καλύτερη και ταχύτερη local AI απομαγνητοφώνηση',roadmapExport:'Πιο αξιόπιστο MP4 export απευθείας στον browser',roadmapMobile:'Καλύτερη PWA εμπειρία σε Android και iPhone',roadmapStudio:'Περισσότερα caption styles, editing εργαλεία και creator workflows',donateTitle:'Θέλεις να βοηθήσεις την ανάπτυξη;',donateText:'Η δωρεά είναι απολύτως προαιρετική. Βοηθά να συνεχιστεί η ανάπτυξη, οι δοκιμές σε περισσότερες συσκευές και η προσθήκη νέων features.',donateButton:'Donate μέσω PayPal',seoWhyTitle:'Local AI captions με privacy first.',seoWhyText:'Το Kaptiono είναι για creators που θέλουν δημιουργία υποτίτλων μέσα στον browser χωρίς να στέλνουν τα video τους σε cloud processing server.',seoWhatTitle:'Απομαγνητοφώνηση, σχεδίαση και export.',seoWhatText:'Διάλεξε τοπικά ένα video, δημιούργησε captions με Whisper, ρύθμισε το στυλ και κάνε export για short-form ή long-form περιεχόμενο.',seoWhoTitle:'Για creators και editors.',seoWhoText:'Το Kaptiono ταιριάζει σε TikTok, Reels, Shorts, YouTube και creator workflows που χρειάζονται γρήγορους υπότιτλους, καθαρό editor και export χωρίς watermark.',howTitle:'Απλό workflow υποτίτλων μέσα στον browser.',howText:'Διάλεξε video, τρέξε local AI transcription, ρύθμισε το στυλ και κάνε export. Η εμπειρία έχει σχεδιαστεί ώστε να είναι γρήγορη και app-like σε desktop και mobile.',howStep1Title:'Διάλεξε video',howStep1Text:'Άνοιξε MP4, MOV ή WebM απευθείας από τη συσκευή σου.',howStep2Title:'Δημιούργησε captions',howStep2Text:'Χρησιμοποίησε Whisper για υψηλής ποιότητας subtitle generation στον browser.',howStep3Title:'Σχεδίασε και κάνε export',howStep3Text:'Ρύθμισε το look, δες live preview και εξήγαγε καθαρό creator-ready αποτέλεσμα.',faqTitle:'Συχνές ερωτήσεις.',faqUploadQ:'Ανεβάζει το Kaptiono το video σε server;',faqUploadA:'Όχι. Το Kaptiono έχει σχεδιαστεί γύρω από local processing ώστε το video να μένει στη συσκευή.',faqSocialQ:'Μπορεί να φτιάξει υπότιτλους για social media;',faqSocialA:'Ναι. Το workflow είναι σχεδιασμένο για TikTok, Instagram Reels, YouTube Shorts και άλλα video formats.',faqDesktopQ:'Είναι μόνο για desktop;',faqDesktopA:'Όχι. Η web εφαρμογή έχει σχεδιαστεί και για mobile, ενώ η desktop έκδοση μπορεί να προσφέρει ισχυρότερο editing workflow.',faqDiffQ:'Τι κάνει το Kaptiono διαφορετικό;',faqDiffA:'Εστιάζει σε local AI subtitles, privacy-first επεξεργασία, no-watermark output και καθαρό editor.',installTitle:'Εγκατάσταση Kaptiono',installText:'Χρησιμοποίησέ το σαν κανονική εφαρμογή στο κινητό σου.',installAction:'Download',iosInstallTitle:'Βάλε το Kaptiono στην Αρχική οθόνη',iosStep1Title:'Άνοιξε το Share',iosStep1Text:'Στο Safari πάτησε το εικονίδιο Κοινοποίησης.',iosStep2Title:'Add to Home Screen',iosStep2Text:'Διάλεξε «Προσθήκη στην οθόνη Αφετηρίας».',iosStep3Title:'Πάτησε Add',iosStep3Text:'Το Kaptiono θα εμφανιστεί σαν εφαρμογή.',iosDone:'Έγινε',updateTitle:'Νέα έκδοση διαθέσιμη',updateText:'Το Kaptiono μπορεί να ενημερωθεί τώρα.',updateAction:'Ενημέρωση',systemTitle:'Μηχανή επεξεργασίας',fileStatus:'Αρχείο'},
  en:{localPrivate:'Local & private',heroTitle:'Captions in your browser. No upload.',heroText:'Choose a video. Speech recognition runs on your device and your file is never uploaded to a processing server.',chooseVideo:'Choose video',dropHint:'or drop MP4 / MOV / WebM here',privacyTitle:'Your video stays on your device.',privacyText:'Only the app code and AI model are downloaded from the internet.',liveChanges:'LIVE PREVIEW',changeVideo:'Change video',livePreview:'Live preview',previewHint:'Changes are applied immediately.',loadingVideo:'Loading video…',tabCaptions:'Text',tabDesign:'Design',tabExport:'Export',generateTitle:'Generate captions',qualityHint:'For desktop-like quality use Small and set the spoken language explicitly.',aiModel:'AI model',speechLanguage:'Speech language',autoDetect:'Auto detect',languageHint:'Explicit language selection significantly improves short clips.',generateButton:'Generate captions',noCaptions:'No captions yet.',noCaptionsHint:'Press “Generate captions” to start.',styleTitle:'Caption style',designHint:'The same control logic as the desktop Caption Studio.',typography:'Typography',typographySub:'Font, size and emphasis',colorContrast:'Color & contrast',colorSub:'Text, highlight and outline',positionFrame:'Position & frame',positionSub:'Placement, width and alignment',flow:'Timing & flow',flowSub:'Words per caption and pacing',motion:'Motion & emphasis',motionSub:'Animation and active word',effects:'Effects & background',effectsSub:'Shadow, box and padding',fontFamily:'Font family',fontSize:'Font size',letterSpacing:'Letter spacing',scale:'Scale',text:'Text',background:'Background',textOpacity:'Text opacity',quickPosition:'Quick position',horizontal:'Horizontal',vertical:'Vertical',captionWidth:'Caption width',rotation:'Rotation',alignment:'Alignment',left:'Left',center:'Center',right:'Right',maxWords:'Words per caption',maxLines:'Maximum lines',captionSpeed:'Caption speed',fast:'Fast',balanced:'Balanced',relaxed:'Relaxed',none:'None',animationStrength:'Animation strength',wordHighlight:'Word-by-word highlight',shadow:'Shadow',boxOpacity:'Box opacity',boxPadding:'Box padding',exportTitle:'Save result',exportHint:'The file is created locally in your browser.',downloadVideo:'Download video with captions',downloadVideoHint:'Created locally on your device.',burnedCaptions:'BURNED-IN CAPTIONS',videoExportLocal:'The video is created locally.',videoExportLocalHint:'Available format depends on your browser.',srtHint:'Captions with timestamps',txtHint:'Plain transcript',webmHint:'Burned captions, Chromium',exporting:'Local export…',mp4Next:'MP4 export is still in development.',mp4NextHint:'We are stabilizing transcription and iPhone compatibility first.',supportBack:'Back to Kaptiono',supportTitle:'Why Kaptiono exists',supportIntro:'Kaptiono was created for creators who want fast, clean captions without uploading their videos, creating accounts, buying credits, or adding a watermark.',supportPrivateTitle:'Private by design',supportPrivateText:'Processing runs locally on the device. Video and caption text are not sent to Google Analytics. We use Google Analytics only for traffic measurement and basic anonymous usage events.',supportFreeTitle:'Free for creators',supportFreeText:'Kaptiono is being built without credits, watermarks, or a mandatory subscription for the core caption-creation workflow.',supportBuiltTitle:'Built as a real creator tool',supportBuiltText:'Desktop, web, and mobile are designed around the same workflow so the product stays simple, fast, and familiar.',supportRoadmapTitle:'What we want to build next',supportRoadmapText:'These are development directions, not promises. They will ship only when they are stable enough.',roadmapAi:'Better and faster local AI transcription',roadmapExport:'More reliable browser-native MP4 export',roadmapMobile:'A stronger PWA experience on Android and iPhone',roadmapStudio:'More caption styles, editing tools, and creator workflows',donateTitle:'Want to support development?',donateText:'Donations are completely optional. They help fund continued development, testing on more devices, and new features.',donateButton:'Donate via PayPal',seoWhyTitle:'Local AI captions with privacy first.',seoWhyText:'Kaptiono is for creators who want browser-based subtitle generation without sending private video files to a cloud processing server.',seoWhatTitle:'Transcribe, style and export.',seoWhatText:'Choose a video locally, generate captions with Whisper, adjust the style and export results for short-form or long-form content.',seoWhoTitle:'Built for creators and editors.',seoWhoText:'Kaptiono fits TikTok, Reels, Shorts, YouTube and creator workflows that need fast captions, a clean editor and no-watermark output.',howTitle:'A simple subtitle workflow in the browser.',howText:'Choose a video, run local AI transcription, fine-tune the style and export the result. The experience is designed to feel fast and app-like on desktop and mobile.',howStep1Title:'Choose video',howStep1Text:'Open an MP4, MOV or WebM directly from your device.',howStep2Title:'Generate captions',howStep2Text:'Use Whisper for high-quality subtitle generation in the browser.',howStep3Title:'Style and export',howStep3Text:'Adjust the look, preview the result and export clean creator-ready output.',faqTitle:'Frequently asked questions.',faqUploadQ:'Does Kaptiono upload the video to a server?',faqUploadA:'No. Kaptiono is designed around local processing so the video can stay on the device.',faqSocialQ:'Can Kaptiono create subtitles for social media?',faqSocialA:'Yes. The workflow is designed for TikTok, Instagram Reels, YouTube Shorts and other video formats.',faqDesktopQ:'Is Kaptiono only for desktop?',faqDesktopA:'No. The web app is designed for mobile too, while the desktop edition can provide a stronger editing workflow.',faqDiffQ:'What makes Kaptiono different?',faqDiffA:'It focuses on local AI subtitles, privacy-first processing, no-watermark output and a clean editor.',installTitle:'Install Kaptiono',installText:'Use Kaptiono like a normal app on your phone.',installAction:'Download',iosInstallTitle:'Add Kaptiono to your Home Screen',iosStep1Title:'Open Share',iosStep1Text:'In Safari, tap the Share icon.',iosStep2Title:'Add to Home Screen',iosStep2Text:'Choose “Add to Home Screen”.',iosStep3Title:'Tap Add',iosStep3Text:'Kaptiono will appear like a normal app.',iosDone:'Done',updateTitle:'New version available',updateText:'Kaptiono can update now.',updateAction:'Update',systemTitle:'Processing engine',fileStatus:'File'}
};

const fonts=['Arial','Arial Black','Bahnschrift','Calibri','Cambria','Candara','Century Gothic','Comic Sans MS','Consolas','Corbel','Courier New','Franklin Gothic Medium','Garamond','Georgia','Impact','Lucida Sans Unicode','Palatino Linotype','Segoe UI','Tahoma','Times New Roman','Trebuchet MS','Verdana'];
const base={font_family:'Arial',font_size:52,text_color:'#FFFFFF',text_opacity:100,highlight_color:'#FFD84D',outline_color:'#000000',outline_width:4,shadow:1,background:'none',background_color:'#000000',background_opacity:65,box_padding:8,bold:true,italic:false,uppercase:false,letter_spacing:0,horizontal_align:'center',horizontal_position:50,vertical_position:78,caption_width:84,rotation:0,scale:100,max_words:4,max_lines:2,caption_speed:'fast',animation:'pop',animation_strength:42,fade_in_ms:70,fade_out_ms:90,word_highlight:false};
const presets={
  viral:{...base,preset:'viral',title:'Viral Bold',subtitle:'TikTok · Reels · Shorts',sample:'ΑΥΤΟ αλλάζει το video'},
  yellow:{...base,preset:'yellow',title:'Creator Yellow',subtitle:'High attention',sample:'ΜΗΝ το προσπεράσεις',text_color:'#FFD84D',highlight_color:'#FFFFFF'},
  clean:{...base,preset:'clean',title:'Clean',subtitle:'YouTube · long-form',sample:'Καθαρός υπότιτλος',font_family:'Segoe UI',font_size:44,outline_width:2,shadow:0,animation:'fade',animation_strength:24,vertical_position:84,max_words:5,caption_speed:'balanced',caption_width:88},
  karaoke:{...base,preset:'karaoke',title:'Karaoke',subtitle:'Word highlight',sample:'λέξη προς λέξη',font_size:50,animation:'none',word_highlight:true},
  podcast:{...base,preset:'podcast',title:'Podcast',subtitle:'Readable lower third',sample:'Μια καθαρή συζήτηση',font_family:'Segoe UI',font_size:46,background:'box',background_opacity:68,box_padding:10,outline_width:0,shadow:0,vertical_position:82,max_words:6,caption_speed:'balanced',animation:'fade',caption_width:90},
  gaming:{...base,preset:'gaming',title:'Gaming',subtitle:'Punchy & bold',sample:'ΤΙ έγινε τώρα;',font_family:'Arial Black',font_size:54,highlight_color:'#7CFF6B',outline_width:5,uppercase:true,vertical_position:76},
  news:{...base,preset:'news',title:'News',subtitle:'Structured & calm',sample:'Η είδηση σε λίγα λόγια',font_size:43,background:'box',background_opacity:78,box_padding:9,outline_width:0,shadow:0,vertical_position:86,max_words:6,caption_speed:'balanced',animation:'fade',animation_strength:18,caption_width:92},
  minimal:{...base,preset:'minimal',title:'Minimal',subtitle:'Subtle & modern',sample:'Απλά και καθαρά',font_family:'Segoe UI',font_size:42,bold:false,outline_width:1,shadow:1,text_color:'#FFFFFF',highlight_color:'#DDF4A1',vertical_position:86,max_words:5,caption_speed:'balanced',animation:'fade',animation_strength:14,caption_width:88,scale:96}
};

const state={file:null,url:null,sourceWords:[],captions:[],uiLang:localStorage.getItem('kaptiono-lang')||'el',style:{...presets.yellow},preset:'yellow',worker:null,startedAt:0,currentCaptionKey:'',exporting:false,watchdog:null,lastWorkerActivity:0};
const video=$('#video');

function setLang(lang){state.uiLang=lang;document.documentElement.lang=lang;$$('[data-lang]').forEach(b=>b.classList.toggle('active',b.dataset.lang===lang));$$('[data-i18n]').forEach(el=>{const v=i18n[lang]?.[el.dataset.i18n];if(v)el.textContent=v});localStorage.setItem('kaptiono-lang',lang);if(!state.file&&lang==='en')$('#languageSelect').value='english';}
$$('[data-lang]').forEach(b=>b.addEventListener('click',()=>setLang(b.dataset.lang)));setLang(state.uiLang);

function formatTime(sec){sec=Math.max(0,Number(sec)||0);const h=Math.floor(sec/3600),m=Math.floor(sec%3600/60),s=Math.floor(sec%60).toString().padStart(2,'0');return h?`${h}:${String(m).padStart(2,'0')}:${s}`:`${m}:${s}`}
function bytes(n){if(!Number.isFinite(n))return '—';if(n<1024*1024)return `${(n/1024).toFixed(0)} KB`;return `${(n/1024/1024).toFixed(1)} MB`}
function greekUppercaseNoTonos(value){return (value||'').normalize('NFD').toLocaleUpperCase('el-GR').replace(/[\u0300\u0301\u0342]/g,'').normalize('NFC')}
function captionCase(value){return state.style.uppercase?greekUppercaseNoTonos(value):value}
function escapeHtml(s){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function isGreekUI(){return state.uiLang==='el'}

// File loading
const fileInput=$('#fileInput'),dropzone=$('#dropzone');
dropzone.addEventListener('click',()=>fileInput.click());
fileInput.addEventListener('change',()=>fileInput.files?.[0]&&loadFile(fileInput.files[0]));
['dragenter','dragover'].forEach(name=>dropzone.addEventListener(name,e=>{e.preventDefault();dropzone.classList.add('drag')}));
['dragleave','drop'].forEach(name=>dropzone.addEventListener(name,e=>{e.preventDefault();dropzone.classList.remove('drag')}));
dropzone.addEventListener('drop',e=>{const f=e.dataTransfer.files?.[0];if(f)loadFile(f)});
$('#changeVideoBtn').addEventListener('click',()=>fileInput.click());
function showPage(page){
  try{video.pause()}catch{}
  $('#startCard').classList.toggle('hidden',page!=='home');
  $('#workspace').classList.toggle('hidden',page!=='workspace');
  $('#supportPage').classList.toggle('hidden',page!=='support');
  window.scrollTo({top:0,behavior:'smooth'});
}
function goHome(){showPage('home');trackVirtualPage('/','Kaptiono · Home')}
function goSupport(){showPage('support');trackVirtualPage('/support','Kaptiono · Support')}
$('#brandHome').addEventListener('click',goHome);
$('#supportNav').addEventListener('click',goSupport);
$('#supportBackBtn').addEventListener('click',goHome);

function loadFile(file){
  trackEvent('video_selected',{file_type:(file.type||'unknown').split('/').pop()||'unknown'});
  if(!file.type.startsWith('video/')&&!/\.(mp4|mov|m4v|webm)$/i.test(file.name)){alert(isGreekUI()?'Διάλεξε αρχείο video.':'Choose a video file.');return}
  if(state.url)URL.revokeObjectURL(state.url);state.file=file;state.url=URL.createObjectURL(file);state.sourceWords=[];state.captions=[];state.currentCaptionKey='';
  video.src=state.url;video.load();$('#videoLoading').classList.remove('hidden');$('#startCard').classList.add('hidden');$('#supportPage').classList.add('hidden');$('#workspace').classList.remove('hidden');$('#systemFile').textContent=`${file.name} · ${bytes(file.size)}`;$('#captionEditor').classList.add('hidden');$('#emptyCaptions').classList.remove('hidden');$('#captionCountBadge').textContent='0 captions';updateExportButtons();
  const defaultModel='onnx-community/whisper-small_timestamped';$('#modelSelect').value=defaultModel;$('#languageSelect').value=state.uiLang==='el'?'greek':'english';updateModelHint();updateCompatibilityNote();
  $('#workspace').scrollIntoView({behavior:'smooth',block:'start'});
}
video.addEventListener('loadedmetadata',()=>{const res=`${video.videoWidth}×${video.videoHeight}`;$('#videoResolution').textContent=res;$('#duration').textContent=formatTime(video.duration);$('#seek').max=video.duration||1;$('#projectMeta').textContent=`${state.file?.name||''} · ${res} · ${formatTime(video.duration)}`;$('#videoLoading').classList.add('hidden');fitVideoStage();});
video.addEventListener('loadeddata',()=>$('#videoLoading').classList.add('hidden'));
video.addEventListener('timeupdate',()=>{$('#currentTime').textContent=formatTime(video.currentTime);$('#seek').value=video.currentTime;updateCaptionOverlay()});
video.addEventListener('play',()=>$('#playBtn').textContent='Ⅱ');video.addEventListener('pause',()=>$('#playBtn').textContent='▶');
$('#playBtn').addEventListener('click',async()=>{try{video.paused?await video.play():video.pause()}catch{}});$('#seek').addEventListener('input',e=>video.currentTime=Number(e.target.value));$('#muteBtn').addEventListener('click',()=>{video.muted=!video.muted;$('#muteBtn').textContent=video.muted?'×':'♪'});window.addEventListener('resize',()=>{fitVideoStage();updateCaptionOverlay()});
function fitVideoStage(){if(!video.videoWidth)return;const stage=$('#videoStage');stage.style.aspectRatio=`${video.videoWidth}/${video.videoHeight}`;const shell=$('#videoShell');const maxH=Math.max(250,Math.min(window.innerHeight-300,700));const maxW=shell.clientWidth-24;const ratio=video.videoWidth/video.videoHeight;let w=Math.min(maxW,maxH*ratio),h=w/ratio;if(h>maxH){h=maxH;w=h*ratio}stage.style.width=`${Math.max(180,w)}px`;stage.style.height=`${Math.max(160,h)}px`;video.style.width='100%';video.style.height='100%';}

// Main and inspector tabs
$$('[data-main-tab]').forEach(b=>b.addEventListener('click',()=>{$$('[data-main-tab]').forEach(x=>x.classList.toggle('active',x===b));$$('[data-main-panel]').forEach(p=>p.classList.toggle('active',p.dataset.mainPanel===b.dataset.mainTab))}));
$$('[data-settings-tab]').forEach(b=>b.addEventListener('click',()=>{$$('[data-settings-tab]').forEach(x=>x.classList.toggle('active',x===b));$$('[data-settings-panel]').forEach(p=>p.classList.toggle('active',p.dataset.settingsPanel===b.dataset.settingsTab))}));

// Presets and controls
function renderPresets(){const grid=$('#presetGrid');grid.innerHTML='';Object.entries(presets).forEach(([key,p])=>{const b=document.createElement('button');b.type='button';b.className=`preset-btn ${state.preset===key?'active':''}`;const box=p.background==='box'?`background:${p.background_color};`:'';b.innerHTML=`<span class="preset-preview" style="color:${p.text_color};font-family:${p.font_family};font-weight:${p.bold?900:600};${box}">${escapeHtml(p.sample)}</span><span><strong>${p.title}</strong><small>${p.subtitle}</small></span>`;b.addEventListener('click',()=>selectPreset(key));grid.appendChild(b)})}
function selectPreset(key){state.preset=key;const p=presets[key];state.style={...p};syncControlsFromStyle();renderPresets();reflowCaptions();updateCaptionOverlay()}
function patchStyle(patch,reflow=false){Object.assign(state.style,patch);if(reflow)reflowCaptions();updateCaptionOverlay();}

fonts.forEach(f=>{const o=document.createElement('option');o.value=f;o.textContent=f;$('#fontFamily').appendChild(o)});
const bindings=[
  ['fontFamily','font_family','value',false],['fontSize','font_size','number',false],['letterSpacing','letter_spacing','number',false],['scale','scale','number',false],['textColor','text_color','value',false],['highlightColor','highlight_color','value',false],['outlineColor','outline_color','value',false],['backgroundColor','background_color','value',false],['textOpacity','text_opacity','number',false],['outlineWidth','outline_width','number',false],['horizontalPosition','horizontal_position','number',false],['verticalPosition','vertical_position','number',false],['captionWidth','caption_width','number',true],['rotation','rotation','number',false],['maxWords','max_words','number',true],['maxLines','max_lines','number',true],['captionSpeed','caption_speed','value',true],['animation','animation','value',false],['animationStrength','animation_strength','number',false],['fadeIn','fade_in_ms','number',false],['fadeOut','fade_out_ms','number',false],['shadow','shadow','number',false],['backgroundOpacity','background_opacity','number',false],['boxPadding','box_padding','number',false]
];
bindings.forEach(([id,key,type,reflow])=>{const el=$('#'+id);const event=el.tagName==='SELECT'?'change':'input';el.addEventListener(event,e=>{const value=type==='number'?Number(e.target.value):e.target.value;patchStyle({[key]:value},reflow);syncValueLabels()})});
[['bold','bold'],['italic','italic'],['uppercase','uppercase'],['wordHighlight','word_highlight']].forEach(([id,key])=>$('#'+id).addEventListener('change',e=>patchStyle({[key]:e.target.checked},false)));
$$('#alignment button').forEach(b=>b.addEventListener('click',()=>{state.style.horizontal_align=b.dataset.align;$$('#alignment button').forEach(x=>x.classList.toggle('active',x===b));updateCaptionOverlay()}));
$$('#backgroundMode button').forEach(b=>b.addEventListener('click',()=>{state.style.background=b.dataset.bg;$$('#backgroundMode button').forEach(x=>x.classList.toggle('active',x===b));updateCaptionOverlay()}));

function renderPositionGrid(){const points=[[20,20],[50,20],[80,20],[20,50],[50,50],[80,50],[20,80],[50,80],[80,80]];const grid=$('#positionGrid');grid.innerHTML='';points.forEach(([x,y])=>{const b=document.createElement('button');b.type='button';b.style.setProperty('--x',`${x}%`);b.style.setProperty('--y',`${y}%`);b.addEventListener('click',()=>{state.style.horizontal_position=x;state.style.vertical_position=y;syncControlsFromStyle();updateCaptionOverlay()});grid.appendChild(b)})}
renderPositionGrid();

function syncControlsFromStyle(){const s=state.style;bindings.forEach(([id,key])=>{const el=$('#'+id);if(el)el.value=s[key]});$('#bold').checked=s.bold;$('#italic').checked=s.italic;$('#uppercase').checked=s.uppercase;$('#wordHighlight').checked=s.word_highlight;$$('#alignment button').forEach(b=>b.classList.toggle('active',b.dataset.align===s.horizontal_align));$$('#backgroundMode button').forEach(b=>b.classList.toggle('active',b.dataset.bg===s.background));syncValueLabels();syncPositionGrid();syncColors()}
function syncValueLabels(){const s=state.style;$('#fontSizeValue').textContent=s.font_size;$('#letterSpacingValue').textContent=s.letter_spacing;$('#scaleValue').textContent=`${s.scale}%`;$('#textOpacityValue').textContent=`${s.text_opacity}%`;$('#outlineWidthValue').textContent=`${s.outline_width}px`;$('#horizontalPositionValue').textContent=`${s.horizontal_position}%`;$('#verticalPositionValue').textContent=`${s.vertical_position}%`;$('#captionWidthValue').textContent=`${s.caption_width}%`;$('#rotationValue').textContent=`${s.rotation}°`;$('#maxWordsValue').textContent=s.max_words;$('#animationStrengthValue').textContent=`${s.animation_strength}%`;$('#fadeInValue').textContent=`${s.fade_in_ms}ms`;$('#fadeOutValue').textContent=`${s.fade_out_ms}ms`;$('#shadowValue').textContent=s.shadow;$('#backgroundOpacityValue').textContent=`${s.background_opacity}%`;$('#boxPaddingValue').textContent=`${s.box_padding}px`;syncColors()}
function syncColors(){[['textColor','textColorHex','text_color'],['highlightColor','highlightColorHex','highlight_color'],['outlineColor','outlineColorHex','outline_color'],['backgroundColor','backgroundColorHex','background_color']].forEach(([id,hex,key])=>{if($('#'+id).value!==state.style[key])$('#'+id).value=state.style[key];$('#'+hex).textContent=state.style[key]})}
function syncPositionGrid(){const pts=$$('#positionGrid button');const coords=[[20,20],[50,20],[80,20],[20,50],[50,50],[80,50],[20,80],[50,80],[80,80]];let best=0,dist=Infinity;coords.forEach(([x,y],i)=>{const d=Math.abs(x-state.style.horizontal_position)+Math.abs(y-state.style.vertical_position);if(d<dist){dist=d;best=i}});pts.forEach((b,i)=>b.classList.toggle('active',i===best))}
renderPresets();syncControlsFromStyle();

// Caption reflow mirrors the desktop rules
function speedValues(speed){if(speed==='relaxed')return{maxDuration:2.15,targetDuration:1.75,pause:.48};if(speed==='balanced')return{maxDuration:1.8,targetDuration:1.45,pause:.38};return{maxDuration:1.55,targetDuration:1.18,pause:.30}}
const hardBreak=/[.!?;:…]+["'»”)]*$/;const softBreak=/[,·]+["'»”)]*$/;
function previewLineLimit(){const w=video.videoWidth||576,h=video.videoHeight||1024,s=state.style;const font=Math.max(24,s.font_size||52),baseChars=h>=w?18:30,sizeFactor=Math.max(.55,Math.min(1.7,52/font)),widthFactor=Math.max(.30,Math.min(1,s.caption_width/84)),scaleFactor=Math.max(.55,Math.min(1.5,100/Math.max(50,s.scale)));return Math.max(8,Math.min(52,Math.round(baseChars*sizeFactor*widthFactor*scaleFactor)))}
function labelsFit(labels,maxLineChars,maxLines){const total=labels.join(' ').length;if(maxLines===1)return total<=maxLineChars||labels.length===1;return total<=maxLineChars*2+1}
function reflowCaptions(){const words=state.sourceWords.filter(w=>w.word?.trim()&&Number.isFinite(w.start)&&Number.isFinite(w.end)&&w.end>w.start);if(!words.length){state.captions=[];renderCaptionEditor();return}const s=state.style,lim=speedValues(s.caption_speed),maxLineChars=previewLineLimit(),result=[];let current=[];const flush=()=>{if(!current.length)return;result.push({start:current[0].start,end:current[current.length-1].end,text:current.map(w=>w.word.trim()).join(' ').replace(/\s+([,.!?;:])/g,'$1'),words:[...current]});current=[]};for(let i=0;i<words.length;i++){const w=words[i];if(current.length){const proposed=current.concat(w),duration=w.end-current[0].start;if(current.length>=s.max_words||duration>lim.maxDuration||!labelsFit(proposed.map(x=>x.word.trim()),maxLineChars,s.max_lines))flush()}current.push(w);const next=words[i+1],gap=next?Math.max(0,next.start-w.end):999,duration=current[current.length-1].end-current[0].start;if(hardBreak.test(w.word)||gap>=lim.pause||current.length>=s.max_words||(duration>=lim.targetDuration&&current.length>=Math.min(3,s.max_words))||(softBreak.test(w.word)&&current.length>=Math.min(3,s.max_words))||!next)flush()}state.captions=result;renderCaptionEditor();$('#captionCountBadge').textContent=`${result.length} captions`;updateExportButtons();}
function splitLines(text,maxLines){const words=(text||'').trim().split(/\s+/).filter(Boolean);if(maxLines===1||words.length<=2)return [words.join(' ')];const maxChars=previewLineLimit();if(words.join(' ').length<=maxChars)return [words.join(' ')];let best=1,score=Infinity;for(let i=1;i<words.length;i++){const a=words.slice(0,i).join(' ').length,b=words.slice(i).join(' ').length,v=Math.max(0,a-maxChars)*1000+Math.max(0,b-maxChars)*1000+Math.max(a,b)*10+Math.abs(a-b);if(v<score){score=v;best=i}}return[words.slice(0,best).join(' '),words.slice(best).join(' ')]}

function updateCaptionOverlay(){const overlay=$('#captionOverlay');const index=state.captions.findIndex(c=>video.currentTime>=c.start&&video.currentTime<=c.end);if(index<0){overlay.innerHTML='';state.currentCaptionKey='';return}const seg=state.captions[index],s=state.style,stage=$('#videoStage');const stageW=stage.clientWidth||576;const fontPx=Math.max(14,Math.min(120,s.font_size*(stageW/576)*(s.scale/100)));overlay.style.left=`${s.horizontal_position}%`;overlay.style.top=`${s.vertical_position}%`;overlay.style.width=`${s.caption_width}%`;overlay.style.textAlign=s.horizontal_align;overlay.style.fontFamily=`${s.font_family}, sans-serif`;overlay.style.fontSize=`${fontPx}px`;overlay.style.fontWeight=s.bold?'900':'500';overlay.style.fontStyle=s.italic?'italic':'normal';overlay.style.letterSpacing=`${s.letter_spacing*(stageW/576)}px`;overlay.style.color=s.text_color;overlay.style.opacity=String(s.text_opacity/100);overlay.style.transform=`translate(-50%,-50%) rotate(${s.rotation}deg)`;overlay.style.webkitTextStroke=`${Math.max(0,s.outline_width*(stageW/576))}px ${s.outline_color}`;overlay.style.textShadow=s.shadow?`0 ${Math.max(1,s.shadow)}px ${Math.max(2,s.shadow*2)}px rgba(0,0,0,.75)`:'none';const lines=splitLines(captionCase(seg.text),s.max_lines);let html='';if(s.word_highlight&&seg.words?.length){const wordHtml=seg.words.map(w=>{const active=video.currentTime>=w.start&&video.currentTime<=w.end;return `<span class="word" style="color:${active?s.highlight_color:s.text_color}">${escapeHtml(captionCase(w.word))}</span>`}).join('');html=s.background==='box'?`<span class="caption-box" style="background:${hexAlpha(s.background_color,s.background_opacity)}">${wordHtml}</span>`:wordHtml}else{html=lines.map(line=>s.background==='box'?`<span class="caption-box" style="background:${hexAlpha(s.background_color,s.background_opacity)}">${escapeHtml(line)}</span>`:escapeHtml(line)).join('<br>')}overlay.innerHTML=html;const key=`${index}:${s.animation}`;if(key!==state.currentCaptionKey){state.currentCaptionKey=key;overlay.animate?.(animationKeyframes(s.animation,s.animation_strength),{duration:s.animation==='fade'?Math.max(80,s.fade_in_ms):180,easing:'cubic-bezier(.2,.75,.2,1)'}).catch?.(()=>{})}}
function animationKeyframes(type,strength){if(type==='fade')return[{opacity:0},{opacity:1}];if(type==='pop'){const scale=.88+(100-strength)/100*.08;return[{opacity:.2,transform:`translate(-50%,-50%) scale(${scale}) rotate(${state.style.rotation}deg)`},{opacity:1,transform:`translate(-50%,-50%) scale(1) rotate(${state.style.rotation}deg)`}]}return[{opacity:1},{opacity:1}]}
function hexAlpha(hex,pct){const h=String(hex).replace('#','');if(h.length!==6)return `rgba(0,0,0,${pct/100})`;const r=parseInt(h.slice(0,2),16),g=parseInt(h.slice(2,4),16),b=parseInt(h.slice(4,6),16);return `rgba(${r},${g},${b},${pct/100})`}

function renderCaptionEditor(){const editor=$('#captionEditor');editor.innerHTML='';$('#emptyCaptions').classList.toggle('hidden',state.captions.length>0);editor.classList.toggle('hidden',!state.captions.length);state.captions.forEach((c,i)=>{const row=document.createElement('div');row.className='caption-row';row.innerHTML=`<span class="caption-time">${formatTime(c.start)}<br>${formatTime(c.end)}</span><textarea rows="2"></textarea>`;const ta=row.querySelector('textarea');ta.value=c.text;ta.addEventListener('input',()=>{c.text=ta.value;updateCaptionOverlay()});editor.appendChild(row)})}

// High-quality browser transcription
$('#modelSelect').addEventListener('change',updateModelHint);function updateModelHint(){const v=$('#modelSelect').value;const hint=$('#modelHint');if(v.includes('small'))hint.textContent=isGreekUI()?'Προεπιλεγμένο High Quality. Δίνει την καλύτερη ποιότητα captions, αλλά το πρώτο download είναι μεγαλύτερο.':'Default High Quality mode. Best caption quality, with a larger first model download.';else if(v.includes('base'))hint.textContent=isGreekUI()?'Προτεινόμενο Stable mode. Καλή ποιότητα ελληνικών με πολύ μικρότερο download από το Small.':'Recommended Stable mode. Good quality with a much smaller download than Small.';else hint.textContent=isGreekUI()?'Γρήγορη επιλογή για έλεγχο ότι η συσκευή ολοκληρώνει κανονικά το local AI.':'Fast option to verify that local AI completes correctly on this device.'}
function updateCompatibilityNote(){const note=$('#compatNote');if(!window.isSecureContext){note.classList.remove('hidden');note.textContent=isGreekUI()?'Το HTTPS δεν έχει ενεργοποιηθεί ακόμη. Το Kaptiono συνεχίζει χωρίς browser cache, οπότε το AI model μπορεί να ξανακατέβει σε επόμενη χρήση. Τα captions λειτουργούν κανονικά.':'HTTPS is not active yet. Kaptiono will continue without browser cache, so the AI model may download again on a future session. Caption generation still works.'}else if(isIOS){note.classList.remove('hidden');note.textContent=isGreekUI()?'iPhone: χρησιμοποιούμε WebCodecs/Mediabunny για το audio αντί για το παλιό decodeAudioData. Αν το Small είναι βαρύ, επίλεξε Base.':'iPhone: audio is extracted through WebCodecs/Mediabunny instead of the old decodeAudioData path. If Small is too heavy, choose Base.'}else note.classList.add('hidden');$('#systemDevice').textContent=isIOS?'iPhone / iPad':isSafari?'Safari':'Desktop browser'}
updateCompatibilityNote();updateModelHint();

function destroyWorker(){if(state.watchdog){clearInterval(state.watchdog);state.watchdog=null}if(state.worker){state.worker.terminate();state.worker=null}}
function touchWorker(){state.lastWorkerActivity=Date.now()}
function createWorker(){destroyWorker();state.worker=new Worker('./whisper-worker.js?v=0.4.0',{type:'module'});state.worker.onmessage=e=>{touchWorker();onWorkerMessage(e)};state.worker.onerror=e=>{destroyWorker();failProgress(e.message||'Worker error');$('#generateBtn').disabled=false};touchWorker();return state.worker}
function startWatchdog(){if(state.watchdog)clearInterval(state.watchdog);state.watchdog=setInterval(()=>{if(!state.worker)return;const silent=Date.now()-state.lastWorkerActivity;if(silent>90000){destroyWorker();failProgress(isGreekUI()?'Το AI δεν απάντησε για 90 δευτερόλεπτα. Η διαδικασία σταμάτησε αντί να μείνει κολλημένη. Δοκίμασε Base ή Tiny και ξανά.':'The AI did not respond for 90 seconds. Processing was stopped instead of hanging indefinitely. Try Base or Tiny and retry.');$('#generateBtn').disabled=false}},5000)}
$('#generateBtn').addEventListener('click',generateCaptions);
async function generateCaptions(){if(!state.file)return;trackEvent('generate_captions',{model:$('#modelSelect').value.split('/').pop(),language:$('#languageSelect').value});$('#generateBtn').disabled=true;state.startedAt=performance.now();showProgress('audio',2,isGreekUI()?'Εξαγωγή audio τοπικά…':'Extracting audio locally…');try{const audio=await extractAudio16k(state.file,p=>showProgress('audio',Math.min(28,2+p*.26),isGreekUI()?`Αποκωδικοποίηση audio ${Math.round(p)}%`:`Decoding audio ${Math.round(p)}%`));showProgress('model',30,isGreekUI()?'Εκκίνηση Stable AI engine…':'Starting Stable AI engine…');$('#engineBadge').textContent='WASM';$('#systemAi').textContent='WASM + Whisper';const worker=createWorker();startWatchdog();worker.postMessage({type:'transcribe',audio:audio.buffer,duration:video.duration,device:'wasm',model:$('#modelSelect').value,language:$('#languageSelect').value},[audio.buffer])}catch(e){destroyWorker();failProgress(friendlyError(e));$('#generateBtn').disabled=false}}

async function extractAudio16k(file,onProgress=()=>{}){
  // Primary path: demux + decode through Mediabunny/WebCodecs. This is specifically
  // used to avoid Safari/iPhone decodeAudioData failures on video containers.
  try{
    const input=new Input({formats:ALL_FORMATS,source:new BlobSource(file)});const duration=await input.computeDuration();const track=await input.getPrimaryAudioTrack();if(!track)throw new Error('NO_AUDIO_TRACK');if(!(await track.canDecode()))throw new Error('AUDIO_CODEC_NOT_DECODABLE');const sink=new AudioSampleSink(track),parts=[];let total=0,lastP=0;for await(const sample of sink.samples(0,duration)){const ab=sample.toAudioBuffer();const mono=mixToMono(ab);const rs=resampleLinear(mono,ab.sampleRate,16000);parts.push(rs);total+=rs.length;const t=Number(sample.timestamp||0)+Number(sample.duration||0),p=duration?Math.min(100,t/duration*100):lastP;lastP=p;onProgress(p);sample.close?.()}input.dispose?.();onProgress(100);return concatFloat32(parts,total)
  }catch(primary){
    console.warn('Mediabunny audio extraction failed, trying Web Audio fallback',primary);
    const AC=window.AudioContext||window.webkitAudioContext;if(!AC)throw primary;const ac=new AC();try{const arr=await file.arrayBuffer();const decoded=await ac.decodeAudioData(arr.slice(0));const mono=mixToMono(decoded),out=resampleLinear(mono,decoded.sampleRate,16000);onProgress(100);await ac.close();return out}catch(fallback){await ac.close().catch(()=>{});const err=new Error(`AUDIO_EXTRACTION_FAILED: ${fallback?.message||primary?.message||''}`);err.cause=primary;throw err}
  }
}
function mixToMono(buffer){const n=buffer.length,out=new Float32Array(n),chs=buffer.numberOfChannels||1;for(let c=0;c<chs;c++){const data=buffer.getChannelData(c);for(let i=0;i<n;i++)out[i]+=data[i]/chs}return out}
function resampleLinear(input,fromRate,toRate){if(fromRate===toRate)return input.slice();const ratio=fromRate/toRate,len=Math.max(1,Math.round(input.length/ratio)),out=new Float32Array(len);for(let i=0;i<len;i++){const pos=i*ratio,a=Math.floor(pos),b=Math.min(input.length-1,a+1),f=pos-a;out[i]=(input[a]||0)*(1-f)+(input[b]||0)*f}return out}
function concatFloat32(parts,total){const out=new Float32Array(total);let pos=0;for(const p of parts){out.set(p,pos);pos+=p.length}return out}
function friendlyError(e){const msg=String(e?.message||e);if(msg.includes('AUDIO_EXTRACTION_FAILED'))return isGreekUI()?'Δεν μπόρεσα να αποκωδικοποιήσω το audio αυτού του αρχείου στο συγκεκριμένο iPhone/browser. Δοκίμασε το ίδιο video ξανά μετά από refresh ή ένα MP4/MOV με AAC.':'Could not decode this file audio on this iPhone/browser. Refresh and retry, or use MP4/MOV with AAC.';if(msg.includes('NO_AUDIO_TRACK'))return isGreekUI()?'Το video δεν έχει audio track.':'The video has no audio track.';return msg}

function onWorkerMessage({data}){if(data.type==='cache-status'){if(!data.enabled&&!window.isSecureContext){$('#systemAi').textContent='WASM + Whisper · no cache';}}if(data.type==='worker-ready'){showProgress('model',31,isGreekUI()?'Stable AI engine έτοιμο. Φόρτωση μοντέλου…':'Stable AI engine ready. Loading model…')}if(data.type==='model-file'){showProgress('model',Math.max(31,Number(data.overall)||31),data.label||'AI model')}if(data.type==='model-progress'){const p=Number(data.progress)||0;showProgress('model',31+Math.min(34,p*.34),data.file?`${data.file} · ${Math.round(p)}%`:`AI model · ${Math.round(p)}%`)}if(data.type==='model-ready'){showProgress('model',66,isGreekUI()?'Το AI model φορτώθηκε.':'AI model loaded.')}if(data.type==='device'){const d=data.device||'wasm';$('#engineBadge').textContent=d.toUpperCase();$('#systemAi').textContent=`${d.toUpperCase()} + Whisper`;}if(data.type==='transcribe-start'){showProgress('transcribe',68,isGreekUI()?'Απομαγνητοφώνηση…':'Transcribing…')}if(data.type==='transcribe-progress'){const p=Number(data.progress)||0;showProgress('transcribe',68+Math.min(30,p*.30),isGreekUI()?`Απομαγνητοφώνηση ${Math.round(p)}%`:`Transcribing ${Math.round(p)}%`)}if(data.type==='result'){trackEvent('captions_generated',{word_count:(data.words||[]).length});destroyWorker();state.sourceWords=data.words||[];reflowCaptions();showProgress('done',100,isGreekUI()?'Ολοκληρώθηκε':'Done');setTimeout(()=>$('#progressBox').classList.add('hidden'),800);$('#generateBtn').disabled=false;updateCaptionOverlay()}if(data.type==='error'){destroyWorker();failProgress(data.message||'Transcription failed');$('#generateBtn').disabled=false}}
function showProgress(stage,pct,detail){const box=$('#progressBox');box.classList.remove('hidden');$('#progressBar').style.width=`${Math.max(0,Math.min(100,pct))}%`;$('#progressPercent').textContent=`${Math.round(pct)}%`;$('#progressDetail').textContent=detail;const title=stage==='audio'?(isGreekUI()?'Προετοιμασία audio':'Preparing audio'):stage==='model'?(isGreekUI()?'Φόρτωση AI model':'Loading AI model'):stage==='transcribe'?(isGreekUI()?'Απομαγνητοφώνηση':'Transcribing'):stage==='done'?(isGreekUI()?'Έτοιμο':'Done'):(isGreekUI()?'Αποτυχία επεξεργασίας':'Processing failed');$('#progressTitle').textContent=title;$('#progressBar').style.background=stage==='error'?'var(--danger)':'var(--lime)';updateElapsed()}
function updateElapsed(){if(!state.startedAt)return;$('#elapsed').textContent=formatTime((performance.now()-state.startedAt)/1000);if(!$('#progressBox').classList.contains('hidden'))setTimeout(updateElapsed,700)}function failProgress(msg){showProgress('error',0,msg)}

// Export helpers
function preferredVideoRecorderFormat(){
  if(!window.MediaRecorder||!HTMLCanvasElement.prototype.captureStream||!window.AudioContext)return null;
  const candidates=[
    {mime:'video/mp4;codecs=avc1.42E01E,mp4a.40.2',ext:'mp4',label:'MP4'},
    {mime:'video/mp4',ext:'mp4',label:'MP4'},
    {mime:'video/webm;codecs=vp9,opus',ext:'webm',label:'WebM'},
    {mime:'video/webm;codecs=vp8,opus',ext:'webm',label:'WebM'},
    {mime:'video/webm',ext:'webm',label:'WebM'}
  ];
  for(const f of candidates){try{if(MediaRecorder.isTypeSupported(f.mime))return f}catch{}}
  return null;
}
function updateExportButtons(){
  const ok=state.captions.length>0,format=preferredVideoRecorderFormat(),videoOk=ok&&!!format;
  $('#srtBtn').disabled=!ok;$('#txtBtn').disabled=!ok;
  $('#quickVideoExportBtn').disabled=!videoOk;$('#videoDownloadBtn').disabled=!videoOk;
  const label=format?`${format.label} · burned captions`:(isGreekUI()?'Δεν υποστηρίζεται video export σε αυτόν τον browser':'Video export is not supported in this browser');
  $('#videoExportFormat').textContent=label;$('#quickExportHint').textContent=format?(isGreekUI()?`Τοπικό export σε ${format.label}.`:`Local ${format.label} export.`):label;
}
function srtTime(sec){const ms=Math.round(sec*1000),h=Math.floor(ms/3600000),m=Math.floor(ms%3600000/60000),s=Math.floor(ms%60000/1000),r=ms%1000;return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')},${String(r).padStart(3,'0')}`}
function baseName(){return (state.file?.name||'kaptiono').replace(/\.[^.]+$/,'')+'-kaptiono'}
function downloadBlob(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1500)}
$('#srtBtn').addEventListener('click',()=>{const s=state.captions.map((c,i)=>`${i+1}\n${srtTime(c.start)} --> ${srtTime(c.end)}\n${captionCase(c.text)}\n`).join('\n');downloadBlob(new Blob([s],{type:'text/plain;charset=utf-8'}),baseName()+'.srt')});
$('#txtBtn').addEventListener('click',()=>downloadBlob(new Blob([state.captions.map(c=>c.text).join(' ')],{type:'text/plain;charset=utf-8'}),baseName()+'.txt'));
$('#quickVideoExportBtn').addEventListener('click',exportVideo);$('#videoDownloadBtn').addEventListener('click',exportVideo);
async function exportVideo(){
  trackEvent('video_export_started',{caption_count:state.captions.length});
  if(state.exporting||!state.file||!state.captions.length)return;
  const format=preferredVideoRecorderFormat();if(!format){alert(isGreekUI()?'Ο browser σου δεν υποστηρίζει ακόμη local video export. Μπορείς να κατεβάσεις SRT/TXT.':'Your browser does not support local video export yet. You can still download SRT/TXT.');return}
  state.exporting=true;updateExportButtons();$('#exportProgress').classList.remove('hidden');$('#exportBar').style.width='0%';$('#exportDetail').textContent='0%';
  let ac=null;
  try{
    const src=document.createElement('video');src.src=state.url;src.preload='auto';src.playsInline=true;src.setAttribute('playsinline','');
    await new Promise((res,rej)=>{src.onloadedmetadata=res;src.onerror=()=>rej(new Error(isGreekUI()?'Αποτυχία φόρτωσης video για export.':'Video load failed for export.'))});
    const maxDim=1080,sc=Math.min(1,maxDim/Math.max(src.videoWidth,src.videoHeight)),w=Math.max(2,Math.round(src.videoWidth*sc/2)*2),h=Math.max(2,Math.round(src.videoHeight*sc/2)*2),canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
    const ctx=canvas.getContext('2d',{alpha:false});if(!ctx)throw new Error('Canvas unavailable');
    const stream=canvas.captureStream(30);ac=new AudioContext();await ac.resume();const node=ac.createMediaElementSource(src),dest=ac.createMediaStreamDestination();node.connect(dest);dest.stream.getAudioTracks().forEach(t=>stream.addTrack(t));
    const rec=new MediaRecorder(stream,{mimeType:format.mime,videoBitsPerSecond:6_000_000}),blobs=[];rec.ondataavailable=e=>e.data.size&&blobs.push(e.data);const stopped=new Promise((res,rej)=>{rec.onstop=res;rec.onerror=e=>rej(e.error||new Error('MediaRecorder error'))});
    rec.start(1000);
    const draw=()=>{try{ctx.drawImage(src,0,0,w,h);drawCanvasCaption(ctx,w,h,src.currentTime)}catch{}const pct=Math.min(100,src.duration?src.currentTime/src.duration*100:0);$('#exportBar').style.width=`${pct}%`;$('#exportDetail').textContent=`${Math.round(pct)}%`;if(!src.paused&&!src.ended)requestAnimationFrame(draw)};
    await src.play();draw();await new Promise((res,rej)=>{src.onended=res;src.onerror=()=>rej(new Error('Playback failed during export'))});rec.stop();await stopped;
    const outMime=rec.mimeType||format.mime;downloadBlob(new Blob(blobs,{type:outMime}),`${baseName()}.${format.ext}`);
  }catch(e){alert((isGreekUI()?'Το video export απέτυχε: ':'Video export failed: ')+(e?.message||String(e)))}finally{try{await ac?.close()}catch{}state.exporting=false;updateExportButtons();setTimeout(()=>$('#exportProgress').classList.add('hidden'),900)}
}
function drawCanvasCaption(ctx,w,h,t){const seg=state.captions.find(c=>t>=c.start&&t<=c.end);if(!seg)return;const s=state.style,text=captionCase(seg.text),font=Math.max(18,Math.round(s.font_size*(w/576)*(s.scale/100)));ctx.save();ctx.font=`${s.italic?'italic ':''}${s.bold?'900':'500'} ${font}px ${s.font_family}, sans-serif`;ctx.textAlign=s.horizontal_align;ctx.textBaseline='middle';ctx.fillStyle=s.text_color;ctx.strokeStyle=s.outline_color;ctx.lineWidth=Math.max(0,s.outline_width*(w/576));ctx.lineJoin='round';const x=w*s.horizontal_position/100,y=h*s.vertical_position/100,maxW=w*s.caption_width/100,lines=wrapCanvas(ctx,text,maxW,s.max_lines),lineH=font*1.12;if(s.background==='box'){ctx.fillStyle=hexAlpha(s.background_color,s.background_opacity);const widest=Math.max(...lines.map(l=>ctx.measureText(l).width));ctx.fillRect(x-widest/2-font*.2,y-lineH*.55,widest+font*.4,lineH*lines.length+font*.12);ctx.fillStyle=s.text_color}lines.forEach((line,i)=>{const yy=y+(i-(lines.length-1)/2)*lineH;if(ctx.lineWidth>0)ctx.strokeText(line,x,yy,maxW);ctx.fillText(line,x,yy,maxW)});ctx.restore()}
function wrapCanvas(ctx,text,maxWidth,maxLines){const words=text.split(/\s+/),lines=[];let line='';for(const word of words){const test=line?`${line} ${word}`:word;if(ctx.measureText(test).width<=maxWidth||!line)line=test;else{lines.push(line);line=word;if(lines.length>=maxLines-1)break}}if(line)lines.push(line);return lines.slice(0,maxLines)}

// Browser capability status
$('#systemAi').textContent='Whisper Small · WASM';$('#systemAudio').textContent=('AudioDecoder' in window)?'WebCodecs + Mediabunny':'Mediabunny + Web Audio';$('#systemDevice').textContent=isIOS?'iPhone / iPad':isSafari?'Safari':'Desktop browser';

// PWA install and update lifecycle
const APP_VERSION='0.5.5';
const isAndroid=/Android/i.test(navigator.userAgent);
const isStandalone=()=>window.matchMedia?.('(display-mode: standalone)').matches||window.navigator.standalone===true;
let deferredInstallPrompt=null;
let swRegistration=null;
let reloadingForUpdate=false;

function showInstallBanner(){
  if(isStandalone()||sessionStorage.getItem('kaptiono-install-dismissed')==='1')return;
  if(isIOS||isAndroid)$('#installBanner')?.classList.remove('hidden');
}
function hideInstallBanner(){$('#installBanner')?.classList.add('hidden')}
function openIosInstallModal(){$('#iosInstallModal')?.classList.remove('hidden')}
function closeIosInstallModal(){$('#iosInstallModal')?.classList.add('hidden')}

window.addEventListener('beforeinstallprompt',e=>{
  e.preventDefault();
  deferredInstallPrompt=e;
  if(isAndroid)setTimeout(showInstallBanner,350);
});
window.addEventListener('appinstalled',()=>{trackEvent('pwa_installed',{platform:isIOS?'ios':'android_or_desktop'});deferredInstallPrompt=null;hideInstallBanner();localStorage.setItem('kaptiono-installed','1')});
$('#installDismiss')?.addEventListener('click',()=>{sessionStorage.setItem('kaptiono-install-dismissed','1');hideInstallBanner()});
$('#installAction')?.addEventListener('click',async()=>{
  if(isIOS){openIosInstallModal();return}
  if(deferredInstallPrompt){
    hideInstallBanner();
    await deferredInstallPrompt.prompt();
    try{await deferredInstallPrompt.userChoice}catch{}
    deferredInstallPrompt=null;
    return;
  }
  // Some Android browsers do not expose beforeinstallprompt. Keep the message visible only when direct install is available.
  hideInstallBanner();
});
$('#iosInstallClose')?.addEventListener('click',closeIosInstallModal);
$('#iosInstallDone')?.addEventListener('click',()=>{closeIosInstallModal();hideInstallBanner();sessionStorage.setItem('kaptiono-install-dismissed','1')});
$('#iosInstallModal')?.addEventListener('click',e=>{if(e.target.id==='iosInstallModal')closeIosInstallModal()});

if(isIOS&&!isStandalone())setTimeout(showInstallBanner,900);

function showUpdateToast(){$('#updateToast')?.classList.remove('hidden')}
function hideUpdateToast(){$('#updateToast')?.classList.add('hidden')}
function applyUpdate(){
  hideUpdateToast();
  location.reload();
}
$('#updateNowBtn')?.addEventListener('click',applyUpdate);

async function checkForAppUpdate(){
  if(!swRegistration)return;
  try{
    const res=await fetch(`./version.json?t=${Date.now()}`,{cache:'no-store'});
    const info=await res.json();
    if(info?.version&&info.version!==APP_VERSION)await swRegistration.update();
    else await swRegistration.update();
  }catch{try{await swRegistration.update()}catch{}}
}

if('serviceWorker' in navigator){
  navigator.serviceWorker.addEventListener('controllerchange',()=>{
    if(reloadingForUpdate)return;
    reloadingForUpdate=true;
    // Do not destroy an active editing session. Update immediately everywhere else.
    if(state.file){showUpdateToast();reloadingForUpdate=false}else location.reload();
  });
  navigator.serviceWorker.addEventListener('message',e=>{if(e.data?.type==='KAPTIONO_UPDATE_READY'){if(state.file)showUpdateToast();else checkForAppUpdate()}});
  window.addEventListener('load',async()=>{
    try{
      swRegistration=await navigator.serviceWorker.register('./sw.js',{scope:'./',updateViaCache:'none'});
      await checkForAppUpdate();
      setInterval(checkForAppUpdate,60*1000);
      document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')checkForAppUpdate()});
      window.addEventListener('online',checkForAppUpdate);
    }catch(e){console.warn('Service worker',e)}
  });
}
