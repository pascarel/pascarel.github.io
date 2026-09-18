# Renée — tema WordPress + WooCommerce · design

Data: 18 septembrie 2026 · Autori: Sergiu Pascaru + Claude · Stare: **aprobat pe secțiuni, de revizuit ca întreg**

Acest document descrie cum devine prototipul static din `projects/renee_v1` un site WordPress + WooCommerce, într-un repo nou. Decizia de arhitectură și fiecare secțiune au fost discutate și aprobate de Sergiu pe 18 septembrie 2026. Secțiunea 9 (securitate și SEO) reia punctele din abordarea inițială fără o discuție separată și e marcată ca atare.

Documentele de referință din prototip rămân valabile acolo unde nu sunt contrazise aici: `CLAUDE.md` (decizii de design și conținut), `MIGRARE-WP.md` (maparea pagină → template, modelul de date), `PARTIALS.md` (header, footer, convenții de scalare), `JURNAL-SESIUNI.md`.

---

## 0. Decizii de arhitectură

| Aspect | Decizie |
|---|---|
| Tip de temă | **Clasică**, PHP + template-parts. Fără FSE, fără block theme, fără page builder. |
| Framework CSS | **Niciunul.** Se portează CSS-ul prototipului în SCSS. Fără Bootstrap. |
| JS | **Vanilla, zero jQuery** pe front, necondiționat. Interacțiunea cu Woo prin Store API. |
| Build | `sass` CLI → CSS minificat, **commit-uit în repo**. Fără Vite, fără bundler. |
| Conținut editabil | **SCF** (Secure Custom Fields), field groups în `acf-json/`, versionate. |
| Formulare | Plugin propriu **`renee-forms`** (rezervări, contact, comenzi), cu dashboard. Fără Contact Form 7. |
| Produse din local | Importate de **`eatme-woo-sync`** (plugin existent, repo separat). |
| Produse catering | Produse Woo în categoria-părinte **Catering**, seed-uite din repo. **Nu CPT.** |
| Lansare | **Modul B**: coșul funcționează, checkout-ul e înlocuit cu „Trimite comanda" (intrare în `renee-forms`), fără plată online. |
| Multilingv | **WPML** (CMS + String Translation + WooCommerce Multilingual). RO implicit, `/ru/`, `/en/`. |
| Server | **Hetzner, OpenLiteSpeed + LiteSpeed Cache.** Anexa A descrie varianta Nginx. |
| Imagini | WebP generat de WordPress la upload, în temă. Fără servicii externe. |
| SEO | Rank Math. |
| Repo | Nou: **`renee-wp`**, structură de `wp-content`, un singur repo pentru temă + plugin + seed + docs. |

Alternative respinse, cu motiv:
- **Woo Blocks pentru coș/checkout** — React, ~200 KB JS, greu de stilizat; checkout-ul e oricum înlocuit la lansare.
- **Refolosirea `wp-base-theme`** — trage Vite și Bootstrap; prototipul are deja sistemul lui de stil.
- **CPT separat pentru catering** — respins în 17 sept. când s-a decis că preparatele de catering au pagină de produs identică.
- **Export WXR pentru conținut** — greu de citit și de modificat; seed-ul CLI e idempotent și rulabil de oricine.

---

## 1. Repo-ul și scheletul temei

### 1.1 Repo `renee-wp`

```
renee-wp/
├── wp-content/
│   ├── themes/renee/
│   └── plugins/renee-forms/
├── seed/
│   ├── content.json            pagini, opțiuni, meniuri, produse catering, articole draft — în RO
│   └── README.md               cum se rulează `wp renee seed`
├── docs/
│   ├── CLAUDE.md               instrucțiuni de lucru, adaptate din prototip
│   ├── JURNAL-SESIUNI.md       continuarea jurnalului
│   ├── DECIZII.md              tabelul de decizii, extras din CLAUDE.md al prototipului
│   └── PERFORMANTA.md          bugetul și măsurătorile PageSpeed
├── .gitignore                  node_modules, .DS_Store, *.map — CSS-ul compilat NU e ignorat
└── README.md                   instalare în 5 pași
```

Doar cod propriu. Se instalează cu `git clone` peste `wp-content` sau ca două zip-uri. Instalate separat: WordPress, WooCommerce, SCF, WPML (3 componente), Rank Math, LiteSpeed Cache, `eatme-woo-sync`.

CSS-ul compilat stă în repo: pe server nu e Node, iar instalarea se face fără build.

### 1.2 Tema `renee`

Header-ul din `style.css` (singurul conținut al fișierului):

```
Theme Name:  Renée
Theme URI:   https://pascarel.github.io/
Author:      Sergiu Pascaru
Author URI:  https://pascarel.github.io/
Description: Temă WordPress + WooCommerce pentru Renée — brunch & moments, Chișinău. Clasică, fără framework, fără jQuery.
Version:     0.1.0
Requires at least: 6.4
Requires PHP: 8.2
Text Domain: renee
License:     GPL-2.0-or-later
```

Același `Author` / `Author URI` în header-ul pluginului `renee-forms` și în `package.json`.

```
themes/renee/
├── style.css                   doar header-ul temei
├── functions.php               doar require-uri
├── inc/
│   ├── setup.php               theme supports, meniuri, mărimi de imagine, text domain
│   ├── enqueue.php             CSS/JS cu filemtime, defer, condiții pe pagină, deregister jquery
│   ├── cleanup.php             emoji, embeds, dashicons, generator, feed-uri inutile, heartbeat pe front
│   ├── security.php            header-e HTTP, XML-RPC, REST users, DISALLOW_FILE_EDIT, login
│   ├── performance.php         preload fonturi, fetchpriority, WebP, dezactivări Woo pe non-shop
│   ├── images.php              image_editor_output_format → webp, mărimi proprii, mărimi Woo oprite
│   ├── seo.php                 schema CafeOrCoffeeShop din „Setări Renée"
│   ├── fields.php              SCF: options page, încărcare acf-json/, wpml-config
│   ├── template-tags.php       renee_pret(), renee_gramaj(), renee_nutritie(), renee_alergeni(), renee_badge()
│   ├── woocommerce.php         supports, hook-uri, Store API, ramura Catering, modul B
│   ├── redirects.php           product_cat / product_tag → /meniu/ sau /catering/
│   ├── wpml.php                switcher din wpml_active_languages, limba în renee-config
│   └── cli.php                 `wp renee seed`, doar sub WP_CLI
├── acf-json/                   field groups sincronizate de SCF
├── template-parts/
│   ├── header/    nav.php, actions.php, lang-switcher.php
│   ├── home/      hero, despre, poveste, momente, meniu, galerie, testimoniale, evenimente, instagram, locatii
│   ├── shop/      card.php, filters.php, toolbar.php, pagination.php
│   ├── catering/  info-bar.php, card.php, lista-bauturi.php, single.php, cta.php
│   ├── cart/      line.php, summary.php, empty.php, trimite-comanda.php
│   ├── shared/    section-head.php, gallery.php, instagram.php, cta-oferta.php
│   └── modal/     rezervare.php
├── woocommerce/
│   ├── archive-product.php     pagina Meniu
│   ├── single-product.php      cu ramificare pe Catering
│   └── content-product.php     cardul
├── front-page.php, page.php, page-despre.php, page-evenimente.php, page-catering.php,
│   page-contact.php, page-cos.php, home.php, single.php, 404.php
├── assets/
│   ├── css/   main.min.css, shop.min.css, admin.min.css   ← compilat, în repo
│   ├── js/    main.js, rez-modal.js, shop.js, catering.js, cart.js, forms.js
│   ├── fonts/ cele 28 de woff2 din prototip
│   └── img/   logo-uri, logo-uri de plată, catering/ (56 webp) până vin originalele
├── scss/
│   ├── abstracts/  _tokens.scss, _breakpoints.scss, _mixins.scss
│   ├── base/       _reset.scss, _fonts.scss, _typography.scss
│   ├── components/ _header.scss, _nav.scss, _buttons.scss, _cards.scss, _forms.scss, _modal.scss, _carousel.scss, ...
│   ├── sections/   una pe template-part
│   ├── shop/       _filters.scss, _toolbar.scss, _pagination.scss, _product.scss, _catering.scss, _cart.scss
│   ├── main.scss, shop.scss, admin.scss
├── scripts/rename-min.js
├── languages/renee.pot
├── wpml-config.xml
└── package.json
```

Reguli:
1. **Un template-part pe secțiune, cu numele secțiunii din prototip.** `home/momente.php` = `.momente` din `index.html`.
2. **`functions.php` fără logică.** Un fișier din `inc/`, o responsabilitate.
3. **Nimic din Woo copiat preventiv.** Override doar unde schimbăm markup.

### 1.3 Dezvoltare locală și deploy

- Local (`~/Local Sites/renee`): `themes/renee` și `plugins/renee-forms` sunt **symlink-uri** către clona repo-ului.
- Deploy pe Hetzner: clone al repo-ului, `git pull` la release. Fără CI la început.

---

## 2. CSS, tokeni și build

- Sursa: `main.css` (~1500 linii) și `shop.css` (~700) din prototip, **tăiate în partiale**, nu rescrise.
- **Tokenii rămân CSS custom properties** în `:root`, în `abstracts/_tokens.scss`: paleta (cu alias-urile vechi, deocamdată), fonturile, `--gap-grid`, `--header-h`, `--ease`. Motive: sunt live la runtime (`--header-h` din JS), sunt identice cu prototipul, permit variante fără build.
- Sass primește: breakpoint-urile ca variabile (`$bp-sm: 560px`, `$bp-md: 640px`, `$bp-nav: 900px`, `$bp-lg: 960px`), mixin-uri (`mq()`, `carousel()`, `surface-cream-2()`), partiale, minificare.
- **Trei bundle-uri:**

| Fișier | Unde | Conținut |
|---|---|---|
| `main.min.css` | peste tot | reset, fonturi, tipografie, header, footer, butoane, carduri, secțiuni |
| `shop.min.css` | Meniu, produs, catering, coș | filtre, toolbar, paginare, produs, catering, coș |
| `admin.min.css` | admin, ecranele `renee-forms` | dashboard |

- Stilurile Woo implicite se dezîncarcă complet (`woocommerce-general`, `-layout`, `-smallscreen`, blocks).
- La mutare se curăță: stilurile inline din HTML devin clase; blocurile „MOBIL — runda N" se topesc în partialele lor; alias-urile de paletă veche se elimină la final cu grep.
- Build: `sass scss:assets/css --style=compressed --no-source-map` + redenumire în `*.min.css`. Un dependency: `sass`. Fără autoprefixer.
- Critical CSS: generat de LiteSpeed Cache, nu de noi. `preload` manual pe cele două fonturi critice.
- **Buget:** `main.min.css` < 40 KB, `shop.min.css` < 20 KB, necomprimat.
- Fără `!important` în afara override-urilor peste Woo sau WPML; fiecare cu comentariu.

---

## 3. JS și enqueue

**Principiu:** PHP randează tot conținutul în HTML. JS animă, filtrează, trimite formulare. Nimic esențial nu depinde de JS.

| Fișier | Unde | Rol |
|---|---|---|
| `main.js` | peste tot | header la scroll, `--header-h`, meniu mobil, dropdown, switcher, reveal, lightbox, stare activă, `reneeChipReveal` |
| `rez-modal.js` | peste tot | modalul de rezervare → REST |
| `shop.js` | Meniu, produs | filtre, sortare, paginare pe client (pe DOM, din `data-*`), bara sticky, add-to-cart prin Store API |
| `catering.js` | Catering, Evenimente | filtre, scrollspy, teaser |
| `cart.js` | pagina de coș | stepper și ștergere prin Store API, „Trimite comanda" → REST |
| `forms.js` | Contact | formularul de contact → REST |

- Toate cu `defer`, inițializate pe `DOMContentLoaded`, fără dependențe între ele.
- **Store API** (`/wc/store/v1/cart`, `/cart/add-item`, `/cart/update-item`, `/cart/remove-item`) cu header `Nonce` din `renee-config`. Fără `admin-ajax`, fără fragmentele jQuery ale Woo.
- **`renee-config`** inline, generat de PHP: URL REST, nonce WP, nonce Store API, limba, șirurile traduse folosite de JS.
- Escaping-ul se face în PHP la randare; JS-ul nu mai construiește HTML din date. Închide punctul XSS din CLAUDE.md §8.
- Enqueue: versiune `filemtime()`; `main.min.css` + `main.js` peste tot; `shop.*` pe `is_woocommerce()`, coș și Catering; `catering.js` pe Catering și Evenimente.
- **`wp_deregister_script('jquery')` pe front**, necondiționat. Pluginurile care îl cer se văd în consolă în Local și se tratează individual.
- Dezactivate: `wp-embed`, emoji, Dashicons pentru vizitatori, `wc-blocks`, `wc-cart-fragments`, `wp-block-library` dacă articolele nu-l cer, heartbeat pe front.

---

## 4. Conținut, SCF și seed

### 4.1 Unde stă fiecare conținut

| Conținut | Unde |
|---|---|
| Preparate din local | produse Woo, importate de `eatme-woo-sync`; nutriție și alergeni în `emo_*` |
| Preparate catering | produse Woo în ramura Catering, seed-uite; meta `renee_unitate` (buc/kg), `renee_masura` (g/ml), `renee_grup` la băuturi; SKU `CAT-<slug>` |
| Articole | `post` + `category` |
| Pagini | `page` cu template propriu, conținut în câmpuri SCF |
| Locații, program, telefoane, socials, plată, texte catering | Options Page **„Setări Renée"** |
| Meniuri | `wp_nav_menu`: principal (cu sub-itemul Catering), footer |

### 4.2 Field groups (`acf-json/`)

- **Setări Renée:** `locatii` repeater (nume, adresă, program, telefon, e-mail, hartă embed, poză, lat/lng), `social` grup, `telefon_principal`, `email_rezervari`, `email_contact`, `email_comenzi`, `logo_plata` repeater, `catering_termen`, `catering_conditii`.
- **Home:** `hero` (video, poster, titlu, subtitlu), `despre`, `poveste`, `momente` (3 × interval, titlu, text, relationship produs), `meniu_featured` (relationship, 4), `galerie`, `testimoniale` repeater, `evenimente_lista`, `instagram`.
- **Despre:** `hero`, `poveste_extinsa`, `valori` repeater (titlu, text, pictogramă), `galerie`.
- **Evenimente:** `hero`, `tipuri` repeater, `servicii` repeater, `catering_teaser` (relationship, 4), `galerie`.
- **Catering:** `hero`, `cta_text`.
- **Contact:** `hero`, `text_intro`.
- **Produs (ramura Catering):** `renee_unitate`, `renee_masura`, `renee_grup`.

`wpml-config.xml` declară pentru fiecare câmp `translate` / `copy` / `copy-once`.

### 4.3 Seed: `wp renee seed`

Comandă în temă (`inc/cli.php`), citește `seed/content.json`. **Idempotentă** prin slug (pagini, articole), SKU (produse), cheie (opțiuni), nume (meniuri).

1. pagini după slug, cu template și câmpuri; existente → actualizate
2. opțiunile „Setări Renée"
3. categoriile ramurii Catering + 70 de produse, cu imagini din `assets/img/catering/`
4. cele două meniuri
5. prima pagină, pagina de articole, paginile Woo (shop = Meniu, coș = pagina noastră `cos`, checkout și cont există dar sunt neexpuse)
6. 4 articole ca **draft**, cu prefix „[DRAFT]"

Flag-uri: `--dry-run`, `--only=pages|options|catering|menus|posts`.

Reguli de conținut: Unsplash și video-ul hero **nu intră în seed** (câmpuri goale, cu notă în admin). Textul draft intră cu prefix `[DRAFT]` vizibil. `content.json` se generează o singură dată din HTML-ul prototipului, apoi devine sursa de adevăr până când conținutul trece în admin.

`eatme-woo-sync` identifică după `_emo_item_id` și nu șterge nimic, deci produsele `CAT-*` nu sunt atinse.

---

## 5. Pluginul `renee-forms`

```
renee-forms/
├── renee-forms.php
├── includes/
│   ├── class-post-types.php   renee_rezervare, renee_mesaj, renee_comanda
│   ├── class-rest.php         POST /renee/v1/rezervare | /mesaj | /comanda
│   ├── class-validator.php
│   ├── class-antispam.php
│   ├── class-mailer.php
│   ├── class-admin.php        dashboard, coloane, filtre, acțiuni, badge
│   ├── class-export.php       CSV
│   └── class-privacy.php      retenție, anonimizare, exportator/ștergător WP
├── assets/admin.css, admin.js
├── languages/
└── uninstall.php              șterge datele doar dacă opțiunea e bifată
```

- **Trei CPT-uri private** (`public => false`, `show_ui => true`, fără REST public): rezervare, mesaj, **comandă** (modul B). Meta cu prefix `_rf_`. IP hash-uit cu salt-ul site-ului, UA trunchiat, limbă, sursă.
- **Statusuri ca stări de post:** rezervare `nouă → confirmată / anulată / no-show`; mesaj `nou → răspuns / arhivat`; comandă `nouă → confirmată / livrată / anulată`.
- **REST:** `permission_callback` verifică nonce (`X-WP-Nonce`) și `Origin`. Răspuns JSON: `ok` sau `errors` pe câmp, traduse.
- **Validare pe server:** obligatorii, telefon E.164 (MD), `is_email`, data între azi și +90 zile, ora în programul locației (din „Setări Renée"), persoane 1–20, lungimi maxime, zero HTML. Comanda: coșul se citește din sesiunea Woo pe server, nu din request.
- **Antispam, patru straturi, fără CAPTCHA vizibil:** honeypot (răspuns fals „ok"), time-trap (token semnat; < 3 s sau > 2 h = respins), rate limit pe IP (3 / 10 min, 10 / zi, transients, 429), blocklist de conținut (marchează „suspect", nu respinge). Strat 5 opțional, oprit implicit: Cloudflare Turnstile.
- **Notificări:** e-mail către adresa locației, cu link la intrare. Confirmare către client la rezervare și comandă, în limba lui. `wp_mail`; SMTP e treaba serverului.
- **Dashboard:** meniu „Renée" cu trei liste; coloane utile (dată/oră, persoane, locație, telefon click-to-call, status, total la comenzi), filtre, căutare după telefon, acțiuni rapide de status, badge cu intrări noi, export CSV pe filtrul curent. Capability `manage_renee_forms` pentru `shop_manager` și admin.
- **Confidențialitate:** retenție 24 luni implicit, cron zilnic de anonimizare, integrare cu exportatorul/ștergătorul WP.
- **Nu facem:** disponibilitate pe mese, calendar, SMS, integrări externe.

---

## 6. WooCommerce și ramura Catering

### 6.1 Setări
MDL, fără zecimale, fără TVA separat, stoc **oprit**, recenzii oprite, cont client oprit, geolocație oprită, Marketing și tracking oprite. Permalink produs `/preparat/%postname%/`.

### 6.2 Template-uri
- `archive-product.php` = **Meniu**: hero, filtre, toolbar, toate produsele de bucătărie într-o pagină, paginare pe client. Query cu `tax_query NOT IN` ramura Catering, `include_children`.
- `content-product.php` = cardul. Badge-uri: `nou` = `date_created` < 30 zile, `recomandat` = featured, `vegan` = tag.
- `single-product.php`: ramificare pe Catering → `template-parts/catering/single.php`; altfel preparat cu nutriție `emo_*`, alergeni (doar dacă `emo_allergens` nu e gol — **fără deducere**), similare, bundle.
- **Nu suprascriem** `cart/`, `checkout/`, `myaccount/`, e-mailuri. Coșul e `page-cos.php`, al nostru.

### 6.3 Ramura Catering
1. `woocommerce_is_purchasable` → `false` pe ramură.
2. Exclusă din Meniu, căutare, similare, shortcode-uri printr-un filtru pe query.
3. `/catering/` = `page-catering.php` cu `WC_Product_Query` pe ramură, grupat pe subcategorie; băuturile ca listă, single-ul lor redirecționat la `/catering/#bauturi`.
4. Breadcrumb propriu: Evenimente › Catering › subcategorie (text, nu link).

### 6.4 Redirect-uri
`product_cat` → `/meniu/` 301; ramura Catering → `/catering/`; `product_tag` → `/meniu/`. Plus `noindex` și excludere din sitemap prin Rank Math.

### 6.5 Modul B, „coș vizibil, fără plată online"
- Add-to-cart și coșul funcționează prin Store API.
- Pagina de coș are butonul **„Trimite comanda"** în locul checkout-ului: nume, telefon, locație de ridicare sau adresă, mențiuni → `POST /renee/v1/comanda`. Serverul citește coșul din sesiune, creează `renee_comanda` cu liniile și totalul, trimite e-mailurile, golește coșul.
- Pagina de checkout Woo există (Woo o cere) dar **nu e linkată** și redirecționează la coș.
- Când pornesc plățile: gateway MIA/Victoriabank (existente din festival), checkout pe Store API fără jQuery, „Trimite comanda" dispare.

### 6.6 Imagini
Mărimi proprii `renee-card` 752×552 crop, `renee-single` 1200, `renee-hero` 1920; mărimile Woo implicite oprite.

---

## 7. WPML

- Componente: Multilingual CMS, String Translation, WooCommerce Multilingual. **Nu** Media Translation.
- RO implicit; `/ru/`, `/en/` ca subdirectoare. Slug-uri de pagină traduse; slug-uri de produs identice; baza `/preparat/` comună.
- Traducere: pagini + SCF prin editorul WPML ghidat de `wpml-config.xml`; șiruri din temă prin `__()` cu domeniul `renee`; șiruri din JS prin `renee-config`; meniuri prin Menu Sync; opțiuni ca `admin-texts`; produse prin WCML. **De verificat:** API-ul eat-me cu `language=ru` / `en` — dacă localul întreține traducerile acolo, se extinde `eatme-woo-sync`.
- Switcher: al nostru, din `wpml_active_languages`.
- **Setări de viteză:** redirecționare după browser **oprită**; cookie de limbă **doar pentru autentificați**; traducere automată oprită după prima trecere; auto-înregistrare de șiruri oprită după lansare; `.mo` doar din String Translation.
- LiteSpeed Cache: cache per URL, deci per limbă; cookie-ul de limbă e ce trebuie ținut oprit pe front.
- `hreflang` din WPML, citit de Rank Math; sitemap per limbă.
- Nu: multi-monedă, slug-uri de produs traduse, e-mailuri Woo traduse până la vânzare online.

---

## 8. Performanță: OpenLiteSpeed + LiteSpeed Cache

### 8.1 În temă
- Fonturi self-hostate, `preload` pe două fișiere, `font-display: swap`.
- Imagini: **WebP la upload** prin `image_editor_output_format` (WP 6.1+; necesită Imagick/GD cu WebP pe server, de verificat cu `php -i | grep -i webp`), calitate 82; `width`/`height` peste tot; `loading="lazy"` sub fold; `fetchpriority="high"` pe hero și prima poză de produs; `srcset` nativ. Pentru existente: `wp media regenerate --only-missing`. AVIF nu.
- Video hero: `preload="metadata"`, `poster` obligatoriu, nu pornește la `prefers-reduced-motion` și nici sub 640px.
- Interogări: un `WC_Product_Query` pe Meniu cu meta preîncărcat; nutriția citită în bloc.
- Fără `admin-ajax` și heartbeat pe front.

### 8.2 LiteSpeed Cache

| Zonă | Setare |
|---|---|
| Cache | public da, autentificați nu, TTL 7 zile, purjare la salvare produs/pagină/opțiune |
| Excluderi | `/cos/`, checkout, cont, `/wp-json/renee/*`, `/wp-json/wc/store/*` |
| ESI | badge-ul de coș din header |
| CSS | minificare **nu**, combinare **nu**, Critical CSS **da**, CSS async **da** |
| JS | minificare nu, combinare nu, defer deja pus |
| Imagini | lazy-load **oprit** în plugin (îl face tema); optimizare externă **nu** |
| Obiecte | Redis dacă e pe server |
| Browser | 1 an pe assets |
| Server | Brotli, HTTP/2, HTTP/3 din OLS |

**Nu se pornesc:** Guest mode / Guest optimization, Remove unused CSS, Inline JS, Delay JS.

### 8.3 Ținte (mobil, PageSpeed)

| Metrică | Țintă |
|---|---|
| LCP | < 2,0 s |
| CLS | 0 |
| INP | < 100 ms |
| Greutate home | < 900 KB fără video; < 400 KB pentru prima randare |
| Scor | 95+ mobil, 99 desktop; home-ul cu video e cel mai greu — primul sacrificiu e video-ul pe mobil, al doilea Instagram |

Măsurători în `docs/PERFORMANTA.md`, Query Monitor în Local, PageSpeed pe staging după fiecare secțiune mare.

---

## 9. Securitate și SEO · ⚠️ nediscutat separat, de revizuit

### 9.1 Securitate
- **Header-e HTTP din temă** (`inc/security.php`): `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` restrictiv, `Content-Security-Policy` în modul report-only la început, apoi enforce după ce vedem ce încarcă WPML și Rank Math.
- XML-RPC oprit; `DISALLOW_FILE_EDIT`; endpoint-ul REST `/wp/v2/users` închis pentru vizitatori; versiunea WP și generatorul scoase; `?author=N` blocat; login: rate limit propriu (transients, 5 încercări / 15 min / IP) sau un singur plugin de firewall + login, de ales.
- `wp-config.php`: chei unice, `FORCE_SSL_ADMIN`, `WP_AUTO_UPDATE_CORE` minor, `DISALLOW_UNFILTERED_HTML`.
- Formulare: cele patru straturi din §5, nonce + Origin, validare pe server, escaping la afișare, IP hash-uit.
- Woo: cont client oprit; Store API e read/write doar pe coșul sesiunii curente, fără date personale până la checkout.
- Fișiere: permisiuni 644/755, `wp-content/uploads` fără execuție PHP (regulă OLS), backup zilnic pe Hetzner, în afara serverului.
- Actualizări: core minor automat; pluginuri și temă manual, după test în Local.

### 9.2 SEO
- Rank Math: titluri și meta per limbă, breadcrumb-ul nostru, sitemap per limbă, `noindex` pe `product_cat`, `product_tag`, autor, atașamente, căutare, coș.
- Schema: `CafeOrCoffeeShop` cu două `Place` din „Setări Renée" (adresă, program, telefon, geo), `Product` de la Woo pe preparate; catering fără `Offer` cât timp e nevandabil.
- `hreflang` din WPML. URL-uri curate, fără `/product-category/`.
- `robots.txt`: blochează `/wp-json/renee/`, `/cos/`, căutarea.
- Imagini cu `alt` din câmpuri, traduse.

---

## 10. Ce rămâne deschis

- Server: **OLS confirmat ca țintă**; Anexa A dacă ajunge Nginx.
- WebP pe server: de verificat extensia PHP.
- API eat-me în RU/EN: de verificat cu un request; decide dacă `eatme-woo-sync` importă traducerile.
- Plugin de firewall/login: unul singur sau rate limit propriu — de ales la implementare.
- CSP: report-only → enforce, după prima săptămână pe staging.
- Din prototip, încă neînchise: handle-ul de Facebook, telefonul din footer, denumirea primei locații, programul pe locații, prețurile și gramajele reale la catering, descrierile de catering, pictogramele din brandbook.

---

## 11. Pentru sesiunile care vor lucra la proiect

Reguli valabile din prima zi în repo-ul `renee-wp`, indiferent cine e la tastatură — Sergiu, Claude ACASĂ sau Claude OFICIU:

1. **Acest spec e sursa de adevăr pentru arhitectură.** Ce nu e aici se întreabă, nu se presupune. Deciziile noi se adaugă în `docs/DECIZII.md` cu dată și motiv, nu se rescriu cele vechi.
2. **Protocolul de sesiune rămâne cel din prototip:** `pwd && uname -s` la început, citit `docs/JURNAL-SESIUNI.md`, scris în el la final. OFICIU nu poate face push; ACASĂ nu face push fără să întrebe. Commit-urile le face Sergiu din GitHub Desktop.
3. **Prototipul `projects/renee_v1` e referința de design, nu se mai modifică.** Orice schimbare de design se face în temă. Dacă tema și prototipul diferă, tema are dreptate.
4. **Ordinea de lucru e cea din planul de implementare** (`docs/superpowers/plans/`), fază cu fază. Nu se sare la Woo înainte de scheletul temei, nu se sare la WPML înainte ca RO să fie complet.
5. **Convențiile CSS din `PARTIALS.md` §5.2 se aplică:** `vw` nu `vh`, minimul din `clamp` e valoarea de mobil, titlurile își pun `line-height`. Tokenii se schimbă doar în `_tokens.scss`. Fără `!important` fără comentariu. După orice schimbare de SCSS: `npm run build` și commit-uit CSS-ul compilat.
6. **Zero jQuery pe front. Zero framework CSS.** Dacă un plugin nou aduce jQuery, se justifică în jurnal sau nu se instalează.
7. **Conținutul intră prin seed sau prin admin, niciodată hardcodat în template.** Textele draft poartă prefixul `[DRAFT]`. Dacă lipsește ceva (poză, text, adresă), se spune că lipsește, nu se inventează.
8. **Escaping la ieșire, sanitizare la intrare, nonce pe orice scriere.** `esc_html`, `esc_attr`, `esc_url`, `wp_kses_post`; `sanitize_*` și validare în `class-validator.php`; nimic din `$_POST`/`$_GET` citit direct în template.
9. **Nu se atinge nimic creat de `eatme-woo-sync`** (produse cu `_emo_item_id`, categoriile de bucătărie, câmpurile `emo_*`). Se citește doar.
10. **Fiecare fază se verifică în Local înainte de a fi marcată gata:** pagina deschisă, Query Monitor fără erori și fără interogări duplicate, consola fără erori, 375px fără overflow. Ce n-a putut fi testat se scrie explicit.
11. **Performanța se măsoară, nu se presupune:** `docs/PERFORMANTA.md` primește o linie la fiecare fază majoră, cu scorul și greutatea paginii.
12. **Numele oficiale:** tema `renee`, text domain `renee`, plugin `renee-forms`, prefix de funcții `renee_`, prefix de meta `_rf_` în plugin și `renee_` în temă, namespace REST `renee/v1`, comanda CLI `wp renee`.

## Anexa A — varianta Nginx + PHP-FPM

Dacă serverul ajunge Nginx în loc de OpenLiteSpeed, se schimbă doar §8.2 și două detalii:

| Ce | OLS | Nginx |
|---|---|---|
| Cache de pagină | LiteSpeed Cache | **FastCGI cache** în Nginx: `fastcgi_cache_path`, bypass pe cookie `wordpress_logged_in`, `woocommerce_items_in_cart`, `wp-postpass`; TTL 7 zile |
| Purjare | pluginul LSC, automat | pluginul **Nginx Helper** (`purge` prin modul `ngx_cache_purge` sau ștergere de fișiere), la salvare |
| Excluderi | din plugin | `location` cu `set $skip_cache 1` pentru `/cos/`, `/wp-json/`, `/wp-admin/`, `?s=` |
| Badge coș | ESI | `fetch` la `/wc/store/v1/cart` după încărcare, doar dacă cookie-ul `woocommerce_items_in_cart` există |
| Critical CSS | generat de LSC | nu există generator; opțiuni: fără (ne bazăm pe CSS mic + `preload`), sau un script de build cu `critical` rulat local și commit-uit |
| Brotli | inclus | `ngx_brotli` compilat sau gzip |
| HTTP/3 | inclus | Nginx ≥ 1.25 cu `quic` |
| Object cache | Redis | Redis, același |
| Reguli de rescriere | panou OLS | `server` block, ca în Local |
| Fără execuție PHP în uploads | regulă OLS | `location ~* /uploads/.*\.php$ { deny all; }` |

Restul spec-ului, temă, plugin, seed, WPML, securitate, e identic.
