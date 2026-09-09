import { Input, ALL_FORMATS, BlobSource, AudioSampleSink } from 'https://cdn.jsdelivr.net/npm/mediabunny@1.55.7/+esm';

const APP_VERSION='0.5.26';
const CLOUD_TRANSCRIBE_URL='https://kaptiono-transcribe.donacgreece.workers.dev/';
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
try{localStorage.removeItem('kaptiono-enhanced')}catch{}
if(coarsePointer){
  ['gesturestart','gesturechange','gestureend'].forEach(name=>document.addEventListener(name,e=>e.preventDefault(),{passive:false}));
  let lastTouchEnd=0;
  document.addEventListener('touchend',e=>{const now=Date.now();if(now-lastTouchEnd<=300)e.preventDefault();lastTouchEnd=now},{passive:false});
}

const i18n = {
  el:{localPrivate:'Privacy-first',heroTitle:'Υπότιτλοι μέσα στον browser. Local ή Cloud AI.',heroText:'Διάλεξε ένα video. Το video μένει στη συσκευή σου. Τα Local models δουλεύουν τοπικά, ενώ το Cloud High Accuracy στέλνει μόνο το audio για απομαγνητοφώνηση.',chooseVideo:'Διάλεξε video',dropHint:'ή σύρε MP4 / MOV / WebM εδώ',privacyTitle:'Το video μένει στη συσκευή σου.',privacyText:'Μόνο το audio αποστέλλεται στο Cloud mode.',liveChanges:'LIVE PREVIEW',changeVideo:'Άλλο video',livePreview:'Ζωντανή προεπισκόπηση',previewHint:'Οι αλλαγές εφαρμόζονται αμέσως.',loadingVideo:'Φόρτωση video…',tabCaptions:'Κείμενο',tabDesign:'Σχεδίαση',tabExport:'Export',generateTitle:'Δημιουργία captions',qualityHint:'Προτείνουμε Whisper Small για local χρήση. Τα Base και Tiny είναι πιο ελαφριές local επιλογές, ενώ το Cloud High Accuracy δίνει τη μέγιστη ακρίβεια.',aiModel:'AI model',speechLanguage:'Γλώσσα ομιλίας',autoDetect:'Αυτόματη ανίχνευση',languageHint:'Η ρητή επιλογή γλώσσας βελτιώνει πολύ τα σύντομα clips.',generateButton:'Δημιουργία captions',noCaptions:'Δεν υπάρχουν captions ακόμη.',noCaptionsHint:'Πάτησε «Δημιουργία captions» για να ξεκινήσεις.',styleTitle:'Στυλ υποτίτλων',designHint:'Ίδια λογική ρυθμίσεων με το desktop Caption Studio.',typography:'Τυπογραφία',typographySub:'Γραμματοσειρά, μέγεθος και έμφαση',colorContrast:'Χρώμα & αντίθεση',colorSub:'Κείμενο, highlight και outline',positionFrame:'Θέση & κάδρο',positionSub:'Τοποθέτηση, πλάτος και στοίχιση',flow:'Ροή',flowSub:'Λέξεις ανά caption και ταχύτητα',motion:'Κίνηση & έμφαση',motionSub:'Animation και ενεργή λέξη',effects:'Εφέ & φόντο',effectsSub:'Σκιά, box και padding',fontFamily:'Γραμματοσειρά',fontSize:'Μέγεθος',letterSpacing:'Απόσταση γραμμάτων',scale:'Κλίμακα',text:'Κείμενο',background:'Φόντο',textOpacity:'Αδιαφάνεια κειμένου',quickPosition:'Γρήγορη θέση',horizontal:'Οριζόντια',vertical:'Κάθετα',captionWidth:'Πλάτος caption',rotation:'Περιστροφή',alignment:'Στοίχιση',left:'Αριστερά',center:'Κέντρο',right:'Δεξιά',maxWords:'Λέξεις ανά caption',maxLines:'Μέγιστες γραμμές',captionSpeed:'Ταχύτητα',fast:'Γρήγορη',balanced:'Ισορροπημένη',relaxed:'Χαλαρή',none:'Χωρίς',animationStrength:'Ένταση animation',wordHighlight:'Highlight ανά λέξη',shadow:'Σκιά',boxOpacity:'Αδιαφάνεια box',boxPadding:'Padding box',exportTitle:'Αποθήκευση αποτελέσματος',exportHint:'Το αρχείο δημιουργείται τοπικά στον browser.',downloadVideo:'Λήψη video με υπότιτλους',downloadVideoHint:'Δημιουργείται τοπικά στη συσκευή σου.',burnedCaptions:'BURNED-IN CAPTIONS',videoExportLocal:'Το video δημιουργείται τοπικά.',videoExportLocalHint:'Η διαθέσιμη μορφή εξαρτάται από τον browser σου.',srtHint:'Υπότιτλοι με timestamps',txtHint:'Καθαρό transcript',webmHint:'Burned captions, Chromium',exporting:'Local export…',mp4Next:'MP4 export βρίσκεται ακόμη σε ανάπτυξη.',mp4NextHint:'Πρώτα σταθεροποιούμε transcription και iPhone compatibility.',supportBack:'Πίσω στο Kaptiono',supportTitle:'Γιατί υπάρχει το Kaptiono',supportIntro:'Το Kaptiono δημιουργήθηκε για creators που θέλουν γρήγορους, καθαρούς υπότιτλους, local-first workflow, προαιρετικό Cloud High Accuracy, χωρίς credits ή watermark.',supportPrivateTitle:'Ιδιωτικό από σχεδιασμό',supportPrivateText:'Το original video, το editing και το export μένουν στη συσκευή. Τα Local models επεξεργάζονται το audio τοπικά. Αν επιλεγεί Cloud High Accuracy, μόνο το extracted audio αποστέλλεται στο Kaptiono transcription service. Google Analytics και Google AdSense παραμένουν ξεχωριστά από το περιεχόμενο του video και των captions.',supportFreeTitle:'Δωρεάν για creators',supportFreeText:'Το Kaptiono χτίζεται χωρίς credits, watermark και υποχρεωτική συνδρομή για τις βασικές λειτουργίες δημιουργίας captions.',supportBuiltTitle:'Χτίζεται σαν πραγματικό εργαλείο',supportBuiltText:'Desktop, web και mobile σχεδιάζονται με κοινή λογική ώστε το workflow να παραμένει απλό, γρήγορο και οικείο.',roadmapCtaTitle:'Δες τι χτίζουμε μετά',roadmapCtaText:'Δες το πραγματικό roadmap του Kaptiono, τι είναι προτεραιότητα τώρα και ποιες ιδέες μπορούν να προχωρήσουν με τη στήριξη της κοινότητας.',roadmapCtaButton:'Άνοιγμα Roadmap',roadmapBack:'Πίσω στο Support',roadmapTitle:'Το επόμενο Kaptiono χτίζεται εδώ.',roadmapIntro:'Αυτό είναι το πραγματικό product roadmap. Δείχνει πού εστιάζουμε τώρα, τι θέλουμε να ακολουθήσει και ποιες μεγαλύτερες ιδέες εξετάζουμε για το μέλλον.',roadmapSupportTitle:'Η στήριξή σου βοηθά την ανάπτυξη',roadmapSupportText:'Οι δωρεές είναι προαιρετικές και βοηθούν σε χρόνο ανάπτυξης, δοκιμές σε περισσότερες συσκευές και έρευνα νέων local AI δυνατοτήτων. Το roadmap είναι κατεύθυνση, όχι υπόσχεση ημερομηνιών.',roadmapStatusNow:'Τώρα',roadmapStatusNext:'Επόμενα',roadmapStatusLater:'Αργότερα',roadmapStatusExplore:'Διερεύνηση',roadmapNowTitle:'Τρέχουσα προτεραιότητα',roadmapNowText:'Πράγματα που μπορούν να κάνουν το Kaptiono πιο αξιόπιστο και χρήσιμο στην καθημερινή δουλειά ενός creator.',roadmapProjectSaveTitle:'Recent Projects & local project save',roadmapProjectSaveText:'Αποθήκευση captions, timings και styles τοπικά ώστε να συνεχίζεις ένα project χωρίς νέα απομαγνητοφώνηση.',roadmapPwaTitle:'PWA reliability & offline foundation',roadmapPwaText:'Σταθερό install/update flow, καλύτερο local caching και βάση για πραγματική offline χρήση.',roadmapMobileTitle:'Mobile & Safari reliability',roadmapMobileText:'Καλύτερη συμπεριφορά σε Android, iPhone και iPad με μεγάλα video και local AI models.',roadmapExportParityTitle:'Preview / export parity',roadmapExportParityText:'Το τελικό video να παραμένει όσο γίνεται πιστό σε αυτό που βλέπεις μέσα στο Caption Studio.',roadmapNextTitle:'Τα επόμενα creator εργαλεία',roadmapNextText:'Features με άμεση αξία στο editing και στην ποιότητα των captions.',roadmapTimelineTitle:'Caption Timeline Editor',roadmapTimelineText:'Split, merge, drag και timing adjustments σε πραγματική timeline κάτω από το video.',roadmapCleanupTitle:'Smart Caption Cleanup',roadmapCleanupText:'Καλύτερη στίξη, φυσικότερα breaks, λιγότερες διπλές λέξεις και πιο καθαρό transcript.',roadmapSafeZonesTitle:'Social Safe Zones',roadmapSafeZonesText:'TikTok, Reels, Shorts και Story overlays ώστε τα captions να μην κρύβονται πίσω από το UI της πλατφόρμας.',roadmapAutoModelTitle:'Automatic model selection',roadmapAutoModelText:'Το Kaptiono να προτείνει Tiny, Base ή Small ανάλογα με τη συσκευή και τη διαθέσιμη ισχύ.',roadmapDictionaryTitle:'Custom Dictionary',roadmapDictionaryText:'Προσωπικό λεξικό για brands, ονόματα και όρους που το Whisper συχνά γράφει λάθος.',roadmapLaterTitle:'Μεγαλύτερα workflows',roadmapLaterText:'Ιδέες που μπορούν να μετατρέψουν το Kaptiono σε πιο ολοκληρωμένο καθημερινό εργαλείο.',roadmapSpeakerTitle:'Speaker Detection',roadmapSpeakerText:'Αναγνώριση διαφορετικών ομιλητών για interviews και podcasts με ξεχωριστή παρουσίαση.',roadmapAutoPositionTitle:'Auto Caption Position',roadmapAutoPositionText:'Έξυπνη μετακίνηση captions ώστε να αποφεύγουν πρόσωπα και σημαντικά σημεία του frame.',roadmapBatchTitle:'Batch Processing Queue',roadmapBatchText:'Πολλά videos σε σειρά για creators που ετοιμάζουν συχνά Shorts, Reels ή clips.',roadmapPresetTitle:'Creator preset profiles & sharing',roadmapPresetText:'Αποθήκευση προσωπικών styles και δυνατότητα export/import preset μεταξύ συσκευών.',roadmapOfflineTitle:'Full Offline Mode',roadmapOfflineText:'Εγκατάσταση μία φορά και δημιουργία captions χωρίς σύνδεση όταν app και AI model είναι ήδη διαθέσιμα τοπικά.',roadmapExploreTitle:'Ιδέες που εξερευνούμε',roadmapExploreText:'Δεν είναι δεσμεύσεις. Είναι κατευθύνσεις που αξίζει να δοκιμαστούν αν μπορούν να παραμείνουν γρήγορες, local και creator-first.',roadmapTranslationTitle:'Local caption translation',roadmapTranslationText:'Μετάφραση captions χωρίς να χαλάει η privacy-first λογική του βασικού workflow.',roadmapDiarizationTitle:'Advanced local diarization',roadmapDiarizationText:'Πιο ακριβής διαχωρισμός ομιλητών με local μοντέλα όταν το hardware το επιτρέπει.',roadmapCommunityTitle:'Community preset gallery',roadmapCommunityText:'Creator-made caption styles που μπορούν να μοιράζονται χωρίς να αλλάζει το δωρεάν core.',roadmapAdvancedTitle:'Advanced creator workflows',roadmapAdvancedText:'Νέα local-first εργαλεία μόνο όταν προσθέτουν πραγματική αξία χωρίς να μετατρέπουν το Kaptiono σε βαρύ video editor.',roadmapBottomTitle:'Βοήθησε το Kaptiono να δοκιμάσει περισσότερα.',roadmapBottomText:'Το Kaptiono παραμένει δωρεάν για creators. Η προαιρετική στήριξη βοηθά σε ανάπτυξη, testing σε περισσότερα devices και πειραματισμό με νέα local AI features.',roadmapBottomButton:'Support μέσω PayPal',contactTitle:'Θέλεις να επικοινωνήσεις με το Kaptiono;',contactText:'Για feedback, bugs, συνεργασίες ή commercial licensing μπορείς να επικοινωνήσεις απευθείας μαζί μας.',donateTitle:'Θέλεις να βοηθήσεις την ανάπτυξη;',donateText:'Η δωρεά είναι απολύτως προαιρετική. Βοηθά να συνεχιστεί η ανάπτυξη, οι δοκιμές σε περισσότερες συσκευές και η προσθήκη νέων features.',donateButton:'Donate μέσω PayPal',seoWhyTitle:'AI captions με privacy first.',seoWhyText:'Το Kaptiono είναι για creators που θέλουν δημιουργία υποτίτλων μέσα στον browser χωρίς να στέλνουν τα video τους σε cloud processing server.',seoWhatTitle:'Απομαγνητοφώνηση, σχεδίαση και export.',seoWhatText:'Διάλεξε τοπικά ένα video, δημιούργησε captions με Whisper, ρύθμισε το στυλ και κάνε export για short-form ή long-form περιεχόμενο.',seoWhoTitle:'Για creators και editors.',seoWhoText:'Το Kaptiono ταιριάζει σε TikTok, Reels, Shorts, YouTube και creator workflows που χρειάζονται γρήγορους υπότιτλους, καθαρό editor και export χωρίς watermark.',howTitle:'Απλό workflow υποτίτλων μέσα στον browser.',howText:'Διάλεξε video, τρέξε local AI transcription, ρύθμισε το στυλ και κάνε export. Η εμπειρία έχει σχεδιαστεί ώστε να είναι γρήγορη και app-like σε desktop και mobile.',howStep1Title:'Διάλεξε video',howStep1Text:'Άνοιξε MP4, MOV ή WebM απευθείας από τη συσκευή σου.',howStep2Title:'Δημιούργησε captions',howStep2Text:'Χρησιμοποίησε Whisper για υψηλής ποιότητας subtitle generation στον browser.',howStep3Title:'Σχεδίασε και κάνε export',howStep3Text:'Ρύθμισε το look, δες live preview και εξήγαγε καθαρό creator-ready αποτέλεσμα.',faqTitle:'Συχνές ερωτήσεις.',faqUploadQ:'Ανεβάζει το Kaptiono το video σε server;',faqUploadA:'Όχι. Το original video μένει στη συσκευή. Με Local models το audio μένει επίσης τοπικά. Αν επιλέξεις Cloud High Accuracy, αποστέλλεται μόνο το extracted audio για transcription.',faqSocialQ:'Μπορεί να φτιάξει υπότιτλους για social media;',faqSocialA:'Ναι. Το workflow είναι σχεδιασμένο για TikTok, Instagram Reels, YouTube Shorts και άλλα video formats.',faqDesktopQ:'Είναι μόνο για desktop;',faqDesktopA:'Όχι. Η web εφαρμογή έχει σχεδιαστεί και για mobile, ενώ η desktop έκδοση μπορεί να προσφέρει ισχυρότερο editing workflow.',faqDiffQ:'Τι κάνει το Kaptiono διαφορετικό;',faqDiffA:'Εστιάζει σε privacy-first captions, local AI, προαιρετικό Cloud High Accuracy, no-watermark output και καθαρό editor.',installTitle:'Εγκατάσταση Kaptiono',installText:'Χρησιμοποίησέ το σαν κανονική εφαρμογή στο κινητό σου.',installAction:'Download',iosInstallTitle:'Βάλε το Kaptiono στην Αρχική οθόνη',iosStep1Title:'Άνοιξε το Share',iosStep1Text:'Στο Safari πάτησε το εικονίδιο Κοινοποίησης.',iosStep2Title:'Add to Home Screen',iosStep2Text:'Διάλεξε «Προσθήκη στην οθόνη Αφετηρίας».',iosStep3Title:'Πάτησε Add',iosStep3Text:'Το Kaptiono θα εμφανιστεί σαν εφαρμογή.',iosDone:'Έγινε',updateTitle:'Νέα έκδοση διαθέσιμη',updateText:'Το Kaptiono μπορεί να ενημερωθεί τώρα.',updateAction:'Ενημέρωση',systemTitle:'Μηχανή επεξεργασίας',fileStatus:'Αρχείο'},
  en:{localPrivate:'Privacy-first',heroTitle:'Captions in your browser. Local or Cloud AI.',heroText:'Choose a video. The video stays on your device. Local models run on-device, while Cloud High Accuracy sends only extracted audio for transcription.',chooseVideo:'Choose video',dropHint:'or drop MP4 / MOV / WebM here',privacyTitle:'Your video stays on your device.',privacyText:'Only the audio is sent in Cloud mode.',liveChanges:'LIVE PREVIEW',changeVideo:'Change video',livePreview:'Live preview',previewHint:'Changes are applied immediately.',loadingVideo:'Loading video…',tabCaptions:'Text',tabDesign:'Design',tabExport:'Export',generateTitle:'Generate captions',qualityHint:'Use Small for local processing or Cloud High Accuracy to test Whisper Large v3 Turbo.',aiModel:'AI model',speechLanguage:'Speech language',autoDetect:'Auto detect',languageHint:'Explicit language selection significantly improves short clips.',generateButton:'Generate captions',noCaptions:'No captions yet.',noCaptionsHint:'Press “Generate captions” to start.',styleTitle:'Caption style',designHint:'The same control logic as the desktop Caption Studio.',typography:'Typography',typographySub:'Font, size and emphasis',colorContrast:'Color & contrast',colorSub:'Text, highlight and outline',positionFrame:'Position & frame',positionSub:'Placement, width and alignment',flow:'Timing & flow',flowSub:'Words per caption and pacing',motion:'Motion & emphasis',motionSub:'Animation and active word',effects:'Effects & background',effectsSub:'Shadow, box and padding',fontFamily:'Font family',fontSize:'Font size',letterSpacing:'Letter spacing',scale:'Scale',text:'Text',background:'Background',textOpacity:'Text opacity',quickPosition:'Quick position',horizontal:'Horizontal',vertical:'Vertical',captionWidth:'Caption width',rotation:'Rotation',alignment:'Alignment',left:'Left',center:'Center',right:'Right',maxWords:'Words per caption',maxLines:'Maximum lines',captionSpeed:'Caption speed',fast:'Fast',balanced:'Balanced',relaxed:'Relaxed',none:'None',animationStrength:'Animation strength',wordHighlight:'Word-by-word highlight',shadow:'Shadow',boxOpacity:'Box opacity',boxPadding:'Box padding',exportTitle:'Save result',exportHint:'The file is created locally in your browser.',downloadVideo:'Download video with captions',downloadVideoHint:'Created locally on your device.',burnedCaptions:'BURNED-IN CAPTIONS',videoExportLocal:'The video is created locally.',videoExportLocalHint:'Available format depends on your browser.',srtHint:'Captions with timestamps',txtHint:'Plain transcript',webmHint:'Burned captions, Chromium',exporting:'Local export…',mp4Next:'MP4 export is still in development.',mp4NextHint:'We are stabilizing transcription and iPhone compatibility first.',supportBack:'Back to Kaptiono',supportTitle:'Why Kaptiono exists',supportIntro:'Kaptiono was created for creators who want fast, clean captions, a local-first workflow, optional Cloud High Accuracy, no credits, and no watermark.',supportPrivateTitle:'Private by design',supportPrivateText:'The original video, editing and export stay on the device. Local models process audio on-device. If Cloud High Accuracy is selected, only extracted audio is sent to the Kaptiono transcription service. Google Analytics and Google AdSense remain separate from video and caption content.',supportFreeTitle:'Free for creators',supportFreeText:'Kaptiono is being built without credits, watermarks, or a mandatory subscription for the core caption-creation workflow.',supportBuiltTitle:'Built as a real creator tool',supportBuiltText:'Desktop, web, and mobile are designed around the same workflow so the product stays simple, fast, and familiar.',roadmapCtaTitle:'See what we are building next',roadmapCtaText:'Open the real Kaptiono roadmap to see what is being prioritized now and which ideas can move forward with community support.',roadmapCtaButton:'View Roadmap',roadmapBack:'Back to Support',roadmapTitle:'The next Kaptiono is being built here.',roadmapIntro:'This is the real product roadmap. It shows what we are focusing on now, what we want to build next, and which larger ideas we are exploring for the future.',roadmapSupportTitle:'Your support helps development',roadmapSupportText:'Donations are optional and help fund development time, testing on more devices, and research into new local AI capabilities. The roadmap is direction, not a promise of dates.',roadmapStatusNow:'Now',roadmapStatusNext:'Next',roadmapStatusLater:'Later',roadmapStatusExplore:'Exploring',roadmapNowTitle:'Current priority',roadmapNowText:'Work that can make Kaptiono more reliable and more useful in a creator’s everyday workflow.',roadmapProjectSaveTitle:'Recent Projects & local project save',roadmapProjectSaveText:'Save captions, timings and styles locally so a project can be continued without transcribing it again.',roadmapPwaTitle:'PWA reliability & offline foundation',roadmapPwaText:'A stable install/update flow, stronger local caching and the foundation for real offline use.',roadmapMobileTitle:'Mobile & Safari reliability',roadmapMobileText:'Better behavior on Android, iPhone and iPad with larger videos and local AI models.',roadmapExportParityTitle:'Preview / export parity',roadmapExportParityText:'Keep the downloaded video as close as possible to what is shown inside Caption Studio.',roadmapNextTitle:'The next creator tools',roadmapNextText:'Features with immediate value for editing speed and caption quality.',roadmapTimelineTitle:'Caption Timeline Editor',roadmapTimelineText:'Split, merge, drag and timing adjustments on a real timeline under the video.',roadmapCleanupTitle:'Smart Caption Cleanup',roadmapCleanupText:'Better punctuation, more natural breaks, fewer duplicate words and a cleaner transcript.',roadmapSafeZonesTitle:'Social Safe Zones',roadmapSafeZonesText:'TikTok, Reels, Shorts and Story overlays so captions do not sit behind platform UI.',roadmapAutoModelTitle:'Automatic model selection',roadmapAutoModelText:'Let Kaptiono recommend Tiny, Base or Small based on the device and available performance.',roadmapDictionaryTitle:'Custom Dictionary',roadmapDictionaryText:'A personal dictionary for brands, names and terms that Whisper often writes incorrectly.',roadmapLaterTitle:'Larger workflows',roadmapLaterText:'Ideas that can turn Kaptiono into a more complete everyday creator tool.',roadmapSpeakerTitle:'Speaker Detection',roadmapSpeakerText:'Detect different speakers in interviews and podcasts and present them clearly.',roadmapAutoPositionTitle:'Auto Caption Position',roadmapAutoPositionText:'Move captions intelligently so they avoid faces and important areas of the frame.',roadmapBatchTitle:'Batch Processing Queue',roadmapBatchText:'Queue multiple videos for creators producing Shorts, Reels or clips regularly.',roadmapPresetTitle:'Creator preset profiles & sharing',roadmapPresetText:'Save personal styles and export/import presets between devices.',roadmapOfflineTitle:'Full Offline Mode',roadmapOfflineText:'Install once and create captions without internet when the app and AI model are already available locally.',roadmapExploreTitle:'Ideas we are exploring',roadmapExploreText:'These are not commitments. They are directions worth testing if they can stay fast, local and creator-first.',roadmapTranslationTitle:'Local caption translation',roadmapTranslationText:'Translate captions without breaking the privacy-first philosophy of the core workflow.',roadmapDiarizationTitle:'Advanced local diarization',roadmapDiarizationText:'More accurate local speaker separation when the device hardware can support it.',roadmapCommunityTitle:'Community preset gallery',roadmapCommunityText:'Creator-made caption styles that can be shared without changing the free core.',roadmapAdvancedTitle:'Advanced creator workflows',roadmapAdvancedText:'New local-first tools only when they add real value without turning Kaptiono into a heavy video editor.',roadmapBottomTitle:'Help Kaptiono test what comes next.',roadmapBottomText:'Kaptiono remains free for creators. Optional support helps fund development, testing on more devices, and experiments with new local AI features.',roadmapBottomButton:'Support via PayPal',contactTitle:'Want to contact Kaptiono?',contactText:'For feedback, bugs, partnerships or commercial licensing, you can contact us directly.',donateTitle:'Want to support development?',donateText:'Donations are completely optional. They help fund continued development, testing on more devices, and new features.',donateButton:'Donate via PayPal',seoWhyTitle:'AI captions with privacy first.',seoWhyText:'Kaptiono is for creators who want browser-based subtitle generation with local AI and an optional cloud accuracy mode while keeping the original video on-device.',seoWhatTitle:'Transcribe, style and export.',seoWhatText:'Choose a video locally, generate captions with Whisper, adjust the style and export results for short-form or long-form content.',seoWhoTitle:'Built for creators and editors.',seoWhoText:'Kaptiono fits TikTok, Reels, Shorts, YouTube and creator workflows that need fast captions, a clean editor and no-watermark output.',howTitle:'A simple subtitle workflow in the browser.',howText:'Choose a video, run local AI or optional Cloud High Accuracy transcription, fine-tune the style and export the result. The experience is designed to feel fast and app-like on desktop and mobile.',howStep1Title:'Choose video',howStep1Text:'Open an MP4, MOV or WebM directly from your device.',howStep2Title:'Generate captions',howStep2Text:'Use local Whisper or optional Cloud High Accuracy for high-quality subtitle generation.',howStep3Title:'Style and export',howStep3Text:'Adjust the look, preview the result and export clean creator-ready output.',faqTitle:'Frequently asked questions.',faqUploadQ:'Does Kaptiono upload the video to a server?',faqUploadA:'No. The original video stays on the device. Local models also keep audio on-device. If Cloud High Accuracy is selected, only extracted audio is sent for transcription.',faqSocialQ:'Can Kaptiono create subtitles for social media?',faqSocialA:'Yes. The workflow is designed for TikTok, Instagram Reels, YouTube Shorts and other video formats.',faqDesktopQ:'Is Kaptiono only for desktop?',faqDesktopA:'No. The web app is designed for mobile too, while the desktop edition can provide a stronger editing workflow.',faqDiffQ:'What makes Kaptiono different?',faqDiffA:'It focuses on privacy-first captions, local AI, optional Cloud High Accuracy, no-watermark output and a clean editor.',installTitle:'Install Kaptiono',installText:'Use Kaptiono like a normal app on your phone.',installAction:'Download',iosInstallTitle:'Add Kaptiono to your Home Screen',iosStep1Title:'Open Share',iosStep1Text:'In Safari, tap the Share icon.',iosStep2Title:'Add to Home Screen',iosStep2Text:'Choose “Add to Home Screen”.',iosStep3Title:'Tap Add',iosStep3Text:'Kaptiono will appear like a normal app.',iosDone:'Done',updateTitle:'New version available',updateText:'Kaptiono can update now.',updateAction:'Update',systemTitle:'Processing engine',fileStatus:'File'}
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

const state={file:null,url:null,sourceWords:[],captions:[],uiLang:localStorage.getItem('kaptiono-lang')||'el',style:{...presets.yellow},preset:'yellow',worker:null,startedAt:0,currentCaptionKey:'',exporting:false,watchdog:null,lastWorkerActivity:0,progressValue:0,progressTarget:0,progressRaf:0,progressTicker:null,modelFirstRun:false,exportStage:'idle',exportPct:null,enhanced:false,enhanceWorker:null,pendingEnhanceWords:null,enhanceFirstRun:false,previewFrameHandle:0,previewFrameMode:'',previewCaptionIndex:-1,previewActiveWordIndex:-1,voiceRetry:false,voiceRetryImproved:false,cloudAbortController:null};
const video=$('#video');

function setLang(lang){state.uiLang=lang;document.documentElement.lang=lang;$$('[data-lang]').forEach(b=>b.classList.toggle('active',b.dataset.lang===lang));$$('[data-i18n]').forEach(el=>{const v=i18n[lang]?.[el.dataset.i18n];if(v)el.textContent=v});localStorage.setItem('kaptiono-lang',lang);if(!state.file&&lang==='en')$('#languageSelect').value='english';if(state.exporting)setExportUi(state.exportStage,state.exportPct);updateModelHint?.();updateCompatibilityNote?.();updateProcessingModeLabel?.();}
$$('[data-lang]').forEach(b=>b.addEventListener('click',()=>setLang(b.dataset.lang)));setLang(state.uiLang);

function formatTime(sec){sec=Math.max(0,Number(sec)||0);const h=Math.floor(sec/3600),m=Math.floor(sec%3600/60),s=Math.floor(sec%60).toString().padStart(2,'0');return h?`${h}:${String(m).padStart(2,'0')}:${s}`:`${m}:${s}`}
function bytes(n){if(!Number.isFinite(n))return '·';if(n<1024*1024)return `${(n/1024).toFixed(0)} KB`;return `${(n/1024/1024).toFixed(1)} MB`}
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
  $('#roadmapPage').classList.toggle('hidden',page!=='roadmap');
  window.scrollTo({top:0,behavior:'smooth'});
  updateEnhancedUi();
  updateModelHint();
  updateCompatibilityNote();
}
function goHome(){showPage('home');trackVirtualPage('/','Kaptiono · Home')}
function goSupport(){showPage('support');trackVirtualPage('/support','Kaptiono · Support')}
function goRoadmap(){showPage('roadmap');trackVirtualPage('/roadmap','Kaptiono · Roadmap');trackEvent('roadmap_opened')}
$('#brandHome').addEventListener('click',goHome);
$('#supportNav').addEventListener('click',goSupport);
$('#supportBackBtn').addEventListener('click',goHome);
$('#roadmapOpenBtn')?.addEventListener('click',goRoadmap);
$('#roadmapBackBtn')?.addEventListener('click',goSupport);
$('#footerSupportBtn')?.addEventListener('click',goSupport);
$('#footerRoadmapBtn')?.addEventListener('click',goRoadmap);

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
video.addEventListener('timeupdate',()=>{
  $('#currentTime').textContent=formatTime(video.currentTime);
  $('#seek').value=video.currentTime;
  if(video.paused||video.ended)syncCaptionFrame(video.currentTime);
});
video.addEventListener('play',()=>{
  $('#playBtn').textContent='Ⅱ';
  startPreviewFrameSync();
});
video.addEventListener('pause',()=>{
  $('#playBtn').textContent='▶';
  stopPreviewFrameSync();
  syncCaptionFrame(video.currentTime);
});
video.addEventListener('ended',()=>{
  stopPreviewFrameSync();
  syncCaptionFrame(video.currentTime);
});
video.addEventListener('seeking',()=>syncCaptionFrame(video.currentTime));
video.addEventListener('seeked',()=>syncCaptionFrame(video.currentTime));
$('#playBtn').addEventListener('click',async()=>{try{video.paused?await video.play():video.pause()}catch{}});
$('#seek').addEventListener('input',e=>{
  video.currentTime=Number(e.target.value);
  $('#currentTime').textContent=formatTime(video.currentTime);
  syncCaptionFrame(video.currentTime);
});
$('#muteBtn').addEventListener('click',()=>{video.muted=!video.muted;$('#muteBtn').textContent=video.muted?'×':'♪'});
window.addEventListener('resize',()=>{fitVideoStage();updateCaptionOverlay()});

const WORD_SYNC_LEAD_SECONDS=.018;

function stopPreviewFrameSync(){
  if(!state.previewFrameHandle)return;
  try{
    if(state.previewFrameMode==='rvfc'&&typeof video.cancelVideoFrameCallback==='function'){
      video.cancelVideoFrameCallback(state.previewFrameHandle);
    }else{
      cancelAnimationFrame(state.previewFrameHandle);
    }
  }catch{}
  state.previewFrameHandle=0;
  state.previewFrameMode='';
}

function queuePreviewFrame(){
  if(state.previewFrameHandle||video.paused||video.ended)return;
  if(typeof video.requestVideoFrameCallback==='function'){
    state.previewFrameMode='rvfc';
    state.previewFrameHandle=video.requestVideoFrameCallback((_,meta)=>{
      state.previewFrameHandle=0;
      const mediaTime=Number(meta?.mediaTime);
      syncCaptionFrame(Number.isFinite(mediaTime)?mediaTime:video.currentTime);
      queuePreviewFrame();
    });
  }else{
    state.previewFrameMode='raf';
    state.previewFrameHandle=requestAnimationFrame(()=>{
      state.previewFrameHandle=0;
      syncCaptionFrame(video.currentTime);
      queuePreviewFrame();
    });
  }
}

function startPreviewFrameSync(){
  stopPreviewFrameSync();
  syncCaptionFrame(video.currentTime);
  queuePreviewFrame();
}

function captionIndexAtTime(t){
  return state.captions.findIndex(c=>t>=c.start&&t<=c.end);
}

function wordBoundary(left,right,fallback){
  const a=Number(left?.end),b=Number(right?.start);
  if(Number.isFinite(a)&&Number.isFinite(b))return(a+b)/2;
  if(Number.isFinite(a))return a;
  if(Number.isFinite(b))return b;
  return fallback;
}

function activeWordIndexAtTime(words,t,captionStart,captionEnd){
  if(!Array.isArray(words)||!words.length)return-1;
  const time=Number(t)+WORD_SYNC_LEAD_SECONDS;
  const segStart=Number.isFinite(Number(captionStart))?Number(captionStart):Number(words[0]?.start||0);
  const segEnd=Number.isFinite(Number(captionEnd))?Number(captionEnd):Number(words[words.length-1]?.end||segStart);

  if(time<segStart-.04||time>segEnd+.04)return-1;
  if(words.length===1)return 0;

  let previousBoundary=segStart;
  for(let i=0;i<words.length;i++){
    const endBoundary=i===words.length-1
      ?segEnd
      :wordBoundary(words[i],words[i+1],segStart+(segEnd-segStart)*(i+1)/words.length);

    const safeEnd=Math.max(previousBoundary+.001,Math.min(segEnd,endBoundary));
    if(time>=previousBoundary&&time<safeEnd)return i;
    previousBoundary=safeEnd;
  }
  return time<=segEnd+.04?words.length-1:-1;
}

function syncActiveWord(seg,t){
  const overlay=$('#captionOverlay');
  if(!state.style.word_highlight||!seg?.words?.length){
    if(state.previewActiveWordIndex!==-1){
      overlay.querySelector('.word.active-word')?.classList.remove('active-word');
      state.previewActiveWordIndex=-1;
    }
    return;
  }

  const index=activeWordIndexAtTime(seg.words,t,seg.start,seg.end);
  if(index===state.previewActiveWordIndex)return;

  overlay.querySelector('.word.active-word')?.classList.remove('active-word');
  if(index>=0){
    overlay.querySelector(`.word[data-word-index="${index}"]`)?.classList.add('active-word');
  }
  state.previewActiveWordIndex=index;
}

function syncCaptionFrame(t=video.currentTime){
  const index=captionIndexAtTime(t);
  if(index!==state.previewCaptionIndex){
    updateCaptionOverlay(t);
    return;
  }
  if(index<0)return;
  syncActiveWord(state.captions[index],t);
}

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
function reflowCaptions(){const words=state.sourceWords.filter(w=>w.word?.trim()&&Number.isFinite(w.start)&&Number.isFinite(w.end)&&w.end>w.start);if(!words.length){state.captions=[];renderCaptionEditor();return}const s=state.style,lim=speedValues(s.caption_speed),maxLineChars=previewLineLimit(),result=[];let current=[];const flush=()=>{if(!current.length)return;result.push({start:current[0].start,end:current[current.length-1].end,text:current.map(w=>w.word.trim()).join(' ').replace(/\s+([,.!?;:])/g,'$1'),words:current.map(w=>({...w})),originalWords:current.map(w=>({...w}))});current=[]};for(let i=0;i<words.length;i++){const w=words[i];if(current.length){const proposed=current.concat(w),duration=w.end-current[0].start;if(current.length>=s.max_words||duration>lim.maxDuration||!labelsFit(proposed.map(x=>x.word.trim()),maxLineChars,s.max_lines))flush()}current.push(w);const next=words[i+1],gap=next?Math.max(0,next.start-w.end):999,duration=current[current.length-1].end-current[0].start;if(hardBreak.test(w.word)||gap>=lim.pause||current.length>=s.max_words||(duration>=lim.targetDuration&&current.length>=Math.min(3,s.max_words))||(softBreak.test(w.word)&&current.length>=Math.min(3,s.max_words))||!next)flush()}state.captions=result;renderCaptionEditor();$('#captionCountBadge').textContent=`${result.length} captions`;updateExportButtons();}
function splitLines(text,maxLines){const words=(text||'').trim().split(/\s+/).filter(Boolean);if(maxLines===1||words.length<=2)return [words.join(' ')];const maxChars=previewLineLimit();if(words.join(' ').length<=maxChars)return [words.join(' ')];let best=1,score=Infinity;for(let i=1;i<words.length;i++){const a=words.slice(0,i).join(' ').length,b=words.slice(i).join(' ').length,v=Math.max(0,a-maxChars)*1000+Math.max(0,b-maxChars)*1000+Math.max(a,b)*10+Math.abs(a-b);if(v<score){score=v;best=i}}return[words.slice(0,best).join(' '),words.slice(best).join(' ')]}

function captionMetricsForWidth(width){
  const s=state.style,ratio=Math.max(.1,width/576);
  const font=Math.max(14,s.font_size*ratio*(s.scale/100));
  const paddingScale=Math.max(0,s.box_padding)/8;
  return{
    ratio,
    font,
    outline:Math.max(0,s.outline_width*ratio),
    letterSpacing:s.letter_spacing*ratio,
    lineHeight:font*1.08,
    padX:font*.28*paddingScale,
    padY:font*.12*paddingScale,
    radius:font*.18,
    wordGap:font*.18,
    shadowY:s.shadow?Math.max(1,s.shadow*ratio):0,
    shadowBlur:s.shadow?Math.max(2,s.shadow*2*ratio):0,
  };
}
function updateCaptionOverlay(atTime=video.currentTime){
  const overlay=$('#captionOverlay');
  const index=captionIndexAtTime(atTime);

  if(index<0){
    overlay.innerHTML='';
    state.currentCaptionKey='';
    state.previewCaptionIndex=-1;
    state.previewActiveWordIndex=-1;
    return;
  }

  const seg=state.captions[index],s=state.style,stage=$('#videoStage'),stageW=stage.clientWidth||576,m=captionMetricsForWidth(stageW);
  state.previewCaptionIndex=index;
  state.previewActiveWordIndex=-1;

  overlay.style.left=`${s.horizontal_position}%`;
  overlay.style.top=`${s.vertical_position}%`;
  overlay.style.width=`${s.caption_width}%`;
  overlay.style.textAlign=s.horizontal_align;
  overlay.style.fontFamily=`${s.font_family}, sans-serif`;
  overlay.style.fontSize=`${m.font}px`;
  overlay.style.fontWeight=s.bold?'900':'500';
  overlay.style.fontStyle=s.italic?'italic':'normal';
  overlay.style.letterSpacing=`${m.letterSpacing}px`;
  overlay.style.lineHeight='1.08';
  overlay.style.color=s.text_color;
  overlay.style.opacity=String(s.text_opacity/100);
  overlay.style.transform=`translate(-50%,-50%) rotate(${s.rotation}deg)`;
  overlay.style.webkitTextStroke=`${m.outline}px ${s.outline_color}`;
  overlay.style.textShadow=s.shadow?`0 ${m.shadowY}px ${m.shadowBlur}px rgba(0,0,0,.75)`:'none';
  overlay.style.setProperty('--caption-highlight',s.highlight_color);
  overlay.style.setProperty('--word-active-scale',String(1.025+Math.max(0,Math.min(100,s.animation_strength))/100*.035));

  const boxStyle=`background:${hexAlpha(s.background_color,s.background_opacity)};padding:${m.padY}px ${m.padX}px;border-radius:${m.radius}px`;
  const lines=splitLines(captionCase(seg.text),s.max_lines);
  let html='';

  if(s.word_highlight&&seg.words?.length){
    const wordHtml=seg.words.map((w,i)=>
      `<span class="word" data-word-index="${i}">${escapeHtml(captionCase(w.word))}</span>`
    ).join('');
    html=s.background==='box'
      ?`<span class="caption-box" style="${boxStyle}">${wordHtml}</span>`
      :wordHtml;
  }else{
    html=lines.map(line=>
      s.background==='box'
        ?`<span class="caption-box" style="${boxStyle}">${escapeHtml(line)}</span>`
        :escapeHtml(line)
    ).join('<br>');
  }

  overlay.innerHTML=html;
  syncActiveWord(seg,atTime);

  const key=`${index}:${s.animation}`;
  if(key!==state.currentCaptionKey){
    state.currentCaptionKey=key;
    overlay.animate?.(
      animationKeyframes(s.animation,s.animation_strength),
      {
        duration:s.animation==='fade'?Math.max(80,s.fade_in_ms):180,
        easing:'cubic-bezier(.2,.75,.2,1)'
      }
    ).catch?.(()=>{});
  }
}
function animationKeyframes(type,strength){if(type==='fade')return[{opacity:0},{opacity:1}];if(type==='pop'){const scale=.88+(100-strength)/100*.08;return[{opacity:.2,transform:`translate(-50%,-50%) scale(${scale}) rotate(${state.style.rotation}deg)`},{opacity:1,transform:`translate(-50%,-50%) scale(1) rotate(${state.style.rotation}deg)`}]}return[{opacity:1},{opacity:1}]}
function hexAlpha(hex,pct){const h=String(hex).replace('#','');if(h.length!==6)return `rgba(0,0,0,${pct/100})`;const r=parseInt(h.slice(0,2),16),g=parseInt(h.slice(2,4),16),b=parseInt(h.slice(4,6),16);return `rgba(${r},${g},${b},${pct/100})`}


function normalizeCaptionToken(value){
  return String(value||'')
    .toLocaleLowerCase()
    .normalize('NFKC')
    .replace(/[^\p{L}\p{N}]+/gu,'');
}

function retimeEditedCaptionWords(baseWords,text,start,end){
  const tokens=String(text||'').trim().split(/\s+/).filter(Boolean);
  if(!tokens.length)return[];
  const originals=Array.isArray(baseWords)&&baseWords.length?baseWords:[];

  if(!originals.length){
    const duration=Math.max(.05,Number(end)-Number(start));
    return tokens.map((word,i)=>({
      word,
      start:Number(start)+duration*i/tokens.length,
      end:Number(start)+duration*(i+1)/tokens.length
    }));
  }

  const a=originals.map(x=>String(x.word||''));
  const b=tokens;
  const n=a.length,m=b.length;
  const dp=Array.from({length:n+1},()=>new Array(m+1).fill(0));
  const op=Array.from({length:n+1},()=>new Array(m+1).fill(''));

  for(let i=1;i<=n;i++){dp[i][0]=i;op[i][0]='del'}
  for(let j=1;j<=m;j++){dp[0][j]=j;op[0][j]='ins'}

  for(let i=1;i<=n;i++){
    for(let j=1;j<=m;j++){
      const same=normalizeCaptionToken(a[i-1])===normalizeCaptionToken(b[j-1]);
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
    if(action==='diag'){mapping[j-1]=i-1;i--;j--}
    else if(action==='del'){i--}
    else{j--}
  }

  const result=tokens.map((word,idx)=>{
    const oi=mapping[idx];
    if(oi!==null){
      const source=originals[oi];
      return{word,start:Number(source.start),end:Number(source.end)};
    }
    return{word,start:null,end:null};
  });

  let k=0;
  while(k<result.length){
    if(Number.isFinite(result[k].start)&&Number.isFinite(result[k].end)){k++;continue}
    const first=k;
    while(k<result.length&&(!Number.isFinite(result[k].start)||!Number.isFinite(result[k].end)))k++;
    const last=k-1;
    const left=first>0?result[first-1]:null;
    const right=k<result.length?result[k]:null;
    const from=Number.isFinite(left?.end)?left.end:Number(start);
    const to=Number.isFinite(right?.start)?right.start:Number(end);
    const count=last-first+1;
    const safeTo=Math.max(from+.04*count,to);
    const step=(safeTo-from)/count;
    for(let q=0;q<count;q++){
      result[first+q].start=from+step*q;
      result[first+q].end=from+step*(q+1);
    }
  }

  return result;
}

function renderCaptionEditor(){const editor=$('#captionEditor');editor.innerHTML='';$('#emptyCaptions').classList.toggle('hidden',state.captions.length>0);editor.classList.toggle('hidden',!state.captions.length);state.captions.forEach((c,i)=>{if(!c.originalWords)c.originalWords=(c.words||[]).map(w=>({...w}));const row=document.createElement('div');row.className='caption-row';row.innerHTML=`<span class="caption-time">${formatTime(c.start)}<br>${formatTime(c.end)}</span><textarea rows="2"></textarea>`;const ta=row.querySelector('textarea');ta.value=c.text;ta.addEventListener('input',()=>{c.text=ta.value;c.words=retimeEditedCaptionWords(c.originalWords,c.text,c.start,c.end);updateCaptionOverlay()});editor.appendChild(row)})}

// Local + Cloud transcription
$('#modelSelect').addEventListener('change',()=>{updateModelHint();updateCompatibilityNote();updateProcessingModeLabel()});

function isCloudModelSelected(){
  return String($('#modelSelect')?.value||'').startsWith('cloudflare/');
}

function enforceComingSoonModels(){
  // Enhanced remains unavailable. Cloud Large v3 Turbo is intentionally enabled
  // as a separate online test mode and never loads as a local browser model.
  state.enhanced=false;
}

function updateProcessingModeLabel(){
  const cloud=isCloudModelSelected();
  const label=$('#processingModeLabel');
  if(label)label.textContent=cloud?'CLOUD AI':'LOCAL PROCESSING';
  const badge=$('#engineBadge');
  if(badge&&!$('#generateBtn')?.disabled)badge.textContent=cloud?'CLOUD':'LOCAL';
}

function updateModelHint(){
  const v=$('#modelSelect').value;
  const hint=$('#modelHint');
  if(isCloudModelSelected())hint.textContent=isGreekUI()
    ?'CLOUD · HIGH ACCURACY. Χρειάζεται internet και στέλνει μόνο το extracted audio για transcription. Το original video μένει στη συσκευή σου.'
    :'CLOUD · HIGH ACCURACY. Requires internet and sends only extracted audio for transcription. The original video stays on your device.';
  else if(v.includes('small'))hint.textContent=isGreekUI()
    ?'LOCAL · RECOMMENDED. Το Whisper Small είναι η προτεινόμενη local επιλογή με την καλύτερη συνολική ισορροπία ποιότητας.'
    :'LOCAL · RECOMMENDED. Whisper Small is the recommended local option with the best overall quality balance.';
  else if(v.includes('base'))hint.textContent=isGreekUI()
    ?'LOCAL · BALANCED. Καλή local ποιότητα με μικρότερο download και χαμηλότερες απαιτήσεις από το Small.'
    :'LOCAL · BALANCED. Good local quality with a smaller download and lighter requirements than Small.';
  else hint.textContent=isGreekUI()
    ?'LOCAL · FAST TEST. Η πιο γρήγορη local επιλογή για γρήγορο έλεγχο συμβατότητας και δοκιμές.'
    :'LOCAL · FAST TEST. The fastest local option for quick compatibility checks and test runs.';
}
function updateEnhancedUi(){
  state.enhanced=false;
  const btn=$('#enhancedToggle');
  if(!btn)return;
  btn.classList.remove('active');
  btn.disabled=true;
  btn.setAttribute('aria-checked','false');
  btn.setAttribute('aria-disabled','true');
  $('#enhancedToggleText').textContent='SOON';
  $('#enhancedDescription').textContent=isGreekUI()
    ?'Context-aware correction για λανθασμένα αναγνωρισμένες λέξεις, με δεύτερο local AI pass.'
    :'Context-aware correction for misrecognized words using a second local AI pass.';
  $('#enhancedHint').textContent=isGreekUI()
    ?'Η λειτουργία παραμένει ορατή ως preview αλλά δεν είναι ακόμη διαθέσιμη.'
    :'This feature remains visible as a preview but is not available yet.';
}
function updateCompatibilityNote(){
  const note=$('#compatNote');
  const cloud=isCloudModelSelected();
  if(cloud){
    note.classList.remove('hidden');
    note.textContent=isGreekUI()
      ?'Cloud High Accuracy: χρειάζεται σύνδεση internet. Το Kaptiono εξάγει το audio τοπικά και στέλνει μόνο το audio στο cloud transcription service. Το original video δεν ανεβαίνει.'
      :'Cloud High Accuracy: internet is required. Kaptiono extracts audio locally and sends only the audio to the cloud transcription service. The original video is not uploaded.';
  }else if(!window.isSecureContext){
    note.classList.remove('hidden');
    note.textContent=isGreekUI()
      ?'Το HTTPS δεν έχει ενεργοποιηθεί ακόμη. Το Kaptiono χρησιμοποιεί WASM χωρίς persistent AI cache. Τα μεγάλα local AI models θα χρειάζεται να ξαναφορτώνονται συχνότερα.'
      :'HTTPS is not active yet. Kaptiono is using WASM without persistent AI cache. Large local AI models may need to be downloaded again more often.';
  }else if(isIOS){
    note.classList.remove('hidden');
    note.textContent=isGreekUI()
      ?'iPhone: χρησιμοποιούμε WebCodecs/Mediabunny για το audio. Αν το Small είναι βαρύ, επίλεξε Base ή δοκίμασε Cloud High Accuracy.'
      :'iPhone: audio is extracted through WebCodecs/Mediabunny. If Small is too heavy, choose Base or try Cloud High Accuracy.';
  }else note.classList.add('hidden');
  $('#systemDevice').textContent=isIOS?'iPhone / iPad':isSafari?'Safari':'Desktop browser';
}
enforceComingSoonModels();updateCompatibilityNote();updateModelHint();updateEnhancedUi();updateProcessingModeLabel();

function destroyWorker(){if(state.watchdog){clearInterval(state.watchdog);state.watchdog=null}if(state.worker){state.worker.terminate();state.worker=null}}
function touchWorker(){state.lastWorkerActivity=Date.now()}
function createWorker(){destroyWorker();state.worker=new Worker(`./whisper-worker.js?v=${encodeURIComponent(APP_VERSION)}`,{type:'module'});state.worker.onmessage=e=>{touchWorker();onWorkerMessage(e)};state.worker.onerror=e=>{destroyWorker();failProgress(e.message||'Worker error');$('#generateBtn').disabled=false};touchWorker();return state.worker}
function startWatchdog(){if(state.watchdog)clearInterval(state.watchdog);state.watchdog=setInterval(()=>{if(!state.worker)return;const silent=Date.now()-state.lastWorkerActivity;if(silent>90000){destroyWorker();failProgress(isGreekUI()?'Το AI δεν απάντησε για 90 δευτερόλεπτα. Η διαδικασία σταμάτησε αντί να μείνει κολλημένη. Δοκίμασε Base ή Tiny και ξανά.':'The AI did not respond for 90 seconds. Processing was stopped instead of hanging indefinitely. Try Base or Tiny and retry.');$('#generateBtn').disabled=false}},5000)}

function selectedModelFriendlyName(){
  const value=$('#modelSelect')?.value||'';
  if(value.includes('large-v3-turbo'))return 'Whisper Large v3 Turbo';
  if(value.includes('small'))return 'Whisper Small';
  if(value.includes('base'))return 'Whisper Base';
  if(value.includes('tiny'))return 'Whisper Tiny';
  return 'Whisper';
}
function modelReadyStorageKey(){
  return `kaptiono:model-ready:${$('#modelSelect')?.value||'default'}`;
}
function cloudLanguageCode(value){
  return ({greek:'el',english:'en',spanish:'es',french:'fr',german:'de',italian:'it'})[value]||'';
}

function clearProgressMotion(){
  if(state.progressTicker){clearInterval(state.progressTicker);state.progressTicker=null}
  if(state.progressRaf){cancelAnimationFrame(state.progressRaf);state.progressRaf=0}
}
function resetProgressFlow(){
  clearProgressMotion();
  state.progressValue=0;
  state.progressTarget=0;
  $('#progressBar').style.width='0%';
  $('#progressPercent').textContent='0%';
}
function paintProgressValue(){
  $('#progressBar').style.width=`${state.progressValue.toFixed(2)}%`;
  $('#progressPercent').textContent=`${Math.round(state.progressValue)}%`;
}
function setProgressTarget(next){
  const target=Math.max(state.progressTarget,state.progressValue,Math.min(100,Math.max(0,Number(next)||0)));
  state.progressTarget=target;
  if(state.progressRaf)return;
  const animate=()=>{
    const diff=state.progressTarget-state.progressValue;
    if(diff<=0.08){
      state.progressValue=state.progressTarget;
      paintProgressValue();
      state.progressRaf=0;
      return;
    }
    state.progressValue+=Math.max(0.08,diff*.065);
    if(state.progressValue>state.progressTarget)state.progressValue=state.progressTarget;
    paintProgressValue();
    state.progressRaf=requestAnimationFrame(animate);
  };
  state.progressRaf=requestAnimationFrame(animate);
}
function startProgressDrift(cap,amount=.45,interval=550){
  if(state.progressTicker)clearInterval(state.progressTicker);
  state.progressTicker=setInterval(()=>{
    if(state.progressTarget>=cap)return;
    setProgressTarget(Math.min(cap,state.progressTarget+amount));
  },interval);
}
function stopProgressDrift(){
  if(state.progressTicker){clearInterval(state.progressTicker);state.progressTicker=null}
}
function progressCopy(stage){
  const el=isGreekUI(),model=selectedModelFriendlyName(),steps=state.enhanced?5:4,cloud=isCloudModelSelected();
  if(stage==='audio')return el
    ?{step:`Βήμα 1 από ${steps}`,title:'Προετοιμασία video',detail:cloud?'Εξάγουμε το audio τοπικά. Το original video μένει στη συσκευή σου και μόνο το audio θα σταλεί στο Cloud High Accuracy.':'Διαβάζουμε και προετοιμάζουμε το audio τοπικά. Το video δεν ανεβαίνει πουθενά.'}
    :{step:`Step 1 of ${steps}`,title:'Preparing video',detail:cloud?'We extract audio locally. The original video stays on your device and only audio will be sent to Cloud High Accuracy.':'We read and prepare the audio locally. Your video is not uploaded anywhere.'};
  if(stage==='model'){
    if(cloud)return el
      ?{step:`Βήμα 2 από ${steps}`,title:'Σύνδεση Cloud AI',detail:'Ετοιμάζουμε το Whisper Large v3 Turbo στο Kaptiono cloud transcription service.'}
      :{step:`Step 2 of ${steps}`,title:'Connecting to Cloud AI',detail:'Preparing Whisper Large v3 Turbo on the Kaptiono cloud transcription service.'};
    if(state.modelFirstRun){
      if(!window.isSecureContext)return el
        ?{step:`Βήμα 2 από ${steps}`,title:'Λήψη Local AI',detail:`Πρώτη εκτέλεση: κατεβάζουμε το ${model} στη συσκευή για αυτή τη χρήση. Με HTTPS θα μπορεί να αποθηκεύεται τοπικά για τις επόμενες φορές.`}
        :{step:`Step 2 of ${steps}`,title:'Downloading Local AI',detail:`First run: ${model} is downloading to your device for this session. With HTTPS it can be stored locally for future runs.`};
      return el
        ?{step:`Βήμα 2 από ${steps}`,title:'Λήψη Local AI',detail:`Πρώτη εκτέλεση: κατεβάζουμε το ${model} στη συσκευή σου. Στις επόμενες χρήσεις θα φορτώνει από το τοπικό cache.`}
        :{step:`Step 2 of ${steps}`,title:'Downloading Local AI',detail:`First run: ${model} is downloading to your device. Future runs can load it from the local browser cache.`};
    }
    return el
      ?{step:`Βήμα 2 από ${steps}`,title:'Φόρτωση Local AI',detail:`Ετοιμάζουμε το ${model} στη συσκευή σου για την απομαγνητοφώνηση.`}
      :{step:`Step 2 of ${steps}`,title:'Loading Local AI',detail:`Preparing ${model} on your device for transcription.`};
  }
  if(stage==='transcribe')return el
    ?{step:`Βήμα 3 από ${steps}`,title:'Απομαγνητοφώνηση',detail:cloud?'Το Cloud AI μεταγράφει το extracted audio και επιστρέφει λέξεις μαζί με timestamps.':'Το Local AI ακούει το video και δημιουργεί το κείμενο μαζί με τα timestamps.'}
    :{step:`Step 3 of ${steps}`,title:'Transcribing',detail:cloud?'Cloud AI is transcribing the extracted audio and returning words with timestamps.':'Local AI is listening to the video and generating text with timestamps.'};
  if(stage==='enhance')return el
    ?{step:'Βήμα 4 από 5',title:'Enhanced correction',detail:'Δεύτερο multilingual local AI pass ελέγχει το transcript και προσπαθεί να διορθώσει λανθασμένα αναγνωρισμένες λέξεις από τα συμφραζόμενα.'}
    :{step:'Step 4 of 5',title:'Enhanced correction',detail:'A second multilingual local AI pass checks the transcript and tries to correct misrecognized words from context.'};
  if(stage==='finalize')return el
    ?{step:`Βήμα ${state.enhanced?5:4} από ${steps}`,title:'Δημιουργία captions',detail:'Χωρίζουμε το transcript σε captions και εφαρμόζουμε τη ροή και το επιλεγμένο style.'}
    :{step:`Step ${state.enhanced?5:4} of ${steps}`,title:'Creating captions',detail:'We split the transcript into captions and apply the selected flow and style.'};
  if(stage==='done')return el
    ?{step:'Ολοκληρώθηκε',title:'Οι υπότιτλοι είναι έτοιμοι',detail:'Τα captions εμφανίζονται τώρα στη ζωντανή προεπισκόπηση και μπορείς να τα επεξεργαστείς ή να τα εξαγάγεις.'}
    :{step:'Completed',title:'Your captions are ready',detail:'Captions are now visible in the live preview and can be edited or exported.'};
  return el
    ?{step:'Πρόβλημα',title:'Αποτυχία επεξεργασίας',detail:'Η διαδικασία σταμάτησε πριν ολοκληρωθεί.'}
    :{step:'Problem',title:'Processing failed',detail:'The process stopped before it could finish.'};
}

$('#generateBtn').addEventListener('click',generateCaptions);
async function generateCaptions(){
  enforceComingSoonModels();
  if(!state.file)return;
  const cloud=isCloudModelSelected();
  updateProcessingModeLabel();
  trackEvent('generate_captions',{model:$('#modelSelect').value.split('/').pop(),language:$('#languageSelect').value,engine:cloud?'cloud':'local',enhanced:state.enhanced});
  $('#generateBtn').disabled=true;
  state.voiceRetry=false;
  state.voiceRetryImproved=false;
  state.startedAt=performance.now();
  state.modelFirstRun=cloud?false:localStorage.getItem(modelReadyStorageKey())!=='1';
  resetProgressFlow();
  showProgress('audio',2);
  startProgressDrift(10,.18,600);
  try{
    const audio=await extractAudio16k(state.file,p=>{
      showProgress('audio',Math.min(14,2+p*.12));
    });
    stopProgressDrift();

    if(cloud){
      showProgress('model',52);
      $('#engineBadge').textContent='CLOUD';
      $('#systemAi').textContent='Cloud + Whisper Large v3 Turbo';
      await transcribeCloudAudio(audio,video.duration);
      return;
    }

    showProgress('model',16);
    startProgressDrift(54,.22,650);
    $('#engineBadge').textContent='WASM';
    $('#systemAi').textContent='WASM + Whisper';
    const worker=createWorker();
    startWatchdog();
    worker.postMessage({type:'transcribe',audio:audio.buffer,duration:video.duration,device:'wasm',model:$('#modelSelect').value,language:$('#languageSelect').value},[audio.buffer]);
  }catch(e){
    stopProgressDrift();
    destroyWorker();
    cancelCloudRequest();
    failProgress(friendlyError(e));
    $('#generateBtn').disabled=false;
  }
}

function cancelCloudRequest(){
  if(state.cloudAbortController){
    try{state.cloudAbortController.abort()}catch{}
    state.cloudAbortController=null;
  }
}

function writeAscii(view,offset,text){
  for(let i=0;i<text.length;i++)view.setUint8(offset+i,text.charCodeAt(i));
}

function float32ToWavBlob(samples,sampleRate=16000){
  const dataSize=samples.length*2;
  const buffer=new ArrayBuffer(44+dataSize);
  const view=new DataView(buffer);
  writeAscii(view,0,'RIFF');
  view.setUint32(4,36+dataSize,true);
  writeAscii(view,8,'WAVE');
  writeAscii(view,12,'fmt ');
  view.setUint32(16,16,true);
  view.setUint16(20,1,true);
  view.setUint16(22,1,true);
  view.setUint32(24,sampleRate,true);
  view.setUint32(28,sampleRate*2,true);
  view.setUint16(32,2,true);
  view.setUint16(34,16,true);
  writeAscii(view,36,'data');
  view.setUint32(40,dataSize,true);
  let offset=44;
  for(let i=0;i<samples.length;i++,offset+=2){
    const v=Math.max(-1,Math.min(1,Number(samples[i])||0));
    view.setInt16(offset,v<0?v*0x8000:v*0x7fff,true);
  }
  return new Blob([buffer],{type:'audio/wav'});
}

function normalizeCloudWords(result,audioDuration){
  const words=[];
  const segments=Array.isArray(result?.segments)?result.segments:[];
  for(const segment of segments){
    const segmentWords=Array.isArray(segment?.words)?segment.words:[];
    if(segmentWords.length){
      for(const item of segmentWords){
        const word=String(item?.word||'').trim();
        if(!word)continue;
        let start=Number(item?.start),end=Number(item?.end);
        if(!Number.isFinite(start))start=Number(segment?.start)||0;
        if(!Number.isFinite(end)||end<=start)end=start+.20;
        words.push({word,start:Math.max(0,start),end:Math.max(start+.02,end)});
      }
      continue;
    }
    const text=String(segment?.text||'').trim();
    if(!text)continue;
    const tokens=text.split(/\s+/).filter(Boolean);
    let start=Number(segment?.start),end=Number(segment?.end);
    if(!Number.isFinite(start))start=0;
    if(!Number.isFinite(end)||end<=start)end=start+Math.max(.25,tokens.length*.2);
    const step=(end-start)/Math.max(1,tokens.length);
    tokens.forEach((word,i)=>words.push({word,start:start+i*step,end:start+(i+1)*step}));
  }
  if(words.length)return words;
  const text=String(result?.text||'').trim();
  if(!text)return [];
  const tokens=text.split(/\s+/).filter(Boolean);
  const step=Math.max(.08,Number(audioDuration)||0)/Math.max(1,tokens.length);
  return tokens.map((word,i)=>({word,start:i*step,end:(i+1)*step}));
}

async function transcribeCloudAudio(audio,audioDuration){
  cancelCloudRequest();
  const controller=new AbortController();
  state.cloudAbortController=controller;
  const timeout=setTimeout(()=>controller.abort('timeout'),180000);
  const language=cloudLanguageCode($('#languageSelect').value);
  const wav=float32ToWavBlob(audio,16000);
  if(wav.size>25*1024*1024)throw new Error('CLOUD_AUDIO_TOO_LARGE');

  showProgress('model',58);
  stopProgressDrift();
  showProgress('transcribe',62);
  startProgressDrift(92,.30,700);
  trackEvent('cloud_transcription_started',{language:language||'auto',audio_seconds:Math.round(Number(audioDuration)||0)});

  try{
    const headers={'Content-Type':'audio/wav'};
    if(language)headers['X-Kaptiono-Language']=language;
    const response=await fetch(CLOUD_TRANSCRIBE_URL,{
      method:'POST',
      headers,
      body:wav,
      signal:controller.signal,
      cache:'no-store',
    });
    const raw=await response.text();
    let result=null;
    try{result=raw?JSON.parse(raw):null}catch{throw new Error('CLOUD_INVALID_RESPONSE')}
    if(!response.ok){
      throw new Error(result?.message||result?.error||`CLOUD_HTTP_${response.status}`);
    }
    const words=normalizeCloudWords(result,audioDuration);
    stopProgressDrift();
    showProgress('transcribe',95);
    $('#systemAi').textContent=`Cloud + Whisper Large v3 Turbo${result?.transcription_info?.language?` · ${String(result.transcription_info.language).toUpperCase()}`:''}`;
    trackEvent('cloud_transcription_completed',{
      language:result?.transcription_info?.language||language||'auto',
      word_count:words.length,
      neurons:Math.round(Number(result?.usage?.neurons)||0)
    });
    finalizeCaptionWords(words,{enhancedApplied:false,enhancedFallback:false});
  }catch(error){
    trackEvent('cloud_transcription_failed',{reason:String(error?.name==='AbortError'?'timeout':error?.message||error).slice(0,120)});
    if(error?.name==='AbortError')throw new Error('CLOUD_TRANSCRIPTION_TIMEOUT');
    throw error;
  }finally{
    clearTimeout(timeout);
    if(state.cloudAbortController===controller)state.cloudAbortController=null;
  }
}

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
function friendlyError(e){const msg=String(e?.message||e);if(msg.includes('CLOUD_TRANSCRIPTION_TIMEOUT'))return isGreekUI()?'Το Cloud High Accuracy άργησε υπερβολικά να απαντήσει. Δοκίμασε ξανά ή χρησιμοποίησε Local Small.':'Cloud High Accuracy took too long to respond. Try again or use Local Small.';if(msg.includes('CLOUD_AUDIO_TOO_LARGE'))return isGreekUI()?'Το extracted audio είναι πολύ μεγάλο για το Cloud High Accuracy. Χρησιμοποίησε Local Small ή μικρότερο clip.':'The extracted audio is too large for Cloud High Accuracy. Use Local Small or a shorter clip.';if(msg.includes('Failed to fetch')||msg.includes('CLOUD_HTTP_')||msg.includes('CLOUD_INVALID_RESPONSE'))return isGreekUI()?'Δεν ήταν δυνατή η σύνδεση με το Cloud High Accuracy. Έλεγξε τη σύνδεσή σου και δοκίμασε ξανά.':'Could not connect to Cloud High Accuracy. Check your connection and try again.';if(msg.includes('AUDIO_EXTRACTION_FAILED'))return isGreekUI()?'Δεν μπόρεσα να αποκωδικοποιήσω το audio αυτού του αρχείου στο συγκεκριμένο iPhone/browser. Δοκίμασε το ίδιο video ξανά μετά από refresh ή ένα MP4/MOV με AAC.':'Could not decode this file audio on this iPhone/browser. Refresh and retry, or use MP4/MOV with AAC.';if(msg.includes('NO_AUDIO_TRACK'))return isGreekUI()?'Το video δεν έχει audio track.':'The video has no audio track.';return msg}


function enhanceReadyStorageKey(){
  return 'kaptiono:model-ready:onnx-community/Qwen2.5-0.5B-Instruct';
}
function destroyEnhanceWorker(){
  if(state.enhanceWorker){
    state.enhanceWorker.terminate();
    state.enhanceWorker=null;
  }
}
function createEnhanceWorker(){
  destroyEnhanceWorker();
  state.enhanceWorker=new Worker(`./enhance-worker.js?v=${encodeURIComponent(APP_VERSION)}`,{type:'module'});
  state.enhanceWorker.onmessage=e=>onEnhanceWorkerMessage(e);
  state.enhanceWorker.onerror=e=>{
    console.warn('Enhanced worker failed; preserving Whisper transcript',e);
    fallbackFromEnhanced(e?.message||'Enhanced worker error');
  };
  return state.enhanceWorker;
}
function startEnhancedCorrection(words){
  state.pendingEnhanceWords=Array.isArray(words)?words:[];
  state.enhanceFirstRun=localStorage.getItem(enhanceReadyStorageKey())!=='1';
  showProgress('enhance',91,state.enhanceFirstRun
    ?(isGreekUI()
      ?'Φόρτωση Enhanced AI για πρώτη φορά. Το επιπλέον multilingual model κατεβαίνει τοπικά στη συσκευή σου.'
      :'Loading Enhanced AI for the first time. The additional multilingual model is downloading locally to your device.')
    :(isGreekUI()
      ?'Φόρτωση Enhanced AI από το τοπικό cache.'
      :'Loading Enhanced AI from the local browser cache.'));
  startProgressDrift(94,.12,700);
  const worker=createEnhanceWorker();
  worker.postMessage({
    type:'enhance',
    words:state.pendingEnhanceWords,
    language:$('#languageSelect').value
  });
}
function finalizeCaptionWords(words,{enhancedApplied=false,enhancedFallback=false}={}){
  stopProgressDrift();
  showProgress('finalize',99,enhancedFallback
    ?(isGreekUI()
      ?'Το Enhanced δεν ολοκληρώθηκε. Κρατήσαμε με ασφάλεια το αρχικό Whisper transcript και δημιουργούμε τα captions.'
      :'Enhanced did not complete. The original Whisper transcript was safely preserved and captions are being created.')
    :'');
  state.sourceWords=Array.isArray(words)?words:[];
  state.pendingEnhanceWords=null;
  reflowCaptions();
  updateCaptionOverlay();
  trackEvent('captions_generated',{
    word_count:state.sourceWords.length,
    enhanced_requested:state.enhanced,
    enhanced_applied:enhancedApplied,
    enhanced_fallback:enhancedFallback,
    voice_boost_retry:state.voiceRetry,
    voice_boost_improved:state.voiceRetryImproved,
    transcription_engine:isCloudModelSelected()?'cloud':'local',
    model:$('#modelSelect').value.split('/').pop()
  });
  setTimeout(()=>{
    showProgress('done',100);
    $('#generateBtn').disabled=false;
    setTimeout(()=>{
      $('#progressBox').classList.add('hidden');
      clearProgressMotion();
    },1400);
  },260);
}
function fallbackFromEnhanced(message){
  stopProgressDrift();
  destroyEnhanceWorker();
  console.warn('Enhanced fallback:',message);
  trackEvent('enhanced_fallback',{reason:String(message||'unknown').slice(0,120)});
  const original=state.pendingEnhanceWords||[];
  finalizeCaptionWords(original,{enhancedApplied:false,enhancedFallback:true});
}
function onEnhanceWorkerMessage({data}){
  if(data.type==='enhance-cache-status'){
    if(!data.enabled&&!window.isSecureContext){
      $('#systemAi').textContent='WASM + Whisper + Enhanced · no cache';
    }
  }
  if(data.type==='enhance-worker-ready'){
    showProgress('enhance',91.5);
  }
  if(data.type==='enhance-model-progress'){
    const p=Math.max(0,Math.min(100,Number(data.progress)||0));
    showProgress('enhance',Math.min(94.5,91.5+p*.03));
  }
  if(data.type==='enhance-model-ready'){
    stopProgressDrift();
    try{localStorage.setItem(enhanceReadyStorageKey(),'1')}catch{}
    state.enhanceFirstRun=false;
    $('#systemAi').textContent='WASM + Whisper + Enhanced';
    showProgress('enhance',94.5,isGreekUI()
      ?'Το Enhanced AI είναι έτοιμο. Ελέγχουμε τώρα τις λέξεις του transcript με βάση τα συμφραζόμενα.'
      :'Enhanced AI is ready. Checking transcript words against their context.');
    startProgressDrift(97,.10,650);
  }
  if(data.type==='enhance-pass-progress'){
    const p=Math.max(0,Math.min(100,Number(data.progress)||0));
    showProgress('enhance',Math.min(98,94.5+p*.035));
  }
  if(data.type==='enhance-result'){
    stopProgressDrift();
    destroyEnhanceWorker();
    finalizeCaptionWords(data.words||state.pendingEnhanceWords||[],{
      enhancedApplied:Boolean(data.changed),
      enhancedFallback:false
    });
  }
  if(data.type==='enhance-error'){
    fallbackFromEnhanced(data.message||'Enhanced correction failed');
  }
}

function onWorkerMessage({data}){
  if(data.type==='cache-status'){
    if(!data.enabled&&!window.isSecureContext)$('#systemAi').textContent='WASM + Whisper · no cache';
  }
  if(data.type==='worker-ready'){
    showProgress('model',18);
  }
  if(data.type==='model-progress'){
    const p=Math.max(0,Math.min(100,Number(data.progress)||0));
    // Model callbacks can restart from 0 for different files. The UI progress is
    // intentionally monotonic, so it never jumps backwards from e.g. 40% to 30%.
    showProgress('model',Math.min(56,18+p*.38));
  }
  if(data.type==='model-ready'){
    stopProgressDrift();
    try{localStorage.setItem(modelReadyStorageKey(),'1')}catch{}
    state.modelFirstRun=false;
    showProgress('model',58);
  }
  if(data.type==='device'){
    const d=data.device||'wasm';
    $('#engineBadge').textContent=d.toUpperCase();
    $('#systemAi').textContent=`${d.toUpperCase()} + Whisper`;
  }
  if(data.type==='transcribe-start'){
    stopProgressDrift();
    showProgress('transcribe',62);
    startProgressDrift(state.enhanced?88:92,.32,700);
  }
  if(data.type==='transcribe-progress'){
    const p=Math.max(0,Math.min(100,Number(data.progress)||0));
    showProgress('transcribe',Math.min(state.enhanced?90:94,62+p*(state.enhanced?.28:.32)));
  }
  if(data.type==='voice-retry-start'){
    state.voiceRetry=true;
    stopProgressDrift();
    showProgress('transcribe',91,isGreekUI()
      ?'Εντοπίστηκε κυρίως μουσική. Δοκιμάζουμε ξανά αυτόματα με Voice Boost, χρησιμοποιώντας το ίδιο Whisper model και χωρίς επιπλέον AI download.'
      :'Mostly music was detected. Retrying automatically with Voice Boost using the same Whisper model and no additional AI download.');
    startProgressDrift(94,.10,750);
    trackEvent('voice_boost_retry',{reason:data.reason||'music'});
  }
  if(data.type==='voice-retry-result'){
    state.voiceRetryImproved=Boolean(data.improved);
    stopProgressDrift();
    showProgress('transcribe',94,data.improved
      ?(isGreekUI()
        ?'Το Voice Boost ανέκτησε περισσότερη ομιλία. Ολοκληρώνουμε τους υπότιτλους.'
        :'Voice Boost recovered more speech. Finishing your captions.')
      :(isGreekUI()
        ?'Η δεύτερη προσπάθεια δεν ήταν καλύτερη. Κρατάμε με ασφάλεια το αρχικό αποτέλεσμα του Whisper.'
        :'The second attempt was not better. Safely keeping the original Whisper result.'));
  }
  if(data.type==='result'){
    stopProgressDrift();
    const words=data.words||[];
    destroyWorker();
    if(state.enhanced&&words.length){
      startEnhancedCorrection(words);
    }else{
      showProgress('finalize',96);
      finalizeCaptionWords(words,{enhancedApplied:false,enhancedFallback:false});
    }
  }
  if(data.type==='error'){
    stopProgressDrift();
    destroyWorker();
    destroyEnhanceWorker();
    failProgress(data.message||'Transcription failed');
    $('#generateBtn').disabled=false;
  }
}
function showProgress(stage,pct,detailOverride=''){
  const box=$('#progressBox');
  box.classList.remove('hidden');
  const copy=progressCopy(stage);
  $('#progressStep').textContent=copy.step;
  $('#progressTitle').textContent=copy.title;
  $('#progressDetail').textContent=detailOverride||copy.detail;
  setProgressTarget(stage==='error'?state.progressValue:pct);
  $('#progressBar').style.background=stage==='error'?'var(--danger)':'var(--lime)';
  updateElapsed();
}
function updateElapsed(){
  if(!state.startedAt)return;
  $('#elapsed').textContent=formatTime((performance.now()-state.startedAt)/1000);
  if(!$('#progressBox').classList.contains('hidden'))setTimeout(updateElapsed,700);
}
function failProgress(msg){
  stopProgressDrift();
  showProgress('error',state.progressValue,msg);
}

// Export helpers

function exportUiCopy(stage,pct){
  const el=isGreekUI();
  if(stage==='prepare')return el?{
    stage:'ΒΗΜΑ 1 ΑΠΟ 3',
    label:'Προετοιμασία video…',
    detail:'Ετοιμάζουμε το local renderer και το αρχείο για export.',
    safety:'Η επεξεργασία γίνεται τοπικά. Μην κλείσεις αυτή τη σελίδα.',
    value:'ΠΡΟΕΤΟΙΜΑΣΙΑ'
  }:{
    stage:'STEP 1 OF 3',
    label:'Preparing video…',
    detail:'Preparing the local renderer and video for export.',
    safety:'Processing stays local. Keep this page open until the download starts.',
    value:'PREPARING'
  };
  if(stage==='render')return el?{
    stage:'ΒΗΜΑ 2 ΑΠΟ 3',
    label:'Rendering captions…',
    detail:'Σχεδιάζουμε τους υπότιτλους και κωδικοποιούμε το video τοπικά.',
    safety:'Μπορείς να συνεχίσεις να βλέπεις την πρόοδο. Μην κλείσεις τη σελίδα.',
    value:`${Math.max(0,Math.min(100,Math.round(Number(pct)||0)))}%`
  }:{
    stage:'STEP 2 OF 3',
    label:'Rendering captions…',
    detail:'Rendering captions and encoding the video locally.',
    safety:'You can follow the progress here. Keep this page open until it finishes.',
    value:`${Math.max(0,Math.min(100,Math.round(Number(pct)||0)))}%`
  };
  if(stage==='finalize')return el?{
    stage:'ΒΗΜΑ 3 ΑΠΟ 3',
    label:'Ολοκλήρωση αρχείου…',
    detail:'Το rendering τελείωσε. Συνθέτουμε το τελικό αρχείο για λήψη.',
    safety:'Λίγο ακόμη. Η λήψη θα ξεκινήσει αυτόματα.',
    value:'FINALIZING'
  }:{
    stage:'STEP 3 OF 3',
    label:'Finalizing file…',
    detail:'Rendering is complete. Building the final file for download.',
    safety:'Almost there. The download will start automatically.',
    value:'FINALIZING'
  };
  if(stage==='done')return el?{
    stage:'ΟΛΟΚΛΗΡΩΘΗΚΕ',
    label:'Το video είναι έτοιμο',
    detail:'Η λήψη ξεκίνησε στη συσκευή σου.',
    safety:'Μπορείς να συνεχίσεις την επεξεργασία ή να κάνεις νέο export.',
    value:'100%'
  }:{
    stage:'COMPLETED',
    label:'Your video is ready',
    detail:'The download has started on your device.',
    safety:'You can keep editing or create another export.',
    value:'100%'
  };
  if(stage==='error')return el?{
    stage:'ΠΡΟΒΛΗΜΑ',
    label:'Το export δεν ολοκληρώθηκε',
    detail:'Δες το μήνυμα σφάλματος και δοκίμασε ξανά.',
    safety:'Το αρχικό video και τα captions σου δεν επηρεάστηκαν.',
    value:'!'
  }:{
    stage:'PROBLEM',
    label:'Export did not complete',
    detail:'Check the error message and try again.',
    safety:'Your original video and captions were not affected.',
    value:'!'
  };
  return el?{
    stage:'LOCAL EXPORT',
    label:'Λήψη video με υπότιτλους',
    detail:'Δημιουργείται τοπικά στη συσκευή σου.',
    safety:'',
    value:''
  }:{
    stage:'LOCAL EXPORT',
    label:'Download video with captions',
    detail:'Created locally on your device.',
    safety:'',
    value:''
  };
}

function setExportUi(stage,pct=null){
  state.exportStage=stage;
  state.exportPct=pct;
  const copy=exportUiCopy(stage,pct);
  const active=stage!=='idle';
  const indeterminate=stage==='prepare'||stage==='finalize';
  const numeric=stage==='render'?Math.max(0,Math.min(100,Number(pct)||0)):(stage==='done'?100:null);

  $('#quickVideoExportLabel').textContent=copy.label;
  $('#quickExportHint').textContent=active?copy.detail:(isGreekUI()?'Δημιουργείται τοπικά στη συσκευή σου.':'Created locally on your device.');
  $('#videoDownloadLabel').textContent=copy.label;
  $('#quickVideoExportIcon').textContent=stage==='done'?'✓':stage==='error'?'!':active?'…':'↓';
  $('#videoDownloadIcon').textContent=stage==='done'?'✓':stage==='error'?'!':active?'…':'↓';

  $('#quickExportProgress').classList.toggle('hidden',!active);
  $('#exportProgress').classList.toggle('hidden',!active);
  if(!active)return;

  $('#quickExportStage').textContent=copy.stage;
  $('#quickExportProgressValue').textContent=copy.value;
  $('#quickExportProgressText').textContent=copy.safety;
  $('#exportStageLabel').textContent=copy.stage;
  $('#exportDetail').textContent=copy.value;
  $('#exportProgressTitle').textContent=copy.label.replace(/…$/,'');
  $('#exportProgressText').textContent=copy.detail;
  $('#exportProgressSafety').textContent=copy.safety;

  for(const id of ['quickExportTrack','exportTrack']){
    const track=$('#'+id);
    track.classList.toggle('is-indeterminate',indeterminate);
    track.classList.toggle('is-error',stage==='error');
    track.classList.toggle('is-done',stage==='done');
  }

  const width=numeric===null?(stage==='finalize'?100:0):numeric;
  $('#quickExportBar').style.width=`${width}%`;
  $('#exportBar').style.width=`${width}%`;
}

function resetExportUi(){
  state.exportStage='idle';
  state.exportPct=null;
  setExportUi('idle',null);
  $('#quickExportProgress').classList.add('hidden');
  $('#exportProgress').classList.add('hidden');
  $('#quickVideoExportLabel').textContent=isGreekUI()?'Λήψη video με υπότιτλους':'Download video with captions';
  $('#quickExportHint').textContent=isGreekUI()?'Δημιουργείται τοπικά στη συσκευή σου.':'Created locally on your device.';
  $('#videoDownloadLabel').textContent=isGreekUI()?'Λήψη video με υπότιτλους':'Download video with captions';
  $('#quickVideoExportIcon').textContent='↓';
  $('#videoDownloadIcon').textContent='↓';
}

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
  const ok=state.captions.length>0,format=preferredVideoRecorderFormat(),videoOk=ok&&!!format&&!state.exporting;
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
  if(state.exporting||!state.file||!state.captions.length)return;
  const format=preferredVideoRecorderFormat();
  if(!format){
    alert(isGreekUI()?'Ο browser σου δεν υποστηρίζει ακόμη local video export. Μπορείς να κατεβάσεις SRT/TXT.':'Your browser does not support local video export yet. You can still download SRT/TXT.');
    return;
  }

  trackEvent('video_export_started',{caption_count:state.captions.length,format:format.ext});
  state.exporting=true;
  updateExportButtons();

  // Immediate acknowledgement of the click, before metadata/audio/canvas setup begins.
  setExportUi('prepare',null);

  let ac=null;
  let src=null;
  try{
    // Let the browser paint the feedback state before starting heavier setup work.
    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));

    src=document.createElement('video');
    src.src=state.url;
    src.preload='auto';
    src.playsInline=true;
    src.setAttribute('playsinline','');

    await new Promise((res,rej)=>{
      src.onloadedmetadata=res;
      src.onerror=()=>rej(new Error(isGreekUI()?'Αποτυχία φόρτωσης video για export.':'Video load failed for export.'));
    });

    const maxDim=1080;
    const sc=Math.min(1,maxDim/Math.max(src.videoWidth,src.videoHeight));
    const w=Math.max(2,Math.round(src.videoWidth*sc/2)*2);
    const h=Math.max(2,Math.round(src.videoHeight*sc/2)*2);
    const canvas=document.createElement('canvas');
    canvas.width=w;
    canvas.height=h;

    const ctx=canvas.getContext('2d',{alpha:false});
    if(!ctx)throw new Error('Canvas unavailable');

    const stream=canvas.captureStream(30);
    ac=new AudioContext();
    await ac.resume();
    const node=ac.createMediaElementSource(src);
    const dest=ac.createMediaStreamDestination();
    node.connect(dest);
    dest.stream.getAudioTracks().forEach(t=>stream.addTrack(t));

    const rec=new MediaRecorder(stream,{mimeType:format.mime,videoBitsPerSecond:6_000_000});
    const blobs=[];
    rec.ondataavailable=e=>e.data.size&&blobs.push(e.data);
    const stopped=new Promise((res,rej)=>{
      rec.onstop=res;
      rec.onerror=e=>rej(e.error||new Error('MediaRecorder error'));
    });

    rec.start(1000);
    setExportUi('render',0);

    let lastPct=-1;
    const draw=()=>{
      try{
        ctx.drawImage(src,0,0,w,h);
        drawCanvasCaption(ctx,w,h,src.currentTime);
      }catch{}

      const pct=Math.min(100,src.duration?src.currentTime/src.duration*100:0);
      const rounded=Math.round(pct);
      if(rounded!==lastPct){
        lastPct=rounded;
        setExportUi('render',pct);
      }
      if(!src.paused&&!src.ended)requestAnimationFrame(draw);
    };

    await src.play();
    draw();

    await new Promise((res,rej)=>{
      src.onended=res;
      src.onerror=()=>rej(new Error('Playback failed during export'));
    });

    setExportUi('finalize',null);
    rec.stop();
    await stopped;

    const outMime=rec.mimeType||format.mime;
    const outputBlob=new Blob(blobs,{type:outMime});
    downloadBlob(outputBlob,`${baseName()}.${format.ext}`);

    trackEvent('video_export_completed',{
      caption_count:state.captions.length,
      format:format.ext,
      size_bytes:outputBlob.size
    });

    setExportUi('done',100);
  }catch(e){
    setExportUi('error',null);
    alert((isGreekUI()?'Το video export απέτυχε: ':'Video export failed: ')+(e?.message||String(e)));
  }finally{
    try{src?.pause()}catch{}
    try{await ac?.close()}catch{}
    state.exporting=false;
    updateExportButtons();

    // Success clears automatically after the acknowledgement. Errors remain visible
    // long enough to make it clear that the click was registered and something failed.
    if(state.exportStage==='done'){
      setTimeout(()=>resetExportUi(),1800);
    }else if(state.exportStage==='error'){
      setTimeout(()=>resetExportUi(),5000);
    }else{
      setTimeout(()=>resetExportUi(),1200);
    }
  }
}
function canvasFontSpec(s,font){
  const family=/\s/.test(s.font_family)?`"${s.font_family}"`:s.font_family;
  return `${s.italic?'italic ':''}${s.bold?'900':'500'} ${font}px ${family}, sans-serif`;
}
function canvasTextWidth(ctx,text,letterSpacing=0){
  const chars=Array.from(String(text||''));
  return ctx.measureText(chars.join('')).width+Math.max(0,chars.length-1)*letterSpacing;
}
function canvasRoundRect(ctx,x,y,w,h,r){
  if(w<=0||h<=0)return;
  const rr=Math.max(0,Math.min(r,w/2,h/2));
  ctx.beginPath();
  if(typeof ctx.roundRect==='function')ctx.roundRect(x,y,w,h,rr);
  else{
    ctx.moveTo(x+rr,y);ctx.lineTo(x+w-rr,y);ctx.quadraticCurveTo(x+w,y,x+w,y+rr);ctx.lineTo(x+w,y+h-rr);ctx.quadraticCurveTo(x+w,y+h,x+w-rr,y+h);ctx.lineTo(x+rr,y+h);ctx.quadraticCurveTo(x,y+h,x,y+h-rr);ctx.lineTo(x,y+rr);ctx.quadraticCurveTo(x,y,x+rr,y);ctx.closePath();
  }
}
function canvasLineStart(align,maxW,lineW){
  if(align==='left')return-maxW/2;
  if(align==='right')return maxW/2-lineW;
  return-lineW/2;
}
function drawCanvasSpacedText(ctx,text,startX,y,letterSpacing,{stroke=true,fill=true}={}){
  const chars=Array.from(String(text||''));
  let x=startX;
  for(const ch of chars){
    if(stroke&&ctx.lineWidth>0)ctx.strokeText(ch,x,y);
    if(fill)ctx.fillText(ch,x,y);
    x+=ctx.measureText(ch).width+letterSpacing;
  }
}
function captionAnimationAt(seg,s,t){
  const elapsed=Math.max(0,(t-seg.start)*1000);
  if(s.animation==='fade')return{alpha:Math.min(1,elapsed/Math.max(80,s.fade_in_ms)),scale:1};
  if(s.animation==='pop'){
    const p=Math.min(1,elapsed/180),start=.88+(100-s.animation_strength)/100*.08;
    return{alpha:.2+.8*p,scale:start+(1-start)*p};
  }
  return{alpha:1,scale:1};
}
function layoutCanvasWords(ctx,words,maxW,maxLines,m){
  const lines=[];let line=[],lineW=0;
  for(let index=0;index<words.length;index++){
    const word=words[index];
    const text=captionCase(word.word),ww=canvasTextWidth(ctx,text,m.letterSpacing),gap=line.length?m.wordGap:0;
    if(line.length&&lineW+gap+ww>maxW&&lines.length<maxLines-1){lines.push({items:line,width:lineW});line=[];lineW=0}
    const nextGap=line.length?m.wordGap:0;
    line.push({word,index,text,width:ww,gap:nextGap});lineW+=nextGap+ww;
  }
  if(line.length)lines.push({items:line,width:lineW});
  return lines.slice(0,maxLines);
}
function drawCanvasCaption(ctx,w,h,t){
  const seg=state.captions.find(c=>t>=c.start&&t<=c.end);if(!seg)return;
  const s=state.style,m=captionMetricsForWidth(w),x=w*s.horizontal_position/100,y=h*s.vertical_position/100,maxW=w*s.caption_width/100,anim=captionAnimationAt(seg,s,t),activeWordIndex=s.word_highlight&&seg.words?.length?activeWordIndexAtTime(seg.words,t,seg.start,seg.end):-1;
  ctx.save();
  ctx.translate(x,y);ctx.rotate(s.rotation*Math.PI/180);ctx.scale(anim.scale,anim.scale);
  ctx.globalAlpha=Math.max(0,Math.min(1,s.text_opacity/100))*anim.alpha;
  ctx.font=canvasFontSpec(s,m.font);ctx.textAlign='left';ctx.textBaseline='middle';ctx.lineJoin='round';ctx.lineCap='round';ctx.lineWidth=m.outline;ctx.strokeStyle=s.outline_color;
  const lineData=[];
  if(s.word_highlight&&seg.words?.length){
    layoutCanvasWords(ctx,seg.words,maxW,s.max_lines,m).forEach(l=>lineData.push({type:'words',...l}));
  }else{
    splitLines(captionCase(seg.text),s.max_lines).forEach(text=>lineData.push({type:'text',text,width:canvasTextWidth(ctx,text,m.letterSpacing)}));
  }
  if(!lineData.length){ctx.restore();return}
  const totalH=(lineData.length-1)*m.lineHeight+m.font;
  // Background is drawn per visual line, matching CSS box-decoration-break behavior.
  if(s.background==='box'){
    ctx.fillStyle=hexAlpha(s.background_color,s.background_opacity);
    lineData.forEach((line,i)=>{
      const yy=(i-(lineData.length-1)/2)*m.lineHeight;
      const start=canvasLineStart(s.horizontal_align,maxW,line.width);
      canvasRoundRect(ctx,start-m.padX,yy-m.font*.5-m.padY,line.width+m.padX*2,m.font+m.padY*2,m.radius);
      ctx.fill();
    });
  }
  // Text shadow applies only to glyphs, just like the live CSS overlay.
  if(s.shadow){ctx.shadowOffsetX=0;ctx.shadowOffsetY=m.shadowY;ctx.shadowBlur=m.shadowBlur;ctx.shadowColor='rgba(0,0,0,.75)'}
  lineData.forEach((line,i)=>{
    const yy=(i-(lineData.length-1)/2)*m.lineHeight,start=canvasLineStart(s.horizontal_align,maxW,line.width);
    if(line.type==='text'){
      ctx.fillStyle=s.text_color;
      drawCanvasSpacedText(ctx,line.text,start,yy,m.letterSpacing);
      return;
    }
    let cursor=start;
    line.items.forEach(item=>{
      cursor+=item.gap;
      const active=item.index===activeWordIndex;
      ctx.fillStyle=active?s.highlight_color:s.text_color;
      if(active){
        const activeScale=1.025+Math.max(0,Math.min(100,s.animation_strength))/100*.035;
        ctx.save();
        ctx.translate(cursor+item.width/2,yy);
        ctx.scale(activeScale,activeScale);
        drawCanvasSpacedText(ctx,item.text,-item.width/2,0,m.letterSpacing);
        ctx.restore();
      }else{
        drawCanvasSpacedText(ctx,item.text,cursor,yy,m.letterSpacing);
      }
      cursor+=item.width;
    });
  });
  ctx.restore();
}

// Browser capability status
$('#systemAi').textContent='Whisper Small · WASM';$('#systemAudio').textContent=('AudioDecoder' in window)?'WebCodecs + Mediabunny':'Mediabunny + Web Audio';$('#systemDevice').textContent=isIOS?'iPhone / iPad':isSafari?'Safari':'Desktop browser';

// PWA install and update lifecycle

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


function finishAppBoot(){
  requestAnimationFrame(()=>{
    document.documentElement.classList.add('app-ready');
    const splash=$('#appSplash');
    if(splash)setTimeout(()=>splash.remove(),320);
  });
}
finishAppBoot();
