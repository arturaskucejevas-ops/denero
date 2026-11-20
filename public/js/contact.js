// Kontaktų formos siuntimas fone (Web3Forms), kad lankytojas liktų svetainėje.
// Be JavaScript forma vis tiek veikia įprastu būdu.
(function () {
  var form = document.querySelector('form[action^="https://api.web3forms.com"]');
  if (!form || !window.fetch) return;
  var status = document.getElementById('form-status');
  var btn = form.querySelector('button[type="submit"]');
  var lang = document.documentElement.lang;
  var msg = lang === 'lt'
    ? { sending: 'Siunčiama…', error: 'Nepavyko išsiųsti. Bandykite dar kartą arba rašykite el. paštu.' }
    : { sending: 'Sending…', error: 'Could not send. Please try again or email us.' };

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var label = btn.textContent;
    btn.disabled = true;
    btn.textContent = msg.sending;
    if (status) status.textContent = '';
    fetch(form.action, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new FormData(form)
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data && data.success) {
          window.location.assign(new URL(form.querySelector('input[name="redirect"]').value).pathname);
        } else { throw new Error('failed'); }
      })
      .catch(function () {
        btn.disabled = false;
        btn.textContent = label;
        if (status) status.textContent = msg.error;
      });
  });
})();
