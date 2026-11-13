/* PKG. Packaging Factory: prototype data + rendering.
   Everything here maps to Shopify later: categories → collections, products → products,
   specs → metafields, WhatsApp settings → theme settings. */
const SITE = {
  name: 'PKG. Packaging Factory',
  whatsapp: '9613400054', // 03 4000 54 → +961 3 400 054
  phoneDisplay: '+961 3 400 054',
  email: 'rafi@printw-ps.com',
  instagram: 'pkg.packagingfactory',
  showroom: { address: '[Showroom address]', hours: '[Opening hours]', mapQuery: '' },
};

const ICONS = {
  food: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"><path d="M8 26l24-10 24 10-24 10z"/><path d="M8 26v18l24 12 24-12V26"/><path d="M32 36v20"/></svg>',
  bakery: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"><rect x="8" y="22" width="48" height="32" rx="2"/><path d="M8 22l6-10h36l6 10"/><rect x="20" y="30" width="24" height="12" rx="2"/></svg>',
  coffee: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"><path d="M16 18h32l-4 38H20z"/><path d="M13 12h38v6H13z"/><path d="M18 30h28"/></svg>',
  bags: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"><path d="M12 22h40l-3 34H15z"/><path d="M24 22v-4a8 8 0 0116 0v4"/></svg>',
  labels: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"><circle cx="32" cy="32" r="22"/><circle cx="32" cy="32" r="12"/><path d="M32 10v6M32 48v6M10 32h6M48 32h6"/></svg>',
  retail: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"><path d="M10 20h44v34H10z"/><path d="M10 20l8-8h28l8 8"/><path d="M26 32h12"/></svg>',
  corporate: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"><rect x="10" y="16" width="44" height="28" rx="3"/><path d="M18 26h20M18 34h12"/><rect x="18" y="48" width="28" height="4"/></svg>',
  school: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"><path d="M16 10h34v44H16z"/><path d="M16 10h-4v44h4M24 22h18M24 30h18M24 38h10"/></svg>',
};
const WA_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 004.74 1.21c5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm0 18.15a8.2 8.2 0 01-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 01-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 4.54 0 8.24 3.7 8.24 8.24 0 4.54-3.7 8.24-8.24 8.24zm4.52-6.16c-.25-.12-1.46-.72-1.69-.81-.23-.08-.39-.12-.56.13-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.46-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.29z"/></svg>';

const CATEGORIES = [
  { id: 'food', name: 'Food & Takeaway', icon: 'food', blurb: 'Burger, pizza and meal boxes, printed with your logo.' },
  { id: 'bakery', name: 'Bakery & Pastry', icon: 'bakery', blurb: 'Cake and pastry boxes that keep sweets safe and on-brand.' },
  { id: 'coffee', name: 'Coffee & Drinks', icon: 'coffee', blurb: 'Branded cups, sleeves and carriers for every pour.' },
  { id: 'bags', name: 'Paper Bags', icon: 'bags', blurb: 'Kraft, white and luxury shopping bags in any size.' },
  { id: 'labels', name: 'Labels & Stickers', icon: 'labels', blurb: 'Seals, stickers and labels to finish every pack.' },
  { id: 'retail', name: 'Retail & Clothing', icon: 'retail', blurb: 'Mailer boxes, hang tags and tissue for fashion brands.' },
  { id: 'corporate', name: 'Corporate Print', icon: 'corporate', blurb: 'Business cards, letterheads and folders.' },
  { id: 'school', name: 'School Print', icon: 'school', blurb: 'Notebooks, certificates and school stationery.' },
];

// Sample catalogue (placeholders until the owner's list and photos arrive).
const PRODUCTS = [
  ['burger-box', 'food', 'Burger Box', 'Clamshell box that keeps burgers warm and intact on the way.', 'Kraft or white board', 'Small, medium, large', true],
  ['pizza-box', 'food', 'Pizza Box', 'Corrugated pizza box, strong and stackable, printed in one to full colour.', 'Corrugated E-flute', '26, 30, 33, 40 cm'],
  ['meal-box', 'food', 'Kraft Meal Box', 'Leak-resistant meal box for salads, rice and mains.', 'Kraft board with PE lining', '500, 750, 1000 ml'],
  ['fries-scoop', 'food', 'Fries Scoop', 'Open scoop for fries and snacks, printed edge to edge.', 'Food-grade board', 'Small, medium, large'],
  ['sandwich-wedge', 'food', 'Sandwich Wedge', 'Window wedge that shows off the sandwich inside.', 'Kraft board, PLA window', 'Single, double'],
  ['cake-box', 'bakery', 'Cake Box with Window', 'Sturdy cake box with a clear window and easy fold.', 'White or kraft board', '20, 25, 30 cm', true],
  ['pastry-box', 'bakery', 'Pastry Box', 'Classic pastry box for sweets, maamoul and petits fours.', 'Coated board', '250 g, 500 g, 1 kg'],
  ['cupcake-box', 'bakery', 'Cupcake Box', 'Box with inserts for 1, 2, 4, 6 or 12 cupcakes.', 'White board with insert', '1–12 pieces'],
  ['bread-bag', 'bakery', 'Bread Bag', 'Paper bag for bread and baguettes, with or without window.', 'Kraft or white paper', 'Several lengths'],
  ['paper-cup', 'coffee', 'Single-Wall Paper Cup', 'Branded cup for hot drinks, with matching lids available.', 'Food-grade cup board', '4, 8, 12, 16 oz', true],
  ['double-wall-cup', 'coffee', 'Double-Wall Cup', 'Insulated cup, no sleeve needed, premium feel.', 'Double-wall board', '8, 12, 16 oz'],
  ['cup-sleeve', 'coffee', 'Cup Sleeve', 'Printed sleeve that protects hands and carries your brand.', 'Kraft or white board', 'Fits 8–16 oz'],
  ['cup-carrier', 'coffee', 'Cup Carrier', 'Two or four cup carrier for takeaway and delivery.', 'Moulded fibre or board', '2 or 4 cups'],
  ['kraft-bag', 'bags', 'Kraft Handle Bag', 'Everyday kraft bag with twisted paper handles.', 'Kraft paper', 'Small to extra large', true],
  ['luxury-bag', 'bags', 'Luxury Rope-Handle Bag', 'Laminated bag with rope handles for boutiques and gifts.', 'Art board, matte or gloss', 'Custom sizes'],
  ['flat-bag', 'bags', 'Flat-Handle Bag', 'Practical bag for groceries, pharmacies and takeaway.', 'Kraft or white paper', 'Several sizes'],
  ['stickers', 'labels', 'Custom Stickers', 'Die-cut stickers in any shape for boxes and bags.', 'Paper or vinyl', 'Any shape and size', true],
  ['seal-labels', 'labels', 'Seal Labels', 'Tamper-evident seals for delivery bags and boxes.', 'Paper or security vinyl', 'Round or rectangle'],
  ['mailer-box', 'retail', 'Mailer Box', 'Printed mailer box for online orders and gift sets.', 'Corrugated E-flute', 'Custom sizes', true],
  ['hang-tags', 'retail', 'Hang Tags', 'Clothing tags with string, foil or embossing options.', 'Heavy card', 'Custom shapes'],
  ['tissue-paper', 'retail', 'Printed Tissue Paper', 'Thin wrapping tissue printed with your logo pattern.', 'Tissue paper', 'Standard sheets'],
  ['business-cards', 'corporate', 'Business Cards', 'Premium cards with matte, gloss, foil or spot UV.', '350–600 gsm card', '85 × 55 mm', true],
  ['letterhead', 'corporate', 'Letterhead & Envelopes', 'Matching letterheads, envelopes and compliment slips.', 'Offset paper', 'A4, DL, C4'],
  ['folders', 'corporate', 'Presentation Folders', 'Pocket folders for proposals and company profiles.', 'Coated board', 'A4'],
  ['notebooks', 'school', 'Custom Notebooks', 'Notebooks with your school or company cover.', 'Offset paper, card cover', 'A4, A5', true],
  ['certificates', 'school', 'Certificates', 'Certificates and diplomas with foil and embossing.', 'Textured card', 'A4, A3'],
].map(([id, cat, name, desc, material, sizes, featured]) => ({ id, cat, name, desc, material, sizes, featured: !!featured }));

const catOf = (id) => CATEGORIES.find((c) => c.id === id);
const productOf = (id) => PRODUCTS.find((p) => p.id === id);
const waLink = (text) => `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;
const esc = (s) => String(s).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));

// Placeholder visual: category icon on a coloured board until real photos arrive.
const PALETTE = { food: '#c9a27a', bakery: '#f1d9c9', coffee: '#2b2622', bags: '#a9825a', labels: '#e5432d', retail: '#e9e2d6', corporate: '#121212', school: '#d8c6a5' };
function art(p) {
  const bg = PALETTE[p.cat];
  const dark = ['#2b2622', '#121212', '#e5432d', '#a9825a'].includes(bg);
  return `<div class="art" style="background:${bg};color:${dark ? '#f3eee6' : '#121212'}">${ICONS[catOf(p.cat).icon]}<span class="art__note">Photo coming</span></div>`;
}

function card(p) {
  return `<a class="card reveal" href="product.html?p=${p.id}">
    <div class="card__media" style="position:relative">${art(p)}${p.featured ? '<span class="badge">Popular</span>' : ''}</div>
    <div class="card__body"><span class="card__cat">${esc(catOf(p.cat).name)}</span><span class="card__title">${esc(p.name)}</span><span class="card__cta">Get a quote →</span></div>
  </a>`;
}

function header(active) {
  const links = [['index.html', 'Home'], ['catalogue.html', 'Catalogue'], ['about.html', 'About us'], ['showroom.html', 'Showroom'], ['contact.html', 'Contact']];
  return `<div class="announce">Custom printing &amp; packaging · <strong>Delivery all over Lebanon &amp; the Middle East</strong> · Cash on delivery, Whish or OMT</div>
  <header class="header"><div class="wrap header__row">
    <a class="logo" href="index.html" aria-label="${esc(SITE.name)} home">PKG<span class="logo__dot">.</span><span class="logo__sub">Packaging<br>Factory</span></a>
    <nav class="nav" id="nav">${links.map(([h, l]) => `<a href="${h}"${active === h ? ' aria-current="page"' : ''}>${l}</a>`).join('')}</nav>
    <a class="btn btn--wa header__cta" href="${waLink('Hi PKG, I would like a quote.')}" target="_blank" rel="noopener">${WA_ICON}WhatsApp us</a>
    <button class="menu-btn" aria-label="Open menu" aria-expanded="false" aria-controls="nav"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7h18M3 12h18M3 17h18"/></svg></button>
  </div></header>`;
}

function footer() {
  return `<footer class="footer"><div class="wrap">
    <div class="footer__grid">
      <div><a class="logo" href="index.html">PKG<span class="logo__dot">.</span><span class="logo__sub">Packaging<br>Factory</span></a>
        <p class="muted" style="color:#c9c2b7;max-width:34ch;margin-top:16px">Custom printing and packaging for restaurants, bakeries, coffee shops, schools, fashion brands and offices.</p></div>
      <div><h4>Catalogue</h4><ul class="clean">${CATEGORIES.slice(0, 5).map((c) => `<li><a href="catalogue.html?c=${c.id}">${esc(c.name)}</a></li>`).join('')}</ul></div>
      <div><h4>Company</h4><ul class="clean"><li><a href="about.html">About us</a></li><li><a href="showroom.html">Showroom</a></li><li><a href="contact.html">Contact</a></li></ul></div>
      <div><h4>Talk to us</h4><ul class="clean">
        <li><a href="${waLink('Hi PKG, I have a question.')}" target="_blank" rel="noopener">WhatsApp ${SITE.phoneDisplay}</a></li>
        <li><a href="mailto:${SITE.email}">${SITE.email}</a></li>
        <li><a href="https://instagram.com/${SITE.instagram}" target="_blank" rel="noopener">@${SITE.instagram}</a></li></ul></div>
    </div>
    <div class="footer__bottom"><span>© ${new Date().getFullYear()} ${esc(SITE.name)}</span><span>Cash on delivery · Whish · OMT</span></div>
  </div></footer>
  <a class="wa-float" href="${waLink('Hi PKG, I would like a quote.')}" target="_blank" rel="noopener" aria-label="Chat with us on WhatsApp">${WA_ICON}</a>`;
}

/* Page renderers */
const PAGES = {
  home() {
    const featured = PRODUCTS.filter((p) => p.featured).slice(0, 8);
    document.getElementById('cats').innerHTML = CATEGORIES.map((c) => `<a class="cat reveal" href="catalogue.html?c=${c.id}">
      <span class="cat__arrow" aria-hidden="true">→</span><span class="cat__icon">${ICONS[c.icon]}</span>
      <span><span class="cat__name">${esc(c.name)}</span><span class="cat__count" style="display:block">${PRODUCTS.filter((p) => p.cat === c.id).length} products</span></span></a>`).join('');
    document.getElementById('featured').innerHTML = featured.map(card).join('');
  },
  catalogue() {
    const params = new URLSearchParams(location.search);
    let active = params.get('c') || 'all';
    let q = '';
    const chips = document.getElementById('chips');
    const grid = document.getElementById('grid');
    const count = document.getElementById('count');
    const title = document.getElementById('cat-title');
    const blurb = document.getElementById('cat-blurb');
    function render() {
      chips.innerHTML = [['all', 'All products'], ...CATEGORIES.map((c) => [c.id, c.name])]
        .map(([id, n]) => `<button class="chip" data-c="${id}" aria-pressed="${id === active}">${esc(n)}</button>`).join('');
      const list = PRODUCTS.filter((p) => (active === 'all' || p.cat === active) && (!q || (p.name + ' ' + p.desc).toLowerCase().includes(q)));
      grid.innerHTML = list.map(card).join('') || '<p class="muted">Nothing matches that search. Try another word, or message us on WhatsApp.</p>';
      count.textContent = `${list.length} product${list.length === 1 ? '' : 's'}`;
      const c = catOf(active);
      title.textContent = c ? c.name : 'Our catalogue';
      blurb.textContent = c ? c.blurb : 'Everything is made to order with your logo, colours and sizes. Pick a product and ask for a quote on WhatsApp.';
      observe();
    }
    chips.addEventListener('click', (e) => {
      const b = e.target.closest('[data-c]'); if (!b) return;
      active = b.dataset.c; history.replaceState(null, '', active === 'all' ? 'catalogue.html' : `catalogue.html?c=${active}`); render();
    });
    document.getElementById('search').addEventListener('input', (e) => { q = e.target.value.trim().toLowerCase(); render(); });
    render();
  },
  product() {
    const p = productOf(new URLSearchParams(location.search).get('p')) || PRODUCTS[0];
    const c = catOf(p.cat);
    document.title = `${p.name} | ${SITE.name}`;
    const msg = `Hi PKG, I'd like a quote for: ${p.name} (${c.name}).\nQuantity: \nSize: \nLogo/design: I'll send it here.`;
    document.getElementById('pdp').innerHTML = `
      <div class="pdp__media">${art(p)}</div>
      <div>
        <p class="crumbs"><a href="catalogue.html">Catalogue</a> / <a href="catalogue.html?c=${c.id}">${esc(c.name)}</a></p>
        <p class="eyebrow">Made to order</p>
        <h1>${esc(p.name)}</h1>
        <p class="lead">${esc(p.desc)}</p>
        <dl class="specs">
          <div><dt>Material</dt><dd>${esc(p.material)}</dd></div>
          <div><dt>Sizes</dt><dd>${esc(p.sizes)}</dd></div>
          <div><dt>Printing</dt><dd>Your logo, from one colour to full colour</dd></div>
          <div><dt>Minimum order</dt><dd>On request</dd></div>
          <div><dt>Delivery</dt><dd>All over Lebanon and the Middle East</dd></div>
        </dl>
        <div class="pdp__ctas">
          <a class="btn btn--wa btn--block" href="${waLink(msg)}" target="_blank" rel="noopener">${WA_ICON}Get a quote on WhatsApp</a>
          <a class="btn btn--ghost btn--block" href="contact.html?p=${p.id}">Send a request instead</a>
        </div>
        <p class="pdp__note">Pay by cash on delivery, Whish or OMT. We'll confirm the price and timing with you on WhatsApp.</p>
      </div>`;
    document.getElementById('related').innerHTML = PRODUCTS.filter((x) => x.cat === p.cat && x.id !== p.id).concat(PRODUCTS.filter((x) => x.featured && x.cat !== p.cat)).slice(0, 4).map(card).join('');
  },
  contact() {
    const sel = document.getElementById('f-product');
    sel.innerHTML = '<option value="">Choose a product (optional)</option>' + CATEGORIES.map((c) => `<optgroup label="${esc(c.name)}">${PRODUCTS.filter((p) => p.cat === c.id).map((p) => `<option>${esc(p.name)}</option>`).join('')}</optgroup>`).join('');
    const pre = productOf(new URLSearchParams(location.search).get('p'));
    if (pre) sel.value = pre.name;
    document.getElementById('quote-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const f = new FormData(e.target);
      const lines = ['Hi PKG, quote request from the website:', `Name: ${f.get('name')}`, `Business: ${f.get('business') || '-'}`, `Product: ${f.get('product') || '-'}`, `Quantity: ${f.get('qty') || '-'}`, `Details: ${f.get('details') || '-'}`];
      window.open(waLink(lines.join('\n')), '_blank', 'noopener');
    });
  },
};

/* Shared */
function observe() {
  const els = document.querySelectorAll('.reveal:not(.is-in)');
  if (!('IntersectionObserver' in window)) { els.forEach((el) => el.classList.add('is-in')); return; }
  const io = new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -40px 0px' });
  els.forEach((el) => io.observe(el));
}
document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.classList.add('js-anim');
  const page = document.body.dataset.page;
  document.getElementById('site-header').innerHTML = header(document.body.dataset.nav);
  document.getElementById('site-footer').innerHTML = footer();
  document.querySelectorAll('[data-wa]').forEach((a) => { a.href = waLink(a.dataset.wa || 'Hi PKG, I would like a quote.'); a.target = '_blank'; a.rel = 'noopener'; if (a.classList.contains('btn') && !a.querySelector('svg')) a.insertAdjacentHTML('afterbegin', WA_ICON); });
  document.querySelectorAll('[data-icon]').forEach((el) => { el.insertAdjacentHTML('afterbegin', ICONS[el.dataset.icon] || ''); });
  document.querySelectorAll('[data-site]').forEach((el) => { el.textContent = SITE[el.dataset.site] ?? ''; });
  const btn = document.querySelector('.menu-btn');
  btn.addEventListener('click', () => { const nav = document.getElementById('nav'); const open = nav.classList.toggle('is-open'); btn.setAttribute('aria-expanded', open); });
  if (PAGES[page]) PAGES[page]();
  observe();
});
