/* ============================================================
   Partial comun — modalul de rezervare.
   SURSĂ UNICĂ. Nu copia markup-ul în pagini: se injectează de aici,
   în toate cele 13 pagini care încarcă acest script.

   De ce din JS și nu un fișier .html adus cu fetch(): site-ul e static,
   fără build, iar fetch() pe `file://` cade din cauza CORS. Aşa merge
   şi local, şi pe GitHub Pages.

   Ordinea contează: acest script trebuie să ruleze ÎNAINTE de js/main.js,
   care caută #rezModal la iniţializare.

   WP: → get_template_part('template-parts/modal-rezervare')
   ============================================================ */
(function(){
  if (document.getElementById('rezModal')) return;   /* deja injectat */

  var MARKUP = '<div class="modal" id="rezModal" role="dialog" aria-modal="true" aria-labelledby="rezTitle" hidden>' +
    '  <div class="modal-backdrop"></div>' +
    '  <div class="modal-panel">' +
    '    <button type="button" class="modal-close" id="rezClose" aria-label="Închide">✕</button>' +
    '    <p class="modal-eyebrow">Rezervări</p>' +
    '    <h3 class="modal-title" id="rezTitle">Rezervă o masă</h3>' +
    '    <p class="modal-sub">Completează detaliile și te contactăm pentru confirmare.</p>' +
    '' +
    '    <form id="rezForm" novalidate>' +
    '      <div class="form-grid">' +
    '        <div class="field">' +
    '          <label for="f-nume">Nume</label>' +
    '          <input type="text" id="f-nume" name="nume" placeholder="Numele tău" autocomplete="name" required>' +
    '        </div>' +
    '        <div class="field">' +
    '          <label for="f-tel">Telefon</label>' +
    '          <input type="tel" id="f-tel" name="telefon" placeholder="+373 ..." autocomplete="tel" required>' +
    '        </div>' +
    '        <div class="field picker" id="pickPers">' +
    '          <label id="lbl-pers">Persoane</label>' +
    '          <button type="button" class="picker-btn" aria-haspopup="listbox" aria-expanded="false" aria-labelledby="lbl-pers">' +
    '            <span class="picker-val">2 persoane</span><i class="chev"></i>' +
    '          </button>' +
    '          <input type="hidden" name="persoane" value="2 persoane">' +
    '          <ul class="pop pop-list" role="listbox">' +
    '            <li role="option" aria-selected="true">2 persoane</li>' +
    '            <li role="option" aria-selected="false">3–4 persoane</li>' +
    '            <li role="option" aria-selected="false">5–8 persoane</li>' +
    '            <li role="option" aria-selected="false">Grup mare (9+)</li>' +
    '          </ul>' +
    '        </div>' +
    '        <div class="field picker" id="pickLoc">' +
    '          <label id="lbl-loc">Locație</label>' +
    '          <button type="button" class="picker-btn" aria-haspopup="listbox" aria-expanded="false" aria-labelledby="lbl-loc">' +
    '            <span class="picker-val val-empty">Alege locația</span><i class="chev"></i>' +
    '          </button>' +
    '          <input type="hidden" name="locatie" value="">' +
    '          <ul class="pop pop-list" role="listbox">' +
    '            <li role="option" aria-selected="false" data-value="oasis">Renée Oasis Mall</li>' +
    '            <li role="option" aria-selected="false" data-value="urban">Renée Urban</li>' +
    '          </ul>' +
    '        </div>' +
    '        <div class="field picker field-when" id="pickCand">' +
    '          <label id="lbl-cand">Data și ora</label>' +
    '          <button type="button" class="picker-btn" aria-haspopup="dialog" aria-expanded="false" aria-labelledby="lbl-cand">' +
    '            <span class="picker-val val-empty">Alege data și ora</span><i class="chev"></i>' +
    '          </button>' +
    '          <input type="hidden" name="data" value="">' +
    '          <input type="hidden" name="ora" value="">' +
    '          <div class="pop pop-when" role="dialog" aria-label="Alege data și ora">' +
    '            <div class="when-cal">' +
    '              <div class="cal-head">' +
    '                <button type="button" class="cal-nav cal-prev" aria-label="Luna precedentă">←</button>' +
    '                <span class="cal-title"></span>' +
    '                <button type="button" class="cal-nav cal-next" aria-label="Luna următoare">→</button>' +
    '              </div>' +
    '              <div class="cal-week">' +
    '                <span>Lu</span><span>Ma</span><span>Mi</span><span>Jo</span><span>Vi</span><span>Sâ</span><span>Du</span>' +
    '              </div>' +
    '              <div class="cal-grid"></div>' +
    '            </div>' +
    '            <div class="when-time">' +
    '              <p class="when-head">Ora</p>' +
    '              <p class="when-empty">Alege întâi ziua</p>' +
    '              <ul class="when-slots" role="listbox" aria-label="Ore disponibile"></ul>' +
    '            </div>' +
    '          </div>' +
    '        </div>' +
    '        <div class="field field-submit">' +
    '          <button type="submit" class="btn-light">Trimite rezervarea</button>' +
    '        </div>' +
    '      </div>' +
    '      <div class="form-foot">' +
    '        <p class="form-note">Sau sună-ne direct la <a href="tel:+37378784040" style="border-bottom:1px solid var(--caramel)">+373 78 784 040</a> — confirmăm pe loc.</p>' +
    '      </div>' +
    '      <div aria-live="polite">' +
    '        <div class="rez-succes" id="formOk" role="status">' +
    '          <svg class="rez-simbol" aria-hidden="true" focusable="false"  viewBox="0 0 1058 1160" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M810.178 331.094C986.994 258.142 1058 227.855 1058 101.738V0H1036.82V15.1903C1036.82 71.3572 1002.02 88.1416 801.034 168.594C600.053 249.047 528.953 282.522 509.359 454.117C485.193 252.141 380.876 156.404 241.85 156.404C119.432 156.404 0 224.761 0 555.855V1160H23.9797V1021.22C24.073 1009.22 24.1663 999.376 24.1663 994.688C24.1663 804.808 155.635 725.856 278.053 725.856C400.471 725.856 491.164 791.212 491.164 964.307V1160H515.331V971.902C515.331 838.283 589.416 830.688 810.085 739.546C986.901 666.594 1057.91 636.307 1057.91 510.19V408.452H1036.73V423.642C1036.73 479.809 1001.92 496.594 800.941 577.046C616.661 650.841 541.643 685.067 515.331 822.436V563.45C515.331 429.831 589.416 422.236 810.085 331.094H810.178ZM241.943 564.95C152.742 564.95 65.1278 601.332 24.1663 749.204V612.772C24.2596 600.77 24.3529 590.924 24.3529 586.235C24.3529 396.356 155.821 317.404 278.239 317.404C400.657 317.404 491.351 382.76 491.351 555.855V771.896C450.203 631.807 358.296 564.857 241.943 564.857V564.95Z" fill="currentColor"/> </svg>' +
    '          <h4>Mulțumim!</h4>' +
    '          <p>Am primit cererea ta. Te contactăm în cel mai scurt timp pentru confirmare.</p>' +
    '          <button type="button" class="btn-light" data-rez-close>Închide</button>' +
    '        </div>' +
    '        <p class="form-full" id="formFull">Ne pare rău — pentru data și ora alese nu mai avem locuri libere. Alege alt interval sau sună-ne la <a href="tel:+37378784040">+373 78 784 040</a>.</p>' +
    '      </div>' +
    '    </form>' +
    '  </div>' +
    '</div>';

  var gazda = document.createElement('div');
  gazda.innerHTML = MARKUP;
  while (gazda.firstElementChild) {
    document.body.appendChild(gazda.firstElementChild);
  }
})();
