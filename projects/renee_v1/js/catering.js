/* Renée — pagina de catering (fourchette). Catalog separat de Meniu:
   fără coș, fără pagină de detaliu, un singur CTA (cerere de ofertă).
   Datele vin din data/catering.js. WP: → archive-catering.php + filtre JS. */
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

  /* ---------- card cu poză (candy bar, finger food, plăcinte) ---------- */
  function cardHTML(p){
    var unit = p.unitate === 'kg' ? ' / kg' : ' / buc';
    var alerg = p.alergeni
      ? '<span class="alergeni" tabindex="0" role="button" aria-label="Alergeni pentru ' + esc(p.name) + '">' +
          '<span class="alergeni-i" aria-hidden="true">i</span>' +
          '<span class="alergeni-pop" role="tooltip">Poate conține: ' + esc(p.alergeni) + '</span>' +
        '</span>'
      : '';
    var img = (p.images && p.images[0]) || '';
    return (
      '<article class="card cat-card reveal">' +
        '<div class="card-img">' +
          '<img class="photo" src="' + esc(img) + '" alt="' + esc(p.name) + '" loading="lazy" width="367" height="342">' +
        '</div>' +
        '<div class="card-body">' +
          '<h3><span class="cat-card-name">' + esc(p.name) + '</span></h3>' +
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
        html += '<li><span>' + esc(p.name) + '</span><span class="cat-lista-pret">' + money(p.price) + '</span></li>';
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
        onSelect(this.getAttribute('data-cat'));
      });
    });
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
          html += '<h2 class="cat-sectiune-titlu reveal">' + esc(c.name) +
                  (c.description ? '<span>' + esc(c.description) + '</span>' : '') + '</h2>';
        }
        if (c.layout === 'list'){
          html += listHTML(items);
        } else {
          html += '<div class="cards cat-grid">' + items.map(cardHTML).join('') + '</div>';
        }
      });

      gridEl.innerHTML = html || '<p style="color:var(--ink-soft)">Nimic în această categorie.</p>';
      revealIn(gridEl);

      if (countEl) countEl.textContent = total + (total === 1 ? ' poziție' : ' poziții');
      if (descEl){
        var c = catId === 'all' ? null : catById(catId);
        descEl.textContent = c && c.description ? c.description : '';
      }
    }

    if (filtersEl) renderFilters(filtersEl, draw);
    draw('all');
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

  window.Catering = { mount: mount, mountTeaser: mountTeaser };
})();
