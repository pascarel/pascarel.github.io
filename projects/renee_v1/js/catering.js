/* Renée — pagina de catering. Catalog separat de Meniu:
   fără coș, fără pagină de detaliu, un singur CTA (cerere de ofertă).
   Datele vin din data/catering.js.
   WP: produse Woo în categoria-părinte „Catering" (cu subcategorii), NU CPT separat —
   decis 17 sept. 2026. Listarea = pagina /catering/ cu tax_query pe ramură; detaliul =
   single-product.php cu layout condiţionat pe ramură (fără coş, „Cere o ofertă"). */
(function(){
  'use strict';

  function money(n){ return n + ' lei'; }
  function esc(s){
    return String(s == null ? '' : s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
  function revealIn(container){
    if (window.reneeReveal){ window.reneeReveal(container); }
    else if (container){ container.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); }); }
  }
  function catById(id){
    var cats = window.CATERING_CATEGORIES || [];
    for (var i = 0; i < cats.length; i++) if (cats[i].id === id) return cats[i];
    return null;
  }

  /* gramaj / volum, ca pe cardurile din Meniu: „35 g", „1 kg", „330 ml" */
  function gramajText(p){
    if (!p.gramaj) return '';
    if (p.masura === 'ml') return p.gramaj + ' ml';
    if (p.gramaj >= 1000 && p.gramaj % 1000 === 0) return (p.gramaj / 1000) + ' kg';
    return p.gramaj + ' g';
  }

  /* ---------- card cu poză (candy bar, finger food, plăcinte) ---------- */
  function cardHTML(p){
    var unit = p.unitate === 'kg' ? ' / kg' : ' / buc';
    var gramaj = gramajText(p);
    var alerg = p.alergeni
      ? '<span class="alergeni" tabindex="0" role="button" aria-label="Alergeni pentru ' + esc(p.name) + '">' +
          '<span class="alergeni-i" aria-hidden="true">i</span>' +
          '<span class="alergeni-pop" role="tooltip">Poate conține: ' + esc(p.alergeni) + '</span>' +
        '</span>'
      : '';
    var img = (p.images && p.images[0]) || '';
    var href = 'produs.html?id=' + encodeURIComponent(p.id);
    return (
      '<article class="card cat-card reveal">' +
        '<a class="card-link" href="' + href + '"><div class="card-img">' +
          '<img class="photo" src="' + esc(img) + '" alt="' + esc(p.name) + '" loading="lazy" width="367" height="342">' +
        '</div></a>' +
        '<div class="card-body">' +
          '<h3><a class="card-title-link" href="' + href + '">' + esc(p.name) + '</a></h3>' +
          (gramaj ? '<p class="card-gramaj">' + gramaj + '</p>' : '') +
          '<div class="card-foot">' +
            '<span class="cat-pret">' + money(p.price) + '<small>' + unit + '</small></span>' +
            alerg +
          '</div>' +
        '</div>' +
      '</article>'
    );
  }

  /* ---------- listă fără poze (băuturi) — grupată pe `grup` ---------- */
  function listHTML(items){
    var groups = [], map = {};
    items.forEach(function(p){
      var g = p.grup || '';
      if (!map[g]){ map[g] = []; groups.push(g); }
      map[g].push(p);
    });
    var html = '<div class="cat-lista reveal">';
    groups.forEach(function(g){
      html += '<div class="cat-lista-grup">';
      if (g) html += '<h3 class="cat-lista-titlu">' + esc(g) + '</h3>';
      html += '<ul>';
      map[g].forEach(function(p){
        var g = gramajText(p);
        html += '<li><span>' + esc(p.name) + (g ? ' <small class="cat-lista-gramaj">' + g + '</small>' : '') + '</span>' +
                '<span class="cat-lista-pret">' + money(p.price) + '</span></li>';
      });
      html += '</ul></div>';
    });
    html += '</div>';
    return html;
  }

  /* ---------- filtre ---------- */
  function renderFilters(el, onSelect){
    var cats = window.CATERING_CATEGORIES || [];
    var html = '<button type="button" class="cat-filter active" data-cat="all">Toate</button>';
    cats.forEach(function(c){
      html += '<button type="button" class="cat-filter" data-cat="' + esc(c.id) + '">' + esc(c.name) + '</button>';
    });
    el.innerHTML = html;
    var buttons = el.querySelectorAll('.cat-filter');
    buttons.forEach(function(btn){
      btn.addEventListener('click', function(){
        buttons.forEach(function(b){ b.classList.remove('active'); });
        this.classList.add('active');
        if (window.reneeChipReveal) window.reneeChipReveal(el, this);
        onSelect(this.getAttribute('data-cat'));
      });
    });
  }

  /* Scrollspy: în modul „Toate" categoriile sunt secţiuni una sub alta; bara sticky
     aprinde chip-ul categoriei aflate pe ecran şi îl aduce în vizor. Nu schimbă filtrul —
     click-ul pe chip filtrează ca înainte. Se opreşte când utilizatorul alege o categorie. */
  var spy = null;
  function stopSpy(){ if (spy){ spy.disconnect(); spy = null; } }
  function startSpy(filtersEl, gridEl){
    stopSpy();
    if (!filtersEl || !('IntersectionObserver' in window)) return;
    var heads = gridEl.querySelectorAll('.cat-sectiune-titlu[data-cat]');
    if (!heads.length) return;
    var visible = {};
    function setActive(catId){
      var chips = filtersEl.querySelectorAll('.cat-filter');
      var target = null;
      chips.forEach(function(c){
        var on = c.getAttribute('data-cat') === catId;
        c.classList.toggle('active', on);
        if (on) target = c;
      });
      if (target && window.reneeChipReveal) window.reneeChipReveal(filtersEl, target);
    }
    /* banda de observare: de sub bara sticky până la 45% din ecran — secţiunea al cărei
       titlu sau corp intră acolo e „cea vizibilă" */
    spy = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ visible[e.target.getAttribute('data-cat')] = e.isIntersecting; });
      var order = Array.prototype.map.call(heads, function(h){ return h.getAttribute('data-cat'); });
      for (var i = 0; i < order.length; i++){
        if (visible[order[i]]){ setActive(order[i]); return; }
      }
    }, { rootMargin: '-140px 0px -55% 0px', threshold: 0 });
    /* observăm blocul de conţinut al fiecărei secţiuni (grila sau lista), nu titlul —
       titlul e mic şi ar ieşi din bandă imediat */
    gridEl.querySelectorAll('.cat-grid[data-cat], .cat-lista[data-cat]').forEach(function(b){ spy.observe(b); });
  }

  /* ---------- controller ---------- */
  function mount(opts){
    var gridEl = document.getElementById(opts.gridId);
    if (!gridEl) return;
    var filtersEl = opts.filtersId ? document.getElementById(opts.filtersId) : null;
    var countEl = opts.countId ? document.getElementById(opts.countId) : null;
    var descEl = opts.descId ? document.getElementById(opts.descId) : null;

    function draw(catId){
      var cats = window.CATERING_CATEGORIES || [];
      var html = '';
      var total = 0;

      /* „Toate": fiecare categorie cu titlul ei, în ordinea din PDF.
         O categorie anume: doar grila ei. */
      var show = catId === 'all' ? cats : [catById(catId)].filter(Boolean);
      show.forEach(function(c){
        var items = window.getCateringByCategory(c.id);
        total += items.length;
        if (catId === 'all'){
          html += '<h2 class="cat-sectiune-titlu reveal" data-cat="' + esc(c.id) + '">' + esc(c.name) +
                  (c.description ? '<span>' + esc(c.description) + '</span>' : '') + '</h2>';
        }
        var block = c.layout === 'list'
          ? listHTML(items)
          : '<div class="cards cat-grid">' + items.map(cardHTML).join('') + '</div>';
        /* data-cat şi pe bloc — scrollspy-ul observă blocul, nu titlul */
        html += block.replace(/^<div class="/, '<div data-cat="' + esc(c.id) + '" class="');
      });

      gridEl.innerHTML = html || '<p style="color:var(--ink-soft)">Nimic în această categorie.</p>';
      revealIn(gridEl);
      if (catId === 'all') startSpy(filtersEl, gridEl); else stopSpy();

      if (countEl) countEl.textContent = total + (total === 1 ? ' poziție' : ' poziții');
      if (descEl){
        var c = catId === 'all' ? null : catById(catId);
        descEl.textContent = c && c.description ? c.description : '';
      }
    }

    if (filtersEl) renderFilters(filtersEl, draw);
    draw('all');
  }

  /* ---------- pagina de produs (produs.html?id=…) ----------
     Aceeaşi structură ca la preparatele din Meniu (.pd-*), dar fără coş, stepper,
     sticky bar şi bundle: singura acţiune e „Cere o ofertă". Băuturile nu au pagină.
     WP: single-product.php, ramura Catering → acest layout (is_purchasable = false). */
  function accordion(title, body, open){
    return '<details class="pd-acc"' + (open ? ' open' : '') + '><summary>' + title + '</summary>' +
      '<div class="pd-acc-body">' + body + '</div></details>';
  }
  function renderDetail(containerId, id){
    var el = document.getElementById(containerId);
    if (!el) return null;
    var p = window.getCateringProduct(id);
    if (!p || p.category === 'bauturi') return null;
    var cat = catById(p.category);
    var img = (p.images && p.images[0]) || '';
    var unit = p.unitate === 'kg' ? 'per kilogram' : 'per bucată';
    var g = gramajText(p);

    var acc = '';
    if (p.alergeni){
      acc += accordion('Alergeni',
        '<p class="pd-alerg-linie"><strong>Poate conține:</strong> ' + esc(p.alergeni) + '</p>' +
        '<p class="pd-note">Deduși din denumire, nu declarați. Nu sunt o declarație oficială — ' +
        'confirmă cu noi dacă ai o alergie.<!-- DRAFT --></p>', true);
    }
    acc += accordion('Cum se comandă',
      '<p>Preparatele de catering se comandă <strong>cu minim 48 de ore înainte</strong>, la bucată sau la kilogram. ' +
      'Ridicare din oricare locație Renée sau livrare în Chișinău.<!-- DRAFT: termen şi condiţii de confirmat --></p>', false);

    el.innerHTML =
      '<nav class="pd-crumb"><a href="evenimente.html">Evenimente</a><span>/</span>' +
        '<a href="catering.html">Catering</a><span>/</span>' +
        '<a href="catering.html">' + esc(cat ? cat.name : '') + '</a></nav>' +   /* fără numele produsului — e în h1 */
      '<div class="pd-grid">' +
        '<div class="pd-gallery reveal">' +
          '<div class="pd-main"><img id="pdMainImg" src="' + esc(img) + '" alt="' + esc(p.name) + '"></div>' +
        '</div>' +
        '<div class="pd-info pd-catering reveal reveal-d1">' +
          '<h1>' + esc(p.name) + '</h1>' +   /* fără eyebrow cu categoria — e deja în breadcrumb */
          '<div class="pd-price">' + money(p.price) + '<span class="pd-unit">' + unit + '</span>' +
            (g ? '<span class="pd-gramaj">' + g + '</span>' : '') + '</div>' +
          (p.description ? '<p class="pd-short">' + esc(p.description) + '</p>' : '') +
          '<div class="pd-row pd-oferta">' +
            '<a class="btn-add" href="contact.html">Cere o ofertă</a>' +
            '<a class="pd-tel" href="tel:+37378784040">+373 78 784 040</a>' +
          '</div>' +
          '<p class="pd-note">Se comandă pentru evenimente, în cantitatea dorită. Îți răspundem cu o selecție și un preț în aceeași zi.<!-- DRAFT --></p>' +
          '<div class="pd-accordions">' + acc + '</div>' +
        '</div>' +
      '</div>';
    document.title = p.name + ' — Catering Renée · Chișinău';
    /* main.js a marcat deja Meniu ca activ (produs.html → meniu.html). Pentru un preparat
       de catering părintele e Evenimente › Catering — mutăm starea aici. */
    document.querySelectorAll('#nav a').forEach(function(a){
      var href = (a.getAttribute('href') || '').split('/').pop();
      var on = href === 'evenimente.html' || href === 'catering.html';
      a.classList.toggle('is-current', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    revealIn(el);
    return p;
  }

  /* „Similare": 3 preparate din aceeaşi categorie de catering */
  function renderSimilar(wrapId, p){
    var wrap = document.getElementById(wrapId);
    if (!wrap || !p) return;
    var sim = window.getCateringByCategory(p.category).filter(function(x){ return x.id !== p.id; }).slice(0, 3);
    if (!sim.length) return;
    wrap.innerHTML = '<div class="wrap"><h2 class="related-title reveal">Din același <em>candy bar</em></h2>'
      .replace('candy bar', (catById(p.category) || {}).name || 'meniu') +
      '<div class="cards">' + sim.map(cardHTML).join('') + '</div></div>';
    revealIn(wrap);
  }

  /* ---------- teaser (evenimente.html): câteva preparate alese, fără filtre ---------- */
  function mountTeaser(opts){
    var el = document.getElementById(opts.gridId);
    if (!el) return;
    var html = '';
    (opts.ids || []).forEach(function(id){
      var p = window.getCateringProduct(id);
      if (p) html += cardHTML(p);
    });
    el.innerHTML = html;
    revealIn(el);
  }

  window.Catering = { mount: mount, mountTeaser: mountTeaser, renderDetail: renderDetail, renderSimilar: renderSimilar };
})();
