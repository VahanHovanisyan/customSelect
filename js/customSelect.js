class CustomSelect {
  constructor(selectElem, options) {
    const defaultOptions = {
      mouseEvent: this.mouseEvent,
      turn: this.turn,
      storage: this.storage,
    };

    this._elem = selectElem;
    this._storageDate = localStorage.getItem(this._elem);
    this.options = Object.assign(defaultOptions, options);
    this.select = document.querySelector(`[data-select='${selectElem}']`);
    this.selectBtn = this.select?.querySelector('.select-btn');
    this.selectList = this.select?.querySelector('.select-list');
    this.selectOptions = this.select?.querySelectorAll('.select-option');
    this.selectInput = this.select?.querySelector('.select-input');

    if (this.isMobile.any()) this.options.mouseEvent = false;

    if (this.options.storage && this._storageDate) {
      this.selectOptions.forEach(option => {
        const isOptionSelected = option.dataset.selectValue === this._storageDate;
        option.classList.toggle('select-option-selected', isOptionSelected);
        if (isOptionSelected) {
          this.selectBtn.innerHTML = option.innerHTML;
          this.selectInput.value = option.dataset.selectValue;
        }
        isOptionSelected && this.options.turn && option.classList.add('visually-hidden');
      });
    } else { localStorage.removeItem(this._elem); }

    this.setAttributes();
    this.handleSelectEventClick = this.handleSelectEvent.bind(this);
    this.handleSelectEventKey = this.controlSelectHaveArrowKey.bind(this);
    this.selectCloseBtn = this.selectCloseBtn.bind(this);
    this.selectCloseClick = this.selectCloseClick.bind(this);

    if (this.options.mouseEvent) {
      this.select?.addEventListener('mouseenter', this.selectOpen.bind(this));
      this.select?.addEventListener('mouseleave', this.selectClose.bind(this));
    }

    this.select?.addEventListener('click', this.handleSelectEventClick);
    this.select?.addEventListener('keydown', this.handleSelectEventKey);
  }

  isMobile = {
    Android() { return navigator.userAgent.match(/Android/i); },
    BlackBerry() { return navigator.userAgent.match(/BlackBerry/i); },
    iOS() { return navigator.userAgent.match(/iPhone|iPad|iPod/i); },
    Opera() { return navigator.userAgent.match(/Opera Mini/i); },
    Windows() { return navigator.userAgent.match(/IEMobile/i); },
    any() {
      return ['Android', 'BlackBerry', 'iOS', 'Opera', 'Windows']
        .some(platform => this[platform]?.() ?? false);
    }
  };

  setAttributes() {
    this.selectBtn.type = 'button';
    this.selectBtn.setAttribute('aria-label', 'open select list');
    this.selectBtn.setAttribute('aria-controls', 'select-list');
    this.selectBtn.setAttribute('aria-expanded', 'false');
    this.selectList.id = 'select-list';
    this.selectOptions.forEach(option => option.type = 'button');
    this.selectInput?.setAttribute('hidden', 'true');
  }

  selectOpen() { return this.toggleSelect(true); }
  selectClose() { return this.toggleSelect(false); }

  selectCloseBtn(e) {
    (e.code === 'Escape' || e.code === 'Tab') && this.selectClose();
  }

  controlSelectHaveArrowKey(event) {
    const buttonIndex = Array.from(this.selectOptions).indexOf(event.target);
    const offset = event.code === 'ArrowUp' ? -1 : event.code === 'ArrowDown' ? 1 : 0;
    const nextIndex = (buttonIndex + offset + this.selectOptions.length) % this.selectOptions.length;
    this.selectOptions[nextIndex].focus();
  }

  selectCloseClick(e) { e.target !== this.selectBtn && this.selectClose(); }

  toggleSelect(open) {
    this.selectList?.classList.toggle('select-list-show', open);
    this.selectBtn?.classList.toggle('select-btn-active', open);
    this.selectBtn?.setAttribute('aria-expanded', open.toString());
    this.selectBtn?.setAttribute('aria-label', open ? 'close select list' : 'open select list');
    if (open && !this.options.mouseEvent) {
      document.body.addEventListener('click', this.selectCloseClick);
      document.body.addEventListener('keydown', this.selectCloseBtn);
    } else {
      document.body.removeEventListener('click', this.selectCloseClick);
      document.body.removeEventListener('keydown', this.selectCloseBtn);
    }
  }

  selectOption(currentOption) {
    if (this.options.turn) {
      this.selectOptions.forEach(option => option.classList.remove('visually-hidden'));
      currentOption.classList.add('visually-hidden');
    }

    if (this.options.storage) {
      localStorage.removeItem(this._elem);
      if (currentOption.dataset.selectValue === this._storageDate) {
        this.selectBtn.innerHTML = currentOption.innerHTML;
      }
      localStorage.setItem(this._elem, currentOption.dataset.selectValue);
      this.selectOptions.forEach(option => option.classList.remove('select-option-selected'));
      currentOption.classList.add('select-option-selected');
    } else {
      localStorage.removeItem(this._elem);
      this.selectOptions.forEach(option => option.classList.remove('select-option-selected'));
      currentOption.classList.add('select-option-selected');
    }

    this.selectBtn.innerHTML = currentOption.innerHTML;
    this.selectInput?.setAttribute('value', currentOption.dataset.selectValue);
    this.selectClose();
  }

  handleSelectEvent(e) {
    const currentOption = e.target.closest('.select-option');
    const currentItem = e.target.closest('.select-item');

    if (e.target === this.selectBtn) {
      if (this.selectList?.classList.contains('select-list-show') &&
        this.selectBtn?.classList.contains('select-btn-active') &&
        !this.options.mouseEvent) {
        this.selectClose();
      } else {
        this.selectOpen();
      }
    }

    currentItem && e.stopPropagation();

    currentOption && this.selectOption(currentOption);
  }
}