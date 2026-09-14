(() => {
  'use strict';
  const LANG_PREF_KEY='kaptiono-lang';
  const LANG_EXPLICIT_KEY='kaptiono-lang-explicit-v1';
  const buttons=[...document.querySelectorAll('[data-legal-lang]')];
  const copies=[...document.querySelectorAll('[data-lang-copy]')];
  const deviceLang=()=>{
    const primary=(navigator.languages?.[0]||navigator.language||'').toLowerCase();
    return /^el(?:-|$)/.test(primary)?'el':'en';
  };
  const initialLang=()=>{
    const device=deviceLang();
    try{
      const saved=localStorage.getItem(LANG_PREF_KEY);
      const explicit=localStorage.getItem(LANG_EXPLICIT_KEY)==='1';
      if(explicit&&(saved==='el'||saved==='en'))return saved;
      if(saved==='en'){
        localStorage.setItem(LANG_EXPLICIT_KEY,'1');
        return 'en';
      }
    }catch{}
    return device;
  };
  function apply(lang,remember=false){
    lang=lang==='el'?'el':'en';document.documentElement.lang=lang;
    if(remember){try{localStorage.setItem(LANG_PREF_KEY,lang);localStorage.setItem(LANG_EXPLICIT_KEY,'1')}catch{}}
    buttons.forEach(b=>b.classList.toggle('active',b.dataset.legalLang===lang));
    copies.forEach(el=>el.classList.toggle('active',el.dataset.langCopy===lang));
    window.dispatchEvent(new CustomEvent('kaptiono:languagechange',{detail:{lang}}));
  }
  buttons.forEach(b=>b.addEventListener('click',()=>apply(b.dataset.legalLang,true)));
  apply(initialLang());
})();
