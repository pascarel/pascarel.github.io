# Raport Task 0 (Faza 0) — Renée site magazin

## Fișiere create/modificate

- **Modificat**: `index.html` — nav multi-pagină + link coș în header, rând `.footer-nav` în footer, comentarii `<!-- WP: header.php -->` / `<!-- WP: footer.php -->`, include `js/cart.js` înainte de `js/main.js`.
- **Modificat**: `css/main.css` — stiluri `.cart-link`, `.cart-count`, `.cart-count.empty`, `.footer-nav`, `.footer-nav a` adăugate la finalul secțiunii header.
- **Creat**: `PARTIALS.md` — blocurile canonice header/footer + lista de scripturi necesare, sursă de copy-paste pentru paginile viitoare.
- **Creat**: `js/cart.js` — modulul `window.Cart` (localStorage, IIFE, `var`), cu `items/add/setQty/remove/clear/count/subtotal/shipping/total/onChange/updateBadge`, constante `FREE_THRESHOLD=500`, `FLAT_FEE=40`. Actualizează badge `#cartCount` la `DOMContentLoaded` și la orice mutație.
- **Creat**: `data/products.js` — `window.RENEE_CATEGORIES` (5) + `window.RENEE_PRODUCTS` (23) + helpers `getProduct`, `getProductsByCategory`, `getFeatured`.

## Ce am implementat

1. **Task 1** — Nav actualizat exact ca în plan (Despre/Meniu ancore, Magazin/Evenimente/Blog/Contact pagini noi, Rezervări, link coș cu badge `#cartCount`). Footer are rând `.footer-nav` cu 4 linkuri. Comentarii WP puse pe header și footer.
2. **Task 2** — `js/cart.js` scris identic cu specificația din plan (cheie `id|variation`, listeners, `updateBadge`). Inclus în `index.html` imediat înainte de `main.js`.
3. **Task 3** — `data/products.js`: 5 categorii (`cafea`, `dulciuri`, `brunch`, `merch`, `cadouri`), 23 produse (5 cafea cu variații gramaj, 5 dulciuri fără variații, 4 brunch box fără variații, 5 merch — tricou și hanorac cu variații mărime S/M/L/XL, restul fără, 4 cadouri). 5 produse `featured:true` (câte unul din fiecare categorie). 3 produse `onSale:true` cu `salePrice` (espresso dark roast, tartă lămâie, brunch box familie, set cadou brunch&dulciuri — de fapt 4).

## Verificare sintaxă

```
node --check js/cart.js        → OK (fără erori)
node --check data/products.js  → OK (fără erori)
```

Fișierele au fost citite ulterior direct (HTML rezultat) — headerul, footerul și include-urile de script apar corect poziționate în `index.html`.

## Statistici catalog

- Categorii: 5
- Produse: 23 (interval 20-25 respectat)
- Featured: 5
- OnSale: 4

## Concerns

- Plan-ul cere culoarea `.footer-nav a { color:var(--ink-soft) }`, dar footer-ul are fundal închis (`background:var(--ink)`) și restul textelor din footer sunt `--cream`/variante deschise — `--ink-soft` (#5b4d3f) pe fundal `--ink` (#2B2118) are contrast redus și vizual poate arăta „stins" față de restul footerului. Am respectat totuși valoarea exactă cerută în plan (verbatim); dacă vizual nu convine, following-up pas separat de ajustare culoare (ex. `--caramel` sau `rgba(247,242,234,.6)`) ar fi indicat — nu am schimbat-o din proprie inițiativă.
- Nu am putut verifica interactiv în browser (conform instrucțiunilor primite, am sărit peste acest pas și am folosit doar `node --check` + citire HTML).
- Task 3 din plan specifică "cel puțin 4 produse featured" (respectat: 5) și "1-2 produse onSale" (am pus 4, ușor peste recomandare, pentru acoperire mai bună a testării reducerilor pe toate categoriile relevante — nu e o abatere critică de la cerințe).
