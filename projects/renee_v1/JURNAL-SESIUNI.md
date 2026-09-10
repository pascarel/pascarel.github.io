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
