(() => {
  'use strict';
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
  const titles={
    el:'Kaptiono · AI υπότιτλοι για creators',
    en:'Kaptiono · AI subtitles built for creators'
  };
  const descriptions={
    el:'Γνώρισε το Kaptiono, ένα privacy-first εργαλείο AI υποτίτλων για creators με Local Whisper, προαιρετικό Cloud High Accuracy, editing και export χωρίς watermark.',
    en:'Meet Kaptiono, a privacy-first AI subtitle tool for creators. Generate, edit, style and export captions with Local Whisper or optional Cloud High Accuracy.'
  };
  function apply(lang,persist=false){
    if(lang!=='el'&&lang!=='en')lang='en';
    document.documentElement.lang=lang;
    document.querySelectorAll('[data-el][data-en]').forEach(el=>{el.textContent=el.dataset[lang]});
    document.querySelectorAll('[data-lang]').forEach(btn=>btn.classList.toggle('active',btn.dataset.lang===lang));
    document.title=titles[lang];
    const meta=document.querySelector('meta[name="description"]');
    if(meta)meta.setAttribute('content',descriptions[lang]);
    if(persist){
      try{localStorage.setItem('kaptiono-lang',lang);localStorage.setItem('kaptiono-lang-explicit-v1','1')}catch{}
    }
    window.dispatchEvent(new CustomEvent('kaptiono:languagechange',{detail:{lang}}));
  }
  document.querySelectorAll('[data-lang]').forEach(btn=>btn.addEventListener('click',()=>apply(btn.dataset.lang,true)));
  apply(getLang());
})();
