(() => {
  'use strict';
  // The visible UI can switch language, but this URL keeps one canonical English SEO title and description.
  // If dedicated /el/ URLs are introduced later, localized metadata should move to those URLs with hreflang.
  const getDeviceLang=()=>{
    const primary=(navigator.languages?.[0]||navigator.language||'').toLowerCase();
    return /^el(?:-|$)/.test(primary)?'el':'en';
  };
  const getLang=()=>{
    try{
      const saved=localStorage.getItem('kaptiono-lang');
      const explicit=localStorage.getItem('kaptiono-lang-explicit-v1')==='1';
      if(explicit&&(saved==='el'||saved==='en'))return saved;
      if(saved==='en')return 'en';
    }catch{}
    return getDeviceLang();
  };
  const SEO_TITLE='Kaptiono - AI Subtitles Built for Creators';
  const SEO_DESCRIPTION='Explore Kaptiono, a privacy-first AI subtitle generator with Local Whisper, optional Cloud High Accuracy, caption editing, mobile PWA support and no-watermark export.';
  function apply(lang,persist=false){
    if(lang!=='el'&&lang!=='en')lang='en';
    document.documentElement.lang=lang;
    document.querySelectorAll('[data-el][data-en]').forEach(el=>{el.textContent=el.dataset[lang]});
    document.querySelectorAll('[data-lang]').forEach(btn=>btn.classList.toggle('active',btn.dataset.lang===lang));
    document.title=SEO_TITLE;
    const meta=document.querySelector('meta[name="description"]');
    if(meta)meta.setAttribute('content',SEO_DESCRIPTION);
    if(persist){
      try{localStorage.setItem('kaptiono-lang',lang);localStorage.setItem('kaptiono-lang-explicit-v1','1')}catch{}
    }
    window.dispatchEvent(new CustomEvent('kaptiono:languagechange',{detail:{lang}}));
  }
  document.querySelectorAll('[data-lang]').forEach(btn=>btn.addEventListener('click',()=>apply(btn.dataset.lang,true)));
  apply(getLang());
})();
