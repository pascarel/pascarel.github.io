/* ============================================================
   Portfolio — interactions
   ============================================================ */

// ---------- Projects data ----------
const PROJECTS = [
  {
    name: "app.gov.md",
    url: "https://app.gov.md/",
    cat: "Guvernare",
    domain: "app.gov.md",
    desc: "Portalul Agenției Proprietății Publice — administrarea și privatizarea proprietății de stat a Republicii Moldova."
  },
  {
    name: "moldova.travel",
    url: "https://moldova.travel/",
    cat: "Turism",
    domain: "moldova.travel",
    desc: "Portalul oficial de turism al Republicii Moldova — destinații, turism vitivinicol, cultură și experiențe rurale."
  },
  {
    name: "Orheiul Vechi",
    url: "https://orheiulvechi.com/",
    cat: "Turism",
    domain: "orheiulvechi.com",
    desc: "Site de promovare a rezervației cultural-naturale Orheiul Vechi — istorie, legende și priveliști."
  },
  {
    name: "Soros Foundation",
    url: "https://soros.md/",
    cat: "ONG",
    domain: "soros.md",
    desc: "Fundația Soros Moldova — organizație care susține democrația, statul de drept și reziliența socioeconomică."
  },
  {
    name: "Grădina Bunătăților",
    url: "https://gradinabunatatilor.md/",
    cat: "ONG",
    domain: "gradinabunatatilor.md",
    desc: "GAL „Grădina Bunătăților” — dezvoltarea comunităților rurale prin parteneriate și inițiative locale."
  },
  {
    name: "Vin de Autor",
    url: "https://vindeautor.md/",
    cat: "Vin",
    domain: "vindeautor.md",
    desc: "Asociația micilor vinificatori din Moldova — 65 de producători, peste 800 de vinuri și 450 de medalii internaționale."
  },
  {
    name: "Crama Mingir",
    url: "https://cramamingir.md/",
    cat: "Vin",
    domain: "cramamingir.md",
    desc: "Cramă de familie din regiunea Codru — vinuri de autor produse și comercializate direct."
  },
  {
    name: "InterAuto",
    url: "https://interauto.md/",
    cat: "eCommerce",
    domain: "interauto.md",
    desc: "Dealer auto din Chișinău — mii de automobile la vânzare, finanțare, asigurări și mentenanță."
  },
  {
    name: "UniFishing",
    url: "https://unifishing.md/",
    cat: "eCommerce",
    domain: "unifishing.md",
    desc: "Magazin online de echipament de pescuit — lansete, mulinete, momeli și accesorii de camping."
  },
  {
    name: "DigitalVet",
    url: "https://digitalvet.md/",
    cat: "Platformă",
    domain: "digitalvet.md",
    desc: "Platformă digitală dedicată domeniului veterinar." // editează descrierea dacă vrei detalii
  },
  {
    name: "Pyck",
    url: "https://pyck.ai/",
    cat: "SaaS",
    domain: "pyck.ai",
    desc: "Framework open-source de management al depozitelor (WMS) — implementare rapidă, fără vendor lock-in."
  },
  {
    name: "SLAPStack",
    url: "https://slapstack.de/",
    cat: "SaaS",
    domain: "slapstack.de",
    desc: "Platformă de warehouse intelligence — tracking în timp real, dimensionare 3D și control AI al flotei."
  },
  {
    name: "Pro Drive",
    url: "https://www.prodrive.net/",
    cat: "Web",
    domain: "www.prodrive.net",
    desc: "Școală de conducere performantă — instruire în controlul vehiculului, racing și traininguri corporative."
  }
];

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

// ---------- Render projects ----------
const grid = document.getElementById("projects");
const filtersEl = document.getElementById("filters");

function faviconFor(domain) {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
}

function renderProjects(filter = "Toate") {
  const list = filter === "Toate" ? PROJECTS : PROJECTS.filter(p => p.cat === filter);
  grid.innerHTML = list.map(p => `
    <a class="project reveal" href="${p.url}" target="_blank" rel="noopener" data-cat="${p.cat}">
      <div class="thumb">
        <img src="${faviconFor(p.domain)}" alt="${p.name} logo" loading="lazy"
             onerror="this.style.display='none'">
      </div>
      <div class="body">
        <span class="cat">${p.cat}</span>
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <span class="link">Vizitează site-ul <span class="arw">→</span></span>
      </div>
    </a>
  `).join("");
  observeReveals();
}

// ---------- Filters ----------
const cats = ["Toate", ...new Set(PROJECTS.map(p => p.cat))];
filtersEl.innerHTML = cats.map((c, i) =>
  `<button class="filter ${i === 0 ? "active" : ""}" data-cat="${c}">${c}</button>`
).join("");
filtersEl.addEventListener("click", e => {
  const btn = e.target.closest(".filter");
  if (!btn) return;
  filtersEl.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  renderProjects(btn.dataset.cat);
});

renderProjects();

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

// ---------- Contact form (Formspree) ----------
const form = document.getElementById("contactForm");
const note = document.getElementById("formNote");
form.addEventListener("submit", async e => {
  e.preventDefault();
  // Dacă endpoint-ul Formspree nu a fost încă configurat, trimite prin email client.
  if (form.action.includes("YOUR_FORM_ID")) {
    const name = form.name.value, email = form.email.value, msg = form.message.value;
    window.location.href = `mailto:ai@rt.md?subject=Contact de la ${encodeURIComponent(name)}` +
      `&body=${encodeURIComponent(msg + "\n\n— " + name + " (" + email + ")")}`;
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
    if (res.ok) {
      form.reset();
      note.className = "form-note ok";
      note.textContent = "✓ Mesaj trimis. Mulțumesc — revin cât de curând!";
    } else {
      throw new Error("fail");
    }
  } catch {
    note.className = "form-note err";
    note.textContent = "Ceva n-a mers. Scrie-mi direct la ai@rt.md";
  }
});

// ---------- Year ----------
document.getElementById("year").textContent = new Date().getFullYear();
