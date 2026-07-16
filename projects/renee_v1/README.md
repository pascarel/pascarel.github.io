# Renée — Site prezentare + Magazin

Site multi-pagină pentru **Renée** (cafenea & all day breakfast, Oasis Mall, Chișinău): landing de prezentare + magazin online demonstrativ (catalog, coș, checkout, livrare), fără backend.
Fără build, fără dependențe (doar fonturi Google + imagini/video externe):

- `index.html`, `magazin.html`, `produs.html`, `cos.html`, `checkout.html`, `comanda-confirmata.html`, `despre.html`, `contact.html`, `evenimente.html`, `blog.html`, `articol.html` — markup pagini
- `css/main.css` — stilurile paginii de prezentare · `css/shop.css` — stilurile magazin/coș/checkout
- `js/main.js` — JS landing (hero, reveal, parallax, testimoniale, modal rezervare) · `js/cart.js` — modul coș (`localStorage`) · `js/shop.js` — catalog, filtre, pagină produs, coș · `js/checkout.js` — validare + trimitere simulată checkout · `js/contact.js` — formular contact
- `data/products.js` — catalog produse draft (structură pregătită pentru WooCommerce)
- `PARTIALS.md` — sursă unică header/footer, copiate pe toate paginile
- `MIGRARE-WP.md` — ghid detaliat de migrare pe WordPress/WooCommerce (vezi și secțiunea 5 mai jos)

---

## 1. Structura site-ului

### `index.html` (home)

| Ordine | Secțiune | ID (anchor) | Conținut |
|---|---|---|---|
| 1 | Hero | `#top` | Video de fundal, titlu animat literă cu literă |
| 2 | Marquee | — | Bandă infinită „all day breakfast · brunch…" |
| 3 | Despre | `#despre` | Manifest + foto interior cu parallax |
| 4 | Povestea | `#poveste` | Timeline „De ce Renée?" (3 capitole) |
| 5 | Momentele zilei | `#ritual` | 3 coloane No. 01–03 cu intervale orare |
| 6 | Meniu | `#meniu` | 4 carduri cu preparate + prețuri |
| 7 | Galerie | `#galerie` | Grid asimetric 5 imagini |
| 8 | Testimoniale | `#testimoniale` | Carusel auto-rotativ (5,5s) cu dots |
| 9 | Instagram | `#instagram` | Grid 4 poze, hover overlay, link profil |
| 10 | Evenimente | `#evenimente` | Foto + listă servicii + CTA telefon |
| 11 | Produse recomandate | `#produse` | 4 produse featured din `data/products.js`, link spre magazin |
| 12 | Vizită | `#vizita` | Info (dark) + buton rezervare + hartă Google |
| 13 | Footer | — | Logo, navigare rapidă, Instagram, copyright |
| — | Modal rezervare | `#rezModal` | Popup cu formularul de rezervare; se deschide din orice element cu `data-rez` (butonul „Rezervări" din header + „Rezervă o masă" din Vizită) |

### Pagini magazin

| Pagină | Rol |
|---|---|
| `magazin.html` | Catalog complet, filtre pe categorii (pills), grid produse |
| `produs.html` | Pagină detaliu produs — galerie, variații (gramaj/mărime), stepper cantitate, „Adaugă în coș”, produse similare. Citește `?id=` din URL |
| `cos.html` | Coșul curent — linii editabile (cantitate/ștergere), sumar cu subtotal/livrare/total |
| `checkout.html` | Formular finalizare comandă — date contact, metodă livrare (curier/pickup), metodă plată, sumar sticky |
| `comanda-confirmata.html` | Confirmare comandă — recap din `sessionStorage.renee_last_order`, nr. comandă |

### Pagini prezentare

| Pagină | Rol |
|---|---|
| `despre.html` | Poveste extinsă, valori, cele 2 locații (Oasis Mall + a doua adresă DRAFT), galerie |
| `contact.html` | Date ambele locații, formular contact (validare + trimitere simulată), 2 hărți Google embed |
| `evenimente.html` | Tipuri evenimente, servicii, galerie, CTA |
| `blog.html` | Grid articole (imagine, categorie, titlu, dată, excerpt) |
| `articol.html` | Layout articol individual + „Articole conexe” |

Header/footer sunt identice pe toate paginile — sursa unică e `PARTIALS.md`.

---

## 2. Design tokens (în `:root`)

```css
--cream:   #F7F2EA   /* fundal principal */
--cream-2: #F0E8DA   /* fundal secundar (meniu, testimoniale) */
--ink:     #2B2118   /* text + secțiuni dark */
--ink-soft:#5b4d3f   /* text secundar */
--terra:   #C46A45   /* accent principal */
--caramel: #B08954   /* accent pe dark */
--sage:    #8A9B7C   /* accent rar */
```

**Fonturi (Google Fonts):** Cormorant Garamond (titluri, serif) + Outfit (corp, sans).

---

## 3. Ce trebuie înlocuit înainte de lansare (IMPORTANT)

1. **Imagini** — toate sunt stock de pe Unsplash (hotlink `images.unsplash.com`). Înlocuiește cu fotografii reale ale localului. Caută `img class="photo"` în HTML.
2. **Video hero** — stock de pe Pexels (hotlink). Pentru producție **descarcă-l local** (hotlink-ul nu e garantat pe termen lung):
   - sursa 1: `https://videos.pexels.com/video-files/6769801/6769801-hd_1920_1080_24fps.mp4`
   - fallback: `.../855391/855391-hd_1920_1080_25fps.mp4`
   - poster: imagine Unsplash (atributul `poster` de pe `<video>`)
3. **Testimonialele** — sunt fictive (draft). Înlocuiește cu recenzii reale (Google Reviews).
4. **Textele din „Povestea"** — draft scris de AI, de validat cu clientul.
5. **Prețurile din meniu** — orientative, de confirmat.
6. **Link-uri sociale** — Facebook (`renee.brunch`) și TikTok (`@renee_brunch`) sunt presupuse; doar Instagram e confirmat. Verifică/corectează în `.nav-social` și footer.
7. **Formularul de rezervare** — e doar UI (nu trimite nicăieri; JS-ul afișează doar mesajul de confirmare). Necesită backend/email la integrare.
8. **Date de contact** — program și adresă preluate de pe Instagram în iul. 2026; de reconfirmat.
9. **Produsele, prețurile și imaginile din magazin** — toate cele 25 produse din `data/products.js` (nume, prețuri, descrieri, variații gramaj/mărime) sunt draft/exemplu, de confirmat cu clientul; imaginile sunt hotlink Unsplash, de înlocuit cu fotografii reale.
10. **A doua locație (str. Ismail 33)** — adresă complet inventată, folosită în `despre.html` și `contact.html` (marcată `<!-- DRAFT: adresă de confirmat -->`); telefon, program și hartă pentru această locație sunt de asemenea placeholder — de confirmat sau eliminat dacă locația nu există real.
11. **Textele blog/articol** — cardurile din `blog.html` și conținutul din `articol.html` sunt draft AI, marcate `<!-- DRAFT: de înlocuit -->`.
12. **Checkout „plată card online”** — complet simulat (fără gateway real conectat); vezi `MIGRARE-WP.md` secțiunea 6 pentru unde intră gateway-ul real (maib/paynet).

---

## 4. Funcționalități JS (toate vanilla, în `js/main.js`)

- **Titlu hero** — split pe litere, animație `rise` cu delay progresiv
- **Marquee** — se auto-duplică până acoperă 1,2× lățimea ecranului, apoi se dublează pentru loop perfect; viteză constantă ~90px/s (durata se calculează din lățime)
- **Header** — clasa `.scrolled` peste 40px scroll (crem→blur); pe hero textul e crem, după scroll ink
- **Reveal** — `IntersectionObserver`, clasa `.reveal` + `.in`, delay-uri `.reveal-d1/2/3`
- **Parallax** — clasa `.parallax` + `data-speed` (doar dacă nu e `prefers-reduced-motion`)
- **Testimoniale** — auto-rotire 5,5s, dots clickabile, pauză la reduced-motion
- **Meniu mobil** — `setMenu()` togglează `nav.open`, `header.menu-open` (logo/buton devin ink) și `body.no-scroll` (blochează scroll-ul)
- **Modal rezervare** — deschis de `[data-rez]`, închis cu ✕ / backdrop / Escape (Escape închide întâi pickerul deschis, apoi modalul); focus revine pe elementul declanșator
- **Pickere custom** (fără librării): select persoane, calendar dată (ro, săptămâna începe luni, zilele trecute dezactivate, azi marcat) și listă ore 08:00–21:30 pas 30 min; valorile stau în `input[type=hidden]` (`persoane`, `data` ISO `YYYY-MM-DD`, `ora`); popover-ul se deschide în sus (`.drop-up`) când nu are loc sub buton
- **Formular** — validare 100% custom (fără bulele browserului): toate câmpurile obligatorii, mesaje de eroare sub câmp (`.field-msg`, dispar la corectare), focus pe primul câmp greșit. Trimiterea e **simulată** (delay 1,2s, buton „Se trimite…"): succes → `#formOk`; la orele din `DEMO_FULL_TIMES` (`12:00`, `12:30` — doar pentru demo) → `#formFull` „nu mai sunt locuri libere". La integrarea backend-ului real, răspunsul vine de la server și lista demo dispare.
- **Accesibilitate** — tot ce e animat respectă `prefers-reduced-motion` (inclusiv video-ul, care rămâne pe poster)

### Magazin (`js/cart.js`, `js/shop.js`, `js/checkout.js`)

- **Coș** (`js/cart.js`, global `window.Cart`) — persistat în `localStorage` (`renee_cart_v1`); `add`/`setQty`/`remove`/`clear`, `subtotal()`, `shipping(method)` (`pickup` → 0; altfel gratis peste 500 lei, altfel 40 lei fix), `total(method)`, `onChange(fn)` pentru re-randare live, `updateBadge()` sincronizează `#cartCount` din header pe toate paginile.
- **Catalog & pagină produs** (`js/shop.js`, global `window.Shop`) — `renderGrid`, `renderFilters`, `renderProductDetail` (variații, stepper, adăugare în coș), `renderCart` (linii + sumar pe `cos.html`), helper `money(n)`.
- **Checkout** (`js/checkout.js`, global `window.Checkout.init()`) — validare custom (nume/telefon/email/adresă sau locație pickup), comută UI livrare/plată live, submit simulat (`setTimeout` 1200ms → salvează comanda în `sessionStorage.renee_last_order`, golește coșul, redirect spre `comanda-confirmata.html`). Nr. comandă generat determinist din `Cart.count()`/`Cart.subtotal()` (fără `Date.now`/`Math.random`).
- **Notă hardening**: randarea produselor/coșului/sumarului folosește `innerHTML` fără escaping HTML — OK acum (date controlate de developer în `data/products.js`), dar la migrare pe WP, dacă textele vin din CMS/input, e nevoie de escaping (`esc_html`) — detaliat în `MIGRARE-WP.md` secțiunea 8.

---

## 5. Migrare pe WordPress (plan recomandat)

> Pentru magazin (produse, coș, checkout, livrare, plată) există un ghid dedicat, mult mai detaliat: **[`MIGRARE-WP.md`](MIGRARE-WP.md)** — tabel complet de mapare pagină → WP/Woo, model de date produs câmp cu câmp, mapare coș → `WC()->cart`, Shipping Zones, gateway-uri de plată și lista completă de conținut draft de înlocuit. Secțiunile de mai jos acoperă doar landing-ul de prezentare original.

Abordare: **temă custom minimală** (același stack ca `vindeautor-theme` — sau mai simplu, fără build, pentru că nu există dependențe).

### Varianta simplă (fără Vite)
1. Creează tema `renee-theme/` cu: `style.css` (header temă), `functions.php`, `front-page.php`, `header.php`, `footer.php`.
2. Sparge `index.html`:
   - `<head>` + header/nav → `header.php` (`wp_head()`, meniul prin `wp_nav_menu` cu walker sau hardcodat)
   - secțiunile → `front-page.php`, ideal fiecare în `template-parts/section-*.php`
   - footer + `<script>` → `footer.php` (`wp_footer()`)
3. CSS-ul inline → `assets/css/style.css`; JS-ul → `assets/js/main.js`; enqueue în `functions.php` cu `filemtime()` pentru cache busting.
4. Imaginile/video → `assets/` sau Media Library.

### Conținut editabil (ACF Pro, ca la vindeautor)
- Pagină de opțiuni sau câmpuri pe front page: texte hero, carduri meniu (repeater), testimoniale (repeater), program, telefon, link-uri sociale, galerie (gallery field), video hero (file field).
- Formularul de rezervare → handler AJAX (`wp_ajax_*` + nonce, model existent în `vindeautor-theme/inc/membership-form-ajax-handlers.php`) sau un plugin de formulare.
- Harta e iframe Google fără cheie API — merge ca atare și în WP.

### De reținut la migrare
- Textele sunt hardcodate în română — la migrare devin câmpuri ACF, text domain propriu (ex. `renee`).
- Anchors-urile din meniu (`#despre`, `#meniu`…) trebuie păstrate dacă meniul devine `wp_nav_menu`.
- `loading="lazy"` pe imagini + `preload="metadata"` pe video — de păstrat.

---

## 6. Cum testezi local

Deschide direct `index.html` în browser sau prin MAMP: `http://localhost/renee-landing/`.
Nu necesită server pentru nimic în afara fonturilor/imaginilor (care vin de pe CDN-uri externe, deci ai nevoie de internet).
