// Connected codex and contextual run advice. The build embeds this in index.html.
const escapeText = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const searchKey = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const wikiFile = name => W+'Special:Redirect/file/'+encodeURIComponent(name);
const baseStageUnlocks = {
  'Mad Forest':'Kezdettől elérhető.',
  'Inlaid Library':'Érd el a 20. szintet a Mad Forestben.',
  'Dairy Plant':'Érd el a 40. szintet az Inlaid Libraryben.',
  'Gallo Tower':'Érd el a 60. szintet a Dairy Plantben.',
  'Cappella Magna':'Érd el a 80. szintet a Gallo Towerben.'
};
const atlasStages = [...Object.entries(baseStageUnlocks).map(([name,unlock])=>({name,unlock,kind:'Alappálya'})), ...maps.map(m=>({name:m[1],unlock:m[3],kind:m[2]}))];
const tilemapStages = new Set([...Object.keys(baseStageUnlocks),'Green Acres']);
const codexSections = [
  ['recipes','Evolúciók','Fegyver + fejlesztő tárgy'],['special','Uniók','Egyesülések és átalakulások'],
  ['items','Tárgyak','Fegyverek, passzívak, ereklyék'],['arcana','Arcanák','Hatások és feloldások'],
  ['characters','Karakterek','Kezdőfegyver és képesség'],['maps','Pályák','Eredeti képek és útmutatók'],
  ['getting-started','Kezdőknek','Az első köröktől az evolúcióig'],['progress','Merre tovább?','Haladási útvonal és kincsek'],
  ['death','Red Death','A 30. perc utáni stratégia'],['codex','Minden rész','Keresés, DLC-k és további tudás']
];

// Pure recipe requirements, shared by recommendations and the checklist.
function passiveRequirements(label){
  if(!label || /^(Nincs|Teljesen)/.test(label))return [];
  const sharedMax=label.startsWith('MAX ');
  return label.split(' + ').map(s=>({name:s.replace(/^MAX /,'').trim(),max:sharedMax||s.startsWith('MAX ')}));
}
function runRecipes(){
  return [...recipes.map(r=>({weaponNames:[r.weapon],passives:passiveRequirements(r.passive),result:r.result,source:r})),
    ...specials.filter(s=>s.type==='Unió'||s.result==='Sole Solution').map(s=>({weaponNames:s.base.flatMap(components),passives:passiveRequirements(s.passive),result:s.result,source:s}))];
}
function recipeState(recipe,state){
  const requirements=recipe.weaponNames.map(name=>{
    const held=state.weapons.find(w=>w.name===name);
    // Bloody Tear is already evolved and has no further levels.
    return {name,type:'weapon',owned:!!held,done:!!held&&(name==='Bloody Tear'||held.max),max:true};
  }).concat(recipe.passives.map(p=>({name:p.name,type:'passive',owned:state.passives.includes(p.name),done:state.passives.includes(p.name)&&(!p.max||!!state.passiveMax?.[p.name]),max:p.max})));
  return {requirements,ready:requirements.every(r=>r.done),relevant:recipe.weaponNames.some(n=>state.weapons.some(w=>w.name===n))};
}
function groundItems(stage){
  const detail=stageDetails.find(s=>s.name===stage);
  if(!detail)return [];
  if(stage==='Moongolow')return ['Spinach','Armor','Hollow Heart','Pummarola','Empty Tome','Candelabrador','Bracer','Spellbinder','Duplicator','Wings','Attractorb','Clover','Crown','Stone Mask','Tirajisú',"Skull O'Maniac"];
  return allPassives.filter(n=>detail.items.includes(n));
}
function contextualRecommendations(state,profile){
  const result=[],seen=new Set(),context=state.context||{},ground=groundItems(context.stage);
  const add=r=>{const key=r.type+'|'+r.name;if(!seen.has(key)){seen.add(key);result.push(r)}};
  for(const recipe of runRecipes()){
    const status=recipeState(recipe,state);if(!status.relevant)continue;
    if(status.ready){add({rank:0,kind:'ready',type:'result',name:recipe.result,title:recipe.result+': összetevők készen',text:'Most egy evolúcióra képes láda kell. A megfelelő láda feltétele pályánként változhat.',action:''});continue}
    for(const req of status.requirements.filter(r=>!r.done)){
      if(req.owned){add({rank:1,kind:'next',type:'level',name:req.name,title:'Fejleszd MAX-ra: '+req.name,text:recipe.result+' még vár erre a '+(req.type==='weapon'?'fegyverszintre.':'passzív tárgyra. A birtoklása önmagában nem elég.'),action:''});continue}
      const full=req.type==='weapon'?state.weapons.every(w=>w.name):state.passives.every(Boolean);
      const list=profile?.unlocked?.[req.type==='weapon'?'weapons':'passives']||[];
      const hasProfile=Object.values(profile?.unlocked||{}).some(a=>a.length);
      let note='Ez hiányzik ehhez: '+recipe.result+'.';
      if(ground.includes(req.name))note+=' A kiválasztott pályán földi tárgyként is megszerezhető.';
      if(full)note+=req.type==='passive'?' A hat normál passzív hely betelt; földi tárggyal a játékban túllépheted ezt.':' A hat fegyverhely betelt; egy unió szabadíthat fel helyet.';
      if(hasProfile&&!list.includes(req.name))note+=' A profilban még nincs bejelölve; ellenőrizd a feloldását a Kódexben.';
      add({rank:2,kind:'next',type:req.type,name:req.name,title:'Keresd: '+req.name,text:note,action:full?'':'Hozzáadás'});
    }
  }
  const character=characters.find(c=>c.name===context.character);
  if(character&&!state.weapons.some(w=>w.name===character.weapon))add({rank:3,kind:'synergy',type:'weapon',name:character.weapon,title:character.weapon+' a kezdőfegyvered',text:character.name+' ezzel indul. '+character.power,action:state.weapons.some(w=>!w.name)?'Hozzáadás':''});
  if(state.weapons.some(w=>w.name)&&!state.passives.includes('Empty Tome'))add({rank:5,kind:'synergy',type:'passive',name:'Empty Tome',title:'Általános lehetőség: Empty Tome',text:'Sok fegyver újratöltését gyorsítja.'+(ground.includes('Empty Tome')?' Az Inlaid Library nyugati oldalán földről is felveheted.':''),action:state.passives.some(p=>!p)?'Hozzáadás':''});
  return result.sort((a,b)=>a.rank-b.rank).slice(0,8);
}

// Interface setup. Keep existing panel IDs and local saves intact.
const savedCompanionRun = (()=>{try{return JSON.parse(localStorage.getItem('vs-run')||'null')}catch{return null}})();
runState.passiveMax=savedCompanionRun?.passiveMax||{};
runState.context=savedCompanionRun?.context||{};

const companionMarkup = '<section id="codex" class="panel"><div class="section-head"><div><span class="eyebrow">Tudástár</span><h2>A túlélő kódexe</h2><p>Egy keresés összeköti a fegyvereket, recepteket, karaktereket és útmutatókat.</p></div></div><label class="global-search-label" for="codexSearch">Mit szeretnél megtalálni?</label><input id="codexSearch" class="search" type="search" placeholder="Garlic, Poe, gyógyítás, Yellow Sign…"><p id="codexSearchCount" class="search-status" aria-live="polite"></p><div id="codexSearchResults" class="connected-results"></div><div id="codexBrowse" class="codex-browse"></div></section>'+
  '<section id="items" class="panel"><div class="section-head"><div><h2>Tárgyak és ereklyék</h2><p>Mit csinál, hogyan oldható fel, és melyik recepthez vezet?</p></div></div><div class="item-tabs" aria-label="Tárgytípus"><button data-item-kind="weapons" aria-pressed="true">Fegyverek</button><button data-item-kind="passives" aria-pressed="false">Passzív tárgyak</button><button data-item-kind="relics" aria-pressed="false">Ereklyék</button></div><input id="itemSearch" class="search" type="search" aria-label="Tárgykeresés" placeholder="Név vagy feloldási feltétel…"><div id="itemEntries" class="item-entries"></div></section>'+
  '<section id="getting-started" class="panel"><div class="section-head"><div><span class="eyebrow">Az első köröd</span><h2>Kezdők kézikönyve</h2><p>Nem kell mindent azonnal feloldanod. Kezdj egy fegyverrel, és tanulj minden körből.</p></div></div><div id="starterSteps" class="starter-steps"></div><div class="tip"><strong>Egy egyszerű első terv:</strong> Antonio + Whip → Hollow Heart → Bloody Tear. Előbb erősítsd a Whipet, mint hogy hat gyenge fegyvert gyűjtenél. A Hollow Heart feloldásához élj túl 1 percet bármelyik karakterrel.</div><button class="check" data-open="run">Megnyitom a körsegédet</button></section>';
document.querySelector('#home').insertAdjacentHTML('afterend',companionMarkup);
const starterSteps=[
  ['Mozogj, a fegyver támad helyetted','Kerüld a bekerítést, keress szabad utat. A fegyverek automatikusan támadnak; a mozgásod és a választásaid döntik el a kört.','mechanics'],
  ['Gyűjts XP-t, erősíts egy tervet','A legyőzött ellenfelek drágakövei szintlépést adnak. Szintlépéskor új fegyvert, passzív tárgyat vagy egy meglévő fejlesztését választhatod.','items'],
  ['Figyeld a hat-hat helyet','Általában hat fegyver és hat passzív fér a szintlépési felszerelésedbe. A passzívak például a sebzést vagy újratöltést módosítják. A pályáról felvett tárgyak túlléphetik a normál passzív korlátot.','run'],
  ['Készíts egy evolúciót','Legyen MAX szintű az alapfegyver, és legyen nálad a recept tárgya. Néhány recept a passzív MAX szintjét is kéri. Ezután megfelelő főellenfél-láda kell; sok pályán a 10. perc előtt megjelenő láda még nem alkalmas.','recipes'],
  ['A vereség is előrelépés','A kör felszerelése újrakezdődik, a megszerzett arany és feloldások megmaradnak. A főmenü PowerUp részében tartós erősítéseket vásárolhatsz. Az Unlocks menü konkrét célokat ad.','progress'],
  ['A 30. perc nem minden történet vége','A legtöbb normál kör végén megjelenik a Reaper. Eleinte teljesen rendben van itt elveszíteni a kört. Legyőzése későbbi ereklyékre és különleges felszerelésre épül.','death']
];
document.querySelector('#starterSteps').innerHTML=starterSteps.map((s,i)=>'<article class="starter-step"><span class="step-number">'+(i+1)+'</span><div><h3>'+s[0]+'</h3><p>'+s[1]+'</p><button class="text-link" data-open="'+s[2]+'">Kapcsolódó útmutató →</button></div></article>').join('');

// A compact second tier sits underneath the four primary destinations.
const dock=document.createElement('div');dock.className='companion-dock';
document.body.append(dock);dock.append(document.querySelector('.primary-nav'));
dock.insertAdjacentHTML('beforeend','<nav id="codexSubnav" class="codex-subnav" aria-label="Kódex kategóriák" hidden><span class="subnav-hint">Kategóriák · lapozz oldalra →</span><div class="subnav-scroll">'+codexSections.map(([id,label])=>'<button data-open="'+id+'">'+label+'</button>').join('')+'</div></nav>');
const codexButton=document.querySelector('.primary-nav [data-tab="recipes"]');
codexButton.dataset.tab='codex';
document.querySelector('.home-card[data-open="recipes"]').dataset.open='codex';
const codexPanels=['codex','recipes','special','items','arcana','characters','maps','getting-started','progress','death','mechanics','dlc','how','secrets'];
codexPanels.forEach(id=>panelParents[id]='codex');
const openPanelBeforeCompanion=openPanel;
openPanel=function(id,scroll=true){
  if(!document.getElementById(id))return;
  openPanelBeforeCompanion(id,false);
  const isCodex=codexPanels.includes(id);document.querySelector('#codexSubnav').hidden=!isCodex;
  document.body.classList.toggle('codex-open',isCodex);
  document.querySelectorAll('.primary-nav button').forEach(b=>b.setAttribute('aria-current',b.classList.contains('active')?'page':'false'));
  document.querySelectorAll('#codexSubnav button').forEach(b=>{const active=b.dataset.open===id;b.classList.toggle('active',active);b.setAttribute('aria-current',active?'page':'false');if(active&&id!=='codex')b.scrollIntoView({block:'nearest',inline:'nearest',behavior:'instant'})});
  if(id==='codex')document.querySelector('.subnav-scroll').scrollLeft=0;
  if(scroll){const heading=document.querySelector('#'+id+' h2');if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true})}document.getElementById(id).scrollIntoView({block:'start',behavior:'instant'})}
};
document.querySelectorAll('.primary-nav button').forEach(b=>b.onclick=()=>openPanel(b.dataset.tab));
// The category dock supersedes the old hidden category drawers.
document.querySelector('#recipes .section-drawer').hidden=true;
document.querySelector('#profile .section-drawer').outerHTML='<div class="journey-shortcuts"><button data-open="progress">Merre tovább? →</button><button data-open="maps">Pályák →</button><button data-open="death">Red Death →</button><button data-open="secrets">Titkok →</button></div>';
document.querySelector('#codexBrowse').innerHTML='<div class="codex-section-grid">'+codexSections.filter(c=>c[0]!=='codex').concat([['mechanics','Mechanikák','Módok és különleges szabályok'],['dlc','DLC-k','Kiegészítők és új világok'],['secrets','Titkok','Tippek, külön felfedhető megoldások']]).map(([id,title,desc])=>'<button class="codex-section-card" data-open="'+id+'"><strong>'+title+'</strong><span>'+desc+'</span></button>').join('')+'</div>';

// Atlas: original wiki images, never a synthetic map or invented item overlay.
document.querySelector('#maps').innerHTML='<div class="section-head"><div><h2>Pályaatlasz</h2><p>Az öt alap- és a kódexben szereplő bónuszpályák. A képek az eredeti wiki-fájlokra hivatkoznak.</p></div></div><input id="atlasSearch" class="search" type="search" aria-label="Pályakeresés" placeholder="Pálya, ereklye vagy földi tárgy…"><div class="tip">A Milky Way Map mutatja a játékbeli tárgyhelyeket. Az alábbi pályarajzok a terepet ábrázolják; az ismétlődő pályákon nem teljes világ- vagy tárgytérképek.</div><div id="atlasGrid" class="atlas-grid"></div>';
function renderAtlas(){const q=searchKey(document.querySelector('#atlasSearch').value);document.querySelector('#atlasGrid').innerHTML=atlasStages.filter(s=>searchKey(s.name+' '+s.unlock+' '+JSON.stringify(stageDetails.find(d=>d.name===s.name)||{})).includes(q)).map(s=>{
  const d=stageDetails.find(d=>d.name===s.name),file='Stage-'+s.name.replaceAll(' ','_')+'.png';
  return '<article class="atlas-card" data-stage="'+escapeText(s.name)+'"><a href="'+W+slug(s.name)+'" target="_blank" rel="noreferrer"><img loading="lazy" src="'+wikiFile(file)+'" alt="'+escapeText(s.name)+' eredeti pályaelőnézete" onerror="this.hidden=true;this.parentElement.nextElementSibling.hidden=false"></a><p class="image-unavailable" hidden>A kép nem tölthető be. Az eredeti a pálya wikioldalán érhető el.</p><div class="atlas-copy"><span class="eyebrow">'+escapeText(s.kind)+'</span><h3>'+s.name+'</h3><p><b>Feloldás:</b> '+escapeText(s.unlock)+'</p>'+(d?'<p><b>Földi tárgyak:</b> '+escapeText(d.items)+'</p><p><b>Ereklyék:</b> '+escapeText(d.relic)+'</p><p><b>Koporsó:</b> '+escapeText(d.coffin)+'</p>':'')+(tilemapStages.has(s.name)?'<details class="map-art"><summary>Eredeti pályarajz megnyitása</summary><a href="'+wikiFile('Tilemap-'+s.name.replaceAll(' ','_')+'.png')+'" target="_blank" rel="noreferrer"><img loading="lazy" src="'+wikiFile('Tilemap-'+s.name.replaceAll(' ','_')+'.png')+'" alt="'+escapeText(s.name)+' tereprajza a wikiből" onerror="this.hidden=true">Teljes méret ↗</a></details>':'')+'<a class="learn" href="'+W+slug(s.name)+'" target="_blank" rel="noreferrer">Pálya és forrás a wikiben ↗</a></div></article>';
}).join('')||'<p class="tip">Nincs ilyen pálya.</p>'}
document.querySelector('#atlasSearch').oninput=renderAtlas;renderAtlas();

// The item catalogue connects unlocks to every existing matching recipe.
let activeItemKind='weapons';
function itemCatalog(kind){
  if(kind==='relics')return relics.map(r=>({name:r[0],text:r[2],unlock:r[1]}));
  const data=kind==='weapons'?weaponUnlocks:passiveUnlocks;
  return Object.entries(data).map(([name,unlock])=>({name,unlock,text:kind==='weapons'?'Fegyver':'Passzív fejlesztő tárgy'}));
}
function relatedRecipes(name){return recipes.filter(r=>r.weapon===name||iconNames(r.passive).includes(name)||r.result===name)}
function renderItemCatalog(){
  const q=searchKey(document.querySelector('#itemSearch').value);
  document.querySelector('#itemEntries').innerHTML=itemCatalog(activeItemKind).filter(i=>searchKey(i.name+' '+i.unlock+' '+i.text).includes(q)).map(i=>{
    const matches=relatedRecipes(i.name),unions=specials.filter(s=>s.base.flatMap(components).includes(i.name)||iconNames(s.passive||'').includes(i.name));
    return '<article class="item-entry" data-item="'+escapeText(i.name)+'"><img loading="lazy" src="'+img(i.name)+'" alt="" onerror="fallback(this)"><div><h3>'+escapeText(i.name)+'</h3><p>'+escapeText(i.text)+'</p><p><b>Elérhetővé tétel / hely:</b> '+escapeText(i.unlock)+'</p>'+matches.map(r=>'<button class="text-link" data-recipe="'+r.id+'">'+escapeText(r.weapon+' → '+r.result)+' →</button>').join('')+unions.map(s=>'<button class="text-link" data-special="'+escapeText(s.result)+'">'+escapeText(s.result)+' · különleges recept →</button>').join('')+'<a class="learn" href="'+W+slug(i.name)+'" target="_blank" rel="noreferrer">Wiki ↗</a></div></article>';
  }).join('')||'<p class="tip">Nincs találat.</p>';
  document.querySelectorAll('[data-item-kind]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.itemKind===activeItemKind));
  if(activeItemKind==='relics')document.querySelectorAll('#itemEntries .item-entry').forEach(article=>{
    const relic=relics.find(r=>r[0]===article.dataset.item),stage=atlasStages.find(s=>relic?.[1].includes(s.name));
    if(stage){const b=document.createElement('button');b.className='text-link';b.textContent=stage.name+' a pályaatlaszban →';b.onclick=()=>{document.querySelector('#atlasSearch').value=stage.name;renderAtlas();openPanel('maps')};article.querySelector('div').append(b)}
  });
}
document.querySelectorAll('[data-item-kind]').forEach(b=>b.onclick=()=>{activeItemKind=b.dataset.itemKind;document.querySelector('#itemSearch').value='';renderItemCatalog()});
document.querySelector('#itemSearch').oninput=renderItemCatalog;renderItemCatalog();

// Search uses canonical local data and explicit cross-links, with no hidden secret solutions indexed.
const arcanaRelations={
  'Gemini (I)':['Peachone','Ebony Wings','Phiera Der Tuphello','Eight The Sparrow','Gatti Amari'],
  'Sarabande of Healing (VI)':['Garlic','Soul Eater','Whip','Bloody Tear','Pummarola'],
  'Waltz of Pearls (XI)':['Magic Wand','Cross','Fire Wand','Carréllo'],
  'Slash (XVI)':['Whip','Bloody Tear','Knife','Axe','Vento Sacro'],
  'Blood Astronomia (XXI)':['Garlic','King Bible','Pentagram','Song of Mana','Clock Lancet','Laurel']
};
let searchEntries=[];
function rebuildSearchIndex(){
  searchEntries=[
    ...recipes.map(r=>({title:r.result,type:'Evolúció',text:r.weapon+' + '+r.passive+' · '+r.starter+' · '+componentUnlock(r.weapon),panel:'recipes',query:r.weapon,recipe:r.id,image:r.result})),
    ...specials.map(s=>({title:s.result,type:s.type,text:s.base.join(' + ')+' · '+(s.passive||'')+' · '+s.note,panel:'special',special:s.result,image:s.result})),
    ...['weapons','passives','relics'].flatMap(kind=>itemCatalog(kind).map(i=>({title:i.name,type:kind==='weapons'?'Fegyver':kind==='passives'?'Passzív tárgy':'Ereklye',text:i.text+' · '+i.unlock,panel:'items',kind,query:i.name,image:i.name}))),
    ...characters.map(c=>({title:c.name,type:'Karakter',text:c.weapon+' · '+c.power+' · '+c.unlock,panel:'characters',query:c.name,image:c.name,character:true})),
    ...arcanas.map(a=>({title:a.name,type:'Arcana',text:a.effect+' · '+a.unlock,panel:'arcana',query:a.name,image:a.name,relations:arcanaRelations[a.name]||[]})),
    ...atlasStages.map(s=>({title:s.name,type:'Pálya',text:s.unlock+' · '+Object.values(stageDetails.find(d=>d.name===s.name)||{}).join(' · '),panel:'maps',query:s.name,stage:true})),
    ...starterSteps.map(s=>({title:s[0],type:'Kezdőknek',text:s[1],panel:'getting-started'})),
    ...progressSteps.map(s=>({title:s.title,type:'Merre tovább?',text:s.short,panel:'progress'})),
    ...mechanics.map(m=>({title:m[1],type:'Mechanika',text:m[2],panel:'mechanics'})),
    ...dlcs.map(d=>({title:d[0],type:'DLC',text:d[1]+' · '+d[3],panel:'dlc'})),
    {title:'Red Death legyőzése',type:'Útmutató',text:'Halál Reaper Infinite Corridor Crimson Shroud Clock Lancet Laurel Yellow Sign',panel:'death'},
    {title:'Titokvadász napló',type:'Titkok',text:'Rejtett karakterek és külön felfedhető megoldások',panel:'secrets'}
  ];
}
let visibleSearchEntries=[];
function renderConnectedSearch(){
  const q=searchKey(document.querySelector('#codexSearch').value.trim());
  document.querySelector('#codexBrowse').hidden=!!q;
  if(!q){document.querySelector('#codexSearchResults').innerHTML='';document.querySelector('#codexSearchCount').textContent='';return}
  const words=q.split(/\s+/),matches=searchEntries.filter(e=>words.every(w=>searchKey(e.title+' '+e.text+' '+(e.relations||[]).join(' ')).includes(w)));
  matches.sort((a,b)=>(searchKey(b.title)===q?2:searchKey(b.title).includes(q)?1:0)-(searchKey(a.title)===q?2:searchKey(a.title).includes(q)?1:0));
  visibleSearchEntries=matches;
  document.querySelector('#codexSearchCount').textContent=matches.length+' kapcsolódó találat';
  document.querySelector('#codexSearchResults').innerHTML=matches.map((e,i)=>'<button class="connected-result" data-search-result="'+i+'">'+(e.image?'<img loading="lazy" src="'+(e.character?selectImg(e.image):img(e.image))+'" alt="" onerror="this.hidden=true">':'<span class="result-marker" aria-hidden="true">◆</span>')+'<span><small>'+e.type+'</small><strong>'+escapeText(e.title)+'</strong><span>'+escapeText(e.relations?.some(n=>searchKey(n).includes(q))?'Kapcsolódó felszerelés: '+e.relations.join(', '):e.text.replace(/[{}\[\]"]/g,'').slice(0,160))+'</span></span><span aria-hidden="true">›</span></button>').join('')||'<div class="tip">Nincs találat. Próbálj fegyvernevet, karaktert vagy másik kifejezést.</div>';
}
document.querySelector('#codexSearch').oninput=renderConnectedSearch;rebuildSearchIndex();
function revealRecipe(id){const r=recipes.find(r=>r.id===id);if(!r)return;document.querySelectorAll('.chip').forEach(b=>b.classList.toggle('active',b.dataset.filter==='all'));document.querySelector('#search').value=r.weapon;render();openPanel('recipes');}
function revealSpecial(name){openPanel('special');const cards=[...document.querySelectorAll('#specialGrid .card')];const card=cards[specials.findIndex(s=>s.result===name)];card?.scrollIntoView({block:'start'})}
document.addEventListener('click',e=>{
  const r=e.target.closest('[data-recipe]');if(r)revealRecipe(r.dataset.recipe);
  const s=e.target.closest('[data-special]');if(s)revealSpecial(s.dataset.special);
  const button=e.target.closest('[data-search-result]');if(!button)return;
  const entry=visibleSearchEntries[Number(button.dataset.searchResult)];if(!entry)return;
  if(entry.recipe){revealRecipe(entry.recipe);return}if(entry.special){revealSpecial(entry.special);return}
  if(entry.panel==='items'){activeItemKind=entry.kind;document.querySelector('#itemSearch').value=entry.query;renderItemCatalog()}
  if(entry.panel==='characters'){document.querySelector('#characterSearch').value=entry.query;renderCharacters()}
  if(entry.panel==='arcana'){document.querySelector('#arcanaSearch').value=entry.query;document.querySelectorAll('.arcana-filter').forEach(b=>b.classList.toggle('active',b.dataset.arcana==='all'));renderArcanas()}
  if(entry.panel==='maps'){document.querySelector('#atlasSearch').value=entry.query;renderAtlas()}
  openPanel(entry.panel);
});

// Context can be left blank. Picking a character never silently overwrites a build.
document.querySelector('#run .section-head').insertAdjacentHTML('afterend','<details class="run-context"><summary>Kör körülményei <span id="contextSummary"></span></summary><p>A tanácsok a megadott pályához, karakterhez és a profilban jelölt tárgyakhoz igazodnak. A játék állapotát kézzel követjük.</p><label for="contextCharacterSearch">Karakter keresése</label><input id="contextCharacterSearch" class="search" type="search" placeholder="Antonio, Poe…"><div id="contextCharacters" class="context-choices"></div><label>Pálya</label><div id="contextStages" class="context-choices"></div><button id="clearRunContext" class="check">Körülmények törlése</button></details><p class="run-scope">Az ajánló a kódex alapjáték-receptjeit kezeli. A DLC-receptek a DLC-atlaszban találhatók.</p>');
function renderContext(){
  const ctx=runState.context||{},q=searchKey(document.querySelector('#contextCharacterSearch').value);
  document.querySelector('#contextSummary').textContent=[ctx.character,ctx.stage].filter(Boolean).join(' · ')||'Opcionális';
  document.querySelector('#contextCharacters').innerHTML=characters.filter(c=>searchKey(c.name).includes(q)).map(c=>'<button data-context-character="'+escapeText(c.name)+'" aria-pressed="'+(ctx.character===c.name)+'"><img loading="lazy" src="'+selectImg(c.name)+'" alt="" onerror="this.hidden=true">'+escapeText(c.name)+'</button>').join('');
  document.querySelector('#contextStages').innerHTML=atlasStages.map(s=>'<button data-context-stage="'+escapeText(s.name)+'" aria-pressed="'+(ctx.stage===s.name)+'">'+escapeText(s.name)+'</button>').join('');
}
document.querySelector('#contextCharacterSearch').oninput=renderContext;
document.querySelector('#clearRunContext').onclick=()=>{runState.context={};renderRun();renderContext()};
document.addEventListener('click',e=>{
  const c=e.target.closest('[data-context-character]'),s=e.target.closest('[data-context-stage]');
  if(c||s){runState.context=runState.context||{};if(c)runState.context.character=c.dataset.contextCharacter;if(s)runState.context.stage=s.dataset.contextStage;renderRun();renderContext()}
});
calculateRecommendations=function(){return contextualRecommendations(runState,profileState)};
renderRecommendations=function(){
  currentRecommendations=calculateRecommendations();
  document.querySelector('#runRecommendations').innerHTML=currentRecommendations.map((r,i)=>'<article class="recommendation '+r.kind+'"><div class="recommendation-icon"><img src="'+img(r.name)+'" alt="" onerror="fallback(this)"></div><div><span class="recommendation-rank">'+(r.rank===0?'Összetevők készen':r.rank<3?'Következő lépés':'A körödhöz kapcsolódik')+'</span><h3>'+escapeText(r.title)+'</h3><p>'+escapeText(r.text)+'</p></div>'+(r.action?'<button class="recommendation-action" onclick="applyRecommendation('+i+')">＋ '+r.action+'</button>':'')+'</article>').join('')||'<p class="tip">Válassz fegyvert vagy add meg a karaktert. Ezután itt jelennek meg a körödhöz illő következő lépések.</p>';
};
const renderRunBeforeCompanion=renderRun;
renderRun=function(){
  runState.passiveMax=runState.passiveMax||{};runState.context=runState.context||{};
  renderRunBeforeCompanion();
  const maxPassives=new Set(runRecipes().filter(r=>recipeState(r,runState).relevant).flatMap(r=>r.passives.filter(p=>p.max).map(p=>p.name)));
  document.querySelectorAll('#passiveSlots .gear-slot').forEach((slot,i)=>{
    const name=runState.passives[i];if(!name||!maxPassives.has(name))return;
    slot.insertAdjacentHTML('beforeend','<button class="gear-max '+(runState.passiveMax[name]?'active':'')+'" data-passive-max="'+escapeText(name)+'" aria-pressed="'+!!runState.passiveMax[name]+'">'+(runState.passiveMax[name]?'✓ MAX':'MAX?')+'</button>');
  });
  const rows=runRecipes().map(recipe=>({recipe,status:recipeState(recipe,runState)})).filter(x=>x.status.relevant);
  document.querySelector('#runResults').innerHTML=rows.map(({recipe,status})=>'<article class="run-checklist '+(status.ready?'ready':'')+'"><h3>'+escapeText(recipe.result)+'</h3><ul>'+status.requirements.map(r=>'<li class="'+(r.done?'complete':'')+'">'+(r.done?'✓ ':'○ ')+escapeText(r.name)+(r.max?' · MAX':' · nálad van')+(!r.owned?' · még hiányzik':!r.done?' · fejlesztendő':'')+'</li>').join('')+'</ul><p>'+ (status.ready?'Az összetevők készek. Nyiss ki egy megfelelő evolúciós ládát.':'A hiányzó összetevőket és szinteket pótold először.')+'</p></article>').join('')||'<p class="tip">Válassz fegyvert a receptfeltételek megjelenítéséhez.</p>';
  document.querySelectorAll('.gear-max').forEach(b=>{if(!b.hasAttribute('aria-pressed'))b.setAttribute('aria-pressed',b.classList.contains('active'))});
};
document.addEventListener('click',e=>{const b=e.target.closest('[data-passive-max]');if(b){const name=b.dataset.passiveMax;runState.passiveMax[name]=!runState.passiveMax[name];renderRun()}});
const removeRunBeforeCompanion=removeRunItem;
removeRunItem=function(type,i){if(type==='passive')delete runState.passiveMax?.[runState.passives[i]];removeRunBeforeCompanion(type,i)};
const chooseGearBeforeCompanion=chooseGear;
chooseGear=function(i){if(pickerContext.type==='passive'){const previous=runState.passives[pickerContext.index];if(previous!==pickerItems[i])delete runState.passiveMax?.[previous]}chooseGearBeforeCompanion(i)};
const renderProfileBeforeCompanion=renderProfile;
renderProfile=function(){renderProfileBeforeCompanion();renderRecommendations();};
document.querySelector('#resetRun').onclick=()=>{runState=emptyRun();runState.passiveMax={};runState.context={};renderRun();renderContext()};
renderRun();renderContext();
