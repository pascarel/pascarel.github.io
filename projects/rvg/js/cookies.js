/* Cookie consent — fără plugin. Categorii: necesare (mereu), analitice, marketing.
   În WP: scripturile GA4/GTM/Meta Pixel se încarcă DOAR după consimțământ (vezi loadConsented). */
(() => {
  const KEY = 'rvg_consent_v1';
  const read = () => { try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; } };
  const save = c => { try { localStorage.setItem(KEY, JSON.stringify({ ...c, ts: Date.now() })); } catch {} };

  const el = document.createElement('div');
  el.className = 'cc';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-label', 'Setări cookie');
  el.innerHTML = `
    <div class="cc__box">
      <div class="cc__main">
        <p class="cc__title">Folosim cookie-uri</p>
        <p>Cookie-urile necesare fac site-ul să funcționeze. Pe cele analitice și de marketing le activăm doar cu acordul tău. Detalii în <a href="confidentialitate.html#cookie">Politica de confidențialitate</a>.</p>
      </div>
      <form class="cc__prefs" hidden>
        <label><input type="checkbox" checked disabled> <span><strong>Necesare</strong> — funcționarea site-ului, securitate</span></label>
        <label><input type="checkbox" name="analytics"> <span><strong>Analitice</strong> — Google Analytics, Yandex Metrica</span></label>
        <label><input type="checkbox" name="marketing"> <span><strong>Marketing</strong> — Meta Pixel, Google Ads</span></label>
      </form>
      <div class="cc__actions">
        <button type="button" class="btn btn--sm cc__link" data-cc="settings">Setări</button>
        <button type="button" class="btn btn--sm btn--outline" data-cc="reject">Refuz</button>
        <button type="button" class="btn btn--sm btn--accent" data-cc="accept">Accept toate</button>
      </div>
    </div>`;
  document.body.appendChild(el);

  const prefs = el.querySelector('.cc__prefs');
  const show = () => {
    const c = read();
    if (c) { prefs.analytics.checked = !!c.analytics; prefs.marketing.checked = !!c.marketing; }
    el.classList.add('is-open');
  };
  const close = c => { save(c); el.classList.remove('is-open'); loadConsented(c); };

  el.addEventListener('click', e => {
    const a = e.target.closest('[data-cc]')?.dataset.cc;
    if (a === 'accept') close({ analytics: true, marketing: true });
    if (a === 'reject') close({ analytics: false, marketing: false });
    if (a === 'save') close({ analytics: prefs.analytics.checked, marketing: prefs.marketing.checked });
    if (a === 'settings') {
      prefs.hidden = false;
      e.target.textContent = 'Salvează'; e.target.dataset.cc = 'save';
    }
  });
  document.addEventListener('click', e => {
    if (e.target.closest('[data-cookie-settings]')) { e.preventDefault(); prefs.hidden = false;
      const b = el.querySelector('[data-cc=settings]'); if (b) { b.textContent = 'Salvează'; b.dataset.cc = 'save'; }
      show(); }
  });

  function loadConsented(c) {
    // Prototip: doar marcăm. În producție aici se injectează GTM cu Consent Mode v2.
    document.documentElement.dataset.consent = [c.analytics && 'analytics', c.marketing && 'marketing'].filter(Boolean).join(' ') || 'none';
  }

  const existing = read();
  if (existing) loadConsented(existing); else setTimeout(show, 800);
})();
