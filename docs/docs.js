(()=>{
  'use strict';
  const $=(s,c=document)=>c.querySelector(s);
  const $$=(s,c=document)=>[...c.querySelectorAll(s)];
  const search=$('#docsSearch');
  const topbar=$('.docs-topbar');
  const sections=$$('.doc-section[data-search]');
  const navLinks=$$('.docs-sidebar a[href^="#"]');
  const tocLinks=$$('.docs-toc a[href^="#"]');
  const summary=$('#searchSummary');
  const empty=$('#searchEmpty');
  const norm=v=>String(v||'').toLocaleLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'');
  function runSearch(){
    const q=norm(search?.value).trim();
    let visible=0;
    sections.forEach(section=>{
      const hay=norm(`${section.dataset.search||''} ${section.textContent||''}`);
      const show=!q||hay.includes(q);
      section.hidden=!show;
      if(show)visible++;
    });
    navLinks.forEach(link=>{
      const id=(link.getAttribute('href')||'').slice(1);
      const target=document.getElementById(id);
      link.style.display=(!q||!target||!target.hidden)?'':'none';
    });
    if(summary){
      summary.classList.toggle('show',!!q);
      if(q)summary.textContent=`${visible} ${visible===1?(document.documentElement.lang==='el'?'αποτέλεσμα':'result'):(document.documentElement.lang==='el'?'αποτελέσματα':'results')} · “${search.value.trim()}”`;
    }
    empty?.classList.toggle('show',!!q&&visible===0);
  }
  search?.addEventListener('input',runSearch);
  document.addEventListener('keydown',e=>{
    if(e.key==='/'&&!/input|textarea|select/i.test(document.activeElement?.tagName||'')){e.preventDefault();topbar?.classList.add('search-open');search?.focus()}
    if(e.key==='Escape'){if(search&&search.value){search.value='';runSearch()}else{document.body.classList.remove('docs-nav-open');topbar?.classList.remove('search-open')}}
  });
  $('#docsMenuBtn')?.addEventListener('click',()=>document.body.classList.toggle('docs-nav-open'));
  $('#docsOverlay')?.addEventListener('click',()=>document.body.classList.remove('docs-nav-open'));
  $('#docsSearchToggle')?.addEventListener('click',()=>{topbar?.classList.toggle('search-open');if(topbar?.classList.contains('search-open'))setTimeout(()=>search?.focus(),30)});
  navLinks.forEach(a=>a.addEventListener('click',()=>document.body.classList.remove('docs-nav-open')));
  const allLinks=[...navLinks,...tocLinks];
  const byId=new Map(allLinks.map(a=>[(a.getAttribute('href')||'').slice(1),a]));
  const observer=new IntersectionObserver(entries=>{
    const hit=entries.filter(x=>x.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top)[0];
    if(!hit)return;
    const id=hit.target.id;
    allLinks.forEach(a=>a.classList.toggle('active',(a.getAttribute('href')||'')===`#${id}`));
  },{rootMargin:'-18% 0px -68% 0px',threshold:[0,.05]});
  sections.forEach(s=>observer.observe(s));
  if(location.hash){setTimeout(()=>document.querySelector(location.hash)?.scrollIntoView({block:'start'}),80)}
})();
