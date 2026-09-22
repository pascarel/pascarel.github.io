# Renée WP — Faza 2: pagini, SCF, seed · plan de implementare

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Home, Despre, Evenimente, Contact, Blog și Articol randează în Local cu designul prototipului, conținutul vine din câmpuri SCF, iar `wp renee seed` populează paginile, opțiunile, meniurile și articolele draft dintr-un `content.json` versionat.

**Architecture:** Fiecare secțiune din prototip devine un template-part cu același nume, care citește câmpuri SCF definite în `acf-json/`. CSS-ul rămas din prototip e portat verbatim în partiale `scss/sections/`. JS-ul de home (hero, marquee, parallax, testimoniale, video) și cel de partajare stau în fișiere proprii, încărcate doar unde e nevoie. Seed-ul e o comandă WP-CLI idempotentă în temă.

**Tech Stack:** WordPress 6.4+, PHP 8.2, SCF, WooCommerce (doar citire de produse pentru „Momentele zilei" și „Meniu" de pe home), `sass` CLI, WP-CLI, Query Monitor.

**Spec:** `projects/renee_v1/docs/superpowers/specs/2026-09-18-renee-wp-tema-design.md` — §2, §3, §4, §11. Faza 1 (planul `2026-09-18-renee-wp-faza-1-schelet.md`) e livrată pe `main` @ `1657f5e`.

## Global Constraints

- Tema `renee`, text domain `renee`, prefix `renee_`, meta `renee_`. (spec §11.12)
- **Zero jQuery. Zero framework CSS.** PHP randează tot conținutul; JS doar animă. (spec §0, §3)
- CSS: **copie fidelă** din prototip (`$PROTO/css/main.css`, `$PROTO/css/shop.css`), media query-urile mutate în partialul clasei prin `@include mq($bp-*)`; `mq()` nu primește niciodată un număr; tokenii doar în `_tokens.scss`. Fără `!important` fără comentariu. `main.min.css` < 40 KB. (spec §2, DECIZII.md)
- Escaping la ieșire (`esc_html`, `esc_attr`, `esc_url`, `wp_kses_post` doar pentru câmpuri WYSIWYG); nimic din `$_GET`/`$_POST` în template. (spec §11.8)
- **Conținutul nu se hardcodează în template.** Vine din SCF sau din seed. Ce lipsește rămâne gol și secțiunea nu se randează; nu se inventează. Textele draft poartă prefixul `[DRAFT]`. (spec §11.7, CLAUDE.md §7)
- **Imaginile Unsplash și video-ul hero NU intră în seed** — câmpurile rămân goale, cu instrucțiuni în admin. Pozele locațiilor (`img_oassis.webp`, `img_urban.webp`) și `interior.webp`, `preview.webp` sunt reale și se importă. (spec §4.3)
- Field groups **numai** în `acf-json/`, chei stabile `group_renee_<pagina>` / `field_renee_<pagina>_<camp>`; numele câmpurilor exact ca în spec §4.2 și în Interfaces. (spec §4.2)
- Nimic creat de `eatme-woo-sync` nu se modifică; produsele se citesc doar. (spec §11.9)
- Fiecare pagină se verifică în Local la 1440 și 375: consolă curată, fără overflow orizontal, Query Monitor fără erori. (spec §11.10)
- Commit-urile: pe branch-ul `faza-2` pornit din `main`, local, fără push. Sergiu îmbină din GitHub Desktop.

## Căi

| Alias | Cale |
|---|---|
| `$PROTO` | `/Users/sergiupascaru/Documents/GitHub/pascarel.github.io/projects/renee_v1` |
| `$REPO` | `/Users/sergiupascaru/Documents/GitHub/renee-wp` |
| `$THEME` | `$REPO/wp-content/themes/renee` |
| `$LOCAL` | `/Users/sergiupascaru/Local Sites/renee/app/public` |
| `wp` | WP-CLI prin **Local → Open Site Shell**, sau wrapper-ul cu PHP-ul Local-ului (vezi Faza 1) |

## Starea Local-ului la pornire (18 sept. 2026, verificată)

- Pagini existente, după slug: `pagina-principala` (ID 402, e deja **front page**), `despre` 407, `evenimente` 412, `contact` 409, `blog` 405, `catering` 413, `meniu` 7 (shop Woo), `cos` 8, `finalizare` 9, `contul-meu` 10, `politica-de-confidentialitate` 3. Seed-ul le găsește după slug și doar le completează.
- 95 de produse Woo importate de `eatme-woo-sync`, 11 categorii. Home-ul poate lega „Momentele zilei" și „Meniu" de produse reale.
- Meniuri `Principal` și `Footer` există (Faza 1). `page_for_posts` nu e setat.
- Plugin-uri active care nu ne privesc încă: WPML (Faza 5), WCML, `wpml-import`, `wpml-media-translation` (de dezactivat, spec §7).

## Structura de fișiere a fazei

```
themes/renee/
├── front-page.php, page-despre.php, page-evenimente.php, page-contact.php, home.php, single.php
├── inc/cli.php                        wp renee seed
├── inc/template-tags.php              + renee_field(), renee_img(), renee_gallery(), renee_products_by_ids(), renee_eyebrow_h2()
├── inc/enqueue.php                    + home.js pe front page, share.js pe single, lightbox doar unde e galerie
├── acf-json/group_renee_setari.json   + instagram (grup), + video_hero_nota (mesaj)
├── acf-json/group_renee_home.json, group_renee_despre.json, group_renee_evenimente.json, group_renee_contact.json, group_renee_articol.json
├── template-parts/
│   ├── shared/section-head.php, instagram.php, gallery.php, lightbox.php, locatii.php, map.php
│   ├── home/hero.php, marquee.php, despre.php, poveste.php, momente.php, meniu.php, galerie.php, testimoniale.php, evenimente.php, blog.php
│   ├── despre/intro.php, valori.php
│   ├── evenimente/hero.php, tipuri.php, servicii.php, cta.php
│   ├── contact/intro.php, mesaj.php
│   ├── blog/card.php, post-hero.php, post-share.php, related.php, pagination.php
│   └── shop/card.php                  cardul de preparat (prezentare; butonul de coş vine în Faza 3)
├── assets/js/home.js, share.js
├── assets/img/interior.webp, preview.webp, img_oassis.webp, img_urban.webp
├── scss/sections/_hero.scss, _marquee.scss, _despre.scss, _momente.scss, _poveste-numele.scss, _testimoniale.scss,
│   _instagram.scss, _valori.scss, _evenimente.scss, _cards.scss, _galerie.scss, _lightbox.scss, _vizita.scss,
│   _locatii.scss, _blog.scss, _post.scss, _page-hero.scss, _forms.scss
├── scss/base/_touch.scss              ţintele de atingere (prototip 1497–1545)
└── seed/content.json, seed/README.md
```

---

### Task 1: Branch, SCSS — secțiunile de home

**Files:**
- Create: `$THEME/scss/sections/_hero.scss`, `_marquee.scss`, `_despre.scss`, `_momente.scss`, `_poveste-numele.scss`, `_testimoniale.scss`, `_instagram.scss`, `_cards.scss`, `_galerie.scss`, `_lightbox.scss`, `_vizita.scss`, `_locatii.scss`, `_blog.scss`
- Modify: `$THEME/scss/main.scss`

**Interfaces:**
- Produces: clasele prototipului neschimbate: `.hero*`, `.scroll-hint`, `.marquee*`, `.despre-*`, `.momente`, `.mom-*`, `.poveste-numele`, `.pn-*`, `.testi*`, `.insta-*`, `.meniu`, `.meniu-head`, `.meniu-note`, `.cards`, `.card*`, `.badge*`, `.alergeni*`, `.card-add`, `.galerie-grid`, `.g-item`, `.g-1..5`, `.g-veil`, `.g-zoom`, `.lightbox`, `.lb-*`, `.vizita*`, `.info-*`, `.map-*`, `.locatii`, `.loc-*`, `.blog-home`, `.product-grid`, `.product-card`, `.pc-*`, `.cl-variation`, `.pd-short`.

- [ ] **Step 1: Branch**

```bash
cd "$REPO" && git checkout main && git pull --ff-only 2>/dev/null; git checkout -b faza-2 && git branch --show-current
```

- [ ] **Step 2: Portează blocurile din `$PROTO/css/main.css`**, fiecare într-un partial, **verbatim**, cu comentariile lor, media query-urile aferente mutate din secțiunea `responsive` (1330→) și din blocurile de la final (1440–1466 și 1548–1606) prin `@include mq($bp-…)`:

| Partial | Blocuri din `main.css` (markeri) | Responsive de adus |
|---|---|---|
| `_hero.scss` | `hero (video)` 268–372 **minus** 288–311 (deja în `_header.scss`) | `.hero-title`, `.hero-sub`, `.hero-meta`, `.scroll-hint` la 900/640 |
| `_marquee.scss` | `marquee` 373–391 | — |
| `_despre.scss` | `despre` 404–421, `despre — două poze` 422–485 | `.despre-grid`, `.despre-photo`, `.despre-foto` la 960 (cu `width:100%`, vezi jurnal 17 sept.) |
| `_momente.scss` | `momentele zilei` 486–546 | `.mom-grid` la 960, `.mom-foto` la 640 |
| `_poveste-numele.scss` | `povestea numelui` 547–581 | `.pn-grid`, `.pn-crono` la 960 |
| `_testimoniale.scss` | `testimoniale` 582–608 | `.testi-dots` din blocul tap-target 1497→ |
| `_instagram.scss` | `instagram` 609–633 | `.insta-grid` la 960 și 640 |
| `_cards.scss` | `text secundar pe fundal cream-2` 392–403, `meniu` 698–736, `badge-uri` 737–754, `subsolul cardului` 755–801, `Cardul are acelaşi fundal…` 1458–1465 | `.cards` la 960/640, `.card-add`, `.alergeni-*` din tap-target |
| `_galerie.scss` | `galerie` 802–841, `.g-1..5` 887–892 | `.g-*` la 960 și 640 |
| `_lightbox.scss` | `lightbox` 842–886 | `.lb-nav` la 640 |
| `_vizita.scss` | `vizita` 893–935, `harta` 688–697, `.map-shield/.map-unlock` 978–1001 | `.vizita-grid`, `.info-row` la 960; `.map-wrap iframe` la 900; `.map-unlock` din tap-target |
| `_locatii.scss` | `locaţii: două rânduri alternate` 936–977 | `.loc-rand`, `.loc-foto` la 960 și 900 (poze pătrate) |
| `_blog.scss` | `.featured-products,.blog-home` 1440–1442, `.blog-home …` 1453–1465, carusel 1548–1596 pentru `.blog-home .product-grid` (folosește mixin-ul `carousel()` din `_mixins.scss`, cu `body:not(.pagina-blog)` ca în prototip) | `.blog-home .product-grid` la 960/560 |

`.product-grid`, `.product-card`, `.pc-img`, `.pc-body`, `.pc-name`, `.cl-variation`, `.pd-short` sunt în `$PROTO/css/shop.css` 61–103, 168, 255 — se portează în `_blog.scss` fiindcă blogul le folosește pe toate paginile, nu doar în magazin.

Regula de cascadă: partialul `_cards.scss` începe cu blocul `text secundar pe fundal cream-2`, ca `--ink-soft` să fie redefinit înainte de reguli.

- [ ] **Step 3: `main.scss`** — după partialele existente:

```scss
@use 'sections/hero';
@use 'sections/marquee';
@use 'sections/despre';
@use 'sections/momente';
@use 'sections/poveste-numele';
@use 'sections/testimoniale';
@use 'sections/instagram';
@use 'sections/cards';
@use 'sections/galerie';
@use 'sections/lightbox';
@use 'sections/vizita';
@use 'sections/locatii';
@use 'sections/blog';
```

- [ ] **Step 4: Build și verificare**

```bash
cd "$THEME" && npm run build && ls -la assets/css/main.min.css
for s in ".hero{" ".marquee{" ".despre-grid{" ".mom-foto{" ".pn-grid{" ".testi-stage{" ".insta-grid{" ".cards{" ".badge--nou{" ".galerie-grid{" ".lightbox{" ".vizita{" ".loc-rand{" ".blog-home" ".product-card{"; do printf "%s %s\n" "$s" "$(grep -c "$s" assets/css/main.min.css)"; done
grep -o "max-width: *[0-9]*px" assets/css/main.min.css | sort | uniq -c    # doar 480/560/640/760/900/960
grep -c "!important" assets/css/main.min.css                               # fiecare cu comentariu în SCSS
```
Expected: toate selectoarele ≥ 1; `main.min.css` sub 40 KB (estimare ~36 KB — dacă depășește, raportează, nu tăia).

- [ ] **Step 5: Commit**: `feat(css): secţiunile de home portate din prototip (hero…blog)`.

---

### Task 2: SCSS — subpagini, articol, ținte de atingere

**Files:**
- Create: `$THEME/scss/sections/_valori.scss`, `_evenimente.scss`, `_page-hero.scss`, `_post.scss`, `_forms.scss`, `$THEME/scss/base/_touch.scss`
- Modify: `$THEME/scss/main.scss`

**Interfaces:**
- Produces: `.poveste`, `.valori-grid`, `.valoare`, `.event-grid`, `.event-photo`, `.event-list`, `#servicii` (ca `.servicii`), `.shop-hero`, `.shop-sub`, `.hero-icon`, `.related-title`, `.post-*`, `.share-*`, `.co-section`, `.form-grid`, `.field`, `.field-msg`, `.btn-light`, `.form-ok`, `.form-full`, `.meniu-note`.

- [ ] **Step 1: Portează**

| Partial | Sursă |
|---|---|
| `_valori.scss` | `main.css` `povestea` 634–652 (`.poveste{background…}`, `.valori-grid`, `.valoare`) + `.valori-grid{grid-template-columns:1fr}` la 960 |
| `_evenimente.scss` | `main.css` `evenimente` 653–687 + `#servicii` 1466–1476 (**redenumit** `.servicii`; template-ul pune clasa, nu id-ul) + `.event-grid{grid-template-columns:1fr; margin-top:0}` la 900 |
| `_page-hero.scss` | `shop.css` `shop hero` 4–13 (`.shop-hero`, `.shop-sub`) + `main.css` `.hero-icon` 110–117 + `shop.css` `.related-title` 228–233 |
| `_post.scss` | `shop.css` 421–493 (`.post-*`, `.share-*`, `.post-gallery-grid`) + responsive-ul lor din `shop.css` (caută `post-` în blocurile `@media` de la final) |
| `_forms.scss` | `shop.css` `.co-section`, `.form-grid`, `.field`, `.field label`, `.field input/textarea/select`, `.field-msg` (~340–370) + `main.css` `formular rezervare` 1115–1165 doar `.btn-light`, `.form-note`, `.form-ok`, `.form-full`, `@keyframes msgIn` (restul e al modalului — Faza 4) + `.form-grid{grid-template-columns:1fr}` la 900 |
| `base/_touch.scss` | `main.css` 1497–1545 „MOBIL — zone de atingere", **fără** regulile deja portate în Faza 1 (`.footer-*`, `.logo`, `.lang-toggle`, `.footer-meta a`) și fără cele de shop (`.card-add`, `.alergeni-*`, care au mers în `_cards.scss` la Task 1) — deci: `.link-arrow`, `.map-unlock`, `.testi-dots*`, `.vizita-insta a`, `.info-row .val a` |

- [ ] **Step 2: `main.scss`** adaugă `@use 'sections/valori'; @use 'sections/evenimente'; @use 'sections/page-hero'; @use 'sections/post'; @use 'sections/forms'; @use 'base/touch';` (touch la final, ca să câștige în cascadă ca în prototip).

- [ ] **Step 3: Build, verificare** ca la Task 1 pentru `.valori-grid{`, `.event-grid{`, `.servicii`, `.shop-hero{`, `.post-title{`, `.share-btn{`, `.field{`, `.form-ok{`. Dimensiune raportată.

- [ ] **Step 4: Commit**: `feat(css): valori, evenimente, hero de pagină, articol, formulare, ţinte de atingere`.

---

### Task 3: Field groups SCF pentru pagini

**Files:**
- Create: `$THEME/acf-json/group_renee_home.json`, `group_renee_despre.json`, `group_renee_evenimente.json`, `group_renee_contact.json`, `group_renee_articol.json`
- Modify: `$THEME/acf-json/group_renee_setari.json`

**Interfaces:**
- Produces câmpurile (nume exacte). Locațiile grupurilor: home → `page_type == front_page`; despre/evenimente/contact → `page_template == default` **și** `page == <ID>` nu (ID-urile diferă între instanțe) → folosește `post_template`? Nu: folosește **location `page` cu operator `==` pe slug nu există în ACF**; soluția stabilă: fiecare grup are location `page_type == front_page` (home) sau `post_type == page` + `page_template == page-<slug>.php`. Template-urile `page-despre.php` etc. se aleg automat din ierarhie, dar SCF compară cu `_wp_page_template`, care e `default` — de aceea **Task 3 pasul 3 setează `_wp_page_template`** pe paginile respective la `page-despre.php`, `page-evenimente.php`, `page-contact.php` (seed-ul face același lucru). Template-urile declară `Template Name:` ca să apară și în admin.

| Grup | Câmpuri |
|---|---|
| **home** (`group_renee_home`) | `hero` grup: `video` (file, mp4), `poster` (image), `titlu` (text, implicit gol → template folosește `bloginfo('name')`), `subtitlu` (text), `tag` (text), `meta` (text) · `marquee` (text, itemi separați prin `·`) · `despre` grup: `eyebrow`, `manifest` (textarea, permite `<em>`), `text` (wysiwyg basic), `poza_mare` (image), `poza_mica` (image), `link_text`, `link_url` (page_link) · `poveste` grup: `eyebrow`, `titlu`, `proza` (wysiwyg basic), `crono_titlu`, `evenimente` repeater: `data`, `titlu`, `text` · `momente` grup: `eyebrow`, `titlu`, `durata`, `randuri` repeater (3): `interval`, `titlu`, `text`, `produs` (relationship, product, max 1) · `meniu_featured` grup: `eyebrow`, `titlu`, `nota`, `produse` (relationship, product, max 6) · `galerie` (gallery, max 5) · `testimoniale` repeater: `citat` (textarea), `autor` · `evenimente_lista` grup: `eyebrow`, `titlu`, `poza` (image), `lista` repeater: `text`, `cta_text`, `cta_url`, `cta_secundar_text`, `cta_secundar_url` · `blog` grup: `eyebrow`, `titlu`, `nota` |
| **despre** | `hero` grup: `eyebrow`, `titlu`, `manifest`, `text` (wysiwyg) · `valori` grup: `eyebrow`, `titlu`, `lista` repeater: `titlu`, `text`, `pictograma` (image) · `galerie` (gallery) |
| **evenimente** | `hero` grup: `eyebrow`, `titlu`, `text`, `poza`, `cta_text`, `cta_url`, `cta_secundar_text`, `cta_secundar_url` · `tipuri` grup: `eyebrow`, `titlu`, `lista` repeater: `text` · `servicii` grup: `eyebrow`, `titlu`, `lista` repeater: `titlu`, `text`, `poza`, `url` (page_link, opțional) · `catering_teaser` grup: `eyebrow`, `titlu`, `nota`, `produse` (relationship, product, max 4), `cta_text` · `galerie` (gallery) · `cta` grup: `eyebrow`, `titlu` |
| **contact** | `hero` grup: `eyebrow`, `titlu`, `text` · `mesaj` grup: `eyebrow`, `titlu`, `text` |
| **articol** (`post`) | `timp_citire` (number, minute), `galerie` (gallery), `citat` (textarea) |
| **setari** (+) | `instagram` grup: `handle` (text), `url` (url), `imagini` (gallery, 4) — mutat aici din home fiindcă apare pe 5 pagini · `locatii[]` primește `poza` deja (Faza 1) |

Toate câmpurile `eyebrow`/`titlu` au `instructions`: „Titlul acceptă `<em>` pentru cuvântul evidențiat, ca în prototip." Câmpurile de imagine: `return_format: array`, `preview_size: medium`. Relationship: `return_format: id`, `post_type: ["product"]`, `filters: ["search"]`.

- [ ] **Step 1: Scrie cele 5 JSON-uri + extinde `setari`** în formatul SCF (ca la Faza 1: `key`, `title`, `fields[]` cu `key`/`label`/`name`/`type`/`sub_fields`, `location`, `active: true`, `show_in_rest: 0`, `modified`). Locations: home `[[{"param":"page_type","operator":"==","value":"front_page"}]]`; despre `[[{"param":"page_template","operator":"==","value":"page-despre.php"}]]` (analog evenimente, contact); articol `[[{"param":"post_type","operator":"==","value":"post"}]]`.

- [ ] **Step 2: Validare**

```bash
for f in "$THEME"/acf-json/group_renee_*.json; do python3 -m json.tool "$f" >/dev/null && echo "ok $(basename $f)"; done
wp eval 'foreach(["home","despre","evenimente","contact","articol","setari"] as $g){$x=acf_get_field_group("group_renee_$g"); echo $g, ": ", $x ? count(acf_get_fields($x))." câmpuri" : "LIPSĂ", "\n";}'
```
Expected: home 10, despre 3, evenimente 6, contact 2, articol 3, setari 11.

- [ ] **Step 3: Template-uri pe pagini** (ca SCF să afișeze grupurile):

```bash
for s in despre evenimente contact; do ID=$(wp post list --post_type=page --name=$s --field=ID); wp post meta update $ID _wp_page_template page-$s.php; done
```

- [ ] **Step 4: Commit**: `feat(scf): field groups home, despre, evenimente, contact, articol; instagram în Setări`.

---

### Task 4: Helpere de template, imagini responsive, enqueue

**Files:**
- Modify: `$THEME/inc/template-tags.php`, `$THEME/inc/enqueue.php`
- Copy: `$PROTO/img/{interior,preview,img_oassis,img_urban}.webp` → `$THEME/assets/img/`

**Interfaces:**
- Produces:
  - `renee_field( string $name, $post_id = false, $default = '' )` — `get_field` cu fallback, `null` → `$default`.
  - `renee_titlu( string $html ): string` — permite doar `<em>` și `<br>` (`wp_kses` cu lista `['em'=>[], 'br'=>[]]`), pentru titlurile cu cuvânt evidențiat.
  - `renee_img( $image, string $size = 'renee-card', array $attrs = [] ): string` — din array SCF sau ID; `wp_get_attachment_image` cu `loading="lazy"` implicit, `class="photo"`, `decoding="async"`; `$attrs['priority'] = true` → `fetchpriority="high"` și fără lazy; returnează `''` dacă imaginea lipsește.
  - `renee_gallery( array $images, string $aria ): void` — randează `<button class="g-item g-N reveal" data-lightbox>` ca în PARTIALS §2, max 5, clasa `g-1..g-5`; nimic dacă `$images` e gol; setează flag global `$GLOBALS['renee_needs_lightbox'] = true`.
  - `renee_products_by_ids( array $ids ): array` — `wc_get_products(['include'=>$ids,'status'=>'publish','limit'=>count($ids),'orderby'=>'post__in'])`, `[]` dacă Woo lipsește.
  - `renee_section_head( string $eyebrow, string $titlu, string $class = '' ): void` — `<p class="eyebrow reveal">` + `<h2 class="h2 reveal">` cu `renee_titlu`.

- [ ] **Step 1: Copiază imaginile reale** și verifică `ls "$THEME/assets/img" | grep -c webp` → 4 (+ cele 56 din `catering/` dacă există deja).

- [ ] **Step 2: Helperele**, adăugate la `inc/template-tags.php`:

```php
function renee_field( string $name, $post_id = false, $default = '' ) {
	if ( ! function_exists( 'get_field' ) ) { return $default; }
	$v = get_field( $name, $post_id );
	return ( null === $v || '' === $v || array() === $v ) ? $default : $v;
}

/** Titluri cu un cuvânt evidenţiat: doar <em> şi <br>, nimic altceva. */
function renee_titlu( string $html ): string {
	return wp_kses( $html, array( 'em' => array(), 'br' => array() ) );
}

/**
 * <img> responsive din SCF (array sau ID). priority=true → LCP: fetchpriority high, fără lazy.
 */
function renee_img( $image, string $size = 'renee-card', array $attrs = array() ): string {
	$id = is_array( $image ) ? (int) ( $image['ID'] ?? $image['id'] ?? 0 ) : (int) $image;
	if ( ! $id ) { return ''; }
	$priority = ! empty( $attrs['priority'] );
	unset( $attrs['priority'] );
	$attrs = wp_parse_args( $attrs, array(
		'class'    => 'photo',
		'loading'  => $priority ? 'eager' : 'lazy',
		'decoding' => 'async',
	) );
	if ( $priority ) { $attrs['fetchpriority'] = 'high'; }
	return wp_get_attachment_image( $id, $size, false, $attrs );
}

function renee_gallery( array $images, string $aria = '' ): void {
	$images = array_slice( array_values( $images ), 0, 5 );
	if ( ! $images ) { return; }
	$GLOBALS['renee_needs_lightbox'] = true;
	echo '<div class="galerie-grid">';
	foreach ( $images as $i => $img ) {
		$alt = is_array( $img ) ? ( $img['alt'] ?: $img['title'] ?? '' ) : get_post_meta( (int) $img, '_wp_attachment_image_alt', true );
		$delay = $i % 3 ? ' reveal-d' . ( $i % 3 ) : '';
		printf(
			'<button type="button" class="g-item g-%d reveal%s" data-lightbox aria-label="%s">%s<span class="g-veil" aria-hidden="true"><span class="g-zoom"></span></span></button>',
			$i + 1, esc_attr( $delay ), esc_attr( sprintf( __( 'Mărește: %s', 'renee' ), $alt ?: $aria ) ),
			renee_img( $img, 'renee-single' )
		);
	}
	echo '</div>';
}

function renee_products_by_ids( array $ids ): array {
	$ids = array_filter( array_map( 'intval', $ids ) );
	if ( ! $ids || ! function_exists( 'wc_get_products' ) ) { return array(); }
	return wc_get_products( array( 'include' => $ids, 'status' => 'publish', 'limit' => count( $ids ), 'orderby' => 'post__in' ) );
}

function renee_section_head( string $eyebrow, string $titlu, string $class = '' ): void {
	if ( $eyebrow ) { printf( '<p class="eyebrow reveal %s">%s</p>', esc_attr( $class ), esc_html( $eyebrow ) ); }
	if ( $titlu )   { printf( '<h2 class="h2 reveal">%s</h2>', renee_titlu( $titlu ) ); }
}
```

- [ ] **Step 3: Enqueue** în `inc/enqueue.php`, în `renee_enqueue()` după `renee-main`:

```php
if ( is_front_page() ) {
	wp_enqueue_script( 'renee-home', RENEE_URI . '/assets/js/home.js', array( 'renee-main' ), renee_asset_ver( '/assets/js/home.js' ), array( 'strategy' => 'defer', 'in_footer' => true ) );
}
if ( is_singular( 'post' ) ) {
	wp_enqueue_script( 'renee-share', RENEE_URI . '/assets/js/share.js', array(), renee_asset_ver( '/assets/js/share.js' ), array( 'strategy' => 'defer', 'in_footer' => true ) );
}
```
Și în `$config['i18n']`: `'copiat' => __( 'Link copiat', 'renee' )`, `'copiaza' => __( 'Copiază linkul', 'renee' )`, `'mareste' => __( 'Mărește', 'renee' )`.

- [ ] **Step 4: Lightbox-ul**: în `footer.php`, înainte de `wp_footer()`: `<?php if ( ! empty( $GLOBALS['renee_needs_lightbox'] ) ) { get_template_part( 'template-parts/shared/lightbox' ); } ?>`. Creează `template-parts/shared/lightbox.php` cu markup-ul din `$PROTO/evenimente.html` liniile 194–204 (`div.lightbox#lightbox` cu butoanele, `figure.lb-stage`, `.lb-count`), textele prin `esc_attr_e`.

- [ ] **Step 5: `php -l`, commit**: `feat(tema): helpere de template, imagini responsive, galerie + lightbox, enqueue home/share`.

---

### Task 5: JS — `home.js` și `share.js`

**Files:**
- Create: `$THEME/assets/js/home.js`, `$THEME/assets/js/share.js`

**Interfaces:**
- Consumes: `window.reneeConfig.i18n.copiat/copiaza`.
- Produces: nimic global.

- [ ] **Step 1: `home.js`** — din `$PROTO/js/main.js`, blocurile: `Hero — litere animate` (4–19), `Marquee` (192–205), `Parallax` (241–259), `Testimoniale` (260–298), `Video hero` (299–302). Copiate cu comentarii, într-un IIFE `'use strict'`, fiecare cu guard pe element. `var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches` la început (îl folosesc parallax, testimoniale, video).

- [ ] **Step 2: `share.js`** — din `$PROTO/js/main.js` **nu** există; logica e în `$PROTO/articol.html` la final, în `<script>` (caută `data-share`): construiește link-urile Facebook/WhatsApp/Telegram din `location.href` și `document.title`, copiere prin Clipboard API cu fallback `execCommand`, clasa `copiat` pe buton 1,6 s, textul din `reneeConfig.i18n`. Portează în IIFE, cu guard pe `.share-btns`.

- [ ] **Step 3: `node --check` pe ambele; commit**: `feat(js): home.js (hero, marquee, parallax, testimoniale, video), share.js`.

---

### Task 6: Partiale comune și cardul de preparat

**Files:**
- Create: `$THEME/template-parts/shared/section-head.php` (nu: helperul `renee_section_head()` e suficient — **nu crea fișierul**), `shared/instagram.php`, `shared/locatii.php`, `shared/map.php`, `shop/card.php`

**Interfaces:**
- Consumes: `renee_setting('instagram')`, `renee_locatii()`, `renee_img()`, `renee_section_head()`.
- Produces: `get_template_part('template-parts/shared/instagram')`; `get_template_part('template-parts/shared/locatii', null, ['dark' => true])`; `get_template_part('template-parts/shop/card', null, ['product' => $wc_product, 'delay' => 1])`.

- [ ] **Step 1: `shared/instagram.php`** — markup din `$PROTO/evenimente.html` 176–192 (`section.section#instagram > .wrap > .insta-head + .insta-grid`), datele din `renee_setting('instagram')`: `handle`, `url`, `imagini` (4). Dacă `imagini` e gol → **nu randează nimic**. Link-ul „Urmărește @handle →" cu `esc_html( '@' . $handle )`.

- [ ] **Step 2: `shared/map.php`** — argumente `['embed' => string, 'label' => string]`: `div.map-wrap > div.map-shield > iframe` + `button.map-unlock` („Activează harta"), embed-ul trecut prin `wp_kses( $embed, ['iframe' => ['src'=>[], 'width'=>[], 'height'=>[], 'loading'=>[], 'referrerpolicy'=>[], 'allowfullscreen'=>[], 'style'=>[], 'title'=>[]]] )`, `src` obligatoriu pe `https://www.google.com/maps/embed` sau `https://maps.google.com/` (altfel nu randează). Markup din `$PROTO/index.html` liniile 466–498 (un `.loc-rand`).

- [ ] **Step 3: `shared/locatii.php`** — cele două rânduri `.loc-rand` (al doilea cu `.invers`) din `$PROTO/index.html` 466–530: poza (`poza` din locație, `renee_img(..., 'renee-single')`), `.loc-nume`, `.info-list` cu adresă/program/telefon (rând doar dacă valoarea există; programul lipsește acum), harta prin `shared/map`. Argument `['dark' => bool]` nu e necesar: secțiunea `.vizita` care le conține e închisă mereu. Dacă `renee_locatii()` e gol → nimic.

- [ ] **Step 4: `shop/card.php`** — cardul din `$PROTO/js/shop.js` `productCardHTML()` (37–82), tradus în PHP cu `WC_Product $p` din `$args['product']`:
  - imagine `renee_img( $p->get_image_id(), 'renee-card' )` în `a.card-link` către `get_permalink`
  - badge-uri: `nou` dacă `$p->get_date_created()` < 30 zile, `recomandat` dacă `$p->is_featured()`, `vegan` dacă are tag-ul `vegan`
  - `h3 > a.card-title-link` + `span.price` cu `wc_price( $p->get_price() )` (fără zecimale — setarea Woo)
  - `p` cu `wp_trim_words( $p->get_short_description() ?: $p->get_description(), 18 )`
  - `p.card-gramaj` din `get_post_meta( $p->get_id(), 'emo_weight_grams', true )` dacă există
  - `.card-foot` cu tooltip-ul de alergeni din `emo_allergens` dacă nu e gol; **fără butonul de coș** (Faza 3 îl adaugă, cu Store API)
  - clasa `reveal reveal-d{$args['delay']}` dacă `delay` ∈ 1..3
  Escaping peste tot.

- [ ] **Step 5: `php -l`, commit**: `feat(tema): partiale comune instagram, locaţii, hartă; cardul de preparat`.

---

### Task 7: Home — `front-page.php`

**Files:**
- Create: `$THEME/front-page.php`, `$THEME/template-parts/home/hero.php`, `marquee.php`, `despre.php`, `poveste.php`, `momente.php`, `meniu.php`, `galerie.php`, `testimoniale.php`, `evenimente.php`, `blog.php`

**Interfaces:**
- Consumes: câmpurile grupului `home` (Task 3), helperele (Task 4), `shop/card`, `shared/instagram`, `shared/locatii` (Task 6), `home.js` (Task 5).

- [ ] **Step 1: `front-page.php`**

```php
<?php defined( 'ABSPATH' ) || exit; get_header(); ?>
<main id="main">
<?php
foreach ( array( 'hero', 'marquee', 'despre', 'poveste', 'momente', 'meniu', 'galerie', 'testimoniale', 'evenimente' ) as $part ) {
	get_template_part( 'template-parts/home/' . $part );
}
get_template_part( 'template-parts/shared/instagram' );
?>
<section class="section vizita" id="vizita"><div class="wrap">
	<?php renee_section_head( __( 'Vizitează-ne', 'renee' ), __( 'Locațiile <em>noastre</em>', 'renee' ) ); ?>
	<?php get_template_part( 'template-parts/shared/locatii' ); ?>
</div></section>
<?php get_template_part( 'template-parts/home/blog' ); ?>
</main>
<?php get_footer();
```
(eyebrow-ul și titlul secțiunii Vizită sunt singurele texte fixe: sunt etichete de navigare, nu conținut; trec prin `__()`.) Paginile care nu sunt home poartă `subpage` pe body (Faza 1); home-ul nu, deci header-ul e transparent peste hero.

- [ ] **Step 2: Fiecare partial** = markup-ul secțiunii din `$PROTO/index.html` (liniile din tabelul „Starea prototipului": hero 60–77, marquee 78–126, despre 128–154, poveste 159–186, momente 192–243, meniu 244–365, galerie 367–380, testimoniale 382–402, evenimente 404–429, blog 538–600), cu textele înlocuite de câmpuri și cu regulile:
  - secțiunea **nu se randează** dacă îi lipsește conținutul principal (hero: mereu; despre: `manifest` sau `text`; poveste: `proza`; momente: cel puțin un rând cu `produs` publicat; meniu: cel puțin un produs; galerie: ≥1 imagine; testimoniale: ≥1; evenimente: `titlu`; blog: ≥1 articol publicat)
  - `hero.php`: `<video>` doar dacă `video` există, cu `poster` dacă există, `preload="metadata" muted loop playsinline autoplay`; fără video și fără poster → `div.hero-bg.ph` (placeholder-ul din prototip); titlul `h1#heroTitle.hero-title` = `titlu` sau `get_bloginfo('name')`; `.scroll-hint` cu textul din `hero.meta` sau „Descoperă"
  - `momente.php`: pentru fiecare rând, produsul prin `renee_products_by_ids([$produs])[0]`, imaginea `renee_img($p->get_image_id(),'renee-single')`, link la produs, `.mom-ora` cu `interval`
  - `meniu.php`: `.meniu-head` + `.cards` cu `shop/card` pentru `meniu_featured.produse`, `delay` = index % 3; link „Vezi tot meniul" către `wc_get_page_permalink('shop')`
  - `galerie.php`: `renee_section_head()` + `renee_gallery( $galerie, 'Galerie Renée' )`
  - `testimoniale.php`: `.testi-stage` cu `.testi-slide` (prima `active`) + `.testi-dots` cu un `button` per slide, `aria-label` „Testimonial N"
  - `evenimente.php`: `.event-grid` cu poza, lista, `.cta-row` cu butonul plin + cel secundar (Faza 1 din prototip: „Discută cu noi" tel + „Meniu de catering" → `cta_secundar_url`)
  - `blog.php`: `section.section.blog-home#blog` cu `.meniu-head` + `.product-grid` cu 4 articole recente prin `template-parts/blog/card` (Task 9 îl creează — **creează-l acum**, minimal: `a.product-card > .pc-img(img) + .pc-body(.cl-variation categorie · dată, .pc-name titlu, .pd-short excerpt)` din `$PROTO/blog.html` 71–80) + link „Toate articolele" către `get_permalink( get_option('page_for_posts') )`
- [ ] **Step 3: Verificare** (după ce Task 10 rulează seed-ul, home-ul se umple; acum verifici că secțiunile goale nu lasă markup gol):

```bash
php -l front-page.php && for f in template-parts/home/*.php; do php -l "$f"; done
curl -s http://renee.local/ | grep -c '<section'      # ≥ 2 (hero + vizita) chiar fără conţinut
curl -s http://renee.local/ | grep -c 'home.js'       # 1
curl -s http://renee.local/despre/ | grep -c 'home.js' # 0
```

- [ ] **Step 4: Commit**: `feat(home): front-page.php şi cele 10 secţiuni din câmpuri SCF`.

---

### Task 8: Despre, Evenimente, Contact

**Files:**
- Create: `$THEME/page-despre.php`, `page-evenimente.php`, `page-contact.php`, `template-parts/despre/intro.php`, `valori.php`, `template-parts/evenimente/hero.php`, `tipuri.php`, `servicii.php`, `cta.php`, `template-parts/contact/intro.php`, `mesaj.php`

**Interfaces:**
- Consumes: grupurile `despre`, `evenimente`, `contact`; `shared/locatii`, `shared/instagram`, `renee_gallery`, `shop/card`.
- Produces: `page-*.php` cu antet `/* Template Name: Despre */` etc. (ca SCF și admin să le vadă).

- [ ] **Step 1: `page-despre.php`** — `get_header()`; `main#main`: `despre/intro` (`$PROTO/despre.html` 59–80: `.despre-grid` cu eyebrow, h1.h2, manifest, text), `despre/valori` (82–102: `section.section.poveste#valori` + `.valori-grid` cu `.valoare` per rând), `section.section.vizita#locatii` cu `renee_section_head` + `shared/locatii`, galerie (`renee_gallery`), `shared/instagram`; `get_footer()`.
- [ ] **Step 2: `page-evenimente.php`** — hero (`$PROTO/evenimente.html` 60–78, cu `.cta-row` din Faza 1 a prototipului: buton plin + `btn-outline`), tipuri (80–94, `.event-list`), servicii (96–133, `section.section.servicii` cu `.cards` de `article.card` — poza, h3, text; dacă `url` e setat, poza și titlul devin link-uri), catering teaser (134–149: doar dacă `catering_teaser.produse` returnează produse; `.cards.cat-grid` cu `shop/card`; butonul „Vezi meniul de catering" către pagina `catering`), galerie, cta (166–174: `section.section.vizita#cta-eveniment` centrat, `hero-icon` = `logo_symbol.svg` inline, eyebrow, h2, `tel-big` din `renee_setting('telefon_principal')`), instagram.
- [ ] **Step 3: `page-contact.php`** — intro (`$PROTO/contact.html` 59–65), `section.section.vizita#locatii` cu `shared/locatii`, `contact/mesaj`: dacă `function_exists('renee_forms_render')` → `renee_forms_render('mesaj')` (Faza 4); altfel randează eyebrow, h2, textul și un `.cta-row` cu `mailto:` din `email_contact` și `tel:` din `telefon_principal` (doar cele existente) — **fără formular fals**; instagram.
- [ ] **Step 4: Verificare**: `php -l` pe toate; `curl -s http://renee.local/despre/ | grep -c 'id="valori"'`, `…/evenimente/ | grep -c 'class="section servicii'`, `…/contact/ | grep -c 'id="mesaj"'` — după seed vor fi 1; acum 0 e acceptabil dacă pagina răspunde 200 fără erori PHP (`curl -s -o /dev/null -w "%{http_code}"`).
- [ ] **Step 5: Commit**: `feat(pagini): despre, evenimente, contact din câmpuri SCF`.

---

### Task 9: Blog — listă, articol, conexe, partajare

**Files:**
- Create: `$THEME/home.php`, `$THEME/single.php`, `template-parts/blog/post-hero.php`, `post-share.php`, `related.php`, `pagination.php`; Modify: `template-parts/blog/card.php` (din Task 7, dacă e nevoie)

**Interfaces:**
- Consumes: grupul `articol`, `share.js`, `renee_gallery`, `.post-*` (Task 2).

- [ ] **Step 1: `home.php`** (pagina de articole): `section.shop-hero` (eyebrow „Jurnal", h1 = titlul paginii `page_for_posts`, `.shop-sub` = excerpt-ul paginii dacă există) + `section.section.blog-home` cu `.product-grid` din loop (`blog/card`) + `blog/pagination` + `shared/instagram`. Body primește clasa `pagina-blog` (filtru `body_class` în `inc/setup.php` când `is_home()`), ca regula de carusel să nu se aplice (DECIZII / spec).
- [ ] **Step 2: `blog/pagination.php`** — `the_posts_pagination()` cu `prev_text` „‹", `next_text` „›", `mid_size` 1, apoi CSS-ul prototipului `.pagination`/`.page-btn` din `$PROTO/css/shop.css` 49–60 (+ compact pe mobil, 640: `.page-numbers.dots`) portat în `scss/sections/_blog.scss` cu selectoarele WP mapate: `.pagination .nav-links{display:flex;gap:8px;justify-content:center}`, `.page-numbers{…ca .page-btn…}`, `.page-numbers.current{…ca .active…}`, `.page-numbers.prev/.next{…ca .page-arrow…}`.
- [ ] **Step 3: `single.php`** — `article.section.post` cu `blog/post-hero` (`$PROTO/articol.html` 62–78: `.post-eyebrow` = categoria · data, `h1.post-title` = titlul cu `renee_titlu` aplicat pe `the_title` **nu** (titlul e text simplu; `em` vine doar dacă editorul îl scrie: acceptă-l prin `renee_titlu(get_the_title())`), `.post-meta` = „De {autor}" · `{timp_citire} min citire` dacă e setat, `figure.post-feature` = thumbnail cu `priority`), `div.wrap.post-body` cu `the_content()` (stilurile `.post-body p/h2/a` din Task 2 acoperă conținutul din editor), `citat` din SCF ca `.post-quote` dacă există, `galerie` prin `renee_gallery` în `figure.post-gallery`, `blog/post-share` (`$PROTO/articol.html` 121–141, SVG-urile inline), `blog/related`.
- [ ] **Step 4: `blog/related.php`** — `WP_Query` cu `category__in` ale postului, `post__not_in` curent, `posts_per_page => 4` (CLAUDE.md: maxim 4), `ignore_sticky_posts`; `section.section#related > .wrap > h2.related-title + .product-grid` cu `blog/card`; nimic dacă zero rezultate; `wp_reset_postdata()`. Caruselul pe mobil vine din regula `#related .product-grid` — adaugă în `_blog.scss` același `@include carousel()` sub `mq($bp-md)`.
- [ ] **Step 5: Verificare**: creează un articol de test prin CLI (`wp post create --post_title="Test [DRAFT]" --post_status=publish --post_content="<p>Text</p>"`), `curl` pe permalink: `post-title` 1, `share-btns` 1, `share.js` 1; pe `/blog/` (după `wp option update page_for_posts 405` în Task 10; poți seta acum): `blog-home` 1, `pagina-blog` 1. Șterge articolul de test după (`wp post delete --force`).
- [ ] **Step 6: Commit**: `feat(blog): listă cu paginare, articol cu partajare şi conexe`.

---

### Task 10: Seed — `wp renee seed` și `content.json`

**Files:**
- Create: `$THEME/inc/cli.php`, `$REPO/seed/content.json`, `$REPO/seed/README.md`; Modify: `$THEME/functions.php` (require condiționat)

**Interfaces:**
- Produces: comanda `wp renee seed [--only=pages|options|menus|posts|reading] [--dry-run]`; formatul `content.json` de mai jos.

- [ ] **Step 1: Formatul `content.json`** (RO, UTF-8):

```json
{
  "options": { "tagline": "[DRAFT] Cafenea & all day breakfast în Chișinău. O nouă emoție, un nou început.", "instagram": { "handle": "renee_brunch", "url": "https://www.instagram.com/renee_brunch/" }, "catering_termen": "[DRAFT] Cu minim 48 de ore înainte", "catering_conditii": "[DRAFT] …" },
  "pages": [
    { "slug": "pagina-principala", "title": "Acasă", "template": "", "front_page": true,
      "fields": { "hero": { "titlu": "", "subtitlu": "o nouă emoție, un nou început — renaissance", "tag": "Cafenea · All day breakfast · Chișinău", "meta": "Descoperă" }, "marquee": "…", "despre": { "…": "…" }, "…": "…" } },
    { "slug": "despre", "title": "Despre", "template": "page-despre.php", "fields": { "…": "…" } },
    { "slug": "evenimente", "title": "Evenimente", "template": "page-evenimente.php", "fields": { "…": "…" } },
    { "slug": "contact", "title": "Contact", "template": "page-contact.php", "fields": { "…": "…" } },
    { "slug": "blog", "title": "Jurnal", "posts_page": true },
    { "slug": "termeni", "title": "Termeni și condiții", "content": "<!-- [DRAFT] schelet, vezi prototip termeni.html -->" }
  ],
  "images": { "despre.poza_mare": "assets/img/preview.webp", "despre.poza_mica": "assets/img/interior.webp", "locatii.0.poza": "assets/img/img_oassis.webp", "locatii.1.poza": "assets/img/img_urban.webp" },
  "menus": { "principal": [ {"page": "despre"}, {"page": "meniu"}, {"page": "evenimente", "children": [ {"page": "catering"} ]}, {"page": "blog"}, {"page": "contact"} ],
             "footer": [ {"page": "pagina-principala", "title": "Acasă"}, {"page": "meniu"}, {"page": "despre"}, {"page": "evenimente"}, {"page": "catering"}, {"page": "blog"}, {"page": "contact"} ] },
  "posts": [ { "slug": "ghidul-micut-al-cafelei-de-specialitate", "title": "[DRAFT] Ghidul micuț al cafelei de specialitate", "category": "Cafea", "date": "2026-03-12", "excerpt": "…", "content": "<p>…</p>", "timp_citire": 6 } ]
}
```
**Conținutul efectiv** se extrage din prototip (`index.html`, `despre.html`, `evenimente.html`, `contact.html`, `blog.html`, `articol.html`), text cu text, cu `<em>` păstrat în titluri și `[DRAFT]` prefixat pe: testimoniale, povestea, textele de blog, textul din „Despre" marcat DRAFT în prototip, tagline, textele de catering. **Nu** intră: URL-uri Unsplash/Pexels, telefonul `+373 60 000 000`, programul „Zilnic 08:00 – 22:00", e-mailuri. Relationship-urile către produse se dau prin **SKU sau nume**: `"produs": {"name": "Croissant Clasic Renée"}` — seed-ul caută produsul după titlu exact, apoi după `LIKE`; dacă nu-l găsește, lasă câmpul gol și scrie un WARNING (nu inventează). Cele trei „momente" din prototip: croissant / pancakes cu caramelă / pavlova; `meniu_featured`: cele 6 preparate din `index.html` 254–365 (după nume).

- [ ] **Step 2: `inc/cli.php`**

```php
<?php
/**
 * wp renee seed — populează paginile, opţiunile, meniurile şi articolele din seed/content.json.
 * Idempotent: pagini după slug, articole după slug, meniuri după nume, opţiuni după cheie.
 */
defined( 'ABSPATH' ) || exit;
if ( ! defined( 'WP_CLI' ) || ! WP_CLI ) { return; }

class Renee_Seed_Command {
	private array $data = array();
	private bool $dry = false;
	private array $image_cache = array();

	/**
	 * Populează conţinutul iniţial din seed/content.json.
	 *
	 * ## OPTIONS
	 * [--only=<parts>] : pages,options,menus,posts,reading (separate prin virgulă)
	 * [--dry-run] : arată ce ar face, fără să scrie
	 * [--file=<path>] : alt fişier JSON (implicit <repo>/seed/content.json)
	 */
	public function seed( $args, $assoc ) {
		$file = $assoc['file'] ?? dirname( RENEE_DIR, 3 ) . '/seed/content.json';
		if ( ! is_readable( $file ) ) { WP_CLI::error( "Nu găsesc $file" ); }
		$this->data = json_decode( file_get_contents( $file ), true );
		if ( json_last_error() ) { WP_CLI::error( 'JSON invalid: ' . json_last_error_msg() ); }
		$this->dry = ! empty( $assoc['dry-run'] );
		$only = array_filter( array_map( 'trim', explode( ',', $assoc['only'] ?? 'options,pages,menus,posts,reading' ) ) );
		if ( ! function_exists( 'update_field' ) ) { WP_CLI::error( 'SCF nu e activ.' ); }
		foreach ( $only as $part ) {
			$m = 'seed_' . $part;
			if ( ! method_exists( $this, $m ) ) { WP_CLI::warning( "Necunoscut: $part" ); continue; }
			WP_CLI::log( "== $part" );
			$this->$m();
		}
		WP_CLI::success( $this->dry ? 'Dry-run terminat.' : 'Seed terminat.' );
	}

	private function seed_options(): void {
		foreach ( $this->data['options'] ?? array() as $k => $v ) {
			$this->log( "option $k" );
			if ( ! $this->dry ) { update_field( $k, $this->resolve( $v, "options.$k" ), 'option' ); }
		}
		// pozele locaţiilor: se ataşează pe rândurile existente, fără să atingă textele
		$loc = get_field( 'locatii', 'option' ) ?: array();
		foreach ( $loc as $i => $row ) {
			$id = $this->image( "locatii.$i.poza" );
			if ( $id ) { $loc[ $i ]['poza'] = $id; }
		}
		if ( $loc && ! $this->dry ) { update_field( 'locatii', $loc, 'option' ); }
	}

	private function seed_pages(): void {
		foreach ( $this->data['pages'] ?? array() as $p ) {
			$post = get_page_by_path( $p['slug'], OBJECT, 'page' );
			$arr = array( 'post_type' => 'page', 'post_status' => 'publish', 'post_name' => $p['slug'], 'post_title' => $p['title'] );
			if ( isset( $p['content'] ) ) { $arr['post_content'] = $p['content']; }
			if ( $post ) { $arr['ID'] = $post->ID; $this->log( "page {$p['slug']} → update #{$post->ID}" ); }
			else { $this->log( "page {$p['slug']} → create" ); }
			if ( $this->dry ) { continue; }
			$id = $post ? wp_update_post( $arr, true ) : wp_insert_post( $arr, true );
			if ( is_wp_error( $id ) ) { WP_CLI::warning( $id->get_error_message() ); continue; }
			if ( ! empty( $p['template'] ) ) { update_post_meta( $id, '_wp_page_template', $p['template'] ); }
			foreach ( $p['fields'] ?? array() as $name => $value ) {
				update_field( $name, $this->resolve( $value, "{$p['slug']}.$name" ), $id );
			}
		}
	}

	private function seed_menus(): void {
		foreach ( $this->data['menus'] ?? array() as $location => $items ) {
			$name = ucfirst( $location );
			$menu = wp_get_nav_menu_object( $name );
			$menu_id = $menu ? $menu->term_id : ( $this->dry ? 0 : wp_create_nav_menu( $name ) );
			$this->log( "menu $name (#$menu_id)" );
			if ( $this->dry ) { continue; }
			foreach ( wp_get_nav_menu_items( $menu_id ) ?: array() as $old ) { wp_delete_post( $old->ID, true ); }
			$this->add_menu_items( $menu_id, $items, 0 );
			$locs = get_theme_mod( 'nav_menu_locations' ) ?: array();
			$locs[ $location ] = $menu_id;
			set_theme_mod( 'nav_menu_locations', $locs );
		}
	}

	private function add_menu_items( int $menu_id, array $items, int $parent ): void {
		foreach ( $items as $it ) {
			$page = get_page_by_path( $it['page'], OBJECT, 'page' );
			if ( ! $page ) { WP_CLI::warning( "menu: pagina {$it['page']} lipseşte" ); continue; }
			$id = wp_update_nav_menu_item( $menu_id, 0, array(
				'menu-item-object-id' => $page->ID, 'menu-item-object' => 'page', 'menu-item-type' => 'post_type',
				'menu-item-title' => $it['title'] ?? '', 'menu-item-status' => 'publish', 'menu-item-parent-id' => $parent,
			) );
			if ( ! empty( $it['children'] ) && ! is_wp_error( $id ) ) { $this->add_menu_items( $menu_id, $it['children'], $id ); }
		}
	}

	private function seed_posts(): void {
		foreach ( $this->data['posts'] ?? array() as $p ) {
			$existing = get_page_by_path( $p['slug'], OBJECT, 'post' );
			$cat = $this->dry ? 0 : ( term_exists( $p['category'], 'category' )['term_id'] ?? wp_insert_term( $p['category'], 'category' )['term_id'] );
			$arr = array( 'post_type' => 'post', 'post_status' => 'draft', 'post_name' => $p['slug'], 'post_title' => $p['title'],
				'post_content' => $p['content'], 'post_excerpt' => $p['excerpt'] ?? '', 'post_date' => $p['date'] . ' 09:00:00', 'post_category' => array( (int) $cat ) );
			$this->log( "post {$p['slug']} → " . ( $existing ? "update #{$existing->ID}" : 'create (draft)' ) );
			if ( $this->dry ) { continue; }
			if ( $existing ) { $arr['ID'] = $existing->ID; }
			$id = $existing ? wp_update_post( $arr, true ) : wp_insert_post( $arr, true );
			if ( ! is_wp_error( $id ) && isset( $p['timp_citire'] ) ) { update_field( 'timp_citire', (int) $p['timp_citire'], $id ); }
		}
	}

	private function seed_reading(): void {
		$front = get_page_by_path( 'pagina-principala', OBJECT, 'page' );
		$blog  = get_page_by_path( 'blog', OBJECT, 'page' );
		$this->log( 'reading: show_on_front=page, front=' . ( $front->ID ?? '?' ) . ', posts=' . ( $blog->ID ?? '?' ) );
		if ( $this->dry || ! $front || ! $blog ) { return; }
		update_option( 'show_on_front', 'page' );
		update_option( 'page_on_front', $front->ID );
		update_option( 'page_for_posts', $blog->ID );
	}

	/** Rezolvă valorile speciale: {"name": "..."} → ID de produs; căile de imagini din data.images. */
	private function resolve( $value, string $path ) {
		if ( is_array( $value ) ) {
			if ( isset( $value['name'] ) && 1 === count( $value ) ) { return $this->product_id( $value['name'], $path ); }
			foreach ( $value as $k => $v ) { $value[ $k ] = $this->resolve( $v, "$path.$k" ); }
			return $value;
		}
		$img = $this->image( $path );
		return $img ?: $value;
	}

	private function product_id( string $name, string $path ) {
		if ( ! function_exists( 'wc_get_products' ) ) { return null; }
		$found = get_page_by_title( $name, OBJECT, 'product' );
		if ( ! $found ) {
			$q = new WP_Query( array( 'post_type' => 'product', 's' => $name, 'posts_per_page' => 1, 'fields' => 'ids' ) );
			if ( $q->posts ) { $found = get_post( $q->posts[0] ); }
		}
		if ( ! $found ) { WP_CLI::warning( "$path: produsul „{$name}” nu există — lăsat gol" ); return null; }
		return $found->ID;
	}

	/** Importă o imagine din temă (o singură dată; identificată prin meta _renee_seed_src). */
	private function image( string $key ) {
		$rel = $this->data['images'][ $key ] ?? null;
		if ( ! $rel ) { return null; }
		if ( isset( $this->image_cache[ $rel ] ) ) { return $this->image_cache[ $rel ]; }
		$existing = get_posts( array( 'post_type' => 'attachment', 'meta_key' => '_renee_seed_src', 'meta_value' => $rel, 'fields' => 'ids', 'posts_per_page' => 1 ) );
		if ( $existing ) { return $this->image_cache[ $rel ] = (int) $existing[0]; }
		$this->log( "image $rel → import" );
		if ( $this->dry ) { return null; }
		require_once ABSPATH . 'wp-admin/includes/image.php'; require_once ABSPATH . 'wp-admin/includes/file.php'; require_once ABSPATH . 'wp-admin/includes/media.php';
		$tmp = wp_tempnam( basename( $rel ) ); copy( RENEE_DIR . '/' . $rel, $tmp );
		$id = media_handle_sideload( array( 'name' => basename( $rel ), 'tmp_name' => $tmp ), 0 );
		if ( is_wp_error( $id ) ) { WP_CLI::warning( $id->get_error_message() ); return null; }
		update_post_meta( $id, '_renee_seed_src', $rel );
		return $this->image_cache[ $rel ] = (int) $id;
	}

	private function log( string $m ): void { WP_CLI::log( ( $this->dry ? '[dry] ' : '' ) . $m ); }
}
WP_CLI::add_command( 'renee', 'Renee_Seed_Command' );
```
În `functions.php`: `if ( defined( 'WP_CLI' ) && WP_CLI ) { require RENEE_DIR . '/inc/cli.php'; }`.

Notă pentru implementator: `get_page_by_title` e depreciat din WP 6.2 — folosește în loc `WP_Query` cu `title => $name`, `post_type => product`, `posts_per_page => 1`.

- [ ] **Step 3: Scrie `content.json`** din prototip, apoi `seed/README.md` (cum se rulează, flag-urile, ce nu conține, cum se adaugă o poză: `images` + fișier în `assets/img/`).

- [ ] **Step 4: Rulează**

```bash
wp renee seed --dry-run
wp renee seed
wp renee seed          # a doua oară: zero creări, doar update-uri, zero duplicate
wp post list --post_type=page --fields=ID,post_name,post_title --format=csv | sort
wp menu item list principal --fields=title,type,menu_item_parent --format=csv
wp post list --post_type=post --post_status=draft --format=count     # 4
wp option get page_for_posts
wp eval 'echo count(get_field("momente","<ID home>")["randuri"]), " momente; ", count(get_field("meniu_featured","<ID home>")["produse"] ?: []), " featured\n";'
```
Expected: paginile existente păstrate (aceleași ID-uri), meniul cu Catering sub Evenimente, 4 articole draft, 3 momente cu produse găsite (dacă vreun nume nu se potrivește, WARNING și câmp gol — raportează numele).

- [ ] **Step 5: Commit**: `feat(seed): wp renee seed + content.json din prototip`.

---

### Task 11: Verificare de fază, măsurători, jurnal

**Files:**
- Modify: `$REPO/docs/PERFORMANTA.md`, `docs/JURNAL-SESIUNI.md`, `docs/DECIZII.md`

- [ ] **Step 1: Toate paginile, la 1440 și 375, în browser** (controlerul): home cu toate secțiunile, despre, evenimente, contact, blog, un articol; consolă curată; fără overflow; Query Monitor: < 40 interogări pe home, 0 duplicate, 0 erori PHP. Pe home: video-ul lipsește → placeholder `.ph`, header-ul peste hero e crem pe fundalul placeholder-ului (contrast de verificat, altfel `header:not(.scrolled)` se tratează în Faza 6).
- [ ] **Step 2: Lighthouse mobil** pe `/` și `/despre/` (headless, ca la Faza 1); linii noi în `PERFORMANTA.md`. Ținta: home ≥ 90 fără video.
- [ ] **Step 3: `DECIZII.md`** — Faza 2: `instagram` mutat în options; `#servicii` → `.servicii`; card de preparat fără coș până în Faza 3; contactul fără formular până în Faza 4 (CTA mailto/tel); relationship-urile din seed după nume, cu WARNING dacă lipsesc; `pagina-blog` pe body prin `body_class`.
- [ ] **Step 4: Jurnal** în `renee-wp`: intrarea Fazei 2 (Făcut / Nu am putut / Pentru cealaltă sesiune: Faza 3 Woo / Întrebări: numele reale ale celor 3 momente și ale celor 6 featured dacă seed-ul n-a găsit produse; video hero; pozele de galerie; testimoniale reale).
- [ ] **Step 5: Commit**: `docs: verificare Faza 2, măsurători, jurnal`.

---

## Self-review

**Acoperire spec:** §4.1 (unde stă conținutul) → Task 3, 10 · §4.2 field groups → Task 3 · §4.3 seed idempotent cu `--dry-run`/`--only`, imagini reale importate, Unsplash exclus, `[DRAFT]` → Task 10 · §3 `home.js`, `share.js`, `renee-config` i18n, enqueue condiționat → Task 4, 5 · §2 partiale SCSS, buget → Task 1, 2 · §1.2 template-parts pe secțiune → Task 6–9 · §11 → Task 11. Catering (`page-catering.php`) și Meniu rămân Faza 3, conform tabelului de faze. Modalul de rezervare și formularul de contact rămân Faza 4; contactul are CTA fără formular fals.

**Placeholder-e:** `content.json` din Task 10 are `"…"` doar în schema ilustrativă; pasul 3 cere extragerea integrală din prototip, cu liniile paginilor date în „Starea prototipului". Niciun „TBD".

**Consistență de nume:** `renee_field`, `renee_titlu`, `renee_img`, `renee_gallery`, `renee_products_by_ids`, `renee_section_head` definite în Task 4, folosite în 6–9. `template-parts/blog/card` creat în Task 7 pasul 2, folosit în 9. `shop/card` cu `$args['product']`, `$args['delay']` în 6, 7, 8. Câmpurile din Task 3 = cheile din `content.json` (Task 10). Clasa `.servicii` în Task 2 și Task 8. `$GLOBALS['renee_needs_lightbox']` setat în Task 4 și citit în footer (Task 4).
