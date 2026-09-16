(() => {
  'use strict';
  const deviceLang=()=>/^el(?:-|$)/.test((navigator.languages?.[0]||navigator.language||'').toLowerCase())?'el':'en';
  const getLang=()=>{try{const saved=localStorage.getItem('kaptiono-lang');const explicit=localStorage.getItem('kaptiono-lang-explicit-v1')==='1';if(explicit&&(saved==='el'||saved==='en'))return saved;if(saved==='en')return 'en'}catch{}return deviceLang()};
  const titles={el:'Kaptiono - Συνεργασίες με το Kaptiono',en:'Kaptiono - Partner with Kaptiono'};
  const descriptions={el:'Συνεργασίες για creator tools, software, hardware και brands μέσα σε ένα privacy-first AI subtitle workflow.',en:'Partnership opportunities for creator tools, software, hardware and brands inside a privacy-first AI subtitle workflow.'};
  function apply(lang,persist=false){if(lang!=='el'&&lang!=='en')lang='en';document.documentElement.lang=lang;document.querySelectorAll('[data-el][data-en]').forEach(el=>el.textContent=el.dataset[lang]);document.querySelectorAll('[data-lang]').forEach(btn=>btn.classList.toggle('active',btn.dataset.lang===lang));document.title=titles[lang];document.querySelector('meta[name="description"]')?.setAttribute('content',descriptions[lang]);if(persist){try{localStorage.setItem('kaptiono-lang',lang);localStorage.setItem('kaptiono-lang-explicit-v1','1')}catch{}}window.dispatchEvent(new CustomEvent('kaptiono:languagechange',{detail:{lang}}))}
  document.querySelectorAll('[data-lang]').forEach(btn=>btn.addEventListener('click',()=>apply(btn.dataset.lang,true)));
  apply(getLang());
})();
