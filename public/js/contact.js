// Formų siuntimas fone (Web3Forms), kad lankytojas liktų svetainėje.
// Veikia visoms formoms (kontaktų, sprendimų, pokalbio lango). Be JavaScript formos veikia įprastu būdu.
(function () {
  if (!window.fetch) return;
  var lang = document.documentElement.lang;
  var msg = lang === 'lt'
    ? { sending: 'Siunčiama…', error: 'Nepavyko išsiųsti. Bandykite dar kartą arba rašykite el. paštu.' }
    : { sending: 'Sending…', error: 'Could not send. Please try again or email us.' };

  document.querySelectorAll('form[action^="https://api.web3forms.com"]').forEach(function (form) {
    if (form.dataset.bound) return;
    form.dataset.bound = '1';
    var status = form.querySelector('.form-status');
    var btn = form.querySelector('button[type="submit"]');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var label = btn.textContent;
      btn.disabled = true;
      btn.textContent = msg.sending;
      if (status) status.textContent = '';
      fetch(form.action, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (!data || !data.success) throw new Error('failed');
          // Pokalbio langas: padėka rodoma vietoje; kitos formos – nukreipiamos į „Ačiū“ puslapį
          if (form.dataset.inline) {
            form.hidden = true;
            var done = document.getElementById(form.dataset.inline);
            if (done) { done.hidden = false; done.focus(); }
            if (window.umami) window.umami.track('Pokalbio žinutė išsiųsta');
            return;
          }
          window.location.assign(new URL(form.querySelector('input[name="redirect"]').value).pathname);
        })
        .catch(function () {
          btn.disabled = false;
          btn.textContent = label;
          if (status) status.textContent = msg.error;
        });
    });
  });
})();
