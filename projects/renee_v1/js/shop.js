/* Renée — Render magazin (grid, filtre, sortare, paginare, pagină produs). WP: la migrare → templates WooCommerce. */
(function(){

  function getParam(name){
    var params = new URLSearchParams(location.search);
    return params.get(name);
  }

  function money(n){
    return n + ' lei';
  }

  function catName(id){
    var cats = window.RENEE_CATEGORIES || [];
    for (var i = 0; i < cats.length; i++){
      if (cats[i].id === id) return cats[i].name;
    }
    return id;
  }

  function priceOf(p){
    return p.onSale && p.salePrice != null ? p.salePrice : p.price;
  }

  function hasVars(p){
    return !!(p.variations && p.variations.options && p.variations.options.length);
  }

  /* stele rating (SVG) — full/empty după valoare rotunjită la 0.5 */
  function starsHTML(rating){
    var r = Math.round((rating || 0) * 2) / 2, out = '';
    for (var i = 1; i <= 5; i++){
      var fill = r >= i ? 'full' : (r >= i - 0.5 ? 'half' : 'empty');
      out += '<span class="star star-' + fill + '">★</span>';
    }
    return '<span class="stars" aria-label="' + (rating || 0) + ' din 5">' + out + '</span>';
  }
  function ratingLine(p){
    if (!p.rating) return '';
    return '<span class="pc-rating">' + starsHTML(p.rating) +
      '<span class="pc-rcount">(' + (p.reviewCount || 0) + ')</span></span>';
  }

  var CART_ICON =
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M4 5h2l1.5 11.5a1.5 1.5 0 0 0 1.5 1.3h7.8a1.5 1.5 0 0 0 1.5-1.2L21 8H7"/>' +
      '<circle cx="10" cy="21" r="1"/><circle cx="18" cy="21" r="1"/>' +
    '</svg>';

  /* ---------- Card produs (reutilizat peste tot: magazin, home, similare) ---------- */
  function productCardHTML(p){
    var priceHTML;
    if (p.onSale && p.salePrice != null){
      priceHTML = '<span class="pc-old">' + money(p.price) + '</span><span class="pc-sale">' + money(p.salePrice) + '</span>';
    } else {
      priceHTML = money(p.price);
    }
    var badge = p.onSale ? '<span class="badge-sale">Reducere</span>'
              : (p.bestseller ? '<span class="badge-best">Bestseller</span>' : '');
    var img = (p.images && p.images[0]) || '';
    return (
      '<div class="product-card reveal">' +
        badge +
        '<a class="pc-link" href="produs.html?id=' + encodeURIComponent(p.id) + '">' +
          '<div class="pc-img"><img src="' + img + '" alt="' + p.name + '" loading="lazy"></div>' +
          '<div class="pc-body">' +
            '<h3 class="pc-name">' + p.name + '</h3>' +
            ratingLine(p) +
            '<div class="pc-price">' + priceHTML + '</div>' +
          '</div>' +
        '</a>' +
        '<button type="button" class="pc-add" data-id="' + p.id + '" aria-label="Adaugă în coș" title="Adaugă în coș">' +
          CART_ICON + '<span class="pc-add-done">✓</span>' +
        '</button>' +
      '</div>'
    );
  }

  function quickAdd(p){
    var withVar = hasVars(p);
    window.Cart.add({
      id: p.id,
      name: p.name,
      price: withVar ? p.variations.options[0].price : priceOf(p),
      variation: withVar ? p.variations.options[0].name : '',
      qty: 1,
      image: (p.images && p.images[0]) || ''
    });
  }

  function bindCardAdds(container){
    if (!container) return;
    container.querySelectorAll('.pc-add').forEach(function(btn){
      btn.addEventListener('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        var p = window.getProduct(btn.getAttribute('data-id'));
        if (!p) return;
        quickAdd(p);
        btn.classList.add('added');
        setTimeout(function(){ btn.classList.remove('added'); }, 1400);
      });
    });
  }

  /* observă elementele .reveal adăugate dinamic (grid/produs) pentru animația la scroll */
  function revealIn(container){
    if (window.reneeReveal){ window.reneeReveal(container); }
    else if (container){ container.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); }); }
  }

  /* ---------- Sortare ---------- */
  function sortProducts(list, sort){
    var arr = list.slice();
    if (sort === 'pret-asc'){ arr.sort(function(a,b){ return priceOf(a) - priceOf(b); }); }
    else if (sort === 'pret-desc'){ arr.sort(function(a,b){ return priceOf(b) - priceOf(a); }); }
    else if (sort === 'alfabetic'){ arr.sort(function(a,b){ return a.name.localeCompare(b.name, 'ro'); }); }
    else if (sort === 'noutati'){ arr.reverse(); }
    else if (sort === 'popularitate'){ arr.sort(function(a,b){ return (b.featured ? 1 : 0) - (a.featured ? 1 : 0); }); }
    /* 'recomandate' (default): featured întâi, restul în ordinea din catalog */
    else { arr.sort(function(a,b){ return (b.featured ? 1 : 0) - (a.featured ? 1 : 0); }); }
    return arr;
  }

  /* ---------- Grid simplu (home / similare) ---------- */
  function renderGrid(containerId, catId){
    var el = document.getElementById(containerId);
    if (!el) return;
    var products = window.getProductsByCategory(catId || 'all');
    var html = '';
    for (var i = 0; i < products.length; i++){ html += productCardHTML(products[i]); }
    el.innerHTML = html || '<p style="color:var(--ink-soft)">Niciun produs momentan.</p>';
    bindCardAdds(el);
    revealIn(el);
  }

  function renderProducts(containerId, products){
    var el = document.getElementById(containerId);
    if (!el) return;
    var html = '';
    for (var i = 0; i < products.length; i++){ html += productCardHTML(products[i]); }
    el.innerHTML = html;
    bindCardAdds(el);
    revealIn(el);
  }

  /* ---------- Filtre categorii ---------- */
  function renderFilters(containerId, onSelect){
    var el = document.getElementById(containerId);
    if (!el) return;
    var cats = window.RENEE_CATEGORIES || [];
    var html = '<button type="button" class="cat-filter active" data-cat="all">Toate</button>';
    for (var i = 0; i < cats.length; i++){
      html += '<button type="button" class="cat-filter" data-cat="' + cats[i].id + '">' + cats[i].name + '</button>';
    }
    el.innerHTML = html;

    var buttons = el.querySelectorAll('.cat-filter');
    buttons.forEach(function(btn){
      btn.addEventListener('click', function(){
        buttons.forEach(function(b){ b.classList.remove('active'); });
        this.classList.add('active');
        if (typeof onSelect === 'function') onSelect(this.getAttribute('data-cat'));
      });
    });
  }

  /* ---------- Paginare ---------- */
  function renderPagination(el, totalPages, current, onGo){
    if (!el) return;
    if (totalPages <= 1){ el.innerHTML = ''; return; }
    var html = '<button type="button" class="page-btn page-arrow" data-go="' + (current - 1) + '"' + (current === 1 ? ' disabled' : '') + ' aria-label="Pagina anterioară">‹</button>';
    for (var i = 1; i <= totalPages; i++){
      html += '<button type="button" class="page-btn' + (i === current ? ' active' : '') + '" data-go="' + i + '">' + i + '</button>';
    }
    html += '<button type="button" class="page-btn page-arrow" data-go="' + (current + 1) + '"' + (current === totalPages ? ' disabled' : '') + ' aria-label="Pagina următoare">›</button>';
    el.innerHTML = html;
    el.querySelectorAll('.page-btn').forEach(function(b){
      b.addEventListener('click', function(){
        if (b.disabled) return;
        var g = parseInt(b.getAttribute('data-go'), 10);
        if (g >= 1 && g <= totalPages) onGo(g);
      });
    });
  }

  /* ---------- Controller magazin: filtre + sortare + paginare ---------- */
  function mountShop(opts){
    var state = { cat: 'all', sort: 'recomandate', page: 1, pageSize: opts.pageSize || 8 };
    var gridEl = document.getElementById(opts.gridId);
    if (!gridEl) return;

    function draw(){
      var list = sortProducts(window.getProductsByCategory(state.cat), state.sort);
      var totalPages = Math.max(1, Math.ceil(list.length / state.pageSize));
      if (state.page > totalPages) state.page = totalPages;
      var start = (state.page - 1) * state.pageSize;
      var pageItems = list.slice(start, start + state.pageSize);

      var html = '';
      for (var i = 0; i < pageItems.length; i++){ html += productCardHTML(pageItems[i]); }
      gridEl.innerHTML = html || '<p style="color:var(--ink-soft)">Niciun produs în această categorie.</p>';
      bindCardAdds(gridEl);
      revealIn(gridEl);

      if (opts.countId){
        var c = document.getElementById(opts.countId);
        if (c) c.textContent = list.length + (list.length === 1 ? ' produs' : ' produse');
      }
      if (opts.paginationId){
        renderPagination(document.getElementById(opts.paginationId), totalPages, state.page, function(g){
          state.page = g;
          draw();
          if (gridEl.scrollIntoView) gridEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }
    }

    if (opts.filtersId){
      renderFilters(opts.filtersId, function(cat){ state.cat = cat; state.page = 1; draw(); });
    }
    if (opts.sortId){
      var s = document.getElementById(opts.sortId);
      if (s) s.addEventListener('change', function(){ state.sort = s.value; state.page = 1; draw(); });
    }
    draw();
  }

  /* ---------- Detalii / declarație nutrițională (DRAFT) ---------- */
  var DRAFT_NUTRITION = {
    cafea: [
      { label: 'Valoare energetică', value: '2 kcal' },
      { label: 'Grăsimi', value: '0 g' },
      { label: 'Glucide', value: '0 g' },
      { label: 'Proteine', value: '0,3 g' },
      { label: 'Cafeină', value: '~40 mg / ceașcă' }
    ],
    dulciuri: [
      { label: 'Valoare energetică', value: '385 kcal' },
      { label: 'Grăsimi', value: '18 g' },
      { label: '– din care saturate', value: '9 g' },
      { label: 'Glucide', value: '48 g' },
      { label: '– din care zaharuri', value: '30 g' },
      { label: 'Proteine', value: '6 g' }
    ],
    brunch: [
      { label: 'Valoare energetică', value: '210 kcal' },
      { label: 'Grăsimi', value: '12 g' },
      { label: 'Glucide', value: '16 g' },
      { label: 'Proteine', value: '11 g' },
      { label: 'Sare', value: '1,1 g' }
    ]
  };

  function accordion(title, body, open){
    return '<details class="pd-acc"' + (open ? ' open' : '') + '><summary>' + title + '</summary>' +
      '<div class="pd-acc-body">' + body + '</div></details>';
  }

  function productDetails(p){
    var isFood = p.category === 'cafea' || p.category === 'dulciuri' || p.category === 'brunch';
    var out = '';

    if (isFood){
      var nut = p.nutrition || DRAFT_NUTRITION[p.category] || DRAFT_NUTRITION.dulciuri;
      var table = '<table class="pd-nutri"><thead><tr><th>La 100g / porție</th><th>Valoare</th></tr></thead><tbody>';
      for (var i = 0; i < nut.length; i++){
        table += '<tr><td>' + nut[i].label + '</td><td>' + nut[i].value + '</td></tr>';
      }
      table += '</tbody></table>';
      out += accordion('Declarație nutrițională', table +
        '<p class="pd-note">Valori medii orientative. <!-- DRAFT: de confirmat cu producătorul --></p>', true);
      out += accordion('Ingrediente & alergeni',
        '<p>' + (p.ingredients || 'Ingrediente naturale, selectate cu grijă, fără aditivi artificiali.') + '</p>' +
        '<p class="pd-note">Poate conține urme de gluten, lactoză și fructe cu coajă lemnoasă. <!-- DRAFT --></p>', false);
    } else {
      out += accordion('Detalii produs',
        '<p>' + (p.material || 'Material premium cu imprimeu Renée. Ediție limitată, realizată local.') + '</p>' +
        '<p class="pd-note">Specificații complete de confirmat. <!-- DRAFT --></p>', true);
    }
    out += accordion('Livrare & ridicare',
      '<p>Livrare în Chișinău — 40 lei, <strong>gratuită la comenzi peste 500 lei</strong>. ' +
      'Ridicare gratuită din oricare locație Renée.</p>', false);
    return out;
  }

  /* ---------- „Se cumpără des împreună" (bundle dinamic) ---------- */
  function bundleItems(p){
    /* produsul curent + 2 complementare din alte categorii (bestsellers) */
    var others = window.RENEE_PRODUCTS.filter(function(x){
      return x.id !== p.id && x.category !== p.category && x.category !== 'cadouri';
    });
    others.sort(function(a,b){ return (b.bestseller?1:0) - (a.bestseller?1:0); });
    return [p, others[0], others[1]].filter(Boolean);
  }
  function bundleHTML(p){
    var items = bundleItems(p);
    if (items.length < 2) return '';
    var total = 0, thumbs = '';
    for (var i = 0; i < items.length; i++){
      total += priceOf(items[i]);
      thumbs += '<div class="bundle-item">' +
        '<img src="' + ((items[i].images && items[i].images[0]) || '') + '" alt="' + items[i].name + '">' +
        '<span>' + items[i].name + '</span></div>' +
        (i < items.length - 1 ? '<span class="bundle-plus">+</span>' : '');
    }
    var deal = Math.round(total * 0.9); /* -10% pe pachet */
    var label = 'Adaugă toate — ' + money(deal);
    return (
      '<section class="pd-bundle reveal">' +
        '<h2>Se cumpără des <em>împreună</em></h2>' +
        '<div class="bundle-row">' + thumbs + '</div>' +
        '<div class="bundle-cta">' +
          '<div class="bundle-price"><span class="bundle-old">' + money(total) + '</span>' +
            '<span class="bundle-new">' + money(deal) + '</span>' +
            '<span class="bundle-save">Economisești ' + money(total - deal) + '</span></div>' +
          '<button type="button" class="btn-add" id="bundleAdd" data-label="' + label + '">' + label + '</button>' +
        '</div>' +
      '</section>'
    );
  }

  /* ---------- Recenzii ---------- */
  function reviewsHTML(p){
    if (!p.rating) return '';
    var revs = (window.getReviewsFor ? window.getReviewsFor(p) : []);
    var list = '';
    for (var i = 0; i < revs.length; i++){
      var r = revs[i];
      list += '<article class="review reveal">' +
        '<div class="review-head"><span class="review-name">' + r.name + '</span>' +
        starsHTML(r.rating) + '<span class="review-date">' + r.date + '</span></div>' +
        '<p class="review-text">' + r.text + '</p></article>';
    }
    return (
      '<section class="pd-reviews" id="pdReviews">' +
        '<div class="reviews-summary reveal">' +
          '<div class="rs-score"><span class="rs-num">' + p.rating + '</span>' + starsHTML(p.rating) +
            '<span class="rs-count">' + (p.reviewCount || 0) + ' recenzii</span></div>' +
          '<p class="rs-note">Recenzii demonstrative. <!-- DRAFT: recenzii reale la migrarea WooCommerce --></p>' +
        '</div>' +
        '<div class="reviews-list">' + list + '</div>' +
      '</section>'
    );
  }

  /* ---------- Sticky add-to-cart ---------- */
  function mountStickyBar(p){
    var old = document.getElementById('stickyBar');
    if (old) old.parentNode.removeChild(old);
    var bar = document.createElement('div');
    bar.id = 'stickyBar';
    bar.className = 'sticky-bar';
    bar.innerHTML =
      '<div class="wrap sticky-inner">' +
        '<div class="sticky-info"><img src="' + ((p.images && p.images[0]) || '') + '" alt="">' +
          '<div><span class="sticky-name">' + p.name + '</span>' +
          '<span class="sticky-price" id="stickyPrice"></span></div></div>' +
        '<button type="button" class="btn-add" id="stickyAdd">Adaugă în coș</button>' +
      '</div>';
    document.body.appendChild(bar);
    /* apare după ce butonul principal iese din viewport */
    function onScroll(){
      var main = document.getElementById('pdAdd');
      if (!main) return;
      var below = main.getBoundingClientRect().bottom < 0;
      bar.classList.toggle('show', below);
    }
    window.addEventListener('scroll', onScroll, {passive:true});
    onScroll();
    document.getElementById('stickyAdd').addEventListener('click', function(){
      var mainAdd = document.getElementById('pdAdd');
      if (mainAdd) mainAdd.click();
    });
  }

  /* ---------- Pagină produs ---------- */
  function renderProductDetail(containerId, id){
    var el = document.getElementById(containerId);
    if (!el) return;
    var productId = id || getParam('id');
    var p = productId ? window.getProduct(productId) : null;

    if (!p){
      el.innerHTML =
        '<div class="pd-notfound">' +
          '<h1>Produsul nu a fost găsit</h1>' +
          '<p style="color:var(--ink-soft);margin-bottom:26px">Ne pare rău, produsul căutat nu există sau a fost retras din magazin.</p>' +
          '<a class="btn-primary" href="magazin.html">Înapoi la magazin</a>' +
        '</div>';
      return;
    }

    var images = (p.images && p.images.length) ? p.images : [''];
    var mainImg = images[0];
    var withVar = hasVars(p);
    var currentPrice = withVar ? p.variations.options[0].price : priceOf(p);

    var priceHTML;
    if (!withVar && p.onSale && p.salePrice != null){
      priceHTML = '<span class="pc-old">' + money(p.price) + '</span><span class="pc-sale">' + money(p.salePrice) + '</span>';
    } else {
      priceHTML = money(currentPrice);
    }

    var thumbsHTML = '';
    if (images.length > 1){
      thumbsHTML = '<div class="pd-thumbs">';
      for (var t = 0; t < images.length; t++){
        thumbsHTML += '<button type="button" class="pd-thumb' + (t === 0 ? ' active' : '') + '" data-img="' + images[t] + '">' +
          '<img src="' + images[t] + '" alt="' + p.name + ' ' + (t + 1) + '" loading="lazy"></button>';
      }
      thumbsHTML += '</div>';
    }

    var variationHTML = '';
    if (withVar){
      variationHTML += '<div class="pd-variation"><label for="pdVariation">' + p.variations.label + '</label>';
      variationHTML += '<select id="pdVariation">';
      for (var v = 0; v < p.variations.options.length; v++){
        var opt = p.variations.options[v];
        variationHTML += '<option value="' + opt.name + '" data-price="' + opt.price + '">' + opt.name + ' — ' + money(opt.price) + '</option>';
      }
      variationHTML += '</select></div>';
    }

    var chips = '<div class="pd-chips">' +
      '<span class="pd-chip">' + catName(p.category) + '</span>' +
      (p.stock === 'instock' || !p.stock ? '<span class="pd-chip pd-chip-ok">În stoc</span>' : '<span class="pd-chip">Stoc epuizat</span>') +
      '<span class="pd-chip">Livrare gratuită peste 500 lei</span>' +
    '</div>';

    el.innerHTML =
      '<nav class="pd-crumb"><a href="magazin.html">Magazin</a><span>/</span><a href="magazin.html">' + catName(p.category) + '</a><span>/</span><em>' + p.name + '</em></nav>' +
      '<div class="pd-grid">' +
        '<div class="pd-gallery reveal">' +
          '<div class="pd-main"><img id="pdMainImg" src="' + mainImg + '" alt="' + p.name + '"></div>' +
          thumbsHTML +
        '</div>' +
        '<div class="pd-info reveal reveal-d1">' +
          '<p class="eyebrow">' + catName(p.category) + '</p>' +
          '<h1>' + p.name + '</h1>' +
          (p.rating ? '<a href="#pdReviews" class="pd-rating">' + starsHTML(p.rating) +
            '<span>' + p.rating + ' · ' + (p.reviewCount || 0) + ' recenzii</span></a>' : '') +
          '<div class="pd-price" id="pdPrice">' + priceHTML + '</div>' +
          '<p class="pd-short">' + p.shortDesc + '</p>' +
          chips +
          variationHTML +
          '<div class="pd-row">' +
            '<div class="qty-stepper">' +
              '<button type="button" id="pdQtyMinus" aria-label="Scade cantitatea">−</button>' +
              '<input type="text" id="pdQty" value="1" inputmode="numeric" aria-label="Cantitate">' +
              '<button type="button" id="pdQtyPlus" aria-label="Crește cantitatea">+</button>' +
            '</div>' +
            '<button type="button" class="btn-add" id="pdAdd">Adaugă în coș</button>' +
          '</div>' +
          '<span class="pd-added" id="pdAdded">Adăugat în coș ✓</span>' +
          '<div class="pd-desc"><p>' + p.description + '</p></div>' +
          '<div class="pd-accordions">' + productDetails(p) + '</div>' +
        '</div>' +
      '</div>' +
      bundleHTML(p) +
      reviewsHTML(p);

    /* sticky add-to-cart (apare la scroll) */
    mountStickyBar(p);

    revealIn(el);

    /* --- bundle „se cumpără des împreună" --- */
    var bundleBtn = document.getElementById('bundleAdd');
    if (bundleBtn){
      bundleBtn.addEventListener('click', function(){
        bundleItems(p).forEach(function(bp){ quickAdd(bp); });
        bundleBtn.textContent = 'Adăugate în coș ✓';
        setTimeout(function(){ bundleBtn.textContent = bundleBtn.getAttribute('data-label'); }, 1600);
      });
    }

    var qtyInput = document.getElementById('pdQty');
    var minusBtn = document.getElementById('pdQtyMinus');
    var plusBtn = document.getElementById('pdQtyPlus');
    var addBtn = document.getElementById('pdAdd');
    var addedMsg = document.getElementById('pdAdded');
    var priceEl = document.getElementById('pdPrice');
    var variationSelect = document.getElementById('pdVariation');
    var mainImgEl = document.getElementById('pdMainImg');

    el.querySelectorAll('.pd-thumb').forEach(function(th){
      th.addEventListener('click', function(){
        el.querySelectorAll('.pd-thumb').forEach(function(o){ o.classList.remove('active'); });
        th.classList.add('active');
        mainImgEl.src = th.getAttribute('data-img');
      });
    });

    function clampQty(){
      var val = parseInt(qtyInput.value, 10);
      if (isNaN(val) || val < 1) val = 1;
      qtyInput.value = val;
      return val;
    }
    minusBtn.addEventListener('click', function(){ qtyInput.value = Math.max(1, clampQty() - 1); });
    plusBtn.addEventListener('click', function(){ qtyInput.value = clampQty() + 1; });
    qtyInput.addEventListener('change', clampQty);

    function currentVariationPrice(){
      if (!withVar) return priceOf(p);
      return p.variations.options[variationSelect.selectedIndex].price;
    }
    var stickyPriceEl = document.getElementById('stickyPrice');
    function syncStickyPrice(){ if (stickyPriceEl) stickyPriceEl.textContent = money(currentVariationPrice()); }
    syncStickyPrice();

    if (variationSelect){
      variationSelect.addEventListener('change', function(){
        priceEl.innerHTML = money(currentVariationPrice());
        syncStickyPrice();
        addedMsg.classList.remove('show');
      });
    }

    addBtn.addEventListener('click', function(){
      var qty = clampQty();
      var variationName = withVar ? p.variations.options[variationSelect.selectedIndex].name : '';
      window.Cart.add({
        id: p.id, name: p.name, price: currentVariationPrice(),
        variation: variationName, qty: qty, image: mainImg
      });
      addedMsg.classList.add('show');
      setTimeout(function(){ addedMsg.classList.remove('show'); }, 2200);
    });
  }

  /* ---------- Coș ---------- */
  function cartLineHTML(item){
    var lineSubtotal = item.price * item.qty;
    return (
      '<div class="cart-line" data-id="' + item.id + '" data-variation="' + item.variation + '">' +
        '<img src="' + item.image + '" alt="' + item.name + '">' +
        '<div class="cl-info">' +
          '<div class="cl-name">' + item.name + '</div>' +
          (item.variation ? '<div class="cl-variation">' + item.variation + '</div>' : '') +
        '</div>' +
        '<div class="cl-price">' + money(item.price) + '</div>' +
        '<div class="qty-stepper">' +
          '<button type="button" class="cl-minus" aria-label="Scade cantitatea">−</button>' +
          '<input type="text" class="cl-qty" value="' + item.qty + '" inputmode="numeric" aria-label="Cantitate">' +
          '<button type="button" class="cl-plus" aria-label="Crește cantitatea">+</button>' +
        '</div>' +
        '<div class="cl-subtotal">' + money(lineSubtotal) + '</div>' +
        '<button type="button" class="cl-remove" aria-label="Șterge">Șterge</button>' +
      '</div>'
    );
  }

  /* bară progres livrare gratuită (lever AOV) */
  function shipBarHTML(subtotal, threshold){
    if (subtotal >= threshold){
      return '<div class="ship-bar ship-bar-done">' +
        '<span class="ship-msg">🎉 Ai livrare gratuită!</span>' +
        '<div class="ship-track"><div class="ship-fill" style="width:100%"></div></div></div>';
    }
    var left = threshold - subtotal;
    var pct = Math.max(4, Math.round(subtotal / threshold * 100));
    return '<div class="ship-bar">' +
      '<span class="ship-msg">Mai adaugi <strong>' + money(left) + '</strong> și livrarea e <strong>gratuită</strong></span>' +
      '<div class="ship-track"><div class="ship-fill" style="width:' + pct + '%"></div></div></div>';
  }

  /* upsell coș — „completează comanda" cu produse complementare */
  function cartUpsellHTML(){
    var items = window.Cart.items();
    var inCart = {};
    items.forEach(function(it){ inCart[it.id] = true; });
    var pool = (window.getBestsellers ? window.getBestsellers() : window.RENEE_PRODUCTS)
      .filter(function(p){ return !inCart[p.id] && p.category !== 'cadouri'; })
      .slice(0, 3);
    if (!pool.length) return '';
    var cards = '';
    pool.forEach(function(p){
      cards += '<div class="upsell-item">' +
        '<img src="' + ((p.images && p.images[0]) || '') + '" alt="' + p.name + '">' +
        '<div class="upsell-info"><span class="upsell-name">' + p.name + '</span>' +
        '<span class="upsell-price">' + money(priceOf(p)) + '</span></div>' +
        '<button type="button" class="upsell-add" data-id="' + p.id + '" aria-label="Adaugă">+</button>' +
      '</div>';
    });
    return '<div class="cart-upsell"><h3>Completează comanda</h3><div class="upsell-list">' + cards + '</div></div>';
  }

  function cartSummaryHTML(){
    var subtotal = window.Cart.subtotal();
    var shipping = window.Cart.shipping('delivery');
    var total = subtotal + shipping;
    var threshold = window.Cart.FREE_THRESHOLD;
    var html = shipBarHTML(subtotal, threshold);
    html += '<div class="cs-row"><span>Subtotal</span><span>' + money(subtotal) + '</span></div>';
    html += '<div class="cs-row"><span>Livrare</span><span>' + (shipping === 0 ? 'Gratis' : money(shipping)) + '</span></div>';
    html += '<div class="cs-row cs-total"><span>Total</span><span>' + money(total) + '</span></div>';
    return html;
  }

  var cartRenderBound = false;

  function renderCart(containerId, summaryId){
    var tableEl = document.getElementById(containerId);
    var summaryEl = summaryId ? document.getElementById(summaryId) : null;
    if (!tableEl) return;
    var items = window.Cart.items();

    if (!items.length){
      tableEl.innerHTML =
        '<div class="cart-empty">' +
          '<p>Coșul tău e gol momentan.</p>' +
          '<a href="magazin.html" class="btn-primary">Vezi magazinul</a>' +
        '</div>';
      if (summaryEl) summaryEl.innerHTML = '';
      var toCheckout = document.getElementById('toCheckout');
      if (toCheckout) toCheckout.style.display = 'none';
      return;
    }

    var html = '';
    for (var i = 0; i < items.length; i++){ html += cartLineHTML(items[i]); }
    html += cartUpsellHTML();
    tableEl.innerHTML = html;
    if (summaryEl) summaryEl.innerHTML = cartSummaryHTML();

    tableEl.querySelectorAll('.upsell-add').forEach(function(btn){
      btn.addEventListener('click', function(){
        var p = window.getProduct(btn.getAttribute('data-id'));
        if (p) quickAdd(p);
      });
    });

    var toCheckoutBtn = document.getElementById('toCheckout');
    if (toCheckoutBtn) toCheckoutBtn.style.display = '';

    tableEl.querySelectorAll('.cart-line').forEach(function(line){
      var id = line.getAttribute('data-id');
      var variation = line.getAttribute('data-variation');
      var qtyInput = line.querySelector('.cl-qty');
      var minusBtn = line.querySelector('.cl-minus');
      var plusBtn = line.querySelector('.cl-plus');
      var removeBtn = line.querySelector('.cl-remove');

      function clampQty(){
        var val = parseInt(qtyInput.value, 10);
        if (isNaN(val) || val < 1) val = 1;
        return val;
      }
      minusBtn.addEventListener('click', function(){ window.Cart.setQty(id, variation, Math.max(1, clampQty() - 1)); });
      plusBtn.addEventListener('click', function(){ window.Cart.setQty(id, variation, clampQty() + 1); });
      qtyInput.addEventListener('change', function(){ window.Cart.setQty(id, variation, clampQty()); });
      removeBtn.addEventListener('click', function(){ window.Cart.remove(id, variation); });
    });

    if (!cartRenderBound){
      cartRenderBound = true;
      window.Cart.onChange(function(){ renderCart(containerId, summaryId); });
    }
  }

  window.Shop = {
    renderGrid: renderGrid,
    renderProducts: renderProducts,
    renderFilters: renderFilters,
    mountShop: mountShop,
    renderProductDetail: renderProductDetail,
    renderCart: renderCart,
    productCardHTML: productCardHTML,
    bindCardAdds: bindCardAdds,
    money: money
  };

})();
