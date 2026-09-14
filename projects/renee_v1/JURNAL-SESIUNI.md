# Jurnal de sesiuni — Renée

Canalul de comunicare între cele două sesiuni Claude care lucrează la proiect.
Ele **nu se văd una pe alta** și nu au memorie comună. Acest fișier e singura punte.

---

## Protocol

**La începutul fiecărei sesiuni:**
1. `pwd && uname -s` → stabilește dacă ești **OFICIU** (`/home/user/…`, Linux) sau **ACASĂ** (`/Users/…`, Darwin).
2. `git fetch origin && git log --oneline -10 origin/main` → vezi ce s-a lucrat între timp.
3. Citește ultima intrare de mai jos.

**La finalul fiecărei sesiuni:**
Adaugă o intrare nouă **sus**, imediat sub „Intrări". Format scurt:

```
## AAAA-LL-ZZ · OFICIU sau ACASĂ

**Făcut:** ce s-a livrat concret, cu fișierele atinse
**Nu am putut:** ce a rămas blocat și de ce
**Pentru cealaltă sesiune:** ce trebuie preluat, în ordinea priorității
**Întrebări deschise pentru Sergiu:** deciziile care așteaptă răspuns
```

**Reguli:**
- Nu șterge intrări vechi. Jurnalul e istoric, nu tablă de scris.
- Nu presupune ce a făcut cealaltă sesiune — confirmă în `git log` înainte.
- Dacă ai lăsat ceva la jumătate, spune-o explicit. O predare incompletă anunțată e mult mai bună decât una tăcută.
- Nu marca drept „gata" ceva ce nu ai putut testa. Scrie ce ai verificat și ce nu.

---

## Intrări

## 2026-09-14 · ACASĂ · blog, articol, contact, separator, switcher, **adaptare mobilă + header nou**, coş gol, metode de plată

### 🎯 CTA-ul de pe Evenimente — decizie de reținut

Sergiu a scos butonul „Rezervă o masă" din secțiunea „Hai să vorbim". **Motivul contează mai mult decât schimbarea:** pagina de evenimente are alt obiectiv — clientul să organizeze un eveniment în local, nu să rezerve o masă. Sunt două fluxuri diferite, iar cel de rezervare îl diluează pe primul.

Orice CTA adăugat acolo pe viitor trebuie să ducă spre organizarea evenimentului (contact, cerere de ofertă), **nu** spre modalul de rezervare. Notat și în `CLAUDE.md` §4.

### 📰 Blog — carduri ca pe home

Secțiunea de listare a primit clasa `blog-home`, aceeași ca pe pagina principală. Așa moștenește tot pachetul dintr-un singur loc: fundal `--cream-2`, carduri transparente care se luminează spre Tiramisu la hover, imagini 4/3, 4 coloane. Zero reguli duplicate. Adăugată și secțiunea Instagram.

### 📄 Articol — galerie unificată + partajare

Articolul avea **propriul lightbox**, primitiv: fără navigare, fără contor, fără efect de hover, cu markup și script separate. L-am înlocuit cu cel comun din `js/main.js` — aceleași `.g-item` cu voal și lupă ca pe celelalte galerii.

**Bug găsit pe drum:** `.lightbox` era definit în **ambele** foi de stil. `shop.css` se încarcă după `main.css`, deci pe `index.html` (care încarcă ambele) regulile vechi le suprascriau pe cele noi — `padding:5vw`, `cursor:zoom-out` și `max-height:90vh` pe imagine în loc de 78vh. Blocul vechi e eliminat din `shop.css`.

Partajare nouă la finalul articolului: Facebook, WhatsApp, Telegram și copiere link. Linkurile se construiesc din `location.href` real, nu hardcodate. Copierea folosește Clipboard API cu fallback pe `execCommand` — API-ul cere context securizat și ar pica pe `file://`.

### 📍 Contact — coloane ca pe Despre

Cele două locații erau în coloane asimetrice cu ambele hărți stivuite la final, ceea ce nu lăsa clar care hartă e a cui. Restructurate: coloane egale (măsurat 513px fiecare), etichetele sunt numele locațiilor, iar **fiecare hartă stă sub coloana ei**, la 28px — verificat că sunt pe același rând.

### 🪡 Separator full-width cu pattern — refolosibil

Bandă orizontală de chevroni pe toată lăţimea. **O singură linie de HTML**, fără SVG inline şi fără id-uri, deci se poate pune de câte ori vrei pe aceeaşi pagină:

```html
<div class="patern-separator" aria-hidden="true"></div>
```

Construit ca `background-image` cu fişier extern, tocmai ca să fie copy/paste. Consecinţa: **culoarea e fixă în fişier**, `background-image` nu moşteneşte `currentColor` — spre deosebire de banda verticală, care e SVG inline.

Sergiu l-a adaptat singur după aceea: a trecut pe `img/patern-brown.svg` (artboard-ul complet) şi 62px. Am aliniat documentaţia la varianta lui.

Folosit acum în trei locuri: `index.html` (între Evenimente private şi Instagram), `contact.html`, `despre.html`.

### 🎞️ Animaţia separatorului — pauză, nu oprire

Glisează spre stânga, 28s pe ciclu (~31px/s), **doar cât e pe ecran**. Două lucruri care par detalii dar nu sunt:

**`animation-play-state`, nu adăugarea/scoaterea animaţiei.** Dacă adaugi clasa cu animaţia la intrarea în viewport, banda sare la început de fiecare dată când derulezi înapoi. Cu pauză, continuă de unde a rămas. Verificat: poziţia a îngheţat la −857.686px la ieşirea din ecran şi era tot acolo după 1,2s.

**`--h` e singurul reglaj.** Lăţimea dalei se calculează din el (`calc(var(--h) * 14.1409)`, proporţia fişierului), iar animaţia se deplasează exact cât o dală. Dacă scrii înălţimea direct în `height`, deplasarea nu mai corespunde dalei şi apare un salt la fiecare ciclu.

La `prefers-reduced-motion` se opreşte singură — regula globală din `main.css`.

### 🌐 Switcher de limbă — DOAR vizual

RO / RU / EN în header, pe toate cele 13 pagini, după coş.

**Decizia lui Sergiu:** nu construim subdirectoare `/ru/`, `/en/` şi nici pagini traduse în prototipul static. Structura şi traducerile se fac în WordPress. Switcher-ul doar comută starea activă, ca să se vadă cum arată. Notat în `CLAUDE.md` §4.

Sunt `<button>`, nu `<a>`, fiindcă nu duc nicăieri. **Consecinţă pe care era să o ratez:** regulile de culoare ale header-ului ţintesc `a`, deci switcher-ul rămânea închis peste video-ul din hero. Am extins cele trei reguli (hero, meniu mobil, subpagini) cu `.lang-opt`.

### 🔀 Homepage — Evenimente şi Instagram inversate

Ordinea e acum Testimoniale → Evenimente private → separator → Instagram → Vizita. Secţiunea Evenimente avea `padding-top:0` fiindcă venea după Instagram; scos, altfel stătea lipită de banda de testimoniale. Spaţiul din jurul separatorului e simetric, 126px sus şi jos — verificat.

### 📱 Adaptarea pentru mobil — trei probleme sistemice, nu breakpoint-uri lipsă

Nu lipseau media query-uri. Erau trei cauze care, odată reparate, au aranjat tot deodată.

**1. Spaţierile foloseau `vh`.** Pe un telefon de 812px, `20vh` = 162px de padding. Proporţional cu ecranul, dar nu cu lăţimea — care e ce contează pe mobil. **26 de paddinguri** convertite la `vw`, în CSS şi în stilurile inline din HTML.

**2. Minimele din `clamp` erau calibrate pentru desktop.** La 375px, `6vw` = 22px, deci fiecare clamp cădea pe minim — iar minimul era gândit pentru ecran mare. `.h2` rămânea la **44px** pe telefon. Metoda de corecţie: alegi minimul pentru 375px, apoi creşti coeficientul `vw` până valoarea de la 1440px revine unde era.

| | 375px | 1440px |
|---|---|---|
| Padding secţiune | 114 → **64** | 126 → 130 |
| `.h2` | 44 → **30** | **84 → 84** |
| `.manifest` | 28 → **21** | **44 → 44** |
| Pagina de preparat | 162 → **104** | **180 → 180** |

**3. Titlurile moşteneau `line-height:1.6`** de la body — un titlu de card de 24px primea 38px între rânduri. Adăugat `h1,h2,h3,h4{line-height:1.22}` global.

**Bug-uri găsite pe parcurs:** paginarea din meniu depăşea ecranul cu 33px (7 butoane fără `flex-wrap`) · coloanele de locaţii rămâneau două la 375px, fiindcă `.vizita-grid.egale` are specificitate mai mare decât regula responsive şi o bătea chiar în interiorul media query-ului · zone de atingere sub 44px, cele mai rele fiind bulinele de testimoniale la **8×8px**.

Convenţiile sunt scrise în `PARTIALS.md` §5.2. Zero overflow orizontal pe toate cele 13 pagini, măsurat încărcându-le efectiv la 375px.

### 🍔 Header restructurat — acţiuni separate de navigare

`Rezervări`, coşul şi switcher-ul au ieşit din `<nav>` într-un `.header-actions` care **rămâne vizibil** când nav-ul se ascunde. Altfel dispăreau odată cu meniul.

**Pragul e 900px**, nu 640 — la 768 (iPad portret) nav-ul nu încape lângă logo.

Switcher-ul a devenit **dropdown** (buton cu limba curentă + listă), hamburgerul e o iconiţă din trei linii care se transformă în X, coşul e iconiţă cu badge. Butonul de rezervare devine iconiţă-calendar sub 560px — nu se ascunde, e CTA principal. La 375px bara de acţiuni e `42 · 33 · 44 · 44`; încape şi la 320px.

⚠️ `setMenu()` scria `textContent` pe buton — ar fi şters span-ul iconiţei. Acum comută o clasă.

### 🪤 Trei capcane CSS, toate invizibile în dezvoltare

**`transform` e o singură proprietate.** `.scroll-hint` se centra cu `translateX(-50%)`, dar animaţia `fadeUp` se termină cu `transform:none` şi, având `forwards`, anula centrarea. Elementul sărea cu jumătate din lăţime **după** ce se termina animaţia — de aceea măsurătoarea mea anterioară, făcută la 0,5s, îl arăta centrat. Centrarea se face acum prin `margin-inline:auto`.

**`forwards` + `opacity:0` în bază = element invizibil dacă animaţia nu rulează.** Itemii din meniul mobil intră scalonat; prima variantă i-ar fi lăsat invizibili permanent la `prefers-reduced-motion`. Corect e `backwards` **fără** `opacity:0` în starea de bază. Verificat forţând `animation:none`: opacitate 1 peste tot.

**O regulă globală poate bate un override mobil mai puţin specific.** `.testi-dots button.active` (0,2,1) colora butonul întreg — care pe mobil are 44px pentru atingere — rezultând un cerc maro de 59px. Bulina reală de 8px era dedesubt, invizibilă.

**Focus:** inelul albastru apărea şi la clic cu mouse-ul. Înlocuit cu `:focus{outline:none}` + `:focus-visible{outline:2px solid var(--accent-decor)}` — apare doar la tastatură. **Nu l-am şters**, ar fi făcut site-ul imposibil de navigat fără mouse.

**Nu am putut:**
- Verificare vizuală — zero, ca în sesiunile precedente.
- **Animaţiile nu avansează** când panoul nu pictează — `getComputedStyle` le arată îngheţate la starea de start. De aceea animaţia scalonată din meniu nu a putut fi confirmată direct; am verificat în schimb **degradarea**, care e partea care contează: cu `animation:none` forţat, toţi itemii au opacitate 1.
- `IntersectionObserver` nu se declanșează când panoul de browser nu pictează. Animația separatorului am putut-o confirma complet doar pe `index.html`; pe `contact.html` și `despre.html` nici măcar un observer creat direct în consolă nu răspundea, iar `.reveal` mergea 6 din 30. Codul e identic pe toate trei.

### 🔬 Explicația pentru toate „nu pot confirma" din ultimele sesiuni

**`getComputedStyle` din acest sandbox nu raportează proprietăți aflate sub `transition`.** Întoarce valoarea de dinainte, oricât aștepți — inclusiv mult peste durata tranziției.

Demonstrat pe switcher: culoarea citită rămânea crem pe header solid, deși regula spunea altceva. Cu `element.style.transition='none'` pus temporar, aceleași citiri au ieșit **exact corecte**.

Înseamnă că verificările pe care le-am raportat ca neconfirmabile — hover-ul de la Servicii, bordura verde de pe „Link copiat", fundalul cardurilor — erau foarte probabil corecte tot timpul, doar nemăsurabile.

**Metoda, dacă dai peste asta:** scoate tranziția înainte de măsurătoare, citește, pune-o la loc.

### 🛒 Coşul gol — redesign, plus un buton care era literalmente invizibil

Cerinţa era estetică („nu-mi place cum arată"), dar sub ea erau două defecte reale.

**Butonul invizibil.** Regula `.cart-empty a{color:var(--accent-text)}` prindea şi `.btn-primary`-ul din interior, fiindcă selectorul descendent (0,1,1) bate clasa simplă (0,1,0). Rezultat: text Vin pe fundal Black Pepper — **contrast 1,15, practic nevăzut**. Regula a fost ştearsă.

**Coloana de sumar rămânea o cutie gri goală** când coşul n-avea nimic în el. Rezolvat cu o clasă de stare pe container, nu cu `display:none` pe copil:

```css
.cart-layout.is-empty{grid-template-columns:1fr}
.cart-layout.is-empty .cart-side{display:none}
```

`renderCart` adaugă `is-empty` pe ramura goală şi o scoate pe cea plină — deci tranziţia gol → plin → gol se face singură, fără cod de curăţenie.

Designul nou: cutie centrată pe `--cream-2`, max-width 560px, cu `logo_symbol.svg` inline la 52–72px în Crust Brown, titlu serif italic şi două CTA-uri (plin „Vezi meniul" + contur „Rezervă o masă", cu `data-rez`).

**Lecţie de reţinut:** orice `.parinte a{color:...}` dintr-o zonă unde pot ajunge butoane e o bombă cu ceas. Dacă vrei să stilezi doar link-urile de text, scrie `.parinte p a`, nu `.parinte a`.

### 💳 Metode de plată în footer — de la marcaje desenate la logo-uri oficiale

Le-am făcut întâi ca placeholder-e în CSS (text „VISA", două cercuri pentru Mastercard). Sergiu a pus apoi fişierele reale în `img/`. Toate cele trei sunt acum oficiale şi regulile care desenau marcaje (`.mc-cercuri` etc.) au dispărut.

**Două lucruri de ştiut despre fişierele primite:**

1. **`viewBox` greşit la export.** `visa.svg` şi `mastercard.svg` veneau cu `viewBox="0 -140 780 780"` — o casetă pătrată în jurul unui marcaj de 780×500, cu ~140 unităţi de gol sus şi jos. Randate aşa ca `<img>`, marcajul ieşea de ~3× prea mic. Corectat la `viewBox="0 0 780 500"` în ambele.
2. **`mastercard.svg` avea o ramă de card** — dreptunghi alb 780×500 cu contur negru de 15px — pe care Visa n-o avea. Scoasă, la decizia lui Sergiu, ca cele două să arate uniform.

**Padding-ul e deja în fişier.** Visa şi Mastercard sunt din setul standard „card": marcajul e centrat cu padding propriu în caseta 780×500. Măsurat cu `getBBox()`, Visa ocupă 202/500 din înălţime (40%), Mastercard 359/500 (72%) — nu e un defect, aşa sunt marcajele oficiale. Deci chip-ul lor **nu mai adaugă padding**, imaginea umple cardul, şi ies două carduri identice de 47×30. Moldindconbank e wordmark simplu (1000×171), acolo se păstrează padding şi se scalează după înălţimea literei.

**De ce există chip-ul crem:** marcajele sunt în culorile lor de brand (bleumarin `#1A1F71`, roşu/portocaliu, navy `#1D3D70`) şi n-ar avea contrast pe footer-ul închis. Nu se recolorează — fiecare brand are ghid propriu care interzice variantele modificate. Din acelaşi motiv sunt `<img>`, nu SVG inline cu `currentColor`, spre deosebire de restul pictogramelor din proiect.

**Pentru cealaltă sesiune (OFICIU):**
1. `.lightbox` nu mai există în `shop.css`. Singura definiție e în `main.css`. Nu o readuce.
2. Galeriile sunt acum identice pe patru pagini: index, despre, evenimente, articol. Tiparul e `.g-item` + `data-lightbox`, documentat în `PARTIALS.md`.
3. Clasa `blog-home` e mecanismul prin care lista de articole moștenește stilul de pe home. Nu duplica regulile.
4. **Nu „repara" clamp-urile înapoi la minime mari.** Minimul din `clamp` e valoarea de mobil, nu una de siguranță — vezi `PARTIALS.md` §5.2. Pe desktop nu se vede nicio diferență, dar pe telefon totul redevine supradimensionat.
5. **Spaţierile folosesc `vw`, nu `vh`.** Singurele `vh` rămase legitime sunt înălţimi de viewport reale: hero, lightbox, overlay-ul de meniu, footer-ul lipit jos.
6. Header-ul are acum trei zone — logo, nav, `.header-actions`. Acţiunile rămân vizibile sub 900px, când nav-ul se ascunde. Nu le muta înapoi în `<nav>`.
7. **Nu construi structură multilingvă** în proiectul static — switcher-ul din header e doar vizual, decizie explicită. Vezi `PARTIALS.md` §2.3.
8. Separatorul cu pattern e o singură linie de HTML, `PARTIALS.md` §2.2. Nu-l rescrie ca SVG inline — a fost făcut extern tocmai ca să fie copiabil.
9. **Citește secțiunea despre `getComputedStyle` de mai sus** înainte să tragi concluzia că o regulă CSS nu se aplică.
10. **Logo-urile de plată nu se ating** — nici recolorate, nici redesenate, nici convertite la `currentColor`. Sunt `<img>` din motive de brand guidelines, nu din lene.
11. Starea coşului gol se comandă din clasa `is-empty` pe `.cart-layout`, pusă de `renderCart`. Nu ascunde `.cart-side` din altă parte.

**Întrebări deschise pentru Sergiu:**
- **Denumirea primei locații** — încă trei variante în paralel pe site.
- **Telefonul `+373 60 000 000`** din footer-ul tuturor celor 13 pagini, placeholder inventat.
- Categoria **„Adaosuri"** (18 itemi), exclusă din catalog ca suplimente. De confirmat.
- ~~Structura multilingvă~~ — **rezolvată**: se face în WordPress, nu aici.
- ~~Logo-urile de plată~~ — **rezolvate**: toate trei sunt oficiale, în `img/`.

---


## 2026-09-11 · ACASĂ · catalog real, redenumire Meniu, pagina de preparat, pattern

Sesiune lungă, cu Sergiu prezent tot timpul. Tot ce urmează a fost cerut și confirmat de el pas cu pas.

### 🍳 Catalogul e acum REAL — `data/products.js` rescris din temelii

Cele 23 de produse retail draft (cafea boabe, merch, cadouri, brunch box) **au dispărut**. În loc, **73 de preparate reale**, generate din `data/menu-eatme-snapshot.json`:

| Categorie | Preparate |
|---|---|
| Mic dejun 19 · Deserturi 31 · Fel principal 11 | |
| Salate 4 · Gustări 4 · Supe 2 · Pâine 2 | **73 total** |

Fără băuturi (cafea, ceai, matcha, sucuri, limonade, cocktailuri, vin, alcool) și fără „Adaosuri" — sunt suplimente, nu preparate de sine stătătoare. **Decizia lui Sergiu: doar bucătăria.**

Real din API: nume, descriere, preț (storeId 14189), gramaj, imagine webp, **valori nutriționale** (kcal/proteine/grăsimi/glucide la 100 g).

**Alergenii sunt deduși, nu inventați.** Câmpul `allergens` din API e gol la toate cele 73. Îi derivez prin potrivire pe lista de ingrediente din descriere — `mascarpone` → lactate, `pâine cu cereale` → gluten, `somon` → pește. Acoperă 72 din 73. Sunt afișați cu avertisment explicit că nu sunt declarație oficială. **Nu-i trata ca date confirmate.**

### 🏷️ „Magazin" → „Meniu", inclusiv fișierul

Sergiu a cerut o propunere de redenumire; a ales „Meniu". Motivele care au cântărit: un local are meniu, nu magazin · cuvântul e identic în RO/RU/EN (Меню/Menu), util dat fiind că site-ul devine trilingv · nu promite comerț care la lansare nu există.

`magazin.html` → **`meniu.html`**. **41 de referințe** actualizate în 17 fișiere. Fișierele din `docs/superpowers/` au rămas neatinse — sunt arhivă istorică.

⚠️ Dacă vezi `magazin.html` undeva, e o scăpare. Am prins două ascunse în `<script>` (`js/checkout.js` și butoanele din `comanda-confirmata.html`), pe care auditul pe markup nu le vedea.

### 📄 Pagina de preparat, rescrisă

Scoase, ca duplicate: eyebrow-ul cu categoria (era deja în breadcrumb), chips-urile „În stoc" și „Livrare gratuită", descrierea care apărea de două ori, și descrierea din acordeon.

Adăugate: gramajul lângă preț, acordeon cu valori nutriționale reale, acordeon de alergeni.

**Bug găsit:** `productDetails()` alegea acordeoanele după categoriile **vechi** (`cafea`, `dulciuri`, `brunch`). După regenerarea catalogului nicio potrivire nu mai exista, deci cădea pe ramura `else` — un mic dejun englezesc afișa „Material premium cu imprimeu Renée, ediție limitată". Rescrisă complet; `DRAFT_NUTRITION` eliminat.

Acordeonul **„Livrare & ridicare" e comentat, nu șters** — se reactivează cu checkout-ul. Notat în `CLAUDE.md` §4 ca să nu-l „curețe" nimeni ca și cod mort.

### 🌿 Pattern-ul — două greșeli ale mele, ambele reparate

**Orientarea.** Îl roteam cu 90°. `patern.svg` e însă un câmp de 16 fire **deja verticale**, fiecare cu tulpina pe stânga și frunzele măturând spre dreapta-sus. Rotația le culca. **Nu se rotește.**

**Pasul.** Repetam la înălțimea firului (297.861), dar firul conține doar două grupuri de frunze, la y=67.6 și y=172.0, urmate de ~124 de unități de tulpină goală. Pasul real, măsurat pe centroizi, e **104.38**. Brandbook-ul le vrea lipite.

Cum le-am găsit: am randat SVG-ul pe canvas și l-am **afișat ca text ASCII**. Fără browser vizual, e singura metodă care mi-a arătat efectiv forma. Recomand tehnica.

Banda e acum în trei pagini: `index.html` („Povestea numelui"), `despre.html` („Ce ne ghidează"), `evenimente.html` („Tipuri de evenimente"). Detalii complete în `PARTIALS.md` §2.1.

### 🧩 Modalul de rezervare — partial comun

Era scris direct în `index.html`, dar butonul „Rezervări" exista în header-ul **tuturor** paginilor. Pe celelalte 12 **nu făcea nimic**.

Mutat în **`js/rez-modal.js`**, injectat în `document.body`. Ordinea contează: trebuie să ruleze **înainte** de `js/main.js`. Nu am folosit `fetch()` pe un `.html` fiindcă pică pe `file://` din cauza CORS.

Tot aici: dată și oră comasate într-un singur picker (calendar + sloturi în același popover) și **selector de locație** nou.

### ♿ Contrast — restul auditului pe care mi l-ai lăsat

Găsite și reparate: `.form-ok` avea Black Pepper pe Black Pepper (**1.00**, invizibil) · `.form-full`, Vin pe Black Pepper (1.15) · iconițele din bara USP, Vin pe Black Pepper (1.15) · patru locuri cu **Verde ca text** (2.96), interzis de brandbook · `.card-add.done`, Black Pepper pe Verde (3.81).

Tiparul aplicat: textul devine lizibil, Verde rămâne doar ca bulină, bordură sau fundal. **Verde nu mai apare ca text nicăieri.**

Eliminat și blocul de CSS pentru newsletter — 20 de linii moarte de când secțiunea a fost înlocuită cu blogul.

`img/interior.webp` și `img/preview.webp` au fost adăugate de Sergiu, nu de mine — încă nefolosite în cod.

### Restul, pe scurt

Lightbox de galerie (index, despre, evenimente) cu tastatură și focus trap · hover pe cardurile de blog și de servicii · `icon2.svg` pe `meniu.html` și `evenimente.html` · `logo_symbol.svg` în locul bifei de pe comanda confirmată și pe confirmarea de rezervare · stare activă în meniu, calculată din JS · pagina Meniu pe fundal `--cream-2` · secțiunea Instagram adăugată pe despre și evenimente · footer sincronizat, coloane egale pe despre.

**Nu am putut:**
- **Verificare vizuală — deloc, toată sesiunea.** Screenshot-urile din panoul de browser ies goale. Tot ce raportez e din măsurători DOM, rețea, randare pe canvas și contraste calculate. Sergiu a corectat de câteva ori pe baza a ce vedea el — de aceea ceruse și captura cu pattern-ul.
- `getComputedStyle` refuză să raporteze `background-color` pe `.card` în sandbox-ul de browser, chiar și cu valoare inline `!important`. **Hover-ul de la Servicii nu e confirmat măsurat** — doar că regulile sunt identice cu cele de la blog.
- Nicio operațiune git. Sergiu face commit din GitHub Desktop.

**Pentru cealaltă sesiune (OFICIU):**
1. **`data/products.js` e complet alt fișier.** Nu lucra după structura veche. `getProduct`, `getProductsByCategory`, `getFeatured`, `getBestsellers` există în continuare — le-am șters din greșeală la regenerare și le-am recuperat din git.
2. **`magazin.html` nu mai există.** E `meniu.html`.
3. Auditul de contrast pe care mi-l lăsaseși e **făcut**. Ce rămâne al tău: XSS-ul din `shop.js`/`checkout.js`.
4. `PARTIALS.md` a fost rescris integral și are acum trei secțiuni noi: modalul, banda de pattern, elementul activ din meniu. Citește-l înainte să copiezi ceva.

**Întrebări deschise pentru Sergiu:**
- **Denumirea primei locații** — trei variante în paralel: „Renée Oasis" (despre, index), „Renée Oasis Mall" (tabul din index), „Renée — Oasis Mall, Chișinău" (contact, checkout, comandă). Le unific într-o singură trecere când alegi forma.
- **Telefonul `+373 60 000 000`** din footer-ul tuturor celor 13 pagini — placeholder inventat. Restul site-ului folosește `+373 78 784 040`.
- **Structura multilingvă RO/RU/EN** — încă nediscutată, și e o decizie de arhitectură de luat înainte de WordPress.
- Categoria **„Adaosuri"** (18 itemi) — exclusă de mine ca suplimente. De confirmat.
- Pictogramele SVG din brandbook §5.1 — tot neprimite.

---


## 2026-09-10 · ACASĂ · fonturi self-hostate + footer sincronizat

**Făcut:**

### 🔤 Fontul de titluri e decis: Cormorant Garamond

Sergiu a ales varianta 1 din cele trei propuse de OFICIU. **Blocantul de tipografie e închis.**
`--font-display` în `css/main.css` nu mai e `PROVIZORIU`.

### ✅ Ambele fonturi sunt acum locale — Google Fonts a dispărut din proiect

Am descărcat `.woff2` **direct de la Google**, nu am convertit `.ttf`-urile din repo: primești fișierele deja optimizate și, mai important, **subsetate corect pe `unicode-range`** — nu trebuie inventată împărțirea pe alfabete.

- `css/fonts.css` nou — **28 de reguli `@font-face`**, fișiere în `fonts/`
- Cormorant 400/500 + italice 400/500 · Open Sans 300/400/500
- Subseturi: `latin`, `latin-ext`, `cyrillic`, `cyrillic-ext`
- `font-display:swap` peste tot; `preload` pe Cormorant 400 latin și Open Sans 300 latin
- Scos `<link>`-ul Google + cele două `preconnect` din **toate cele 13 pagini**

**Grosimile:** doar 300, 400, 500. Am numărat în CSS — 500 apare de 24 de ori, 400 de 8, 300 de 4, iar **600 de zero ori**. Confirmat ce semnalase OFICIU: fișierul de 600 era descărcat degeaba.

**Italicele:** doar pe Cormorant. Toate cele 14 reguli `font-style:italic` din proiect sunt în contexte `var(--serif)`, deci Open Sans italic ar fi fost fișiere moarte.

**Cele 6 `OpenSans-*.ttf` (784 KB) au fost șterse de Sergiu** — erau redundante după trecerea pe `.woff2`. Directorul a scăzut de la ~1,7 MB la 873 KB.

### 🔍 Verificat în browser (nu presupus)

| Ce | Rezultat |
|---|---|
| Cereri către Google | **zero** — tot din localhost. Rezolvă expunerea GDPR pe care ai semnalat-o. |
| Diacritice RO în Cormorant | `ă â î ș ț Ă Â Î Ș Ț` — toate în font propriu, **fără fallback** |
| `é` | prezent (spre deosebire de The Seasons demo) |
| Chirilice | 7 caractere testate, toate în font propriu, la fel și în Open Sans |
| `unicode-range` | funcționează — fișierele chirilice s-au cerut **abia** când testul a măsurat text rusesc |
| Integritate | toate cele 28 de referințe din `fonts.css` corespund unui fișier real pe disc |

**Metoda de test pentru diacritice:** măsurare pe canvas a lățimii fiecărei glife în fontul propriu față de Georgia. Dacă glifa lipsește, browserul cade pe fallback și lățimile coincid. Nicio coincidență → `ș` și `ț` sunt cele **cu virgulă dedesubt**, nu cu sedilă.

**Greutate:** 427 KB pentru un vizitator român pe `index.html` (12 fișiere); +373 KB doar dacă apare text rusesc. Cormorant are set mare de glife. Dacă devine o problemă în producție, se poate subseta mai agresiv — dar nu am optimizat preventiv.

### 🦶 Footer sincronizat în 12 pagini

Mutarea linkurilor legale în `footer-bottom` fusese aplicată **doar în `index.html`**. Restul de 12 pagini le aveau încă în coloana de navigare. Le-am adus la același tipar.

Verificat prin hash pe blocul de navigare și pe `footer-bottom` — toate cele 13 pagini ies identice (`nav:c5522e06`, `bot:9985e6f9`). Layout măsurat la 1440px: cele trei elemente se distribuie corect prin `space-between`.

**Nu am putut:**
- **Verificare vizuală — deloc.** Panoul de browser returnează screenshot-uri goale („the page is not rendered while it is not displayed"). Tot ce am confirmat e prin măsurători din DOM și rețea: geometrie reală, cereri reale, lățimi de glife reale. **Nimeni nu a văzut încă randate** noul font, footer-ul sincronizat sau timeline-ul tău cu 4 puncte.
- Nu am făcut operațiuni git. Toate modificările sunt necommit-uite, le duce Sergiu din GitHub Desktop.

**Pentru cealaltă sesiune (OFICIU):**
1. **`--cream-2` și `--caramel` NU mai sunt întrebări deschise.** Le-ai listat ca nedecise în ambele intrări, dar erau rezolvate din 9 sept. și scrise în `CLAUDE.md` §5: `--cream-2` → `#D5CCC6`, `--caramel` → eliminat (pe fundal închis se folosește Crust Brown), `--ink-soft` → `#5C5856`. Citește §5 înainte de a le repune pe listă.
2. Auditul de contrast pe `main.css` rămâne al tău și e încă nefăcut. Reperele sunt în `CLAUDE.md` §5. Atenție: rolurile semantice (`--accent-text`, `--accent-decor`, `--accent-dark`, `--accent-fill`) au fost introduse tocmai ca să nu se mai amestece decorul cu textul — verifică-le, nu culorile brute.
3. XSS-ul din `shop.js`/`checkout.js` — încă nerezolvat, tot al tău.
4. Fontul e închis, deci `CLAUDE.md` §5 a fost rescris integral. Nu lucra după varianta veche.

**Întrebări deschise pentru Sergiu:**
- **Structura multilingvă RO/RU/EN** — de decis înainte de WordPress. Fonturile sunt gata pentru toate trei limbile, arhitectura de fișiere nu.
- **„Renée Oasis Mall"** — apare o singură dată, în tabul din `index.html`. Restul site-ului spune „Oasis Mall". De unificat într-un sens sau altul.
- Pictogramele SVG (brandbook §5.1) — încă neprimite.
- Numele repo-ului nou pentru tema WordPress.
- `logo_symbol.svg` și `img/icon2.svg` — amânate explicit de Sergiu, nu sunt folosite nicăieri.

---


## 2026-09-10 · OFICIU · fonturi multilingv (RO/RU/EN) + timeline 2 locații

**Făcut (analiză, fără modificări de cod — Sergiu a aplicat singur):**
- **Auditate fișierele din `fonts/`.** Vezi mai jos, e cel mai important lucru din sesiune.
- Pregătit conținutul pentru timeline-ul „De ce Renée?", extins de la 3 la 4 puncte pentru cele două locații. Aplicat de Sergiu în `56d7296 timeline update`. Structura finală: `Ideea` → `Numele` → `2025` → `2026`. **Zero modificări CSS** — `.timeline` e o listă verticală, al patrulea `.tl-item` se adaugă fără să atingi stilurile.
- Confirmat că `4c2aeb1 removed the font` a șters cele 6 fișiere demo The Seasons.

### 🔴 The Seasons — fișierele primite erau DEMO, inutilizabile

Cele 6 `.otf` din `9925671` aveau numele intern **`FSP DEMO - The Seasons`**:

| Constatare | Detaliu |
|---|---|
| 95 de glife în loc de ~250 | doar ASCII: `A-Z a-z 0-9` + punctuație |
| **0 caractere non-ASCII** | verificat cu fontTools |
| Lipsesc toate diacriticele RO | ă â î ș ț Ă Â Î Ș Ț |
| **Lipsește `é`** | numele brandului „Renée" nu se putea scrie cu el |
| Format | `.otf` desktop, fără licență webfont |

Fișierele au fost șterse. **Ce trebuie cerut clientului:** licență **webfont**, fișiere **`.woff2`**, cu **latin-extended (diacritice RO) și `é`**, grosimile Light/Regular/Bold + italice. Cele trei condiții sunt separate — verifică-le pe toate la recepție, nu doar formatul.

### ✅ Open Sans — verificat, e în regulă

Cele 6 `.ttf` (Light, Regular, Medium + italicele) au **1010 glife fiecare**, toate diacriticele RO prezente. Se pot folosi.

### 🌐 Site-ul va fi în 3 limbi: RO / RU / EN — schimbă complet criteriile pentru font

Informație primită de la Sergiu pe 10 sept. **The Seasons nu suportă chirilice.** Clientul a fost deja informat; folosea și el varianta demo. **Decizia finală de font îi aparține lui Sergiu — o ia de acasă. Cerința: ceva asemănător cu The Seasons.**

**Open Sans e acoperit** — verificat în `fonts/OpenSans-Regular.ttf`: 1010 glife, toate chirilicele prezente. Fontul de corp e rezolvat pentru toate trei limbile.

Problema e doar la titluri (`--font-display`).

#### Capcana: „are chirilice" ≠ „merge pe română"

Multe fonturi cu chirilice **pică la ș/ț cu virgulă dedesubt** (U+0219/U+021B), având doar varianta cu sedilă sau niciuna. Testat cu fontTools direct pe fișiere, nu presupus:

| Font | RO | RU | Notă |
|---|---|---|---|
| **Prata** | ❌ `ș ț Ș Ț` | ✓ | **cel mai apropiat estetic de The Seasons**, dar pică |
| **Oranienbaum** | ❌ `ț Ț` | ✓ | didone rusesc, elegant |
| **Philosopher** | ❌ `ș ț Ș Ț` | ✓ | |
| **Alice** | ❌ `ă ș ț` | ✓ | |
| Bodoni Moda, Marcellus, Italiana | — | ❌ | fără chirilice deloc |

#### Candidați validați ✓ RO + RU + EN

| Font | Glife | Caracter |
|---|---|---|
| **Cormorant Garamond** | 974 | serif delicat, contrast ridicat, aer editorial — **cel mai aproape de The Seasons dintre cele care chiar funcționează**. Chirilicele sunt desenate de aceeași echipă, nu adăugate ulterior. Are italice reale (CSS-ul folosește `font-style:italic` în ~10 locuri). Era fontul original din v1. |
| **Playfair Display** | 659 | didone cu contrast puternic, mai apăsat. E deja fallback-ul din CSS → trecere cu zero muncă. Minus: foarte răspândit. |
| **EB Garamond** | 2091 | clasic, cald, foarte lizibil la corp mic. Mai puțin „display". |
| Literata / Spectral / Lora / Noto Serif Display | 1163 / 878 / 778 / 2840 | alternative solide |

#### Trei căi posibile — decizia lui Sergiu

1. **Înlocuire completă** cu Cormorant Garamond (recomandarea mea). Gratuit, self-hostabil, acoperă tot, fără dependență de furnizorul de brandbook.
2. **Pereche de fonturi** — The Seasons pentru latină + un font chirilic asortat pentru RU, separate prin `unicode-range` în `@font-face`; browserul alege automat. Păstrează brandbook-ul, dar sunt două fonturi de întreținut și o potrivire vizuală de făcut manual. Necesită oricum licența webfont pentru The Seasons.
3. **Prata + completare glife.** Prata e sub licență **OFL, care permite modificarea** — cele 4 glife lipsă (`ș ț Ș Ț`) se pot construi din `s`/`t` + virgula existentă. E cel mai apropiat estetic de The Seasons. Necesită lucru în editor de fonturi și redenumirea familiei, conform OFL. De evaluat dacă merită efortul.

**Nu s-a decis nimic. Nu aplica niciun font fără confirmarea lui Sergiu.**

**Nu am putut:**
- `push` din OFICIU dă **403**. Tot ce scriu aici ajunge la Sergiu doar prin copiere manuală. Nu conta pe mine pentru git.
- Nicio verificare vizuală — nu am browser. Timeline-ul cu 4 puncte **nu a fost văzut randat de nimeni încă**; de confirmat pe mobil, unde titlurile de 3–5 cuvinte pot trece pe două rânduri.

**Pentru cealaltă sesiune (ACASĂ):**
1. **Open Sans e încă încărcat de pe Google Fonts**, deși fișierele sunt în repo. De făcut la runda curată, împreună cu The Seasons: conversie `.ttf` → `.woff2` (~130 KB → ~35 KB fiecare), `@font-face` cu `font-display:swap`, scos `<link>`-ul Google din **13 pagini**, `preload` pe Regular. Motive pentru self-hosting: GDPR (IP-ul vizitatorului ajunge la Google fără consimțământ), cache-ul partiționat a anulat vechiul avantaj, iar The Seasons va fi local oricum. Licența Apache 2.0 permite.
2. Se cere de la Google și grosimea **600, nefolosită nicăieri** în CSS (apar doar 500, 400, 300). Fișier descărcat degeaba.
3. Rămân valabile din intrarea precedentă: auditul de contrast pe `main.css` și XSS-ul din `shop.js`/`checkout.js`.

**Întrebări deschise pentru Sergiu:**
- **Fontul de titluri — decizia se ia de acasă.** Cele trei căi sunt în secțiunea 🌐 de mai sus. Până atunci `--font-display` rămâne pe Playfair Display, marcat `PROVIZORIU`. **Blocant** pentru tipografie.
- Pictogramele SVG (brandbook §5.1) — încă neprimite.
- Structura multilingvă ro/ru/en — nediscutată încă. Afectează arhitectura de fișiere (13 pagini × 3 limbi) și e o decizie de luat **înainte** de migrarea pe WordPress, nu după.
- `--cream-2` și `--caramel` — fără corespondent în brandbook. Se derivă sau se elimină?
- Numele primei locații: restul site-ului o numește **„Renée"** (Oasis Mall, str. Bogdan-Voievod 1), nu „Renée Oasis". Dacă brandul folosește oficial „Renée Oasis", trebuie schimbat în toate cele 13 pagini — altfel sunt două denumiri pentru același local.

---

## 2026-09-10 · OFICIU

**Făcut:**
- Branch `claude/serene-fermi-9mknnr` adus la zi cu `origin/main` prin fast-forward, până la `f5c75b0`. Nicio modificare de conținut.
- Creat acest jurnal + secțiunea 1.1 din `CLAUDE.md`, la cererea lui Sergiu, ca sesiunile să se poată coordona.

**Verificat, nu modificat** — ultimele commit-uri de pe `main`:
- `8f6e660` — SVG-urile nu mai au `fill="white"` hardcodat; adăugat `logo_symbol.svg`
- `f5c75b0` „restyling v1" — 23 fișiere, +1128/−427: `main.css` rescris masiv, `shop.css` curățat, `index.html` +351, pagini legale noi (`termeni.html`, `confidentialitate.html`), motivul de pattern extras ca element tileabil, `products.js` modificat, `menu-eatme-snapshot.json` nou

**Nu am putut:**
- `git push` din OFICIU dă **403** — sesiunile cloud nu au drept de scriere pe repo. Tot ce scriu aici trebuie luat de Sergiu și pushed din GitHub Desktop. Nu conta pe mine pentru operațiuni git.
- Nu pot deschide paginile în browser, deci **nu pot verifica vizual** nimic. Verificarea vizuală e treaba sesiunii ACASĂ.

**Pentru cealaltă sesiune (ACASĂ):**
1. `main.css` a fost rescris cu paleta nouă. Merită un audit de contrast — reperele calculate sunt în `CLAUDE.md` §5. Atenție la **Crust Brown `#AF7B5C` pe Tiramisu `#E0D7D1` = 2.55**, sub pragul WCAG de 4.5. Nu e permis pentru text, prețuri, butoane sau link-uri; e acceptabil doar pentru logo mare și decor.
2. `termeni.html` și `confidentialitate.html` sunt nou create. De verificat dacă sunt texte reale sau draft — dacă sunt draft, trebuie marcate ca atare, fiind pagini cu valoare juridică.
3. Rămâne nerezolvat riscul de XSS din `CLAUDE.md` §8: `innerHTML` fără escaping în `shop.js` și `checkout.js`. Inofensiv acum, blocant la migrarea pe WordPress.

**Întrebări deschise pentru Sergiu:**
- Licența web pentru fontul **The Seasons** — răspunsul de la compania de brandbook. Fără el, titlurile nu pot fi corecte.
- **Pictogramele SVG** (cele 6 din brandbook §5.1) — încă neprimite.
- `--cream-2` și `--caramel` — nu au corespondent în brandbook. Se derivă sau se elimină?
- Numele repo-ului nou pentru tema WordPress (task amânat, dar decizia rămâne deschisă).
