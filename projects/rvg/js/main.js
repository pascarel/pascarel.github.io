(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  // Header state on scroll
  const header = $('.header');
  const onScroll = () => header.classList.toggle('is-scrolled', scrollY > 40);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Mobile menu
  const burger = $('#burger'), nav = $('#nav');
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', open);
    header.classList.toggle('is-scrolled', open || scrollY > 40);
  });
  $$('a', nav).forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('is-open'); burger.setAttribute('aria-expanded', false);
  }));

  // Calculator (prețuri placeholder — de înlocuit cu cele reale)
  if ($("#c-area")) {
  const area = $('#c-area'), areaOut = $('#c-area-out'), type = $('#c-type'), mat = $('#c-mat');
  const fmt = n => (Math.round(n / 1000) * 1000).toLocaleString('ro-RO');
  function calc() {
    const m2 = +area.value, base = +$('input[name=plan]:checked').value * +type.value;
    const perM2 = mat.checked ? base * 2.1 : base;
    areaOut.value = m2;
    $('#c-min').textContent = fmt(perM2 * m2 * 0.9);
    $('#c-max').textContent = fmt(perM2 * m2 * 1.2);
    const weeks = Math.max(4, Math.round(m2 / 8));
    $('#c-term').textContent = weeks < 9 ? `${weeks} săptămâni` : `${Math.round(weeks / 4.3)} luni`;
  }
  [area, type, mat, ...$$('input[name=plan]')].forEach(el => el.addEventListener('input', calc));
  $$('[data-plan]').forEach(btn => btn.addEventListener('click', () => {
    const r = $(`input[name=plan][value="${btn.dataset.plan}"]`); if (r) { r.checked = true; calc(); }
  }));
  calc();
  }

  // Plan buttons → preselect package in contact form
  $$('[data-plan]').forEach(b => b.addEventListener('click', () => {
    const sel = $('#f-plan'); if (sel) sel.value = b.dataset.plan;
  }));

  // Before / after
  const ba = $('#ba');
  if (ba) $('input', ba).addEventListener('input', e => ba.style.setProperty('--pos', e.target.value + '%'));

  // Forms → în WP: handler propriu → Google Sheet (Apps Script). Aici doar demo.
  const toast = $('#toast');
  $$('form.lead').forEach(f => f.addEventListener('submit', e => {
    e.preventDefault();
    if (f.website && f.website.value) return; // honeypot
    toast.textContent = 'Mulțumim! Te sunăm în curând.';
    toast.classList.add('is-show'); setTimeout(() => toast.classList.remove('is-show'), 3500);
    f.reset();
  }));

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Animated counters (hero + stats)
  const countUp = el => {
    const to = +el.dataset.count, dur = 1800, t0 = performance.now();
    if (reduce) { el.textContent = to; return; }
    const tick = t => {
      const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 4);
      el.textContent = Math.round(to * e);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  $$('[data-count]').forEach(el => { el.textContent = '0'; });

  // Split section headings into words for a mask-up animation
  $$('.section h2, .stats strong').forEach(h => {
    if (h.closest('.hero') || h.matches('.stats strong')) return;
    let i = 0;
    h.innerHTML = h.textContent.trim().split(/\s+/)
      .map(w => `<span class="w"><span style="--i:${i++}">${w}</span></span>`).join(' ');
    h.classList.add('split');
  });

  // Scroll reveals with variants + stagger inside groups
  const groups = [
    ['.section__head .eyebrow, .section__head > p, .faq > div > p', ''],
    ['.service', 'reveal--zoom'],
    ['.plan', ''],
    ['.steps li', ''],
    ['.review', ''],
    ['.project', 'reveal--img'],
    ['.why__list li', 'reveal--right'],
    ['.why__media', 'reveal--left'],
    ['.calc', 'reveal--zoom'],
    ['.ba__text', 'reveal--left'],
    ['.ba__frame', 'reveal--img'],
    ['.faq__list details', 'reveal--right'],
    ['.cta__inner > div', 'reveal--left'],
    ['.lead--card', 'reveal--right'],
    ['.stats__inner > div', 'reveal--zoom'],
  ];
  groups.forEach(([sel, cls]) => {
    const parents = new Map();
    $$(sel).forEach(el => {
      const n = parents.get(el.parentNode) || 0; parents.set(el.parentNode, n + 1);
      el.classList.add('reveal'); if (cls) el.classList.add(cls);
      el.style.setProperty('--rd', `${Math.min(n, 6) * 0.09}s`);
    });
  });

  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('is-in');
    $$('[data-count]', e.target).concat(e.target.matches('[data-count]') ? [e.target] : []).forEach(countUp);
    io.unobserve(e.target);
  }), { rootMargin: '0px 0px -12% 0px' });
  $$('.reveal, .split, .hero__trust').forEach(el => io.observe(el));

  // Pause hero video when off-screen (saves CPU/battery)
  const vid = $('.hero__bg');
  if (vid && vid.tagName === 'VIDEO') {
    if (reduce) vid.pause();
    else new IntersectionObserver(([e]) => e.isIntersecting ? vid.play().catch(() => {}) : vid.pause()).observe(vid);
  }
})();
