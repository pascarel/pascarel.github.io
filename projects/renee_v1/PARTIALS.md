# Partiale — Renée

Ce se repetă pe pagini și **de unde se ia**. Actualizat 10 sept. 2026.

Site-ul e static, fără build. Există două mecanisme diferite — nu le confunda:

| Mecanism | Ce acoperă | Cum se modifică |
|---|---|---|
| **Copy-paste**, documentat aici | header, footer, `<head>` | schimbi aici **și** în toate cele 13 pagini |
| **Injectat din JS**, sursă unică | modalul de rezervare, lightbox-ul de galerie | schimbi într-un singur loc |

Cele 13 pagini: `index` · `magazin` · `produs` · `cos` · `checkout` · `comanda-confirmata` · `despre` · `contact` · `evenimente` · `blog` · `articol` · `termeni` · `confidentialitate`

---

## 1. Modalul de rezervare — NU se copiază

Trăiește în **`js/rez-modal.js`** și se injectează singur în `document.body`.

```html
<script src="js/rez-modal.js"></script>   <!-- OBLIGATORIU înainte de js/main.js -->
```

`js/main.js` caută `#rezModal` la inițializare; dacă scriptul rulează după, modalul nu se leagă și butonul „Rezervări" nu face nimic. Asta s-a și întâmplat până pe 10 sept. 2026, când modalul era scris direct în `index.html` — butonul exista în header-ul tuturor paginilor, dar funcționa doar pe home.

Conține trei pickere: `#pickPers`, `#pickLoc` și `#pickCand` (dată + oră comasate).

**WP:** → `get_template_part('template-parts/modal-rezervare')`

## 2. Lightbox-ul de galerie — parțial copiat

Markup-ul containerului (`#lightbox`) e copiat în cele 3 pagini cu galerie: `index`, `despre`, `evenimente`. Logica e în `js/main.js` și se leagă singură de orice element cu `data-lightbox`.

Un element de galerie arată așa:

```html
<button type="button" class="g-item g-1 reveal" data-lightbox aria-label="Mărește: TEXT ALT">
  <img class="photo" src="…" alt="TEXT ALT" loading="lazy">
  <span class="g-veil" aria-hidden="true"><span class="g-zoom"></span></span>
</button>
```

## 2.1 Banda decorativă cu pattern — copiată în 2 pagini

SVG inline cu `<defs><pattern>`, în trei pagini: `index.html` („Povestea numelui"), `despre.html` („Ce ne ghidează") și `evenimente.html` („Tipuri de evenimente"). Secțiunea gazdă trebuie să aibă clasa **`poveste`**, care îi dă `position:relative` și `overflow:hidden`.

Trei numere care merg împreună — dacă schimbi unul, le schimbi pe toate:

| | Valoare | Unde |
|---|---|---|
| `patternTransform="scale(…)"` | `0.294` | în SVG, în ambele pagini |
| lățimea benzii | `80px` | `.patern-banda` din `css/main.css` |
| lățime | = `271.771 × scale` | altfel firul se taie sau lasă gol |
| `height` din `<pattern>` | `104.38` | pasul real dintre frunze — vezi mai jos |

**Motivul NU se rotește.** `img/patern.svg` e un câmp de 16 fire **verticale** puse alături — fiecare fir are tulpina pe stânga și frunzele care mătură spre dreapta-sus. Se ia un singur fir, așa cum e, și se repetă pe verticală. O rotație de 90° culcă tulpina și strică desenul.

**Pasul vertical e `104.38`, nu `297.861`.** Firul desenat în `patern.svg` are 297.861 înălțime, dar conține doar două grupuri de frunze — la y=67.6 și y=172.0 — urmate de ~124 de unități de tulpină goală. Repetat la înălțimea lui naturală, apar goluri mari între grupuri. Distanța reală dintre frunze, măsurată pe centroizi, e **104.38**, iar în brandbook elementele stau lipite.

De aceea `<pattern>` are `height="104.38"` și conține **patru copii** ale firului, la `+104.38`, `0`, `-104.38` și `-208.76` — fereastra dalei fiind mai scurtă decât firul, copiile umplu ce ar rămâne gol la margini.

Culoarea vine prin `currentColor` — se schimbă din `.patern-banda { color: … }`, nu în markup.

## 3. `<head>` — fonturi

Identic pe toate cele 13 pagini, imediat după `<meta name="description">`:

```html
<link rel="preload" href="fonts/cormorant-400-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="fonts/opensans-300-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="css/fonts.css">
<link rel="stylesheet" href="css/main.css">
<link rel="stylesheet" href="css/shop.css">
```

Fonturile sunt self-hostate. **Nu readuce `<link>` către Google Fonts** — vezi `CLAUDE.md` §5.

## 4. Header

Logo-ul e **SVG inline**, ca `currentColor` să-i schimbe culoarea la scroll. Sursa: `img/logo_simple.svg`.

```html
<!-- WP: header.php -->
<header id="header">
  <a class="logo" href="index.html#top"><!-- conținutul din img/logo_simple.svg, inline --><span class="sr-only">Renée</span></a>
  <button class="burger" id="burger" aria-label="Meniu" aria-expanded="false">Meniu</button>
  <nav id="nav">
    <a href="despre.html">Despre</a>
    <a href="meniu.html">Meniu</a>
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
</header>
<!-- /WP: header.php -->
```

## 5. Footer

Linkurile legale stau în `footer-bottom`, nu în coloana de navigare.

```html
<!-- WP: footer.php -->
<footer>
  <div class="wrap">
    <div class="footer-top">
      <div class="footer-col footer-brand">
        <a href="index.html" class="footer-logo"><!-- conținutul din img/logo.svg, inline --><span class="sr-only">Renée</span></a>
        <p class="footer-tagline">Cafenea &amp; all day breakfast în Chișinău. O nouă emoție, un nou început.</p>
        <div class="footer-social">
          <a href="https://www.instagram.com/renee_brunch/" target="_blank" rel="noopener">Instagram</a>
          <a href="https://www.facebook.com/renee.brunch" target="_blank" rel="noopener">Facebook</a>
          <a href="https://www.tiktok.com/@renee_brunch" target="_blank" rel="noopener">TikTok</a>
        </div>
      </div>
      <div class="footer-col">
        <h4>Explorează</h4>
        <nav class="footer-links">
          <a href="index.html">Acasă</a>
          <a href="meniu.html">Meniu</a>
          <a href="despre.html">Despre</a>
          <a href="evenimente.html">Evenimente</a>
          <a href="blog.html">Blog</a>
          <a href="contact.html">Contact</a>
        </nav>
      </div>
      <div class="footer-col footer-info">
        <h4>Vino la noi</h4>
        <p><span class="fi-label">Renée</span>Oasis Mall, str. Bogdan-Voievod 1, Chișinău</p>
        <p><span class="fi-label">Renée Urban</span>bd. Ștefan cel Mare și Sfânt 115/1, Chișinău</p>
        <p><span class="fi-label">Program</span>Zilnic 08:00 – 22:00 <!-- DRAFT --></p>
        <a href="tel:+37360000000">+373 60 000 000 <!-- DRAFT: telefon de confirmat --></a>
      </div>
    </div>
    <div class="footer-bottom">
      <span class="footer-meta">© 2026 Renée · Chișinău</span>
      <div class="footer-meta">
        <a href="termeni.html">Termeni și condiții</a>
        |
        <a href="confidentialitate.html">Politică de confidențialitate</a>
      </div>
      <span class="footer-meta">Toate drepturile rezervate</span>
    </div>
  </div>
</footer>
<!-- /WP: footer.php -->
```

## 5.1 Elementul activ din meniu — NU se marchează manual

`js/main.js` adaugă singur `class="is-current"` şi `aria-current="page"` pe linkul care corespunde paginii curente. Nu pune nimic în HTML.

Subpaginile moştenesc părintele: `produs`, `cos`, `checkout`, `comanda-confirmata` → **Meniu** · `articol` → **Blog**.
`index`, `termeni` şi `confidentialitate` nu au element în meniu, deci nu se activează nimic — e corect.

Butonul „Rezervări" şi „Coş" sunt excluse din selector: primul are `href="index.html#vizita"` şi s-ar activa pe home.

## 6. Scripturi, în ordine, înainte de `</body>`

Pagini cu magazin/coș (`index`, `magazin`, `produs`, `cos`, `checkout`, `comanda-confirmata`):

```html
<script src="data/products.js"></script>
<script src="js/cart.js"></script>
<script src="js/shop.js"></script>
<script src="js/rez-modal.js"></script>
<script src="js/main.js"></script>
```

Pagini fără magazin (dar cu badge de coș în header):

```html
<script src="js/cart.js"></script>
<script src="js/rez-modal.js"></script>
<script src="js/main.js"></script>
```

`js/contact.js` se adaugă **doar** pe `contact.html`.
