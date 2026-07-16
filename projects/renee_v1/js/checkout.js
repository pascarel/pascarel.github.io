/* Renée — Checkout: validare, livrare/plată, trimitere simulată. WP: la migrare → WC_Checkout. */
(function(){

  function money(n){ return n + ' lei'; }

  var Checkout = {
    init: function(){
      var Cart = window.Cart;
      if (!Cart) return;

      var form = document.getElementById('checkoutForm');
      if (!form) return;

      if (!Cart.count()){
        var emptyMsg = document.getElementById('checkoutEmpty');
        if (emptyMsg){
          emptyMsg.classList.add('show');
          form.style.display = 'none';
          var summaryEl = document.getElementById('orderSummary');
          if (summaryEl) summaryEl.style.display = 'none';
        } else {
          location.href = 'magazin.html';
        }
        return;
      }

      var inputNume = document.getElementById('co-nume');
      var inputTel = document.getElementById('co-tel');
      var inputEmail = document.getElementById('co-email');
      var inputStrada = document.getElementById('co-strada');
      var inputBloc = document.getElementById('co-bloc');
      var inputReper = document.getElementById('co-reper');
      var adresaWrap = document.getElementById('adresaLivrare');
      var pickupWrap = document.getElementById('pickupLocatie');
      var pickupSelect = document.getElementById('co-locatie');
      var livrareRadios = form.querySelectorAll('input[name="livrare"]');
      var plataWrap = document.getElementById('plataOptions');
      var summaryEl = document.getElementById('orderSummary');
      var submitBtn = document.getElementById('coSubmit');

      var PAY_DEFAULT = [
        { value: 'card-online', label: 'Card online' },
        { value: 'card-curier', label: 'Card la curier' },
        { value: 'cash-curier', label: 'Cash la curier' }
      ];
      var PAY_PICKUP = [
        { value: 'plata-ridicare', label: 'Plată la ridicare' }
      ];

      function setErr(field, msg){
        field.classList.add('err');
        var m = field.querySelector('.field-msg');
        if (!m){
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
        if (m) m.remove();
      }

      [inputNume, inputTel, inputEmail, inputStrada].forEach(function(inp){
        if (!inp) return;
        inp.addEventListener('input', function(){ clearErr(inp.closest('.field')); });
      });

      function currentLivrare(){
        for (var i = 0; i < livrareRadios.length; i++){
          if (livrareRadios[i].checked) return livrareRadios[i].value;
        }
        return 'delivery';
      }

      function renderPayOptions(){
        var metoda = currentLivrare();
        var list = metoda === 'pickup' ? PAY_PICKUP : PAY_DEFAULT;
        var current = form.querySelector('input[name="plata"]:checked');
        var currentVal = current ? current.value : null;
        var html = '';
        for (var i = 0; i < list.length; i++){
          var checked = (currentVal === list[i].value) || (i === 0 && !list.some(function(o){ return o.value === currentVal; }));
          html += '<label class="radio-opt"><input type="radio" name="plata" value="' + list[i].value + '"' + (checked ? ' checked' : '') + '> ' + list[i].label + '</label>';
        }
        plataWrap.innerHTML = html;
      }

      function renderSummary(){
        var items = Cart.items();
        var metoda = currentLivrare();
        var subtotal = Cart.subtotal();
        var shipping = Cart.shipping(metoda);
        var total = subtotal + shipping;
        var html = '<h2>Comanda ta</h2>';
        for (var i = 0; i < items.length; i++){
          var it = items[i];
          html += '<div class="os-line"><span class="os-name">' + it.name +
            (it.variation ? ' <small>(' + it.variation + ')</small>' : '') +
            ' × ' + it.qty + '</span><span>' + money(it.price * it.qty) + '</span></div>';
        }
        html += '<div class="os-line"><span>Subtotal</span><span>' + money(subtotal) + '</span></div>';
        html += '<div class="os-line"><span>Livrare</span><span>' + (shipping === 0 ? 'Gratis' : money(shipping)) + '</span></div>';
        if (metoda !== 'pickup' && subtotal >= Cart.FREE_THRESHOLD){
          html += '<div class="cs-note">Livrare gratuită!</div>';
        }
        html += '<div class="cs-row cs-total"><span>Total</span><span>' + money(total) + '</span></div>';
        summaryEl.innerHTML = html;
      }

      function updateLivrareUI(){
        var metoda = currentLivrare();
        var isPickup = metoda === 'pickup';
        adresaWrap.style.display = isPickup ? 'none' : '';
        pickupWrap.style.display = isPickup ? '' : 'none';
        if (inputStrada) inputStrada.required = !isPickup;
        renderPayOptions();
        renderSummary();
      }

      livrareRadios.forEach(function(r){
        r.addEventListener('change', updateLivrareUI);
      });
      updateLivrareUI();

      function validate(){
        var valid = true;
        var metoda = currentLivrare();

        if (!inputNume.value.trim()){
          setErr(inputNume.closest('.field'), 'Spune-ne cum te cheamă');
          valid = false;
        }

        var tel = inputTel.value.trim();
        if (!tel){
          setErr(inputTel.closest('.field'), 'Avem nevoie de un număr de telefon');
          valid = false;
        } else if (tel.replace(/\D/g, '').length < 6){
          setErr(inputTel.closest('.field'), 'Numărul nu pare valid');
          valid = false;
        }

        var email = inputEmail.value.trim();
        if (!email){
          setErr(inputEmail.closest('.field'), 'Avem nevoie de un e-mail');
          valid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
          setErr(inputEmail.closest('.field'), 'E-mailul nu pare valid');
          valid = false;
        }

        if (metoda === 'delivery'){
          if (!inputStrada.value.trim()){
            setErr(inputStrada.closest('.field'), 'Spune-ne adresa de livrare');
            valid = false;
          }
        } else {
          if (!pickupSelect.value){
            setErr(pickupSelect.closest('.field'), 'Alege locația de ridicare');
            valid = false;
          }
        }

        if (!form.querySelector('input[name="plata"]:checked')){
          valid = false;
        }

        return valid;
      }

      form.addEventListener('submit', function(e){
        e.preventDefault();
        if (!validate()){
          var firstErr = form.querySelector('.field.err');
          if (firstErr){
            var focusable = firstErr.querySelector('input, select');
            if (focusable) focusable.focus();
          }
          return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Se trimite…';

        setTimeout(function(){
          var metoda = currentLivrare();
          var plata = form.querySelector('input[name="plata"]:checked').value;
          var items = Cart.items();
          var subtotal = Cart.subtotal();
          var shipping = Cart.shipping(metoda);
          var total = subtotal + shipping;
          var orderNumber = 'RN-' + (1000 + Cart.count() * 7 + Cart.subtotal() % 97);

          var order = {
            number: orderNumber,
            date: new Date().toISOString(),
            items: items,
            subtotal: subtotal,
            shipping: shipping,
            total: total,
            livrare: metoda,
            plata: plata,
            contact: {
              nume: inputNume.value.trim(),
              telefon: inputTel.value.trim(),
              email: inputEmail.value.trim()
            },
            adresa: metoda === 'delivery' ? {
              strada: inputStrada.value.trim(),
              bloc: inputBloc.value.trim(),
              reper: inputReper.value.trim()
            } : null,
            locatiePickup: metoda === 'pickup' ? pickupSelect.value : null
          };

          sessionStorage.setItem('renee_last_order', JSON.stringify(order));
          Cart.clear();
          location.href = 'comanda-confirmata.html';
        }, 1200);
      });
    }
  };

  window.Checkout = Checkout;
})();
