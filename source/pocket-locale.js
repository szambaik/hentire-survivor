// __POCKET_LOCALE__ Presentation-only translations: canonical names/save IDs never change.
(() => {
  const volatile = new Map();
  window.pgStorage = {
    get(key) { try { return localStorage.getItem(key); } catch { return volatile.get(key) ?? null; } },
    set(key,value) { try { localStorage.setItem(key,value); } catch { volatile.set(key,value); } }
  };
  const saved=window.pgStorage.get('pg-language');
  // Existing Hungarian visitors keep their language; fresh international visitors get the preview.
  const legacy=['hs-profile-v1','vs-run','vs-progress'].some(k=>window.pgStorage.get(k));
  window.pgLanguage=['hu','en'].includes(saved)?saved:legacy||navigator.language?.toLowerCase().startsWith('hu')?'hu':'en';
  window.pgStorage.set('pg-language',window.pgLanguage);
  document.documentElement.lang=window.pgLanguage;
  const entries = [
    ['BÉTA · NEM HIVATALOS','BETA · UNOFFICIAL'],['Az oldalról','About'],['Vampire Survivors kísérő','Vampire Survivors companion'],
    ['Keresd a következő evolúciód.','Find your next evolution.'],['Tervezz egy kört. Fedezd fel, mi vár még.','Plan a run. Discover what comes next.'],
    ['Pocket Grimoire · béta','Pocket Grimoire · beta'],['Nem hivatalos rajongói segédlet. Nem a poncle terméke.','Unofficial fan companion. Not a poncle product.'],
    ['Források és adatvédelem','Sources & privacy'],['Hiba vagy ötlet? ↗','Report a bug or share an idea ↗'],['Felületfrissítés:','Interface updated:'],['· A játékadatok nem élő adatok.','· Game data is not live.'],
    ['Hol folytassuk?','What’s your next move?'],['Egy recept, egy jó döntés, még egy kör.','One recipe. One good decision. One more run.'],
    ['Kezdőlap','Home'],['Aktuális kör','My run'],['Haladásom','My progress'],['Kódex','Codex'],['Főmenü','Main navigation'],
    ['Keresés','Search'],['Keresés…','Search…'],['Keresés mindenhol','Search everything'],['Globális keresés','Global search'],
    ['Fegyver, karakter, pálya, útmutató…','Weapon, character, stage, guide…'],['Gyors receptkönyv','Quick recipes'],
    ['Evolúciók és uniók','Evolutions & unions'],['Mi kell hozzá, és hogyan szerezd meg?','What you need and how to unlock it.'],
    ['Játék közben','During your run'],['Aktuális kör folytatása','Plan or continue a run'],['Válaszd ki az első fegyvert.','Choose your first weapon.'],
    ['Saját haladásod','Your journey'],['Saját túlélőprofilod','Your survivor profile'],['Következő cél','Next goal'],
    ['A profil alapján személyre szabva.','Suggestions based on your unlocks.'],['A feloldásokból kiszámoljuk a személyes következő célt.','Track your unlocks to find your next goal.'],
    ['••• Szabályok, kihívás és beállítások','••• Rules, challenges & settings'],['⚡ Kompakt mód','⚡ Compact mode'],['⚡ Normál nézet','⚡ Standard view'],
    ['☀ Kijelző ébren','☀ Keep screen awake'],['☀ Ébren tartva','☀ Screen kept awake'],['☀ Nem támogatott','☀ Not supported'],['☀ Engedélyezd Safariban','☀ Enable in Safari'],
    ['🎲 Napi kihívás','🎲 Random challenge'],['Mai küldetésed','Your challenge'],['Másikat kérek 🎲','Roll again 🎲'],
    ['Evolúciós receptek','Evolution recipes'],['Evolúciók','Evolutions'],['Evolúció','Evolution'],['Uniók','Unions'],['Unió','Union'],
    ['Uniók és extrák','Unions & extras'],['Uniók, ajándékok és átalakulások','Unions, gifts & morphs'],
    ['Ezek eltérnek a szokásos „egy fegyver + egy passzív tárgy” szabálytól.','These follow different rules from the usual weapon + passive recipe.'],
    ['Keress fegyverre, passzív tárgyra, eredményre vagy kezdőkarakterre.','Search by weapon, passive, evolved weapon or starting character.'],
    ['Például: Garlic, Wings vagy Imelda…','Try Garlic, Wings or Imelda…'],['Mind','All'],['♥ Kedvencek','♥ Favorites'],['Klasszikus','Classic'],['Haladó','Advanced'],['Új ingyenes tartalom','Free updates'],
    ['Pipák törlése','Clear checkmarks'],['Megjelölés','Mark complete'],['Megvan ✓','Done ✓'],['✓ Megvan','✓ Unlocked'],['＋ Jelölés','＋ Mark unlocked'],
    ['Nincs találat.','No results.'],['Nincs találat. Próbálj másik nevet! ✦','No results. Try a different name! ✦'],
    ['Fordított kereső és további szűrők','Reverse lookup & more filters'],['Mi készülhet ebből?','What can I make with this?'],
    ['Válassz ki egy nálad lévő tárgyat, és megmutatjuk az összes kapcsolódó receptet.','Choose an item you have to see its matching recipes.'],
    ['Válassz fegyvert vagy passzív tárgyat…','Choose a weapon or passive…'],['alaprecept','base recipe'],['haladó','advanced'],['ingyenes frissítés','free update'],['Ingyenes frissítés','Free update'],
    ['Feloldások és receptfeltételek','Unlocks & recipe requirements'],['Alapfegyver elérhetővé tétele:','Unlock the base weapon:'],['Fejlesztő tárgy elérhetővé tétele:','Unlock the passive:'],
    ['Evolúciós feltétel:','Evolution requirement:'],['Kapcsolódó karakter:','Related character:'],['Részletek a wikiben ↗','Full details on the wiki ↗'],
    ['Bárki','Any character'],['Nincs passzív tárgy','No passive required'],['Nincs passzív','No passive'],['Nem szükséges hozzá passzív tárgy.','No passive item is required.'],
    ['MAX fegyverszint','MAX weapon level'],['Teljesen kiépített felszerelés','Fully upgraded loadout'],['80. szint','Level 80'],
    ['Részletek','Details'],['‹ Vissza','‹ Back'],['Bezárás','Close'],['Hozzáadás','Add'],['Áthelyezés ide','Move here'],['＋ Hozzáadás','＋ Add'],['＋ Áthelyezés ide','＋ Move here'],
    ['Csere','Swap'],['＋ Kiválasztás','＋ Select'],['Új kör','New run'],['Felszerelésválasztó','Choose equipment'],['Válassz fegyvert','Choose a weapon'],['Válassz passzív tárgyat','Choose a passive'],
    ['Keresés név alapján…','Search by name…'],['Csak a profilban feloldott tárgyak','Only items marked unlocked in my profile'],
    ['Az ikonra vagy a névre bökve hozzáadod. A külön ⓘ Részletek gomb csak a leírást nyitja meg.','Tap the icon or name to add it. The separate ⓘ Details button opens its description.'],
    ['Bökj egy üres helyre, majd válaszd ki az ikont. Az oldal megmondja, mi legyen a következő választás.','Tap an empty slot and pick an item. See what to look for next.'],
    ['⚔ Fegyverek','⚔ Weapons'],['✦ Passzív tárgyak','✦ Passives'],['Fegyverek','Weapons'],['Fegyver','Weapon'],['Passzív tárgyak','Passive items'],['Passzív tárgy','Passive item'],
    ['Játék közbeni másodpilóta','Your run companion'],['Mit válasszak?','What should I pick?'],['A legfontosabb lehetőségek elöl, rövid indoklással.','Your most useful next picks, with a short explanation.'],
    ['Evolúciós állapot','Evolution status'],['A zöld recept már csak egy megfelelő ládára vár.','A green recipe only needs an eligible chest.'],
    ['A kiválasztott fegyverek evolúciós állapota itt jelenik meg.','Your selected weapons’ evolution status appears here.'],
    ['Profilbeállítások','Profile settings'],['teljesítve','complete'],['Ajánlott következő cél','Suggested next goal'],['Gyűjteményalbum','Your collection'],
    ['Kezdő dolgok bejelölése','Mark starting unlocks'],['Profil mentése','Export profile'],['Profil visszaállítása','Import profile'],['Profil törlése','Clear profile'],
    ['Szerezd meg a Grim Grimoire-t','Find the Grim Grimoire'],['Az Inlaid Library nyugati oldalán találod. A szünetmenüben megmutatja az evolúciós recepteket.','Find it to the west in Inlaid Library. It adds evolution recipes to the pause menu.'],
    ['Keresd meg a Milky Way Mapet','Find the Milky Way Map'],['A Dairy Plant déli részén található, és felfedi a pályatárgyakat a térképen.','Find it in the south of Dairy Plant to see stage items on your map.'],
    ['Nyisd meg az Arcana rendszert','Unlock Arcanas'],['Vedd fel a Randomazzót a Gallo Tower északi részén.','Collect Randomazzo in the north of Gallo Tower.'],
    ['Szerezd meg a Sorceress’ Tearst','Find Sorceress’ Tears'],['A Gallo Tower déli részén találod; feloldja a Hurry módot.','Find it in the south of Gallo Tower to unlock Hurry mode.'],
    ['A következő nagy lépés: Yellow Sign','Your next big step: Yellow Sign'],['Moongolow Lunar Eclipse eseménye után juss végig a Holy Forbidden folyosóján.','After the Lunar Eclipse event in Moongolow, complete Holy Forbidden.'],
    ['Nyisd meg a Limit Breaket','Unlock Limit Break'],['Győzd le The Endert a Cappella Magnában, és vedd fel a Great Gospelt.','Defeat The Ender in Cappella Magna and collect Great Gospel.'],
    ['Indulhat a komoly titokvadászat','Start hunting secrets'],['A Bone Zone-ban győzd le Sketamarit a Forbidden Scrolls megszerzéséhez.','Defeat Sketamari in The Bone Zone to obtain Forbidden Scrolls of Morbane.'],
    ['Nyisd meg az Inverse módot','Unlock Inverse mode'],['Gyűjtsd össze az alap ereklyéket, majd látogasd meg az Eudaimonia Machine-t.','Collect the standard relics, then visit Eudaimonia Machine.'],
    ['Nyisd meg az Endless módot','Unlock Endless mode'],['Térj vissza az Eudaimonia Machine-be a másik nagy ereklyéért.','Return to Eudaimonia Machine for the other major relic.'],
    ['Bővítsd a fegyvertárat','Expand your arsenal'],['A kódex mestere','Master of the codex'],['A fontos alap haladási célok teljesültek. Jöhetnek a titkok, kihívások és DLC-k!','Your key base-game goals are complete. Explore secrets, challenges and DLC!'],
    ['A túlélő kódexe','The survivor’s codex'],['Négy polc. Minden, amire játék közben szükséged lehet.','Four shelves. Everything you need during a run.'],
    ['A kis képpel jelölt nevekre bökve megnyílik az adatlap. A Vissza gomb pontosan ide hoz vissza.','Tap a name with an icon to open its details. Back returns you to the same place.'],
    ['Bökj a névre a teljes adatlaphoz: feloldás, hatás és kapcsolódó felszerelés.','Tap a name for unlocks, effects and related equipment.'],
    ['Kódex · adatlap','Codex · details'],['Röviden','At a glance'],['Hogyan szerezhető meg?','How do I unlock it?'],['Kezdőfelszerelés','Starting equipment'],
    ['Uniók és különleges receptek','Unions & special recipes'],['Ezzel indulnak','Starting characters'],['Lelőhelyek a kódexben','Where to find it'],['Kapcsolódó Arcanák','Related Arcanas'],
    ['Kapcsolódó felszerelés','Related equipment'],['A pályán','On this stage'],['Földi tárgyak','Ground items'],['Földi tárgyak:','Ground items:'],
    ['Ereklyék','Relics'],['Ereklyék:','Relics:'],['Ereklye','Relic'],['Ereklye:','Relic:'],['Koporsó','Coffin'],['Koporsó:','Coffin:'],['Tipp','Tip'],['Tipp:','Tip:'],
    ['Feloldás:','Unlock:'],['Elérhetővé tétel / hely:','Unlock / location:'],['Eredeti pályarajz','Original stage tilemap'],['A terep ismétlődő része; nem teljes tárgytérkép.','A repeating part of the terrain, not a complete item map.'],
    ['Mire használhatod?','What is it useful for?'],['Eredeti wiki és részletes statok ↗','Original wiki & detailed stats ↗'],
    ['A kódex jelenlegi adatain alapul. A részletes statok, szintenkénti értékek és verzióeltérések a wikiben ellenőrizhetők.','Based on this codex’s current dataset. Check the wiki for detailed stats, level-by-level values and version differences.'],
    ['A részletes feltételt a kapcsolódó wikioldalon találod.','See the linked wiki page for the detailed requirement.'],
    ['Spoiler · megoldás felfedése','Spoiler · reveal solution'],['A megoldás spoileres. Csak akkor fedd fel alább, ha segítséget szeretnél.','The solution contains spoilers. Reveal it below only if you want help.'],
    ['Keresés az adatlapról','Search from this entry'],['Keress a teljes kódexben','Search the entire codex'],['Garlic, Poe, gyógyítás…','Garlic, Poe, healing…'],['Keresési javaslatok','Search suggestions'],
    ['Kezdj el gépelni, vagy válassz egy népszerű témát.','Start typing or choose a popular topic.'],['Népszerű témák · a teljes kódexben keresünk','Popular topics · search across the entire codex'],
    ['Nincs találat. Próbálj rövidebb nevet vagy másik kifejezést.','No results. Try a shorter name or a different term.'],
    ['Karakterek','Characters'],['Karakter','Character'],['Titkos karakter','Secret character'],['Felvehető tárgy','Pickup'],['Evolvált fegyver','Evolved weapon'],
    ['Arcanák','Arcanas'],['Tárgyak és ereklyék','Items & relics'],['Mit csinál, hogyan oldható fel, és melyik recepthez vezet?','What does it do, how do you unlock it, and which recipes use it?'],
    ['Tárgytípus','Item type'],['Tárgykeresés','Search items'],['Név vagy feloldási feltétel…','Name or unlock condition…'],
    ['Pályák','Stages'],['Pálya','Stage'],['Alappálya','Base stage'],['Pályaatlasz','Stage atlas'],['Pályakeresés','Search stages'],['Pálya, ereklye vagy földi tárgy…','Stage, relic or ground item…'],
    ['Az öt alap- és a kódexben szereplő bónuszpályák. A képek az eredeti wiki-fájlokra hivatkoznak.','The five main stages and the bonus stages in this codex. Images link to original wiki files.'],
    ['A Milky Way Map mutatja a játékbeli tárgyhelyeket. Az alábbi pályarajzok a terepet ábrázolják; az ismétlődő pályákon nem teljes világ- vagy tárgytérképek.','Milky Way Map shows item locations in the game. The tilemaps below show terrain, not complete world or item maps for repeating stages.'],
    ['A kép nem tölthető be. Az eredeti a pálya wikioldalán érhető el.','Image unavailable. Find the original on the stage’s wiki page.'],['Eredeti pályarajz megnyitása','Open original tilemap'],['Teljes méret ↗','Full size ↗'],['Pálya és forrás a wikiben ↗','Stage details & source on the wiki ↗'],['Nincs ilyen pálya.','No matching stage.'],
    ['Útmutató','Guide'],['Útmutatók','Guides'],['Útmutatók és következő célok →','Guides & next goals →'],['Merre tovább?','What’s next?'],
    ['Kezdőknek','Getting started'],['Kezdők kézikönyve','Getting started'],['Az első köröd','Your first run'],
    ['Nem kell mindent azonnal feloldanod. Kezdj egy fegyverrel, és tanulj minden körből.','You do not need to unlock everything at once. Start with one weapon and learn from every run.'],
    ['Megnyitom a körsegédet','Open run planner'],['Kapcsolódó útmutató →','Related guide →'],['Hogyan tervezz egy jó kört?','How to plan a good run'],
    ['Egy cél, néhány összeillő fegyver, hely a fontos tárgyaknak.','One goal, a few compatible weapons, and room for the items that matter.'],
    ['Hogyan győzd le a Red Deatht?','How to defeat Red Death'],['Red Death legyőzése','Defeat Red Death'],['Titokvadász napló','Secret hunter’s journal'],
    ['Titkok','Secrets'],['Megoldás felfedése','Reveal solution'],['Mutasd a részleteket','Show details'],['Pályánkénti kincsek','Stage treasures'],['Fix passzív tárgyak, ereklyék és koporsók egy helyen.','Fixed passive items, relics and coffins in one place.'],
    ['Fontos ereklyék','Key relics'],['Mechanikák','Mechanics'],['Mechanika','Mechanic'],['DLC-k','DLC'],['DLC-atlasz','DLC atlas'],['Jellegzetes receptek:','Featured recipes:'],
    ['A DLC oldala a wikiben ↗','DLC on the wiki ↗'],['Nincs kiválasztott DLC.','No DLC selected.'],
    ['Elsőre minden kiegészítőt megmutatunk, de egyiket sem jelöljük sajátodnak. Válassz a meglévő DLC-idből a szűréshez.','Initially all expansions are shown, with none marked as owned. Select your expansions to filter the list.'],
    ['Készen állsz a következő titokra?','Ready for the next secret?'],['Ez a rész későbbi célokat, rejtett feloldásokat vagy a végjáték stratégiáját mutatja meg.','This section reveals later goals, hidden unlocks or an endgame strategy.'],
    ['Megnézem ezt a részt','Reveal this section'],['Inkább az alapok','Show me the basics'],
    ['Az első körödtől a következő evolúcióig.','From your first run to your next evolution.'],
    ['Válassz egy fegyvert a keresőben, vagy állítsd össze az aktuális köröd. A feloldásokat te jelölöd; a játék mentéséhez nem kapcsolódunk.','Search for a weapon or build your current loadout. You track unlocks manually; we do not connect to your game save.'],
    ['Értem, játsszunk','Got it. Let’s play.'],
    ['① Fejleszd','① Upgrade'],['maximumra az alapfegyvert','your base weapon to MAX'],['② Vedd fel','② Collect'],['a hozzá tartozó passzív tárgyat','the required passive item'],['③ Nyisd ki','③ Open'],['az evolúcióra képes ládát','an eligible evolution chest'],['Aranyszabály:','Rule of thumb:'],
    ['Kezdettől elérhető.','Available from the start.'],['Érd el a 20. szintet a Mad Forestben.','Reach level 20 in Mad Forest.'],['Érd el a 40. szintet az Inlaid Libraryben.','Reach level 40 in Inlaid Library.'],['Érd el a 60. szintet a Dairy Plantben.','Reach level 60 in Dairy Plant.'],['Érd el a 80. szintet a Gallo Towerben.','Reach level 80 in Gallo Tower.'],
    ['Kezdettől elérhető; Antonio ezzel indul.','Available from the start. Antonio starts with it.'],['Kezdettől elérhető; Imelda ezzel indul.','Available from the start. Imelda starts with it.'],
    ['Kezdettől elérhető; Gennaro ezzel indul.','Available from the start. Gennaro starts with it.'],['Kezdettől elérhető; Lama ezzel indul.','Available from the start. Lama starts with it.'],
    ['Kezdettől elérhető; Dommario ezzel indul.','Available from the start. Dommario starts with it.'],['Kezdettől elérhető; Suor Clerici ezzel indul.','Available from the start. Suor Clerici starts with it.'],
    ['Kezdettől elérhető; Divano ezzel indul.','Available from the start. Divano starts with it.'],['Vegyél fel egy Rosaryt; Krochi ezzel indul.','Collect a Rosary. Krochi starts with this weapon.'],
    ['Törj össze összesen 20 fényforrást; Arca ezzel indul.','Destroy 20 light sources in total. Arca starts with this weapon.'],['Vegyél fel összesen 5 Floor Chickent; Poe ezzel indul.','Collect 5 Floor Chickens in total. Poe starts with this weapon.'],
    ['Élj túl 5 percet Pasqualinával; ő ezzel indul.','Survive 5 minutes with Pasqualina, who starts with this weapon.'],['Győzz le összesen 5000 ellenfelet; Porta ezzel indul.','Defeat 5,000 enemies in total. Porta starts with this weapon.'],
    ['Élj túl 20 percet bármelyik karakterrel; Christine ezzel indul.','Survive 20 minutes with any character. Christine starts with this weapon.'],['Élj túl 15 percet Giovannával; ő ezzel indul.','Survive 15 minutes with Giovanna, who starts with this weapon.'],
    ['Élj túl 15 percet Poppeával; ő ezzel indul.','Survive 15 minutes with Poppea, who starts with this weapon.'],['Élj túl 15 percet Concettával; ő ezzel indul.','Survive 15 minutes with Concetta, who starts with this weapon.'],
    ['Vegyél fel egy Orologiont; Iguana Gallo ezzel indul.','Collect an Orologion. Iguana Gallo starts with this weapon.'],['Élj túl 30 percet Divanóval vagy Gallóval; Gyorunton ezzel indul.','Survive 30 minutes with Divano or Gallo. Gyorunton starts with this weapon.'],
    ['Evolváld a Braceletet Bi-Braceletté.','Evolve Bracelet into Bi-Bracelet.'],['Oldd fel Avatar Infernast; ezután bekerül a szintlépési kínálatba.','Unlock Avatar Infernas to add it to the level-up pool.'],
    ['Győzz le összesen 161 616 denevért vagy Pipeestrellót.','Defeat 161,616 bats or Pipeestrellos in total.'],['Győzz le összesen 251 096 lövő ellenfelet.','Defeat 251,096 shooting enemies in total.'],['Győzz le egy Bat Dragont.','Defeat a Bat Dragon.'],
    ['Szerezd meg, majd fejleszd a 7. szintre.','Obtain it and upgrade it to level 7.'],['Fejleszd a 7. szintre.','Upgrade it to level 7.'],['Találd meg Westwoodsban, majd fejleszd a 7. szintre.','Find it in Westwoods and upgrade it to level 7.'],
    ['Szerezd meg a Space 54 pályán, majd fejleszd a 7. szintre.','Obtain it in Space 54 and upgrade it to level 7.'],['A Secrets menüben írd be a „guinigigi” varázsigét.','Enter the spell “guinigigi” in the Secrets menu.'],
    ['Élj túl 10 percet bármelyik karakterrel.','Survive 10 minutes with any character.'],['Fejleszd a Peachone-t a 7. szintre.','Upgrade Peachone to level 7.'],['Élj túl 10 percet Pugnalával.','Survive 10 minutes with Pugnala.'],['Élj túl 15 percet Pugnalával.','Survive 15 minutes with Pugnala.'],
    ["Élj túl 15 percet Zi'Assuntával.","Survive 15 minutes with Zi'Assunta."],['Evolváld a maximális Whipet a Hollow Heart segítségével.','Evolve a MAX-level Whip while holding Hollow Heart.'],['Ölj meg 100 000 ellenfelet egyetlen futamban Queen Sigmával.','Defeat 100,000 enemies in one run with Queen Sigma.'],['Fedezd fel az összes standard evolúciót és uniót.','Discover all standard evolutions and unions.'],
    ['Élj túl 1 percet bármelyik karakterrel.','Survive 1 minute with any character.'],['Legyen egyszerre 6 különböző fegyvered.','Hold 6 different weapons at once.'],['Fejleszd a King Bible-t a 4. szintre.','Upgrade King Bible to level 4.'],['Fejleszd a Santa Watert a 4. szintre.','Upgrade Santa Water to level 4.'],
    ['Vegyél fel egy Little Clovert egy fényforrásból.','Collect a Little Clover dropped by a light source.'],['Fejleszd a Runetracert a 7. szintre.','Upgrade Runetracer to level 7.'],['Élj túl 5 percet Gennaróval.','Survive 5 minutes with Gennaro.'],['Vegyél fel egy Vacuumot egy fényforrásból.','Collect a Vacuum dropped by a light source.'],
    ['Fejleszd a Magic Wandot a 7. szintre.','Upgrade Magic Wand to level 7.'],['Érd el a 10. szintet bármelyik karakterrel.','Reach level 10 with any character.'],['Találd meg és vedd fel pályatárgyként az Inlaid Libraryben.','Find and collect it as a ground item in Inlaid Library.'],['Élj túl 30 percet Lamával.','Survive 30 minutes with Lama.'],['Érd el az 5. szintet bármelyik karakterrel.','Reach level 5 with any character.'],
    ['Szerezd meg a Yellow Signt; ezután pályatárgyként jelenik meg.','Obtain Yellow Sign; it will then appear as a ground item.'],
    ['Növeli a maximális életerőt.','Increases maximum health.'],['Csökkenti a fegyverek újratöltési idejét (Cooldown).','Reduces weapon cooldown.'],['Növeli a lövedékek sebességét (Speed).','Increases projectile speed.'],['Növeli a fegyverek hatóterületét (Area).','Increases weapon area.'],
    ['Növeli a szerencsét (Luck).','Increases Luck.'],['Növeli a fegyverhatások időtartamát (Duration).','Increases weapon effect duration.'],['Növeli a sebzést (Might).','Increases damage (Might).'],['Folyamatos életerő-regenerációt ad (Recovery).','Provides continuous health regeneration (Recovery).'],
    ['Növeli a felszedési távolságot (Magnet).','Increases pickup range (Magnet).'],['Csökkenti a beérkező sebzést.','Reduces incoming damage.'],['Növeli a lövedékek számát (Amount), ha a fegyver támogatja.','Increases projectile count (Amount) for compatible weapons.'],['Növeli a kapott tapasztalati pontokat (Growth).','Increases experience gained (Growth).'],
    ['Növeli a megszerzett arany értékét (Greed).','Increases gold gained (Greed).'],['Növeli a Curse értékét: több, erősebb és gyorsabb ellenfelet hoz.','Increases Curse: more, tougher and faster enemies.'],['Növeli a mozgási sebességet.','Increases movement speed.'],['További feltámadásokat ad.','Adds revivals.'],
    ['Életerőt tölt vissza.','Restores health.'],['Elpusztítja a legtöbb képernyőn lévő ellenfelet.','Destroys most enemies on screen.'],['Ideiglenesen megfagyasztja az ellenfeleket.','Temporarily freezes enemies.'],['Magadhoz vonzza a pályán hagyott XP-drágaköveket.','Attracts experience gems left on the stage.'],['Az adott körre növeli a szerencsét.','Increases Luck for the current run.']
  ];
  entries.push(
    ['Fejlesztések','Upgrades'],['Gyűjtemény','Collection'],['Világ','World'],['Evolúciók, uniók és receptszabályok','Evolutions, unions & recipe rules'],
    ['Fegyverek, tárgyak, karakterek és Arcanák','Weapons, items, characters & Arcanas'],['Pályaatlasz és kiegészítők','Stage atlas & expansions'],['Az első körtől a Halál legyőzéséig','From your first run to defeating Death'],
    ['Evolúciós alapszabályok','Evolution basics'],['Fegyverek, passzívak és ereklyék','Weapons, passives & relics'],['Játékmechanikák','Game mechanics'],
    ['Vízszintes csapásokkal támad, az ellenfeleken és falakon is áthatol.','Attacks horizontally, passing through enemies and walls.'],
    ['A legközelebbi ellenfelet célozza. Jól használható a túl közel kerülő ellenfelek ellen.','Targets the nearest enemy. Useful for keeping nearby enemies away.'],
    ['A mozgásod irányába dob késeket; irányított utat nyithatsz vele a tömegben.','Throws knives in your movement direction, helping you cut a path through crowds.'],
    ['Ívben felfelé hajít baltákat. A Candelabrador a támadási területét is növeli.','Throws axes upward in an arc. Candelabrador increases their area.'],
    ['Bumerángként visszatérő lövedékeket indít a közeli ellenfelek felé.','Launches returning boomerang-like projectiles at nearby enemies.'],
    ['Könyvek keringenek körülötted, és sebzik az érintett ellenfeleket.','Books orbit you and damage enemies they touch.'],
    ['Nagy sebzésű tűzgolyókat lő véletlenszerű ellenfelekre.','Fires high-damage fireballs at random enemies.'],
    ['Közeli sebző aurát ad. A korai gyenge ellenfelek ellen különösen kényelmes.','Deals damage in a nearby aura. Especially comfortable against weak early enemies.'],
    ['Sebző tócsákat hagy a talajon. A tartam és a terület növelése segíti a lefedettségét.','Leaves damaging pools on the ground. Duration and Area improve coverage.'],
    ['Színes, áthatoló lövedékei visszapattannak a képernyő széléről és az akadályokról.','Piercing projectiles bounce off screen edges and obstacles.'],
    ['Véletlenszerű ellenfelekre villámokat idéz.','Calls down lightning on random enemies.'],
    ['Egy játék közben használt kis segédletből nőtt ki. Evolúciós receptek, körtervezés és következő célok, egy helyen.','It grew from a small guide used during play. Evolution recipes, run planning and next goals in one place.'],
    ['Ingyenes béta. Nem hivatalos Vampire Survivors segédlet; nem áll kapcsolatban a poncle csapatával, és nem kapott hivatalos jóváhagyást.','Free beta. An unofficial Vampire Survivors companion, not affiliated with or endorsed by poncle.'],
    ['Nyelv és spoilerek','Language & spoilers'],
    ['A magyar változat tartalmazza a teljes jelenlegi útmutatót. Az angol felület előzetes: a még le nem fordított leírások magyarul maradnak. A játékbeli nevek mindkét nyelven változatlanok.','Hungarian contains the full current guide. English is a preview: untranslated descriptions remain in Hungarian. In-game names stay unchanged in both languages.'],
    ['Megerősítést kérek a későbbi célok és titkok előtt.','Ask before showing late-game goals and secrets.'],
    ['A titkos megoldások külön lenyithatók. A keresőben nevek és receptek megjelenhetnek, de titkos megoldásokra nem keresünk.','Secret solutions have separate reveal controls. Names and recipes can appear in search, but secret solutions are not indexed.'],
    ['Mentések és adatvédelem','Saves & privacy'],
    ['A profil, az aktuális kör és a beállítások ezen a böngészőn maradnak. Nincs fiók, saját analitika vagy felhős szinkron. Az oldal nem olvassa a játék mentését: a feloldásokat te jelölöd.','Your profile, current run and settings stay in this browser. No account, first-party analytics or cloud sync. This site does not read your game save: you mark your unlocks.'],
    ['A böngészőadatok törlése elveszítheti a mentést. Másik telefon vagy webcím nem veszi át automatikusan. A Haladásom menü ⋯ gombjánál a feloldási profil exportálható és visszaállítható; ez nem tartalmazza az aktuális kört.','Clearing browser data can erase your progress. Another phone or web address does not inherit it automatically. Use ⋯ in My progress to export or import your unlock profile; this does not include your current run.'],
    ['A tárgy- és pályaképek a wikiről töltődnek be, így a képszolgáltató hálózati adatokat, például IP-címet kap. A tárhelyet GitHub Pages biztosítja. A külső linkekre ezeknek a szolgáltatóknak a szabályai vonatkoznak.','Item and stage images load from the wiki, so its image service receives network information such as your IP address. Hosting is provided by GitHub Pages. External services have their own policies.'],
    ['GitHub adatvédelem ↗','GitHub privacy ↗'],['Wiki adatvédelem ↗','Wiki privacy ↗'],['Források és jogok','Sources & rights'],
    ['A játékadatok és játékbeli képek forrása a','Game data and in-game artwork are sourced from the'],
    ['. Az adatlapok az adott forráshoz vezetnek. A wiki alapján átdolgozott szövegekre a vonatkozó','. Entry pages link to their sources. Text adapted from the wiki is subject to the applicable'],['feltételeit kell figyelembe venni.','terms.'],
    ['A képek nem automatikusan a wiki szöveglicence alá tartoznak. Egyedi felhasználási jogaik ellenőrzése folyamatban; ez az oldal nem ad engedélyt újrafelhasználásukra. A játék és a DLC-k megjelölései, grafikái a jogosultjaikhoz tartoznak.','Images do not automatically share the wiki text licence. Individual usage rights are still under review; this site does not grant permission to reuse them. Game and DLC marks and artwork belong to their respective rightsholders.'],
    ['A könyves márkajelzés saját, geometrikus rajz. A Pixelify Sans és Grenze Gotisch betűtípusok beágyazottak; a licencük a forrásban szerepel. Nincs adománygyűjtés vagy fizetős tartalom.','The book identity is an original geometric drawing. Pixelify Sans and Grenze Gotisch fonts are embedded with licence notices in the source. There are no donations or paid features.'],
    ['Frissesség és visszajelzés','Freshness & feedback'],
    ['Felületfrissítés: 2026-10-28. A játékadatok korábbi összeállításból származnak, most nem történt teljes, aktuális verzió szerinti ellenőrzés. Eltérésnél nézd meg a játék Unlocks menüjét és a kapcsolódó wikioldalt.','Interface updated: 2026-10-28. Game data comes from the earlier compilation and has not had a complete current-version audit in this update. Check the game’s Unlocks menu and the linked wiki page if something differs.'],
    ['Hibánál írd le az eszközt, a játék verzióját és a hibás tárgy vagy recept nevét. Ne küldj személyes adatot vagy teljes mentést.','When reporting a bug, include your device, game version and affected item or recipe. Do not send personal data or a full save file.'],
    ['A visszajelzés GitHubon nyílik meg, fiókot igényel és nyilvános lesz. A küldést te erősíted meg.','Feedback opens on GitHub, requires an account and will be public. You confirm submission yourself.']
  );
  const exact = new Map(entries);
  const beginner = [
    ['Mozogj, a fegyver támad helyetted','Move; your weapons attack for you'],
    ['Kerüld a bekerítést, keress szabad utat. A fegyverek automatikusan támadnak; a mozgásod és a választásaid döntik el a kört.','Avoid being surrounded and keep an escape route. Weapons attack automatically; your movement and choices decide the run.'],
    ['Gyűjts XP-t, erősíts egy tervet','Collect XP and commit to a plan'],
    ['A legyőzött ellenfelek drágakövei szintlépést adnak. Szintlépéskor új fegyvert, passzív tárgyat vagy egy meglévő fejlesztését választhatod.','Gems dropped by enemies give experience. On level-up, choose a new weapon, a passive or an upgrade to something you already have.'],
    ['Figyeld a hat-hat helyet','Watch your six weapon and passive slots'],
    ['Általában hat fegyver és hat passzív fér a szintlépési felszerelésedbe. A passzívak például a sebzést vagy újratöltést módosítják. A pályáról felvett tárgyak túlléphetik a normál passzív korlátot.','You normally have six weapon slots and six passive slots for level-up items. Passives modify stats such as damage or cooldown. Ground items can take you beyond the normal passive limit.'],
    ['Készíts egy evolúciót','Make an evolution'],
    ['Legyen MAX szintű az alapfegyver, és legyen nálad a recept tárgya. Néhány recept a passzív MAX szintjét is kéri. Ezután megfelelő főellenfél-láda kell; sok pályán a 10. perc előtt megjelenő láda még nem alkalmas.','Upgrade the base weapon to MAX and hold the required passive. Some recipes also require MAX-level passives. Then open an eligible boss chest; on many stages, chests spawned before minute 10 cannot evolve weapons.'],
    ['A vereség is előrelépés','Even a defeat moves you forward'],
    ['A kör felszerelése újrakezdődik, a megszerzett arany és feloldások megmaradnak. A főmenü PowerUp részében tartós erősítéseket vásárolhatsz. Az Unlocks menü konkrét célokat ad.','Your run equipment resets, but gold and unlocks remain. Buy permanent upgrades in the main menu’s PowerUp section. The Unlocks menu gives you specific goals.'],
    ['A 30. perc nem minden történet vége','Minute 30 is not the end of every story'],
    ['A legtöbb normál kör végén megjelenik a Reaper. Eleinte teljesen rendben van itt elveszíteni a kört. Legyőzése későbbi ereklyékre és különleges felszerelésre épül.','The Reaper appears at the end of most normal runs. Losing here is normal at first. Defeating it later depends on relics and special equipment.'],
    ['Egy egyszerű első terv:','A simple first plan:'],
    ['Antonio + Whip → Hollow Heart → Bloody Tear. Előbb erősítsd a Whipet, mint hogy hat gyenge fegyvert gyűjtenél. A Hollow Heart feloldásához élj túl 1 percet bármelyik karakterrel.','Antonio + Whip → Hollow Heart → Bloody Tear. Strengthen Whip before collecting six weak weapons. Survive 1 minute with any character to unlock Hollow Heart.'],
    ['Összetevők elérhetővé tétele:','Unlock the ingredients:'],['Unió feltétele:','Union requirement:'],['Ajándék','Gift'],['Ajándék feltétele:','Gift requirement:'],['Átalakulás','Morph'],['Átalakulás feltétele:','Morph requirement:'],
    ['Fejleszd maximumra mindkét madarat. Az Ebony Wings akkor oldódik fel, amikor a Peachone eléri a 7. szintet.','Upgrade both birds to MAX. Ebony Wings unlocks when Peachone reaches level 7.'],
    ['Fejleszd maximumra mindkét pisztolyt, és legyen nálad a Tirajisú. Pugnala mindkettővel indul, miután kinyitottad a koporsóját a Mad Forestben.','Upgrade both guns to MAX and hold Tirajisú. Pugnala starts with both guns after you open her coffin in Mad Forest.'],
    ['Fejleszd maximumra a Vento Sacrót, a Whipből pedig előbb készíts Bloody Teart. Zi’Assunta a Vento Sacróval indul.','Upgrade Vento Sacro to MAX and first evolve Whip into Bloody Tear. Zi’Assunta starts with Vento Sacro.'],
    ['A Collection teljesítésével oldd fel Queen Sigmát. A Victory Sword az ajándék megszerzése után is megmarad.','Unlock Queen Sigma by completing the required Collection. Victory Sword remains after you receive the gift.'],
    ['Egy evolúciós ládából jelenhet meg, ha már van Candyboxod és teljesen kiépítetted a felszerelésedet.','May appear in an evolution chest if you already have Candybox and a fully upgraded loadout.'],
    ['Találd meg a Chaos Malachite-ot Bat Countryban. Nem kell hozzá láda.','Find Chaos Malachite in Bat Country. No chest is required.'],
    ['Találd meg a Chaos Rosaliát az Astral Stair pályán. Nem kell hozzá láda.','Find Chaos Rosalia in Astral Stair. No chest is required.'],
    ['Találd meg a Chaos Lazuliát a Space 54 pályán. Nem kell hozzá láda.','Find Chaos Lazulia in Space 54. No chest is required.'],
    ['Találd meg a Chaos Altemannát a Tiny Bridge pályán. Nem kell hozzá láda.','Find Chaos Altemanna in Tiny Bridge. No chest is required.'],
    ['Arcana-kódex','Arcana codex'],['A 22 alap Arcana hatása, feloldása és ideális szerepe.','Effects, unlocks and uses for the 22 base Arcanas.'],
    ['Hogyan működik?','How does it work?'],['Például: gyógyítás, kritikus vagy Gold Fever…','Try an Arcana name or Gold Fever…'],
    ['Karakterkódex','Character codex'],['Az alapjáték 34 normál karaktere. A titkos szereplők a Titkok fülön vannak.','34 regular base-game characters. Secret characters are in the Secrets section.'],
    ['Keress karakterre, kezdőfegyverre vagy feloldásra…','Search by character, starting weapon or unlock…'],['A játék fontos, de könnyen elnézhető szabályai röviden.','Important and easily missed game rules, in brief.'],
    ['Sebzés','Damage'],['sebzés','damage'],['Túlélés','Survival'],['túlélés','survival'],['Kontroll','Control'],['kontroll','control'],['Fejlődés','Growth'],['fejlődés','growth'],['Hasznosság','Utility'],['hasznosság','utility'],['különleges','special'],['alapjáték','base game'],['Képesség:','Ability:'],
    ['Nincs ilyen Arcana.','No matching Arcana.'],['Nincs ilyen karakter.','No matching character.'],['Bővebben a wikiben ↗','Read more on the wiki ↗'],['Karakterlap a wikiben ↗','Character on the wiki ↗']
  ];
  for(const [hu,en] of beginner){entries.push([hu,en]);exact.set(hu,en);}
  const phrases = entries.filter(([key])=>key.length>28).sort((a,b)=>b[0].length-a[0].length);
  function translate(value) {
    if(window.pgLanguage!=='en'||!value)return value;
    const text=String(value),trim=text.trim();
    if(exact.has(trim))return text.replace(trim,exact.get(trim));
    let result=text;
    for(const [hu,en] of phrases)if(result.includes(hu))result=result.split(hu).join(en);
    const rules=[
      [/^Találatok: (\d+)(.*)$/,'Results: $1$2'],[/ · Az első 30 látható, pontosíts a keresésen\./,' · Showing the first 30. Refine your search.'],
      [/^(\d+) fegyver · (\d+) passzív/,'$1 weapons · $2 passives'],[/^(\d+\/\d+) kész$/,'$1 complete'],[/^(\d+\/\d+) felfedezve$/,'$1 discovered'],
      [/^Hozzáadás: /,'Add: '],[/^Áthelyezés ide: /,'Move here: '],[/ leírása$/,' details'],[/^Feloldás jelölése: /,'Mark unlocked: '],[/^Felszerelés cseréje: /,'Swap equipment: '],
      [/^Fejleszd MAX-ra: /,'Upgrade to MAX: '],[/^Keresd: /,'Look for: '],[/: összetevők készen$/,': ingredients ready'],
      [/^Még hiányzik: /,'Still missing: '],
      [/^Fegyver (\d+)$/,'Weapon $1'],[/^Passzív (\d+)$/,'Passive $1'],[/ eltávolítása$/,' remove'],
      [/Fejleszd maximumra ezt a fegyvert: /g,'Upgrade this weapon to MAX: '],
      [/\. Legyen nálad ez a fejlesztő tárgy: /g,'. Hold this passive item: '],
      [/\. Ezután nyiss ki egy evolúcióra képes ládát; külön passzív tárgy nem kell\./g,'. Then open an eligible evolution chest; no passive is required.'],
      [/\. Ezután nyiss ki egy evolúcióra képes ládát\./g,'. Then open an eligible evolution chest.'],
      [/ A MAX-szal jelölt tárgyakat is fejleszd maximumra\./g,' Items marked MAX must also be fully upgraded.']
    ];
    for(const [pattern,replacement] of rules)result=result.replace(pattern,replacement);
    return result;
  }
  window.pgT=translate;
  window.pgTranslateTree=function(root) {
    if(window.pgLanguage!=='en'||!root)return;
    const excluded='script,style,code,pre,svg,textarea,[data-no-translate]';
    const nodes=[];
    if(root.nodeType===3)nodes.push(root);
    else {const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);while(walker.nextNode())nodes.push(walker.currentNode);}
    for(const node of nodes){if(!node.parentElement||node.parentElement.closest(excluded))continue;const value=translate(node.nodeValue);if(value!==node.nodeValue)node.nodeValue=value;}
    const elements=root.nodeType===1?[root,...root.querySelectorAll('[placeholder],[aria-label],[title]')]:[];
    for(const element of elements){if(element.closest(excluded))continue;for(const attribute of ['placeholder','aria-label','title']){const old=element.getAttribute(attribute);if(old){const value=translate(old);if(old!==value)element.setAttribute(attribute,value);}}}
  };
  window.pgObserveTranslations=function(){
    if(window.pgLanguage!=='en')return;
    const observer=new MutationObserver(records=>{
      observer.disconnect();
      const roots=new Set();
      for(const record of records){if(record.type==='childList')for(const node of record.addedNodes)roots.add(node);else roots.add(record.target);}
      for(const root of roots)if(root.isConnected)window.pgTranslateTree(root);
      observer.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['placeholder','aria-label','title']});
    });
    observer.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['placeholder','aria-label','title']});
  };
})();
