(() => {
  'use strict';

  const KEY='kaptiono:privacy-consent-v1';
  const VERSION=1;
  const MAX_AGE=180*24*60*60*1000;
  const GA_ID='G-YFEYPK43QF';
  let state={analytics:false,decided:false};
  let gaLoaded=false;
  let banner=null,modal=null,toggle=null;

  const copy={
    el:{title:'Απόρρητο με επιλογή',text:'Χρησιμοποιούμε απαραίτητη τοπική αποθήκευση για να λειτουργεί η εφαρμογή. Το Google Analytics είναι προαιρετικό και μένει κλειστό μέχρι να το επιλέξεις.',learn:'Privacy & Cookies',accept:'Αποδοχή Analytics',reject:'Απόρριψη προαιρετικών',settings:'Ρυθμίσεις',settingsTitle:'Ρυθμίσεις απορρήτου',settingsText:'Εσύ αποφασίζεις τι επιτρέπεται. Μπορείς να αλλάξεις την επιλογή σου οποιαδήποτε στιγμή από το footer.',essential:'Απαραίτητα',essentialText:'Γλώσσα, προτιμήσεις εφαρμογής, κατάσταση Local models και επιλογή συγκατάθεσης.',analytics:'Analytics',analyticsText:'Προαιρετικό Google Analytics για συγκεντρωτική μέτρηση χρήσης και βελτίωση του προϊόντος.',always:'ΠΑΝΤΑ ΕΝΕΡΓΟ',optional:'ΠΡΟΑΙΡΕΤΙΚΟ',save:'Αποθήκευση επιλογών',privacy:'Privacy Policy',cookies:'Cookie Policy',terms:'Terms of Use',close:'Κλείσιμο'},
    en:{title:'Privacy by choice',text:'We use essential local storage to keep the app working. Google Analytics is optional and stays off until you choose it.',learn:'Privacy & Cookies',accept:'Accept Analytics',reject:'Reject optional',settings:'Settings',settingsTitle:'Privacy settings',settingsText:'You decide what is allowed. You can change your choice at any time from the footer.',essential:'Essential',essentialText:'Language, app preferences, Local model state and your consent choice.',analytics:'Analytics',analyticsText:'Optional Google Analytics for aggregate usage measurement and product improvement.',always:'ALWAYS ON',optional:'OPTIONAL',save:'Save preferences',privacy:'Privacy Policy',cookies:'Cookie Policy',terms:'Terms of Use',close:'Close'}
  };

  const lang=()=>{try{return localStorage.getItem('kaptiono-lang')==='en'?'en':'el'}catch{return document.documentElement.lang==='en'?'en':'el'}};
  const store=v=>{state={analytics:!!v,decided:true};window.KaptionoConsent={...state};try{localStorage.setItem(KEY,JSON.stringify({version:VERSION,analytics:state.analytics,savedAt:Date.now()}))}catch{}};
  const read=()=>{try{const v=JSON.parse(localStorage.getItem(KEY)||'null');if(!v||v.version!==VERSION||!v.savedAt||Date.now()-v.savedAt>MAX_AGE)return null;return {analytics:v.analytics===true,decided:true}}catch{return null}};
  const clearGaCookies=()=>{try{document.cookie.split(';').forEach(x=>{const n=x.split('=')[0].trim();if(!/^(_ga|_gid|_gat)/.test(n))return;const e='Thu, 01 Jan 1970 00:00:00 GMT';document.cookie=`${n}=;expires=${e};path=/;SameSite=Lax`;document.cookie=`${n}=;expires=${e};path=/;domain=.kaptiono.com;SameSite=Lax`})}catch{}};

  function loadAnalytics(){
    if(gaLoaded){try{gtag('consent','update',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'})}catch{}return} gaLoaded=true;
    window.dataLayer=window.dataLayer||[];
    window.gtag=window.gtag||function(){window.dataLayer.push(arguments)};
    gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
    gtag('consent','update',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
    gtag('set','ads_data_redaction',true);
    gtag('js',new Date());
    gtag('config',GA_ID,{anonymize_ip:true,send_page_view:true,allow_google_signals:false,allow_ad_personalization_signals:false});
    const s=document.createElement('script');s.async=true;s.src=`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;s.dataset.kaptionoAnalytics='1';document.head.appendChild(s);
  }

  function apply(v,persist=true){
    if(persist)store(v);else{state={analytics:!!v,decided:true};window.KaptionoConsent={...state}}
    if(state.analytics)loadAnalytics();
    else{if(typeof window.gtag==='function'){try{gtag('consent','update',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'})}catch{}}clearGaCookies()}
    hideBanner();hideModal();document.dispatchEvent(new CustomEvent('kaptiono:consentchange',{detail:{...state}}));
  }

  function build(){
    if(banner)return;
    banner=document.createElement('section');banner.id='privacyBanner';banner.className='privacy-banner hidden';banner.setAttribute('role','dialog');banner.setAttribute('aria-labelledby','privacyBannerTitle');
    banner.innerHTML=`<div class="privacy-banner-copy"><div class="privacy-banner-mark">✓</div><div><strong id="privacyBannerTitle"></strong><p id="privacyBannerText"></p><a id="privacyBannerLearn" href="/privacy/"></a></div></div><div class="privacy-banner-actions"><button id="privacyReject" class="privacy-action secondary" type="button"></button><button id="privacyAccept" class="privacy-action primary" type="button"></button><button id="privacySettings" class="privacy-action tertiary" type="button"></button></div>`;
    document.body.appendChild(banner);

    modal=document.createElement('div');modal.id='privacySettingsModal';modal.className='privacy-settings-backdrop hidden';modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');modal.setAttribute('aria-labelledby','privacySettingsTitle');
    modal.innerHTML=`<div class="privacy-settings-card"><button id="privacySettingsClose" class="privacy-settings-close" type="button">×</button><span class="eyebrow">PRIVACY CONTROL</span><h2 id="privacySettingsTitle"></h2><p id="privacySettingsText" class="privacy-settings-intro"></p><div class="privacy-choice-list"><div class="privacy-choice locked"><div><div class="privacy-choice-title"><strong id="privacyEssentialTitle"></strong><span id="privacyEssentialBadge"></span></div><p id="privacyEssentialText"></p></div><span class="privacy-lock-toggle on"><i></i></span></div><label class="privacy-choice"><div><div class="privacy-choice-title"><strong id="privacyAnalyticsTitle"></strong><span id="privacyAnalyticsBadge"></span></div><p id="privacyAnalyticsText"></p></div><input id="privacyAnalyticsToggle" type="checkbox"><span class="privacy-switch"><i></i></span></label></div><div class="privacy-settings-links"><a id="privacyPolicyLink" href="/privacy/"></a><a id="cookiePolicyLink" href="/cookies/"></a><a id="termsPolicyLink" href="/terms/"></a></div><button id="privacySave" class="privacy-save" type="button"></button></div>`;
    document.body.appendChild(modal);toggle=modal.querySelector('#privacyAnalyticsToggle');

    banner.querySelector('#privacyAccept').onclick=()=>apply(true);
    banner.querySelector('#privacyReject').onclick=()=>apply(false);
    banner.querySelector('#privacySettings').onclick=showModal;
    modal.querySelector('#privacySettingsClose').onclick=hideModal;
    modal.querySelector('#privacySave').onclick=()=>apply(toggle.checked);
    modal.onclick=e=>{if(e.target===modal)hideModal()};
    document.addEventListener('keydown',e=>{if(e.key==='Escape')hideModal()});
    document.addEventListener('click',e=>{const b=e.target.closest?.('.open-cookie-settings');if(!b)return;e.preventDefault();showModal()});
    updateCopy();
  }

  function updateCopy(){
    if(!banner)return;const t=copy[lang()];const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v};
    [['privacyBannerTitle',t.title],['privacyBannerText',t.text],['privacyBannerLearn',t.learn],['privacyAccept',t.accept],['privacyReject',t.reject],['privacySettings',t.settings],['privacySettingsTitle',t.settingsTitle],['privacySettingsText',t.settingsText],['privacyEssentialTitle',t.essential],['privacyEssentialText',t.essentialText],['privacyEssentialBadge',t.always],['privacyAnalyticsTitle',t.analytics],['privacyAnalyticsText',t.analyticsText],['privacyAnalyticsBadge',t.optional],['privacySave',t.save],['privacyPolicyLink',t.privacy],['cookiePolicyLink',t.cookies],['termsPolicyLink',t.terms]].forEach(([a,b])=>set(a,b));
    modal.querySelector('#privacySettingsClose')?.setAttribute('aria-label',t.close);
  }
  function showBanner(){build();banner.classList.remove('hidden');requestAnimationFrame(()=>banner.classList.add('visible'))}
  function hideBanner(){if(!banner)return;banner.classList.remove('visible');setTimeout(()=>banner?.classList.add('hidden'),180)}
  function showModal(){build();toggle.checked=state.analytics;modal.classList.remove('hidden');requestAnimationFrame(()=>modal.classList.add('visible'));document.documentElement.classList.add('privacy-modal-open')}
  function hideModal(){if(!modal)return;modal.classList.remove('visible');document.documentElement.classList.remove('privacy-modal-open');setTimeout(()=>modal?.classList.add('hidden'),160)}

  const saved=read();
  if(saved)apply(saved.analytics,false);else{state={analytics:false,decided:false};window.KaptionoConsent={...state};clearGaCookies()}
  const init=()=>{build();if(!saved)setTimeout(showBanner,420)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
  window.addEventListener('kaptiono:languagechange',updateCopy);
  window.KaptionoPrivacy={openSettings:showModal,getConsent:()=>({...state})};
})();
