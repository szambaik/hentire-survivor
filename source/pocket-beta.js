// Public beta: opt-in spoilers, local preferences, no account or analytics.
const pgT = window.pgT;
const pgStorage = window.pgStorage;
document.querySelector('meta[name="theme-color"]').content='#14131e';
document.querySelectorAll('[data-language]').forEach(button=>{
  button.setAttribute('aria-pressed',String(button.dataset.language===window.pgLanguage));
  button.onclick=()=>{
    if(button.dataset.language===window.pgLanguage)return;
    pgStorage.set('pg-language',button.dataset.language);
    // Preserve the current destination and scroll without changing legacy save keys.
    try { sessionStorage.setItem('pg-return',JSON.stringify({panel:document.querySelector('.panel.active')?.id||'home',y:scrollY})); } catch {}
    location.reload();
  };
});
const aboutMarkup=`<dialog id="aboutDialog" class="library-dialog" aria-labelledby="aboutTitle"><header class="library-dialog-header"><button type="button" data-close-about>‹ Vissza</button><h2 id="aboutTitle">Az oldalról</h2></header><div class="about-content">
<section><h3>Pocket Grimoire</h3><p>Egy játék közben használt kis segédletből nőtt ki. Evolúciós receptek, körtervezés és következő célok, egy helyen.</p><p>Ingyenes béta. Nem hivatalos Vampire Survivors segédlet; nem áll kapcsolatban a poncle csapatával, és nem kapott hivatalos jóváhagyást.</p></section>
<section><h3>Nyelv és spoilerek</h3><p>A magyar változat tartalmazza a teljes jelenlegi útmutatót. Az angol felület előzetes: a még le nem fordított leírások magyarul maradnak. A játékbeli nevek mindkét nyelven változatlanok.</p><label class="spoiler-setting"><input type="checkbox" id="protectSpoilers"><span>Megerősítést kérek a későbbi célok és titkok előtt.</span></label><p>A titkos megoldások külön lenyithatók. A keresőben nevek és receptek megjelenhetnek, de titkos megoldásokra nem keresünk.</p></section>
<section><h3>Mentések és adatvédelem</h3><p>A profil, az aktuális kör és a beállítások ezen a böngészőn maradnak. Nincs fiók, saját analitika vagy felhős szinkron. Az oldal nem olvassa a játék mentését: a feloldásokat te jelölöd.</p><p>A böngészőadatok törlése elveszítheti a mentést. Másik telefon vagy webcím nem veszi át automatikusan. A Haladásom menü ⋯ gombjánál a feloldási profil exportálható és visszaállítható; ez nem tartalmazza az aktuális kört.</p><p>A tárgy- és pályaképek a wikiről töltődnek be, így a képszolgáltató hálózati adatokat, például IP-címet kap. A tárhelyet GitHub Pages biztosítja. A külső linkekre ezeknek a szolgáltatóknak a szabályai vonatkoznak.</p><p><a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener noreferrer">GitHub adatvédelem ↗</a> · <a href="https://weirdgloop.org/privacy" target="_blank" rel="noopener noreferrer">Wiki adatvédelem ↗</a></p></section>
<section><h3>Források és jogok</h3><p>A játékadatok és játékbeli képek forrása a <a href="https://vampire.survivors.wiki/" target="_blank" rel="noopener noreferrer">Vampire Survivors Wiki</a>. Az adatlapok az adott forráshoz vezetnek. A wiki alapján átdolgozott szövegekre a vonatkozó <a href="https://creativecommons.org/licenses/by-nc-sa/3.0/" target="_blank" rel="noopener noreferrer">CC BY-NC-SA 3.0</a> feltételeit kell figyelembe venni.</p><p>A képek nem automatikusan a wiki szöveglicence alá tartoznak. Egyedi felhasználási jogaik ellenőrzése folyamatban; ez az oldal nem ad engedélyt újrafelhasználásukra. A játék és a DLC-k megjelölései, grafikái a jogosultjaikhoz tartoznak.</p><p>A könyves márkajelzés saját, geometrikus rajz. A Pixelify Sans és Grenze Gotisch betűtípusok beágyazottak; a licencük a forrásban szerepel. Nincs adománygyűjtés vagy fizetős tartalom.</p></section>
<section><h3>Frissesség és visszajelzés</h3><p>Felületfrissítés: 2026-10-28. A játékadatok korábbi összeállításból származnak, most nem történt teljes, aktuális verzió szerinti ellenőrzés. Eltérésnél nézd meg a játék Unlocks menüjét és a kapcsolódó wikioldalt.</p><p>Hibánál írd le az eszközt, a játék verzióját és a hibás tárgy vagy recept nevét. Ne küldj személyes adatot vagy teljes mentést.</p><a class="feedback-link" data-feedback href="https://github.com/szambaik/hentire-survivor/issues/new" target="_blank" rel="noopener noreferrer">Hiba vagy ötlet? ↗</a><p>A visszajelzés GitHubon nyílik meg, fiókot igényel és nyilvános lesz. A küldést te erősíted meg.</p></section>
</div></dialog>`;
document.body.insertAdjacentHTML('beforeend',aboutMarkup);
const aboutDialog=document.querySelector('#aboutDialog');
let aboutOrigin=null;
function closeAbout(){aboutDialog.close();document.body.classList.toggle('library-modal-open',globalDialog.open||entityDialog.open);aboutOrigin?.focus({preventScroll:true});}
document.addEventListener('click',event=>{
  if(event.target.closest('[data-open-about]')){aboutOrigin=event.target.closest('button');aboutDialog.showModal();document.body.classList.add('library-modal-open');}
  if(event.target.closest('[data-close-about]'))closeAbout();
});
aboutDialog.addEventListener('cancel',event=>{event.preventDefault();closeAbout()});
const spoilerProtected=()=>pgStorage.get('pg-spoilers')!=='show';
const revealedPanels=new Set();
const spoilerPanels=['progress','death','secrets'];
for(const id of spoilerPanels){
  const panel=document.getElementById(id),body=document.createElement('div');body.className='spoiler-content';
  // Keep the destination heading and breadcrumb outside the gate.
  [...panel.children].filter(n=>!n.matches('.section-head:first-of-type,.library-breadcrumb')).forEach(n=>body.append(n));
  panel.append(body);
  const gate=document.createElement('aside');gate.className='spoiler-gate';gate.innerHTML='<h3>Készen állsz a következő titokra?</h3><p>Ez a rész későbbi célokat, rejtett feloldásokat vagy a végjáték stratégiáját mutatja meg.</p><div><button type="button" data-reveal-panel="'+id+'">Megnézem ezt a részt</button><button type="button" data-open="getting-started">Inkább az alapok</button></div>';
  body.before(gate);
}
function updateSpoilerGates(){
  for(const id of spoilerPanels){const panel=document.getElementById(id),locked=spoilerProtected()&&!revealedPanels.has(id);panel.querySelector('.spoiler-gate').hidden=!locked;panel.querySelector('.spoiler-content').hidden=locked;}
}
document.querySelector('#protectSpoilers').checked=spoilerProtected();
document.querySelector('#protectSpoilers').onchange=event=>{pgStorage.set('pg-spoilers',event.target.checked?'protect':'show');revealedPanels.clear();updateSpoilerGates();};
document.addEventListener('click',event=>{const button=event.target.closest('[data-reveal-panel]');if(button){revealedPanels.add(button.dataset.revealPanel);updateSpoilerGates();const heading=document.querySelector('#'+button.dataset.revealPanel+' h2');heading.tabIndex=-1;heading.focus({preventScroll:true});}});
updateSpoilerGates();
// First visit means no onboarding dismissal and no meaningful legacy progress.
const hasProgress=profileHasAny()||runState.weapons.some(w=>w.name)||recipes.some(r=>pgStorage.get('vs-'+r.id)==='1')||['vs-progress','vs-secrets'].some(k=>{try{return JSON.parse(pgStorage.get(k)||'[]').length>0}catch{return false}});
if(!hasProgress&&!pgStorage.get('pg-onboarded')){
  const welcome=document.createElement('aside');welcome.className='beta-onboarding';welcome.innerHTML='<h3>Az első körödtől a következő evolúcióig.</h3><p>Válassz egy fegyvert a keresőben, vagy állítsd össze az aktuális köröd. A feloldásokat te jelölöd; a játék mentéséhez nem kapcsolódunk.</p><div><button type="button" data-open="getting-started">Kezdők kézikönyve</button><button type="button" class="quiet" id="dismissOnboarding">Értem, játsszunk</button></div>';
  document.querySelector('#home .home-actions').after(welcome);
  document.querySelector('#dismissOnboarding').onclick=()=>{pgStorage.set('pg-onboarded','1');welcome.remove();};
}
// New users have no assumed DLC ownership. Existing choices are preserved.
renderDlcs=function(){
  let owned=null;try{owned=JSON.parse(pgStorage.get('vs-dlcs')||'null')}catch{}
  if(!Array.isArray(owned))owned=null;
  document.querySelector('#dlcSettings').innerHTML=dlcs.map((d,i)=>'<button class="dlc-toggle '+(owned?.includes(d[0])?'active':'')+'" aria-pressed="'+!!owned?.includes(d[0])+'" onclick="toggleDlc('+i+')">'+(owned?.includes(d[0])?'✓ ':'')+escapeText(d[0])+'</button>').join('');
  const selected=owned===null?dlcs:dlcs.filter(d=>owned.includes(d[0]));
  document.querySelector('#dlcGrid').innerHTML=selected.map(d=>'<article class="dlc"><span class="badge">'+d[1]+'</span><h3>'+d[0]+'</h3><p class="dlc-hook">'+d[3]+'</p><p class="dlc-recipes"><b>Jellegzetes receptek:</b> '+d[2]+'</p><a href="'+W+slug(d[0])+'" target="_blank" rel="noopener noreferrer">A DLC oldala a wikiben ↗</a></article>').join('')||'<div class="tip">Nincs kiválasztott DLC.</div>';
};
toggleDlc=function(i){let owned;try{owned=JSON.parse(pgStorage.get('vs-dlcs')||'[]')}catch{}if(!Array.isArray(owned))owned=[];const name=dlcs[i][0];owned=owned.includes(name)?owned.filter(n=>n!==name):[...owned,name];pgStorage.set('vs-dlcs',JSON.stringify(owned));renderDlcs();};
document.querySelector('#dlc .section-head p').textContent='Elsőre minden kiegészítőt megmutatunk, de egyiket sem jelöljük sajátodnak. Válassz a meglévő DLC-idből a szűréshez.';
renderDlcs();
const oldLibrarySearch=librarySearch;
librarySearch=function(query){
  const results=oldLibrarySearch(query);
  if(window.pgLanguage!=='en')return results;
  const words=searchKey(query.trim()).split(/\s+/).filter(Boolean);if(!words.length)return [];
  const candidates=[...[...entityRegistry.values()].map(e=>({title:e.name,type:e.type,entity:e.name,text:[e.description,e.unlock].join(' ')})),...searchEntries.filter(e=>!entityRegistry.has(e.title)&&!e.image)];
  for(const e of candidates){if(words.every(w=>searchKey(pgT(e.title)+' '+pgT(e.type)+' '+pgT(e.text||'')).includes(w))&&!results.some(r=>r.title===e.title&&r.type===e.type))results.push(e);}
  return results;
};
if(window.pgLanguage==='en'){
  document.querySelector('#home .home-actions').insertAdjacentHTML('afterend','<p class="locale-note" lang="en">English preview: navigation and core recipe help are translated. Some detailed guides are still in Hungarian. Switch to Magyar for the original; game names stay unchanged.</p>');
}
window.pgTranslateTree(document.body);
window.pgObserveTranslations();
try { const position=JSON.parse(sessionStorage.getItem('pg-return')||'null');sessionStorage.removeItem('pg-return');if(position&&document.getElementById(position.panel)?.classList.contains('panel')){openPanel(position.panel,false);requestAnimationFrame(()=>window.scrollTo(0,position.y||0));} } catch {}
