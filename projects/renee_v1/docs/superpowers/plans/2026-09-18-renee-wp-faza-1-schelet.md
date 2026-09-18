# Renée WP — Faza 1: schelet · plan de implementare

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Repo-ul `renee-wp` există, tema `renee` e activă în Local și randează header, footer și 404 cu stilurile prototipului, fără jQuery, cu build SCSS funcțional și opțiunile „Setări Renée" definite.

**Architecture:** Temă WordPress clasică, `functions.php` doar cu require-uri, un fișier pe responsabilitate în `inc/`, template-parts pe secțiune. CSS-ul prototipului e tăiat în partiale SCSS și compilat cu `sass` CLI în fișiere minificate commit-uite. Conținutul din header și footer vine din opțiuni SCF, nu din template.

**Tech Stack:** WordPress 6.4+, PHP 8.2+, SCF (Secure Custom Fields), `sass` CLI (Dart Sass, deja instalat global la `/usr/local/bin/sass`; local prin npm), WP-CLI din Local Site Shell, Query Monitor.

**Spec:** `projects/renee_v1/docs/superpowers/specs/2026-09-18-renee-wp-tema-design.md` — secțiunile 0, 1, 2, 3, 9.1 și 11.

## Global Constraints

- Tema se numește `renee`, text domain `renee`, prefix de funcții `renee_`, prefix meta `renee_`. (spec §11.12)
- Header `style.css`: `Theme Name: Renée`, `Author: Sergiu Pascaru`, `Author URI: https://pascarel.github.io/`, `Requires at least: 6.4`, `Requires PHP: 8.2`, `License: GPL-2.0-or-later`. (spec §1.2)
- **Zero jQuery pe front**, `wp_deregister_script('jquery')` necondiționat. **Zero framework CSS.** (spec §0, §3)
- Tokenii rămân CSS custom properties în `:root`, un singur fișier `scss/abstracts/_tokens.scss`. Breakpoint-uri: `$bp-sm: 560px`, `$bp-md: 640px`, `$bp-nav: 900px`, `$bp-lg: 960px`. (spec §2)
- CSS-ul compilat (`assets/css/*.min.css`) **se commit-uiește**. Buget: `main.min.css` < 40 KB. (spec §2)
- Fără `!important` fără comentariu. Spațierile în `vw`, nu `vh`; minimul din `clamp` e valoarea de mobil. (spec §11.5)
- Escaping la ieșire: `esc_html`, `esc_attr`, `esc_url`. Nimic din `$_GET`/`$_POST` în template. (spec §11.8)
- Conținutul nu se hardcodează în template; header și footer citesc din „Setări Renée". Ce lipsește rămâne gol, nu se inventează. (spec §11.7)
- `functions.php` conține doar `require`-uri. (spec §1.2)
- Commit-urile le face Sergiu din GitHub Desktop; planul spune **ce** se commit-uiește, nu rulează `git commit` fără acordul lui. Sesiunea ACASĂ poate rula `git add` și `git commit` local dacă Sergiu a spus explicit; **push niciodată fără întrebare**. (spec §11.2)

## Căi folosite în plan

| Alias | Cale |
|---|---|
| `$PROTO` | `/Users/sergiupascaru/Documents/GitHub/pascarel.github.io/projects/renee_v1` |
| `$REPO` | `/Users/sergiupascaru/Documents/GitHub/renee-wp` |
| `$THEME` | `$REPO/wp-content/themes/renee` |
| `$LOCAL` | `/Users/sergiupascaru/Local Sites/renee/app/public` |

Comenzile `wp …` se rulează din **Local → site „renee" → Open Site Shell**, care setează PHP-ul și socket-ul MySQL. WP-CLI-ul global din `/usr/local/bin/wp` nu vede baza de date a Local-ului.

## Structura de fișiere creată în această fază

```
renee-wp/
├── .gitignore
├── README.md
├── docs/CLAUDE.md, JURNAL-SESIUNI.md, DECIZII.md, PERFORMANTA.md
└── wp-content/themes/renee/
    ├── style.css, functions.php, index.php, 404.php, page.php, header.php, footer.php
    ├── package.json, scripts/rename-min.js
    ├── inc/setup.php, enqueue.php, cleanup.php, security.php, fields.php,
    │   template-tags.php, class-renee-nav-walker.php
    ├── acf-json/group_renee_setari.json
    ├── template-parts/header/nav.php, actions.php, lang-switcher.php
    ├── template-parts/footer/brand.php, links.php, info.php, bottom.php
    ├── scss/abstracts/_tokens.scss, _breakpoints.scss, _mixins.scss
    ├── scss/base/_reset.scss, _fonts.scss, _typography.scss
    ├── scss/components/_header.scss, _nav.scss, _lang.scss, _buttons.scss, _footer.scss, _reveal.scss
    ├── scss/main.scss, shop.scss, admin.scss
    └── assets/css/main.min.css, shop.min.css, admin.min.css
        assets/fonts/*.woff2 (28)
        assets/img/logo.svg, logo_simple.svg, logo_symbol.svg, visa.svg, mastercard.svg, moldindconbank_logo.svg
        assets/js/main.js
```

---

### Task 1: Repo-ul `renee-wp` și documentele de lucru

**Files:**
- Create: `$REPO/.gitignore`, `$REPO/README.md`, `$REPO/docs/CLAUDE.md`, `$REPO/docs/JURNAL-SESIUNI.md`, `$REPO/docs/DECIZII.md`, `$REPO/docs/PERFORMANTA.md`

**Interfaces:**
- Produces: repo git inițializat pe `main`, cu structura din spec §1.1; `docs/CLAUDE.md` e fișierul de instrucțiuni citit de sesiunile viitoare.

- [ ] **Step 1: Creează structura și `.gitignore`**

```bash
mkdir -p "$REPO"/{wp-content/themes/renee,wp-content/plugins/renee-forms,seed,docs}
cat > "$REPO/.gitignore" <<'EOF'
node_modules/
.DS_Store
*.map
*.log
.env
# CSS-ul compilat din assets/css/ NU e ignorat — se commit-uiește (spec §2)
EOF
```

- [ ] **Step 2: Scrie `README.md`**

```markdown
# renee-wp

Tema WordPress + WooCommerce pentru Renée (brunch & moments, Chișinău) și pluginul de formulare.
Structură de `wp-content`: se instalează prin clone peste `wp-content` sau ca zip-uri.

## Instalare
1. WordPress 6.4+, PHP 8.2+, WooCommerce, Secure Custom Fields.
2. `git clone` acest repo; symlink sau copie: `wp-content/themes/renee` și `wp-content/plugins/renee-forms`.
3. Activează tema `Renée` și pluginul `Renée Forms`.
4. `wp renee seed` (din Faza 2) pentru conținutul inițial.
5. Vezi `docs/CLAUDE.md` înainte de a lucra.

## Build CSS
`cd wp-content/themes/renee && npm install && npm run build` — CSS-ul compilat se commit-uiește.

Spec: `docs/superpowers/specs/2026-09-18-renee-wp-tema-design.md` din repo-ul `pascarel.github.io`, `projects/renee_v1`.
```

- [ ] **Step 3: Scrie `docs/CLAUDE.md`** — pornește de la `$PROTO/CLAUDE.md`, păstrează secțiunile 0 (regula principală), 1 (contexte și sesiuni, cu `$REPO` în loc de prototip), 2 (git), 5 (brandbook), 7 (conținut draft), 9 (stil de lucru). Înlocuiește secțiunea 3 cu structura din spec §1.1 și secțiunea 4 cu un pointer: „Arhitectura e în spec-ul din prototip; deciziile noi intră în `DECIZII.md`". Adaugă la început:

```markdown
> Prototipul static din `pascarel.github.io/projects/renee_v1` e **referința de design** și nu se mai modifică.
> Spec: `projects/renee_v1/docs/superpowers/specs/2026-09-18-renee-wp-tema-design.md`. Regulile pentru sesiuni: spec §11.
```

- [ ] **Step 4: Scrie `docs/JURNAL-SESIUNI.md`** — copiază antetul și „Protocol" din `$PROTO/JURNAL-SESIUNI.md`, fără intrările vechi, și adaugă prima intrare:

```markdown
## 2026-09-18 · ACASĂ · repo creat, Faza 1 pornită
**Făcut:** repo `renee-wp`, structura din spec §1.1, documentele de lucru.
**Pentru cealaltă sesiune:** citește spec-ul §11 înainte de orice. Planul Fazei 1 e în prototip, `docs/superpowers/plans/2026-09-18-renee-wp-faza-1-schelet.md`.
```

- [ ] **Step 5: Scrie `docs/DECIZII.md`** cu tabelul din spec §0 (copiat) și antetul „Deciziile noi se adaugă jos, cu dată și motiv. Cele vechi nu se rescriu." Scrie `docs/PERFORMANTA.md`:

```markdown
# Performanță — buget și măsurători
Ținte (spec §8.3): LCP < 2,0 s · CLS 0 · INP < 100 ms · home < 900 KB fără video · 95+ mobil, 99 desktop.
| Data | Pagină | Dispozitiv | Scor | LCP | CLS | Greutate | Notă |
|---|---|---|---|---|---|---|---|
```

- [ ] **Step 6: Inițializează git**

```bash
cd "$REPO" && git init -b main && git add -A && git status --short
```
Expected: fișierele listate ca `A`. Commit-ul îl face Sergiu: `chore: repo renee-wp, structură și documente`.

- [ ] **Step 7: Symlink în Local**

```bash
cd "$LOCAL/wp-content/themes" && ln -s "$THEME" renee && ls -la | grep renee
```
Expected: `renee -> /Users/sergiupascaru/Documents/GitHub/renee-wp/wp-content/themes/renee`.

---

### Task 2: Tema minimă, activabilă

**Files:**
- Create: `$THEME/style.css`, `$THEME/functions.php`, `$THEME/index.php`, `$THEME/inc/setup.php`

**Interfaces:**
- Produces: constante `RENEE_VERSION`, `RENEE_DIR`, `RENEE_URI`; meniuri înregistrate `principal` și `footer`; mărimi de imagine `renee-card` (752×552 crop), `renee-single` (1200×0), `renee-hero` (1920×0).

- [ ] **Step 1: `style.css`** — exact header-ul din spec §1.2, nimic altceva:

```css
/*
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
License URI: https://www.gnu.org/licenses/gpl-2.0.html
*/
```

- [ ] **Step 2: `functions.php`**

```php
<?php
/**
 * Renée — doar require-uri. Logica stă în inc/, un fișier pe responsabilitate (spec §1.2).
 */
defined( 'ABSPATH' ) || exit;

define( 'RENEE_VERSION', '0.1.0' );
define( 'RENEE_DIR', get_template_directory() );
define( 'RENEE_URI', get_template_directory_uri() );

require RENEE_DIR . '/inc/setup.php';
```

- [ ] **Step 3: `inc/setup.php`**

```php
<?php
/**
 * Theme supports, meniuri, mărimi de imagine, text domain.
 */
defined( 'ABSPATH' ) || exit;

function renee_setup() {
	load_theme_textdomain( 'renee', RENEE_DIR . '/languages' );
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'html5', array( 'search-form', 'gallery', 'caption', 'style', 'script', 'navigation-widgets' ) );
	add_theme_support( 'responsive-embeds' );
	remove_theme_support( 'core-block-patterns' );

	register_nav_menus( array(
		'principal' => __( 'Meniu principal', 'renee' ),
		'footer'    => __( 'Meniu footer (Explorează)', 'renee' ),
	) );

	// Mărimi proprii (spec §6.6). Cele implicite Woo se opresc în Faza 3.
	add_image_size( 'renee-card', 752, 552, true );
	add_image_size( 'renee-single', 1200, 0, false );
	add_image_size( 'renee-hero', 1920, 0, false );
}
add_action( 'after_setup_theme', 'renee_setup' );
```

- [ ] **Step 4: `index.php`** minimal, ca WordPress să accepte tema:

```php
<?php
defined( 'ABSPATH' ) || exit;
get_header();
?>
<main id="main" class="section"><div class="wrap">
<?php
if ( have_posts() ) {
	while ( have_posts() ) { the_post(); ?>
		<article <?php post_class(); ?>>
			<h2 class="h2"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
			<?php the_excerpt(); ?>
		</article>
	<?php }
} else {
	echo '<p>' . esc_html__( 'Nimic aici, deocamdată.', 'renee' ) . '</p>';
}
?>
</div></main>
<?php get_footer();
```

- [ ] **Step 5: Verifică sintaxa și activează**

```bash
php -l "$THEME/functions.php" && php -l "$THEME/inc/setup.php" && php -l "$THEME/index.php"
```
În Site Shell: `wp theme activate renee && wp theme list --status=active`
Expected: `renee` activă. `curl -s -o /dev/null -w "%{http_code}\n" http://renee.local/` → `200`. (header.php/footer.php lipsesc încă; WP cade pe cele implicite, e ok pentru acest pas.)

- [ ] **Step 6: Commit** (Sergiu): `feat(tema): schelet activabil, setup, meniuri, mărimi de imagine`.

---

### Task 3: Toolchain SCSS și tokenii

**Files:**
- Create: `$THEME/package.json`, `$THEME/scripts/rename-min.js`, `$THEME/scss/abstracts/_tokens.scss`, `_breakpoints.scss`, `_mixins.scss`, `$THEME/scss/main.scss`, `shop.scss`, `admin.scss`
- Produces: `assets/css/main.min.css`, `shop.min.css`, `admin.min.css`

**Interfaces:**
- Produces: mixin `mq($bp)` (max-width), mixin `surface-cream-2` (redefinește `--ink-soft` la `--text-body`), variabilele `$bp-*`.

- [ ] **Step 1: `package.json`**

```json
{
  "name": "renee-theme",
  "version": "0.1.0",
  "private": true,
  "author": "Sergiu Pascaru (https://pascarel.github.io/)",
  "license": "GPL-2.0-or-later",
  "scripts": {
    "watch": "sass --watch scss:assets/css --style=expanded --source-map",
    "build": "sass scss:assets/css --style=compressed --no-source-map && node scripts/rename-min.js"
  },
  "devDependencies": { "sass": "^1.93.0" }
}
```

- [ ] **Step 2: `scripts/rename-min.js`** — `sass scss:assets/css` produce `main.css`; îl redenumim în `main.min.css` și ștergem restul:

```js
// Redenumește assets/css/{main,shop,admin}.css în *.min.css după build.
const fs = require('fs'), path = require('path');
const dir = path.join(__dirname, '..', 'assets', 'css');
for (const name of ['main', 'shop', 'admin']) {
  const src = path.join(dir, `${name}.css`), dst = path.join(dir, `${name}.min.css`);
  if (fs.existsSync(src)) { fs.renameSync(src, dst); console.log(`${name}.min.css  ${(fs.statSync(dst).size/1024).toFixed(1)} KB`); }
}
```

- [ ] **Step 3: `scss/abstracts/_tokens.scss`** — copiază **integral** blocul `:root{ … }` din `$PROTO/css/main.css` liniile 1–63 (de la `:root{` până la `}` de după `--gap-grid`), cu comentariile lui. Adaugă la final, înainte de `}`:

```scss
  --header-h:88px;   /* suprascris de main.js cu înălţimea reală a header-ului */
```

- [ ] **Step 4: `_breakpoints.scss` și `_mixins.scss`**

```scss
// _breakpoints.scss — cele patru praguri din prototip (spec §2)
$bp-sm: 560px;   // butonul de rezervare devine iconiţă
$bp-md: 640px;   // carusele, filtre sticky, paginare compactă
$bp-nav: 900px;  // nav-ul devine overlay
$bp-lg: 960px;   // grile 2 coloane
```

```scss
// _mixins.scss
@use 'breakpoints' as *;

@mixin mq($bp) { @media (max-width: $bp) { @content; } }

// Pe suprafeţe cream-2, --ink-soft (4.40) pică sub prag; coborâm la --text-body
// REDEFININD variabila, nu culoarea — se aplică singur la tot ce e înăuntru (CLAUDE.md §5).
@mixin surface-cream-2 { --ink-soft: var(--text-body); }

// Carusel orizontal pe mobil: flex + snap, sângerează la margini. scroll-padding e obligatoriu,
// altfel primul card porneşte lipit de margine (jurnal 17 sept.).
@mixin carousel($gutter: clamp(20px, 5vw, 64px)) {
  display: flex; grid-template-columns: none; gap: var(--gap-grid);
  overflow-x: auto; overscroll-behavior-x: contain; scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch; scrollbar-width: none;
  margin-inline: calc(-1 * #{$gutter}); padding-inline: $gutter; scroll-padding-inline: $gutter;
  padding-bottom: 6px;
  &::-webkit-scrollbar { display: none; }
  > * { flex: 0 0 78%; scroll-snap-align: start; }
}
```

- [ ] **Step 5: Fișierele de intrare**

```scss
// main.scss — pe toate paginile
@use 'abstracts/tokens';
// base/ şi components/ se adaugă în Task 4
```
```scss
// shop.scss — Meniu, produs, catering, coş (Faza 3 şi 4)
@use 'abstracts/tokens' as *;
```
```scss
// admin.scss — dashboard-ul renee-forms (Faza 4)
```

- [ ] **Step 6: Build și verificare**

```bash
cd "$THEME" && npm install && npm run build && ls -la assets/css && head -c 200 assets/css/main.min.css
```
Expected: trei fișiere `*.min.css`; `main.min.css` începe cu `:root{--brand:#AF7B5C;` (fără comentarii, minificat).

- [ ] **Step 7: Commit** (Sergiu): `feat(css): toolchain sass, tokeni, breakpoint-uri, mixin-uri`.

---

### Task 4: Fonturi, reset, tipografie, header, footer — partiale SCSS

**Files:**
- Create: `$THEME/scss/base/_reset.scss`, `_fonts.scss`, `_typography.scss`; `$THEME/scss/components/_reveal.scss`, `_header.scss`, `_nav.scss`, `_lang.scss`, `_buttons.scss`, `_footer.scss`
- Copy: `$PROTO/fonts/*.woff2` → `$THEME/assets/fonts/`; `$PROTO/img/{logo,logo_simple,logo_symbol,visa,mastercard,moldindconbank_logo}.svg` → `$THEME/assets/img/`
- Modify: `$THEME/scss/main.scss`

**Interfaces:**
- Produces: clasele din prototip neschimbate: `.wrap`, `.h2`, `.eyebrow`, `.btn-solid`, `.btn-outline`, `.btn-rez`, `.reveal`, `header#header`, `nav#nav`, `.nav-item`, `.nav-sub`, `.header-actions`, `.lang`, `.burger`, `footer`, `.footer-top`, `.footer-col`, `.footer-plata`, `.plata-logo`.

- [ ] **Step 1: Copiază fonturile și logo-urile**

```bash
mkdir -p "$THEME/assets/fonts" "$THEME/assets/img"
cp "$PROTO"/fonts/*.woff2 "$THEME/assets/fonts/" && ls "$THEME/assets/fonts" | wc -l
cp "$PROTO"/img/{logo,logo_simple,logo_symbol,visa,mastercard,moldindconbank_logo}.svg "$THEME/assets/img/"
```
Expected: `28`.

- [ ] **Step 2: `base/_fonts.scss`** — copiază toate cele 28 de reguli `@font-face` din `$PROTO/css/fonts.css`, înlocuind `url("../fonts/` cu `url("../fonts/` (calea rămâne relativă la `assets/css/`, deci identică). Verifică: `grep -c "@font-face" "$THEME/scss/base/_fonts.scss"` → `28`.

- [ ] **Step 3: `base/_reset.scss` și `base/_typography.scss`** — din `$PROTO/css/main.css`:
  - `_reset.scss` ← liniile de după `:root` până la `.wrap` inclusiv (`*{margin:0…}`, `html`, `body`, `::selection`, `img`, `h1,h2,h3,h4{line-height:1.22}`, `:focus`, `:focus-visible`, `a`, `.sr-only`, `.wrap`).
  - `_typography.scss` ← `.eyebrow` (și `::before`), `.h2` (și `em`), `.manifest`, `.lead`, tot ce e tipografie generică până la primul marker de secțiune.
  - Regula: **copie fidelă**, fără să „îmbunătățești". Singura transformare: media query-urile care afectează aceste clase, aflate la finalul fișierului sub `/* ---------- responsive ---------- */`, se mută **în partialul clasei**, prin `@include mq($bp-lg) { … }`.

- [ ] **Step 4: `components/_reveal.scss`** ← blocul `/* ---------- utilitare reveal ---------- */` (linia 89 → 117) inclusiv `prefers-reduced-motion`.

- [ ] **Step 5: `components/_header.scss`, `_nav.scss`, `_lang.scss`** ← blocurile `/* ---------- header ---------- */` (118→156), `/* ---------- submeniu ---------- */` (157→197), `/* ---------- switcher de limbă ---------- */` (198→267), plus regulile lor din `@media(max-width:900px)` și `(max-width:560px)` de la final (burger, `nav.open`, animația `navItemIn`, `.header-actions`, `.btn-rez` iconiță). Păstrează comentariile despre specificitate (`li` în selectorul dropdown-ului, `nth-of-type` cu `.nav-item`). Regulile `header:not(.scrolled)` pentru hero rămân, home-ul vine în Faza 2.

- [ ] **Step 6: `components/_buttons.scss`** ← `.btn-solid`, `.btn-outline`, `.cta-row`, `.btn-light`, `.tel-big`, `.link-arrow`. `components/_footer.scss` ← `/* ---------- footer (3 coloane) ---------- */` (1002→1015) + `/* ---------- metode de plată ---------- */` (1016→1065) + regulile de footer din responsive (`.footer-top{grid-template-columns:1fr}`, `.footer-col .footer-links a{padding:7px 0}`, `footer .footer-col:nth-child(2){display:none}` la 640).

- [ ] **Step 7: `main.scss`**

```scss
@use 'abstracts/tokens';
@use 'base/fonts';
@use 'base/reset';
@use 'base/typography';
@use 'components/reveal';
@use 'components/buttons';
@use 'components/header';
@use 'components/nav';
@use 'components/lang';
@use 'components/footer';
```
Fiecare partial care folosește `mq()` începe cu `@use '../abstracts/mixins' as *; @use '../abstracts/breakpoints' as *;`.

- [ ] **Step 8: Build, verifică bugetul și că nimic nu s-a pierdut**

```bash
cd "$THEME" && npm run build
grep -c "font-face" assets/css/main.min.css          # 28
grep -o "\.nav-sub li a" assets/css/main.min.css | head -1   # regula cu specificitate
grep -c "!important" assets/css/main.min.css          # ≤ 3, fiecare cu motiv în SCSS
```
Expected: `main.min.css` sub 20 KB în acest moment (fără secțiuni), 28 de `@font-face`.

- [ ] **Step 9: Commit** (Sergiu): `feat(css): fonturi, reset, tipografie, header, nav, footer portate din prototip`.

---

### Task 5: Enqueue fără jQuery, cleanup, header-e de securitate

**Files:**
- Create: `$THEME/inc/enqueue.php`, `$THEME/inc/cleanup.php`, `$THEME/inc/security.php`
- Modify: `$THEME/functions.php` (adaugă 3 require-uri)

**Interfaces:**
- Produces: handle-uri `renee-main` (css), `renee-shop` (css, condiționat), `renee-main` (js, defer); obiect inline `window.reneeConfig = { restUrl, nonce, lang, i18n }`; funcția `renee_is_shop_context()` folosită în Faza 3 (deocamdată returnează `false` dacă Woo lipsește).

- [ ] **Step 1: `inc/enqueue.php`**

```php
<?php
/**
 * CSS/JS: versiune din filemtime, defer pe tot, zero jQuery pe front (spec §3).
 */
defined( 'ABSPATH' ) || exit;

function renee_asset_ver( $rel ) {
	$file = RENEE_DIR . $rel;
	return file_exists( $file ) ? (string) filemtime( $file ) : RENEE_VERSION;
}

/** Contextul de magazin: Meniu, produs, coş, catering. Woo vine în Faza 3. */
function renee_is_shop_context() {
	if ( function_exists( 'is_woocommerce' ) && ( is_woocommerce() || is_cart() ) ) { return true; }
	return is_page_template( array( 'page-catering.php', 'page-cos.php' ) );
}

function renee_enqueue() {
	// Zero jQuery pe front — necondiţionat (spec §0). Admin-ul nu e atins.
	if ( ! is_admin() ) {
		wp_deregister_script( 'jquery' );
		wp_deregister_script( 'jquery-core' );
		wp_deregister_script( 'jquery-migrate' );
	}

	wp_enqueue_style( 'renee-main', RENEE_URI . '/assets/css/main.min.css', array(), renee_asset_ver( '/assets/css/main.min.css' ) );
	if ( renee_is_shop_context() ) {
		wp_enqueue_style( 'renee-shop', RENEE_URI . '/assets/css/shop.min.css', array( 'renee-main' ), renee_asset_ver( '/assets/css/shop.min.css' ) );
	}

	wp_enqueue_script( 'renee-main', RENEE_URI . '/assets/js/main.js', array(), renee_asset_ver( '/assets/js/main.js' ), array( 'strategy' => 'defer', 'in_footer' => true ) );

	// renee-config: tot ce are JS-ul nevoie de la PHP. Şirurile trec prin __() ca să le vadă WPML (spec §3).
	$config = array(
		'restUrl' => esc_url_raw( rest_url( 'renee/v1/' ) ),
		'nonce'   => wp_create_nonce( 'wp_rest' ),
		'lang'    => function_exists( 'apply_filters' ) ? apply_filters( 'wpml_current_language', substr( get_locale(), 0, 2 ) ) : 'ro',
		'i18n'    => array(
			'menuOpen'  => __( 'Deschide meniul', 'renee' ),
			'menuClose' => __( 'Închide meniul', 'renee' ),
		),
	);
	wp_add_inline_script( 'renee-main', 'window.reneeConfig=' . wp_json_encode( $config ) . ';', 'before' );
}
add_action( 'wp_enqueue_scripts', 'renee_enqueue', 20 );

/** Preload pe cele două fonturi critice (CLAUDE.md §5). */
function renee_preload_fonts() {
	foreach ( array( 'cormorant-400-latin.woff2', 'opensans-300-latin.woff2' ) as $f ) {
		printf( '<link rel="preload" href="%s" as="font" type="font/woff2" crossorigin>' . "\n", esc_url( RENEE_URI . '/assets/fonts/' . $f ) );
	}
}
add_action( 'wp_head', 'renee_preload_fonts', 1 );
```

- [ ] **Step 2: `inc/cleanup.php`**

```php
<?php
/**
 * Scoate ce WordPress încarcă degeaba pe front (spec §3, §8.1).
 */
defined( 'ABSPATH' ) || exit;

add_action( 'init', function () {
	remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
	remove_action( 'wp_print_styles', 'print_emoji_styles' );
	remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
	remove_action( 'admin_print_styles', 'print_emoji_styles' );
	remove_action( 'wp_head', 'wp_generator' );
	remove_action( 'wp_head', 'wlwmanifest_link' );
	remove_action( 'wp_head', 'rsd_link' );
	remove_action( 'wp_head', 'wp_shortlink_wp_head' );
	remove_action( 'wp_head', 'rest_output_link_wp_head' );
	remove_action( 'wp_head', 'wp_oembed_add_discovery_links' );
	remove_action( 'wp_head', 'wp_oembed_add_host_js' );
	remove_action( 'wp_head', 'feed_links_extra', 3 );
	add_filter( 'emoji_svg_url', '__return_false' );
} );

add_action( 'wp_enqueue_scripts', function () {
	wp_dequeue_script( 'wp-embed' );
	if ( ! is_user_logged_in() ) {
		wp_dequeue_style( 'dashicons' );
		wp_deregister_script( 'heartbeat' );
	}
	// Stilurile de bloc: articolele se scriu cu stilurile noastre. Dacă un articol le cere, se revine aici.
	wp_dequeue_style( 'wp-block-library' );
	wp_dequeue_style( 'wp-block-library-theme' );
	wp_dequeue_style( 'global-styles' );
	wp_dequeue_style( 'classic-theme-styles' );
}, 100 );

// Fără inline SVG filters/duotone injectate de core în body.
remove_action( 'wp_body_open', 'wp_global_styles_render_svg_filters' );
```

- [ ] **Step 3: `inc/security.php`** (spec §9.1, partea de temă)

```php
<?php
/**
 * Header-e HTTP, XML-RPC, REST users, informaţii de versiune. Restul (wp-config, login) în Faza 6.
 */
defined( 'ABSPATH' ) || exit;

add_action( 'send_headers', function () {
	if ( is_admin() ) { return; }
	header( 'X-Frame-Options: SAMEORIGIN' );
	header( 'X-Content-Type-Options: nosniff' );
	header( 'Referrer-Policy: strict-origin-when-cross-origin' );
	header( 'Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()' );
	// CSP în report-only până se vede ce încarcă WPML şi Rank Math (spec §9.1). Enforce în Faza 6.
	header( "Content-Security-Policy-Report-Only: default-src 'self'; img-src 'self' data: https:; media-src 'self' https:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; frame-src https://www.google.com https://maps.google.com; font-src 'self'" );
} );

add_filter( 'xmlrpc_enabled', '__return_false' );
add_filter( 'the_generator', '__return_empty_string' );

// /wp-json/wp/v2/users doar pentru autentificaţi.
add_filter( 'rest_endpoints', function ( $endpoints ) {
	if ( is_user_logged_in() ) { return $endpoints; }
	unset( $endpoints['/wp/v2/users'], $endpoints['/wp/v2/users/(?P<id>[\d]+)'] );
	return $endpoints;
} );

// ?author=N nu dezvăluie utilizatori.
add_action( 'template_redirect', function () {
	if ( is_author() && ! is_user_logged_in() ) { wp_safe_redirect( home_url( '/' ), 301 ); exit; }
} );

// Versiunea nu apare în URL-urile de assets ale core-ului.
add_filter( 'style_loader_src', 'renee_strip_core_ver', 10, 2 );
add_filter( 'script_loader_src', 'renee_strip_core_ver', 10, 2 );
function renee_strip_core_ver( $src, $handle ) {
	if ( strpos( $src, 'ver=' . get_bloginfo( 'version' ) ) !== false ) { $src = remove_query_arg( 'ver', $src ); }
	return $src;
}
```

- [ ] **Step 4: Adaugă în `functions.php`**

```php
require RENEE_DIR . '/inc/enqueue.php';
require RENEE_DIR . '/inc/cleanup.php';
require RENEE_DIR . '/inc/security.php';
```

- [ ] **Step 5: Verifică**

```bash
for f in enqueue cleanup security; do php -l "$THEME/inc/$f.php"; done
curl -sI http://renee.local/ | grep -iE "x-frame|nosniff|referrer|permissions|content-security"
curl -s http://renee.local/ | grep -ciE "jquery"          # 0
curl -s http://renee.local/ | grep -c "main.min.css"      # 1
curl -s http://renee.local/ | grep -c 'rel="preload"'     # 2
curl -s http://renee.local/ | grep -c "reneeConfig"       # 1
```
Expected: cele 5 header-e prezente; `jquery` 0; restul 1/1/2/1.

- [ ] **Step 6: Commit** (Sergiu): `feat(tema): enqueue fără jQuery, cleanup, header-e de securitate, renee-config`.

---

### Task 6: Opțiunile „Setări Renée" în SCF

**Files:**
- Create: `$THEME/inc/fields.php`, `$THEME/acf-json/group_renee_setari.json`, `$THEME/inc/template-tags.php`
- Modify: `$THEME/functions.php`

**Interfaces:**
- Produces: `renee_setting( string $name, $default = '' )` care citește din options page-ul `renee-setari` (sau `$default` dacă SCF lipsește); `renee_locatii()` care returnează array de rânduri sau `[]`; cheile de câmp: `telefon_principal`, `email_rezervari`, `email_contact`, `email_comenzi`, `tagline`, `social` (grup: `instagram`, `facebook`, `tiktok`), `locatii` (repeater: `nume`, `adresa`, `program`, `telefon`, `email`, `harta_embed`, `poza`, `lat`, `lng`), `logo_plata` (repeater: `imagine`, `alt`), `catering_termen`, `catering_conditii`.

- [ ] **Step 1: Instalează SCF în Local** (Site Shell): `wp plugin install secure-custom-fields --activate` și Query Monitor: `wp plugin install query-monitor --activate`.

- [ ] **Step 2: `inc/fields.php`**

```php
<?php
/**
 * SCF: options page „Setări Renée" + încărcare/salvare field groups din acf-json/ (spec §4).
 */
defined( 'ABSPATH' ) || exit;

add_filter( 'acf/settings/save_json', fn() => RENEE_DIR . '/acf-json' );
add_filter( 'acf/settings/load_json', function ( $paths ) { $paths[] = RENEE_DIR . '/acf-json'; return $paths; } );

add_action( 'acf/init', function () {
	if ( ! function_exists( 'acf_add_options_page' ) ) { return; }
	acf_add_options_page( array(
		'page_title' => __( 'Setări Renée', 'renee' ),
		'menu_title' => __( 'Setări Renée', 'renee' ),
		'menu_slug'  => 'renee-setari',
		'capability' => 'manage_options',
		'position'   => 59,
		'icon_url'   => 'dashicons-coffee',
		'redirect'   => false,
	) );
} );
```

- [ ] **Step 3: `inc/template-tags.php`**

```php
<?php
/**
 * Helpere de citire şi afişare. Nimic din admin nu se citeşte direct în template.
 */
defined( 'ABSPATH' ) || exit;

function renee_setting( string $name, $default = '' ) {
	if ( ! function_exists( 'get_field' ) ) { return $default; }
	$v = get_field( $name, 'option' );
	return ( null === $v || '' === $v ) ? $default : $v;
}

/** @return array<int, array<string, mixed>> */
function renee_locatii(): array {
	$rows = renee_setting( 'locatii', array() );
	return is_array( $rows ) ? $rows : array();
}

/** Logo inline din assets/img, cu currentColor. Fişierele sunt SVG-uri proprii, sigure. */
function renee_inline_svg( string $file, string $class = '' ): void {
	$path = RENEE_DIR . '/assets/img/' . basename( $file );
	if ( ! is_readable( $path ) ) { return; }
	$svg = file_get_contents( $path );
	if ( $class ) { $svg = preg_replace( '/<svg\b/', '<svg class="' . esc_attr( $class ) . '" aria-hidden="true" focusable="false"', $svg, 1 ); }
	echo $svg; // SVG static din temă, nu din input. phpcs:ignore WordPress.Security.EscapeOutput
}

function renee_tel_href( string $tel ): string {
	return 'tel:' . preg_replace( '/[^0-9+]/', '', $tel );
}
```

- [ ] **Step 4: `acf-json/group_renee_setari.json`** — creează grupul **din admin** (SCF → Field Groups → Add New, „Setări Renée", location: Options Page = Setări Renée) cu câmpurile din Interfaces, exact cu acele `name`. La salvare SCF scrie JSON-ul în `acf-json/` (pasul 2 a setat calea). Verifică:

```bash
ls "$THEME/acf-json" && python3 -c "import json,sys; g=json.load(open(sys.argv[1])); print(g['title'], [f['name'] for f in g['fields']])" "$THEME"/acf-json/group_*.json
```
Expected: `Setări Renée ['telefon_principal', 'email_rezervari', 'email_contact', 'email_comenzi', 'tagline', 'social', 'locatii', 'logo_plata', 'catering_termen', 'catering_conditii']`. Redenumește fișierul în `group_renee_setari.json` **și** cheia `key` din JSON în `group_renee_setari`, ca să nu depindă de un ID generat.

- [ ] **Step 5: Adaugă în `functions.php`**

```php
require RENEE_DIR . '/inc/fields.php';
require RENEE_DIR . '/inc/template-tags.php';
```

- [ ] **Step 6: Completează în admin, pentru test, doar ce e REAL** (CLAUDE.md §7): adresele celor două locații, Instagram `https://www.instagram.com/renee_brunch/`, telefonul `+373 78 784 040`. Programul, e-mailurile și Facebook/TikTok rămân goale — sunt neconfirmate. Verifică în Site Shell: `wp eval 'print_r(renee_locatii());'` → două rânduri.

- [ ] **Step 7: Commit** (Sergiu): `feat(scf): options page Setări Renée, field group în acf-json, helpere`.

---

### Task 7: `header.php` cu nav, dropdown, acțiuni

**Files:**
- Create: `$THEME/header.php`, `$THEME/inc/class-renee-nav-walker.php`, `$THEME/template-parts/header/nav.php`, `actions.php`, `lang-switcher.php`
- Modify: `$THEME/functions.php`

**Interfaces:**
- Consumes: meniul `principal` (Task 2), `renee_inline_svg()`, `renee_setting()` (Task 6).
- Produces: markup identic cu `$PROTO/PARTIALS.md` §4: `header#header > a.logo + nav#nav + div.header-actions`; sub-itemul din meniu iese ca `div.nav-item > a + ul.nav-sub > li > a`.

- [ ] **Step 1: `inc/class-renee-nav-walker.php`** — walker care produce structura dropdown-ului din prototip (PARTIALS §4.1), fără Bootstrap:

```php
<?php
/**
 * Walker pentru meniul principal: un nivel de sub-meniu, ca div.nav-item > a + ul.nav-sub (PARTIALS.md §4.1).
 */
defined( 'ABSPATH' ) || exit;

class Renee_Nav_Walker extends Walker_Nav_Menu {
	public function start_lvl( &$output, $depth = 0, $args = null ) { $output .= '<ul class="nav-sub">'; }
	public function end_lvl( &$output, $depth = 0, $args = null )   { $output .= '</ul></div>'; }

	public function start_el( &$output, $item, $depth = 0, $args = null, $id = 0 ) {
		$classes = empty( $item->classes ) ? array() : (array) $item->classes;
		$has_children = in_array( 'menu-item-has-children', $classes, true );
		$is_current   = (bool) array_intersect( array( 'current-menu-item', 'current-menu-ancestor', 'current-menu-parent' ), $classes );

		$attrs  = ' href="' . esc_url( $item->url ) . '"';
		$attrs .= $is_current ? ' class="is-current" aria-current="page"' : '';
		if ( ! empty( $item->target ) )  { $attrs .= ' target="' . esc_attr( $item->target ) . '"'; }
		if ( ! empty( $item->xfn ) )     { $attrs .= ' rel="' . esc_attr( $item->xfn ) . '"'; }

		if ( 0 === $depth && $has_children ) { $output .= '<div class="nav-item">'; }
		if ( 1 === $depth ) { $output .= '<li>'; }
		$output .= '<a' . $attrs . '>' . esc_html( $item->title ) . '</a>';
	}

	public function end_el( &$output, $item, $depth = 0, $args = null ) {
		if ( 1 === $depth ) { $output .= '</li>'; }
	}
}
```
Nota pentru cine implementează: `end_lvl` închide și `div.nav-item`, fiindcă `start_el` la depth 0 cu copii l-a deschis și WordPress apelează `end_lvl` înainte de `end_el`-ul părintelui. Testat mai jos.

- [ ] **Step 2: `template-parts/header/nav.php`**

```php
<?php defined( 'ABSPATH' ) || exit; ?>
<nav id="nav" aria-label="<?php esc_attr_e( 'Meniu principal', 'renee' ); ?>">
	<?php
	wp_nav_menu( array(
		'theme_location' => 'principal',
		'container'      => false,
		'items_wrap'     => '%3$s',
		'walker'         => new Renee_Nav_Walker(),
		'fallback_cb'    => false,
		'depth'          => 2,
	) );
	$social = renee_setting( 'social', array() );
	$links  = array_filter( array(
		'Instagram' => $social['instagram'] ?? '',
		'Facebook'  => $social['facebook'] ?? '',
		'TikTok'    => $social['tiktok'] ?? '',
	) );
	if ( $links ) : ?>
		<div class="nav-social">
			<?php foreach ( $links as $label => $url ) : ?>
				<a href="<?php echo esc_url( $url ); ?>" target="_blank" rel="noopener"><?php echo esc_html( $label ); ?></a>
			<?php endforeach; ?>
		</div>
	<?php endif; ?>
</nav>
```

- [ ] **Step 3: `template-parts/header/actions.php`** — butonul de rezervare (iconița SVG din PARTIALS §4), badge-ul de coș (doar dacă Woo e activ; Faza 3), switcher-ul, burgerul:

```php
<?php defined( 'ABSPATH' ) || exit; ?>
<div class="header-actions">
	<a class="btn-rez" href="#rezervare" data-rez aria-label="<?php esc_attr_e( 'Rezervă o masă', 'renee' ); ?>">
		<svg class="rez-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 9.5h17M8 3.5v3M16 3.5v3"/><path d="M9 14.5l2.2 2.2 4-4.4"/></svg>
		<span class="rez-txt"><?php esc_html_e( 'Rezervări', 'renee' ); ?></span>
	</a>
	<?php if ( function_exists( 'WC' ) && WC()->cart ) : ?>
		<a class="cart-link" href="<?php echo esc_url( wc_get_cart_url() ); ?>" aria-label="<?php esc_attr_e( 'Coș', 'renee' ); ?>">
			<svg class="cart-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5h2l1.5 11.5a1.5 1.5 0 0 0 1.5 1.3h7.8a1.5 1.5 0 0 0 1.5-1.2L21 8H7"/><circle cx="10" cy="21" r="1.2"/><circle cx="18" cy="21" r="1.2"/></svg>
			<span class="cart-count" id="cartCount"><?php echo (int) WC()->cart->get_cart_contents_count(); ?></span>
		</a>
	<?php endif; ?>
	<?php get_template_part( 'template-parts/header/lang-switcher' ); ?>
	<button class="burger" id="burger" aria-label="<?php esc_attr_e( 'Deschide meniul', 'renee' ); ?>" aria-expanded="false" aria-controls="nav">
		<span class="burger-ico" aria-hidden="true"></span>
	</button>
</div>
```

- [ ] **Step 4: `template-parts/header/lang-switcher.php`** — până la Faza 5 e static, doar RO, dar cu markup-ul final (PARTIALS §4). Când WPML e activ, `wpml_active_languages` îl populează:

```php
<?php
defined( 'ABSPATH' ) || exit;
$langs = apply_filters( 'wpml_active_languages', null, array( 'skip_missing' => 0 ) );
if ( empty( $langs ) ) { $langs = array( 'ro' => array( 'code' => 'ro', 'url' => home_url( '/' ), 'active' => 1 ) ); }
$current = strtoupper( array_values( array_filter( $langs, fn( $l ) => ! empty( $l['active'] ) ) )[0]['code'] ?? 'ro' );
?>
<div class="lang">
	<button type="button" class="lang-toggle" aria-haspopup="listbox" aria-expanded="false">
		<span class="lang-curent"><?php echo esc_html( $current ); ?></span><i class="lang-chev" aria-hidden="true"></i>
	</button>
	<ul class="lang-list" role="listbox" aria-label="<?php esc_attr_e( 'Limbă', 'renee' ); ?>">
		<?php foreach ( $langs as $l ) : ?>
			<li role="option" aria-selected="<?php echo empty( $l['active'] ) ? 'false' : 'true'; ?>" data-lang="<?php echo esc_attr( $l['code'] ); ?>">
				<a href="<?php echo esc_url( $l['url'] ); ?>"><?php echo esc_html( strtoupper( $l['code'] ) ); ?></a>
			</li>
		<?php endforeach; ?>
	</ul>
</div>
```

- [ ] **Step 5: `header.php`**

```php
<?php defined( 'ABSPATH' ) || exit; ?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<?php wp_head(); ?>
</head>
<body <?php body_class( is_front_page() ? '' : 'subpage' ); ?>>
<?php wp_body_open(); ?>
<header id="header">
	<a class="logo" href="<?php echo esc_url( home_url( '/' ) ); ?>#top">
		<?php renee_inline_svg( 'logo_simple.svg', 'logo-svg' ); ?>
		<span class="sr-only"><?php bloginfo( 'name' ); ?></span>
	</a>
	<?php get_template_part( 'template-parts/header/nav' ); ?>
	<?php get_template_part( 'template-parts/header/actions' ); ?>
</header>
```
`require RENEE_DIR . '/inc/class-renee-nav-walker.php';` în `functions.php`.

- [ ] **Step 6: Creează meniul în Local** (Site Shell) și testează walker-ul:

```bash
wp menu create "Principal" && wp menu location assign principal principal
for p in despre meniu evenimente catering blog contact; do wp post create --post_type=page --post_status=publish --post_title="$p" --post_name="$p" --porcelain; done
wp menu item add-post principal $(wp post list --post_type=page --name=despre --field=ID)
wp menu item add-post principal $(wp post list --post_type=page --name=meniu --field=ID)
EV=$(wp menu item add-post principal $(wp post list --post_type=page --name=evenimente --field=ID) --porcelain)
wp menu item add-post principal $(wp post list --post_type=page --name=catering --field=ID) --parent-id=$EV
wp menu item add-post principal $(wp post list --post_type=page --name=blog --field=ID)
wp menu item add-post principal $(wp post list --post_type=page --name=contact --field=ID)
```
(Paginile sunt goale, primesc conținut în Faza 2; seed-ul le va recunoaște după slug.)

```bash
curl -s http://renee.local/catering/ | grep -o '<div class="nav-item">.*</div>' | head -c 400
curl -s http://renee.local/catering/ | grep -c 'is-current'   # 2: Evenimente (ancestor) + Catering
```
Expected: `<div class="nav-item"><a href="…/evenimente/" class="is-current" aria-current="page">evenimente</a><ul class="nav-sub"><li><a href="…/catering/" class="is-current" …>catering</a></li></ul></div>`.

- [ ] **Step 7: Commit** (Sergiu): `feat(tema): header.php, nav walker cu dropdown, acțiuni, switcher static`.

---

### Task 8: `footer.php` din „Setări Renée"

**Files:**
- Create: `$THEME/footer.php`, `$THEME/template-parts/footer/brand.php`, `links.php`, `info.php`, `bottom.php`

**Interfaces:**
- Consumes: `renee_setting()`, `renee_locatii()`, `renee_inline_svg()`, `renee_tel_href()`, meniul `footer`.
- Produces: markup identic cu PARTIALS §5, cu datele din opțiuni; câmpurile goale nu produc markup gol.

- [ ] **Step 1: `template-parts/footer/brand.php`**

```php
<?php defined( 'ABSPATH' ) || exit;
$social = renee_setting( 'social', array() );
$links  = array_filter( array( 'Instagram' => $social['instagram'] ?? '', 'Facebook' => $social['facebook'] ?? '', 'TikTok' => $social['tiktok'] ?? '' ) );
$plata  = renee_setting( 'logo_plata', array() );
?>
<div class="footer-col footer-brand">
	<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="footer-logo"><?php renee_inline_svg( 'logo.svg', 'footer-logo-svg' ); ?><span class="sr-only"><?php bloginfo( 'name' ); ?></span></a>
	<?php if ( $tag = renee_setting( 'tagline' ) ) : ?><p class="footer-tagline"><?php echo esc_html( $tag ); ?></p><?php endif; ?>
	<?php if ( $links ) : ?>
		<div class="footer-social"><?php foreach ( $links as $label => $url ) : ?>
			<a href="<?php echo esc_url( $url ); ?>" target="_blank" rel="noopener"><?php echo esc_html( $label ); ?></a>
		<?php endforeach; ?></div>
	<?php endif; ?>
	<?php if ( is_array( $plata ) && $plata ) : ?>
		<!-- Logo-uri terţe: <img>, nu SVG inline; nu se recolorează (CLAUDE.md §5) -->
		<div class="footer-plata">
			<span class="plata-titlu"><?php esc_html_e( 'Metode de plată', 'renee' ); ?></span>
			<div class="plata-logos"><?php foreach ( $plata as $row ) :
				$img = $row['imagine'] ?? null; if ( ! $img ) { continue; } ?>
				<span class="plata-logo"><img src="<?php echo esc_url( $img['url'] ); ?>" alt="<?php echo esc_attr( $row['alt'] ?? $img['alt'] ?? '' ); ?>" width="<?php echo (int) $img['width']; ?>" height="<?php echo (int) $img['height']; ?>" loading="lazy"></span>
			<?php endforeach; ?></div>
		</div>
	<?php endif; ?>
</div>
```

- [ ] **Step 2: `links.php`, `info.php`, `bottom.php`**

```php
<?php // links.php
defined( 'ABSPATH' ) || exit;
if ( ! has_nav_menu( 'footer' ) ) { return; } ?>
<div class="footer-col">
	<h4><?php esc_html_e( 'Explorează', 'renee' ); ?></h4>
	<?php wp_nav_menu( array( 'theme_location' => 'footer', 'container' => 'nav', 'container_class' => 'footer-links', 'items_wrap' => '%3$s', 'depth' => 1, 'walker' => new Renee_Nav_Walker(), 'fallback_cb' => false ) ); ?>
</div>
```
```php
<?php // info.php
defined( 'ABSPATH' ) || exit;
$loc = renee_locatii(); $tel = renee_setting( 'telefon_principal' );
if ( ! $loc && ! $tel ) { return; } ?>
<div class="footer-col footer-info">
	<h4><?php esc_html_e( 'Vino la noi', 'renee' ); ?></h4>
	<?php foreach ( $loc as $l ) : if ( empty( $l['adresa'] ) ) { continue; } ?>
		<p><span class="fi-label"><?php echo esc_html( $l['nume'] ?? '' ); ?></span><?php echo esc_html( $l['adresa'] ); ?></p>
	<?php endforeach; ?>
	<?php if ( $tel ) : ?><a href="<?php echo esc_attr( renee_tel_href( $tel ) ); ?>"><?php echo esc_html( $tel ); ?></a><?php endif; ?>
</div>
```
```php
<?php // bottom.php
defined( 'ABSPATH' ) || exit;
$privacy = get_privacy_policy_url(); $termeni = get_page_by_path( 'termeni' ); ?>
<div class="footer-bottom">
	<span class="footer-meta">© <?php echo esc_html( gmdate( 'Y' ) ); ?> <?php bloginfo( 'name' ); ?> · Chișinău</span>
	<div class="footer-meta">
		<?php if ( $termeni ) : ?><a href="<?php echo esc_url( get_permalink( $termeni ) ); ?>"><?php esc_html_e( 'Termeni și condiții', 'renee' ); ?></a><?php endif; ?>
		<?php if ( $termeni && $privacy ) : ?> | <?php endif; ?>
		<?php if ( $privacy ) : ?><a href="<?php echo esc_url( $privacy ); ?>"><?php esc_html_e( 'Politică de confidențialitate', 'renee' ); ?></a><?php endif; ?>
	</div>
	<span class="footer-meta"><?php esc_html_e( 'Toate drepturile rezervate', 'renee' ); ?></span>
</div>
```
Programul nu apare în footer în această fază: e marcat DRAFT în prototip și neconfirmat (CLAUDE.md §7). Intră când clientul îl confirmă, per locație, din `locatii[].program`.

- [ ] **Step 3: `footer.php`**

```php
<?php defined( 'ABSPATH' ) || exit; ?>
<footer>
	<div class="wrap">
		<div class="footer-top">
			<?php get_template_part( 'template-parts/footer/brand' ); ?>
			<?php get_template_part( 'template-parts/footer/links' ); ?>
			<?php get_template_part( 'template-parts/footer/info' ); ?>
		</div>
		<?php get_template_part( 'template-parts/footer/bottom' ); ?>
	</div>
</footer>
<?php wp_footer(); ?>
</body>
</html>
```

- [ ] **Step 4: Meniul de footer și verificare**

```bash
wp menu create "Footer" && wp menu location assign footer footer
for p in despre meniu evenimente catering blog contact; do wp menu item add-post footer $(wp post list --post_type=page --name=$p --field=ID); done
curl -s http://renee.local/ | grep -c 'class="footer-col'      # 3
curl -s http://renee.local/ | grep -c 'footer-plata'            # 0 până se încarcă logo-urile în admin
curl -s http://renee.local/ | grep -c 'renee_brunch'            # 2 (nav-social + footer-social)
```

- [ ] **Step 5: Încarcă în admin logo-urile de plată** din `assets/img/{visa,mastercard,moldindconbank_logo}.svg` în Media și adaugă-le în `logo_plata` (SVG upload e blocat implicit: activează temporar prin `add_filter('upload_mimes', fn($m)=>$m+['svg'=>'image/svg+xml'])` în `inc/setup.php`, **doar pentru administratori**: `if ( current_user_can('manage_options') )`). Verifică `grep -c 'footer-plata'` → 1.

- [ ] **Step 6: Commit** (Sergiu): `feat(tema): footer din Setări Renée, meniul Explorează, logo-uri de plată`.

---

### Task 9: `main.js`, `404.php`, `page.php`

**Files:**
- Create: `$THEME/assets/js/main.js`, `$THEME/404.php`, `$THEME/page.php`
- Copy-adapt: din `$PROTO/js/main.js`

**Interfaces:**
- Consumes: `window.reneeConfig` (Task 5).
- Produces: `window.reneeReveal(container)`, `window.reneeChipReveal(bar, chip)`, `--header-h` pe `:root` (folosite în Faza 3).

- [ ] **Step 1: `assets/js/main.js`** — copiază `$PROTO/js/main.js` și aplică exact aceste modificări:
  1. **Șterge** blocul „ELEMENT ACTIV ÎN MENIU" (`PARINTE`, `is-current` din JS): WordPress pune `is-current` prin walker (Task 7).
  2. **Șterge** blocul de hero/marquee/parallax/testimoniale (vin în Faza 2 cu home-ul); păstrează: header `.scrolled`, `--header-h` cu recalcul la scroll, `setMenu()` cu clasa pe burger, dropdown-ul (hover e CSS; JS doar pentru tastatură/touch dacă există), switcher-ul de limbă (deschide/închide lista; **nu** mai comută „starea activă" fals, link-urile navighează), reveal cu IntersectionObserver expus ca `window.reneeReveal`, lightbox, `reneeChipReveal`.
  3. Textele: `burger.setAttribute('aria-label', open ? reneeConfig.i18n.menuClose : reneeConfig.i18n.menuOpen)`.
  4. La final: `'use strict'` în IIFE, fără variabile globale în afara celor două funcții expuse.

- [ ] **Step 2: `404.php` și `page.php`**

```php
<?php // 404.php
defined( 'ABSPATH' ) || exit; get_header(); ?>
<main id="main" class="section"><div class="wrap" style="text-align:center">
	<?php renee_inline_svg( 'logo_symbol.svg', 'hero-icon' ); ?>
	<p class="eyebrow" style="justify-content:center">404</p>
	<h1 class="h2"><?php esc_html_e( 'Pagina asta nu e în meniu', 'renee' ); ?></h1>
	<div class="cta-row" style="justify-content:center">
		<a class="btn-solid" href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Înapoi acasă', 'renee' ); ?></a>
		<a class="btn-outline" href="<?php echo esc_url( home_url( '/meniu/' ) ); ?>"><?php esc_html_e( 'Vezi meniul', 'renee' ); ?></a>
	</div>
</div></main>
<?php get_footer();
```
(Cele două `style=""` de centrare sunt singurele inline admise aici; devin clasa `.center` în Faza 2 când apare `sections/`.)

```php
<?php // page.php — pagină generică; paginile cu design primesc page-<slug>.php în Faza 2
defined( 'ABSPATH' ) || exit; get_header(); ?>
<main id="main" class="section"><div class="wrap">
	<?php while ( have_posts() ) : the_post(); ?>
		<h1 class="h2"><?php the_title(); ?></h1>
		<div class="prose"><?php the_content(); ?></div>
	<?php endwhile; ?>
</div></main>
<?php get_footer();
```

- [ ] **Step 3: Verifică în browser (panoul de browser sau Chrome), la 1440 și 375**

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://renee.local/nu-exista/    # 404
```
În pagină: header solid pe subpagină, dropdown Evenimente › Catering la hover, burger deschide overlay-ul la 375 cu sub-itemul desfășurat, `--header-h` trece de la 88 la 72 la scroll, switcher-ul deschide lista, consola fără erori, **fără `jquery` în Network**, Query Monitor fără erori PHP și fără interogări duplicate.

- [ ] **Step 4: Commit** (Sergiu): `feat(tema): main.js portat fără starea activă din JS, 404, page.php`.

---

### Task 10: Verificare de fază, măsurători, jurnal

**Files:**
- Modify: `$REPO/docs/PERFORMANTA.md`, `$REPO/docs/JURNAL-SESIUNI.md`, `$PROTO/JURNAL-SESIUNI.md`

- [ ] **Step 1: Lista de control a fazei** — bifează fiecare, cu comanda:

| Verificare | Comandă / loc | Așteptat |
|---|---|---|
| tema activă | `wp theme list --status=active` | `renee` |
| zero jQuery | `curl -s http://renee.local/ \| grep -ci jquery` | 0 |
| header-e | `curl -sI http://renee.local/ \| grep -ci "x-frame\|nosniff\|referrer\|permissions\|security-policy"` | 5 |
| CSS buget | `ls -la $THEME/assets/css` | `main.min.css` < 40 KB |
| fonturi | Network în browser pe `/despre/` | 12 fișiere woff2, toate din `renee.local` |
| meniu + dropdown | `curl -s http://renee.local/catering/ \| grep -c nav-sub` | 1 |
| stare activă | `curl -s http://renee.local/catering/ \| grep -c is-current` | 2 |
| footer | `curl -s http://renee.local/ \| grep -c footer-col` | 3 |
| mobil | 375px în browser, toate paginile create | fără overflow orizontal |
| Query Monitor | bara QM pe `/despre/` | 0 erori, 0 interogări duplicate, < 30 interogări |
| `php -l` | pe toate fișierele din temă | fără erori |

- [ ] **Step 2: Prima linie în `docs/PERFORMANTA.md`** — Lighthouse pe `/despre/` (pagină goală, doar header+footer), mobil, din Chrome DevTools: scor, LCP, CLS, greutate. E linia de bază; tot ce vine după se compară cu ea.

- [ ] **Step 3: Jurnalul din `renee-wp`** — intrarea zilei: făcut, nu am putut, pentru cealaltă sesiune (ce urmează: Faza 2), întrebări pentru Sergiu (programul pe locații, e-mailurile, Facebook/TikTok, textul din tagline).

- [ ] **Step 4: Jurnalul din prototip** — o intrare scurtă: „18 sept.: arhitectura WP decisă, spec și planul Fazei 1 în `docs/superpowers/`. Lucrul continuă în repo-ul `renee-wp`. Prototipul e înghețat ca referință de design."

- [ ] **Step 5: Commit** (Sergiu), în ambele repo-uri.

---

## Self-review

**Acoperire spec (secțiunile Fazei 1):** §1.1 repo → Task 1 · §1.2 schelet → Task 2, 5, 6, 7, 8, 9 · §1.3 symlink → Task 1 pas 7 · §2 tokeni, breakpoint-uri, mixin-uri, bundle-uri, build, buget → Task 3, 4 · §3 enqueue fără jQuery, defer, `renee-config`, cleanup → Task 5, 9 · §4 options „Setări Renée" → Task 6 (câmpurile pe pagini și seed-ul sunt Faza 2, intenționat) · §9.1 header-e, XML-RPC, REST users, autor → Task 5 · §11 documente și jurnal → Task 1, 10. Neacoperit în această fază, cu intenție: home și paginile (Faza 2), Woo (3), formulare și coș (4), WPML (5), LiteSpeed și deploy (6).

**Placeholder-e:** niciun „TBD"; pașii de copiere din prototip indică fișierul, markerii și liniile. Task 6 pasul 4 cere crearea grupului din admin, fiindcă JSON-ul SCF complet are ~400 de linii generate; numele câmpurilor sunt fixate în Interfaces.

**Consistență de nume:** `renee_setting()`, `renee_locatii()`, `renee_inline_svg()`, `renee_tel_href()` definite în Task 6 și folosite în 7, 8, 9 cu aceleași semnături. `Renee_Nav_Walker` definit în 7, folosit în 8. Handle-urile `renee-main`, `renee-shop` din Task 5. Cheile de câmp din Task 6 Interfaces sunt cele citite în Task 8. `window.reneeConfig.i18n.menuOpen/menuClose` produse în 5, consumate în 9.
