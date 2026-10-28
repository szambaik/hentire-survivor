// Connected library: one registry, four destinations, non-destructive detail navigation.
const libraryGroups = [
  {id:'builds',title:'Fejlesztések',icon:'⚔',text:'Evolúciók, uniók és receptszabályok',panels:['recipes','special','how']},
  {id:'collection',title:'Gyűjtemény',icon:'◆',text:'Fegyverek, tárgyak, karakterek és Arcanák',panels:['items','characters','arcana']},
  {id:'world',title:'Világ',icon:'▧',text:'Pályaatlasz és kiegészítők',panels:['maps','dlc']},
  {id:'guides',title:'Útmutatók',icon:'✦',text:'Az első körtől a Halál legyőzéséig',panels:['getting-started','progress','death','mechanics','secrets','build-guide']}
];
const libraryLabels = {'recipes':'Evolúciók','special':'Uniók és különleges receptek','how':'Evolúciós alapszabályok','items':'Fegyverek, passzívak és ereklyék','characters':'Karakterek','arcana':'Arcanák','maps':'Pályaatlasz','dlc':'DLC-k','getting-started':'Kezdők kézikönyve','progress':'Merre tovább?','death':'Red Death legyőzése','mechanics':'Játékmechanikák','secrets':'Titokvadász napló','build-guide':'Hogyan tervezz egy jó kört?'};
const entityNotes = {
  'Whip':'Vízszintes csapásokkal támad, az ellenfeleken és falakon is áthatol.',
  'Magic Wand':'A legközelebbi ellenfelet célozza. Jól használható a túl közel kerülő ellenfelek ellen.',
  'Knife':'A mozgásod irányába dob késeket; irányított utat nyithatsz vele a tömegben.',
  'Axe':'Ívben felfelé hajít baltákat. A Candelabrador a támadási területét is növeli.',
  'Cross':'Bumerángként visszatérő lövedékeket indít a közeli ellenfelek felé.',
  'King Bible':'Könyvek keringenek körülötted, és sebzik az érintett ellenfeleket.',
  'Fire Wand':'Nagy sebzésű tűzgolyókat lő véletlenszerű ellenfelekre.',
  'Garlic':'Közeli sebző aurát ad. A korai gyenge ellenfelek ellen különösen kényelmes.',
  'Santa Water':'Sebző tócsákat hagy a talajon. A tartam és a terület növelése segíti a lefedettségét.',
  'Runetracer':'Színes, áthatoló lövedékei visszapattannak a képernyő széléről és az akadályokról.',
  'Lightning Ring':'Véletlenszerű ellenfelekre villámokat idéz.',
  'Pentagram':'Időszakosan eltünteti a képernyő ellenfeleit; kezdetben az XP-t és tárgyakat is megsemmisítheti.',
  'Clock Lancet':'Körbeforgó sugara megfagyasztja az ellenfeleket. Az alapfegyver nem sebez.',
  'Laurel':'Újratöltődő pajzsrétegekkel véd a sérülésektől.',
  'Bloody Tear':'A Whip evolúciója: kritikus találatokra és életerő-visszatöltésre képes.',
  'Infinite Corridor':'Fagyasztó sugarai egy teljes fordulat után megfelezik az érintett ellenfelek aktuális életerejét. A Red Death stratégia kulcsa.',
  'Crimson Shroud':'A beérkező találatok sebzését korlátozza, és visszacsapó sebzést okoz. A Red Death elleni védelem kulcsa.',
  'Peachone':'Egy köröző célterületet bombázó madár; az Ebony Wingsszel egyesíthető.',
  'Ebony Wings':'A Peachone ellenkező irányban köröző párja; együtt Vandalier készülhet belőlük.',
  'Hollow Heart':'Növeli a maximális életerőt.', 'Empty Tome':'Csökkenti a fegyverek újratöltési idejét (Cooldown).',
  'Bracer':'Növeli a lövedékek sebességét (Speed).','Candelabrador':'Növeli a támadások területét (Area).',
  'Clover':'Növeli a szerencsét (Luck).','Spellbinder':'Növeli a fegyverhatások időtartamát (Duration).',
  'Spinach':'Növeli a sebzést (Might).','Pummarola':'Folyamatos életerő-regenerációt ad (Recovery).',
  'Attractorb':'Növeli a felszedési távolságot (Magnet).','Armor':'Csökkenti a beérkező sebzést.',
  'Duplicator':'Növeli a lövedékek számát (Amount), ha a fegyver támogatja.',
  'Crown':'Növeli a kapott tapasztalati pontokat (Growth).','Stone Mask':'Növeli a megszerzett arany értékét (Greed).',
  "Skull O'Maniac":'Növeli a Curse értékét: több, erősebb és gyorsabb ellenfelet hoz.',
  'Wings':'Növeli a mozgási sebességet.','Tirajisú':'További feltámadásokat ad.',
  'Silver Ring':'Növeli a Duration és Area értékét. Az Infinite Corridorhoz MAX szinten kell.',
  'Gold Ring':'Növeli a Curse értékét. Az Infinite Corridorhoz MAX szinten kell.',
  'Metaglio Left':'Növeli a maximális életerőt és regenerációt. A Crimson Shroudhoz MAX szinten kell.',
  'Metaglio Right':'Növeli a Curse értékét. A Crimson Shroudhoz MAX szinten kell.',
  "Torrona's Box":'Több támadó statot növel, utolsó szintje viszont jelentős Curse növekedést ad.'
};
const pickupData = [
  ['Floor Chicken','Életerőt tölt vissza.','Fényforrásokból eshet; öt darab összegyűjtése feloldja a Garlicot.'],
  ['Rosary','Elpusztítja a legtöbb képernyőn lévő ellenfelet.','Fényforrásokból eshet; felvétele feloldja a Crosst.'],
  ['Orologion','Ideiglenesen megfagyasztja az ellenfeleket.','Fényforrásokból eshet; felvétele feloldja a Clock Lancetet.'],
  ['Vacuum','Magadhoz vonzza a pályán hagyott XP-drágaköveket.','Fényforrásokból eshet; felvétele feloldja az Attractorbot.'],
  ['Little Clover','Az adott körre növeli a szerencsét.','Fényforrásokból eshet; felvétele feloldja a Clover passzív tárgyat.']
];
function createEntityRegistry(){
  const registry=new Map();
  const add=(name,type,fields={})=>registry.set(name,{...registry.get(name),name,type,...fields});
  Object.entries(weaponUnlocks).forEach(([name,unlock])=>add(name,'Fegyver',{unlock}));
  Object.entries(passiveUnlocks).filter(([n])=>!['80. szint','Teljesen kiépített felszerelés'].includes(n)).forEach(([name,unlock])=>add(name,name.startsWith('Chaos ')?'Ereklye':'Passzív tárgy',{unlock}));
  recipes.forEach(r=>add(r.result,'Evolvált fegyver',{unlock:evolutionRule(r)}));
  specials.forEach(s=>add(s.result,s.type,{unlock:s.note}));
  characters.forEach(c=>{add(c.name,'Karakter',{unlock:c.unlock,description:c.power,starter:components(c.weapon)});components(c.weapon).forEach(n=>{if(!registry.has(n))add(n,'Fegyver',{unlock:c.name+' kezdőfegyvere. A további feloldási részleteket a wiki tartalmazza.'})})});
  secretData.forEach(s=>add(s.name,'Titkos karakter',{description:s.hint,unlock:'A megoldás spoileres. Csak akkor fedd fel alább, ha segítséget szeretnél.',secretSolution:s.solution}));
  relics.forEach(([name,stage,description])=>add(name,'Ereklye',{unlock:'Lelőhely / feltétel: '+stage,description,stage}));
  arcanas.forEach(a=>add(a.name,'Arcana',{unlock:a.unlock,description:a.effect}));
  atlasStages.forEach(s=>add(s.name,'Pálya',{unlock:s.unlock,description:s.kind,stageInfo:stageDetails.find(d=>d.name===s.name)}));
  pickupData.forEach(([name,description,unlock])=>add(name,'Felvehető tárgy',{description,unlock}));
  registry.forEach(e=>{e.description=e.description||entityNotes[e.name]||''});
  return registry;
}
const entityRegistry=createEntityRegistry();
function entityImage(e){return e.name==='Yellow Sign'?wikiFile('Icon-Yellow_Sign.png'):['Karakter','Titkos karakter'].includes(e.type)?selectImg(e.name):e.type==='Pálya'?wikiFile('Stage-'+e.name.replaceAll(' ','_')+'.png'):img(e.name)}
function entityLink(name,label=name){const e=entityRegistry.get(name);return e?'<button type="button" class="entity-link" data-entity="'+escapeText(name)+'"><img loading="lazy" src="'+entityImage(e)+'" alt="" onerror="this.hidden=true"><span>'+escapeText(label)+'</span></button>':escapeText(label)}
function librarySearch(query){
  const q=searchKey(query.trim()),words=q.split(/\s+/).filter(Boolean);
  if(!q)return [];
  const entities=[...entityRegistry.values()].map(e=>({title:e.name,type:e.type,text:[e.description,e.unlock,e.starter?.join(' '),...relatedRecipes(e.name).map(r=>r.weapon+' '+r.passive+' '+r.result),...searchEntries.filter(r=>r.title===e.name).map(r=>r.text+' '+(r.relations||[]).join(' '))].join(' '),entity:e.name}));
  const guides=searchEntries.filter(e=>!entityRegistry.has(e.title)&&!e.image).map(e=>({...e}));
  return [...entities,...guides].filter(e=>words.every(w=>searchKey(e.title+' '+e.type+' '+e.text).includes(w))).sort((a,b)=>{
    const score=e=>searchKey(e.title)===q?3:searchKey(e.title).startsWith(q)?2:searchKey(e.title).includes(q)?1:0;
    return score(b)-score(a)||a.title.localeCompare(b.title);
  });
}

// Interface: broad destinations rather than a row for every topic.
document.querySelector('#codexSubnav').innerHTML='<div class="library-subnav">'+libraryGroups.map(g=>'<button data-open="'+g.id+'">'+g.title+'</button>').join('')+'</div>';
const groupMarkup=g=>'<section id="'+g.id+'" class="panel"><div class="section-head"><div><span class="eyebrow">Kódex</span><h2>'+g.title+'</h2><p>'+g.text+'</p></div></div><div class="library-topic-list">'+g.panels.map(id=>'<button data-open="'+id+'"><span>'+libraryLabels[id]+'</span><span aria-hidden="true">›</span></button>').join('')+'</div></section>';
document.querySelector('#codex').insertAdjacentHTML('afterend',libraryGroups.map(groupMarkup).join(''));
document.querySelector('#codexBrowse').innerHTML='<div class="codex-section-grid library-groups">'+libraryGroups.map(g=>'<button class="codex-section-card" data-open="'+g.id+'"><span class="group-symbol" aria-hidden="true">'+g.icon+'</span><strong>'+g.title+'</strong><span>'+g.text+'</span></button>').join('')+'</div><p class="library-hint">A kis képpel jelölt nevekre bökve megnyílik az adatlap. A Vissza gomb pontosan ide hoz vissza.</p>';
document.querySelector('#codex .section-head p').textContent='Négy polc. Minden, amire játék közben szükséged lehet.';
// Keep the old input/index for compatibility; the single global search is the user-facing entry.
['#codexSearch','.global-search-label','#codexSearchCount','#codexSearchResults'].forEach(s=>document.querySelector(s).hidden=true);
const searchTrigger='<button class="library-search-trigger" data-global-search><span aria-hidden="true">⌕</span><span>Keresés mindenhol<small>Fegyver, karakter, pálya, útmutató…</small></span></button>';
document.querySelector('#codex .section-head').insertAdjacentHTML('afterend',searchTrigger);
document.querySelector('#home .home-heading p').textContent='Egy recept, egy jó döntés, még egy kör.';
document.querySelector('#home .home-heading').insertAdjacentHTML('beforebegin',searchTrigger);
document.querySelector('#home .home-actions').insertAdjacentHTML('afterbegin','<button class="home-card home-evolutions" data-open="recipes"><span class="home-icon">'+menuEmblem('recipes')+'</span><span><small>Gyors receptkönyv</small><b>Evolúciók és uniók</b><em>Mi kell hozzá, és hogyan szerezd meg?</em></span><i>›</i></button>');
document.querySelector('#home .home-card[data-open="codex"]').remove();
dock.insertAdjacentHTML('afterbegin','<button class="dock-search" data-global-search aria-label="Globális keresés">⌕ <span>Keresés</span></button>');
document.querySelector('#profile .journey-shortcuts').innerHTML='<button data-open="guides">Útmutatók és következő célok →</button>';
['items','characters','arcana'].forEach(id=>document.querySelector('#'+id+' .section-head').insertAdjacentHTML('afterend','<p class="library-hint">Bökj a névre a teljes adatlaphoz: feloldás, hatás és kapcsolódó felszerelés.</p>'));
document.querySelector('#guides').insertAdjacentHTML('afterend','<section id="build-guide" class="panel"><div class="section-head"><div><span class="eyebrow">Útmutató</span><h2>Hogyan tervezz egy jó kört?</h2><p>Egy cél, néhány összeillő fegyver, hely a fontos tárgyaknak.</p></div></div><div class="starter-steps">'+[
  ['Válassz egy célt','Új pálya, ereklye vagy egy konkrét evolúció? Ne akarj minden feloldást egyszerre. A Merre tovább? útvonal segít célt választani.'],
  ['Építs a kezdőfegyverre','Poe Ratcho mellé a Garlic → Pummarola → Soul Eater vonal kézenfekvő. Antonio Belpaese esetén Whip + Hollow Heart → Bloody Tear. Először legyen egy megbízható sebzésforrásod.'],
  ['Oszd be a hat passzív helyet','Nézd meg előre a kívánt evolúciók tárgyait. Az Empty Tome sok támadást gyorsít; az Armor a túlélésben segít. Nem kell minden passzívnak evolúciót szolgálnia.'],
  ['Időzítsd a földi tárgyakat','A Milky Way Map megmutatja a lelőhelyeket. Ha biztonságos, töltsd be a hat passzív helyet a földi tárgyak felvétele előtt: így a korláton túl is gyűjthetsz.'],
  ['Ne kockáztass kész tervvel','Evolúció előtt erősítsd a szükséges fegyvert. A Gold Ring és Metaglio Right nehezítik a kört, ezért a Red Death tervet megfelelő sebzéssel és védelemmel kezdd.']
].map(([title,text],i)=>'<article class="starter-step"><span class="step-number">'+(i+1)+'</span><div><h3>'+title+'</h3><p>'+text+'</p></div></article>').join('')+'</div></section>');
searchEntries.push({title:libraryLabels['build-guide'],type:'Útmutató',text:'Build terv hat hely kezdőfegyver földi tárgyak',panel:'build-guide'});
libraryGroups.forEach(g=>{codexPanels.push(g.id);panelParents[g.id]='codex';g.panels.forEach(id=>{panelParents[id]='codex';if(!codexPanels.includes(id))codexPanels.push(id);document.getElementById(id).insertAdjacentHTML('afterbegin','<button class="library-breadcrumb" data-open="'+g.id+'">‹ '+g.title+'</button>')})});
['recipes','special'].forEach(id=>document.querySelector('#'+id+' .section-head').insertAdjacentHTML('afterend','<nav class="recipe-switch" aria-label="Recepttípus"><button data-open="recipes" aria-current="'+(id==='recipes'?'page':'false')+'">Evolúciók</button><button data-open="special" aria-current="'+(id==='special'?'page':'false')+'">Uniók és extrák</button></nav>'));
// Hide less-used controls behind a single disclosure, without changing their existing listeners.
const finder=document.querySelector('#recipes .finder');
const finderDisclosure=document.createElement('details');finderDisclosure.className='library-tools';finderDisclosure.innerHTML='<summary>Fordított kereső és további szűrők</summary>';finder.before(finderDisclosure);finderDisclosure.append(finder,document.querySelector('#recipes .filters'),document.querySelector('#clearDone'));
document.querySelector('#recipes .controls').after(finderDisclosure);
const priorLibraryOpenPanel=openPanel;
openPanel=function(id,scroll=true){
  // The old dock scroll container no longer exists, so retain a harmless compatibility node.
  priorLibraryOpenPanel(id,scroll);
  const group=libraryGroups.find(g=>g.id===id||g.panels.includes(id));
  const insideCodex=id==='codex'||!!group;
  document.querySelector('#codexSubnav').hidden=!insideCodex;
  document.body.classList.toggle('codex-open',insideCodex);
  document.querySelectorAll('.library-subnav button').forEach(b=>{const selected=b.dataset.open===group?.id;b.classList.toggle('active',selected);b.setAttribute('aria-current',selected?'page':'false')});
};
document.querySelector('#codexSubnav').insertAdjacentHTML('beforeend','<span class="subnav-scroll" hidden></span>');

// Native modal surfaces leave every origin DOM node and its controls untouched.
document.body.insertAdjacentHTML('beforeend','<dialog id="librarySearchDialog" class="library-dialog search-dialog" aria-labelledby="globalSearchTitle"><header class="library-dialog-header"><button data-close-search>‹ Vissza</button><h2 id="globalSearchTitle">Keresés mindenhol</h2></header><div class="search-dialog-body"><label class="sr-only" for="globalQuery">Keress a teljes kódexben</label><input id="globalQuery" class="search" type="search" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="globalSuggestions" autocomplete="off" placeholder="Garlic, Poe, gyógyítás…"><p id="globalResultCount" role="status">Kezdj el gépelni, vagy válassz egy népszerű témát.</p><div id="globalSuggestions" role="listbox" aria-label="Keresési javaslatok"></div></div></dialog><dialog id="entityDialog" class="library-dialog entity-dialog" aria-labelledby="entityTitle"><header class="library-dialog-header"><button id="entityBack">‹ Vissza</button><span class="entity-header-label">Kódex · adatlap</span><button data-global-search aria-label="Keresés az adatlapról">⌕</button></header><div id="entityBody" class="entity-body"></div></dialog>');
const globalDialog=document.querySelector('#librarySearchDialog'),entityDialog=document.querySelector('#entityDialog'),entityBody=document.querySelector('#entityBody'),globalQuery=document.querySelector('#globalQuery');
let globalMatches=[],activeSuggestion=-1,searchOrigin=null;
let resurfacedSearch=false,searchReturnFocus=null,resurfacedSearchState=null;
const entityFrames=[];
let entityOrigin=null;
function lockLibraryScroll(){document.body.classList.toggle('library-modal-open',globalDialog.open||entityDialog.open)}
function openGlobalSearch(){
  if(globalDialog.open){
    if(entityDialog.open){
      resurfacedSearch=true;searchReturnFocus=document.activeElement;
      resurfacedSearchState={query:globalQuery.value,nodes:[...document.querySelector('#globalSuggestions').childNodes],matches:globalMatches,active:activeSuggestion,count:document.querySelector('#globalResultCount').textContent,scroll:globalDialog.querySelector('.search-dialog-body').scrollTop};
      globalDialog.close();globalDialog.showModal();
    }
    globalQuery.focus();return;
  }
  searchOrigin={focus:document.activeElement,x:scrollX,y:scrollY};globalDialog.showModal();lockLibraryScroll();renderGlobalSuggestions();globalQuery.focus();
}
function closeGlobalSearch(){
  globalDialog.close();
  if(resurfacedSearch&&entityDialog.open){
    const saved=resurfacedSearchState;
    if(saved){globalQuery.value=saved.query;globalMatches=saved.matches;activeSuggestion=saved.active;document.querySelector('#globalSuggestions').replaceChildren(...saved.nodes);document.querySelector('#globalResultCount').textContent=saved.count;globalQuery.setAttribute('aria-expanded',String(!!globalMatches.length));if(activeSuggestion>=0)globalQuery.setAttribute('aria-activedescendant','global-option-'+activeSuggestion);else globalQuery.removeAttribute('aria-activedescendant');}
    const position=entityBody.scrollTop;entityDialog.close();globalDialog.showModal();if(saved)globalDialog.querySelector('.search-dialog-body').scrollTop=saved.scroll;entityDialog.showModal();entityBody.scrollTop=position;resurfacedSearch=false;resurfacedSearchState=null;searchReturnFocus?.focus({preventScroll:true});lockLibraryScroll();return;
  }
  resurfacedSearch=false;lockLibraryScroll();searchOrigin?.focus?.focus({preventScroll:true});if(searchOrigin)window.scrollTo({left:searchOrigin.x,top:searchOrigin.y,behavior:'instant'});
}
function renderGlobalSuggestions(){
  const q=globalQuery.value.trim();
  const all=q?librarySearch(q):['Garlic','Empty Tome','Poe Ratcho','Infinite Corridor'].map(name=>({title:name,type:entityRegistry.get(name).type,entity:name}));
  globalMatches=all.slice(0,30);activeSuggestion=-1;
  globalQuery.removeAttribute('aria-activedescendant');globalQuery.setAttribute('aria-expanded',String(!!globalMatches.length));
  document.querySelector('#globalResultCount').textContent=q?(all.length?'Találatok: '+all.length+(all.length>30?' · Az első 30 látható, pontosíts a keresésen.':''):'Nincs találat. Próbálj rövidebb nevet vagy másik kifejezést.'):'Népszerű témák · a teljes kódexben keresünk';
  document.querySelector('#globalSuggestions').innerHTML=globalMatches.map((r,i)=>'<button type="button" role="option" aria-selected="false" id="global-option-'+i+'" data-global-result="'+i+'" class="global-option">'+(r.entity?'<img src="'+entityImage(entityRegistry.get(r.entity))+'" alt="" onerror="this.hidden=true">':'<span aria-hidden="true">✦</span>')+'<span><small>'+escapeText(r.type)+'</small><strong>'+escapeText(r.title)+'</strong></span><span aria-hidden="true">›</span></button>').join('');
}
function chooseGlobalResult(index){
  const r=globalMatches[index];if(!r)return;
  if(r.entity){
    // Search from an open detail is a sibling navigation; do not leave search above the detail.
    if(entityDialog.open)closeGlobalSearch();
    openEntity(r.entity);
  }else{closeGlobalSearch();if(entityDialog.open)closeAllEntities();if(globalDialog.open)closeGlobalSearch();openPanel(r.panel)}
}
globalQuery.addEventListener('input',renderGlobalSuggestions);
globalQuery.addEventListener('keydown',event=>{
  if(['ArrowDown','ArrowUp'].includes(event.key)&&globalMatches.length){event.preventDefault();activeSuggestion=(activeSuggestion+(event.key==='ArrowDown'?1:-1)+globalMatches.length)%globalMatches.length;document.querySelectorAll('[data-global-result]').forEach((b,i)=>b.setAttribute('aria-selected',String(i===activeSuggestion)));globalQuery.setAttribute('aria-activedescendant','global-option-'+activeSuggestion);document.getElementById('global-option-'+activeSuggestion).scrollIntoView({block:'nearest'});}
  if(event.key==='Enter'&&globalMatches.length){event.preventDefault();chooseGlobalResult(Math.max(0,activeSuggestion))}
});
globalDialog.addEventListener('cancel',event=>{event.preventDefault();closeGlobalSearch()});
function entityDetailMarkup(e){
  const section=(title,body)=>body?'<section class="entity-section"><h3>'+title+'</h3>'+body+'</section>':'';
  const lines=relatedRecipes(e.name),unions=specials.filter(s=>s.result===e.name||s.base.flatMap(components).includes(e.name)||components(s.passive||'').includes(e.name));
  const starters=characters.filter(c=>components(c.weapon).includes(e.name));
  const places=stageDetails.filter(s=>[s.items,s.relic].some(v=>v.includes(e.name)));
  let html='<div class="entity-heading"><img src="'+entityImage(e)+'" alt="'+escapeText(e.name)+'" onerror="this.hidden=true"><div><span class="eyebrow">'+escapeText(e.type)+'</span><h2 id="entityTitle" tabindex="-1">'+escapeText(e.name)+'</h2></div></div>';
  html+=section('Röviden',e.description?'<p>'+escapeText(e.description)+'</p>':'');
  html+=section('Hogyan szerezhető meg?','<p>'+escapeText(e.unlock||'A részletes feltételt a kapcsolódó wikioldalon találod.')+'</p>');
  if(e.secretSolution)html+='<details class="entity-secret" data-no-entity><summary>Spoiler · megoldás felfedése</summary><p>'+escapeText(e.secretSolution)+'</p></details>';
  if(e.starter)html+=section('Kezdőfelszerelés','<div class="entity-relations">'+e.starter.map(n=>entityLink(n)).join('')+'</div>');
  html+=section('Evolúciók',lines.map(r=>'<article class="entity-recipe"><div class="entity-relations">'+entityLink(r.weapon)+' <span>+</span> '+(r.passive.startsWith('Nincs')?'Nincs passzív':iconNames(r.passive).map(n=>entityLink(n)).join(' + '))+' <span>→</span> '+entityLink(r.result)+'</div><p>'+escapeText(evolutionRule(r))+'</p></article>').join(''));
  html+=section('Uniók és különleges receptek',unions.map(s=>'<article class="entity-recipe"><div class="entity-relations">'+s.base.flatMap(components).concat(iconNames(s.passive||'')).map(n=>entityLink(n)).join(' + ')+' → '+entityLink(s.result)+'</div><p>'+escapeText(s.note)+'</p></article>').join(''));
  html+=section('Ezzel indulnak',starters.length?'<div class="entity-relations">'+starters.map(c=>entityLink(c.name)).join('')+'</div>':'');
  html+=section('Lelőhelyek a kódexben',places.map(s=>'<p>'+entityLink(s.name)+'</p>').join(''));
  const relatedArcanas=arcanas.filter(a=>(arcanaRelations[a.name]||[]).includes(e.name));
  html+=section('Kapcsolódó Arcanák',relatedArcanas.map(a=>'<p>'+entityLink(a.name)+'</p>').join(''));
  if(e.type==='Arcana')html+=section('Kapcsolódó felszerelés',(arcanaRelations[e.name]||[]).map(n=>entityLink(n)).join(' '));
  if(e.stageInfo)html+=section('A pályán',Object.entries({ 'Földi tárgyak':e.stageInfo.items,'Ereklyék':e.stageInfo.relic,'Koporsó':e.stageInfo.coffin,'Tipp':e.stageInfo.tip}).map(([label,text])=>'<p><b>'+label+':</b> '+escapeText(text)+'</p>').join(''));
  if(e.type==='Pálya'&&tilemapStages.has(e.name))html+=section('Eredeti pályarajz','<p>A terep ismétlődő része; nem teljes tárgytérkép.</p><img class="entity-map" loading="lazy" src="'+wikiFile('Tilemap-'+e.name.replaceAll(' ','_')+'.png')+'" alt="'+escapeText(e.name)+' tereprajza" onerror="this.hidden=true">');
  if(['Infinite Corridor','Crimson Shroud','Clock Lancet','Laurel','Yellow Sign'].includes(e.name))html+=section('Mire használhatod?','<p>A Red Death útmutatóban együtt használjuk ezeket a felszereléseket. Az útmutatót az Útmutatók polcon találod.</p>');
  html+='<footer class="entity-source"><p>A kódex jelenlegi adatain alapul. A részletes statok, szintenkénti értékek és verzióeltérések a wikiben ellenőrizhetők.</p><a href="'+W+slug(e.name)+'" target="_blank" rel="noreferrer">Eredeti wiki és részletes statok ↗</a></footer>';
  return html;
}
function openEntity(name){
  const entity=entityRegistry.get(name);if(!entity)return;
  if(entityDialog.open&&entityDialog.dataset.entity===name)return;
  if(entityDialog.open){entityFrames.push({nodes:[...entityBody.childNodes],scroll:entityBody.scrollTop,focus:document.activeElement,name:entityDialog.dataset.entity});}
  else{entityOrigin={focus:document.activeElement,x:scrollX,y:scrollY};entityDialog.showModal();lockLibraryScroll()}
  entityDialog.dataset.entity=name;entityBody.innerHTML=entityDetailMarkup(entity);linkEntityNames(entityBody);entityBody.scrollTop=0;
  document.querySelector('#entityBack').textContent=entityFrames.length?'‹ '+entityFrames.at(-1).name:'‹ Vissza';
  document.querySelector('#entityTitle').focus({preventScroll:true});
}
function backEntity(){
  const frame=entityFrames.pop();
  if(frame){entityBody.replaceChildren(...frame.nodes);entityDialog.dataset.entity=frame.name;entityBody.scrollTop=frame.scroll;document.querySelector('#entityBack').textContent=entityFrames.length?'‹ '+entityFrames.at(-1).name:'‹ Vissza';frame.focus?.focus({preventScroll:true});}
  else{entityDialog.close();entityBody.replaceChildren();lockLibraryScroll();entityOrigin?.focus?.focus({preventScroll:true});if(entityOrigin)window.scrollTo({left:entityOrigin.x,top:entityOrigin.y,behavior:'instant'})}
}
function closeAllEntities(){entityFrames.length=0;backEntity()}
entityDialog.addEventListener('cancel',event=>{event.preventDefault();backEntity()});
document.querySelector('#entityBack').onclick=backEntity;

// Only decorate text, never attributes, secret solutions, or nested interactive controls.
const entityAliases=new Map([...entityRegistry.keys()].map(n=>[n,n]));
Object.entries({'Antonio':'Antonio Belpaese','Imelda':'Imelda Belpaese','Pasqualina':'Pasqualina Belpaese','Gennaro':'Gennaro Belpaese','Poe':'Poe Ratcho','Arca':'Arca Ladonna','Porta':'Porta Ladonna','Lama':'Lama Ladonna','Krochi':'Krochi Freetto','Clerici':'Suor Clerici','Pugnala':'Pugnala Provola','Giovanna':'Giovanna Grana','Poppea':'Poppea Pecorina','Concetta':'Concetta Caciotta','Christine':'Christine Davain','Gallo':'Iguana Gallo Valletto','Divano':'Divano Thelma'}).forEach(([alias,name])=>entityAliases.set(alias,name));
const entityPattern=new RegExp('(?<![\\p{L}\\p{N}])('+[...entityAliases.keys()].sort((a,b)=>b.length-a.length).map(n=>n.replace(/[.*+?^$()|[\]\\]/g,'\\$&')).join('|')+')(?=$|[^\\p{L}\\p{N}]|(?:t|ot|et|at|ban|ben|ba|be|ra|re|hoz|hez|höz|val|vel|tel|tal|dal|del|ból|ből|nál|nél|ként|ja|je|ját|jét)(?![\\p{L}\\p{N}]))','gu');
function linkEntityNames(root){
  window.pgTranslateTree?.(root);
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
  for(const node of nodes){
    if(!node.parentElement||node.parentElement.closest('button,a,input,select,textarea,script,style,option,summary,label,[role="option"],h2,.eyebrow,.badge,.count,.sr-only,#secretGrid details,#globalSuggestions,.entity-source,[data-no-entity]'))continue;
    const text=node.textContent;entityPattern.lastIndex=0;if(!entityPattern.test(text))continue;entityPattern.lastIndex=0;
    const fragment=document.createDocumentFragment();let last=0;
    for(const match of text.matchAll(entityPattern)){fragment.append(text.slice(last,match.index));const template=document.createElement('template');template.innerHTML=entityLink(entityAliases.get(match[0]),match[0]);fragment.append(template.content);last=match.index+match[0].length}
    fragment.append(text.slice(last));node.replaceWith(fragment);
  }
}
// Selection tiles keep their original action; the name becomes a separate detail target.
function decorateSelectionTiles(root){
  const selector='.profile-item:not([data-library-tile]),.picker-item:not([data-library-tile]),.gear-main:not([data-library-tile])';
  [...(root.matches(selector)?[root]:[]),...root.querySelectorAll(selector)].forEach(button=>{
    button.dataset.libraryTile='true';const label=button.querySelector('span:not(.item-check),b');const name=label?.textContent.trim();if(!entityRegistry.has(name))return;
    const wrapper=document.createElement('div');wrapper.className='library-selection';button.before(wrapper);wrapper.append(button);
    // In the add picker the large icon/name target must select, never open a description.
    if(button.classList.contains('picker-item')){
      wrapper.classList.add('picker-choice');
      const action=button.classList.contains('selected')?'Áthelyezés ide':'Hozzáadás';
      button.setAttribute('aria-label',action+': '+name);
      button.insertAdjacentHTML('beforeend','<span class="picker-add-label">＋ '+action+'</span>');
      wrapper.insertAdjacentHTML('beforeend','<button type="button" class="picker-info" data-entity="'+escapeText(name)+'" aria-label="'+escapeText(name)+' leírása"><span aria-hidden="true">ⓘ</span> Részletek</button>');
      return;
    }
    const isProfile=button.classList.contains('profile-item'),isGear=button.classList.contains('gear-main');
    button.setAttribute('aria-label',(isProfile?'Feloldás jelölése: ':isGear?'Felszerelés cseréje: ':'Kiválasztás: ')+name);
    label.textContent=isProfile?(button.classList.contains('done')?'✓ Megvan':'＋ Jelölés'):isGear?'Csere':'＋ Kiválasztás';
    const link=document.createElement('div');link.className='selection-name';link.innerHTML=entityLink(name);wrapper.prepend(link);
    button.querySelector('img')?.remove();
  });
}
function simplifyRecipeCards(root){
  root.querySelectorAll('#recipeGrid .card .unlock-details').forEach(details=>{
    if(details.parentElement.classList.contains('recipe-explanation'))return;
    const disclosure=document.createElement('details');disclosure.className='recipe-explanation';disclosure.innerHTML='<summary>Feloldások és receptfeltételek</summary>';details.before(disclosure);disclosure.append(details);
    const source=disclosure.closest('.card').querySelector('a.learn');if(source)disclosure.append(source);
  });
}
const libraryObserver=new MutationObserver(records=>{
  libraryObserver.disconnect();
  const roots=new Set(records.flatMap(r=>[...r.addedNodes].map(n=>n.nodeType===1?n:n.parentElement)).filter(n=>n&&n.isConnected&&!n.closest('#globalSuggestions,.library-subnav')));
  roots.forEach(root=>{linkEntityNames(root);decorateSelectionTiles(root)});
  simplifyRecipeCards(document.querySelector('#recipes'));
  observeLibrary();
});
function observeLibrary(){libraryObserver.observe(document.querySelector('.wrap'),{childList:true,subtree:true});libraryObserver.observe(document.querySelector('#gearPicker'),{childList:true,subtree:true})}
linkEntityNames(document.querySelector('.wrap'));decorateSelectionTiles(document.querySelector('.wrap'));simplifyRecipeCards(document.querySelector('#recipes'));observeLibrary();
document.querySelector('#pickerTitle').insertAdjacentHTML('afterend','<p class="picker-help">Az ikonra vagy a névre bökve hozzáadod. A külön ⓘ Részletek gomb csak a leírást nyitja meg.</p>');
document.addEventListener('click',event=>{
  const target=event.target.closest('button[data-entity],[data-global-search],[data-global-result],[data-close-search]');if(!target)return;
  if(target.hasAttribute('data-entity')){event.preventDefault();openEntity(target.dataset.entity)}
  else if(target.hasAttribute('data-global-search'))openGlobalSearch();
  else if(target.hasAttribute('data-global-result'))chooseGlobalResult(Number(target.dataset.globalResult));
  else closeGlobalSearch();
});
document.addEventListener('keydown',event=>{if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='k'){event.preventDefault();openGlobalSearch()}});
