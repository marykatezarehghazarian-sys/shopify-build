/*
 * WearPartners: 3D motion layer (pairs with wp-motion.css).
 * - Tilt on product cards (mouse only, never on touch).
 * - Hero parallax (tablet/desktop, only while the hero is on screen).
 * - Staggered fade-and-rise reveal for sections and product grids.
 * Does nothing when the visitor prefers reduced motion. No dependencies; ~3 KB.
 */
(() => {
  const root = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduce.matches) return;
  root.classList.add('wp-motion');

  const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  const wide = window.matchMedia('(min-width: 750px)');
  if (fine.matches) root.classList.add('wp-can-tilt');

  /* ---------- Tilt ---------- */
  const MAX_TILT = 6; // degrees
  const onMove = (e) => {
    if (!fine.matches) return;
    const card = e.target.closest && e.target.closest('product-card');
    if (!card) return;
    const content = card.querySelector('.product-card__content');
    if (!content) return;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.classList.add('wp-tilting');
    content.style.setProperty('--wp-ry', `${(x * MAX_TILT * 2).toFixed(2)}deg`);
    content.style.setProperty('--wp-rx', `${(-y * MAX_TILT * 2).toFixed(2)}deg`);
  };
  const onLeave = (e) => {
    const card = e.target;
    if (!(card instanceof Element) || card.localName !== 'product-card') return;
    card.classList.remove('wp-tilting');
    const content = card.querySelector('.product-card__content');
    if (content) { content.style.removeProperty('--wp-rx'); content.style.removeProperty('--wp-ry'); }
  };
  let moveQueued = null;
  document.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    if (moveQueued) { moveQueued = e; return; }
    moveQueued = e;
    requestAnimationFrame(() => { onMove(moveQueued); moveQueued = null; });
  }, { passive: true });
  document.addEventListener('pointerleave', onLeave, { capture: true, passive: true });

  /* ---------- Reveal ---------- */
  const revealIO = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.classList.add('wp-in');
      revealIO.unobserve(e.target);
      // Clear the delay once shown so later hover transitions aren't delayed.
      e.target.addEventListener('transitionend', () => e.target.style.removeProperty('--wp-delay'), { once: true });
    }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  const GRID_ITEMS = '.product-grid__item, product-list .resource-list__item, .collection-list__item, .resource-list__item';
  const belowFold = (el) => el.getBoundingClientRect().top > window.innerHeight * 0.9;

  const prepReveal = (scope) => {
    // Only hide things that start below the fold, so the first screen paints instantly.
    scope.querySelectorAll('main .shopify-section:not(.wp-r)').forEach((s) => {
      s.classList.add('wp-r');
      if (!s.querySelector(GRID_ITEMS) && belowFold(s)) {
        s.classList.add('wp-reveal');
        revealIO.observe(s);
      }
    });
    // Grid items, including ones added later by filters or "load more".
    // Staggered within each batch, resetting every 4 so long grids don't lag.
    let i = 0;
    scope.querySelectorAll(`main :is(${GRID_ITEMS}):not(.wp-r)`).forEach((it) => {
      it.classList.add('wp-r');
      if (!belowFold(it)) return;
      it.classList.add('wp-reveal');
      it.style.setProperty('--wp-delay', `${(i++ % 4) * 90}ms`);
      revealIO.observe(it);
    });
  };

  /* ---------- Hero parallax ---------- */
  const heroes = new Set();
  const heroIO = new IntersectionObserver((entries) => {
    for (const e of entries) e.isIntersecting ? heroes.add(e.target) : heroes.delete(e.target);
    queue();
  });
  let ticking = false;
  const update = () => {
    ticking = false;
    const vh = window.innerHeight;
    for (const h of heroes) {
      const r = h.getBoundingClientRect();
      // progress: 0 when the hero's top is at the top of the screen, 1 when it has scrolled away.
      const p = Math.min(1, Math.max(-1, -r.top / Math.max(r.height, vh * 0.5)));
      h.style.setProperty('--wp-par-media', `${(p * r.height * 0.18).toFixed(1)}px`);
      h.style.setProperty('--wp-par-content', `${(p * r.height * -0.08).toFixed(1)}px`);
      h.style.setProperty('--wp-par-fade', Math.max(0, 1 - Math.max(0, p) * 1.1).toFixed(3));
    }
  };
  const queue = () => { if (!ticking && heroes.size) { ticking = true; requestAnimationFrame(update); } };
  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue, { passive: true });

  const prepParallax = (scope) => {
    if (!wide.matches) return;
    scope.querySelectorAll('.hero:not(.wp-parallax)').forEach((h) => {
      if (!h.querySelector('.hero__media-wrapper :is(img, video)')) return;
      h.classList.add('wp-parallax');
      heroIO.observe(h);
    });
  };

  const init = (scope = document) => { prepReveal(scope); prepParallax(scope); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => init());
  else init();

  // Products added later (filters, infinite scroll, "load more") and theme editor reloads.
  let initQueued = false;
  new MutationObserver((muts) => {
    if (initQueued || !muts.some((m) => m.addedNodes.length)) return;
    initQueued = true;
    requestAnimationFrame(() => { initQueued = false; init(); });
  }).observe(document.querySelector('main') || document.body, { childList: true, subtree: true });
  document.addEventListener('shopify:section:load', () => init());

  // If the visitor switches on reduced motion mid-visit, show everything and stop.
  reduce.addEventListener?.('change', (e) => {
    if (!e.matches) return;
    document.querySelectorAll('.wp-reveal').forEach((el) => el.classList.add('wp-in'));
    root.classList.remove('wp-motion', 'wp-can-tilt');
  });
})();
