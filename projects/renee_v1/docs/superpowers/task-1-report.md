# Task 1 Report — Faza 1 (Magazin): Tasks 4, 5, 6, 7, 8

## Files touched

- Created: `css/shop.css`
- Created: `js/shop.js`
- Created: `magazin.html`
- Created: `produs.html`
- Modified: `index.html`

## What was done

### Task 4 — `css/shop.css`
Wrote styles for all classes listed in the plan's interfaces: `.shop-hero`, `.cat-filters`/`.cat-filter`(`.active`), `.product-grid`, `.product-card` (`img`, `.pc-body`, `.pc-name`, `.pc-price`, `.pc-old`, `.pc-sale`), `.badge-sale`, `.product-detail`, `.pd-gallery`, `.pd-info`, `.qty-stepper`, `.btn-add`, `.cart-table`, `.cart-line`, `.cart-summary`, `.checkout-grid`, `.co-section`, `.field`, `.field-msg`, `.pay-options`, `.order-summary`, `.confirm-box`. Used only existing CSS custom properties (`--cream`, `--cream-2`, `--ink`, `--ink-soft`, `--terra`, `--caramel`, `--sage`) and the existing fonts. Responsive grid via `repeat(auto-fill,minmax(240px,1fr))`, checkout grid collapses to 1 column and cart-table restacks on mobile, and a `@media (prefers-reduced-motion: reduce)` block disables the card/button transitions.

### Task 5 — `js/shop.js`
Implemented `window.Shop` with exactly the 4 functions requested (no `renderCart`, per instructions):
- `Shop.money(n)` → `n + ' lei'`
- `Shop.renderGrid(containerId, catId)` — builds product cards linking to `produs.html?id=<id>`, with sale badge/old-new price when `onSale`.
- `Shop.renderFilters(containerId, onSelect)` — renders "Toate" + category pills, toggles `.active`, calls `onSelect(catId)`.
- `Shop.renderProductDetail(containerId, id)` — reads `id` from `location.search` via internal `getParam` helper if not passed; renders gallery, price, variation `<select>` (updates price live), quantity stepper (min 1), and "Adaugă în coș" button that calls `Cart.add(...)` and shows an inline "Adăugat în coș ✓" confirmation that fades after ~2.2s. Shows a not-found state with a link back to the shop when the id is missing/invalid.

Written in the existing ES5 IIFE/`var` style matching `js/main.js` and `js/cart.js`.

### Task 6 — `magazin.html`
Standard head (shop.css added), header/footer copied verbatim from `PARTIALS.md` (including `WP:` comments), a `.shop-hero` section, `#shopFilters` + `#shopGrid` containers, and the exact script block from the plan (`Shop.renderFilters` wired to `Shop.renderGrid`, initial `renderGrid('shopGrid','all')`). Script order: `data/products.js`, `js/cart.js`, `js/shop.js`, `js/main.js`, inline script.

### Task 7 — `produs.html`
Standard head + shop.css, header/footer partials, `#productDetail` container, and a related-products block built inline (per the plan's "render manual sau prin Shop" note) using `getProductsByCategory` filtered to the same category, excluding the current product, capped at 3. Handles the missing/invalid `id` case via `Shop.renderProductDetail`'s own not-found branch.

### Task 8 — "Produse recomandate" on `index.html`
Added `css/shop.css` to `<head>`; added `data/products.js` and `js/shop.js` before `js/main.js` in the script block. Inserted the `#produse` section (title "Din magazinul nostru", `#featuredGrid`, CTA to `magazin.html`) immediately before the footer, and an inline script rendering the first 4 `getFeatured()` products as `.product-card`s. Rest of the home page left untouched.

## Verification

- `node --check js/shop.js` → **passed**, no output (syntax OK).
- Read back `magazin.html`, `produs.html`, and the modified section of `index.html` to confirm: header/footer match `PARTIALS.md` exactly, script tag order matches the required `data/products.js → js/cart.js → js/shop.js → js/main.js → inline` sequence on all three files, and the new home section sits directly before `<!-- WP: footer.php -->`.
- No browser tooling or git commands were used, per instructions.

## Verification (re-run)

Re-checked this task on a later pass: all 5 tasks (4-8) were already present and correct in the repo (implemented in an earlier run). Re-verified `node --check` on `js/shop.js`, `js/cart.js`, `data/products.js` (all OK), re-read `magazin.html`, `produs.html`, `index.html`, `css/shop.css`, `js/shop.js` in full against the plan's exact requirements — no discrepancies found, no edits were necessary.

## Concerns / deviations

1. ~~Pre-existing risk in `js/main.js`...~~ — **Resolved.** `js/main.js` line 5 now does `var title = document.getElementById('heroTitle'); if (title) { ... }` (null-checked), so pages without a hero (`magazin.html`, `produs.html`) no longer throw and the rest of `main.js` (burger menu, reveal observer, reservation modal) runs fine on those pages.
2. `Shop.renderProductDetail` and the related-products inline script duplicate the card-HTML logic (also present in `renderGrid`) since Task 5 was scoped to not add a generic "render list of arbitrary products" helper. This is intentional per the plan's Task 5 scope but is minor duplication that could be refactored into a shared `Shop` helper in a later task.
3. All other plan requirements (money formatting, sale badges, product-card links, CSS tokens only, header/footer verbatim from PARTIALS.md, script order) were followed as written.
