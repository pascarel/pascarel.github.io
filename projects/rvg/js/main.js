(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  // Header state on scroll
  const header = $('.header');
  const onScroll = () => header.classList.toggle('is-scrolled', scrollY > 40);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Mobile menu
  const burger = $('#burger'), nav = $('#nav');
  const setMenu = open => {
    nav.classList.toggle('is-open', open);
    document.documentElement.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Închide meniul' : 'Deschide meniul');
  };
  burger.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  $$('a', nav).forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
  matchMedia('(min-width: 1081px)').addEventListener('change', e => { if (e.matches) setMenu(false); });

  // Calculator (prețuri de start placeholder, EUR)
  if ($('#c-area')) {
    const area = $('#c-area'), type = $('#c-type'), mat = $('#c-mat');
    const eur = n => (Math.round(n / 100) * 100).toLocaleString('ro-RO');
    const calc = () => {
      const m2 = +area.value, k = +type.value, p = $('input[name=plan]:checked');
      const lab = +p.dataset.m * k * m2, mats = mat.checked ? +p.dataset.mat * k * m2 : 0;
      $('#c-area-out').value = m2;
      $('#c-lab').textContent = eur(lab) + ' €';
      $('#c-mats').textContent = eur(mats) + ' €';
      $('#c-mat-row').hidden = !mat.checked;
      $('#c-min').textContent = eur(lab + mats);
      const weeks = Math.max(4, Math.round(m2 / 8));
      $('#c-term').textContent = weeks < 9 ? `${weeks} săptămâni` : `${Math.round(weeks / 4.3)} luni`;
    };
    [area, type, mat, ...$$('input[name=plan]')].forEach(el => el.addEventListener('input', calc));
    $$('[data-plan]').forEach(b => b.addEventListener('click', () => {
      const r = $(`input[name=plan][value="${b.dataset.plan}"]`); if (r) { r.checked = true; calc(); }
    }));
    calc();
  }

  // Video testimonials: card → modal player (youtube-nocookie), prev/next, keys, swipe
  {
    const modal = $('#vmodal');
    if (modal) {
      const frame = $('.vmodal__frame', modal);
      let list = [], i = 0, busy = false, lastFocus = null;
      const esc = t => t.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
      const render = () => {
        const v = list[i];
        frame.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(v.id)}?autoplay=1&rel=0&playsinline=1&modestbranding=1" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen title="${esc(v.title)}"></iframe>`;
        $('.vmodal__title', modal).textContent = v.title;
        $('.vmodal__sub', modal).textContent = v.sub;
        $('.vmodal__count', modal).textContent = list.length > 1 ? `${i + 1} / ${list.length}` : '';
        $$('[data-vdir]', modal).forEach(b => b.hidden = list.length < 2);
      };
      const open = btn => {
        const scope = btn.closest('section') || document;
        const btns = $$('[data-yt]', scope);
        list = btns.map(b => ({ id: b.dataset.yt, title: b.dataset.title || '', sub: b.dataset.sub || '' }));
        i = Math.max(0, btns.indexOf(btn));
        lastFocus = btn;
        render();
        modal.hidden = false;
        document.documentElement.classList.add('vmodal-open');
        $('.vmodal__close', modal).focus();
      };
      const close = () => {
        modal.hidden = true; frame.innerHTML = '';
        document.documentElement.classList.remove('vmodal-open');
        lastFocus?.focus();
      };
      const go = d => {
        if (list.length < 2 || busy) return;
        i = (i + d + list.length) % list.length;
        if (reduce) return render();
        busy = true; frame.style.setProperty('--dir', d); frame.classList.add('is-out');
        setTimeout(() => {
          render(); frame.classList.replace('is-out', 'is-in');
          requestAnimationFrame(() => requestAnimationFrame(() => { frame.classList.remove('is-in'); busy = false; }));
        }, 300);
      };
      document.addEventListener('click', e => {
        const b = e.target.closest('[data-yt]'); if (b) { e.preventDefault(); open(b); }
      });
      $$('[data-vdir]', modal).forEach(b => b.addEventListener('click', () => go(+b.dataset.vdir)));
      $('[data-vclose]', modal).addEventListener('click', close);
      modal.addEventListener('click', e => { if (e.target === modal) close(); });
      addEventListener('keydown', e => {
        if (modal.hidden) return;
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowLeft') go(-1);
        if (e.key === 'ArrowRight') go(1);
      });
      let x0 = null;
      modal.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
      modal.addEventListener('touchend', e => {
        if (x0 === null) return;
        const dx = e.changedTouches[0].clientX - x0;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        x0 = null;
      }, { passive: true });
    }
  }

  // Sliders (scroll-snap + arrows + dots)
  $$('[data-slider]').forEach(sl => {
    const track = $('[data-track]', sl), items = [...track.children], dots = $('[data-dots]', sl);
    const btns = $$('[data-sdir]', sl);
    const step = () => items[1] ? items[1].offsetLeft - items[0].offsetLeft : track.clientWidth;
    const pages = () => Math.max(1, Math.round((track.scrollWidth - track.clientWidth) / step()) + 1);
    const cur = () => Math.round(track.scrollLeft / step());
    const buildDots = () => {
      dots.innerHTML = '';
      for (let k = 0; k < pages(); k++) {
        const d = document.createElement('button');
        d.type = 'button'; d.setAttribute('aria-label', `Slide ${k + 1}`);
        d.addEventListener('click', () => track.scrollTo({ left: k * step() }));
        dots.appendChild(d);
      }
      sync();
    };
    const sync = () => {
      const c = cur(), max = track.scrollWidth - track.clientWidth - 2;
      [...dots.children].forEach((d, k) => d.setAttribute('aria-current', k === c));
      btns[0].disabled = track.scrollLeft <= 2;
      btns[1].disabled = track.scrollLeft >= max;
      sl.querySelector('.vslider__ctrl').hidden = pages() < 2;
    };
    btns.forEach(b => b.addEventListener('click', () => track.scrollBy({ left: +b.dataset.sdir * step() })));
    track.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { e.preventDefault(); track.scrollBy({ left: step() }); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); track.scrollBy({ left: -step() }); }
    });
    let t; track.addEventListener('scroll', () => { cancelAnimationFrame(t); t = requestAnimationFrame(sync); }, { passive: true });
    addEventListener('resize', buildDots);
    buildDots();
  });

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
      const p = Math.min(1, Math.max(0, (t - t0) / dur)), e = 1 - Math.pow(1 - p, 4);
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
    ['.vcard', 'reveal--zoom'],
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
