# Instrucțiuni de lucru — pascarel.github.io

> Fișier citit automat de Claude Code la începutul fiecărei sesiuni.
> Actualizat: 9 septembrie 2026.

---

## 0. Regula principală

**Nu lua decizii grăbite fără mine.**

Când apare o alegere care schimbă direcția muncii — arhitectură, locația codului, ce se păstrează și ce se rescrie, ce înlocuiește un conținut lipsă — te oprești și întrebi. Nu presupui, nu inventezi valori care lipsesc, nu „completezi" cu ceva plauzibil.

Corolar: dacă un fișier, un font, o imagine sau o adresă lipsește, **spui că lipsește**. Nu pui un placeholder și mergi mai departe.

---

## 1. De unde se lucrează

Două contexte, anunțate explicit de mine la începutul sesiunii:

| Zic... | Înseamnă |
|---|---|
| **„suntem acasă"** | Lucrez de pe laptop. Sursa e `~/Documents/GitHub/pascarel.github.io`. Pot avea fișiere locale încă necommit-uite. |
| **„suntem la lucru"** | Sunt la serviciu. Sursa e **exclusiv GitHub** — doar ce e commit-uit și pushed există. |

**Important:** sesiunile Claude Code din browser/cloud rulează întotdeauna pe un clone proaspăt din GitHub, indiferent unde sunt eu fizic. Un fișier care există doar pe laptop și nu e pushed **nu e vizibil** în acea sesiune. Dacă ai nevoie de el, ceri să fie commit-uit și pushed, sau atașat în chat.

### 1.1 Două sesiuni paralele — identifică-te corect

Proiectul e dezvoltat de **două sesiuni Claude separate**, care nu se văd una pe alta și nu au memorie comună:

| Sesiune | Rulează | Poate |
|---|---|---|
| **OFICIU** | container cloud, Linux, clone din GitHub | citește repo-ul, analizează, scrie fișiere local în container. **Nu poate face `push`** (403) și nu vede laptopul. |
| **ACASĂ** | laptop, macOS, `~/Documents/GitHub/pascarel.github.io` | modifică fișierele reale, deschide paginile în browser. Push-ul îl face utilizatorul din GitHub Desktop. |

**Prima acțiune în orice sesiune:** rulează `pwd && uname -s`.
`/home/user/…` + `Linux` → ești **OFICIU**. `/Users/…` + `Darwin` → ești **ACASĂ**.

Locul de execuție se fixează la pornirea sesiunii și **nu se schimbă** după. O sesiune pornită din browser rămâne în cloud chiar dacă e deschisă ulterior din aplicația de pe laptop — aplicația e doar fereastra, nu locul unde rulează codul.

**Comunicarea între sesiuni se face exclusiv prin repo**, în [`JURNAL-SESIUNI.md`](JURNAL-SESIUNI.md). Citește-l la început și scrie în el la final. Nu presupune ce a făcut cealaltă sesiune — verifică `git log`.

### Verificarea sincronizării
Pe laptop, în Terminal:
```bash
cd ~/Documents/GitHub/pascarel.github.io
git fetch origin
git diff --stat origin/main -- projects/renee_v1
```
Fără output = surse identice. ✅ Verificat pe 9 sept. 2026 — coincid.

---

## 2. Git

- Nu face `push` fără să întrebi.
- Nu face pull request fără cerere explicită.
- Commit-uri cu mesaje clare, în română sau engleză, consecvent per proiect.
- Branch de lucru curent pentru sesiunile Claude: `claude/serene-fermi-9mknnr`. Merge în `main` îl fac eu.

---

## 3. Repo-ul

Site de portofoliu static, publicat pe GitHub Pages. Fără build, fără `package.json`, fără CI.

```
index.html, en/        — portofoliu (RO + EN)
assets/img/            — screenshot-uri portofoliu + favicon.svg
projects/renee_v1/     — Renée: prezentare + magazin demo (11 pagini)  ← proiect activ
projects/renee_v2/     — Renée v2, o pagină + cart.js (neanalizat încă)
projects/rvg/          — proiect separat
```

---

## 4. TASK PRINCIPAL ACTIV — Renée: magazin WordPress + WooCommerce

**Obiectiv:** transformarea HTML-ului static din `projects/renee_v1` într-un magazin online complet funcțional pe WordPress + WooCommerce, pe **temă curată programată de la zero**.

### Decizii luate (nu se redeschid fără discuție)

| Aspect | Decizie |
|---|---|
| Sursa de design | `projects/renee_v1` |
| Arhitectura | Temă WordPress custom, scrisă de la zero. Fără Storefront, fără page builder. |
| Locația codului | **Repo separat, nou** (nume încă nestabilit) |
| Scope sesiune curentă | Temă + template-uri + importer de produse. Fără gateway de plată în această etapă. |
| Design | Se **refac** după brandbook-ul clientului, nu se păstrează paleta veche. |
| Ce se vinde | **Preparate**, nu produse retail (cafea boabe, merch). Decis 9 sept. 2026. |
| WooCommerce la lansare | **Doar prezentare** — coșul rămâne vizibil în UI, dar nu se vinde online inițial. ⏳ Rămâne de analizat ce se dezactivează concret (checkout, prețuri, gateway-uri, stoc). |
| Pagini de categorie | **Nu există.** O singură pagină de listare — Meniu, cu filtrare în pagină prin JS. Toate arhivele `product_cat` generate de Woo se redirecționează 301 către `/meniu/` și primesc `noindex`. Detalii în `MIGRARE-WP.md` §2.1. |
| Livrare & ridicare | **Dezactivat** pe pagina de preparat până pornesc vânzările online. Acordeonul „Livrare & ridicare" din `js/shop.js` `productDetails()` e **comentat, nu șters** — se reactivează odată cu checkout-ul, împreună cu pragul de 500 lei. |
| Denumirea paginii | `magazin.html` → **`meniu.html`**, iar eticheta din meniu „Magazin" → **„Meniu"** (11 sept. 2026). Un local are meniu, nu magazin; cuvântul funcționează identic în RO/RU/EN și nu promite comerț care încă nu există. |
| Catalog | **Real**, generat din API-ul eat-me.online: 73 de preparate, 7 categorii de bucătărie. Fără băuturi, fără adaosuri. Cele 23 de produse retail draft au fost eliminate. |

### Sursa de meniu real — API eat-me.online

```
https://reneebrunch.eat-me.online/api/v1/menu?language=ro&storeId=14189
```

Meniul **real și complet** al localului: 17 categorii, ~240 de preparate cu nume, descriere, preț per magazin, gramaj, valori nutriționale și imagini pe CDN. Snapshot salvat în `data/menu-eatme-snapshot.json` (9 sept. 2026, ~567 KB).

**Pentru migrarea WooCommerce** — maparea evidentă:
`itemCategories[]` → `product_cat` · `items[]` → CPT `product` · `itemSizes[].prices[]` filtrat pe `storeId` → preț ·
`itemSizes[].buttonImage.src` → imagine produs · `slug` → post_name · `portionWeightGrams` → atribut/weight ·
`nutritionPerHundredGrams` → câmpuri ACF.

⚠️ Câmpurile `allergens` și `labels` există în schemă, dar sunt **goale pentru toate preparatele**. Alergenii afișați acum pe site sunt DRAFT puși de mână. Dacă localul le completează în eat-me, se pot prelua automat.

⚠️ `storeId=14189` e una din cele două locații (în prețuri apare și `storeId=10794`). De clarificat care e Oasis Mall și care Renée Urban — prețurile pot diferi.

### Ghid tehnic existent
`projects/renee_v1/MIGRARE-WP.md` — 254 linii, tabel de mapare pagină → WP/Woo, model de date produs, shipping zones. **De consultat înainte de a scrie cod.** Rămâne referință, dar precede brandbook-ul, deci partea de design e depășită.

### Mediu de test
Nu există PHP/MySQL/WordPress în containerele cloud. Testarea reală (checkout, coș, plăți) se face doar local, pe MAMP sau pe hosting. Codul livrat din cloud e **netestat împotriva unui WooCommerce viu** — asta se spune explicit la fiecare livrare.

---

## 5. Brandbook Renée

### Paletă — sursă unică de adevăr

**Culori principale:**
| Nume | Hex | Rol |
|---|---|---|
| Tiramisu | `#E0D7D1` | fundal principal |
| Crust Brown | `#AF7B5C` | accent |
| Black Pepper | `#242122` | text, secțiuni închise |

**Culori adiționale:**
| Nume | Hex | Rol |
|---|---|---|
| Vin | `#561320` | accent închis |
| Verde | `#6D816C` | accent decorativ |

**Mapare peste tokens-urile vechi din `css/main.css`:**
`--cream` `#F7F2EA` → `#E0D7D1` · `--ink` `#2B2118` → `#242122` · `--terra` `#C46A45` → `#AF7B5C` · `--sage` `#8A9B7C` → `#6D816C`

✅ **Rezolvat 9 sept. 2026** (aprobat de Sergiu):
- `--cream-2` → **`#D5CCC6`** (Tiramisu + 6% Black Pepper), fundal alternativ de secțiune
- `--caramel` → eliminat; pe fundal închis se folosește Crust Brown
- `--ink-soft` → **`#5C5856`** (Black Pepper 70% pe Tiramisu, contrast 4.96 ✓)

Rolurile semantice sunt definite în `css/main.css` `:root` și **acolo se schimbă**, nu prin căutare-înlocuire:
`--accent-text` (Vin, text pe deschis) · `--accent-decor` (Crust Brown, linii/borduri/hover) ·
`--accent-dark` (Crust Brown, text MARE pe închis) · `--accent-fill` (Vin, fundal plin sub text deschis).

### Reguli de contrast (WCAG, calculate)

| Combinație | Raport | Verdict |
|---|---|---|
| Black Pepper pe Tiramisu | 11.26 | ✅ text principal |
| Vin pe Tiramisu | 9.81 | ✅ text |
| Black Pepper pe Crust Brown | 4.42 | ⚠️ doar text mare (18pt+) |
| **Crust Brown pe Tiramisu** | **2.55** | ❌ **niciodată text** — doar logo mare / decor |
| Verde cu orice | max 3.81 | ❌ niciodată text — doar accent decorativ |

Crust Brown pe Tiramisu apare în brandbook ca variantă de logo. E acceptabil pentru logo la dimensiune mare, **nu** pentru text curent, prețuri, butoane sau link-uri. Prețurile și CTA-urile dintr-un magazin trebuie să fie lizibile.

### Fonturi

| Rol | Font | Stare |
|---|---|---|
| Titluri / text evidențiat (`--font-display`) | **Cormorant Garamond** | ✅ self-hostat |
| Text simplu (`--font-body`) | **Open Sans** | ✅ self-hostat |

#### ❌ The Seasons — abandonat (10 sept. 2026)

Fontul din brandbook **nu se mai folosește**. Trei motive, toate blocante:

1. Fișierele primite erau **demo** (`FSP DEMO - The Seasons`): 95 de glife în loc de ~250, zero caractere non-ASCII, fără diacritice RO și **fără `é`** — nu se putea scrie nici măcar „Renée".
2. Nu exista licență webfont, doar `.otf` desktop.
3. **Site-ul va fi RO / RU / EN**, iar The Seasons nu are chirilice deloc.

Fișierele au fost șterse din repo. Nu le readuce.

#### ✅ Cormorant Garamond — decis de Sergiu, 10 sept. 2026

Ales dintre variantele care acoperă **toate trei limbile**. Capcana evitată: multe fonturi cu chirilice pică la `ș`/`ț` **cu virgulă dedesubt** (U+0219/U+021B), având doar sedila. Prata — cel mai apropiat estetic de The Seasons — pică exact aici și nu are deloc subsetul `latin-ext`.

Verificat în browser pe 10 sept.: toate diacriticele RO, `é` și chirilicele redau în fontul propriu, fără fallback.

#### Cum sunt servite

`css/fonts.css` — **28 de reguli `@font-face`**, fișiere `.woff2` în `fonts/`, servite de pe domeniul propriu.

- Grosimi: **300, 400, 500** — singurele folosite în CSS. Nu adăuga 600, nu e folosită nicăieri.
- Italic **doar pe Cormorant** — toate regulile `font-style:italic` din proiect sunt în contexte `var(--serif)`.
- Subseturi: `latin`, `latin-ext`, `cyrillic`, `cyrillic-ext`, separate prin `unicode-range` → un vizitator român **nu descarcă niciodată** fișierele chirilice.
- `font-display:swap` peste tot, `preload` pe cele două fișiere critice.
- Greutate: **427 KB** pentru un vizitator român pe `index.html`; +373 KB doar dacă apare text rusesc.

**Zero cereri către Google** din toate cele 13 pagini — rezolvă și expunerea GDPR (altfel IP-ul fiecărui vizitator ajunge la Google fără consimțământ).

Licențe: Cormorant Garamond — OFL 1.1 · Open Sans — Apache 2.0. Ambele permit găzduirea proprie.

**Ca să schimbi fontul de titluri**, modifici `--font-display` în `:root` din `css/main.css` **și** regulile din `css/fonts.css`.

### Reguli logo (brandbook 2.6)

| Fundal | Varianta de logo |
|---|---|
| Deschis (Tiramisu) | Black Pepper |
| Închis (Black Pepper) | Tiramisu |
| Crust Brown | Black Pepper |
| Verde | Tiramisu |
| Tiramisu (variantă accent) | Crust Brown |

Logo-ul poate sta peste fotografii, cu condiția să rămână clar lizibil și separat de fundal. Se implementează ca variante CSS, nu ca imagine unică.

### Pictograme și pattern
6 pictograme în stil de linie fluidă (monogram RR, tacâmuri, pahar, toaletă, marca WW, arcadă) + pattern chevron repetitiv în Tiramisu și Crust Brown. Pattern-ul devine `background-image` SVG repetabil.

---

## 6. Ce lipsește — de obținut înainte de implementare

- [x] ~~Licență web The Seasons~~ — **abandonat**, înlocuit cu Cormorant Garamond (vezi §5)
- [x] **Logo SVG** — prezent în `img/` (`logo.svg`, `logo_simple.svg`, `logo_symbol.svg`). Inline în toate cele 13 pagini, colorate prin `currentColor`.
- [ ] **Pictograme SVG** (brandbook §5.1) — încă neprimite
- [ ] **Structura multilingvă RO/RU/EN** — nediscutată. Afectează arhitectura (13 pagini × 3 limbi); de decis **înainte** de migrarea pe WordPress, nu după.
- [x] **Pattern SVG** — motivul extras și tileabil. Folosit ca SVG inline cu `<pattern>` în secțiunea „De ce Renée?" din `index.html`.
- [ ] **Restul brandbook-ului** — spațiere, dimensiuni minime logo, ton de voce, aplicații
- [ ] **Numele repo-ului nou** pentru temă
- [x] **Decizie** `--cream-2` și `--caramel` — vezi §5
- [x] `renee_v2` — **se ignoră complet**, nu intră în producție (9 sept. 2026)

---

## 7. Conținut draft în `renee_v1` — de înlocuit obligatoriu

O parte din conținut e acum **real**. Verifică în ce categorie intră ce atingi.

### ✅ Real, preluat din API-ul eat-me.online
Numele, descrierile, prețurile, gramajele, imaginile și valorile nutriționale ale celor 73 de preparate. Adresele celor două locații.

### ⚠️ Derivat automat — plauzibil, dar neconfirmat
- **Alergenii** — **deduși din lista de ingrediente** din descriere (`mascarpone` → lactate, `pâine` → gluten, `somon` → pește). Acoperă 72 din 73 de preparate. Câmpul `allergens` din API e gol pentru toate. Sunt afișați cu avertisment pe pagina de preparat, dar **nu sunt o declarație oficială** — de confirmat cu bucătăria. Informație reglementată (UE, 14 alergeni declarabili).
- **Badge-urile** `nou` / `vegan` / `recomandat` — atribuite determinist. `vegan` doar unde numele preparatului o spune explicit.

### ❌ Încă inventat, de înlocuit obligatoriu
- **Telefon `+373 60 000 000`** — placeholder, în footer-ul tuturor celor 13 pagini. Restul site-ului folosește `+373 78 784 040`.
- **`hello@renee.md` / `centru@renee.md`** — de confirmat că domeniul și căsuțele există.
- **Imagini de atmosferă, galerie, blog, Instagram** — hotlink-uri Unsplash. **Video hero** — hotlink Pexels. (Imaginile de preparate sunt reale, de pe CDN-ul Syrve.)
- **Testimoniale** — fictive. **Blog și „Povestea"** — draft AI.
- **Facebook și TikTok** — conturi presupuse; doar Instagram e confirmat.
- **Program și telefon pe locații** — aceleași valori peste tot, marcate DRAFT. Probabil diferă între Oasis și Urban.
- **Coordonata Renée Urban** — `47.0287072, 28.8256740` e nr. 115 pe bd. Ștefan cel Mare (OSM îl dă ca Muzeul Național de Artă). Corpul **115/1** nu e localizabil în OSM.
- **Textul juridic** din `termeni.html` și `confidentialitate.html` — schelet cu capitole, fără conținut redactat.

⚠️ **Denumirea primei locații e inconsecventă**, în trei variante: „Renée Oasis" (despre, index), „Renée Oasis Mall" (tabul din index), „Renée — Oasis Mall, Chișinău" (contact, checkout, comanda-confirmată). De unificat.

### Lipsesc complet
Politică de retur · Politică cookies. (Termeni și confidențialitate există ca schelet, fără text.)

---

## 8. Notă tehnică — escaping

`js/shop.js` (14 apeluri) și `js/checkout.js` (2) folosesc `innerHTML` fără escaping. Inofensiv în varianta statică, unde datele vin din `data/products.js` controlat de developer. **La migrarea pe WP, unde textele vin din CMS, devine risc XSS** — se folosesc `esc_html()` / `esc_attr()` / `wp_kses_post()`. Detaliat în `MIGRARE-WP.md` §8.

---

## 9. Stil de lucru

- Răspunsuri în română.
- Verifică în cod înainte să afirmi ceva despre proiect — nu răspunde din memorie.
- Când ceva e presupunere, spune că e presupunere.
- Fără raportări optimiste: dacă un pas a fost sărit sau nu a putut fi testat, se spune direct.
