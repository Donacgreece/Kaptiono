(() => {
  'use strict';
  const buttons=[...document.querySelectorAll('[data-legal-lang]')];
  const copies=[...document.querySelectorAll('[data-lang-copy]')];
  function apply(lang){
    lang=lang==='en'?'en':'el';document.documentElement.lang=lang;
    try{localStorage.setItem('kaptiono-lang',lang)}catch{}
    buttons.forEach(b=>b.classList.toggle('active',b.dataset.legalLang===lang));
    copies.forEach(el=>el.classList.toggle('active',el.dataset.langCopy===lang));
    window.dispatchEvent(new CustomEvent('kaptiono:languagechange',{detail:{lang}}));
  }
  buttons.forEach(b=>b.addEventListener('click',()=>apply(b.dataset.legalLang)));
  let initial='el';try{initial=localStorage.getItem('kaptiono-lang')==='en'?'en':'el'}catch{}
  apply(initial);
})();
