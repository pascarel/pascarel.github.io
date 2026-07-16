/* Renée — validare + trimitere simulată formular de contact. WP: la migrare → Contact Form 7 / REST endpoint. */
(function(){
  var form = document.getElementById('contactForm');
  if (!form) return;

  var okMsg = document.getElementById('contactOk');
  var submitBtn = document.getElementById('contactSubmit');
  var inputNume = document.getElementById('c-nume');
  var inputEmail = document.getElementById('c-email');
  var inputMesaj = document.getElementById('c-mesaj');

  function setErr(field, msg){
    field.classList.add('err');
    var m = field.querySelector('.field-msg');
    if (!m) {
      m = document.createElement('span');
      m.className = 'field-msg';
      field.appendChild(m);
    }
    m.textContent = msg;
    m.classList.add('show');
  }
  function clearErr(field){
    field.classList.remove('err');
    var m = field.querySelector('.field-msg');
    if (m) { m.textContent = ''; m.classList.remove('show'); }
  }

  [inputNume, inputEmail, inputMesaj].forEach(function(inp){
    inp.addEventListener('input', function(){ clearErr(inp.closest('.field')); });
  });

  function validate(){
    var valid = true;
    if (!inputNume.value.trim()) {
      setErr(inputNume.closest('.field'), 'Spune-ne cum te cheamă');
      valid = false;
    }
    var email = inputEmail.value.trim();
    if (!email) {
      setErr(inputEmail.closest('.field'), 'Avem nevoie de un e-mail pentru răspuns');
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErr(inputEmail.closest('.field'), 'E-mailul nu pare valid');
      valid = false;
    }
    if (!inputMesaj.value.trim()) {
      setErr(inputMesaj.closest('.field'), 'Scrie-ne câteva cuvinte despre mesajul tău');
      valid = false;
    }
    return valid;
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    okMsg.classList.remove('show');
    if (!validate()) {
      var firstErr = form.querySelector('.field.err');
      var focusable = firstErr.querySelector('input, textarea');
      if (focusable) focusable.focus();
      return;
    }
    /* simulare request — aici se leagă backend-ul real la integrare */
    submitBtn.disabled = true;
    submitBtn.textContent = 'Se trimite…';
    setTimeout(function(){
      okMsg.classList.add('show');
      submitBtn.textContent = 'Trimis ✓';
      form.reset();
      setTimeout(function(){
        submitBtn.disabled = false;
        submitBtn.textContent = 'Trimite mesajul';
      }, 2400);
    }, 1200);
  });
})();
