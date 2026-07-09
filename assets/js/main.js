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

const VISIBLE = 6; // câte proiecte se arată inițial

// ---------- Render ----------
const grid = document.getElementById("projects");
const moreBtn = document.getElementById("moreBtn");
let expanded = false;

function cardHTML(p, i) {
  const chips = p.stack.map(s => `<span class="chip">${s}</span>`).join("");
  return `
    <a class="project reveal" href="${p.url}" target="_blank" rel="noopener"
       data-cat="${p.cat}" style="transition-delay:${(i % VISIBLE) * 60}ms">
      <div class="thumb">
        <img class="shot" src="assets/img/${p.slug}.jpg" alt="Screenshot ${p.name}" loading="lazy" />
      </div>
      <div class="body">
        <span class="cat">${p.cat}</span>
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="chips">${chips}</div>
        <span class="link">Vizitează site-ul <span class="arw">→</span></span>
      </div>
    </a>`;
}

function render() {
  const list = expanded ? PROJECTS : PROJECTS.slice(0, VISIBLE);
  grid.innerHTML = list.map(cardHTML).join("");
  observeReveals();
}

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

// ---------- Contact form (FormSubmit.co) ----------
const form = document.getElementById("contactForm");
const note = document.getElementById("formNote");
const formWrap = document.getElementById("formWrap");
const confettiBox = document.getElementById("confetti");
const COLORS = ["#4c8dff", "#38bdf8", "#22c55e", "#f59e0b", "#ef4444", "#a78bfa"];

function fireConfetti() {
  confettiBox.innerHTML = "";
  for (let i = 0; i < 40; i++) {
    const s = document.createElement("span");
    const angle = Math.random() * Math.PI - Math.PI / 2; // -90°..90°
    const dist = 120 + Math.random() * 160;
    s.style.left = 50 + (Math.random() * 40 - 20) + "%";
    s.style.background = COLORS[i % COLORS.length];
    s.style.setProperty("--dx", Math.sin(angle) * dist + "px");
    s.style.setProperty("--dy", (60 + Math.random() * dist) + "px");
    s.style.setProperty("--rot", (Math.random() * 720 - 360) + "deg");
    s.style.animationDelay = Math.random() * 0.15 + "s";
    if (i % 2) s.style.borderRadius = "50%";
    confettiBox.appendChild(s);
  }
}

function showThankYou() {
  formWrap.classList.add("sent");
  fireConfetti();
}

form.addEventListener("submit", async e => {
  e.preventDefault();

  // Local (file://) nu poate trimite — arătăm direct animația (mod demo).
  if (location.protocol === "file:") {
    showThankYou();
    return;
  }

  note.className = "form-note";
  note.textContent = "Se trimite…";
  try {
    const res = await fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" }
    });
    if (!res.ok) throw new Error("fail");
    form.reset();
    showThankYou();
  } catch {
    note.className = "form-note err";
    note.textContent = "Ceva n-a mers. Scrie-mi direct la pascarusergiu003@gmail.com";
  }
});

document.getElementById("sendAnother").addEventListener("click", () => {
  form.reset();
  note.textContent = "";
  note.className = "form-note";
  formWrap.classList.remove("sent");
});

// ---------- Year ----------
document.getElementById("year").textContent = new Date().getFullYear();
