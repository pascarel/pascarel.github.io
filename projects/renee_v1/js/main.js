(function(){
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Hero — litere animate (doar pe paginile cu hero) */
  var title = document.getElementById('heroTitle');
  if (title) {
    var text = title.textContent;
    title.textContent = '';
    var word = document.createElement('span');
    word.className = 'word';
    for (var i = 0; i < text.length; i++) {
      var l = document.createElement('span');
      l.className = 'letter';
      l.textContent = text[i];
      l.style.animationDelay = (0.15 + i * 0.07) + 's';
      word.appendChild(l);
    }
    title.appendChild(word);
  }

  /* ================= ELEMENT ACTIV ÎN MENIU =================
     Marcat din JS, nu manual în cele 13 pagini — altfel se dezsincronizează
     la fiecare pagină nouă. Subpaginile moştenesc părintele:
     produs → Meniu, articol → Blog. */
  (function(){
    var PARINTE = {
      'produs.html':  'meniu.html',
      'articol.html': 'blog.html',
      'cos.html':     'meniu.html',
      'checkout.html':'meniu.html',
      'comanda-confirmata.html': 'meniu.html'
    };
    var fisier = location.pathname.split('/').pop() || 'index.html';
    var activ = PARINTE[fisier] || fisier;

    /* doar linkurile de pagină: fără butonul Rezervări (care are href
       index.html#vizita şi s-ar activa pe home), fără Coş, fără social */
    document.querySelectorAll('#nav > a:not(.btn-rez):not(.cart-link)').forEach(function(a){
      var href = (a.getAttribute('href') || '').split('#')[0].split('/').pop();
      if (!href) return;
      if (href === activ) {
        a.classList.add('is-current');
        a.setAttribute('aria-current', 'page');
      }
    });
  })();

  /* ================= LIGHTBOX GALERIE ================= */
  (function(){
    var lb = document.getElementById('lightbox');
    if (!lb) return;
    var itemi = Array.prototype.slice.call(document.querySelectorAll('[data-lightbox]'));
    if (!itemi.length) return;

    var imgEl   = lb.querySelector('.lb-img');
    var capEl   = lb.querySelector('.lb-cap');
    var contEl  = lb.querySelector('.lb-count');
    var btnClose= lb.querySelector('.lb-close');
    var btnPrev = lb.querySelector('.lb-prev');
    var btnNext = lb.querySelector('.lb-next');
    var idx = 0, declansator = null;

    function arata(i){
      idx = (i + itemi.length) % itemi.length;
      var src = itemi[idx].querySelector('img');
      imgEl.src = src.src;
      imgEl.alt = src.alt || '';
      capEl.textContent = src.alt || '';
      contEl.textContent = (idx + 1) + ' / ' + itemi.length;
      /* re-pornește animația de intrare la fiecare schimbare */
      imgEl.style.animation = 'none'; imgEl.offsetHeight; imgEl.style.animation = '';
    }
    function deschide(i, el){
      declansator = el || null;
      lb.hidden = false; lb.classList.add('open');
      document.body.style.overflow = 'hidden';
      arata(i);
      btnClose.focus();
    }
    function inchide(){
      lb.classList.remove('open'); lb.hidden = true;
      document.body.style.overflow = '';
      if (declansator) declansator.focus();
    }

    itemi.forEach(function(el, i){
      el.addEventListener('click', function(){ deschide(i, el); });
    });
    btnClose.addEventListener('click', inchide);
    btnPrev.addEventListener('click', function(){ arata(idx - 1); });
    btnNext.addEventListener('click', function(){ arata(idx + 1); });
    lb.addEventListener('click', function(e){
      /* clic pe fundal, nu pe imagine sau butoane */
      if (e.target === lb) inchide();
    });
    document.addEventListener('keydown', function(e){
      if (lb.hidden) return;
      if (e.key === 'Escape') inchide();
      else if (e.key === 'ArrowLeft') arata(idx - 1);
      else if (e.key === 'ArrowRight') arata(idx + 1);
      else if (e.key === 'Tab') {
        /* ținem focusul în lightbox */
        var f = [btnClose, btnPrev, btnNext];
        var poz = f.indexOf(document.activeElement);
        e.preventDefault();
        f[(poz + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
      }
    });
  })();

  /* Hărți — scut anti-zoom: harta devine interactivă doar după un clic explicit.
     La schimbarea tabului sau la ieșirea mouse-ului, se re-blochează. */
  document.querySelectorAll('.map-shield').forEach(function(shield){
    function unlock(){ shield.classList.add('is-active'); }
    function lock(){ shield.classList.remove('is-active'); }
    shield.addEventListener('click', function(e){
      if (!shield.classList.contains('is-active')) { e.preventDefault(); unlock(); }
    });
    shield.addEventListener('mouseleave', lock);
    document.addEventListener('mapsrelock', lock);
  });

  /* Locații — comutare între taburi (Oasis Mall / Renée Urban) */
  var locTabs = document.querySelectorAll('.loc-tab');
  if (locTabs.length){
    locTabs.forEach(function(tab){
      tab.addEventListener('click', function(){
        var target = tab.getAttribute('aria-controls');
        locTabs.forEach(function(t){
          var on = (t === tab);
          t.classList.toggle('is-active', on);
          t.setAttribute('aria-selected', on ? 'true' : 'false');
        });
        document.querySelectorAll('.loc-panel').forEach(function(panel){
          panel.hidden = (panel.id !== target);
        });
        document.dispatchEvent(new Event('mapsrelock'));
      });
    });
  }

  /* Marquee — umple minim 2x lățimea ecranului, apoi dublează pentru buclă perfectă */
  var track = document.getElementById('marqueeTrack');
  if (track) {
    var base = track.innerHTML;
    var guard = 0;
    while (track.scrollWidth < window.innerWidth * 1.2 && guard < 20) {
      track.innerHTML += base;
      guard++;
    }
    track.innerHTML += track.innerHTML;
    /* viteză constantă indiferent de lățime (~90px/s) */
    track.style.animationDuration = (track.scrollWidth / 2 / 90).toFixed(1) + 's';
  }

  /* Header la scroll */
  var header = document.getElementById('header');
  function onScroll(){
    header.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  /* Reveal la scroll */
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, {threshold:.15, rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });
  /* permite observarea elementelor .reveal adăugate dinamic (grid magazin, pagină produs) */
  window.reneeReveal = function(root){
    (root || document).querySelectorAll('.reveal:not(.in)').forEach(function(el){ io.observe(el); });
    revealInView();
  };
  /* fallback robust: dacă IntersectionObserver nu se declanșează (medii/taburi inactive
     sau viewport raportat 0), afișăm elementele ajunse în viewport la load/scroll/resize */
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

  /* Parallax subtil */
  if (!reduced) {
    var pEls = document.querySelectorAll('.parallax');
    var ticking = false;
    function parallax(){
      pEls.forEach(function(el){
        var r = el.getBoundingClientRect();
        var speed = parseFloat(el.dataset.speed || 0.1);
        var offset = (r.top + r.height/2 - window.innerHeight/2) * speed;
        el.style.transform = 'translateY(' + offset.toFixed(1) + 'px)';
      });
      ticking = false;
    }
    window.addEventListener('scroll', function(){
      if (!ticking) { requestAnimationFrame(parallax); ticking = true; }
    }, {passive:true});
    parallax();
  }

  /* Testimoniale — rotire automată + dots */
  var slides = document.querySelectorAll('.testi-slide');
  var dotsWrap = document.getElementById('testiDots');
  var stage = document.getElementById('testiStage');
  if (slides.length && dotsWrap && stage) {
  /* înălțimea scenei = cel mai înalt slide (slide-urile sunt absolute) */
  function sizeStage(){
    var h = 0;
    slides.forEach(function(s){ h = Math.max(h, s.scrollHeight); });
    if (h > 0) stage.style.height = h + 'px';
  }
  sizeStage();
  window.addEventListener('resize', sizeStage);
  window.addEventListener('load', sizeStage);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(sizeStage);
  var current = 0, timer;
  slides.forEach(function(_, i){
    var b = document.createElement('button');
    b.setAttribute('aria-label', 'Testimonial ' + (i+1));
    if (i === 0) b.classList.add('active');
    b.addEventListener('click', function(){ goTo(i); restart(); });
    dotsWrap.appendChild(b);
  });
  var dots = dotsWrap.querySelectorAll('button');
  function goTo(i){
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = i;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }
  function next(){ goTo((current + 1) % slides.length); }
  function restart(){
    clearInterval(timer);
    if (!reduced) timer = setInterval(next, 5500);
  }
  restart();
  }

  /* Video hero — oprit dacă userul preferă mișcare redusă */
  var video = document.querySelector('.hero-video');
  if (video && reduced) { video.removeAttribute('autoplay'); video.pause(); }

  /* Meniu mobil */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  function setMenu(open){
    nav.classList.toggle('open', open);
    header.classList.toggle('menu-open', open);
    document.body.classList.toggle('no-scroll', open);
    burger.setAttribute('aria-expanded', open);
    burger.textContent = open ? 'Închide' : 'Meniu';
  }
  burger.addEventListener('click', function(){
    setMenu(!nav.classList.contains('open'));
  });
  nav.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){ setMenu(false); });
  });

  /* ================= MODAL REZERVARE (doar pe paginile cu formular) ========= */
  var modal = document.getElementById('rezModal');
  if (modal) {
  var lastFocus = null;

  function openModal(){
    lastFocus = document.activeElement;
    /* dacă s-a trimis deja o rezervare, ecranul de confirmare ar rămâne peste
       formular la redeschidere — îl scoatem şi reactivăm butonul */
    var ok = document.getElementById('formOk');
    var full = document.getElementById('formFull');
    if (ok) ok.classList.remove('show');
    if (full) full.classList.remove('show');
    var sb = modal.querySelector('#rezForm .btn-light');
    if (sb) { sb.disabled = false; sb.textContent = 'Trimite rezervarea'; }

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
    el.addEventListener('click', function(e){
      e.preventDefault();
      setMenu(false);
      openModal();
    });
  });
  document.getElementById('rezClose').addEventListener('click', closeModal);
  modal.querySelectorAll('[data-rez-close]').forEach(function(b){
    b.addEventListener('click', closeModal);
  });
  modal.querySelector('.modal-backdrop').addEventListener('click', closeModal);
  document.addEventListener('keydown', function(e){
    if (e.key !== 'Escape' || modal.hidden) return;
    /* Escape închide întâi pickerul deschis, apoi modalul */
    if (document.querySelector('.picker.open')) { closeAllPickers(); }
    else { closeModal(); }
  });

  /* ================= PICKERE CUSTOM ================= */
  var pickers = Array.prototype.slice.call(modal.querySelectorAll('.picker'));

  function closeAllPickers(except){
    pickers.forEach(function(p){
      if (p !== except) {
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
    if (willOpen) {
      /* dacă nu are loc sub buton în viewport, deschide în sus */
      var pop = p.querySelector('.pop');
      p.classList.remove('drop-up');
      var r = p.getBoundingClientRect();
      if (r.bottom + pop.offsetHeight + 20 > window.innerHeight && r.top - pop.offsetHeight - 20 > 0) {
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

  /* --- select persoane + listă ore (același mecanism de listă) --- */
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

  var pickLoc = document.getElementById('pickLoc');
  initList(pickLoc);

  /* --- dată + oră într-un singur picker --- */
  var pickCand = document.getElementById('pickCand');
  (function(){
    var MONTHS = ['ianuarie','februarie','martie','aprilie','mai','iunie','iulie','august','septembrie','octombrie','noiembrie','decembrie'];
    var SCURT  = ['ian.','feb.','mar.','apr.','mai','iun.','iul.','aug.','sept.','oct.','nov.','dec.'];
    var titleEl = pickCand.querySelector('.cal-title');
    var grid    = pickCand.querySelector('.cal-grid');
    var prevBtn = pickCand.querySelector('.cal-prev');
    var nextBtn = pickCand.querySelector('.cal-next');
    var timeBox = pickCand.querySelector('.when-time');
    var slots   = pickCand.querySelector('.when-slots');
    var inData  = pickCand.querySelector('input[name="data"]');
    var inOra   = pickCand.querySelector('input[name="ora"]');

    var today = new Date(); today.setHours(0,0,0,0);
    var view = new Date(today.getFullYear(), today.getMonth(), 1);
    var selData = null, selOra = null;

    function iso(d){
      return d.getFullYear() + '-' + ('0'+(d.getMonth()+1)).slice(-2) + '-' + ('0'+d.getDate()).slice(-2);
    }
    function eticheta(){
      if (!selData) return null;
      var zi = selData.getDate() + ' ' + SCURT[selData.getMonth()] + ' ' + selData.getFullYear();
      return selOra ? zi + ' · ' + selOra : zi + ' — alege ora';
    }
    function actualizeaza(){
      var span = pickCand.querySelector('.picker-val');
      var txt = eticheta();
      if (txt){ span.textContent = txt; span.classList.remove('val-empty'); }
      inData.value = selData ? iso(selData) : '';
      inOra.value  = selOra || '';
      if (selData && selOra) clearErr(pickCand);
    }

    /* orele se construiesc o singură dată; se re-marchează la fiecare zi aleasă */
    (function(){
      for (var h = 8; h <= 21; h++){
        for (var m = 0; m < 60; m += 30){
          var t = (h < 10 ? '0' : '') + h + ':' + (m === 0 ? '00' : m);
          var li = document.createElement('li');
          li.setAttribute('role','option');
          li.setAttribute('aria-selected','false');
          li.textContent = t;
          slots.appendChild(li);
        }
      }
    })();
    slots.addEventListener('click', function(e){
      var li = e.target.closest('li');
      if (!li) return;
      slots.querySelectorAll('li').forEach(function(o){ o.setAttribute('aria-selected','false'); });
      li.setAttribute('aria-selected','true');
      selOra = li.textContent;
      actualizeaza();
      closeAllPickers();          /* ora e ultimul pas → închidem */
    });

    function render(){
      titleEl.textContent = MONTHS[view.getMonth()] + ' ' + view.getFullYear();
      grid.innerHTML = '';
      var firstDow = (new Date(view.getFullYear(), view.getMonth(), 1).getDay() + 6) % 7;
      var daysIn = new Date(view.getFullYear(), view.getMonth()+1, 0).getDate();
      for (var i = 0; i < firstDow; i++) grid.appendChild(document.createElement('span'));
      for (var d = 1; d <= daysIn; d++){
        var date = new Date(view.getFullYear(), view.getMonth(), d);
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = d;
        if (date < today) btn.disabled = true;
        if (date.getTime() === today.getTime()) btn.classList.add('today');
        if (selData && date.getTime() === selData.getTime()) btn.classList.add('sel');
        (function(date){
          btn.addEventListener('click', function(e){
            /* render() detaşează butonul din DOM; fără asta, listenerul global
               de pe document vede e.target orfan, crede că s-a dat clic în afara
               pickerului şi închide popover-ul înainte de alegerea orei. */
            e.stopPropagation();
            selData = date;
            selOra = null;                 /* ziua nouă → ora se re-alege */
            slots.querySelectorAll('li').forEach(function(o){ o.setAttribute('aria-selected','false'); });
            timeBox.classList.add('gata'); /* popover-ul RĂMÂNE deschis */
            actualizeaza();
            render();
            slots.scrollTop = 0;
          });
        })(date);
        grid.appendChild(btn);
      }
      prevBtn.disabled = view.getFullYear() === today.getFullYear() && view.getMonth() === today.getMonth();
    }
    prevBtn.addEventListener('click', function(){ view = new Date(view.getFullYear(), view.getMonth()-1, 1); render(); });
    nextBtn.addEventListener('click', function(){ view = new Date(view.getFullYear(), view.getMonth()+1, 1); render(); });
    render();
  })();

  /* ================= VALIDARE + TRIMITERE (simulată) ================= */
  var form = document.getElementById('rezForm');
  var okMsg = document.getElementById('formOk');
  var fullMsg = document.getElementById('formFull');
  var submitBtn = form.querySelector('.field-submit .btn-light');
  var inputNume = document.getElementById('f-nume');
  var inputTel = document.getElementById('f-tel');
  /* DEMO: la orele de mai jos serverul „răspunde" că nu mai sunt locuri —
     ca să poți testa ambele mesaje. La integrarea backend-ului real, răspunsul
     vine de la server și lista dispare. */
  var DEMO_FULL_TIMES = ['12:00', '12:30'];

  function setErr(field, msg){
    field.classList.add('err');
    var m = field.querySelector('.field-msg');
    if (!m) {
      m = document.createElement('span');
      m.className = 'field-msg';
      field.appendChild(m);
    }
    m.textContent = msg;
  }
  function clearErr(field){
    field.classList.remove('err');
    var m = field.querySelector('.field-msg');
    if (m) m.remove();
  }
  /* erorile de pe inputurile text dispar imediat ce userul scrie */
  [inputNume, inputTel].forEach(function(inp){
    inp.addEventListener('input', function(){ clearErr(inp.closest('.field')); });
  });

  function validate(){
    var valid = true;
    if (!inputNume.value.trim()) {
      setErr(inputNume.closest('.field'), 'Spune-ne cum te cheamă');
      valid = false;
    }
    var tel = inputTel.value.trim();
    if (!tel) {
      setErr(inputTel.closest('.field'), 'Avem nevoie de un număr pentru confirmare');
      valid = false;
    } else if (!/^\+?[0-9][0-9\s\-()]{5,}$/.test(tel)) {
      setErr(inputTel.closest('.field'), 'Numărul nu pare valid');
      valid = false;
    }
    if (!pickPers.querySelector('input[type="hidden"]').value) {
      setErr(pickPers, 'Alege numărul de persoane');
      valid = false;
    }
    if (!pickLoc.querySelector('input[type="hidden"]').value) {
      setErr(pickLoc, 'Alege locația');
      valid = false;
    }
    var vData = pickCand.querySelector('input[name="data"]').value;
    var vOra  = pickCand.querySelector('input[name="ora"]').value;
    if (!vData) {
      setErr(pickCand, 'Alege data rezervării');
      valid = false;
    } else if (!vOra) {
      setErr(pickCand, 'Alege și ora');
      valid = false;
    }
    return valid;
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    okMsg.classList.remove('show');
    fullMsg.classList.remove('show');
    if (!validate()) {
      var firstErr = form.querySelector('.field.err');
      var focusable = firstErr.querySelector('input:not([type="hidden"]), .picker-btn');
      if (focusable) focusable.focus();
      return;
    }
    /* simulare request — aici se leagă backend-ul real la integrare */
    submitBtn.disabled = true;
    submitBtn.textContent = 'Se trimite…';
    setTimeout(function(){
      var ora = pickCand.querySelector('input[name="ora"]').value;
      if (DEMO_FULL_TIMES.indexOf(ora) !== -1) {
        fullMsg.classList.add('show');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Trimite rezervarea';
      } else {
        okMsg.classList.add('show');
        submitBtn.textContent = 'Trimis ✓';
      }
    }, 1200);
  });
  }
})();
