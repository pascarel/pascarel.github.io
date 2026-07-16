/* Renée V2 — interacțiuni homepage (concept). Refolosește window.Cart + catalogul din ../ */
(function(){
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Header la scroll */
  var header = document.getElementById('header');
  function onScroll(){ header.classList.toggle('scrolled', window.scrollY > 40); }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  /* Reveal — IntersectionObserver + fallback robust */
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, {threshold:.15, rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });
  function revealInView(){
    var vh = window.innerHeight || document.documentElement.clientHeight || 0;
    var all = document.querySelectorAll('.reveal:not(.in)');
    if (!vh){ all.forEach(function(el){ el.classList.add('in'); }); return; }
    all.forEach(function(el){
      if (el.getBoundingClientRect().top < vh * 0.92) el.classList.add('in');
    });
  }
  window.addEventListener('load', revealInView);
  window.addEventListener('scroll', revealInView, {passive:true});
  window.addEventListener('resize', revealInView, {passive:true});
  revealInView();

  /* Marquee — umple minim 2x lățimea, apoi dublează pt buclă perfectă (ca la v1) */
  var track = document.getElementById('marqueeTrack');
  if (track){
    var base = track.innerHTML, guard = 0;
    while (track.scrollWidth < window.innerWidth * 1.2 && guard < 20){ track.innerHTML += base; guard++; }
    track.innerHTML += track.innerHTML;
    track.style.animationDuration = (track.scrollWidth / 2 / 90).toFixed(1) + 's';
  }

  /* Parallax pe imagini la scroll (fundal hero + rezervare) */
  if (!reduced){
    var pxEls = [];
    var hb = document.querySelector('.hero-bg'); if (hb) pxEls.push({ el:hb, speed:0.18 });
    var rb = document.querySelector('.reserve-bg'); if (rb) pxEls.push({ el:rb, speed:0.14 });
    var ticking = false;
    function parallax(){
      var vh = window.innerHeight;
      pxEls.forEach(function(p){
        var r = p.el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        var offset = ((r.top + r.height / 2) - vh / 2) * -p.speed;
        p.el.style.transform = 'translate3d(0,' + offset.toFixed(1) + 'px,0)';
      });
      ticking = false;
    }
    window.addEventListener('scroll', function(){
      if (!ticking){ requestAnimationFrame(parallax); ticking = true; }
    }, {passive:true});
    window.addEventListener('resize', parallax, {passive:true});
    parallax();
  }

  /* Meniu mobil */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  if (burger && nav){
    burger.addEventListener('click', function(){
      var open = !nav.classList.contains('open');
      nav.classList.toggle('open', open);
      burger.textContent = open ? 'Închide' : 'Meniu';
      document.body.style.overflow = open ? 'hidden' : '';
    });
    nav.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        nav.classList.remove('open'); burger.textContent = 'Meniu'; document.body.style.overflow = '';
      });
    });
  }

  /* Stele */
  function starsHTML(r){
    var v = Math.round((r || 0)), out = '';
    for (var i = 1; i <= 5; i++){ out += '<span class="' + (i <= v ? '' : 'off') + '">★</span>'; }
    return '<span class="stars">' + out + '</span>';
  }

  /* Bestsellers din catalogul V1 (../data/products.js) */
  function money(n){ return n + ' lei'; }
  function priceOf(p){ return p.onSale && p.salePrice != null ? p.salePrice : p.price; }

  var grid = document.getElementById('v2Bestsellers');
  if (grid && window.RENEE_PRODUCTS){
    var best = (window.getBestsellers ? window.getBestsellers() : window.getFeatured()).slice(0, 4);
    var html = '';
    best.forEach(function(p){
      var img = (p.images && p.images[0]) || '';
      var priceHTML = (p.onSale && p.salePrice != null)
        ? '<span class="pc-old">' + money(p.price) + '</span>' + money(p.salePrice)
        : money(p.price);
      var badge = p.onSale ? '<span class="badge badge-sale">Reducere</span>'
                : (p.bestseller ? '<span class="badge">Bestseller</span>' : '');
      html += '<div class="product-card reveal">' +
        '<div class="pc-img">' + badge + '<a href="../produs.html?id=' + encodeURIComponent(p.id) + '"><img src="' + img + '" alt="' + p.name + '" loading="lazy"></a></div>' +
        '<h3 class="pc-name"><a href="../produs.html?id=' + encodeURIComponent(p.id) + '">' + p.name + '</a></h3>' +
        '<div class="pc-rating">' + starsHTML(p.rating) + '<span class="pc-rcount">(' + (p.reviewCount || 0) + ')</span></div>' +
        '<div class="pc-price">' + priceHTML + '</div>' +
        '<button type="button" class="pc-add" data-id="' + p.id + '">Adaugă în coș</button>' +
      '</div>';
    });
    grid.innerHTML = html;
    revealInView();

    grid.querySelectorAll('.pc-add').forEach(function(btn){
      btn.addEventListener('click', function(){
        var p = window.getProduct(btn.getAttribute('data-id'));
        if (!p || !window.Cart) return;
        var withVar = p.variations && p.variations.options && p.variations.options.length;
        window.Cart.add({
          id: p.id, name: p.name,
          price: withVar ? p.variations.options[0].price : priceOf(p),
          variation: withVar ? p.variations.options[0].name : '',
          qty: 1, image: (p.images && p.images[0]) || ''
        });
        btn.classList.add('added');
        btn.textContent = 'Adăugat ✓';
        setTimeout(function(){ btn.classList.remove('added'); btn.textContent = 'Adaugă în coș'; }, 1600);
      });
    });
  }

  /* Newsletter — simulat */
  var nlForm = document.getElementById('newsletterForm');
  if (nlForm){
    nlForm.addEventListener('submit', function(e){
      e.preventDefault();
      var email = document.getElementById('nlEmail');
      if (!email.value || email.value.indexOf('@') < 1){ email.focus(); return; }
      document.getElementById('nlOk').classList.add('show');
      nlForm.reset();
    });
  }

  /* Video hero — respectă reduced motion */
  var video = document.querySelector('.hero-bg video');
  if (video && reduced){ video.removeAttribute('autoplay'); video.pause(); }

  /* Video filosofie — buton play/pauză + reduced motion */
  var philoBox = document.querySelector('.philo-video');
  if (philoBox){
    var pVid = philoBox.querySelector('video');
    var pBtn = philoBox.querySelector('.philo-play');
    function syncPhilo(){ philoBox.classList.toggle('playing', !pVid.paused && !pVid.ended); }
    if (reduced){ pVid.removeAttribute('autoplay'); pVid.pause(); }
    if (pBtn){
      pBtn.addEventListener('click', function(){
        if (pVid.paused){ pVid.play(); } else { pVid.pause(); }
      });
    }
    pVid.addEventListener('play', syncPhilo);
    pVid.addEventListener('pause', syncPhilo);
    pVid.addEventListener('ended', syncPhilo);
    syncPhilo();
  }

  /* ================= MODAL REZERVARE (portat din v1) ================= */
  var modal = document.getElementById('rezModal');
  if (modal){
    var lastFocus = null;
    function closeMobileNav(){
      if (nav){ nav.classList.remove('open'); }
      if (burger){ burger.textContent = 'Meniu'; }
      document.body.style.overflow = '';
    }
    function openModal(){
      lastFocus = document.activeElement;
      modal.hidden = false;
      modal.classList.add('open');
      document.body.classList.add('no-scroll');
      var first = modal.querySelector('input[type="text"]');
      if (first) first.focus();
    }
    function closeModal(){
      modal.classList.remove('open');
      modal.hidden = true;
      document.body.classList.remove('no-scroll');
      closeAllPickers();
      if (lastFocus) lastFocus.focus();
    }
    document.querySelectorAll('[data-rez]').forEach(function(el){
      el.addEventListener('click', function(e){ e.preventDefault(); closeMobileNav(); openModal(); });
    });
    document.getElementById('rezClose').addEventListener('click', closeModal);
    modal.querySelector('.modal-backdrop').addEventListener('click', closeModal);
    document.addEventListener('keydown', function(e){
      if (e.key !== 'Escape' || modal.hidden) return;
      if (document.querySelector('.picker.open')){ closeAllPickers(); }
      else { closeModal(); }
    });

    /* ---- pickere custom ---- */
    var pickers = Array.prototype.slice.call(modal.querySelectorAll('.picker'));
    function closeAllPickers(except){
      pickers.forEach(function(p){
        if (p !== except){
          p.classList.remove('open');
          p.querySelector('.picker-btn').setAttribute('aria-expanded', 'false');
        }
      });
    }
    function togglePicker(p){
      var willOpen = !p.classList.contains('open');
      closeAllPickers(p);
      p.classList.toggle('open', willOpen);
      p.querySelector('.picker-btn').setAttribute('aria-expanded', willOpen);
      if (willOpen){
        var pop = p.querySelector('.pop');
        p.classList.remove('drop-up');
        var r = p.getBoundingClientRect();
        if (r.bottom + pop.offsetHeight + 20 > window.innerHeight && r.top - pop.offsetHeight - 20 > 0){
          p.classList.add('drop-up');
        }
      }
    }
    pickers.forEach(function(p){
      p.querySelector('.picker-btn').addEventListener('click', function(){ togglePicker(p); });
    });
    document.addEventListener('click', function(e){
      if (!e.target.closest('.picker')) closeAllPickers();
    });
    function setPickerValue(p, text, value){
      var span = p.querySelector('.picker-val');
      span.textContent = text;
      span.classList.remove('val-empty');
      p.querySelector('input[type="hidden"]').value = (value !== undefined ? value : text);
      clearErr(p);
    }
    function initList(p){
      var list = p.querySelector('.pop-list');
      list.addEventListener('click', function(e){
        var li = e.target.closest('li');
        if (!li) return;
        list.querySelectorAll('li').forEach(function(o){ o.setAttribute('aria-selected', 'false'); });
        li.setAttribute('aria-selected', 'true');
        setPickerValue(p, li.textContent, li.dataset.value);
        closeAllPickers();
      });
    }
    var pickPers = document.getElementById('pickPers');
    initList(pickPers);
    var pickLocatie = document.getElementById('pickLocatie');
    if (pickLocatie) initList(pickLocatie);

    /* ore 08:00 – 21:30 */
    var pickOra = document.getElementById('pickOra');
    (function(){
      var list = pickOra.querySelector('.pop-list');
      for (var h = 8; h <= 21; h++){
        for (var m = 0; m < 60; m += 30){
          if (h === 21 && m > 30) break;
          var t = (h < 10 ? '0' : '') + h + ':' + (m === 0 ? '00' : m);
          var li = document.createElement('li');
          li.setAttribute('role', 'option'); li.setAttribute('aria-selected', 'false');
          li.textContent = t; list.appendChild(li);
        }
      }
      initList(pickOra);
      var hint = pickOra.querySelector('.pop-hint');
      function updateHint(){
        var noScroll = list.scrollWidth <= list.clientWidth + 8;
        var atEnd = list.scrollLeft + list.clientWidth >= list.scrollWidth - 8;
        hint.classList.toggle('gone', noScroll);
        hint.classList.toggle('hide', atEnd);
      }
      list.addEventListener('scroll', updateHint, {passive:true});
      pickOra.querySelector('.picker-btn').addEventListener('click', updateHint);
      window.addEventListener('resize', updateHint);
    })();

    /* calendar dată */
    var pickData = document.getElementById('pickData');
    (function(){
      var MONTHS = ['ianuarie','februarie','martie','aprilie','mai','iunie','iulie','august','septembrie','octombrie','noiembrie','decembrie'];
      var titleEl = pickData.querySelector('.cal-title');
      var grid = pickData.querySelector('.cal-grid');
      var prevBtn = pickData.querySelector('.cal-prev');
      var nextBtn = pickData.querySelector('.cal-next');
      var today = new Date(); today.setHours(0,0,0,0);
      var view = new Date(today.getFullYear(), today.getMonth(), 1);
      var selected = null;
      function iso(d){
        return d.getFullYear() + '-' + ('0' + (d.getMonth()+1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
      }
      function render(){
        titleEl.textContent = MONTHS[view.getMonth()] + ' ' + view.getFullYear();
        grid.innerHTML = '';
        var firstDow = (new Date(view.getFullYear(), view.getMonth(), 1).getDay() + 6) % 7;
        var daysIn = new Date(view.getFullYear(), view.getMonth()+1, 0).getDate();
        for (var i = 0; i < firstDow; i++){ grid.appendChild(document.createElement('span')); }
        for (var d = 1; d <= daysIn; d++){
          var date = new Date(view.getFullYear(), view.getMonth(), d);
          var b = document.createElement('button');
          b.type = 'button'; b.textContent = d;
          if (date < today) b.disabled = true;
          if (date.getTime() === today.getTime()) b.classList.add('today');
          if (selected && date.getTime() === selected.getTime()) b.classList.add('sel');
          (function(date){
            b.addEventListener('click', function(){
              selected = date;
              setPickerValue(pickData, date.getDate() + ' ' + MONTHS[date.getMonth()] + ' ' + date.getFullYear(), iso(date));
              closeAllPickers(); render();
            });
          })(date);
          grid.appendChild(b);
        }
        prevBtn.disabled = view.getFullYear() === today.getFullYear() && view.getMonth() === today.getMonth();
      }
      prevBtn.addEventListener('click', function(){ view = new Date(view.getFullYear(), view.getMonth()-1, 1); render(); });
      nextBtn.addEventListener('click', function(){ view = new Date(view.getFullYear(), view.getMonth()+1, 1); render(); });
      render();
    })();

    /* ---- validare + trimitere (simulată) ---- */
    var form = document.getElementById('rezForm');
    var okMsg = document.getElementById('formOk');
    var fullMsg = document.getElementById('formFull');
    var submitBtn = form.querySelector('.btn-light');
    var inputNume = document.getElementById('f-nume');
    var inputTel = document.getElementById('f-tel');
    var DEMO_FULL_TIMES = ['12:00', '12:30'];
    function setErr(field, msg){
      field.classList.add('err');
      var m = field.querySelector('.field-msg');
      if (!m){ m = document.createElement('span'); m.className = 'field-msg'; field.appendChild(m); }
      m.textContent = msg;
    }
    function clearErr(field){
      field.classList.remove('err');
      var m = field.querySelector('.field-msg');
      if (m) m.remove();
    }
    [inputNume, inputTel].forEach(function(inp){
      inp.addEventListener('input', function(){ clearErr(inp.closest('.field')); });
    });
    function validate(){
      var valid = true;
      if (!inputNume.value.trim()){ setErr(inputNume.closest('.field'), 'Spune-ne cum te cheamă'); valid = false; }
      var tel = inputTel.value.trim();
      if (!tel){ setErr(inputTel.closest('.field'), 'Avem nevoie de un număr pentru confirmare'); valid = false; }
      else if (!/^\+?[0-9][0-9\s\-()]{5,}$/.test(tel)){ setErr(inputTel.closest('.field'), 'Numărul nu pare valid'); valid = false; }
      if (!pickPers.querySelector('input[type="hidden"]').value){ setErr(pickPers, 'Alege numărul de persoane'); valid = false; }
      if (!pickData.querySelector('input[type="hidden"]').value){ setErr(pickData, 'Alege data rezervării'); valid = false; }
      if (!pickOra.querySelector('input[type="hidden"]').value){ setErr(pickOra, 'Alege ora rezervării'); valid = false; }
      return valid;
    }
    form.addEventListener('submit', function(e){
      e.preventDefault();
      okMsg.classList.remove('show'); fullMsg.classList.remove('show');
      if (!validate()){
        var firstErr = form.querySelector('.field.err');
        var focusable = firstErr.querySelector('input:not([type="hidden"]), .picker-btn');
        if (focusable) focusable.focus();
        return;
      }
      submitBtn.disabled = true; submitBtn.textContent = 'Se trimite…';
      setTimeout(function(){
        var ora = pickOra.querySelector('input[type="hidden"]').value;
        if (DEMO_FULL_TIMES.indexOf(ora) !== -1){
          fullMsg.classList.add('show');
          submitBtn.disabled = false; submitBtn.textContent = 'Trimite rezervarea';
        } else {
          okMsg.classList.add('show'); submitBtn.textContent = 'Trimis ✓';
        }
      }, 1200);
    });
  }
})();
