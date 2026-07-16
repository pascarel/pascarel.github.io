# Ghid migrare WordPress / WooCommerce — Renée

Acest document descrie cum se transformă site-ul static (prezentare + magazin demonstrativ) din acest repo într-un site WordPress + WooCommerce funcțional. E complementar `README.md` (secțiunea 5, prezentare generală) — aici e detaliul tehnic pagină cu pagină și model de date.

Context: site-ul actual e 100% front-end (HTML/CSS/JS vanilla, fără build), fără backend. Coșul, checkout-ul și plata sunt **simulate** prin `localStorage`/`sessionStorage`. Nimic din ce urmează nu există încă pe server — totul e de construit la migrare.

---

## 1. Tabel de mapare — pagină statică → WordPress/Woo

| Fișier static | Devine în WP | Tip |
|---|---|---|
| `index.html` | `front-page.php` (temă) | Template |
| `magazin.html` | Arhivă Woo `shop` (`archive-product.php` sau `page-magazin.php` cu shortcode `[products]`) | Template/CPT listing |
| `produs.html` | `single-product.php` (Woo) | Template CPT `product` |
| `cos.html` | Pagină Woo „Coș” (`[woocommerce_cart]`) | Pagină + shortcode nativ |
| `checkout.html` | Pagină Woo „Finalizare comandă” (`[woocommerce_checkout]`) | Pagină + shortcode nativ |
| `comanda-confirmata.html` | Pagină Woo „Mulțumim” (`order-received` — automată în Woo) | Template Woo nativ |
| `despre.html` | Pagină simplă (`page-despre.php` sau builder) | Pagină + ACF |
| `contact.html` | Pagină simplă + formular AJAX | Pagină + ACF + handler |
| `evenimente.html` | Pagină simplă | Pagină + ACF |
| `blog.html` | Arhivă `post` (`home.php`/`index.php` sau pagină cu shortcode) | Template nativ WP |
| `articol.html` | `single.php` | Template nativ WP |
| `PARTIALS.md` (header/footer) | `header.php` + `footer.php` | Template părți temă |
| `data/products.js` | CPT `product` + `product_cat` (populate din import CSV/manual) | Date Woo |
| `js/cart.js` | `WC()->cart` (sesiune server) | Nativ Woo |
| `js/checkout.js` | `WC_Checkout` + gateway-uri | Nativ Woo + plugin gateway |
| `js/shop.js` (render grid/filtre/detaliu) | Template-uri Woo native (`content-product.php`, `single-product.php`) + `WP_Query`/`WC_Product_Query` | Nativ Woo |
| `js/contact.js` | Handler `wp_ajax_*` + nonce (sau CF7/plugin formular) | PHP |

---

## 2. Pagini noi — ce devin în WP, ce câmpuri ACF

### `magazin.html`
- **WP**: pagina de shop Woo standard (`archive-product.php`), sau pagină custom cu shortcode `[products limit="..." columns="..."]` dacă vrem control total pe layout (grid + filtre categorii identice cu design-ul actual).
- Filtrele de categorie (`.cat-filters`) → shortcode `[product_categories]` custom sau widget „Filter Products by Category” (Woo Blocks), stilizat cu clasele existente din `css/shop.css`.
- **ACF**: nu e nevoie de câmpuri custom — Woo gestionează produsele/categoriile nativ. Eventual un câmp „Hero magazin” (titlu + subtitlu) pe pagina de opțiuni, pentru `.shop-hero`.

### `produs.html`
- **WP**: `single-product.php` (temă Woo standard sau override). Galeria, prețul, variațiile, stepper cantitate, „Adaugă în coș” — toate native Woo (`woocommerce_product_gallery`, `woocommerce_template_single_add_to_cart`).
- Variațiile (`variations.label`/`options`) → **atribute produs** (`pa_gramaj`, `pa_marime`) + **Variable product** cu variații per combinație.
- „Produse similare” (`#relatedGrid`) → `woocommerce_related_products()` (nativ, bazat pe categorie).
- Nu sunt necesare câmpuri ACF — tot ce e în `data/products.js` mapează pe câmpuri native Woo (vezi secțiunea 3).

### `cos.html`
- **WP**: pagina „Coș” din Woo, shortcode `[woocommerce_cart]` sau blocul „Cart” (Woo Blocks). Stilizare custom peste markup-ul Woo cu `css/shop.css` adaptat la clasele Woo (`.woocommerce-cart-form`, etc.) sau prin template override `cart/cart.php`.
- Empty state, stepper cantitate, ștergere linie, sumar cu livrare — toate native Woo.

### `checkout.html`
- **WP**: pagina „Finalizare comandă”, shortcode `[woocommerce_checkout]` sau blocul „Checkout”. Câmpurile de contact/adresă → `WC()->customer` + `billing_*`/`shipping_*` fields native.
- Radio „metodă livrare” (delivery/pickup) → **Shipping Methods** per zonă (vezi secțiunea 5) + eventual „Local Pickup” ca metodă separată.
- Radio „metodă plată” → **Payment Gateways** (vezi secțiunea 6).
- Validare + mesaje de eroare → native Woo (`woocommerce_checkout_process` + `wc_add_notice`).
- **ACF**: nu e necesar — totul e nativ Woo. Eventual un câmp text pentru nota „plata card online e simulată” dacă rămâne în staging.

### `comanda-confirmata.html`
- **WP**: pagina Woo `order-received` (automată, generată de Woo la finalizarea comenzii reale). Recap-ul comenzii (`#orderRecap`) → `woocommerce_order_details_table()` nativ, plus `WC_Order::get_order_number()`.

### `despre.html`
- **WP**: pagină statică (`page-despre.php` sau block editor).
- **ACF** (Pagină de opțiuni sau câmpuri pe pagină):
  - `hero_titlu`, `hero_text` (text)
  - `poveste_repeater` (repeater: titlu capitol + text) — reia structura din `#poveste` de pe home
  - `valori_repeater` (repeater: icon/titlu/text)
  - `locatii_repeater` (repeater, 2 rânduri): `nume`, `adresa`, `program`, `telefon`, `harta_embed` sau `harta_lat_lng`
  - `galerie` (gallery field)

### `contact.html`
- **WP**: pagină statică + formular.
- **ACF**: aceleași câmpuri `locatii_repeater` ca la Despre (idealmente field group partajat sau ACF Options Page comună, pentru a nu duplica datele celor 2 locații în 2 locuri).
- Formularul de contact (nume/email/mesaj) → handler `wp_ajax_renee_contact` + `wp_ajax_nopriv_renee_contact`, cu `wp_verify_nonce`, `sanitize_text_field`/`sanitize_email`, trimitere prin `wp_mail()`. Alternativ: Contact Form 7 (plugin deja folosit în alte proiecte ale acestui workspace) dacă se preferă zero cod custom.
- Cele 2 hărți Google iframe → rămân iframe (fără cheie API), URL generat din `locatii_repeater.adresa`.

### `evenimente.html`
- **WP**: pagină statică.
- **ACF**: `tipuri_evenimente_repeater` (titlu/descriere/imagine), `servicii_repeater`, `galerie` (gallery field), `cta_telefon`.

### `blog.html` / `articol.html`
- **WP**: nativ — `post` type existent în WordPress. `blog.html` → arhivă posturi (`home.php` sau pagină cu `[latest_posts]`), `articol.html` → `single.php`.
- Categoriile vizuale de pe `blog.html` → taxonomia nativă `category`.
- „Articole conexe” → `WP_Query` cu `category__in` (exclude postul curent), nativ, fără ACF.
- **ACF**: opțional `articol_meta` (timp citire) dacă nu se calculează automat din conținut.

### Header/footer (`PARTIALS.md`)
- **WP**: `header.php` (`wp_nav_menu()` pentru `<nav id="nav">`, cu meniul definit din Admin → Meniuri) + `footer.php` (`wp_nav_menu()` pentru `.footer-nav`).
- Badge coș (`#cartCount`) → `WC()->cart->get_cart_contents_count()`, actualizat live prin fragmentele Woo (`woocommerce_add_to_cart_fragments`, AJAX nativ — nu mai e nevoie de `Cart.updateBadge()` custom).
- Linkurile sociale (Instagram/Facebook/TikTok) → câmpuri ACF pe Theme Options (deja plănuit în README pentru site-ul original).

---

## 3. Modelul de date produs — `data/products.js` → CPT `product` + `product_cat`

Fiecare obiect din `window.RENEE_PRODUCTS` (vezi `data/products.js`) mapează câmp cu câmp pe Woo:

| Câmp static | Echivalent Woo |
|---|---|
| `id` (ex. `cafea-house-blend`) | `post_name` (slug) al CPT `product`, sau SKU (`_sku`) |
| `name` | `post_title` |
| `category` (ex. `cafea`) | Termen din taxonomia `product_cat` (mapează 1:1 pe `window.RENEE_CATEGORIES`) |
| `price` | `_regular_price` (meta nativ Woo) |
| `onSale` / `salePrice` | `_sale_price` setat + Woo calculează automat `onSale` (nu mai e flag manual) |
| `images` (array URL-uri) | Galerie produs: `_thumbnail_id` (prima imagine) + `_product_image_gallery` (restul) — importate în Media Library, nu hotlink Unsplash |
| `shortDesc` | `post_excerpt` |
| `description` | `post_content` |
| `variations.label` (ex. „Gramaj”, „Mărime”) | Nume atribut produs (`pa_gramaj`, `pa_marime`), creat în Produse → Atribute |
| `variations.options[]` (`name` + `price`) | Termeni ai atributului (`250g`, `500g`, `1kg`...) + câte o **variație** (`product_variation`) per combinație, fiecare cu propriul `_regular_price` |
| `stock` (`'instock'`) | `_stock_status` (meta nativ Woo — valorile coincid: `instock`/`outofstock`/`onbackorder`) |
| `featured` | Flag nativ Woo `_featured` (checkbox „Produs recomandat” în editor) — folosit deja de `getFeatured()` |
| `rating` / `reviewCount` | **Calculate de Woo** din recenzii reale (`_wc_average_rating`, `_wc_review_count`) — NU se mai stochează manual. Acum sunt draft, generate determinist în `data/products.js` (blocul de la final) |
| `bestseller` | Nu are câmp nativ direct. La Woo: fie flag manual (`_featured` sau un câmp ACF `bestseller`), fie **calculat** din vânzări reale (`_wc_average_rating` + `total_sales` meta, ex. „top N după `total_sales`”). Folosit de `getBestsellers()` pentru strip-ul de pe home |

`window.RENEE_REVIEWS` + `window.getReviewsFor(p)` (recenzii demonstrative din finalul `data/products.js`) → **recenzii native WooCommerce** (comentarii pe CPT `product`, cu rating) sau plugin de recenzii cu poze/UGC (Judge.me, Loox, Yotpo). La migrare, blocul `RENEE_REVIEWS`/`getReviewsFor` dispare complet.

`window.RENEE_CATEGORIES` (`id`, `name`, `image`, `description`) → termenii taxonomiei `product_cat`, cu `image` ca imagine de categorie (`thumbnail_id` meta Woo) și `description` ca descriere termen nativă.

**Import**: la migrare, catalogul din `data/products.js` (25 produse, 5 categorii) se importă printr-un script one-off (WP-CLI `wp wc product create` sau import CSV Woo) direct din acest fișier JS, nu manual — păstrează `id`-urile ca slug-uri pentru continuitate URL.

---

## 4. Coșul — `cart.js` (localStorage) → sesiune Woo

`js/cart.js` implementează `window.Cart` cu `add`/`remove`/`setQty`/`clear`/`subtotal`/`shipping`/`total`, persistat în `localStorage` sub cheia `renee_cart_v1`, plus `onChange` listeners și `updateBadge()` care scrie direct în `#cartCount`.

La migrare, tot acest modul devine **inutil** — e înlocuit integral de coșul nativ Woo:

- `Cart.add(item)` → `WC()->cart->add_to_cart( $product_id, $qty, $variation_id, $variation_attributes )`
- `Cart.setQty` / `Cart.remove` → `WC()->cart->set_quantity()` / `WC()->cart->remove_cart_item()`
- `Cart.clear()` → `WC()->cart->empty_cart()` (apelat automat de Woo după `checkout` reușit — comportament identic cu `Cart.clear()` din `checkout.js` linia care rulează după `sessionStorage.setItem`)
- `Cart.subtotal()` / `Cart.shipping()` / `Cart.total()` → `WC()->cart->get_subtotal()`, `get_shipping_total()`, `get_total()`
- Persistența nu mai e `localStorage` (client) ci **sesiune server** (`WC_Session_Handler`, cookie + tabel `woocommerce_sessions`), valabilă și pentru utilizatori neautentificați.
- Badge-ul `#cartCount` nu se mai actualizează manual prin JS custom — Woo are deja mecanismul de „cart fragments” (AJAX) care re-randează orice element cu clasa potrivită după fiecare `add_to_cart`.

---

## 5. Logica de livrare → Woo Shipping Zones

Regula actuală, hardcodată în `Cart.shipping(method)` (`js/cart.js` linia `shipping: function`) și reflectată în `js/checkout.js` (`renderSummary`):

```
metoda === 'pickup' ? 0 : (subtotal >= 500 ? 0 : 40)
```

Migrare pe **WooCommerce → Setări → Livrare → Zone de livrare**:

1. **Zonă „Chișinău”** (sau întreaga țară, dacă nu se limitează geografic):
   - Metodă „Livrare cu tarif fix” (`Flat rate`) — cost `40` lei.
   - Metodă „Livrare gratuită” (`Free shipping`) — condiție „Sumă minimă de comandă” = `500` lei. Woo afișează automat metoda gratuită când e eligibilă și o ascunde pe cea cu tarif fix (sau le arată pe ambele, configurabil).
2. **Local pickup** — metoda nativă Woo „Ridicare locală” (`Local pickup`, cost `0`), cu cele 2 locații (Oasis Mall + a doua adresă) ca opțiuni în câmpul de locație a metodei (Woo 8+ suportă multiple locații de pickup nativ) sau ca select custom dacă versiunea Woo nu suportă asta.

Radio-ul `[name=livrare]` din `checkout.html` (delivery/pickup) devine automat cele 2-3 metode de livrare afișate de Woo la checkout — nu mai e nevoie de logica JS din `updateLivrareUI()`.

---

## 6. Metode de plată → gateway-uri

Radio `[name=plata]` din `js/checkout.js` (`PAY_DEFAULT`/`PAY_PICKUP`) definește 4 opțiuni text, toate simulate (niciuna nu procesează bani real — submit-ul face doar `setTimeout` + salvare în `sessionStorage`):

| Opțiune UI actuală | Gateway Woo la migrare |
|---|---|
| „Card online” | **Plugin gateway real: maib sau paynet** (procesatorii locali din Moldova). Necesită plugin WooCommerce Payment Gateway dedicat (ex. extensie oficială maib/paynet dacă există, sau integrare custom via API-ul lor + `WC_Payment_Gateway`). **AICI intră integrarea reală** — restul (COD, pickup) nu necesită gateway extern. |
| „Card la curier” | Gateway nativ Woo „Cash on Delivery” (COD), etichetat/configurat ca „plată card la livrare” — Woo COD nu diferențiază card/cash, e doar text descriptiv în admin |
| „Cash la curier” | Același gateway COD, variantă „cash” |
| „Plată la ridicare” (afișată doar la pickup) | COD, restricționat prin `Available for methods` → doar „Local pickup” (setare nativă a gateway-ului COD) |

**Important**: momentan (`checkout.js`) **nu există niciun gateway real** — orice „metodă de plată” selectată duce la același flux simulat (`setTimeout` 1200ms → `comanda-confirmata.html`). La migrare, doar „Card online” necesită muncă reală de integrare (cont comerciant maib/paynet, chei API, webhook de confirmare plată); COD și pickup sunt configurare, nu dezvoltare.

---

## 7. Formularele → `wp_ajax_*` + nonce

| Formular static | Handler la migrare |
|---|---|
| Rezervare (modal, pe `index.html`, în `js/main.js`) | `wp_ajax_renee_rezervare` / `wp_ajax_nopriv_renee_rezervare`, nonce (`wp_verify_nonce`), sanitizare (`sanitize_text_field`), notificare `wp_mail()` sau salvare CPT `rezervare` |
| Contact (`contact.html`, `js/contact.js`) | `wp_ajax_renee_contact` / `wp_ajax_nopriv_renee_contact`, aceeași rețetă (nonce + sanitizare + `wp_mail()`), sau plugin gata făcut (Contact Form 7 — deja instalat pe alte proiecte din acest workspace) dacă se preferă zero cod custom |
| Checkout (`checkout.html`, `js/checkout.js`) | Nu mai e formular custom — devine `[woocommerce_checkout]` nativ, validarea + submit-ul sunt gestionate integral de Woo (`woocommerce_checkout_process`, `woocommerce_checkout_order_processed`) |

Toate handler-ele AJAX trebuie să folosească `wp_create_nonce()`/`check_ajax_referer()` pentru protecție CSRF — niciunul dintre formularele statice actuale nu are echivalent server-side, deci totul e de scris de la zero (cu excepția checkout-ului, care e nativ Woo).

---

## 8. IMPORTANT — Hardening: escaping HTML la migrare

Tot randarea de conținut dinamic în `js/shop.js` (grid produse, pagină produs, coș, sumar checkout) se face prin **`innerHTML` fără escaping**, ex.:

```js
// js/shop.js — renderGrid, renderProductDetail, renderCart
el.innerHTML = html; // html concatenat cu it.name, p.name etc. neescapate
```

și în `js/checkout.js` (`renderSummary`):

```js
html += '<div class="os-line"><span class="os-name">' + it.name + ...
```

**Acum e acceptabil** — toate datele (`name`, `shortDesc`, `description`) vin din `data/products.js`, un fișier controlat integral de developer, nu din input utilizator sau CMS. Nu există vector XSS în starea actuală.

**La migrare, acest lucru devine un risc real** dacă:
- numele/descrierea produselor sunt editabile din admin WP de utilizatori ne-de-încredere,
- sau dacă orice text ajunge să fie introdus prin formulare publice (contact, rezervare) și apoi randat înapoi în pagină.

**Fix obligatoriu la migrare**: orice text provenit din CMS (titlu produs, descriere, nume client în recap comandă etc.) trebuie trecut prin `esc_html()` (sau `wp_kses_post()` pentru conținut cu HTML permis) înainte de a fi randat în template-uri PHP. Woo face asta nativ în template-urile sale standard (`single-product.php`, `cart.php` etc.), deci simpla trecere la template-uri Woo native rezolvă problema — riscul apare doar dacă se păstrează randare custom via `innerHTML`/`echo` fără escaping.

---

## 9. Componente de conversie (P0/P1) → WP/Woo

Elemente adăugate pe baza cercetării de design & vânzări (Baymard, NN/g, Shopify, studii DTC coffee). Toate există acum ca UI funcțional în static; iată cum se leagă la backend real:

| Componentă (unde e acum) | La migrarea WP/Woo |
|---|---|
| **Bară USP/trust** (`index.html`, `.usp-bar` — prăjită artizanal / livrare gratuită >500 / ridicare / rating) | Zonă statică în `front-page.php` sau câmpuri ACF pe Theme Options (repeater `usp_items`: icon + text). Ratingul „4.8/5” → agregat real din recenzii Woo |
| **Bară progres livrare gratuită** (`js/shop.js` `shipBarHTML`, în coș) | Plugin „free shipping progress bar / cart goal” (ex. widget nativ Woo Blocks sau plugin dedicat) legat de pragul din **Free shipping** (secțiunea 5). Pragul (500 lei) trebuie să fie **la ~15–30% peste AOV-ul real** — de recalibrat după primele comenzi |
| **Strip „Cele mai vândute”** (`index.html` `#bestsellers`, `getBestsellers()`) | Shortcode Woo `[products best_selling="true" limit="4"]` sau `[featured_products]` — bazat pe `total_sales` real, nu pe flag draft |
| **Star ratings pe carduri + PDP** (`js/shop.js` `starsHTML`/`ratingLine`) | Native Woo — `wc_get_rating_html()` afișează stelele din recenzii reale, atât pe arhivă cât și pe `single-product.php` |
| **Secțiune recenzii pe PDP** (`js/shop.js` `reviewsHTML`) | Tab-ul nativ „Recenzii” din `single-product.php` (`woocommerce_output_product_data_tabs`) sau plugin UGC (Judge.me/Loox) pentru poze de la clienți (P2 #14) |
| **„Se cumpără des împreună” / bundle** (`js/shop.js` `bundleHTML`/`bundleItems`, -10%) | Plugin de tip „Frequently Bought Together” (ex. WPC, YITH) sau **Woo Product Bundles** pentru preț de pachet real cu discount. Logica actuală (produs + 2 complementare) devine configurabilă per produs |
| **Upsell „Completează comanda”** (`js/shop.js` `cartUpsellHTML`, în coș) | Cross-sell nativ Woo (`woocommerce_cross_sell_display()` pe pagina de coș) — produsele cross-sell se setează per produs în admin |
| **Sticky add-to-cart** (`js/shop.js` `mountStickyBar`, pe PDP) | Plugin „sticky add to cart bar” (multe gratuite pentru Woo) sau păstrat ca JS custom în temă peste butonul nativ Woo |
| **Newsletter** (`index.html` `#newsletterForm`, trimitere simulată) | Integrare reală Mailchimp / MailPoet / Klaviyo (form embed sau API + `wp_ajax_*`). Oferta „10% la prima comandă” → cupon Woo generat la abonare |
| **Sortare + paginare magazin** (`js/shop.js` `mountShop`, `sortProducts`, `renderPagination`) | Native Woo — dropdown-ul `woocommerce_catalog_ordering` (orderby: popularity/rating/date/price) + paginarea nativă `woocommerce_pagination()`. Opțiunile actuale (recomandate/popularitate/noutăți/preț/alfabetic) mapează pe `orderby` Woo |
| **Declarație nutrițională** (`js/shop.js` `productDetails`/`DRAFT_NUTRITION`, acordeoane PDP) | Câmpuri **ACF** per produs (`nutritie_repeater`: label + valoare, `ingrediente`, `alergeni`) afișate într-un tab/acordeon custom în `single-product.php`. Datele actuale sunt draft per categorie |
| **Galerie + lightbox în articol** (`articol.html`, `#postGallery`) | Galerie nativă WP (block „Gallery”) în `single.php` + lightbox nativ (WP 6.4+ are lightbox nativ pentru imagini) sau plugin |
| **Video în articol** (`articol.html`, iframe YouTube / `<video>` local) | Block nativ WP „YouTube” / „Video” — embed automat din URL sau fișier din Media Library |

---

## 10. Conținut DRAFT de înlocuit înainte de lansare

Pe lângă lista deja existentă în `README.md` (secțiunea 3, pentru landing-ul original), magazinul și paginile noi adaugă:

1. **Toate cele 25 de produse din `data/products.js`** — nume, prețuri (180 lei House Blend, 45 lei croissant, 500 lei brunch box familie etc.), descrieri, variații (gramaje/mărimi) — toate fictive/exemplu, de confirmat cu clientul.
2. **Toate imaginile de produs și categorie** — hotlink `images.unsplash.com` (ex. `photo-1559056199-641a0ac8b55e` pentru House Blend) — de înlocuit cu fotografii reale ale produselor.
3. **A doua locație — str. Ismail 33, Chișinău** — adresă complet inventată, marcată `<!-- DRAFT: adresă de confirmat -->` în `despre.html` (linia cu „Renée — str. Ismail 33, Chișinău”) și `contact.html` (adresă + iframe hartă `google.com/maps?q=strada+Ismail+33+Chisinau`). Telefonul/programul acestei a doua locații sunt de asemenea placeholder — de confirmat integral cu clientul (sau eliminat dacă locația a doua nu există real).
4. **Textele blog/articol** — toate cele 5-6 carduri din `blog.html` și conținutul complet din `articol.html` (articolul demo „specialty coffee”) sunt draft AI, marcate `<!-- DRAFT: de înlocuit -->`.
5. **Testimonialele** — deja identificate în README (draft AI, secțiunea `#testimoniale` de pe home).
6. **Video hero** — deja identificat în README (hotlink Pexels, de descărcat local).
7. **Link-uri sociale presupuse** — Facebook (`renee.brunch`) și TikTok (`@renee_brunch`), reluate identic în `PARTIALS.md`/header pe toate paginile noi — doar Instagram e confirmat.
8. **Formularul de checkout „card online”** — plata e complet simulată (`setTimeout` 1200ms, fără procesare reală); de marcat clar în staging că nicio comandă plasată prin demo nu declanșează o tranzacție reală.
9. **Recenziile de produs** — `window.RENEE_REVIEWS` + rating/reviewCount (blocul de la finalul `data/products.js`) sunt **generate determinist / demonstrative** (nume, texte, note 4.3–4.9). De înlocuit integral cu recenzii reale (native Woo sau plugin UGC). Ratingul „4.8/5 · sute de clienți” din bara USP de pe home e și el placeholder.
10. **Declarația nutrițională** — valorile din `DRAFT_NUTRITION` (`js/shop.js`, per categorie: cafea/dulciuri/brunch) + textele de ingrediente/alergeni sunt orientative, marcate DRAFT. De confirmat cu producătorul și mutat în câmpuri ACF per produs.
11. **Oferta newsletter „10% la prima comandă”** — mesaj demonstrativ; trimiterea e simulată (fără integrare email). La lansare: cupon real + integrare Mailchimp/MailPoet.
12. **Articolul demo** — feature image, video (placeholder YouTube „Big Buck Bunny” în `articol.html`, de înlocuit cu ID real sau video local) și galeria foto sunt toate draft.
13. **Prag livrare gratuită (500 lei) și tarif (40 lei)** — valori de lucru; de recalibrat pragul la ~15–30% peste AOV-ul real după primele comenzi (vezi secțiunea 9).

---

## 11. Notă finală

- Toate textele hardcodate în română din paginile noi trebuie învelite/mutate în câmpuri **ACF** + string-uri **WPML** (text domain `renee`, conform CLAUDE.md al proiectului părinte), exact ca la landing-ul original.
- **Navigare**: „Meniu” a fost **scos** din meniul principal (era doar o ancoră spre secțiunea de pe home; produsele de vânzare sunt în „Magazin”). „Despre” duce acum la **pagina** `despre.html`, nu la ancora `index.html#despre`. La `wp_nav_menu()`, meniul are itemii: Despre (pagină) · Magazin · Evenimente · Blog · Contact + Rezervări (CTA) + Coș.
- **Anchors-urile rămase** (`#meniu`, `#vizita` pe `index.html#...`) trebuie păstrate identic dacă home devine `front-page.php` — butonul „Rezervări” și secțiunea meniu de pe home le folosesc.
- `loading="lazy"` pe toate imaginile de produs/galerie și `preload="metadata"` (unde aplicabil) — de păstrat în template-urile Woo noi, la fel ca pe landing-ul original.
