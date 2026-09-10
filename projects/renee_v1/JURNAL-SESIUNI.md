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
