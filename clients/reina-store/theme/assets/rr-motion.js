/*
 * Reina Reichouni motion layer (pairs with snippets/rr-motion.liquid).
 * Smooth scrolling, scroll reveals, parallax, magnetic buttons, custom cursor.
 * Transform/opacity only; does nothing when the visitor prefers reduced motion.
 */
(() => {
  const root = document.documentElement;
  if (!root.classList.contains('rr-motion') || window.rrMotion) return;
  window.rrMotion = true;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- Smooth scrolling (Lenis). Drawers, dialogs and sideways rails scroll natively. ---------- */
  let lenis = null;
  if (window.Lenis && fine) {
    lenis = new window.Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      smoothWheel: true,
      prevent: (node) => !!node.closest?.('dialog, [role="dialog"], .rr-rail__track, .rr-qb__panel, [data-lenis-prevent], cart-drawer-component, .menu-drawer, predictive-search-component'),
    });
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    // Pause while a modal or drawer is open so the page behind stays put.
    // Horizon marks a locked page with <html scroll-lock> (drawers, menus, modals).
    const sync = () => (root.hasAttribute('scroll-lock') || document.querySelector('dialog[open][aria-modal="true"], dialog[open]:modal') ? lenis.stop() : lenis.start());
    new MutationObserver(sync).observe(root, { attributes: true, attributeFilter: ['scroll-lock'] });
    new MutationObserver(sync).observe(document.body, { attributes: true, subtree: true, attributeFilter: ['open'] });
    window.rrLenis = lenis;
  }

  /* ---------- Scroll reveals ---------- */
  const show = (el) => { el.classList.add('is-in'); io.unobserve(el); pending.delete(el); };
  const pending = new Set();
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting || e.boundingClientRect.top < 0) show(e.target);
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
  // Safety net for fast flings: anything that has reached the viewport (or passed it) is shown.
  let sweepQueued = false;
  const sweep = () => {
    sweepQueued = false;
    for (const el of pending) if (el.getBoundingClientRect().top < innerHeight * 0.95) show(el);
  };
  addEventListener('scroll', () => { if (!sweepQueued && pending.size) { sweepQueued = true; requestAnimationFrame(sweep); } }, { passive: true });
  const below = (el) => el.getBoundingClientRect().top > innerHeight * 0.92;
  const TEXT = 'main :is(h1, h2, .rr-rail__heading, .rr-ed__caption, .rr-story__text > *, .rr-faq__item, .rr-text__body > *, .rr-contact__form > *)';
  const CARDS = 'main :is(.rr-rail__item, .product-grid__item, .rr-look__item)';
  const MASKS = 'main :is(.rr-ed__media, .rr-story__media)';
  const prep = () => {
    const groups = new Map();
    document.querySelectorAll(`${TEXT}, ${CARDS}`).forEach((el) => {
      if (el.dataset.rr) return;
      el.dataset.rr = '1';
      if (!below(el) || el.closest('.rr-hero, header, dialog')) return;
      const parent = el.parentElement;
      const i = groups.get(parent) || 0;
      groups.set(parent, i + 1);
      el.style.setProperty('--rr-delay', `${(i % 6) * 80}ms`);
      el.classList.add('rr-rv');
      pending.add(el);
      io.observe(el);
    });
    document.querySelectorAll(MASKS).forEach((el) => {
      if (el.dataset.rr) return;
      el.dataset.rr = '1';
      if (!below(el)) return;
      el.classList.add('rr-unmask');
      pending.add(el);
      io.observe(el);
    });
  };

  /* ---------- Parallax on hero and editorial photos ---------- */
  const par = new Set();
  const parIO = new IntersectionObserver((es) => es.forEach((e) => (e.isIntersecting ? par.add(e.target) : par.delete(e.target))));
  const prepPar = () => document.querySelectorAll('.rr-hero__media > :is(video, img), .rr-ed__img, .rr-story__img').forEach((el) => {
    if (el.dataset.rrPar) return;
    el.dataset.rrPar = '1';
    el.classList.add('rr-par');
    parIO.observe(el);
  });
  let ticking = false;
  const parallax = () => {
    ticking = false;
    for (const el of par) {
      const box = el.parentElement.getBoundingClientRect();
      const p = (box.top + box.height / 2 - innerHeight / 2) / (innerHeight + box.height); // -0.5 … 0.5
      const amt = el.closest('.rr-hero') ? 0.18 : 0.1;
      el.style.transform = `translate3d(0, ${(-p * box.height * amt).toFixed(1)}px, 0) scale(${1 + amt})`;
    }
  };
  const queue = () => { if (!ticking) { ticking = true; requestAnimationFrame(parallax); } };
  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', queue, { passive: true });

  /* ---------- Magnetic buttons + custom cursor (mouse only) ---------- */
  if (fine) {
    const MAG = '.button:not(.button-unstyled), .button-secondary, .shopify-payment-button__button, .rr-contact__submit, .rr-hero__link, .rr-rail__all';
    document.addEventListener('pointermove', (e) => {
      const b = e.target.closest?.(MAG);
      document.querySelectorAll('.rr-magnetic.is-pulling').forEach((x) => { if (x !== b) { x.classList.remove('is-pulling'); x.style.transform = ''; } });
      if (!b) return;
      const r = b.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / r.width, dy = (e.clientY - (r.top + r.height / 2)) / r.height;
      b.classList.add('rr-magnetic', 'is-pulling');
      b.style.transform = `translate3d(${(dx * 10).toFixed(1)}px, ${(dy * 8).toFixed(1)}px, 0)`;
    }, { passive: true });

    const cur = document.querySelector('.rr-cursor');
    if (cur) {
      root.classList.add('rr-has-cursor');
      let x = -100, y = -100, rx = -100, ry = -100;
      addEventListener('pointermove', (e) => {
        if (e.pointerType !== 'mouse') return;
        x = e.clientX; y = e.clientY;
        cur.classList.remove('is-hidden');
        cur.classList.toggle('is-hover', !!e.target.closest?.('a, button, [role="button"], label, summary, .rr-card'));
      }, { passive: true });
      document.addEventListener('pointerleave', () => cur.classList.add('is-hidden'));
      const dot = cur.querySelector('.rr-cursor__dot'), ring = cur.querySelector('.rr-cursor__ring');
      const tick = () => {
        rx += (x - rx) * 0.18; ry += (y - ry) * 0.18;
        dot.style.setProperty('--x', `${x}px`); dot.style.setProperty('--y', `${y}px`);
        ring.style.setProperty('--rx', `${rx}px`); ring.style.setProperty('--ry', `${ry}px`);
        requestAnimationFrame(tick);
      };
      tick();
    }
  }

  const init = () => { prep(); prepPar(); queue(); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  addEventListener('load', init);
  // Content added later (filters, pagination, theme editor).
  let initQueued = false;
  new MutationObserver(() => { if (initQueued) return; initQueued = true; requestAnimationFrame(() => { initQueued = false; init(); }); })
    .observe(document.querySelector('main') || document.body, { childList: true, subtree: true });
})();
