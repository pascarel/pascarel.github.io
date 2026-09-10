/* ============================================================
   Renée — catalogul de preparate.
   REAL: nume, descriere, preț, gramaj și imagine vin din API-ul
   eat-me.online (storeId 14189). Vezi CLAUDE.md §4.
   Generat 10 sept. 2026 din data/menu-eatme-snapshot.json.

   Doar bucătăria: mic dejun, salate, supe, gustări, fel principal,
   deserturi, pâine. Fără băuturi, fără adaosuri.

   DRAFT, de validat: badge-urile (nou/vegan/recomandat) și alergenii.
   Alergenii sunt DEDUȘI automat din lista de ingrediente din descriere,
   nu preluați din API (câmpul `allergens` e gol pentru toate preparatele).
   NU sunt o declarație oficială — de confirmat cu bucătăria.
   WP: → CPT product + product_cat.
   ============================================================ */
window.RENEE_CATEGORIES = [
  { id:"mic-dejun", name:"Mic dejun", image:"https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/42dae493-586a-4f83-a4b0-115c11a444c0-376x276x100.webp", description:"Servit toată ziua, de la deschidere până la închidere." },
  { id:"salate", name:"Salate", image:"https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/2e52ae6c-72a0-4858-9103-4f8b6e1ba77c-376x276x100.webp", description:"Proaspete, cu ingrediente de sezon." },
  { id:"supe", name:"Supe", image:"https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/3d293a10-ea52-4979-bffb-5c48f0907e19-376x276x100.webp", description:"Gătite zilnic, în porții generoase." },
  { id:"gustari", name:"Gustări", image:"https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/90f4d43b-641c-4229-bb04-45c1047b0847-376x276x100.webp", description:"Mici, pentru început sau de împărțit." },
  { id:"fel-principal", name:"Fel principal", image:"https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/d2aec086-2d21-4eac-8f30-061f98b65d23-376x276x100.webp", description:"Farfurii consistente, gătite la comandă." },
  { id:"deserturi", name:"Deserturi", image:"https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/db9bc422-febc-4e65-a40c-02e03a1dddd2-376x276x100.webp", description:"Patiserie și dulciuri făcute în casă." },
  { id:"paine", name:"Pâine", image:"https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/3a3b0664-a1ea-439a-a929-669acf7fbd0e-376x276x100.webp", description:"Coaptă la noi, în fiecare dimineață." },
];

window.RENEE_PRODUCTS = [
  {
    id:"blinii-din-cartofi-cu-tartar-de-somon", name:"Blinii din cartofi cu tartar de somon", category:"mic-dejun",
    price:180, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/a621e8ae-0245-4af1-bfe6-427615139cc4-752x552x100.webp"],
    shortDesc:"Blinii din cartofi, ouă de găină,somon slab sărat, icre Tobiko, mix de salată",
    description:"Blinii din cartofi, ouă de găină,somon slab sărat, icre Tobiko, mix de salată",
    gramaj:330, alergeni:"ouă, pește", badgesFixe:[],
    nutritie:{kcal:153, proteine:7.7, grasimi:9.5, glucide:9.6},  /* la 100 g, din API */
    stock:'instock', featured:false
  },
  {
    id:"blinii-din-zucchini-cu-creveti", name:"Blinii din zucchini cu creveți", category:"mic-dejun",
    price:190, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/f0b8a0f8-5b28-445b-ace4-1b94cb71a71a-752x552x100.webp"],
    shortDesc:"Blinii fine și aromate din zucchini proaspăt, preparate cu ou, făină și ceapă verde, servite",
    description:"Blinii fine și aromate din zucchini proaspăt, preparate cu ou, făină și ceapă verde, servite cu sos Olandez catifelat, ardei copt și creveți marinați.",
    gramaj:420, alergeni:"gluten, ouă, crustacee", badgesFixe:[],
    nutritie:{kcal:115, proteine:6.9, grasimi:6.1, glucide:8.5},  /* la 100 g, din API */
    stock:'instock', featured:false
  },
  {
    id:"brioche-cu-scrumble-si-creveti", name:"Brioche cu scrumble și creveți", category:"mic-dejun",
    price:140, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/8d002625-178c-4d2b-8c4b-8a66c710ad0a-752x552x100.webp"],
    shortDesc:"Brioche cu ou scrumble, creveți, roșii cherry și spanac.",
    description:"Brioche cu ou scrumble, creveți, roșii cherry și spanac.",
    gramaj:310, alergeni:"gluten, ouă, crustacee", badgesFixe:[],
    nutritie:{kcal:128, proteine:8.4, grasimi:7.9, glucide:5.9},  /* la 100 g, din API */
    stock:'instock', featured:false
  },
  {
    id:"brinzoaice-cu-somon", name:"Brînzoaice cu Somon", category:"mic-dejun",
    price:145, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/e8e2c554-2a17-4a0b-ad56-a172bf277890-752x552x100.webp"],
    shortDesc:"Brînzoaice coapte, roșii cherry blanșate, smântână, ou fiert, somon slab sărat, microplante.",
    description:"Brînzoaice coapte, roșii cherry blanșate, smântână, ou fiert, somon slab sărat, microplante.",
    gramaj:360, alergeni:"lactate, ouă, pește", badgesFixe:[],
    nutritie:{kcal:161, proteine:4.6, grasimi:10.6, glucide:11.8},  /* la 100 g, din API */
    stock:'instock', featured:false
  },
  {
    id:"brinzoaice-cu-smintina-si-confit-de-visine", name:"Brînzoaice cu smîntînă și confit de vișine", category:"mic-dejun",
    price:120, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/e5aa5b30-244e-40f1-b987-5daaf8b26229-752x552x100.webp"],
    shortDesc:"Brînzoaice coapte, smântână, confit de vișină.",
    description:"Brînzoaice coapte, smântână, confit de vișină.",
    gramaj:320, alergeni:"lactate", badgesFixe:[],
    nutritie:{kcal:162, proteine:4.6, grasimi:9.6, glucide:10.8},  /* la 100 g, din API */
    stock:'instock', featured:false
  },
  {
    id:"clatite-cu-crema-de-mascarpone-confit-de-piersici-si-caramela", name:"Clătite cu cremă de mascarpone, confit de piersici și caramelă", category:"mic-dejun",
    price:90, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/c102c2cc-c9f3-43e6-ab5c-81a6bc74346d-752x552x100.webp"],
    shortDesc:"Clătite, confit de piersici, cremă de mascarpone, caramelă sărată.",
    description:"Clătite, confit de piersici, cremă de mascarpone, caramelă sărată.",
    gramaj:300, alergeni:"lactate", badgesFixe:[],
    nutritie:{kcal:195, proteine:3.5, grasimi:11.0, glucide:20.1},  /* la 100 g, din API */
    stock:'instock', featured:false
  },
  {
    id:"crema-din-cartofi-dulci-cu-guacamole-oua-posate-si-sos-olandez", name:"Cremă din cartofi dulci cu guacamole, ouă poșate și sos olandez ", category:"mic-dejun",
    price:160, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/39427404-77ee-47dd-ab2a-ecc21282cf1b-752x552x100.webp"],
    shortDesc:"Humus cu cartofi dulci, guacamole, ouă poșate, brânza feta, sos olandez, microplante, paine",
    description:"Humus cu cartofi dulci, guacamole, ouă poșate, brânza feta, sos olandez, microplante, paine",
    gramaj:350, alergeni:"gluten, lactate, ouă", badgesFixe:[],
    nutritie:{kcal:230, proteine:7.2, grasimi:5.7, glucide:5.7},  /* la 100 g, din API */
    stock:'instock', featured:false
  },
  {
    id:"croissant-cu-somon-si-guacamole", name:"Croissant cu somon și guacamole", category:"mic-dejun",
    price:185, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/3e42b1ba-6404-4fbb-a285-24f86800f766-752x552x100.webp"],
    shortDesc:"Croissant clasic, guacamole, ouă poșate, avocado, somon slab sărat, microplante, sos olandez",
    description:"Croissant clasic, guacamole, ouă poșate, avocado, somon slab sărat, microplante, sos olandez",
    gramaj:300, alergeni:"gluten, ouă, pește", badgesFixe:[],
    nutritie:{kcal:257, proteine:7.7, grasimi:20.9, glucide:9.9},  /* la 100 g, din API */
    stock:'instock', featured:false
  },
  {
    id:"croque-madame-cu-prosciutto-cotto", name:"Croque Madame cu Prosciutto cotto", category:"mic-dejun",
    price:150, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/reneebrunch/6911/bdc18940-bd7e-407f-b927-d3d582aaabca-752x552x100.webp"],
    shortDesc:"Pâine Brioche, Prosciutto Cotto, sos bechamel, ou ochi, cașcaval, mix de salată.",
    description:"Pâine Brioche, Prosciutto Cotto, sos bechamel, ou ochi, cașcaval, mix de salată.",
    gramaj:290, alergeni:"gluten, ouă", badgesFixe:[],
    nutritie:{kcal:233, proteine:9.4, grasimi:16.8, glucide:10.6},  /* la 100 g, din API */
    stock:'instock', featured:false
  },
  {
    id:"dejun-danez", name:"Dejun Danez", category:"mic-dejun",
    price:180, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/7c855d87-b140-477f-af4f-6aad6fb91bb6-752x552x100.webp"],
    shortDesc:"Ouă de găină, avocado, roșii, somon slab sărat, olive verzi, iaurt Grecesc, crema de brânză ",
    description:"Ouă de găină, avocado, roșii, somon slab sărat, olive verzi, iaurt Grecesc, crema de brânză Philadelphia",
    gramaj:480, alergeni:"lactate, ouă, pește", badgesFixe:[],
    nutritie:{kcal:149, proteine:6.5, grasimi:10.5, glucide:7.7},  /* la 100 g, din API */
    stock:'instock', featured:false
  },
  {
    id:"mic-dejun-englezesc", name:"Mic dejun englezesc", category:"mic-dejun",
    price:150, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/fd1bd7a0-1420-43c0-a347-d41a4328043d-752x552x100.webp"],
    shortDesc:"Crenvurști Premium, ouă ochi, ciuperci, bacon copt, roșii cherry, broccoli, paine",
    description:"Crenvurști Premium, ouă ochi, ciuperci, bacon copt, roșii cherry, broccoli, paine",
    gramaj:410, alergeni:"gluten, ouă", badgesFixe:["recomandat"],
    nutritie:{kcal:118, proteine:11.0, grasimi:7.1, glucide:2.5},  /* la 100 g, din API */
    stock:'instock', featured:true
  },
  {
    id:"omleta-cu-cascaval-brie", name:"Omleta cu cașcaval Brie", category:"mic-dejun",
    price:140, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/40a37558-44a7-4515-b515-ec08eab15777-752x552x100.webp"],
    shortDesc:"Ouă de găină, sos din zer, cașcaval Brie, cașcaval Parmigiano, ceapă verde",
    description:"Ouă de găină, sos din zer, cașcaval Brie, cașcaval Parmigiano, ceapă verde",
    gramaj:290, alergeni:"ouă", badgesFixe:[],
    nutritie:{kcal:314, proteine:11.4, grasimi:29.3, glucide:1.3},  /* la 100 g, din API */
    stock:'instock', featured:false
  },
  {
    id:"omleta-cu-spanac-si-ton", name:"Omleta cu spanac și ton", category:"mic-dejun",
    price:180, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/7f6d918e-ffe9-4726-8c74-233cc5c40ee3-752x552x100.webp"],
    shortDesc:"Ouă de găină, ton, sos din zer, spanac, cașcaval Parmigiano, icre Tobiko",
    description:"Ouă de găină, ton, sos din zer, spanac, cașcaval Parmigiano, icre Tobiko",
    gramaj:345, alergeni:"ouă, pește", badgesFixe:[],
    nutritie:{kcal:247, proteine:12.3, grasimi:21.4, glucide:1.5},  /* la 100 g, din API */
    stock:'instock', featured:false
  },
  {
    id:"oua-cu-tocanita-de-legume-shakshuka", name:"Ouă cu tocăniță de legume (shakshuka)", category:"mic-dejun",
    price:135, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/c8447192-7fd8-4754-89a3-2672c40b2212-752x552x100.webp"],
    shortDesc:"Tocăniță din legume (ardei grași,roșii,ceapă), ouă de găină, brînză de oi, ulei, ceapă verde",
    description:"Tocăniță din legume (ardei grași,roșii,ceapă), ouă de găină, brînză de oi, ulei, ceapă verde,pătrunjel,mărar",
    gramaj:400, alergeni:"ouă", badgesFixe:[],
    nutritie:{kcal:137, proteine:3.7, grasimi:9.4, glucide:9.6},  /* la 100 g, din API */
    stock:'instock', featured:false
  },
  {
    id:"pancacke-cu-caramela-si-sos-de-pomusoare", name:"Pancacke cu caramelă și  sos de pomușoare", category:"mic-dejun",
    price:130, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/afb75a39-9039-48d0-972e-0b2ea0f8c2ae-752x552x100.webp"],
    shortDesc:"Pancakes, cremă din Philadelphia, caramelă, căpșune, afine, sos din pomușoare.",
    description:"Pancakes, cremă din Philadelphia, caramelă, căpșune, afine, sos din pomușoare.",
    gramaj:340, alergeni:"gluten", badgesFixe:[],
    nutritie:{kcal:242, proteine:3.2, grasimi:18.0, glucide:16.6},  /* la 100 g, din API */
    stock:'instock', featured:false
  },
  {
    id:"roast-beef-croissant", name:"Roast Beef Croissant", category:"mic-dejun",
    price:170, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/403c6da2-5518-4a4b-b406-cb2591b810f1-752x552x100.webp"],
    shortDesc:"Croissant clasic, cremă de parmezan, scrob de ouă, mix de salata, roast beef, roșii confiate",
    description:"Croissant clasic, cremă de parmezan, scrob de ouă, mix de salata, roast beef, roșii confiate.",
    gramaj:310, alergeni:"gluten, lactate, ouă", badgesFixe:[],
    nutritie:{kcal:195, proteine:10.1, grasimi:12.5, glucide:11.4},  /* la 100 g, din API */
    stock:'instock', featured:false
  },
  {
    id:"terci-din-ovaz-cu-lapte-vegan", name:"Terci din ovăz cu lapte vegan", category:"mic-dejun",
    price:135, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/42dae493-586a-4f83-a4b0-115c11a444c0-752x552x100.webp"],
    shortDesc:"Terci cremos din fulgi de ovăz și lapte de cocos, servit cu zmeură proaspetă, alune de pădur",
    description:"Terci cremos din fulgi de ovăz și lapte de cocos, servit cu zmeură proaspetă, alune de pădure și coulis de zmeură cu semințe de chia.",
    gramaj:300, alergeni:"lactate, fructe cu coajă lemnoasă", badgesFixe:["vegan"],
    nutritie:{kcal:148, proteine:3.3, grasimi:10.3, glucide:11.9},  /* la 100 g, din API */
    stock:'instock', featured:false
  },
  {
    id:"terci-din-ovaz-cu-zmeura", name:"Terci din ovăz cu zmeură", category:"mic-dejun",
    price:120, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/42dae493-586a-4f83-a4b0-115c11a444c0-752x552x100.webp"],
    shortDesc:"1. Terci de ovăz cremos cu lapte, unt, coulis de zmeură cu chia, zmeură proaspătă și alune d",
    description:"1. Terci de ovăz cremos cu lapte, unt, coulis de zmeură cu chia, zmeură proaspătă și alune de pădure.",
    gramaj:300, alergeni:"lactate, fructe cu coajă lemnoasă", badgesFixe:[],
    nutritie:{kcal:157, proteine:4.5, grasimi:10.2, glucide:12.3},  /* la 100 g, din API */
    stock:'instock', featured:false
  },
  {
    id:"toast-cu-bacon-guacamole-si-gorgonzola", name:"Toast cu bacon, guacamole și gorgonzola", category:"mic-dejun",
    price:190, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/66f86afc-7a65-43c6-ac4b-6cbdf78d78d7-752x552x100.webp"],
    shortDesc:"Felie de pâine cu cereale prăjită, servită cu guacamole cremos și ouă gătite delicat, comple",
    description:"Felie de pâine cu cereale prăjită, servită cu guacamole cremos și ouă gătite delicat, completată de bacon crocant și cremă intensă de gorgonzola, finisat cu sos Olandez.",
    gramaj:300, alergeni:"gluten, lactate, ouă", badgesFixe:["nou"],
    nutritie:{kcal:246, proteine:9.4, grasimi:16.3, glucide:10.8},  /* la 100 g, din API */
    stock:'instock', featured:false
  },
  {
    id:"bowl-fresh-cu-somon-si-mango", name:"Bowl fresh cu somon și mango", category:"salate",
    price:195, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/2e52ae6c-72a0-4858-9103-4f8b6e1ba77c-752x552x100.webp"],
    shortDesc:"Salată cu somon – combinație echilibrată și proaspătă, cu somon fraged, orez negru aromatiza",
    description:"Salată cu somon – combinație echilibrată și proaspătă, cu somon fraged, orez negru aromatizat cu dressing asiatic și de mango, mix de salate crocante, mango dulce și avocado cremos. Preparatul este completat de tofu fin, roșii cherry și castravete proaspăt. O salată nutritivă, cu gust rafinat și aspect elegant.",
    gramaj:320, alergeni:"lactate, pește", badgesFixe:[],
    nutritie:{kcal:193, proteine:10.6, grasimi:10.9, glucide:13.0},  /* la 100 g, din API */
    stock:'instock', featured:false
  },
  {
    id:"green-salad", name:"Green Salad ", category:"salate",
    price:120, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/8a9cc5ff-4719-4ec8-81dc-bfdc380e0d36-752x552x100.webp"],
    shortDesc:"Baby leaf, zuchini, broccoli, avocado, dressing green salad, boabe de soia, nuci pecan.",
    description:"Baby leaf, zuchini, broccoli, avocado, dressing green salad, boabe de soia, nuci pecan.",
    gramaj:400, alergeni:"fructe cu coajă lemnoasă, soia", badgesFixe:[],
    nutritie:{kcal:140, proteine:5.2, grasimi:15.3, glucide:9.5},  /* la 100 g, din API */
    stock:'instock', featured:false
  },
  {
    id:"salata-cu-creveti", name:"Salată cu creveți", category:"salate",
    price:170, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/fd41c213-2b68-4b02-8550-9677d1027bed-752x552x100.webp"],
    shortDesc:"Creveți, mix de salată, roșii cherry blanșate, varza kohlrabi, fenicul, dressing coleslaw, f",
    description:"Creveți, mix de salată, roșii cherry blanșate, varza kohlrabi, fenicul, dressing coleslaw, fulgi de migdale.",
    gramaj:260, alergeni:"crustacee, fructe cu coajă lemnoasă", badgesFixe:[],
    nutritie:{kcal:82, proteine:10.8, grasimi:3.0, glucide:3.3},  /* la 100 g, din API */
    stock:'instock', featured:false
  },
  {
    id:"salata-cu-pulpa-de-pui", name:"Salată cu pulpă de pui", category:"salate",
    price:150, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/f7b5bbfd-e542-4675-bc4d-ab99fda3d86e-752x552x100.webp"],
    shortDesc:"Pulpă de pui, mix de salată,roșii confiate, ardei copți, pesmeți aromați cu sos pe baza de c",
    description:"Pulpă de pui, mix de salată,roșii confiate, ardei copți, pesmeți aromați cu sos pe baza de capere, anșoa, cascaval Parmigiano,",
    gramaj:310, alergeni:"lactate", badgesFixe:[],
    nutritie:{kcal:145, proteine:8.7, grasimi:9.9, glucide:5.0},  /* la 100 g, din API */
    stock:'instock', featured:false
  },
  {
    id:"supa-crema-de-ardei-copti", name:"Supă cremă de ardei copți", category:"supe",
    price:110, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/9b6e785a-7880-4b26-85bf-bb29ec1d65b3-752x552x100.webp"],
    shortDesc:"Ardei copți, cartofi, dovlecei, morcov, praz, nuci caju.",
    description:"Ardei copți, cartofi, dovlecei, morcov, praz, nuci caju.",
    gramaj:345, alergeni:"fructe cu coajă lemnoasă", badgesFixe:[],
    nutritie:{kcal:96, proteine:1.9, grasimi:6.8, glucide:7.4},  /* la 100 g, din API */
    stock:'instock', featured:false
  },
  {
    id:"supa-cu-raviolini-de-pui", name:"Supă cu raviolini de pui", category:"supe",
    price:145, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/3d293a10-ea52-4979-bffb-5c48f0907e19-752x552x100.webp"],
    shortDesc:"Supă aromată, servită cu ravioli artizanali umpluți cu carne de pui și cremă fină de brânză.",
    description:"Supă aromată, servită cu ravioli artizanali umpluți cu carne de pui și cremă fină de brânză. Preparatul este completat de roșii confiate, verdeață proaspătă și pastă TomKa, care oferă un gust bogat și aromat.",
    gramaj:350, alergeni:"lactate", badgesFixe:[],
    nutritie:{kcal:95, proteine:6.2, grasimi:4.3, glucide:7.5},  /* la 100 g, din API */
    stock:'instock', featured:false
  },
  {
    id:"pateu-din-ficat-de-iepure-si-pui", name:"Pateu din ficat de iepure și pui", category:"gustari",
    price:120, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/0cdc70cf-2fc1-45dc-8138-a494040052a1-752x552x100.webp"],
    shortDesc:"Pateu din ficat de iepure și pui cu legume și unt, pâinea cu susan, bacon crocant, alune de ",
    description:"Pateu din ficat de iepure și pui cu legume și unt, pâinea cu susan, bacon crocant, alune de pădure",
    gramaj:200, alergeni:"gluten, lactate, fructe cu coajă lemnoasă, susan", badgesFixe:["recomandat"],
    nutritie:{kcal:262, proteine:9.4, grasimi:16.2, glucide:15.5},  /* la 100 g, din API */
    stock:'instock', featured:true
  },
  {
    id:"tartar-de-somon", name:"Tartar de Somon", category:"gustari",
    price:180, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/79f3e1e0-1e34-4e3c-80fd-7eb2d96a35ef-752x552x100.webp"],
    shortDesc:"File de somon, avocado, castraveți, boabe de muștar în marinadă, lime, sos de soia, caviar t",
    description:"File de somon, avocado, castraveți, boabe de muștar în marinadă, lime, sos de soia, caviar tobiko.",
    gramaj:170, alergeni:"pește, soia", badgesFixe:[],
    nutritie:{kcal:158, proteine:9.4, grasimi:11.8, glucide:6.6},  /* la 100 g, din API */
    stock:'instock', featured:false
  },
  {
    id:"tartar-de-vita", name:"Tartar de vită ", category:"gustari",
    price:190, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/90f4d43b-641c-4229-bb04-45c1047b0847-752x552x100.webp"],
    shortDesc:"Gustare fină din mușchiuleț de vită crud, tocat mărunt și asezonat cu capere, muștar boabe ș",
    description:"Gustare fină din mușchiuleț de vită crud, tocat mărunt și asezonat cu capere, muștar boabe și sos special pentru salată. Preparatul este completat de mousse de parmezan, iar cartofii și mini eclerele oferă contrast de textură și elemente moderne de plating.",
    gramaj:160, alergeni:"lactate", badgesFixe:[],
    nutritie:{kcal:217, proteine:15.5, grasimi:12.3, glucide:9.1},  /* la 100 g, din API */
    stock:'instock', featured:false
  },
  {
    id:"vanata-cu-mousse-de-feta", name:"Vânătă cu mousse de Feta", category:"gustari",
    price:130, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/409286b9-f515-4d2f-bf2d-9c0cdb3072e3-752x552x100.webp"],
    shortDesc:"Vânăta coaptă, mousse de feta, dressing de ardei cu miere, roșii cherry, baby leaf.",
    description:"Vânăta coaptă, mousse de feta, dressing de ardei cu miere, roșii cherry, baby leaf.",
    gramaj:350, alergeni:"lactate", badgesFixe:[],
    nutritie:{kcal:72, proteine:2.7, grasimi:4.7, glucide:5.1},  /* la 100 g, din API */
    stock:'instock', featured:false
  },
  {
    id:"ceafa-de-porc-cu-crema-din-edamame", name:"Ceafă de porc cu cremă din edamame", category:"fel-principal",
    price:225, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/07fb9ef5-b731-406f-8174-379dd32e06f8-752x552x100.webp"],
    shortDesc:"Ceafă de porc, fragedă și suculentă, cremă din edamame, salată romano baby și sos „ju” inten",
    description:"Ceafă de porc, fragedă și suculentă, cremă din edamame, salată romano baby și sos „ju” intens aromat.",
    gramaj:260, alergeni:"soia", badgesFixe:[],
    nutritie:{kcal:284, proteine:17.0, grasimi:21.2, glucide:4.3},  /* la 100 g, din API */
    stock:'instock', featured:false
  },
  {
    id:"dorada-cu-legume", name:"Dorada cu legume ", category:"fel-principal",
    price:280, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/6133e189-b0bc-49db-938c-5641237a0b45-752x552x100.webp"],
    shortDesc:"File de doradă fragedă, gătită pe grill și servită alături de zucchini, roșii cherry, anghin",
    description:"File de doradă fragedă, gătită pe grill și servită alături de zucchini, roșii cherry, anghinare, edamame, măsline Kalamata și capere. Preparatul este completat cu unt 82 % , reducție fină din citrice.",
    gramaj:370, alergeni:"lactate, soia", badgesFixe:["recomandat"],
    nutritie:{kcal:165, proteine:8.7, grasimi:11.8, glucide:5.8},  /* la 100 g, din API */
    stock:'instock', featured:true
  },
  {
    id:"filet-mignon-cu-legume-verzi", name:"Filet Mignon cu legume verzi", category:"fel-principal",
    price:330, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/2f86cfa8-90e1-4750-b224-6475ecccf9d5-752x552x100.webp"],
    shortDesc:"Mușchiuleț de vită fraged, servit cu zucchini sotat, broccoli crocant și ciuperci aromate, c",
    description:"Mușchiuleț de vită fraged, servit cu zucchini sotat, broccoli crocant și ciuperci aromate, completat de o marinadă fină.",
    gramaj:360, alergeni:"niciun alergen identificat", badgesFixe:[],
    nutritie:{kcal:144, proteine:11.4, grasimi:9.2, glucide:4.6},  /* la 100 g, din API */
    stock:'instock', featured:false
  },
  {
    id:"paste-carbonara", name:"Paste Carbonara", category:"fel-principal",
    price:190, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/e75dd60c-4530-4974-b628-b22a8a1e5acb-752x552x100.webp"],
    shortDesc:"Paste Linguine, galbenuși de ouă, guanciale, cașcaval pecorino, parmezan.",
    description:"Paste Linguine, galbenuși de ouă, guanciale, cașcaval pecorino, parmezan.",
    gramaj:310, alergeni:"gluten, lactate, ouă", badgesFixe:["nou"],
    nutritie:{kcal:338, proteine:22.6, grasimi:24.0, glucide:5.6},  /* la 100 g, din API */
    stock:'instock', featured:false
  },
  {
    id:"paste-cu-creveti-si-sos-bisque", name:"Paste cu creveți și sos Bisque", category:"fel-principal",
    price:210, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/62193982-1730-42a9-91a0-09f63b297234-752x552x100.webp"],
    shortDesc:"Paste Linguine, bisque, creveți, parmezan, unt, roșii cherry, lime",
    description:"Paste Linguine, bisque, creveți, parmezan, unt, roșii cherry, lime",
    gramaj:310, alergeni:"gluten, lactate, crustacee", badgesFixe:[],
    nutritie:{kcal:210, proteine:18.2, grasimi:12.7, glucide:6.5},  /* la 100 g, din API */
    stock:'instock', featured:false
  },
  {
    id:"paste-cu-ragut-din-iepure", name:"Paste cu ragut din iepure", category:"fel-principal",
    price:220, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/03399af8-1531-4c09-b7ff-5d08e4b997f9-752x552x100.webp"],
    shortDesc:"Ragut din iepure, paste Linguine, hribii, cașcaval Parmigiano",
    description:"Ragut din iepure, paste Linguine, hribii, cașcaval Parmigiano",
    gramaj:350, alergeni:"gluten", badgesFixe:[],
    nutritie:{kcal:234, proteine:11.5, grasimi:13.2, glucide:16.6},  /* la 100 g, din API */
    stock:'instock', featured:false
  },
  {
    id:"pui-francez-cu-sos-tzatziki", name:"Pui francez cu sos Tzatziki", category:"fel-principal",
    price:280, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/2251054d-35cc-40e1-a112-76eda32a4484-752x552x100.webp"],
    shortDesc:"Pui fraged, gătit delicat, servit cu legume sotate ușor (ardei California, morcov și zucchin",
    description:"Pui fraged, gătit delicat, servit cu legume sotate ușor (ardei California, morcov și zucchini), edamame și completat de sosul Țațâki răcoritor, pe bază de iaurt și castravete.",
    gramaj:475, alergeni:"lactate, soia", badgesFixe:[],
    nutritie:{kcal:135, proteine:12.6, grasimi:7.9, glucide:2.8},  /* la 100 g, din API */
    stock:'instock', featured:false
  },
  {
    id:"ravioli-cu-carne-si-sos-de-rosii", name:"Ravioli cu carne și sos de roșii", category:"fel-principal",
    price:210, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/dd3d3c9a-bffb-4fad-b0a5-c37ecac31b3d-752x552x100.webp"],
    shortDesc:"Ravioli umplute cu carne, servite cu sos aromat din roșii cherry, roșii pelati, bulion de pu",
    description:"Ravioli umplute cu carne, servite cu sos aromat din roșii cherry, roșii pelati, bulion de pui și finisate cu unt 82% și parmezan",
    gramaj:310, alergeni:"lactate", badgesFixe:[],
    nutritie:{kcal:156, proteine:8.5, grasimi:9.2, glucide:9.1},  /* la 100 g, din API */
    stock:'instock', featured:false
  },
  {
    id:"risotto-cu-ragut-de-ciuperci-si-crema-de-trufe", name:"Risotto cu ragut de ciuperci si cremă de trufe", category:"fel-principal",
    price:210, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/d2aec086-2d21-4eac-8f30-061f98b65d23-752x552x100.webp"],
    shortDesc:"Risotto cremos, îmbogățit cu ragu de ciuperci și ciuperci păstrăv fragede. Preparatul este f",
    description:"Risotto cremos, îmbogățit cu ragu de ciuperci și ciuperci păstrăv fragede. Preparatul este finisat cu unt 82% și brânză Duro Nostrale. Crema de trufe adaugă o notă elegantă și rafinată.",
    gramaj:340, alergeni:"lactate", badgesFixe:["recomandat"],
    nutritie:{kcal:110, proteine:3.0, grasimi:6.3, glucide:10.1},  /* la 100 g, din API */
    stock:'instock', featured:true
  },
  {
    id:"somon-cu-sos-din-spanac", name:"Somon cu sos din spanac", category:"fel-principal",
    price:260, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/4dee7666-eb40-40ad-9b46-6597ed211804-752x552x100.webp"],
    shortDesc:"File de somon suculent, gătit delicat și servit cu sos din spanac, completat de cremă fină d",
    description:"File de somon suculent, gătit delicat și servit cu sos din spanac, completat de cremă fină din morcov, roșii proaspete, mix de salată verde.",
    gramaj:280, alergeni:"pește", badgesFixe:[],
    nutritie:{kcal:143, proteine:12.1, grasimi:8.6, glucide:2.9},  /* la 100 g, din API */
    stock:'instock', featured:false
  },
  {
    id:"tentacule-de-calamar-in-ragu-de-rosii", name:"Tentacule de calamar în ragù de roșii", category:"fel-principal",
    price:260, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/f81b4a9d-d723-4e60-b8db-24a2d057dce6-752x552x100.webp"],
    shortDesc:"Tentacule de calamari fragede, gătite delicat,servite alături de un ragu aromat din legume d",
    description:"Tentacule de calamari fragede, gătite delicat,servite alături de un ragu aromat din legume de sezon. Preparatul este completat de cartofi baby ușor rumeniți și măsline Kalamata.",
    gramaj:370, alergeni:"crustacee", badgesFixe:[],
    nutritie:{kcal:84, proteine:5.2, grasimi:3.2, glucide:8.3},  /* la 100 g, din API */
    stock:'instock', featured:false
  },
  {
    id:"cheescake-san-sebastian", name:"Cheescake San Sebastian", category:"deserturi",
    price:80, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/reneebrunch/6911/b2a7dd4f-e449-4ea3-956a-e2a715cc518e-752x552x100.webp"],
    shortDesc:"Cremă de brînză Philadelphia,frișcă naturală de 36%, ouă de găină, zahăr, pastae de vanilie.",
    description:"Cremă de brînză Philadelphia,frișcă naturală de 36%, ouă de găină, zahăr, pastae de vanilie.",
    gramaj:130, alergeni:"ouă", badgesFixe:[],
    nutritie:{kcal:261, proteine:5.2, grasimi:18.9, glucide:17.6},  /* la 100 g, din API */
    stock:'instock', featured:false
  },
  {
    id:"choco-caramel-mousse", name:"Choco Caramel Mousse", category:"deserturi",
    price:75, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/5399d6f5-cede-4474-ace4-d94e55142561-752x552x100.webp"],
    shortDesc:"Ouă, ciocolată cu lapte Belgiană, zahar, сremă de brînză proaspătă Cremette, lapte de 2,5%, ",
    description:"Ouă, ciocolată cu lapte Belgiană, zahar, сremă de brînză proaspătă Cremette, lapte de 2,5%, caramela sarată ( smântână dulce din lapte de vaci de 36 % grăsime, unt de 82,5% grăsime, unt de cacao, făină de grâu, pudra de cacao, gelatina.",
    gramaj:85, alergeni:"gluten, lactate, ouă", badgesFixe:["recomandat"],
    nutritie:{kcal:348, proteine:19.7, grasimi:20.7, glucide:34.2},  /* la 100 g, din API */
    stock:'instock', featured:true
  },
  {
    id:"croissant-clasic-renee", name:"Croissant Clasic Renée", category:"deserturi",
    price:40, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/reneebrunch/6911/df05c365-c3e4-4744-964a-68c8aec5447f-752x552x100.webp"],
    shortDesc:"Croissant pe bază de unt 82,5%, lapte de 3,5%, maia naturală biologică, miere de albini.",
    description:"Croissant pe bază de unt 82,5%, lapte de 3,5%, maia naturală biologică, miere de albini.",
    gramaj:70, alergeni:"gluten, lactate", badgesFixe:[],
    nutritie:{kcal:324, proteine:4.4, grasimi:22.8, glucide:24.8},  /* la 100 g, din API */
    stock:'instock', featured:false
  },
  {
    id:"croissant-cu-crema-de-ciocolata-renee", name:"Croissant cu cremă de ciocolată Renée", category:"deserturi",
    price:70, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/db9bc422-febc-4e65-a40c-02e03a1dddd2-752x552x100.webp"],
    shortDesc:"Croissant artizanal pe bază de unt cu 82,5% grăsime, umplut cu o cremă fină preparată din ci",
    description:"Croissant artizanal pe bază de unt cu 82,5% grăsime, umplut cu o cremă fină preparată din ciocolată neagră, mascarpone, frișcă naturală și unt. Textura catifelată este completată de biluțe crocante de ciocolată neagră.",
    gramaj:120, alergeni:"gluten, lactate", badgesFixe:[],
    nutritie:{kcal:312, proteine:11.0, grasimi:13.7, glucide:39.4},  /* la 100 g, din API */
    stock:'instock', featured:false
  },
  {
    id:"croissant-cu-crema-de-fistic", name:"Croissant cu cremă de fistic", category:"deserturi",
    price:70, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/f49c105e-6fe1-41ba-9cb2-f6244753e943-752x552x100.webp"],
    shortDesc:"Croissant classic pe bază de unt de 82,5% cu cremă combinată din lapte, frișcă naturală de 3",
    description:"Croissant classic pe bază de unt de 82,5% cu cremă combinată din lapte, frișcă naturală de 36% și pastă pură de fistic, fistic zdrobit.",
    gramaj:130, alergeni:"gluten, lactate, fructe cu coajă lemnoasă", badgesFixe:[],
    nutritie:{kcal:319, proteine:5.3, grasimi:13.5, glucide:41.9},  /* la 100 g, din API */
    stock:'instock', featured:false
  },
  {
    id:"croissant-cu-crema-de-migdale", name:"Croissant cu cremă de migdale", category:"deserturi",
    price:70, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/9ef1f7f4-fea0-47ff-8592-23b339e127bc-752x552x100.webp"],
    shortDesc:"Croissant classic pe bază de unt de 82,5 % cu umplutura frangipane (cremă de migdale), fulgi",
    description:"Croissant classic pe bază de unt de 82,5 % cu umplutura frangipane (cremă de migdale), fulgi de migdale",
    gramaj:130, alergeni:"gluten, lactate, fructe cu coajă lemnoasă", badgesFixe:[],
    nutritie:{kcal:430, proteine:8.7, grasimi:22.4, glucide:46.6},  /* la 100 g, din API */
    stock:'instock', featured:false
  },
  {
    id:"croissant-cu-crema-din-lapte-frisca-si-zmeura", name:"Croissant cu cremă din lapte, frișcă și zmeură", category:"deserturi",
    price:70, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/68851f87-7be2-4f96-8254-c61488d5cae3-752x552x100.webp"],
    shortDesc:"Croissant classic pe bază de unt de 82,5 % cu cremă combinată din lapte, frișcă naturală de ",
    description:"Croissant classic pe bază de unt de 82,5 % cu cremă combinată din lapte, frișcă naturală de 36% și insert din zmeură.",
    gramaj:130, alergeni:"gluten, lactate", badgesFixe:[],
    nutritie:{kcal:309, proteine:4.9, grasimi:9.9, glucide:47.1},  /* la 100 g, din API */
    stock:'instock', featured:false
  },
  {
    id:"desert-raw-vegan", name:"Desert Raw Vegan", category:"deserturi",
    price:75, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/f3d3d58f-d35c-47af-ae2d-632850592cad-752x552x100.webp"],
    shortDesc:"Nuci de caju, sirop de agave, lapte de cocos, ulei de cocos, unt de cacao, cacao pudră, migd",
    description:"Nuci de caju, sirop de agave, lapte de cocos, ulei de cocos, unt de cacao, cacao pudră, migdale, miez de nucă grecească, curmale, păstaie de vanilie",
    gramaj:85, alergeni:"lactate, fructe cu coajă lemnoasă", badgesFixe:["vegan"],
    nutritie:{kcal:429, proteine:8.7, grasimi:33.5, glucide:12.5},  /* la 100 g, din API */
    stock:'instock', featured:false
  },
  {
    id:"ecler-cu-crema-de-fistic-renee", name:"Ecler cu cremă de fistic Renée", category:"deserturi",
    price:55, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/reneebrunch/6911/419e4072-225f-4cb9-8cad-f93d3e810ce7-752x552x100.webp"],
    shortDesc:"Prăjitură din aluat opărit, cremă combinată din lapte, unt de 82,5%, cremă de brînză Mascarp",
    description:"Prăjitură din aluat opărit, cremă combinată din lapte, unt de 82,5%, cremă de brînză Mascarpone, pasta de fistic, pastaie de vanilie, glazură din ciocolată albă Belgiană.",
    gramaj:90, alergeni:"gluten, lactate, fructe cu coajă lemnoasă", badgesFixe:[],
    nutritie:{kcal:284, proteine:5.6, grasimi:18.2, glucide:24.4},  /* la 100 g, din API */
    stock:'instock', featured:false
  },
  {
    id:"ecler-cu-crema-de-mango-si-mousse-de-capsuni", name:"Ecler cu cremă de mango și  mousse de căpșuni", category:"deserturi",
    price:55, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/reneebrunch/6911/91823830-54d9-4700-b578-6fd38b410931-752x552x100.webp"],
    shortDesc:"Prăjitură din aluat opărit, cremeaux din piure de mango și fructul pasiunii, pastaie de vani",
    description:"Prăjitură din aluat opărit, cremeaux din piure de mango și fructul pasiunii, pastaie de vanilie, mousse de capșuni",
    gramaj:110, alergeni:"gluten", badgesFixe:[],
    nutritie:{kcal:343, proteine:12.8, grasimi:26.8, glucide:20.7},  /* la 100 g, din API */
    stock:'instock', featured:false
  },
  {
    id:"ecler-cu-visine-si-ciocolata", name:"Ecler cu vișine și ciocolată", category:"deserturi",
    price:55, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/283c1ee1-8b36-4e65-ad2d-44a3e237b5b2-752x552x100.webp"],
    shortDesc:"Prăjitură din aluat opărit, cremă de ciocolată, mousse de ciocolată, insert de vișină",
    description:"Prăjitură din aluat opărit, cremă de ciocolată, mousse de ciocolată, insert de vișină",
    gramaj:120, alergeni:"gluten, lactate", badgesFixe:[],
    nutritie:{kcal:229, proteine:2.9, grasimi:15.4, glucide:17.7},  /* la 100 g, din API */
    stock:'instock', featured:false
  },
  {
    id:"fleur-de-renee", name:"Fleur de Renée", category:"deserturi",
    price:75, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/14377978-a4bf-4c7b-8dcd-a6252d4e61c2-752x552x100.webp"],
    shortDesc:"Prăjitură din pandișpan cu făină de migdale și fulgi de cocos, mousse din ciocolată albă Bel",
    description:"Prăjitură din pandișpan cu făină de migdale și fulgi de cocos, mousse din ciocolată albă Belgiană și lapte de cocos, cremeaux exotic și confi din mango și fructul pasiunii",
    gramaj:85, alergeni:"gluten, lactate, fructe cu coajă lemnoasă", badgesFixe:[],
    nutritie:{kcal:342, proteine:5.8, grasimi:25.1, glucide:24.0},  /* la 100 g, din API */
    stock:'instock', featured:false
  },
  {
    id:"fleur-de-vanille", name:"Fleur de Vanille", category:"deserturi",
    price:70, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/a6159902-cec7-4179-9b92-fa0e22392409-752x552x100.webp"],
    shortDesc:"Tartă fină din aluat fraged, frangipane din făină de migdale, insert de căpșuni și ganache d",
    description:"Tartă fină din aluat fraged, frangipane din făină de migdale, insert de căpșuni și ganache din ciocolată albă cu vanilie și lime",
    gramaj:120, alergeni:"gluten, lactate, fructe cu coajă lemnoasă", badgesFixe:["recomandat"],
    nutritie:{kcal:370, proteine:5.0, grasimi:21.7, glucide:37.1},  /* la 100 g, din API */
    stock:'instock', featured:true
  },
  {
    id:"fondant-de-ciocolata", name:"Fondant de ciocolată ", category:"deserturi",
    price:120, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/5743a4da-8d05-4e85-80cc-94dd184eb6a6-752x552x100.webp"],
    shortDesc:"Fondant de ciocolată, înghețată cu lămâie, spuma de plombir",
    description:"Fondant de ciocolată, înghețată cu lămâie, spuma de plombir",
    gramaj:150, alergeni:"lactate", badgesFixe:[],
    nutritie:{kcal:338, proteine:6.1, grasimi:23.7, glucide:25.7},  /* la 100 g, din API */
    stock:'instock', featured:false
  },
  {
    id:"love-mousse", name:"Love Mousse", category:"deserturi",
    price:60, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/reneebrunch/6911/6b34f4b8-3bac-4a6d-bd8d-cfd31b0d3e2c-752x552x100.webp"],
    shortDesc:"Prăjitură din pandișpan cu ciocolată albă Belgiană și mousse din zmeură.",
    description:"Prăjitură din pandișpan cu ciocolată albă Belgiană și mousse din zmeură.",
    gramaj:60, alergeni:"lactate", badgesFixe:["nou"],
    nutritie:{kcal:294, proteine:7.8, grasimi:20.1, glucide:18.7},  /* la 100 g, din API */
    stock:'instock', featured:false
  },
  {
    id:"macarons-choconut-renee", name:"Macarons Choconut Renée", category:"deserturi",
    price:30, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/e3930170-9ea1-469c-a79e-7f7562998814-752x552x100.webp"],
    shortDesc:"Macarons cu aluat fin din migdale, umplut cu ganache de ciocolată cu lapte, smîntînă dulce d",
    description:"Macarons cu aluat fin din migdale, umplut cu ganache de ciocolată cu lapte, smîntînă dulce de 36% grăsime și caramelă fină, decorat cu ciocolată Belgiană și arahide zdrobite.",
    gramaj:24, alergeni:"gluten, lactate, fructe cu coajă lemnoasă", badgesFixe:[],
    nutritie:{kcal:453, proteine:8.4, grasimi:28.8, glucide:42.8},  /* la 100 g, din API */
    stock:'instock', featured:false
  },
  {
    id:"macarons-coacaza-renee", name:"Macarons Coacaza Renée", category:"deserturi",
    price:30, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/af47ba8a-e8cb-4eac-860b-ae619d9d245c-752x552x100.webp"],
    shortDesc:"Macarons cu aluat fin din migdale, umplute cu ganache de ciocolată albă Belgiană și smântână",
    description:"Macarons cu aluat fin din migdale, umplute cu ganache de ciocolată albă Belgiană și smântână dulce 36% grăsime, completate cu coacăze negre.",
    gramaj:24, alergeni:"gluten, lactate, fructe cu coajă lemnoasă", badgesFixe:[],
    nutritie:{kcal:411, proteine:7.2, grasimi:21.0, glucide:48.3},  /* la 100 g, din API */
    stock:'instock', featured:false
  },
  {
    id:"macarons-cocos-renee", name:"Macarons Cocos Renée", category:"deserturi",
    price:30, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/c01c8d38-e20d-4a67-93a2-4c1a04833906-752x552x100.webp"],
    shortDesc:"Macarons cu aluat din migdale, umplut cu ganache fin de ciocolată albă Belgiană și smântână ",
    description:"Macarons cu aluat din migdale, umplut cu ganache fin de ciocolată albă Belgiană și smântână dulce de 36% grăsime completat cu fulgi de cocos și pastă de cocos.",
    gramaj:24, alergeni:"gluten, lactate, fructe cu coajă lemnoasă", badgesFixe:[],
    nutritie:{kcal:445, proteine:7.1, grasimi:28.0, glucide:42.0},  /* la 100 g, din API */
    stock:'instock', featured:false
  },
  {
    id:"macarons-fistic-renee", name:"Macarons Fistic Renée", category:"deserturi",
    price:30, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/483e93ed-dab1-455f-8136-dab7b30f17aa-752x552x100.webp"],
    shortDesc:"Macarons cu aluat delicat din migdale, umplut cu ganache fin de ciocolată albă Belgiană și s",
    description:"Macarons cu aluat delicat din migdale, umplut cu ganache fin de ciocolată albă Belgiană și smântână dulce de 36% grăsime, completat cu pastă de fistic și piure de zmeură.",
    gramaj:24, alergeni:"gluten, lactate, fructe cu coajă lemnoasă", badgesFixe:["recomandat"],
    nutritie:{kcal:401, proteine:7.2, grasimi:22.3, glucide:43.0},  /* la 100 g, din API */
    stock:'instock', featured:true
  },
  {
    id:"macarons-mango-maracuia-renee", name:"Macarons Mango Maracuia Renée", category:"deserturi",
    price:30, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/aff2168f-3e77-456b-bf6a-61415eab902e-752x552x100.webp"],
    shortDesc:"Macarons cu aluat fin din migdale, umplut cu ganache de ciocolată albă Belgiană și insert ex",
    description:"Macarons cu aluat fin din migdale, umplut cu ganache de ciocolată albă Belgiană și insert exotic din mango și maracuja.",
    gramaj:24, alergeni:"gluten, lactate, fructe cu coajă lemnoasă", badgesFixe:["nou"],
    nutritie:{kcal:351, proteine:9.4, grasimi:16.3, glucide:44.8},  /* la 100 g, din API */
    stock:'instock', featured:false
  },
  {
    id:"macarons-para-dorblu-renee", name:"Macarons Para-Dorblu Renée", category:"deserturi",
    price:30, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/08aef9e9-f151-48ed-81d9-879689701f7a-752x552x100.webp"],
    shortDesc:"Macarons cu aluat delicat din migdale, umplut cu ganache fin de ciocolată albă Belgiană și s",
    description:"Macarons cu aluat delicat din migdale, umplut cu ganache fin de ciocolată albă Belgiană și smântână dulce de 36% grăsime, completat cu piure de pară și brânză maturată cu mucegai albastru „Dorblu”.",
    gramaj:24, alergeni:"gluten, lactate, fructe cu coajă lemnoasă", badgesFixe:[],
    nutritie:{kcal:404, proteine:7.8, grasimi:22.6, glucide:43.0},  /* la 100 g, din API */
    stock:'instock', featured:false
  },
  {
    id:"macarons-plombir-capsuna-renee", name:"Macarons Plombir Căpșună Renée", category:"deserturi",
    price:30, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/751d000a-1f96-4825-b2c3-3249455d4013-752x552x100.webp"],
    shortDesc:"Macarons cu aluat fin din migdale, umplut cu ganache cremos de ciocolată albă Belgiană și sm",
    description:"Macarons cu aluat fin din migdale, umplut cu ganache cremos de ciocolată albă Belgiană și smântână dulce de 36% grăsime, completat cu marmeladă naturală de căpșuni.",
    gramaj:24, alergeni:"gluten, lactate, fructe cu coajă lemnoasă", badgesFixe:[],
    nutritie:{kcal:390, proteine:6.8, grasimi:21.7, glucide:42.6},  /* la 100 g, din API */
    stock:'instock', featured:false
  },
  {
    id:"napoleon", name:"Napoleon", category:"deserturi",
    price:65, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/reneebrunch/6911/be3ff46a-9231-4849-b619-de98c8c6bf16-752x552x100.webp"],
    shortDesc:"Prăjitură asamblată din blaturi crocante din foitaj (aluat stratificat cu unt) și cremă fină",
    description:"Prăjitură asamblată din blaturi crocante din foitaj (aluat stratificat cu unt) și cremă fină din lapte și frișcă naturală.",
    gramaj:140, alergeni:"gluten, lactate", badgesFixe:[],
    nutritie:{kcal:348, proteine:3.9, grasimi:26.7, glucide:22.8},  /* la 100 g, din API */
    stock:'instock', featured:false
  },
  {
    id:"pain-suisse-cu-cascaval-si-sunca", name:"Pain Suisse  cu cașcaval și șuncă", category:"deserturi",
    price:75, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/97abae2f-e99d-4ee9-abfe-d4aa8f36fc3f-752x552x100.webp"],
    shortDesc:"Pan din foietaj pe bază de unt cu umplutură din șuncă și cașcaval Mozzarella.",
    description:"Pan din foietaj pe bază de unt cu umplutură din șuncă și cașcaval Mozzarella.",
    gramaj:100, alergeni:"lactate", badgesFixe:["recomandat"],
    nutritie:{kcal:290, proteine:9.0, grasimi:14.8, glucide:28.2},  /* la 100 g, din API */
    stock:'instock', featured:true
  },
  {
    id:"pain-suisse-cu-crema-si-ciocolata", name:"Pain Suisse cu cremă și ciocolată", category:"deserturi",
    price:70, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/be30961e-400f-44a4-bd09-3d57375521ef-752x552x100.webp"],
    shortDesc:"Pan din foietaj pe bază de unt cu umplutură din crema pasticcera și ciocolată neagră Belgian",
    description:"Pan din foietaj pe bază de unt cu umplutură din crema pasticcera și ciocolată neagră Belgiană",
    gramaj:100, alergeni:"lactate", badgesFixe:["recomandat"],
    nutritie:{kcal:288, proteine:5.0, grasimi:9.1, glucide:43.9},  /* la 100 g, din API */
    stock:'instock', featured:true
  },
  {
    id:"pan-de-ciocolata-renee", name:"Pan de ciocolată Renée", category:"deserturi",
    price:55, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/e60a3663-c494-41c8-9011-3d84c728245e-752x552x100.webp"],
    shortDesc:"Pan din foietaj pe bază de unt cu umplutură din ciocolată neagră belgiană",
    description:"Pan din foietaj pe bază de unt cu umplutură din ciocolată neagră belgiană",
    gramaj:75, alergeni:"lactate", badgesFixe:["recomandat"],
    nutritie:{kcal:379, proteine:7.4, grasimi:10.4, glucide:58.9},  /* la 100 g, din API */
    stock:'instock', featured:true
  },
  {
    id:"pavlova-renee", name:"Pavlova Renée", category:"deserturi",
    price:70, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/6189897f-b949-4e27-9f7b-d89e6d5d3442-752x552x100.webp"],
    shortDesc:"Bezea fină, ganaj din ciocolată albă și lime, insert din fructe de pădure, decorată cu bezea",
    description:"Bezea fină, ganaj din ciocolată albă și lime, insert din fructe de pădure, decorată cu bezea și fructe proaspete de sezon.",
    gramaj:100, alergeni:"lactate, ouă", badgesFixe:["recomandat"],
    nutritie:{kcal:267, proteine:3.0, grasimi:12.7, glucide:35.4},  /* la 100 g, din API */
    stock:'instock', featured:true
  },
  {
    id:"tartaleta-cu-fistic-si-zmeura-renee", name:"Tartaletă cu fistic și zmeură Renée", category:"deserturi",
    price:65, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/reneebrunch/6911/846c1aac-9069-4569-b142-efc198ecffaa-752x552x100.webp"],
    shortDesc:"Tartaleta fragedă, frangipane cu pasta de fistic, insert din zmeură și ganaj din ciocolată a",
    description:"Tartaleta fragedă, frangipane cu pasta de fistic, insert din zmeură și ganaj din ciocolată albă Belgiană, zmeură, fistic.",
    gramaj:90, alergeni:"lactate, fructe cu coajă lemnoasă", badgesFixe:["recomandat"],
    nutritie:{kcal:361, proteine:8.9, grasimi:21.9, glucide:34.9},  /* la 100 g, din API */
    stock:'instock', featured:true
  },
  {
    id:"tartaleta-cu-fructe-renee", name:"Tartaletă cu fructe Renée ", category:"deserturi",
    price:65, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/41ffe1f7-0013-457a-95a7-63b2f974f9d4-752x552x100.webp"],
    shortDesc:"Tartaleta fragedă cu cremă combinată din lapte, unt de 82,5%, cremă de brînză Mascarpone, co",
    description:"Tartaleta fragedă cu cremă combinată din lapte, unt de 82,5%, cremă de brînză Mascarpone, confi din capșuni, capșuni proaspete",
    gramaj:110, alergeni:"lactate", badgesFixe:["recomandat"],
    nutritie:{kcal:190, proteine:2.5, grasimi:8.7, glucide:25.0},  /* la 100 g, din API */
    stock:'instock', featured:true
  },
  {
    id:"tiramisu-renee", name:"Tiramisu Renée", category:"deserturi",
    price:65, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/91972bbb-beb8-4c93-a0ba-57f0670a31f8-752x552x100.webp"],
    shortDesc:"Biscuiți Savoiardi, smântână dulce de 33%, brânză cremoasă Mascarpone, gălbenuş de ou, zahăr",
    description:"Biscuiți Savoiardi, smântână dulce de 33%, brânză cremoasă Mascarpone, gălbenuş de ou, zahăr, cafea",
    gramaj:120, alergeni:"gluten, lactate, ouă", badgesFixe:["recomandat"],
    nutritie:{kcal:303, proteine:6.0, grasimi:19.3, glucide:25.6},  /* la 100 g, din API */
    stock:'instock', featured:true
  },
  {
    id:"tropical-fusion", name:"Tropical Fusion", category:"deserturi",
    price:75, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/dcba1cea-d97c-4465-8704-a701f720b2c2-752x552x100.webp"],
    shortDesc:"Pandișpan pufos, insert de mango și maracuja, mousse de cocos, decorat cu ganaj din ciocolat",
    description:"Pandișpan pufos, insert de mango și maracuja, mousse de cocos, decorat cu ganaj din ciocolată albă.",
    gramaj:120, alergeni:"lactate", badgesFixe:["recomandat"],
    nutritie:{kcal:284, proteine:8.6, grasimi:19.5, glucide:21.1},  /* la 100 g, din API */
    stock:'instock', featured:true
  },
  {
    id:"paine-cu-cereale", name:"Pâine cu cereale", category:"paine",
    price:30, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/6911/3a3b0664-a1ea-439a-a929-669acf7fbd0e-752x552x100.webp"],
    shortDesc:"",
    description:"",
    gramaj:300, alergeni:"gluten", badgesFixe:[],
    nutritie:{kcal:229, proteine:7.2, grasimi:4.6, glucide:39.7},  /* la 100 g, din API */
    stock:'instock', featured:false
  },
  {
    id:"paine-cu-secara-si-susan", name:"Pâine cu secară și susan", category:"paine",
    price:50, onSale:false, salePrice:null,
    images:["https://f3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com/eu/reneebrunch/6911/d452a922-a084-4152-981e-0ddece0c5b36-752x552x100.webp"],
    shortDesc:"",
    description:"",
    gramaj:500, alergeni:"gluten, susan", badgesFixe:[],
    nutritie:{kcal:238, proteine:7.3, grasimi:7.1, glucide:35.3},  /* la 100 g, din API */
    stock:'instock', featured:false
  },
];

window.getProduct = function(id){
  for (var i=0;i<window.RENEE_PRODUCTS.length;i++){
    if (window.RENEE_PRODUCTS[i].id === id) return window.RENEE_PRODUCTS[i];
  }
  return null;
};
window.getProductsByCategory = function(catId){
  if (!catId || catId === 'all') return window.RENEE_PRODUCTS.slice();
  return window.RENEE_PRODUCTS.filter(function(p){ return p.category === catId; });
};
window.getFeatured = function(){
  return window.RENEE_PRODUCTS.filter(function(p){ return p.featured; });
};

(function(){
  window.RENEE_PRODUCTS.forEach(function(p){
    p.badges = (p.badgesFixe || []).slice();
    p.bestseller = p.featured;
  });
  window.getBestsellers = function(){
    return window.RENEE_PRODUCTS.filter(function(p){ return p.bestseller; });
  };
})();
