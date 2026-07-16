# Task 9, 10, 11 — Coș & Checkout — raport implementare

## Fișiere atinse

- `js/shop.js` — adăugat `Shop.renderCart(containerId, summaryId)` (+ helpers `cartLineHTML`, `cartSummaryHTML`) în același IIFE, expus pe `window.Shop`. Randează liniile coșului (thumbnail, nume, variație, preț unitar, stepper ±, subtotal linie, șterge), sumar (subtotal/livrare/total, notă „Livrare gratuită!”/prag), empty state cu link spre magazin, ascunde `#toCheckout` când coșul e gol, re-randează automat pe `Cart.onChange`.
- `cos.html` (nou) — head standard + shop.css, header/footer canonic din `PARTIALS.md`, `#cartTable` + `#cartSummary` + buton `#toCheckout`, scripturi în ordinea cerută, apel `Shop.renderCart('cartTable','cartSummary')`.
- `js/checkout.js` (nou) — `window.Checkout.init()`: redirect/mesaj gol dacă `Cart.count()===0`, randare sumar comandă live, radio livrare `delivery`/`pickup` (ascunde/arată adresă, arată select locație pickup, comută opțiunile de plată la „Plată la ridicare”), validare custom (`setErr`/`clearErr`, `.field-msg.show`, focus pe primul câmp greșit) — nume, telefon (min 6 cifre), email (regex), adresă sau locație pickup obligatorii condiționat, submit „Se trimite…” cu `setTimeout` 1200ms, nr. comandă determinist `'RN-' + (1000 + Cart.count()*7 + Cart.subtotal()%97)` calculat **înainte** de `Cart.clear()`, salvare `sessionStorage.renee_last_order`, apoi `Cart.clear()` + redirect `comanda-confirmata.html`.
- `checkout.html` (nou) — `.checkout-grid` cu formular (`co-section` contact / livrare / plată) + `aside#orderSummary`; select pickup cu „Oasis Mall” (real) și a doua locație inventată (`str. Ismail 33, Chișinău`, marcată `<!-- DRAFT: adresă de confirmat -->`); comentariu `<!-- DEMO: plata „card online" simulată; WP → gateway maib/paynet -->`; empty-state `#checkoutEmpty` ascuns implicit, arătat de `checkout.js` când coșul e gol; scripturi în ordinea cerută + `js/checkout.js` + `Checkout.init()`.
- `comanda-confirmata.html` (nou) — citește `sessionStorage.renee_last_order`, afișează `.confirm-box` cu check, nr. comandă, `#orderRecap` (produse, subtotal, livrare, total, metodă livrare/locație, metodă plată, timp estimat), CTA spre magazin; fără comandă → mesaj neutru + link magazin.
- `css/shop.css` — adăugat stiluri pentru `.field input/select` pe fundal deschis (`.co-section .field`, care nu existau — cele din `main.css` erau gândite pt. modalul închis la culoare) și `#checkoutEmpty{display:none}` / `.show{display:block}`.

## Verificare

`node --check js/shop.js js/checkout.js` → fără erori de sintaxă; toate cele 5 fișiere confirmate cu `ls`.

## Concerns

- Nu am putut rula un browser (interzis explicit în instrucțiuni) — fluxul complet (magazin → coș → checkout → confirmare) nu a fost testat vizual/interactiv, doar verificat static (structură HTML, ordine scripturi, referințe la ID-uri/clase existente în `css/shop.css`).
- Al doilea sediu (`str. Ismail 33, Chișinău`) este o adresă plauzibilă inventată — marcată draft, de confirmat cu clientul.
- `Shop.renderCart` își leagă `Cart.onChange` o singură dată per apel (flag `cartRenderBound`); dacă pagina pornește cu coșul deja gol, listener-ul de re-randare nu se atașează (empty-state e static) — acceptabil pentru acest scop, dar de reținut dacă se adaugă interacțiuni ulterioare pe `cos.html` fără reload.
