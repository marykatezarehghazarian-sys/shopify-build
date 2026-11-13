// Variant picker: keep hidden variant id + URL + price in sync with option selects.
document.addEventListener('change', (e) => {
  const form = e.target.closest('[data-product-form]');
  if (!form || !e.target.matches('[data-option]')) return;
  const variants = JSON.parse(form.querySelector('[data-variants]').textContent);
  const selected = [...form.querySelectorAll('[data-option]')].map((s) => s.value);
  const variant = variants.find((v) => v.options.every((o, i) => o === selected[i]));
  const button = form.querySelector('[type="submit"]');
  if (!variant) { button.disabled = true; return; }
  form.querySelector('[name="id"]').value = variant.id;
  button.disabled = !variant.available;
  const url = new URL(location.href);
  url.searchParams.set('variant', variant.id);
  history.replaceState({}, '', url);
});
