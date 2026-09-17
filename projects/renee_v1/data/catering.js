/* ============================================================
   Renée — meniul de CATERING (fourchette pentru evenimente).
   Sursă: PDF-ul „Renée_Catering" primit de la client, 17 sept. 2026.
   Nu există în API-ul eat-me.online — se introduce MANUAL.

   REAL, din PDF: numele, prețurile (MDL) și imaginile preparatelor.
   Imaginile sunt extrase din PDF (img/catering/, ~367px) — suficiente
   pentru carduri, dar de cerut clientului originalele pentru WP.

   DRAFT, de validat:
   - `alergeni` — DEDUȘI din nume, nu declarați. NU sunt declarație oficială.
   - prețurile la BĂUTURI — PDF-ul nu le are; sunt inventate (cerut de Sergiu).
   - `shortDesc` e gol peste tot — PDF-ul nu are descrieri. Nu le inventăm.
   - două plăcinte (varză / carne de pui) au imaginile atribuite prin
     comparare pixel cu pixel cu PDF-ul, cu diferență mică. De verificat vizual.

   Aceleași câmpuri ca data/products.js, plus `unitate` ('buc' | 'kg').
   WP: → CPT separat `catering` + taxonomie `catering_cat`. Vezi CLAUDE.md §4.
   ============================================================ */
window.CATERING_CATEGORIES = [
  { id:"candy-bar",   name:"Candy Bar",        description:"Mini-deserturi de o îmbucătură, pentru masa dulce." },
  { id:"finger-food", name:"Finger Food",      description:"Gustări sărate, servite în porții individuale." },
  { id:"placinte",    name:"Plăcintă Cosiță",  description:"Plăcinte împletite, la kilogram." },
  { id:"bauturi",     name:"Băuturi",          description:"Răcoritoare, cafea și ceai pentru eveniment.", layout:"list" },
];

/* helper intern — ține fișierul citibil */
(function(){
  var IMG = "img/catering/";
  function it(cat, id, name, price, unit, alerg, extra){
    var o = {
      id:id, name:name, category:cat,
      price:price, onSale:false, salePrice:null,
      images:[IMG + id + ".webp"],
      shortDesc:"", description:"",
      gramaj:null, unitate:unit || "buc",
      alergeni:alerg || "", badgesFixe:[],
      nutritie:null, stock:"instock", featured:false
    };
    if (extra) for (var k in extra) o[k] = extra[k];
    return o;
  }
  var C = "candy-bar", F = "finger-food", P = "placinte", B = "bauturi";

  window.CATERING_PRODUCTS = [
    /* ---------- Candy Bar (PDF p. 1–2) ---------- */
    it(C,"pan-de-ciocolata-mini","Pan de ciocolată mini",20,"buc","gluten, lactate, ouă"),
    it(C,"croissant-classic-mini","Croissant Classic mini",15,"buc","gluten, lactate, ouă"),
    it(C,"eskimo-personalizat","Eskimo personalizat",34,"buc","lactate"),
    it(C,"choux-fistic","Choux cu cremă de fistic",32,"buc","gluten, lactate, ouă, fructe cu coajă"),
    it(C,"choux-vanilie-capsuna","Choux cu cremă de vanilie și căpșună",32,"buc","gluten, lactate, ouă"),
    it(C,"choux-ciocolata-caramela","Choux cu cremă de ciocolată și caramelă",32,"buc","gluten, lactate, ouă"),
    it(C,"mini-mousse-zmeura","Mini mousse Zmeură",34,"buc","gluten, lactate, ouă"),
    it(C,"mini-mousse-tropic","Mini mousse Tropic",34,"buc","gluten, lactate, ouă"),
    it(C,"tiramisu","Tiramisu",32,"buc","gluten, lactate, ouă"),
    it(C,"cheesecake-capsuna","Cheesecake căpșună",32,"buc","gluten, lactate, ouă"),
    it(C,"cheesecake-mango-maracuja","Cheesecake mango-maracuja",32,"buc","gluten, lactate, ouă"),
    it(C,"mousse-fistic-zmeura","Mousse Fistic și Zmeură",32,"buc","lactate, fructe cu coajă"),
    it(C,"panna-cotta","Panna Cotta",32,"buc","lactate"),
    it(C,"ecler-mini-caramela-sarata","Ecler mini caramelă sărată",23,"buc","gluten, lactate, ouă"),
    it(C,"ecler-mini-crema-de-lapte","Ecler mini cremă de lapte",23,"buc","gluten, lactate, ouă"),
    it(C,"ecler-mini-crema-de-ciocolata","Ecler mini cremă de ciocolată",23,"buc","gluten, lactate, ouă"),
    it(C,"macaron-plombir-capsuna","Macaron Plombir Căpșună",28,"buc","ouă, lactate, fructe cu coajă"),
    it(C,"macaron-fistic","Macaron Fistic",28,"buc","ouă, lactate, fructe cu coajă"),
    it(C,"macaron-mango-maracuja","Macaron Mango Maracuja",28,"buc","ouă, lactate, fructe cu coajă"),
    it(C,"macaron-para-dorblu","Macaron Pară-Dorblu",28,"buc","ouă, lactate, fructe cu coajă"),
    it(C,"macaron-cocos","Macaron Cocos",28,"buc","ouă, lactate, fructe cu coajă"),
    it(C,"macaron-coacaza","Macaron Coacăză",28,"buc","ouă, lactate, fructe cu coajă"),
    it(C,"macaron-choconut","Macaron Choconut",28,"buc","ouă, lactate, fructe cu coajă"),

    /* ---------- Finger Food Bar (PDF p. 3–5) ---------- */
    it(F,"rulada-de-iepure-cu-ciuperci","Ruladă de iepure cu ciuperci",65,"buc",""),
    it(F,"rulada-de-curcan-cu-sos-de-spanac","Ruladă de curcan cu sos de spanac",60,"buc","lactate"),
    it(F,"rulada-de-spanac-cu-somon","Ruladă de spanac cu somon și cremă de brânză",20,"buc","pește, lactate, ouă"),
    it(F,"somon-copt-cu-sos-de-spanac","Somon copt cu sos de spanac",65,"buc","pește, lactate"),
    it(F,"salata-coleslaw","Salată coleslaw",55,"buc","ouă"),
    it(F,"somon-copt-si-mango-picant","Somon copt și mango picant",65,"buc","pește"),
    it(F,"burger-pulled-pork","Burger pulled pork",90,"buc","gluten, susan"),
    it(F,"ecler-cu-salsa-de-avocado","Ecler cu salsa de avocado",30,"buc","gluten, ouă, lactate"),
    it(F,"cartofi-gratinati-cu-bacon-si-parmezan","Cartofi gratinați cu bacon și parmezan",55,"buc","lactate"),
    it(F,"salata-cu-legume-si-mousse-de-feta","Salată cu legume și mousse de feta",45,"buc","lactate"),
    it(F,"salata-cu-curcan","Salată cu curcan",50,"buc",""),
    it(F,"file-de-dorada-cu-legume","File de doradă cu legume",65,"buc","pește"),
    it(F,"somon-copt-cu-legume-1kg","Somon copt cu legume",380,"kg","pește"),
    it(F,"ecler-cu-crema-de-cartofi-dulci","Ecler cu cremă de cartofi dulci",35,"buc","gluten, ouă, lactate, fructe cu coajă"),
    it(F,"ecler-cu-crema-de-vinete","Ecler cu cremă de vinete",55,"buc","gluten, ouă, lactate, fructe cu coajă"),
    it(F,"gazpacho-cu-creveti","Gazpacho cu creveți",35,"buc","crustacee"),
    it(F,"biscuiti-cu-pateu","Biscuiți cu pateu",27,"buc","gluten, lactate, fructe cu coajă"),
    it(F,"biscuiti-cu-ceafa-de-porc-si-sos-miso","Biscuiți cu ceafă de porc și sos miso",18,"buc","gluten, soia"),
    it(F,"mini-croissant-cu-roast-beef","Mini croissant cu roast beef și tapenadă de măsline",65,"buc","gluten, lactate, ouă"),
    it(F,"mini-croissant-cu-anghinare","Mini croissant cu anghinare și legume coapte",40,"buc","gluten, lactate, ouă"),
    it(F,"mini-croissant-cu-somon","Mini croissant cu somon",40,"buc","gluten, lactate, ouă, pește"),
    it(F,"burger-cu-ardei-copt-si-cascaval-de-capra","Burger cu ardei copt și cașcaval de capră",50,"buc","gluten, lactate, susan"),
    it(F,"brinzoaice-cu-somon","Brânzoaice cu somon",45,"buc","gluten, lactate, ouă, pește"),
    it(F,"sufleu-de-spanac","Sufleu de spanac",28,"buc","ouă, lactate"),

    /* ---------- Plăcintă Cosiță (PDF p. 6) — toate la kg ---------- */
    it(P,"placinta-cosita-cu-dovleac","Plăcintă Cosiță cu dovleac",160,"kg","gluten"),
    it(P,"placinta-cosita-cu-halva-si-mere","Plăcintă Cosiță cu halva și mere",170,"kg","gluten, susan"),
    it(P,"placinta-cosita-cu-mere","Plăcintă Cosiță cu mere",150,"kg","gluten"),
    it(P,"placinta-cosita-cu-brinza-si-verdeata","Plăcintă Cosiță cu brânză și verdeață",220,"kg","gluten, lactate"),
    it(P,"placinta-cosita-cu-brinza","Plăcintă Cosiță cu brânză",220,"kg","gluten, lactate"),
    it(P,"placinta-cosita-cu-visine","Plăcintă Cosiță cu vișine",280,"kg","gluten"),
    it(P,"placinta-cosita-cu-varza","Plăcintă Cosiță cu varză",150,"kg","gluten"),            /* imagine: de verificat vizual */
    it(P,"placinta-cosita-cu-cartofi","Plăcintă Cosiță cu cartofi",160,"kg","gluten"),
    it(P,"placinta-cosita-cu-carne-de-pui","Plăcintă Cosiță cu carne de pui",220,"kg","gluten"),  /* imagine: de verificat vizual */

    /* ---------- Băuturi (PDF p. 5) — fără imagini individuale.
       DRAFT: PREȚURILE SUNT INVENTATE, PDF-ul nu le conține. ---------- */
    it(B,"izvorul-alb","Izvorul Alb",20,"buc","",{images:[], grup:"Răcoritoare"}),
    it(B,"sprite","Sprite",25,"buc","",{images:[], grup:"Răcoritoare"}),
    it(B,"coca-cola","Coca-Cola",25,"buc","",{images:[], grup:"Răcoritoare"}),
    it(B,"coca-cola-zero","Coca-Cola Zero",25,"buc","",{images:[], grup:"Răcoritoare"}),
    it(B,"dorna","Dorna",22,"buc","",{images:[], grup:"Răcoritoare"}),
    it(B,"fanta","Fanta",25,"buc","",{images:[], grup:"Răcoritoare"}),
    it(B,"cappy","Cappy",28,"buc","",{images:[], grup:"Răcoritoare"}),
    it(B,"americano-catering","Americano",35,"buc","",{images:[], grup:"Cafea & ceai"}),
    it(B,"cacao-catering","Cacao",35,"buc","lactate",{images:[], grup:"Cafea & ceai"}),
    it(B,"cappuccino-catering","Cappuccino",40,"buc","lactate",{images:[], grup:"Cafea & ceai"}),
    it(B,"ceai-catering","Ceai",30,"buc","",{images:[], grup:"Cafea & ceai"}),
    it(B,"espresso-catering","Espresso",30,"buc","",{images:[], grup:"Cafea & ceai"}),
    it(B,"espresso-doppio-catering","Espresso Doppio",40,"buc","",{images:[], grup:"Cafea & ceai"}),
    it(B,"latte-macchiato-catering","Latte Macchiato",45,"buc","lactate",{images:[], grup:"Cafea & ceai"}),
  ];
})();

window.getCateringByCategory = function(catId){
  var all = window.CATERING_PRODUCTS || [];
  if (!catId || catId === 'all') return all.slice();
  return all.filter(function(p){ return p.category === catId; });
};
window.getCateringProduct = function(id){
  var all = window.CATERING_PRODUCTS || [];
  for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i];
  return null;
};
