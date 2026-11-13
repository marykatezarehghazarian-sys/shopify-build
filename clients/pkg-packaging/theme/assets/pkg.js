/* PKG theme: menu, reveal, catalogue search, contact form → WhatsApp */
(function () {
  document.documentElement.classList.add('js-anim');
  var btn = document.querySelector('.menu-btn');
  if (btn) btn.addEventListener('click', function () {
    var nav = document.getElementById('nav');
    var open = nav.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', open);
  });

  var els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { io.observe(el); });
  } else { els.forEach(function (el) { el.classList.add('is-in'); }); }

  var input = document.querySelector('[data-filter-input]');
  if (input) {
    var items = Array.prototype.slice.call(document.querySelectorAll('[data-filter-text]'));
    var count = document.querySelector('[data-filter-count]');
    var empty = document.querySelector('[data-filter-empty]');
    input.addEventListener('input', function () {
      var q = input.value.trim().toLowerCase(); var n = 0;
      items.forEach(function (el) { var hit = !q || el.getAttribute('data-filter-text').indexOf(q) > -1; el.hidden = !hit; if (hit) n++; });
      if (count) count.textContent = n + ' product' + (n === 1 ? '' : 's');
      if (empty) empty.hidden = n > 0;
    });
  }

  var form = document.querySelector('[data-wa-form]');
  if (form) {
    var pre = new URLSearchParams(location.search).get('p');
    if (pre) { var opt = form.querySelector('option[data-handle="' + pre.replace(/"/g, '') + '"]'); if (opt) opt.selected = true; }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = new FormData(form);
      var lines = ['Hi PKG, quote request from the website:', 'Name: ' + f.get('name'), 'Business: ' + (f.get('business') || '-'), 'Product: ' + (f.get('product') || '-'), 'Quantity: ' + (f.get('qty') || '-'), 'Details: ' + (f.get('details') || '-')];
      window.open('https://wa.me/' + form.getAttribute('data-wa') + '?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
    });
  }
})();
