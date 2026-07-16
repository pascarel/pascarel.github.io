# Renée — Site prezentare + Magazin online — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extinde landing-ul static Renée într-un site de prezentare multi-pagină cu magazin online demonstrabil (catalog, coș, checkout, livrare), fără backend, pregătit pentru migrare WP/WooCommerce.

**Architecture:** HTML/CSS/JS vanilla, fără build. Header/footer partajate (copiate manual, marcate pentru WP). Catalog în `data/products.js` cu structură ce mapează pe Woo. Coș pe `localStorage` printr-un modul `Cart` unic. Checkout cu validare custom și trimitere simulată.

**Tech Stack:** HTML5, CSS3 (custom properties existente), JavaScript vanilla ES5-compatibil (stilul existent din `main.js`), `localStorage`. Fără dependențe npm. Fonturi Google + media stock extern.

## Global Constraints

- Fără build tools, fără npm, fără framework — vanilla only, la fel ca landing-ul existent.
- JS în stilul existent din `js/main.js`: IIFE, `var`, `function(){}`, fără ES modules.
- Reutilizează tokens din `css/main.css` (`--cream #F7F2EA`, `--cream-2 #F0E8DA`, `--ink #2B2118`, `--ink-soft #5b4d3f`, `--terra #C46A45`, `--caramel #B08954`, `--sage #8A9B7C`). Fonturi: Cormorant Garamond (titluri) + Outfit (corp).
- Toate animațiile respectă `prefers-reduced-motion`.
- Conținut draft (produse, prețuri, texte, imagini Unsplash) marcat cu comentariu `<!-- DRAFT: de înlocuit -->`.
- Header/footer partajate marcate cu `<!-- WP: header.php -->` / `<!-- WP: footer.php -->`.
- Livrare: `metoda === "pickup" ? 0 : subtotal >= 500 ? 0 : 40` (lei).
- Toate paginile: `lang="ro"`, meta description, preconnect fonturi, `<link rel="stylesheet" href="css/main.css">` (+ `shop.css` unde e nevoie).
- Verificare = manuală în browser (fără test runner). Fiecare task se termină cu un pas observabil în browser prin MAMP: `http://localhost/renee-landing/<pagina>`.
- Comenzi rulate pe Mac (fără deploy — deploy-ul îl face user manual).

---

## FAZA 0 — Fundație partajată

### Task 1: Extrage header/footer partajat + navigare multi-pagină

**Files:**
- Modify: `index.html` (header `:15-31`, footer `:296-304`)
- Create: `PARTIALS.md` (snippet canonic header + footer, sursă de copy-paste pentru paginile noi)

**Interfaces:**
- Produces: markup canonic `<header id="header">` cu meniu multi-pagină + iconiță coș `<a class="cart-link" href="cos.html"><span class="cart-count" id="cartCount">0</span></a>`; `<footer>` canonic. Toate paginile noi copiază aceste blocuri.

- [ ] **Step 1: Actualizează meniul din `index.html`**

Înlocuiește `<nav id="nav">` (liniile 18-30) cu navigare multi-pagină. Linkurile care erau anchor pe home (`#despre`, `#meniu` etc.) rămân anchor DOAR pe index; pe paginile interne devin `index.html#despre`. Adaugă link coș:

```html
<nav id="nav">
  <a href="index.html#despre">Despre</a>
  <a href="index.html#meniu">Meniu</a>
  <a href="magazin.html">Magazin</a>
  <a href="evenimente.html">Evenimente</a>
  <a href="blog.html">Blog</a>
  <a href="contact.html">Contact</a>
  <a class="btn-rez" href="index.html#vizita" data-rez>Rezervări</a>
  <a class="cart-link" href="cos.html" aria-label="Coș">
    Coș <span class="cart-count" id="cartCount">0</span>
  </a>
  <div class="nav-social">
    <a href="https://www.instagram.com/renee_brunch/" target="_blank" rel="noopener">Instagram</a>
    <a href="https://www.facebook.com/renee.brunch" target="_blank" rel="noopener">Facebook</a>
    <a href="https://www.tiktok.com/@renee_brunch" target="_blank" rel="noopener">TikTok</a>
  </div>
</nav>
```

Adaugă comentariu `<!-- WP: header.php -->` deasupra `<header>` și `<!-- /WP: header.php -->` sub el; la fel pentru footer.

- [ ] **Step 2: Adaugă „Despre” în footer + link magazin**

În footer (`:297-303`) adaugă un rând de linkuri de navigare rapidă înainte de `footer-inner`:

```html
<nav class="footer-nav">
  <a href="index.html">Acasă</a>
  <a href="magazin.html">Magazin</a>
  <a href="contact.html">Contact</a>
  <a href="blog.html">Blog</a>
</nav>
```

- [ ] **Step 3: Creează `PARTIALS.md`**

Scrie în `PARTIALS.md` blocul complet header (de la `<!-- WP: header.php -->` la `<!-- /WP: header.php -->`) și footer, ca sursă unică de copiat în paginile noi. Adaugă notă: „La modificarea meniului, actualizează aici + toate paginile.”

- [ ] **Step 4: Stiluri minime coș în header**

În `css/main.css` (la finalul secțiunii header) adaugă:

```css
.cart-link{ position:relative; }
.cart-count{
  display:inline-block; min-width:18px; height:18px; padding:0 5px;
  border-radius:9px; background:var(--terra); color:#fff;
  font-family:'Outfit',sans-serif; font-size:11px; line-height:18px;
  text-align:center; vertical-align:middle;
}
.cart-count.empty{ opacity:.45; }
.footer-nav{ display:flex; gap:20px; flex-wrap:wrap; margin-bottom:18px; }
.footer-nav a{ font-family:'Outfit',sans-serif; font-size:14px; color:var(--ink-soft); }
```

- [ ] **Step 5: Verifică în browser**

Deschide `http://localhost/renee-landing/index.html`. Confirmă: meniul arată noile linkuri + „Coș 0”; footer are rândul de navigare; badge-ul coș se vede; meniul mobil (burger) încă deschide/închide corect (nu am atins `setMenu`).

- [ ] **Step 6: Commit**

```bash
cd /Users/sergiupascaru/Desktop/MY/renee-landing
git add index.html css/main.css PARTIALS.md 2>/dev/null || true
git commit -m "feat: navigare multi-pagină + iconiță coș în header/footer" 2>/dev/null || true
```

*(Notă: dacă `renee-landing` nu e repo git, sări peste commit-uri — cere user-ului să facă `git init` dacă vrea istoric.)*

---

### Task 2: Modulul Cart (`js/cart.js`) — sursă unică de adevăr

**Files:**
- Create: `js/cart.js`

**Interfaces:**
- Produces: global `window.Cart` cu:
  - `Cart.items()` → array `[{id, name, price, variation, qty, image}]`
  - `Cart.add(item)` → adaugă/incrementează (cheie = `id + "|" + variation`)
  - `Cart.setQty(id, variation, qty)` / `Cart.remove(id, variation)`
  - `Cart.clear()`
  - `Cart.count()` → nr. total bucăți
  - `Cart.subtotal()` → sumă lei
  - `Cart.shipping(method)` → `method==="pickup"?0:subtotal>=500?0:40`
  - `Cart.total(method)` → subtotal + shipping
  - `Cart.onChange(fn)` → înregistrează callback la orice mutație
  - `Cart.updateBadge()` → actualizează `#cartCount` (text + clasa `.empty`)
  - Constante: `Cart.FREE_THRESHOLD = 500`, `Cart.FLAT_FEE = 40`

- [ ] **Step 1: Scrie `js/cart.js` complet**

```javascript
/* Renée — Coș pe localStorage. WP: la migrare → WC()->cart (sesiune server). */
(function(){
  var KEY = 'renee_cart_v1';
  var listeners = [];

  function read(){
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch(e){ return []; }
  }
  function write(items){
    localStorage.setItem(KEY, JSON.stringify(items));
    for (var i=0;i<listeners.length;i++){ listeners[i](items); }
    updateBadge();
  }
  function keyOf(id, variation){ return id + '|' + (variation || ''); }

  var Cart = {
    FREE_THRESHOLD: 500,
    FLAT_FEE: 40,

    items: function(){ return read(); },

    add: function(item){
      var items = read();
      var k = keyOf(item.id, item.variation);
      for (var i=0;i<items.length;i++){
        if (keyOf(items[i].id, items[i].variation) === k){
          items[i].qty += (item.qty || 1);
          write(items); return;
        }
      }
      items.push({
        id: item.id, name: item.name, price: item.price,
        variation: item.variation || '', qty: item.qty || 1, image: item.image || ''
      });
      write(items);
    },

    setQty: function(id, variation, qty){
      var items = read(), k = keyOf(id, variation);
      for (var i=0;i<items.length;i++){
        if (keyOf(items[i].id, items[i].variation) === k){
          items[i].qty = Math.max(1, qty); break;
        }
      }
      write(items);
    },

    remove: function(id, variation){
      var items = read(), k = keyOf(id, variation), out = [];
      for (var i=0;i<items.length;i++){
        if (keyOf(items[i].id, items[i].variation) !== k) out.push(items[i]);
      }
      write(out);
    },

    clear: function(){ write([]); },

    count: function(){
      var items = read(), n = 0;
      for (var i=0;i<items.length;i++){ n += items[i].qty; }
      return n;
    },

    subtotal: function(){
      var items = read(), s = 0;
      for (var i=0;i<items.length;i++){ s += items[i].price * items[i].qty; }
      return s;
    },

    shipping: function(method){
      if (method === 'pickup') return 0;
      return this.subtotal() >= this.FREE_THRESHOLD ? 0 : this.FLAT_FEE;
    },

    total: function(method){ return this.subtotal() + this.shipping(method); },

    onChange: function(fn){ listeners.push(fn); },

    updateBadge: updateBadge
  };

  function updateBadge(){
    var el = document.getElementById('cartCount');
    if (!el) return;
    var n = Cart.count();
    el.textContent = n;
    el.className = 'cart-count' + (n === 0 ? ' empty' : '');
  }

  window.Cart = Cart;
  document.addEventListener('DOMContentLoaded', updateBadge);
})();
```

- [ ] **Step 2: Încarcă `cart.js` pe toate paginile**

În `index.html`, înainte de `</body>` (lângă `<script src="js/main.js">`), adaugă `<script src="js/cart.js"></script>` ÎNAINTE de `main.js`. (Paginile noi îl vor include la creare.)

- [ ] **Step 3: Verifică în consolă browser**

Deschide `http://localhost/renee-landing/index.html`, în DevTools Console:
```
Cart.add({id:'x', name:'Test', price:200, qty:2});
Cart.count();      // 2
Cart.subtotal();   // 400
Cart.shipping('delivery'); // 40
Cart.add({id:'y', name:'T2', price:150}); Cart.shipping('delivery'); // 0 (subtotal 550 ≥ 500)
Cart.shipping('pickup');    // 0
Cart.clear(); Cart.count(); // 0
```
Confirmă badge-ul `#cartCount` se actualizează live după fiecare comandă și devine „0” dim după `clear()`.

- [ ] **Step 4: Commit**

```bash
git add js/cart.js index.html 2>/dev/null || true
git commit -m "feat: modul Cart pe localStorage cu logică livrare" 2>/dev/null || true
```

---

### Task 3: Catalog produse (`data/products.js`)

**Files:**
- Create: `data/products.js`

**Interfaces:**
- Produces: `window.RENEE_CATEGORIES` (array `{id, name, image, description}`) și `window.RENEE_PRODUCTS` (array cu forma din spec). Helpers: `window.getProduct(id)`, `window.getProductsByCategory(catId)` (catId `"all"` → toate), `window.getFeatured()`.

- [ ] **Step 1: Scrie `data/products.js`**

Creează 5 categorii și ~20-25 produse draft. Structură exactă (exemplu — completează la 4-6/categorie în același tipar):

```javascript
/* Renée — catalog DRAFT. WP: → CPT product + product_cat. Imagini/prețuri de înlocuit. */
window.RENEE_CATEGORIES = [
  { id:'cafea',    name:'Cafea',              image:'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=70&auto=format&fit=crop', description:'Boabe proaspăt prăjite, măcinate la comandă.' },
  { id:'dulciuri', name:'Dulciuri & Patiserie', image:'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=800&q=70&auto=format&fit=crop', description:'Prăjituri și patiserie de casă.' },
  { id:'brunch',   name:'Brunch Box',         image:'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800&q=70&auto=format&fit=crop', description:'Mic dejun complet, livrat la tine.' },
  { id:'merch',    name:'Merch',              image:'https://images.unsplash.com/photo-1481833761820-0509d3217039?w=800&q=70&auto=format&fit=crop', description:'Căni, tricouri și tote bags Renée.' },
  { id:'cadouri',  name:'Cadouri',            image:'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=70&auto=format&fit=crop', description:'Seturi cadou și gift cards.' }
];

window.RENEE_PRODUCTS = [
  {
    id:'cafea-house-blend', name:'House Blend', category:'cafea',
    price:180, onSale:false, salePrice:null,
    images:['https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=900&q=70&auto=format&fit=crop'],
    shortDesc:'Amestec echilibrat, note de ciocolată și caramel.',
    description:'Cafeaua noastră de casă, un amestec echilibrat 100% arabica...',
    variations:{ label:'Gramaj', options:[
      {name:'250g', price:180},{name:'500g', price:320},{name:'1kg', price:600}
    ]},
    stock:'instock', featured:true
  }
  /* ... restul produselor în același tipar.
     - cafea: 4-6 (cu variations gramaj)
     - dulciuri: 4-6 (fără variations)
     - brunch: 3-4 (fără variations)
     - merch: 4-6 (tricou cu variations mărime S/M/L/XL; căni/tote fără)
     - cadouri: 3-4 (fără variations)
     Marchează cel puțin 4 produse featured:true, câte unul din categorii diferite.
     Pune onSale:true + salePrice pe 1-2 produse pentru a testa afișarea reducerii. */
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
```

- [ ] **Step 2: Verifică în consolă**

Deschide orice pagină cu `data/products.js` inclus (temporar în index), Console:
```
RENEE_PRODUCTS.length;          // 20-25
getProductsByCategory('cafea'); // doar cafea
getFeatured().length;           // >= 4
getProduct('cafea-house-blend').price; // 180
```

- [ ] **Step 3: Commit**

```bash
git add data/products.js 2>/dev/null || true
git commit -m "feat: catalog produse draft (structură Woo)" 2>/dev/null || true
```

---

## FAZA 1 — Magazin

### Task 4: Stiluri magazin (`css/shop.css`)

**Files:**
- Create: `css/shop.css`

**Interfaces:**
- Produces: clase folosite în Task 5-9: `.shop-hero`, `.cat-filters`/`.cat-filter`(`.active`), `.product-grid`, `.product-card`(`img`, `.pc-body`, `.pc-name`, `.pc-price`, `.pc-old`, `.pc-sale`), `.badge-sale`, `.product-detail`, `.pd-gallery`, `.pd-info`, `.qty-stepper`, `.btn-add`, `.cart-table`, `.cart-line`, `.cart-summary`, `.checkout-grid`, `.co-section`, `.field`, `.field-msg`, `.pay-options`, `.order-summary`, `.confirm-box`.

- [ ] **Step 1: Scrie `css/shop.css`**

Stiluri coerente cu tokens existente. Include cel puțin: grid produse responsive (`repeat(auto-fill,minmax(240px,1fr))`), card cu hover subtil, filtre categorii ca pills, stepper cantitate, tabel coș responsive (pe mobil → carduri stacked), layout checkout 2 coloane (`.checkout-grid` → 1fr pe mobil, `2fr 1fr` desktop cu `.order-summary` sticky), stiluri `.field-msg` (roșu, ascuns până la `.show`), butoane `.btn-add`/`.btn-primary`. Toate folosesc `var(--...)`. Respectă `@media (prefers-reduced-motion: reduce)` pentru tranziții.

*(Conținut CSS complet scris de implementator după tiparul din `main.css`; nu inventa tokens noi.)*

- [ ] **Step 2: Verifică**

Nimic vizual încă (nicio pagină nu-l include). Confirmă doar că fișierul e valid CSS (fără erori în DevTools când e inclus temporar). Commit.

```bash
git add css/shop.css 2>/dev/null || true
git commit -m "feat: stiluri magazin/coș/checkout" 2>/dev/null || true
```

---

### Task 5: `js/shop.js` — render catalog + filtre + pagină produs

**Files:**
- Create: `js/shop.js`

**Interfaces:**
- Consumes: `RENEE_PRODUCTS`, `RENEE_CATEGORIES`, `getProduct`, `getProductsByCategory`, `getFeatured`, `Cart`.
- Produces:
  - `Shop.renderGrid(containerId, catId)` — desenează carduri produs în container; card = link spre `produs.html?id=<id>`.
  - `Shop.renderFilters(containerId, onSelect)` — desenează pills categorii (+ „Toate”); apelează `onSelect(catId)` la click.
  - `Shop.renderProductDetail(containerId, id)` — galerie + info + variații select + stepper + buton „Adaugă în coș”; citește `id` din query string dacă nu e dat.
  - `Shop.money(n)` → `"180 lei"`.

- [ ] **Step 1: Scrie `js/shop.js`**

Implementează cele 4 funcții. `money(n)` → `n + ' lei'`. Card produs afișează imagine, nume, preț (cu `.pc-old`/`.pc-sale` dacă `onSale`), badge `.badge-sale` la reducere. `renderProductDetail` construiește `<select>` din `variations.options` (dacă există), actualizează prețul afișat la schimbarea variației, stepper cantitate (min 1), iar butonul „Adaugă în coș” apelează `Cart.add({id,name,price(variație),variation,qty,image})` și afișează confirmare inline „Adăugat în coș ✓”. Citește id din `location.search` cu un helper `getParam('id')`.

*(Cod complet în stilul `main.js`: IIFE, `var`, fără ES modules; expune `window.Shop`.)*

- [ ] **Step 2: Verifică** — se testează prin Task 6 & 7 (paginile care-l folosesc). Commit acum.

```bash
git add js/shop.js 2>/dev/null || true
git commit -m "feat: render catalog, filtre și pagină produs" 2>/dev/null || true
```

---

### Task 6: Pagina `magazin.html`

**Files:**
- Create: `magazin.html`

**Interfaces:**
- Consumes: header/footer din `PARTIALS.md`; `Shop.renderGrid`, `Shop.renderFilters`; `css/shop.css`.

- [ ] **Step 1: Creează `magazin.html`**

`<head>` standard (vezi Global Constraints) + `<link rel="stylesheet" href="css/shop.css">`. Body: header partajat, `<section class="shop-hero">` cu titlu „Magazin”, container filtre `<div id="shopFilters">`, container grid `<div id="shopGrid" class="product-grid">`, footer partajat. Înainte de `</body>`:
```html
<script src="data/products.js"></script>
<script src="js/cart.js"></script>
<script src="js/shop.js"></script>
<script src="js/main.js"></script>
<script>
  Shop.renderFilters('shopFilters', function(cat){ Shop.renderGrid('shopGrid', cat); });
  Shop.renderGrid('shopGrid', 'all');
</script>
```

- [ ] **Step 2: Verifică în browser**

`http://localhost/renee-landing/magazin.html`: se afișează toate produsele; click pe o categorie filtrează grila; „Toate” revine la tot; badge coș vizibil; header/footer identice cu home; responsive OK pe mobil.

- [ ] **Step 3: Commit**

```bash
git add magazin.html 2>/dev/null || true
git commit -m "feat: pagină magazin cu filtre categorii" 2>/dev/null || true
```

---

### Task 7: Pagina `produs.html`

**Files:**
- Create: `produs.html`

**Interfaces:**
- Consumes: `Shop.renderProductDetail`, `Cart`.

- [ ] **Step 1: Creează `produs.html`**

Head standard + `shop.css`. Body: header partajat, `<section class="product-detail"><div id="productDetail"></div></section>`, secțiune „Produse similare” `<div id="relatedGrid" class="product-grid"></div>`, footer. Scripturi (products, cart, shop, main) + inline:
```html
<script>
  Shop.renderProductDetail('productDetail');   // citește ?id= din URL
  var p = getProduct(new URLSearchParams(location.search).get('id'));
  if (p){ // similare din aceeași categorie, exclus produsul curent
    var sim = getProductsByCategory(p.category).filter(function(x){return x.id!==p.id;}).slice(0,3);
    // render manual sau prin Shop — desenează cardurile în #relatedGrid
  }
</script>
```
Dacă `id` lipsește/invalid → afișează mesaj „Produsul nu a fost găsit” + link spre magazin.

- [ ] **Step 2: Verifică**

Din `magazin.html` dă click pe un produs → ajunge pe `produs.html?id=...`. Confirmă: galerie, preț, select variație (unde există) schimbă prețul, stepper, „Adaugă în coș” incrementează badge-ul și arată confirmarea; produse similare apar; id invalid → mesaj corect.

- [ ] **Step 3: Commit**

```bash
git add produs.html 2>/dev/null || true
git commit -m "feat: pagină produs cu variații și adăugare în coș" 2>/dev/null || true
```

---

### Task 8: Secțiune „Produse recomandate” pe home

**Files:**
- Modify: `index.html` (inserează secțiune nouă înainte de footer)

**Interfaces:**
- Consumes: `getFeatured`, `Shop.renderGrid` (sau render inline), `products.js`, `shop.js`, `shop.css`.

- [ ] **Step 1: Adaugă scripturile + CSS shop în `index.html`**

În `<head>` adaugă `<link rel="stylesheet" href="css/shop.css">`. Înainte de `main.js` adaugă `data/products.js` și `js/shop.js`.

- [ ] **Step 2: Inserează secțiunea**

Înainte de `<footer>`:
```html
<!-- PRODUSE RECOMANDATE -->
<section class="section featured-products" id="produse">
  <div class="wrap">
    <h2 class="reveal">Din magazinul nostru</h2>
    <div id="featuredGrid" class="product-grid"></div>
    <a class="btn-primary" href="magazin.html">Vezi tot magazinul</a>
  </div>
</section>
<script>
  (function(){
    var f = getFeatured().slice(0,4);
    // render carduri în #featuredGrid (folosește Shop dacă expune un helper, altfel inline)
  })();
</script>
```

- [ ] **Step 3: Verifică**

`index.html` afișează 4 produse recomandate; click duce pe pagina produs; „Vezi tot magazinul” duce pe `magazin.html`. Restul home-ului neschimbat.

- [ ] **Step 4: Commit**

```bash
git add index.html 2>/dev/null || true
git commit -m "feat: secțiune produse recomandate pe home" 2>/dev/null || true
```

---

## FAZA 2 — Coș & Checkout

### Task 9: Pagina `cos.html`

**Files:**
- Create: `cos.html`
- Modify: `js/shop.js` (adaugă `Shop.renderCart(containerId, summaryId)`)

**Interfaces:**
- Consumes: `Cart`.
- Produces: `Shop.renderCart` — desenează liniile coșului + sumar; stepper ± apelează `Cart.setQty`, șterge apelează `Cart.remove`, re-randează la `Cart.onChange`.

- [ ] **Step 1: Adaugă `Shop.renderCart` în `js/shop.js`**

Desenează fiecare linie (thumbnail, nume, variație, preț unitar, stepper cantitate, subtotal linie, buton șterge). Sumar: subtotal, livrare (folosind `Cart.shipping('delivery')` cu notă „gratis peste 500 lei”), total. Dacă coșul e gol → empty state cu link spre magazin. Re-randează pe `Cart.onChange`.

- [ ] **Step 2: Creează `cos.html`**

Head + shop.css. Body: header, `<section class="section"><div class="wrap"><h1>Coșul tău</h1><div id="cartTable"></div><aside id="cartSummary" class="cart-summary"></aside><a href="checkout.html" class="btn-primary" id="toCheckout">Spre finalizare</a></div></section>`, footer. Scripturi + `Shop.renderCart('cartTable','cartSummary')`. Ascunde butonul „Spre finalizare” dacă coșul e gol.

- [ ] **Step 3: Verifică**

Adaugă produse din magazin, mergi la `cos.html`: liniile apar corect, ± modifică cantitatea și totalul, ștergerea elimină linia, badge-ul se sincronizează, livrarea devine 0 când subtotal ≥ 500, coș golit → empty state.

- [ ] **Step 4: Commit**

```bash
git add cos.html js/shop.js 2>/dev/null || true
git commit -m "feat: pagină coș cu cantități, ștergere și sumar livrare" 2>/dev/null || true
```

---

### Task 10: `js/checkout.js` — validare + logică livrare/plată + trimitere simulată

**Files:**
- Create: `js/checkout.js`

**Interfaces:**
- Consumes: `Cart`.
- Produces: `Checkout.init()` care leagă formularul din `checkout.html`:
  - Randează sumarul comenzii (produse + subtotal + livrare + total).
  - Radio metodă livrare `[name=livrare]` (`delivery`/`pickup`) → arată/ascunde `#adresaLivrare`, arată select locație la pickup, recalculează livrarea + totalul live.
  - Validare custom (toate câmpurile obligatorii vizibile), mesaje `.field-msg.show` sub câmp, dispar la corectare, focus pe primul câmp greșit.
  - Submit → simulează (buton „Se trimite…”, delay 1200ms) → salvează comanda în `sessionStorage.renee_last_order` (nr. comandă generat din `Cart.count()` + lungime, fără `Date.now`), `Cart.clear()`, redirect `comanda-confirmata.html`.

- [ ] **Step 1: Scrie `js/checkout.js`**

Implementează `Checkout.init`. Nr. comandă fictiv: `'RN-' + (1000 + Cart.count()*7 + Cart.subtotal()%97)` (determinist, fără `Date.now`/`Math.random` — evită surprize). Validare telefon simplă (min 6 cifre), email cu regex de bază. La pickup: ascunde adresa, câmpurile de adresă devin ne-obligatorii, opțiunea de plată „card online / card la curier / cash la curier” → înlocuită cu „plată la ridicare”. Sumar recalculat pe fiecare schimbare de metodă.

*(Cod complet în stilul `main.js`.)*

- [ ] **Step 2: Verifică** — prin Task 11. Commit acum.

```bash
git add js/checkout.js 2>/dev/null || true
git commit -m "feat: logică checkout (validare, livrare, trimitere simulată)" 2>/dev/null || true
```

---

### Task 11: Paginile `checkout.html` + `comanda-confirmata.html`

**Files:**
- Create: `checkout.html`, `comanda-confirmata.html`

**Interfaces:**
- Consumes: `Checkout.init`, `Cart`, `sessionStorage.renee_last_order`.

- [ ] **Step 1: Creează `checkout.html`**

`.checkout-grid` cu 2 coloane. Coloana stângă `.co-section`-uri:
1. Date contact: `nume`, `telefon`, `email` (fiecare cu `.field` + `.field-msg`).
2. Metodă livrare: radio `delivery`/`pickup`. `#adresaLivrare` (stradă, bloc/ap, reper). Select locație pickup (Oasis Mall / a doua locație).
3. Metodă plată: radio (card online / card la curier / cash la curier).
4. Buton „Plasează comanda”.

Coloana dreaptă: `<aside class="order-summary" id="orderSummary">` sticky. Include comentariu `<!-- DEMO: plata „card online" e simulată; WP → gateway maib/paynet -->`. Scripturi + `Checkout.init();`. Dacă coșul e gol la încărcare → redirect/mesaj spre magazin.

- [ ] **Step 2: Creează `comanda-confirmata.html`**

Head + shop.css. Body: header, `.confirm-box` cu ✓, „Mulțumim! Comanda ta a fost plasată.”, `<div id="orderRecap"></div>` (populat din `sessionStorage.renee_last_order`: nr. comandă, produse, total, metodă livrare/plată, timp estimat), CTA „Înapoi la magazin”. Footer. Dacă nu există comandă în sessionStorage → mesaj neutru + link magazin.

- [ ] **Step 3: Verifică fluxul complet**

magazin → produs → adaugă → coș → checkout: sumar corect; comută delivery/pickup (adresa apare/dispare, livrarea 40↔0, opțiuni plată se schimbă); submit gol → erori inline + focus; completat corect → „Se trimite…” → confirmare cu nr. comandă și recap; coșul se golește (badge 0). Reîncarcă `checkout.html` cu coș gol → redirect/mesaj magazin.

- [ ] **Step 4: Commit**

```bash
git add checkout.html comanda-confirmata.html 2>/dev/null || true
git commit -m "feat: checkout + pagină confirmare comandă" 2>/dev/null || true
```

---

## FAZA 3 — Pagini prezentare

### Task 12: `despre.html`

**Files:** Create: `despre.html`

- [ ] **Step 1:** Head standard. Header/footer partajate. Conținut: hero „Despre”, poveste extinsă (reia textul din secțiunea `#poveste` a home + extindere draft), valori, **cele 2 locații** (Oasis Mall real + a doua locație cu adresă inventată plauzibilă în Chișinău, marcată `<!-- DRAFT: adresă de confirmat -->`), galerie. Reutilizează clasele `.reveal`/`.parallax` din `main.js` (include `main.js`). Marchează textele draft.
- [ ] **Step 2:** Verifică `despre.html`: layout coerent, reveal/parallax funcționează, 2 locații afișate, responsive.
- [ ] **Step 3:** Commit `feat: pagină Despre cu 2 locații`.

---

### Task 13: `contact.html`

**Files:** Create: `contact.html`

- [ ] **Step 1:** Head standard. Conținut: date ambele locații (adresă, program, telefon), formular contact (nume/email/mesaj) cu validare custom în stilul rezervării + trimitere simulată (mesaj succes inline), **2 hărți Google iframe** (Oasis Mall + a doua locație — folosește embed generic pentru draft). Marchează datele draft.
- [ ] **Step 2:** Verifică: formularul validează și „trimite” simulat; hărțile se încarcă; ambele locații afișate.
- [ ] **Step 3:** Commit `feat: pagină Contact cu formular și 2 hărți`.

---

### Task 14: `evenimente.html`

**Files:** Create: `evenimente.html`

- [ ] **Step 1:** Head standard. Versiune extinsă a secțiunii `#evenimente` de pe home: tipuri de evenimente (private, corporate, aniversări — draft), servicii, galerie, CTA telefon/rezervare. Reutilizează stiluri existente + `.reveal`.
- [ ] **Step 2:** Verifică layout + responsive.
- [ ] **Step 3:** Commit `feat: pagină Evenimente`.

---

### Task 15: `blog.html` + `articol.html`

**Files:** Create: `blog.html`, `articol.html`

- [ ] **Step 1:** `blog.html` — grid de 5-6 carduri articol draft (imagine, categorie, titlu, dată, excerpt), fiecare link spre `articol.html?slug=...` (sau `articol.html` simplu pentru draft). Categorii ca filtre vizuale (opțional static).
- [ ] **Step 2:** `articol.html` — layout tipografic (titlu, meta, corp draft cu Cormorant pentru titluri), secțiune „Articole conexe” (2-3 carduri). Conținut draft marcat.
- [ ] **Step 3:** Verifică: blog listează articolele, click deschide articolul, tipografie lizibilă, responsive.
- [ ] **Step 4:** Commit `feat: blog + pagină articol`.

---

## FAZA 4 — Documentație migrare

### Task 16: Ghid migrare WP/Woo + actualizare README

**Files:**
- Create: `MIGRARE-WP.md`
- Modify: `README.md` (secțiunea 5 existentă → extinde cu magazinul)

- [ ] **Step 1: Scrie `MIGRARE-WP.md`**

Include tabelul de mapare din spec (static → WP/Woo), plus pentru fiecare pagină nouă: ce devine (CPT/template/pagină), ce câmpuri devin ACF, unde intră gateway-ul de plată (maib/paynet), cum se configurează Shipping Zones (Chișinău + free shipping ≥ 500), și lista de conținut draft de înlocuit (produse, prețuri, imagini, a doua adresă, texte blog).

- [ ] **Step 2: Actualizează `README.md`**

Adaugă la lista de pagini (secțiunea 1) noile pagini; la secțiunea „de înlocuit” adaugă produsele/prețurile/imaginile magazinului și a doua locație; extinde secțiunea 5 (migrare) cu referință la `MIGRARE-WP.md`.

- [ ] **Step 3: Verifică** — recitește ambele fișiere pentru coerență cu ce s-a construit.
- [ ] **Step 4:** Commit `docs: ghid migrare WP/Woo + README actualizat`.

---

## Note de verificare finală

- Parcurge fluxul end-to-end o dată complet în browser (home → magazin → produs → coș → checkout → confirmare).
- Verifică toate paginile pe mobil (DevTools responsive).
- Confirmă că badge-ul coș e corect pe toate paginile.
- Confirmă `prefers-reduced-motion` (setează în DevTools) oprește animațiile.
- Fără erori în Console pe nicio pagină.
