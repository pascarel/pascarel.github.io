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

  /* --- ore: 08:00 – 21:30, pas de 30 min --- */
  var pickOra = document.getElementById('pickOra');
  (function(){
    var list = pickOra.querySelector('.pop-list');
    for (var h = 8; h <= 21; h++) {
      for (var m = 0; m < 60; m += 30) {
        if (h === 21 && m > 30) break;
        var t = (h < 10 ? '0' : '') + h + ':' + (m === 0 ? '00' : m);
        var li = document.createElement('li');
        li.setAttribute('role', 'option');
        li.setAttribute('aria-selected', 'false');
        li.textContent = t;
        list.appendChild(li);
      }
    }
    initList(pickOra);
    /* indiciul „mai multe ore →" apare doar dacă există scroll orizontal
       și dispare când ajungi la capăt */
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

  /* --- calendar dată --- */
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
      return d.getFullYear() + '-' +
        ('0' + (d.getMonth()+1)).slice(-2) + '-' +
        ('0' + d.getDate()).slice(-2);
    }
    function render(){
      titleEl.textContent = MONTHS[view.getMonth()] + ' ' + view.getFullYear();
      grid.innerHTML = '';
      /* prima zi a lunii, luni = 0 */
      var firstDow = (new Date(view.getFullYear(), view.getMonth(), 1).getDay() + 6) % 7;
      var daysIn = new Date(view.getFullYear(), view.getMonth()+1, 0).getDate();
      for (var i = 0; i < firstDow; i++) {
        grid.appendChild(document.createElement('span'));
      }
      for (var d = 1; d <= daysIn; d++) {
        var date = new Date(view.getFullYear(), view.getMonth(), d);
        var b = document.createElement('button');
        b.type = 'button';
        b.textContent = d;
        if (date < today) b.disabled = true;
        if (date.getTime() === today.getTime()) b.classList.add('today');
        if (selected && date.getTime() === selected.getTime()) b.classList.add('sel');
        (function(date){
          b.addEventListener('click', function(){
            selected = date;
            setPickerValue(pickData,
              date.getDate() + ' ' + MONTHS[date.getMonth()] + ' ' + date.getFullYear(),
              iso(date));
            closeAllPickers();
            render();
          });
        })(date);
        grid.appendChild(b);
      }
      /* nu naviga în trecut */
      prevBtn.disabled = view.getFullYear() === today.getFullYear() && view.getMonth() === today.getMonth();
    }
    prevBtn.addEventListener('click', function(){
      view = new Date(view.getFullYear(), view.getMonth()-1, 1); render();
    });
    nextBtn.addEventListener('click', function(){
      view = new Date(view.getFullYear(), view.getMonth()+1, 1); render();
    });
    render();
  })();

  /* ================= VALIDARE + TRIMITERE (simulată) ================= */
  var form = document.getElementById('rezForm');
  var okMsg = document.getElementById('formOk');
  var fullMsg = document.getElementById('formFull');
  var submitBtn = form.querySelector('.btn-light');
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
    if (!pickData.querySelector('input[type="hidden"]').value) {
      setErr(pickData, 'Alege data rezervării');
      valid = false;
    }
    if (!pickOra.querySelector('input[type="hidden"]').value) {
      setErr(pickOra, 'Alege ora rezervării');
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
      var ora = pickOra.querySelector('input[type="hidden"]').value;
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
