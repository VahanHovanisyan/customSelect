class CustomSelect {
  constructor(selectElem, options) {
    let defaultOptions = {
      mouseEvent : this.mouseEvent,
      turn: this.turn,
      storage: this.storage,
      elem: selectElem
    }
    this.options = Object.assign(defaultOptions, options)
    this.select = document.querySelector(`[data-select='${selectElem}']`);
    this.selectBtn = this.select?.querySelector('.select-btn');
    this.selectList = this.select?.querySelector('.select-list');
    this.selectOptions = this.select?.querySelectorAll('.select-option');
    this.selectInput = this.select?.querySelector('.select-input');

    if (this.options.storage && localStorage.getItem(this.options.elem)) {
      this.selectBtn.textContent = localStorage.getItem(this.options.elem);
    } else {
      localStorage.removeItem(this.options.elem);
    }
    
    this.setAttributes();
    this.handleSelectEvent = this.handleSelectEvent.bind(this);
    this.selectCloseBtn = this.selectCloseBtn.bind(this);
    this.selectCloseClick = this.selectCloseClick.bind(this);

    if (this.options.mouseEvent) {
      this.select?.addEventListener('mouseenter', this.selectOpen.bind(this));
      this.select?.addEventListener('mouseleave', this.selectClose.bind(this));
    }

    this.select?.addEventListener('click', this.handleSelectEvent);
  }

  setAttributes() {
    this.selectBtn.setAttribute('aria-label', 'open select list');
    this.selectBtn.setAttribute('aria-controls', 'select-list');
    this.selectBtn.setAttribute('aria-expanded', 'false');
    this.selectList.id = 'select-list';
  }

  toggleSelect(open) {
    this.selectList.classList.toggle('select-list-show', open);
    this.selectBtn.classList.toggle('select-btn-active', open);
    this.selectBtn.setAttribute('aria-expanded', open.toString());
    this.selectBtn.type = open ? 'button' : 'submit';
  }

  selectOpen() {
    this.toggleSelect(true);
    document.addEventListener(this.options.mouseEvent ? 'mouseenter' : 'click', this.selectCloseClick);
    if (!this.options.mouseEvent) {
      document.addEventListener('keydown', this.selectCloseBtn);
    }
  }

  selectClose() {
    this.toggleSelect(false);
    document.removeEventListener(this.options.mouseEvent ? 'mouseenter' : 'click', this.selectCloseClick);
    if (!this.options.mouseEvent) {
      document.removeEventListener('keydown', this.selectCloseBtn);
    }
  }

  selectOption(currentOption) {
    currentOption.type = 'button';
    if (this.options.turn) {
      this.selectOptions.forEach(option => {option.hidden = false});
      currentOption.hidden = true;
    }
    if (this.options.storage) {
      localStorage.removeItem(this.options.elem);
      this.selectBtn.textContent = localStorage.getItem(this.options.elem);
      localStorage.setItem(this.options.elem,currentOption.dataset.selectValue);
    } else  {
      localStorage.removeItem(this.options.elem);
    }
    this.selectBtn.textContent = currentOption.textContent;
    this.selectInput.value = currentOption.dataset.selectValue;
    this.selectClose();
  }

  handleSelectEvent(e) {
    const currentOption = e.target.closest('.select-option');
    const currentItem = e.target.closest('.select-item');

    if (e.target === this.selectBtn) {
      this.selectOpen();
    }

    if (currentItem) {
      e.stopPropagation();
    }

    if (currentOption) {
      this.selectOption(currentOption);
    }
  }

  selectCloseBtn(e) {
    if (e.key === 'Escape' || e.key === 'Tab') {
      console.log('btn');
      this.selectClose();
    }
  }

  selectCloseClick(e) {
    if (e.target !== this.selectBtn) {
      console.log('click');
      this.selectClose();
    }
  }
}