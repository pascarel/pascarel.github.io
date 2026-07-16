# Renée — Site de prezentare + Magazin online (template-uri statice)

**Data:** 2026-07-13
**Status:** Design aprobat, pregătit pentru plan de implementare

## Context și scop

Landing-ul static existent (`index.html` + `css/main.css` + `js/main.js`, vanilla, fără build) se extinde într-un **site profesional de prezentare cu pagini interne + magazin online** (catalog, coș, checkout, livrare).

**Etapa curentă:** doar template-uri statice de prezentare către client — HTML/CSS/JS vanilla, fără backend. Coșul și checkout-ul funcționează pe `localStorage` (flux complet demonstrabil, fără plată reală).

**Etapa viitoare (documentată, nu implementată acum):** migrare curată în WordPress + WooCommerce. Tot codul din etapa curentă e structurat ca migrarea să fie mecanică.

## Decizii confirmate

- **2 locații:** Oasis Mall (existent) + a doua locație (adresă plauzibilă inventată în Chișinău, marcată „de confirmat").
- **Catalog:** cafea boabe/măcinată, dulciuri & patiserie, brunch box, merch, cadouri/seturi.
- **Livrare:** doar Chișinău. Tarif fix **40 lei**, **gratis dacă subtotal ≥ 500 lei**. Plus ridicare personală (0 lei) din oricare locație.
- **Plată:** card online (simulat), card la curier, cash la curier, plată la ridicare. Fără gateway real în etapa curentă.
- **Stil:** identic landing-ului — tokens crem/ink/terra, fonturi Cormorant Garamond + Outfit, animații reveal/parallax existente, respectă `prefers-reduced-motion`.
- **Conținut:** draft (produse, prețuri, texte, imagini stock Unsplash) marcat clar „de înlocuit", ca în landing-ul actual.

## Arhitectură & fișiere

Fără build, vanilla. Structură pregătită pentru WP/Woo.

```
renee-landing/
├── index.html                 → home (existent, + secțiune nouă „Produse recomandate")
├── despre.html   contact.html
├── magazin.html  produs.html  cos.html  checkout.html  comanda-confirmata.html
├── blog.html     articol.html
├── evenimente.html
├── css/
│   ├── main.css               (existent — tokens + shared)
│   └── shop.css               (nou — magazin/coș/checkout)
├── js/
│   ├── main.js                (existent)
│   ├── shop.js                (catalog, filtre, render produse & pagină produs)
│   └── cart.js                (coș localStorage — sursă unică de adevăr)
└── data/
    └── products.js            (catalog — structură ce mimează Woo)
```

**Principii:**
- Header + footer identice pe toate paginile (copiate manual), marcate cu comentarii `<!-- WP: header.php -->` / `<!-- WP: footer.php -->` pentru a ști exact ce se sparge în template-uri WP.
- Meniu de navigare real: Home · Despre · Meniu · Magazin · Evenimente · Blog · Contact + iconiță coș cu badge count actualizat live.
- Meniul mobil existent se extinde cu noile pagini.
- Coșul: o singură „clasă” `Cart` în `cart.js` (add/remove/update/total/count) folosită de toate paginile.

## Modelul de date produs

`data/products.js` — array de produse cu câmpuri ce mapează 1:1 pe WooCommerce:

```js
{
  id: "cafea-house-blend",        // → post slug
  name: "House Blend",            // → post_title
  category: "cafea",              // → product_cat (taxonomie)
  price: 180,                     // → _price (lei)
  onSale: false, salePrice: null, // → _sale_price
  images: ["...", "..."],         // → galerie produs
  shortDesc: "...",               // → excerpt
  description: "...",             // → conținut
  variations: {                   // → product variations Woo
    label: "Gramaj",
    options: [
      { name: "250g", price: 180 },
      { name: "500g", price: 320 },
      { name: "1kg",  price: 600 }
    ]
  },
  stock: "instock",               // → _stock_status
  featured: true                  // → produse recomandate pe home
}
```

- Categoriile stau într-un array separat `categories` (id, nume, imagine, descriere) pentru filtrele din magazin.
- ~20-25 produse draft total (4-6/categorie), prețuri în lei plauzibile, imagini stock Unsplash marcate „de înlocuit”.
- Variații doar unde au sens: cafea = gramaj; merch tricou = mărime.

## Coș, checkout & logica livrare/plată

### Coș (`cos.html`)
- Listă: thumbnail, variație aleasă, cantitate (±), preț linie, șterge.
- Sumar: subtotal, livrare (live), total.
- Golește coș / Continuă cumpărăturile / Spre checkout.
- Coș gol → empty state cu link spre magazin.

### Checkout (`checkout.html`)
Un singur ecran, structurat ca Woo, validare custom (stilul formularului de rezervare din landing):

1. **Date contact:** nume, telefon, email.
2. **Metodă livrare** (radio):
   - Livrare Chișinău — 40 lei, sau gratis dacă subtotal ≥ 500 lei (badge „Livrare gratuită!” automat).
   - Ridicare personală — alegi locația (Oasis Mall / a doua locație), 0 lei.
3. **Adresă livrare:** apare doar la „Livrare Chișinău” (stradă, bloc/ap, reper); ascunsă la pickup.
4. **Metodă plată** (radio): card online · card la curier · cash la curier · (la pickup: plată la ridicare).
5. **Sumar comandă** sticky pe desktop.
6. Buton „Plasează comanda” → validare → simulat (delay, ca la rezervare) → `comanda-confirmata.html`.

### Logica livrare (funcție în `cart.js`)
```
livrare = metoda === "pickup" ? 0
        : subtotal >= 500      ? 0
        : 40
```

### Confirmare (`comanda-confirmata.html`)
Număr comandă fictiv, sumar, mesaj + timp estimat livrare/ridicare. Golește coșul.

**Notă:** „card online” NU integrează plată reală — doar simulează. Marcat clar în cod și în ghidul de migrare unde intră gateway-ul real.

## Pagini de prezentare

- **`despre.html`** — poveste extinsă, valori, cele 2 locații, galerie. Reia parallax + reveal.
- **`contact.html`** — date ambele locații, program, telefon, formular contact (validare custom, trimitere simulată), 2 hărți Google iframe.
- **`evenimente.html`** — versiune extinsă a secțiunii de pe home: tipuri de evenimente, servicii, galerie, CTA.
- **`blog.html`** — grid articole draft (5-6 carduri) cu categorii.
- **`articol.html`** — articol individual (layout tipografic, articole conexe).

## Ghid migrare WP/Woo (documentat în README / MIGRARE-WP.md)

| Static | WordPress / Woo |
|---|---|
| `data/products.js` | CPT `product` (WooCommerce) + `product_cat` |
| `magazin.html` | `archive-product.php` |
| `produs.html` | `single-product.php` |
| `cos.html` / `checkout.html` | template-uri Woo (`cart` / `checkout`) |
| `cart.js` localStorage | sesiune Woo + `WC()->cart` |
| logica livrare | Woo Shipping Zones (Chișinău) + „Free shipping ≥ 500” |
| plată simulată | gateway maib/paynet + „cash/card la curier” (COD) |
| `despre` / `contact` / `evenimente` | pagini + ACF / template-parts |
| blog / articol | postări native WP |
| header / footer | `header.php` / `footer.php` |
| texte hardcodate RO | câmpuri ACF + WPML (text domain `renee`) |

## Non-obiective (etapa curentă)

- Fără plată reală (fără maib/paynet).
- Fără backend, cont utilizator, sau persistență server.
- Fără trimitere reală de email/comenzi.
- Fără WordPress/WooCommerce în această etapă — doar documentăm migrarea.

## Criterii de succes

- Client poate parcurge tot fluxul vizual: home → magazin → produs → coș → checkout → confirmare.
- Coșul persistă între pagini (localStorage), badge count corect în header.
- Livrarea se calculează corect (40 lei / gratis ≥ 500 / 0 la pickup).
- Toate paginile consistente stilistic cu landing-ul, responsive, respectă `prefers-reduced-motion`.
- Cod marcat clar pentru migrare WP/Woo.
