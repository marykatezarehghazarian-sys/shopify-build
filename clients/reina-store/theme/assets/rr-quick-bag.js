/*
 * Reina Reichouni quick buy: bag icon on a product card → choose size → added to bag → checkout.
 * One delegated listener for every card on the page, including cards loaded later (filters, pagination).
 */
(() => {
  if (window.rrQuickBag) return;
  window.rrQuickBag = true;

  // Horizon cards: move the quick-buy control onto the photo so it sits over the image.
  const place = (root = document) => {
    root.querySelectorAll('product-card [data-rr-qb]:not([data-placed])').forEach((qb) => {
      const gallery = qb.closest('product-card')?.querySelector('.card-gallery');
      if (gallery) gallery.appendChild(qb);
      qb.dataset.placed = '1';
    });
  };
  const closeAll = (except) => {
    document.querySelectorAll('[data-rr-qb].is-open').forEach((qb) => {
      if (qb === except) return;
      qb.classList.remove('is-open');
      qb.querySelector('.rr-qb__panel').hidden = true;
      qb.querySelector('.rr-qb__toggle').setAttribute('aria-expanded', 'false');
    });
  };

  document.addEventListener('click', async (e) => {
    const toggle = e.target.closest('.rr-qb__toggle');
    const size = e.target.closest('.rr-qb__size');
    const qb = e.target.closest('[data-rr-qb]');
    if (!qb) { closeAll(); return; }
    // Clicks inside the control never follow the card's product link.
    e.preventDefault();
    e.stopPropagation();

    if (toggle) {
      const open = !qb.classList.contains('is-open');
      closeAll(qb);
      qb.classList.toggle('is-open', open);
      qb.querySelector('.rr-qb__panel').hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
      if (open) qb.querySelector('.rr-qb__size:not([disabled])')?.focus();
      return;
    }
    if (size && !size.disabled) {
      const status = qb.querySelector('.rr-qb__status');
      qb.querySelectorAll('.rr-qb__size').forEach((b) => b.setAttribute('aria-busy', b === size ? 'true' : 'false'));
      status.textContent = 'Adding to bag…';
      try {
        const res = await fetch(`${window.Shopify?.routes?.root || '/'}cart/add.js`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ items: [{ id: Number(size.dataset.variantId), quantity: 1 }] }),
        });
        if (!res.ok) throw new Error((await res.json()).description || 'Could not add to bag');
        status.textContent = 'Added. Taking you to checkout…';
        window.location.href = '/checkout';
      } catch (err) {
        status.textContent = err.message;
        size.removeAttribute('aria-busy');
      }
    }
  }, true);

  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAll(); });
  place();
  new MutationObserver(() => place()).observe(document.documentElement, { childList: true, subtree: true });
})();
