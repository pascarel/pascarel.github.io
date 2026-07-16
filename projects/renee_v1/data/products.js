/* Renée — catalog DRAFT. WP: → CPT product + product_cat. Imagini/prețuri de înlocuit. */
/* DRAFT: de înlocuit */
window.RENEE_CATEGORIES = [
  { id:'cafea',    name:'Cafea',              image:'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=70&auto=format&fit=crop', description:'Boabe proaspăt prăjite, măcinate la comandă.' },
  { id:'dulciuri', name:'Dulciuri & Patiserie', image:'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=800&q=70&auto=format&fit=crop', description:'Prăjituri și patiserie de casă.' },
  { id:'brunch',   name:'Brunch Box',         image:'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800&q=70&auto=format&fit=crop', description:'Mic dejun complet, livrat la tine.' },
  { id:'merch',    name:'Merch',              image:'https://images.unsplash.com/photo-1481833761820-0509d3217039?w=800&q=70&auto=format&fit=crop', description:'Căni, tricouri și tote bags Renée.' },
  { id:'cadouri',  name:'Cadouri',            image:'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=70&auto=format&fit=crop', description:'Seturi cadou și gift cards.' }
];

window.RENEE_PRODUCTS = [
  /* ---------- CAFEA (5, cu variații gramaj) ---------- */
  {
    id:'cafea-house-blend', name:'House Blend', category:'cafea',
    price:180, onSale:false, salePrice:null,
    images:['https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=900&q=70&auto=format&fit=crop'],
    shortDesc:'Amestec echilibrat, note de ciocolată și caramel.',
    description:'Cafeaua noastră de casă, un amestec echilibrat 100% arabica, prăjit pentru un espresso rotund cu note dulci de ciocolată și caramel.',
    variations:{ label:'Gramaj', options:[
      {name:'250g', price:180},{name:'500g', price:320},{name:'1kg', price:600}
    ]},
    stock:'instock', featured:true
  },
  {
    id:'cafea-etiopia-single-origin', name:'Etiopia Single Origin', category:'cafea',
    price:220, onSale:false, salePrice:null,
    images:['https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=900&q=70&auto=format&fit=crop'],
    shortDesc:'Note florale și de fructe de pădure.',
    description:'Boabe single origin din Etiopia, prăjire deschisă, ideale pentru filtru — note florale, de bergamotă și fructe de pădure.',
    variations:{ label:'Gramaj', options:[
      {name:'250g', price:220},{name:'500g', price:400}
    ]},
    stock:'instock', featured:false
  },
  {
    id:'cafea-decaf', name:'Decaf Colombia', category:'cafea',
    price:200, onSale:false, salePrice:null,
    images:['https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=900&q=70&auto=format&fit=crop'],
    shortDesc:'Fără cofeină, aromă păstrată intactă.',
    description:'Cafea decofeinizată prin procedeu natural cu apă, din Colombia — aceeași aromă bogată, fără cofeină.',
    variations:{ label:'Gramaj', options:[
      {name:'250g', price:200},{name:'500g', price:360}
    ]},
    stock:'instock', featured:false
  },
  {
    id:'cafea-espresso-dark', name:'Espresso Dark Roast', category:'cafea',
    price:190, onSale:true, salePrice:160,
    images:['https://images.unsplash.com/photo-1518057111178-44a106bad636?w=900&q=70&auto=format&fit=crop'],
    shortDesc:'Prăjire intensă, corp plin, note de alune.',
    description:'Amestec pentru espresso cu prăjire intensă — corp plin, note de alune prăjite și un final lung, ușor amărui.',
    variations:{ label:'Gramaj', options:[
      {name:'250g', price:160},{name:'500g', price:290},{name:'1kg', price:550}
    ]},
    stock:'instock', featured:false
  },
  {
    id:'cafea-boabe-brazilia', name:'Brazilia Cerrado', category:'cafea',
    price:170, onSale:false, salePrice:null,
    images:['https://images.unsplash.com/photo-1524350876685-274059332603?w=900&q=70&auto=format&fit=crop'],
    shortDesc:'Dulce, nucă, echilibrat — ideal zilnic.',
    description:'Cafea de zi cu zi, dulceață naturală, note de nucă și ciocolată cu lapte, prăjire medie.',
    variations:{ label:'Gramaj', options:[
      {name:'250g', price:170},{name:'500g', price:300}
    ]},
    stock:'instock', featured:false
  },

  /* ---------- DULCIURI & PATISERIE (5, fără variații) ---------- */
  {
    id:'dulce-croissant-unt', name:'Croissant de unt', category:'dulciuri',
    price:45, onSale:false, salePrice:null,
    images:['https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=900&q=70&auto=format&fit=crop'],
    shortDesc:'Foietaj franțuzesc, crocant la exterior.',
    description:'Croissant clasic din foietaj cu unt, copt zilnic — crocant la exterior, pufos în interior.',
    variations:null, stock:'instock', featured:true
  },
  {
    id:'dulce-cheesecake', name:'Cheesecake New York', category:'dulciuri',
    price:65, onSale:false, salePrice:null,
    images:['https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=900&q=70&auto=format&fit=crop'],
    shortDesc:'Cremos, blat de biscuiți, topping fructe.',
    description:'Cheesecake clasic în stil New York, cremos, cu blat de biscuiți și topping de fructe de sezon.',
    variations:null, stock:'instock', featured:false
  },
  {
    id:'dulce-tarta-lamaie', name:'Tartă de lămâie', category:'dulciuri',
    price:58, onSale:true, salePrice:48,
    images:['https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=900&q=70&auto=format&fit=crop'],
    shortDesc:'Cremă acrișoară, bezea flambată.',
    description:'Tartă cu cremă de lămâie acrișoară pe bază de unt, finisată cu bezea ușor flambată.',
    variations:null, stock:'instock', featured:false
  },
  {
    id:'dulce-brioșă-cinnamon', name:'Brioșă Cinnamon Roll', category:'dulciuri',
    price:52, onSale:false, salePrice:null,
    images:['https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=900&q=70&auto=format&fit=crop'],
    shortDesc:'Aluat pufos cu scorțișoară și glazură.',
    description:'Rulou pufos cu scorțișoară, glazurat cu cream cheese frosting — servit cald.',
    variations:null, stock:'instock', featured:false
  },
  {
    id:'dulce-macarons-set', name:'Set 6 Macarons', category:'dulciuri',
    price:96, onSale:false, salePrice:null,
    images:['https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=900&q=70&auto=format&fit=crop'],
    shortDesc:'Șase arome asortate, făcute în casă.',
    description:'Set de 6 macarons cu arome asortate — vanilie, zmeură, pistachio, ciocolată, caramel sărat, lămâie.',
    variations:null, stock:'instock', featured:false
  },

  /* ---------- BRUNCH BOX (4, fără variații) ---------- */
  {
    id:'brunch-box-clasic', name:'Brunch Box Clasic', category:'brunch',
    price:250, onSale:false, salePrice:null,
    images:['https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=900&q=70&auto=format&fit=crop'],
    shortDesc:'Ouă, pâine caldă, avocado, cafea.',
    description:'Cutie completă de brunch pentru acasă: ouă poșate, pâine cu maia caldă, avocado, brânzeturi și o cafea filtru la alegere.',
    variations:null, stock:'instock', featured:true
  },
  {
    id:'brunch-box-pancakes', name:'Brunch Box Pancakes', category:'brunch',
    price:190, onSale:false, salePrice:null,
    images:['https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=900&q=70&auto=format&fit=crop'],
    shortDesc:'Pancakes pufoase, sirop, fructe proaspete.',
    description:'Set de pancakes pufoase cu sirop de arțar, fructe de sezon și mascarpone, ambalate pentru livrare.',
    variations:null, stock:'instock', featured:false
  },
  {
    id:'brunch-box-vegan', name:'Brunch Box Vegan', category:'brunch',
    price:230, onSale:false, salePrice:null,
    images:['https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=900&q=70&auto=format&fit=crop'],
    shortDesc:'Tofu scramble, avocado, legume la grill.',
    description:'Variantă 100% vegetală: tofu scramble, avocado, legume la grătar și pâine cu maia.',
    variations:null, stock:'instock', featured:false
  },
  {
    id:'brunch-box-familie', name:'Brunch Box Familie (4 pers.)', category:'brunch',
    price:520, onSale:true, salePrice:460,
    images:['https://images.unsplash.com/photo-1525351484163-7529414344d8?w=900&q=70&auto=format&fit=crop'],
    shortDesc:'Set generos pentru 4 persoane.',
    description:'Cutie mare pentru familie/grup: mix de eggs benedict, pancakes, avocado toast și patiserie, suficient pentru 4 persoane.',
    variations:null, stock:'instock', featured:false
  },

  /* ---------- MERCH (5) ---------- */
  {
    id:'merch-cana-ceramica', name:'Cană ceramică Renée', category:'merch',
    price:120, onSale:false, salePrice:null,
    images:['https://images.unsplash.com/photo-1571167530149-c72f2b5d2b0a?w=900&q=70&auto=format&fit=crop'],
    shortDesc:'Ceramică artizanală, 300ml.',
    description:'Cană din ceramică artizanală cu logo Renée, capacitate 300ml, potrivită pentru filtru sau flat white.',
    variations:null, stock:'instock', featured:false
  },
  {
    id:'merch-tricou-logo', name:'Tricou Renée Logo', category:'merch',
    price:180, onSale:false, salePrice:null,
    images:['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=70&auto=format&fit=crop'],
    shortDesc:'Bumbac 100%, unisex.',
    description:'Tricou din bumbac 100%, croială unisex, cu logo-ul Renée brodat pe piept.',
    variations:{ label:'Mărime', options:[
      {name:'S', price:180},{name:'M', price:180},{name:'L', price:180},{name:'XL', price:190}
    ]},
    stock:'instock', featured:true
  },
  {
    id:'merch-tote-bag', name:'Tote Bag Renée', category:'merch',
    price:110, onSale:false, salePrice:null,
    images:['https://images.unsplash.com/photo-1544816155-12df9643f363?w=900&q=70&auto=format&fit=crop'],
    shortDesc:'Pânză groasă, print renaissance.',
    description:'Sacoșă tote din pânză groasă de bumbac, cu print inspirat din identitatea Renée.',
    variations:null, stock:'instock', featured:false
  },
  {
    id:'merch-hanorac', name:'Hanorac Renée', category:'merch',
    price:340, onSale:false, salePrice:null,
    images:['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=900&q=70&auto=format&fit=crop'],
    shortDesc:'Fleece gros, broderie discretă.',
    description:'Hanorac din fleece gros, broderie discretă cu logo-ul Renée pe piept.',
    variations:{ label:'Mărime', options:[
      {name:'S', price:340},{name:'M', price:340},{name:'L', price:340},{name:'XL', price:350}
    ]},
    stock:'instock', featured:false
  },
  {
    id:'merch-pahar-calator', name:'Pahar călător termic', category:'merch',
    price:150, onSale:false, salePrice:null,
    images:['https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=900&q=70&auto=format&fit=crop'],
    shortDesc:'Oțel inoxidabil, 400ml, izolație dublă.',
    description:'Pahar termic din oțel inoxidabil cu izolație dublă, păstrează cafeaua caldă până la 4 ore.',
    variations:null, stock:'instock', featured:false
  },

  /* ---------- CADOURI (4) ---------- */
  {
    id:'cadou-set-cafea-degustare', name:'Set degustare cafea (3x250g)', category:'cadouri',
    price:480, onSale:false, salePrice:null,
    images:['https://images.unsplash.com/photo-1442550528053-c431ecb55509?w=900&q=70&auto=format&fit=crop'],
    shortDesc:'Trei origini diferite, cutie cadou.',
    description:'Set cadou cu trei pachete de 250g din origini diferite, ambalate elegant într-o cutie Renée.',
    variations:null, stock:'instock', featured:true
  },
  {
    id:'cadou-gift-card-200', name:'Gift Card 200 lei', category:'cadouri',
    price:200, onSale:false, salePrice:null,
    images:['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=900&q=70&auto=format&fit=crop'],
    shortDesc:'Valabil în ambele locații Renée.',
    description:'Card cadou electronic în valoare de 200 lei, valabil la ambele locații Renée.',
    variations:null, stock:'instock', featured:false
  },
  {
    id:'cadou-gift-card-500', name:'Gift Card 500 lei', category:'cadouri',
    price:500, onSale:false, salePrice:null,
    images:['https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=900&q=70&auto=format&fit=crop'],
    shortDesc:'Valabil în ambele locații Renée.',
    description:'Card cadou electronic în valoare de 500 lei, valabil la ambele locații Renée.',
    variations:null, stock:'instock', featured:false
  },
  {
    id:'cadou-set-brunch-dulciuri', name:'Set Cadou Brunch & Dulciuri', category:'cadouri',
    price:260, onSale:true, salePrice:220,
    images:['https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=900&q=70&auto=format&fit=crop'],
    shortDesc:'Cafea, macarons și o cană — cutie cadou.',
    description:'Combinație de cadou: o pungă de cafea 250g, un set de macarons și o cană ceramică Renée, în cutie cadou.',
    variations:null, stock:'instock', featured:false
  }
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

/* ============================================================
   DRAFT: rating, recenzii și bestseller (demonstrativ).
   WP: → recenzii reale WooCommerce / plugin (Loox/Judge.me).
   ============================================================ */
(function(){
  function hash(s){ var h=0; for (var i=0;i<s.length;i++){ h=(h*31 + s.charCodeAt(i))>>>0; } return h; }
  window.RENEE_PRODUCTS.forEach(function(p){
    var h = hash(p.id);
    p.rating = +(4.3 + (h % 7) / 10).toFixed(1);   /* 4.3 – 4.9 */
    p.reviewCount = 8 + (h % 120);                  /* 8 – 127 */
    p.bestseller = p.featured || (h % 4 === 0);     /* subset de bestsellers */
  });

  /* recenzii demonstrative (DRAFT) — la WP vin reale, per produs */
  window.RENEE_REVIEWS = [
    { name:'Ana M.', rating:5, date:'iunie 2026', text:'Cea mai bună cafea comandată online în Chișinău. Prospețimea se simte de la prima ceașcă.' },
    { name:'Victor P.', rating:5, date:'mai 2026', text:'Livrare rapidă, ambalaj superb. A devenit comanda mea lunară.' },
    { name:'Diana C.', rating:4, date:'mai 2026', text:'Foarte bună, aromată. Mi-aș fi dorit doar un gramaj mai mare disponibil.' },
    { name:'Sergiu R.', rating:5, date:'aprilie 2026', text:'Calitate de specialty adevărată. Recomand cu drag pentru cadou.' },
    { name:'Elena T.', rating:5, date:'aprilie 2026', text:'Gust curat, echilibrat. Se simte că e prăjită proaspăt.' },
    { name:'Mihai B.', rating:4, date:'martie 2026', text:'Produs de calitate, exact ca în descriere. Voi reveni.' }
  ];

  /* întoarce 2–3 recenzii demonstrative pentru un produs (rotire deterministă) */
  window.getReviewsFor = function(p){
    var revs = window.RENEE_REVIEWS, out = [], n = revs.length;
    var start = hash(p.id) % n;
    var count = 2 + (hash(p.id) % 2); /* 2 sau 3 */
    for (var i=0;i<count;i++){ out.push(revs[(start+i) % n]); }
    return out;
  };

  window.getBestsellers = function(){
    return window.RENEE_PRODUCTS.filter(function(p){ return p.bestseller; });
  };
})();
