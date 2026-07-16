# Partiale header / footer — Renée

Sursă unică de copy-paste pentru header și footer, folosite identic pe toate paginile site-ului (`index.html`, `magazin.html`, `produs.html`, `cos.html`, `checkout.html`, `comanda-confirmata.html`, `despre.html`, `contact.html`, `evenimente.html`, `blog.html`, `articol.html`).

> **La modificarea meniului, actualizează aici + toate paginile.**

## Header

„Despre" duce spre pagina dedicată `despre.html`. Link-urile `#meniu` și `#vizita` sunt ancore pe home: pe `index.html` rămân `index.html#meniu` / `index.html#vizita`, pe celelalte pagini la fel (ca mai jos).

```html
<!-- WP: header.php -->
<header id="header">
  <a class="logo" href="#top">Renée</a>
  <button class="burger" id="burger" aria-label="Meniu" aria-expanded="false">Meniu</button>
  <nav id="nav">
    <a href="despre.html">Despre</a>
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
</header>
<!-- /WP: header.php -->
```

## Footer

```html
<!-- WP: footer.php -->
<footer>
  <div class="wrap">
    <div class="footer-top">
      <div class="footer-col footer-brand">
        <a href="index.html" class="footer-logo">Renée</a>
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
          <a href="magazin.html">Magazin</a>
          <a href="despre.html">Despre</a>
          <a href="evenimente.html">Evenimente</a>
          <a href="blog.html">Blog</a>
          <a href="contact.html">Contact</a>
        </nav>
      </div>
      <div class="footer-col footer-info">
        <h4>Vino la noi</h4>
        <p><span class="fi-label">Oasis Mall</span>Chișinău</p>
        <p><span class="fi-label">A doua locație</span>str. Ismail 33, Chișinău <!-- DRAFT: de confirmat --></p>
        <p><span class="fi-label">Program</span>Zilnic 08:00 – 22:00 <!-- DRAFT --></p>
        <a href="tel:+37360000000">+373 60 000 000 <!-- DRAFT: telefon de confirmat --></a>
      </div>
    </div>
    <div class="footer-bottom">
      <span class="footer-meta">© 2026 Renée · Chișinău</span>
      <span class="footer-meta">Toate drepturile rezervate</span>
    </div>
  </div>
</footer>
<!-- /WP: footer.php -->
```

## Scripturi necesare pe fiecare pagină nouă cu magazin/coș

Înainte de `</body>`, în această ordine:

```html
<script src="data/products.js"></script>
<script src="js/cart.js"></script>
<script src="js/shop.js"></script>
<script src="js/main.js"></script>
```

Pe paginile fără funcționalitate de magazin (dar cu badge coș în header), e suficient:

```html
<script src="js/cart.js"></script>
<script src="js/main.js"></script>
```
