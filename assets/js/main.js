/* ============================================================
   Portfolio — interactions
   ============================================================ */

// ---------- Reveal-on-scroll observer (declared early to avoid TDZ) ----------
let io;
function observeReveals() {
  if (!io) {
    io = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
  }
  document.querySelectorAll(".reveal:not(.in)").forEach(el => io.observe(el));
}

// ---------- Projects data ----------
// stack = tehnologiile folosite (editează după caz)
const PROJECTS = [
  { name: "app.gov.md", slug: "appgov", url: "https://app.gov.md/", cat: "Guvernare", domain: "app.gov.md",
    stack: ["WordPress", "PHP", "ACF"],
    desc: "Portalul Agenției Proprietății Publice — administrarea și privatizarea proprietății de stat a Republicii Moldova." },

  { name: "moldova.travel", slug: "moldovatravel", url: "https://moldova.travel/", cat: "Turism", domain: "moldova.travel",
    stack: ["Web", "JavaScript", "UX"],
    desc: "Portalul oficial de turism al Republicii Moldova — destinații, turism vitivinicol, cultură și experiențe rurale." },

  { name: "Orheiul Vechi", slug: "orheiulvechi", url: "https://orheiulvechi.com/", cat: "Turism", domain: "orheiulvechi.com",
    stack: ["WordPress", "PHP", "WPML"],
    desc: "Site de promovare a rezervației cultural-naturale Orheiul Vechi — istorie, legende și priveliști." },

  { name: "Soros Foundation", slug: "soros", url: "https://soros.md/", cat: "ONG", domain: "soros.md",
    stack: ["WordPress", "PHP", "WPML"],
    desc: "Fundația Soros Moldova — organizație care susține democrația, statul de drept și reziliența socioeconomică." },

  { name: "Grădina Bunătăților", slug: "gradina", url: "https://gradinabunatatilor.md/", cat: "ONG", domain: "gradinabunatatilor.md",
    stack: ["WordPress", "ACF", "PHP"],
    desc: "GAL „Grădina Bunătăților” — dezvoltarea comunităților rurale prin parteneriate și inițiative locale." },

  { name: "Vin de Autor", slug: "vindeautor", url: "https://vindeautor.md/", cat: "Vin", domain: "vindeautor.md",
    stack: ["WordPress", "WooCommerce", "WPML"],
    desc: "Asociația micilor vinificatori din Moldova — 65 de producători, peste 800 de vinuri și 450 de medalii internaționale." },

  { name: "Crama Mingir", slug: "cramamingir", url: "https://cramamingir.md/", cat: "Vin", domain: "cramamingir.md",
    stack: ["WordPress", "WooCommerce", "PHP"],
    desc: "Cramă de familie din regiunea Codru — vinuri de autor produse și comercializate direct." },

  { name: "InterAuto", slug: "interauto", url: "https://interauto.md/", cat: "eCommerce", domain: "interauto.md",
    stack: ["WordPress", "PHP", "MySQL"],
    desc: "Dealer auto din Chișinău — mii de automobile la vânzare, finanțare, asigurări și mentenanță." },

  { name: "UniFishing", slug: "unifishing", url: "https://unifishing.md/", cat: "eCommerce", domain: "unifishing.md",
    stack: ["WordPress", "WooCommerce", "PHP"],
    desc: "Magazin online de echipament de pescuit — lansete, mulinete, momeli și accesorii de camping." },

  { name: "DigitalVet", slug: "digitalvet", url: "https://digitalvet.md/", cat: "Platformă", domain: "digitalvet.md",
    stack: ["WordPress", "ACF", "JavaScript"],
    desc: "Platformă digitală educațională dedicată domeniului veterinar." },

  { name: "Pyck", slug: "pyck", url: "https://pyck.ai/", cat: "SaaS", domain: "pyck.ai",
    stack: ["React", "Node.js", "Open Source"],
    desc: "Framework open-source de management al depozitelor (WMS) — implementare rapidă, fără vendor lock-in." },

  { name: "SLAPStack", slug: "slapstack", url: "https://slapstack.de/", cat: "SaaS", domain: "slapstack.de",
    stack: ["React", "TypeScript", "AI"],
    desc: "Platformă de warehouse intelligence — tracking în timp real, dimensionare 3D și control AI al flotei." },

  { name: "Pro Drive", slug: "prodrive", url: "https://www.prodrive.net/", cat: "Web", domain: "www.prodrive.net",
    stack: ["WordPress", "PHP", "CSS"],
    desc: "Școală de conducere performantă — instruire în controlul vehiculului, racing și traininguri corporative." },

  { name: "EVlution", slug: "evlution", url: "https://evlution.co.uk/", cat: "Web", domain: "evlution.co.uk",
    stack: ["WordPress", "PHP", "JavaScript"],
    desc: "Companie din UK care instalează infrastructură de încărcare pentru vehicule electrice — sigură și fiabilă." },

  { name: "EcoImobil", slug: "ecoimobil", url: "https://ecoimobil.md/", cat: "eCommerce", domain: "ecoimobil.md",
    stack: ["WordPress", "PHP", "MySQL"],
    desc: "Platformă imobiliară din Moldova — apartamente, case, spații comerciale și terenuri, de vânzare și în chirie." }
];

// ---------- i18n ----------
const LANG = (document.documentElement.lang || "ro").toLowerCase().startsWith("en") ? "en" : "ro";
const T = {
  ro: { visit: "Vizitează site-ul", more: "Vezi toate proiectele ↓" },
  en: { visit: "Visit website", more: "View all projects ↓" }
}[LANG];
const CAT_EN = {
  "Guvernare": "Government", "Turism": "Tourism", "ONG": "NGO", "Vin": "Wine",
  "eCommerce": "eCommerce", "Platformă": "Platform", "SaaS": "SaaS", "Web": "Web"
};
const DESC_EN = {
  appgov: "Portal of the Public Property Agency — administration and privatization of Moldova's state-owned assets.",
  moldovatravel: "The official tourism portal of Moldova — destinations, wine tourism, culture and rural experiences.",
  orheiulvechi: "Promotional site for the Orheiul Vechi cultural-natural reserve — history, legends and landscapes.",
  soros: "Soros Foundation Moldova — an organization supporting democracy, rule of law and socioeconomic resilience.",
  gradina: "LAG „Grădina Bunătăților” — developing rural communities through partnerships and local initiatives.",
  vindeautor: "Association of small Moldovan winemakers — 65 producers, 800+ wines and 450 international medals.",
  cramamingir: "Family winery from the Codru region — author wines produced and sold directly.",
  interauto: "Car dealership in Chișinău — thousands of vehicles for sale, financing, insurance and maintenance.",
  unifishing: "Online fishing-gear store — rods, reels, bait and camping accessories.",
  digitalvet: "Educational digital platform dedicated to the veterinary field.",
  pyck: "Open-source warehouse management framework (WMS) — fast to implement, no vendor lock-in.",
  slapstack: "Warehouse intelligence platform — real-time tracking, 3D dimensioning and AI fleet control.",
  prodrive: "Performance driving school — vehicle control training, racing and corporate driver programs.",
  evlution: "UK company installing electric-vehicle charging infrastructure — safe and reliable.",
  ecoimobil: "Moldovan real-estate platform — apartments, houses, commercial spaces and land, for sale and rent."
};

const VISIBLE = 6; // câte proiecte se arată inițial

// ---------- Render ----------
const grid = document.getElementById("projects");
const moreBtn = document.getElementById("moreBtn");
let expanded = false;

function cardHTML(p, i) {
  const chips = p.stack.map(s => `<span class="chip">${s}</span>`).join("");
  const cat = LANG === "en" ? (CAT_EN[p.cat] || p.cat) : p.cat;
  const desc = LANG === "en" ? (DESC_EN[p.slug] || p.desc) : p.desc;
  return `
    <a class="project reveal" href="${p.url}" target="_blank" rel="noopener"
       data-cat="${p.cat}" style="transition-delay:${(i % VISIBLE) * 60}ms">
      <div class="thumb">
        <img class="shot" src="/assets/img/${p.slug}.jpg" alt="Screenshot ${p.name}" loading="lazy" />
      </div>
      <div class="body">
        <span class="cat">${cat}</span>
        <h3>${p.name}</h3>
        <p>${desc}</p>
        <div class="chips">${chips}</div>
        <span class="link">${T.visit} <span class="arw">→</span></span>
      </div>
    </a>`;
}

function render() {
  const list = expanded ? PROJECTS : PROJECTS.slice(0, VISIBLE);
  grid.innerHTML = list.map(cardHTML).join("");
  observeReveals();
}

moreBtn.textContent = T.more;

// La click: arată toate proiectele și ascunde butonul (fără „ascunde")
moreBtn.addEventListener("click", () => {
  expanded = true;
  render();
  moreBtn.style.display = "none";
});

// CTA -> scroll la formular
document.getElementById("ctaContact").addEventListener("click", () => {
  document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
});

render();

// ---------- Theme toggle ----------
const root = document.documentElement;
const themeBtn = document.getElementById("theme");
const saved = localStorage.getItem("theme");
if (saved) root.setAttribute("data-theme", saved);
function currentTheme() {
  return root.getAttribute("data-theme") ||
    (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
}
function syncThemeIcon() { themeBtn.textContent = currentTheme() === "light" ? "🌙" : "☀️"; }
syncThemeIcon();
themeBtn.addEventListener("click", () => {
  const next = currentTheme() === "light" ? "dark" : "light";
  root.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  syncThemeIcon();
});

// ---------- Navbar scroll + mobile menu ----------
const nav = document.getElementById("nav");
window.addEventListener("scroll", () => nav.classList.toggle("scrolled", window.scrollY > 20));
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
navToggle.addEventListener("click", () => navLinks.classList.toggle("open"));
navLinks.addEventListener("click", e => { if (e.target.tagName === "A") navLinks.classList.remove("open"); });

// ---------- Reveal on scroll (observer defined above) ----------
observeReveals();

// ---------- Count-up stats ----------
function animateCount(el) {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || "";
  const dur = 1400;
  let start = null;
  function step(ts) {
    if (start === null) start = ts;
    const p = Math.min((ts - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
    el.textContent = Math.round(target * eased) + suffix;
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const statsEl = document.getElementById("stats");
if (statsEl) {
  const statsIO = new IntersectionObserver((entries, obs) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.querySelectorAll("[data-count]").forEach(animateCount);
        obs.unobserve(en.target);
      }
    });
  }, { threshold: 0.4 });
  statsIO.observe(statsEl);
}

// ---------- Year ----------
document.getElementById("year").textContent = new Date().getFullYear();
