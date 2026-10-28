// Optional DOM integration tests. Install jsdom 26 in a temporary test environment.
const {JSDOM,VirtualConsole}=require(process.env.PG_JSDOM_MODULE||'jsdom');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const pause=()=>new Promise(resolve=>setTimeout(resolve,30));
function fixture(saved={}){
  const errors=[];const console=new VirtualConsole();
  console.on('jsdomError',error=>{if(!error.message.includes('Could not parse CSS stylesheet'))errors.push(error.message)});
  const dom=new JSDOM(html,{url:'https://pocket-test.invalid/',runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:console,beforeParse(w){
    w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=function(){};
    w.HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','')};
    w.HTMLDialogElement.prototype.close=function(){this.removeAttribute('open')};
    for(const [key,value] of Object.entries(saved))w.localStorage.setItem(key,value);
  }});return {dom,w:dom.window,d:dom.window.document,errors};
}
(async()=>{
  let {dom,w,d,errors}=fixture();await pause();
  assert.deepEqual(errors,[]);
  assert.equal(d.documentElement.lang,'en');
  assert.ok(d.querySelector('.beta-onboarding'));
  assert.equal(d.querySelectorAll('#recipeGrid .card').length,29);
  assert.equal(w.eval('profileHasAny()'),false);
  assert.equal(d.querySelectorAll('#dlcSettings [aria-pressed=true]').length,0);
  assert.equal(w.localStorage.getItem('pg-language'),'en');
  w.eval("openPanel('run');openGearPicker('weapon',0)");await pause();
  const garlic=d.querySelector('.picker-item[aria-label="Add: Garlic"]');assert.ok(garlic);
  garlic.click();await pause();
  assert.equal(JSON.parse(w.localStorage.getItem('vs-run')).weapons[0].name,'Garlic');
  assert.equal(d.querySelector('#entityDialog').open,false,'Picker adds gear without opening details');
  w.eval("openEntity('Garlic')");await pause();
  assert.ok(d.querySelector('#entityBody').textContent.includes('Collect 5 Floor Chickens'));
  w.eval('backEntity()');
  w.eval("openPanel('death')");await pause();
  assert.ok(d.querySelector('#death .spoiler-content').hidden);
  d.querySelector('[data-reveal-panel=death]').click();await pause();
  assert.equal(d.querySelector('#death .spoiler-content').hidden,false);
  assert.ok(d.querySelector('#secrets .spoiler-content').hidden);
  d.querySelector('[data-open-about]').click();await pause();
  assert.ok(d.querySelector('#aboutDialog').open);
  assert.ok(d.querySelector('#aboutDialog').textContent.includes('Saves & privacy'));
  d.querySelector('[data-close-about]').click();await pause();
  assert.equal(d.querySelector('#aboutDialog').open,false);
  d.querySelector('#dismissOnboarding').click();assert.equal(w.localStorage.getItem('pg-onboarded'),'1');
  assert.deepEqual(errors,[]);dom.window.close();
  const profile=JSON.stringify({version:1,unlocked:{weapons:['Garlic'],passives:['Pummarola'],characters:[],arcanas:[],relics:['Yellow Sign'],stages:[],secrets:[]}});
  ({dom,w,d,errors}=fixture({'hs-profile-v1':profile,'vs-r0':'1','vs-dlcs':'["Legacy of the Moonspell"]'}));await pause();
  assert.equal(d.documentElement.lang,'hu');
  assert.equal(d.querySelector('.beta-onboarding'),null);
  assert.ok(JSON.parse(w.localStorage.getItem('hs-profile-v1')).unlocked.weapons.includes('Garlic'));
  assert.equal(w.localStorage.getItem('vs-r0'),'1');
  assert.equal(d.querySelectorAll('#dlcSettings [aria-pressed=true]').length,1);
  assert.equal(d.querySelector('#home .home-heading h2').textContent,'Hol folytassuk?');
  assert.deepEqual(errors,[]);dom.window.close();
  console.log('PASS: DOM startup, English/Hungarian defaults, clean profile/DLC state, original save preservation, picker action separation, translated entity details, spoilers and About dialog');
})().catch(error=>{console.error(error);process.exit(1)});
