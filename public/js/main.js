// Mobilaus meniu valdymas (išorinis failas – suderinama su griežta CSP)
(function () {
  var btn = document.querySelector('.menu-toggle');
  var nav = document.getElementById('site-nav');
  if (!btn || !nav) return;
  btn.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      nav.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      btn.focus();
    }
  });
})();

// Pokalbio burbulas
(function () {
  var btn = document.getElementById('chat-btn');
  var panel = document.getElementById('chat-panel');
  if (!btn || !panel) return;
  function set(open) {
    panel.hidden = !open;
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.classList.toggle('is-open', open);
    if (open) { var f = panel.querySelector('textarea, input:not([type=hidden])'); if (f) f.focus(); }
  }
  btn.addEventListener('click', function () { set(panel.hidden); });
  panel.querySelectorAll('[data-chat-close]').forEach(function (b) { b.addEventListener('click', function () { set(false); btn.focus(); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) { set(false); btn.focus(); } });
})();

// Planų kainų perjungiklis: mėnesinis / metinis
(function () {
  var box = document.getElementById('planai');
  if (!box) return;
  var opts = box.querySelectorAll('.billing-opt');
  opts.forEach(function (o) {
    o.addEventListener('click', function () {
      var yearly = o.getAttribute('data-billing') === 'y';
      box.classList.toggle('is-yearly', yearly);
      opts.forEach(function (x) {
        var on = x === o;
        x.classList.toggle('is-on', on);
        x.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    });
  });
})();
