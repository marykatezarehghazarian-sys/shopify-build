class SbeaBundlePicker extends HTMLElement {
  connectedCallback() {
    this.card = this.querySelector('[data-bundle-card]');
    this.form = this.querySelector('form.sbea-bundle-card__form');
    this.variantInput = this.querySelector('[data-bundle-variant-id]');
    this.variantsScript = this.querySelector('[data-bundle-variants]');
    if (!this.card || !this.form || !this.variantInput || !this.variantsScript) return;

    try {
      this.variants = JSON.parse(this.variantsScript.textContent || '[]');
    } catch (error) {
      console.warn('SBEA bundle variants could not be parsed', error);
      return;
    }
    if (!this.variants.length) return;

    this.priceEls = this.querySelectorAll('[data-bundle-price]');
    this.compareEls = this.querySelectorAll('[data-bundle-compare]');
    this.saveEls = this.querySelectorAll('[data-bundle-save]');
    this.image = this.querySelector('.sbea-bundle-card__image');
    this.addButtons = this.querySelectorAll('[data-bundle-add]');
    this.dialog = this.querySelector('[data-bundle-sheet]');
    this.openSheetButton = this.querySelector('[data-open-bundle-sheet]');
    this.closeSheetButton = this.querySelector('[data-close-bundle-sheet]');

    const requestedId = String(this.variantInput.value || '');
    this.currentVariant =
      this.variants.find((variant) => String(variant.id) === requestedId && variant.available) ||
      this.variants.find((variant) => variant.available) ||
      this.variants[0];

    this.syncToVariant(this.currentVariant, false);

    this.addEventListener('change', this.handleOptionChange);
    this.openSheetButton?.addEventListener('click', this.openSheet);
    this.closeSheetButton?.addEventListener('click', this.closeSheet);
    this.dialog?.addEventListener('click', this.handleDialogBackdrop);
    this.dialog?.addEventListener('close', () => this.card.classList.remove('sbea-bundle-card--sheet-open'));
  }

  disconnectedCallback() {
    this.removeEventListener('change', this.handleOptionChange);
    this.openSheetButton?.removeEventListener('click', this.openSheet);
    this.closeSheetButton?.removeEventListener('click', this.closeSheet);
    this.dialog?.removeEventListener('click', this.handleDialogBackdrop);
  }

  handleOptionChange = (event) => {
    const input = event.target.closest('[data-bundle-option-input]');
    if (!input || input.disabled) return;

    const optionIndex = Number(input.dataset.optionIndex);
    const nextOptions = [...this.currentVariant.options];
    nextOptions[optionIndex] = input.value;

    let nextVariant = this.findVariant(nextOptions, true);
    if (!nextVariant) nextVariant = this.findBestAvailableVariant(optionIndex, input.value, nextOptions);

    if (!nextVariant) {
      event.preventDefault();
      this.syncToVariant(this.currentVariant, false);
      return;
    }
    this.syncToVariant(nextVariant, true);
  };

  findVariant(options, availableOnly = false) {
    return this.variants.find((variant) => {
      if (availableOnly && !variant.available) return false;
      return variant.options.every((value, index) => value === options[index]);
    });
  }

  findBestAvailableVariant(changedIndex, changedValue, preferredOptions) {
    const candidates = this.variants.filter(
      (variant) => variant.available && variant.options[changedIndex] === changedValue
    );
    if (!candidates.length) return null;

    return (
      candidates.find((variant) =>
        variant.options.every(
          (value, index) => index === changedIndex || value === preferredOptions[index]
        )
      ) || candidates[0]
    );
  }

  syncToVariant(variant, animateImage = true) {
    if (!variant) return;
    this.currentVariant = variant;
    this.variantInput.value = variant.id;

    this.querySelectorAll('[data-bundle-option-input]').forEach((input) => {
      const index = Number(input.dataset.optionIndex);
      input.checked = variant.options[index] === input.value;
    });

    this.querySelectorAll('[data-bundle-option-group]').forEach((group) => {
      const index = Number(group.dataset.optionIndex);
      const selectedLabel = group.querySelector('[data-selected-option-name]');
      if (selectedLabel) selectedLabel.textContent = variant.options[index] || '';
    });

    this.updateAvailability(variant.options);
    this.updatePrice(variant);
    this.updateImage(variant, animateImage);
    this.updateButtons(variant);
  }

  updateAvailability(selectedOptions) {
    this.querySelectorAll('[data-bundle-option-input]').forEach((input) => {
      const index = Number(input.dataset.optionIndex);
      const candidateOptions = [...selectedOptions];
      candidateOptions[index] = input.value;

      const canResolve = this.variants.some((variant) => {
        if (!variant.available) return false;
        return variant.options.every((value, optionIndex) => value === candidateOptions[optionIndex]);
      });

      input.disabled = !canResolve;
      input.dataset.optionAvailable = canResolve ? 'true' : 'false';
      input.closest('[data-bundle-option-pill]')?.classList.toggle('is-sold-out', !canResolve);
    });
  }

  updatePrice(variant) {
    this.priceEls.forEach((el) => { el.textContent = variant.priceMoney; });
    this.compareEls.forEach((el) => {
      el.textContent = variant.compareMoney || '';
      el.hidden = !variant.hasCompare;
    });
    this.saveEls.forEach((el) => {
      if (!variant.hasCompare || variant.saveAmount <= 0) {
        el.hidden = true;
        return;
      }
      el.hidden = false;
      el.textContent = this.dataset.savePrefix + ' ' + variant.saveMoney + ' (' + variant.savePercent + '%)';
    });
  }

  updateImage(variant, animate) {
    if (!this.image || !variant.image || this.image.src === variant.image) return;
    if (animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.image.animate([{ opacity: 0.55 }, { opacity: 1 }], { duration: 220, easing: 'ease-out' });
    }
    this.image.removeAttribute('srcset');
    this.image.src = variant.image;
    if (variant.imageAlt) this.image.alt = variant.imageAlt;
  }

  updateButtons(variant) {
    this.addButtons.forEach((button) => {
      button.disabled = !variant.available;
      const label = button.querySelector('[data-bundle-add-label]');
      if (label) label.textContent = variant.available ? this.dataset.addLabel : this.dataset.soldOutLabel;
    });
  }

  openSheet = () => {
    if (!this.dialog) return;
    this.card.classList.add('sbea-bundle-card--sheet-open');
    this.dialog.showModal();
  };

  closeSheet = () => { this.dialog?.close(); };

  handleDialogBackdrop = (event) => {
    if (event.target === this.dialog) this.closeSheet();
  };
}

if (!customElements.get('sbea-bundle-picker')) {
  customElements.define('sbea-bundle-picker', SbeaBundlePicker);
}
