# Instrucțiuni de lucru — pascarel.github.io

> Fișier citit automat de Claude Code la începutul fiecărei sesiuni.
> Actualizat: 17 septembrie 2026.

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
projects/renee_v1/     — Renée: prezentare + magazin demo (14 pagini)  ← proiect activ
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
| CTA pe pagina Evenimente | Secțiunea „Hai să vorbim" **nu conține buton de rezervare masă** — scos de Sergiu pe 14 sept. 2026. Pagina are alt obiectiv: clientul să organizeze un eveniment în local, nu să rezerve o masă. Rezervarea de masă e un alt flux și îl diluează. Orice CTA de aici trebuie să ducă spre organizarea evenimentului (contact, cerere de ofertă), nu spre modalul de rezervare. |
| Multilingv | Site-ul va fi **RO / RU / EN**. În prototipul static există **doar switcher-ul vizual** din header — nu se construiesc subdirectoare sau pagini traduse. Structura și traducerile se fac în WordPress (Polylang/WPML). Decis 14 sept. 2026. |
| Scalare responsive | Spaţierile folosesc **`vw`, nu `vh`**, iar **minimul din `clamp` e valoarea de mobil**, nu una de siguranţă. Titlurile îşi pun propriul `line-height` — `body` are 1.6, prea larg pentru un titlu. Convenţiile complete şi metoda de recalibrare: `PARTIALS.md` §5.2. Nu readuce minimele mari: pe desktop nu se vede nimic, pe telefon totul redevine supradimensionat. |
| Header | Trei zone — logo, nav, `.header-actions`. Rezervări, coş şi switcher stau în acţiuni şi **rămân vizibile sub 900px**, când nav-ul devine meniu-overlay. Pragul e 900, nu 640: la 768 nav-ul nu încape lângă logo. |
| Coş gol | Stare condusă de clasa **`is-empty`** pe `.cart-layout`, pusă şi scoasă de `renderCart` din `js/shop.js`. Ascunde coloana de sumar şi trece grila pe o coloană. Nu ascunde `.cart-side` din altă parte. Redesenat 14 sept. 2026, la cererea lui Sergiu. |
| Metode de plată | Bloc `.footer-plata` în toate cele 13 pagini, sub reţelele sociale. **Logo-uri oficiale** din `img/`: `visa.svg`, `mastercard.svg`, `moldindconbank_logo.svg`. Sunt `<img>`, **nu** SVG inline cu `currentColor` — spre deosebire de restul pictogramelor. Motivul e în §5, „Logo-uri terţe". |
| Paletă | **Schimbată complet 16 sept. 2026**, la cererea clientului: se foloseşte doar paleta designerului lor (`Downloads/ind/assets/css/variables.css`). Tiramisu / Vin / Verde nu se reintroduc. Fonturile NU vin de acolo — rămân Cormorant Garamond + Open Sans. Detalii în §5. |
| Pattern decorativ | **Scos de pe tot site-ul** 16 sept. 2026 (cerere client): „acel patern nu-l mai folosim pe site". Şterse benzile verticale, separatoarele full-width, CSS-ul şi observer-ul. Fişierele rămân în `img/` dar **nu se mai referă**. |
| Secţiunea Locaţii | Fără taburi. Câte un rând pe locaţie, fiecare cu poza localului, datele şi harta proprie; al doilea rând oglindit. ⚠️ Oglindirea se face cu **`grid-column` + `grid-row`**, nu cu `order`: cu `order` poza ajunge în celălalt track şi iese de altă dimensiune, iar fără `grid-row:1` auto-placement-ul rupe rândul în două. Ambele capcane sunt documentate în jurnal, 16→17 sept. |
| „Povestea numelui" (home) | `.poveste-numele`, pe **fundal închis**: proza la stânga, cele două deschideri reale la dreapta. Fundalul închis e intenţionat — rupe ritmul între Despre şi Momente, ambele pe crem cu fotografii. ⚠️ Accentul acolo e `--brand`; `--brand-deep` dă 2.32 şi dispare. |
| „Valorile Renée" (Despre) | `.valori-grid` / `.valoare`: linie de sus plus titlu, **fără numerotare**. Cele trei valori nu sunt paşi într-o secvenţă, deci „01/02/03" ar fi decor deghizat în structură. |
| Secţiunea „Momentele zilei" | `.momente`: fiecare fereastră de timp arată un **preparat real din catalog** (croissant / pancakes / pavlova), cu imaginea din API şi link către pagina lui. Secţiunea trimite în meniu, nu doar decorează. Ora stă într-o pastilă crem peste colţul pozei — contrast garantat faţă de crem, nu faţă de fotografie. |
| **Catering** | Al doilea catalog al localului, **separat de Meniu**: candy bar, finger food, plăcinte, băuturi, pentru evenimente. Pagină proprie **`catering.html`**, date în `data/catering.js`, randare în `js/catering.js`. **Fără coş**; pagina de detaliu e **aceeaşi `produs.html`** (rutează după id: Meniu, apoi Catering), cu un singur CTA — „Cere o ofertă". Băuturile rămân listă, fără pagină. **Pe homepage nu are secţiune sau grilă de produse** — doar butonul secundar „Meniu de catering" din secţiunea Evenimente private (adăugat 17 sept. 2026). Intrări: sub-item „Catering" în dropdown-ul Evenimente (singurul dropdown din nav), footer, cardul „Meniu de catering" şi teaser-ul de pe Evenimente. **În WordPress: produse Woo obişnuite, într-o categorie-părinte `Catering` cu subcategorii** — NU CPT separat (schimbat în aceeaşi zi, 17 sept. 2026, când s-a decis că au pagină de produs identică). Ramura Catering: nevandabilă (`is_purchasable` false) până decide clientul, exclusă din Meniu, cu layout propriu în single-product. Detalii §4.1. |

### 4.1 Catering — al doilea catalog

Sursa: PDF-ul „Renée_Catering" de la client (17 sept. 2026, 6 pagini). **Nu există în eat-me**;
se introduce manual. 70 de poziţii:

| Categorie | Poziţii | Unitate |
|---|---|---|
| Candy Bar | 23 (incl. 3 ecler mini, 7 macarons) | buc |
| Finger Food | 24 (una la kg: somon copt cu legume) | buc |
| Plăcintă Cosiţă | 9 | kg |
| Băuturi | 14 (7 răcoritoare, 7 cafea & ceai) | buc — **preţuri INVENTATE**, PDF-ul nu le are |

Câmpurile sunt cele din `data/products.js` plus `unitate` (`buc` / `kg`) şi, la băuturi, `grup`.
Imaginile sunt extrase din PDF în `img/catering/` (56 × ~367px, webp). Pentru WP, de cerut originalele.

**Ce e draft acolo:** alergenii (deduşi din nume), **gramajele (estimate — PDF-ul nu le are; la kg = 1000, la băuturi volum în ml)**, preţurile băuturilor, termenul de comandă
„minim 48 de ore", „fără cantitate minimă", „livrare în Chişinău", „TVA inclus" — toate marcate
`DRAFT` în `catering.html`. Descrierile sunt **goale**: PDF-ul nu are, nu le inventăm.
Două plăcinte (varză / carne de pui) au pozele atribuite prin comparare de pixeli, de verificat vizual.

**Model WP (revizuit 17 sept. 2026, după decizia că au pagină de produs):** produse Woo, nu CPT.
- `product_cat` **Catering** ca părinte, cu copiii Candy Bar · Finger Food · Plăcintă Cosiţă · Băuturi.
  Categoriile de bucătărie rămân la acelaşi nivel cu Catering.
- **Meniul exclude ramura Catering** (`tax_query` cu `operator NOT IN` + `include_children`), pagina
  `/catering/` arată doar ramura ei. Altfel macarons-urile apar între deserturile din local.
- **Redirect-urile de arhivă** se ramifică: categoriile de bucătărie → `/meniu/`, ramura Catering → `/catering/`.
- **Nevandabile:** `woocommerce_is_purchasable` → false pe ramură. Fără „Adaugă în coş", fără stepper,
  fără sticky bar, fără bundle. Single-product pe ramură: breadcrumb Evenimente › Catering › subcategorie,
  preţ + unitate + gramaj, acordeon alergeni, acordeon „Cum se comandă", CTA „Cere o ofertă" → contact.
  Prototipul face exact asta în `produs.html` + `Catering.renderDetail()`.
- Meta: `unitate` (buc/kg — atribut sau meta), gramaj → `weight` Woo, `masura` (g/ml), `grup` la băuturi.
- Băuturile: produse în subcategoria lor, dar **fără pagină** (listă pe `/catering/`; single redirecţionează la listă).
- Teaser-ul de pe Evenimente = 4 ID-uri alese manual (ACF relationship).

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

### Reguli mici pentru WP, strânse pe parcurs
- **Articole conexe** (`articol.html`, `#related`): **maxim 4**, din aceeaşi categorie. Pe mobil sunt carusel orizontal.
- **Blog** (`blog.html`): listă verticală; **paginare şi pe desktop** când vor fi mai multe articole. Fără carusel.
- **Catering**: vezi §4.1.

### Ghid tehnic existent
`projects/renee_v1/MIGRARE-WP.md` — 254 linii, tabel de mapare pagină → WP/Woo, model de date produs, shipping zones. **De consultat înainte de a scrie cod.** Rămâne referință, dar precede brandbook-ul, deci partea de design e depășită.

### Mediu de test
Nu există PHP/MySQL/WordPress în containerele cloud. Testarea reală (checkout, coș, plăți) se face doar local, pe MAMP sau pe hosting. Codul livrat din cloud e **netestat împotriva unui WooCommerce viu** — asta se spune explicit la fiecare livrare.

---

## 5. Brandbook Renée

### Paletă — sursă unică de adevăr

⚠️ **Schimbată complet pe 16 sept. 2026, la cererea clientului.** Sursa nu mai e
brandbook-ul, ci `assets/css/variables.css` din proiectul „ind" al designerului lor.
Clientul a aprobat explicit ACEASTĂ paletă şi se foloseşte **doar ea**.
Paleta veche (Tiramisu / Vin / Verde) **nu se reintroduce**.

**Marcă:**
| Token | Hex | Rol |
|---|---|---|
| `--brand` | `#AF7B5C` | accent principal — identic cu vechiul Crust Brown |
| `--brand-dark` | `#8F5E3E` | text mic pe deschis, butoane pline cu text alb |
| `--brand-deep` | `#6B4330` | accentul care trebuie citit (cursivele din titluri) |

**Fundaluri:**
| Token | Hex | Rol |
|---|---|---|
| `--white` | `#FFFFFF` | |
| `--cream` | `#FAF7F4` | fundal principal |
| `--cream-2` | `#F2EDE8` | fundal alternativ de secţiune |
| `--border` | `#E8DDD5` | linii şi borduri pe deschis |
| `--black` | `#0D0A09` | secţiuni închise |

**Text:**
| Token | Hex | Rol |
|---|---|---|
| `--ink` | `#1A1410` | titluri |
| `--text-body` | `#3D302A` | corp de text |
| `--ink-soft` | `#7A6B62` | text secundar |
| `--text-light` | `#A89C96` | DECOR pe deschis; ca text doar pe închis |

**Ce s-a pierdut şi cu ce a fost înlocuit:**
- **Vin `#561320`** → `--brand-deep`. Paleta lor n-are roşu închis.
- **Verde `#6D816C`** → `--brand-deep`, prin tokenul `--ok`. Paleta lor n-are verde, iar
  verdele era culoarea de confirmare (adăugat în coş, mesaj trimis, livrare completă).
  Decis 16 sept. 2026: mergem 100% pe paleta lor, confirmarea rămâne pe text şi bifă.

Numele vechi (`--tiramisu`, `--vin`, `--terra`, `--sage`…) **au rămas ca alias-uri**
către valorile noi, ca să nu se rupă regulile existente. Nu te baza pe ele la cod nou.

Rolurile semantice se schimbă **doar din `:root`**, nu prin căutare-înlocuire:
`--accent-text` (brand-deep) · `--accent-decor` (brand) · `--accent-dark` (brand, pe închis) ·
`--accent-fill` (brand-dark, fundal plin sub text alb) · `--ok` (confirmări).

### Reguli de contrast (WCAG, calculate)

| Combinaţie | Raport | Verdict |
|---|---|---|
| `--ink` pe `--cream` | 17.09 | ✅ text principal |
| `--text-body` pe `--cream` | 11.89 | ✅ corp de text |
| `--brand-deep` pe `--cream` | 7.96 | ✅ accent citibil |
| `--brand-dark` pe `--cream` | 5.13 | ✅ text mic |
| `--ink-soft` pe `--cream` | 4.79 | ✅ text secundar |
| **`--ink-soft` pe `--cream-2`** | **4.40** | ❌ **sub prag** — vezi regula de mai jos |
| **`--brand` pe `--cream`** | **3.39** | ⚠️ doar text ≥24px sau decor |
| `--brand` pe `--black` | 5.46 | ✅ accent pe închis |
| `--text-light` pe `--cream` | 2.50 | ❌ niciodată text pe deschis |

**Regula `cream-2`:** pe suprafeţele `--cream-2` (secţiuni alternante, carduri de
produs, cutia de coş gol, sumarele de comandă) `--ink-soft` pică sub prag pentru text mic.
Acolo se coboară o treaptă, la `--text-body` — **redefinind variabila**, nu proprietatea
`color`, ca să se aplice singur la tot ce e în interior. Lista de suprafeţe e în
`css/main.css`, blocul „text secundar pe fundal cream-2".

⚠️ **Nu inventa nuanţe intermediare** ca să repari un contrast. Clientul a cerut doar
paleta lui; orice hex care nu e în tabelele de mai sus e o abatere de la decizie.

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

**Pictogramele** — 6, în stil de linie fluidă (monogram RR, tacâmuri, pahar, toaletă, marca WW, arcadă). **Încă nelivrate.** Când ajung, primul loc unde își au rostul e deasupra titlurilor din „Valorile Renée” (Despre), de unde au fost scoase numeralele.

**Pattern-ul** — ⛔ **nu se mai folosește.** Scos de pe tot site-ul pe 16 sept. 2026, la cererea explicită a clientului: „acel patern nu-l mai folosim pe site”. Fișierele (`patern.svg`, `patern-brown.svg`, `patern-motiv*.svg`) au rămas în `img/` ca moștenire, dar nu sunt referite de nimic. Nu le readuce.

### Logo-uri terțe (plată) — regulă separată

`img/visa.svg`, `img/mastercard.svg`, `img/moldindconbank_logo.svg`. **Nu sunt ale noastre.**

- **Nu se recolorează, nu se redesenează, nu se convertesc la `currentColor`.** Fiecare brand are ghid propriu care interzice variantele modificate. De aceea sunt `<img>`, nu SVG inline — excepție conștientă de la regula generală a proiectului.
- Fundalul crem al chip-ului (`rgba(224,215,209,.92)`) există fiindcă marcajele sunt în culorile lor (bleumarin `#1A1F71`, roșu/portocaliu, navy `#1D3D70`) și n-ar avea contrast pe footer-ul închis.
- **Visa și Mastercard** vin din setul standard „card": marcajul e deja centrat cu padding propriu într-o casetă `780×500` (măsurat: Visa 40% din înălțime, Mastercard 72%). Chip-ul lor **nu adaugă padding** — imaginea umple cardul. Ambele fișiere au primit `viewBox="0 0 780 500"`; exportul original avea `0 -140 780 780`, ceea ce făcea marcajul de ~3× prea mic. Din `mastercard.svg` s-a scos rama de card (dreptunghi alb cu contur negru), ca cele două să fie uniforme.
- **Moldindconbank** e wordmark simplu (`1000×171`) — acolo se păstrează padding și se scalează după înălțimea literei.

---

## 6. Ce lipsește — de obținut înainte de implementare

- [x] ~~Licență web The Seasons~~ — **abandonat**, înlocuit cu Cormorant Garamond (vezi §5)
- [x] **Logo SVG** — prezent în `img/` (`logo.svg`, `logo_simple.svg`, `logo_symbol.svg`). Inline în toate cele 13 pagini, colorate prin `currentColor`.
- [ ] **Pictograme SVG** (brandbook §5.1) — încă neprimite
- [x] **Poze pentru cele două locaţii** — `img/img_oassis.webp`, `img/img_urban.webp`, primite 16 sept. 2026 din folderul clientului (faţadele reale).
- [x] **Logo-uri metode de plată** — primite 14 sept. 2026, oficiale, în `img/`. Vezi §5, „Logo-uri terțe".
- [x] **Structura multilingvă RO/RU/EN** — decisă 14 sept. 2026: se face **în WordPress**, nu în prototipul static. Aici există doar switcher-ul vizual din header. Vezi §4.
- [x] ~~**Pattern SVG**~~ — **abandonat 16 sept. 2026** la cererea clientului. Fișierele rămân în `img/`, nefolosite.
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
- **Catering:** gramajele tuturor celor 70 de poziţii, preţurile băuturilor, termenul de comandă, condiţiile de livrare/cantitate din banda „Cum se comandă". Vezi §4.1.
- **Telefon `+373 60 000 000`** — placeholder, în footer-ul tuturor celor 13 pagini. Restul site-ului folosește `+373 78 784 040`.
- **`hello@renee.md` / `centru@renee.md`** — de confirmat că domeniul și căsuțele există.
- **Imagini de atmosferă, galerie, blog, Instagram** — hotlink-uri Unsplash. (Excepţie: pozele celor două locaţii sunt reale, din folderul clientului.) **Video hero** — hotlink Pexels. (Imaginile de preparate sunt reale, de pe CDN-ul Syrve.)
- **Testimoniale** — fictive. **Blog și „Povestea"** — draft AI.
- **Facebook și TikTok** — conturi presupuse; doar Instagram e confirmat. ⚠️ PDF-ul de catering are în subsol `fb.com/reneebrunch`, site-ul foloseşte `facebook.com/renee.brunch` — unul din ele e greşit.
- **Program și telefon pe locații** — aceleași valori peste tot, marcate DRAFT. Probabil diferă între Oasis și Urban.
- **Coordonata Renée Urban** — `47.0287072, 28.8256740` e nr. 115 pe bd. Ștefan cel Mare (OSM îl dă ca Muzeul Național de Artă). Corpul **115/1** nu e localizabil în OSM.
- **Textul juridic** din `termeni.html` și `confidentialitate.html` — schelet cu capitole, fără conținut redactat.

⚠️ **Denumirea primei locații e inconsecventă**, în trei variante: „Renée Oasis" (despre, index), „Renée Oasis Mall" (tabul din index), „Renée — Oasis Mall, Chișinău" (contact, checkout, comanda-confirmată). De unificat.

### Lipsesc complet
Politică de retur · Politică cookies. (Termeni și confidențialitate există ca schelet, fără text.)

---

## 8. Notă tehnică — escaping

`js/shop.js` (14 apeluri) și `js/checkout.js` (2) folosesc `innerHTML` fără escaping. (`js/catering.js` trece textele prin `esc()` — modelul de urmat.) Inofensiv în varianta statică, unde datele vin din `data/products.js` controlat de developer. **La migrarea pe WP, unde textele vin din CMS, devine risc XSS** — se folosesc `esc_html()` / `esc_attr()` / `wp_kses_post()`. Detaliat în `MIGRARE-WP.md` §8.

---

## 9. Stil de lucru

- Răspunsuri în română.
- Verifică în cod înainte să afirmi ceva despre proiect — nu răspunde din memorie.
- Când ceva e presupunere, spune că e presupunere.
- Fără raportări optimiste: dacă un pas a fost sărit sau nu a putut fi testat, se spune direct.
