class CustomSelect {
  constructor(selectElem, options) {
    let defaultOptions = {
      mouseEvent: this.mouseEvent,
      turn: this.turn,
      storage: this.storage,
    }
    this._elem = selectElem;
    this.options = Object.assign(defaultOptions, options);
    this.select = document.querySelector(`[data-select='${selectElem}']`);
    this.selectBtn = this.select?.querySelector('.select-btn');
    this.selectList = this.select?.querySelector('.select-list');
    this.selectOptions = this.select?.querySelectorAll('.select-option');
    this.selectInput = this.select?.querySelector('.select-input');

    if (this.isMobile.any()) {
      this.options.mouseEvent = false;
    }

    if (this.options.storage && localStorage.getItem(this._elem)) {
      this._storageDate = localStorage.getItem(this._elem);
      this.selectOptions.forEach(option => {
        if (option.dataset.selectValue === localStorage.getItem(this._elem)) {
          option.classList.add('select-option-selected');
          this.selectBtn.innerHTML = option.innerHTML;
          this.selectInput.value = option.dataset.selectValue
        } else {
          option.classList.remove('select-option-selected');
        }
        if (option.dataset.selectValue === localStorage.getItem(this._elem) && this.options.turn) {
          option.style.cssText = this.selectOptionTurnStyle;
        }
      });
    } else {
      localStorage.removeItem(this._elem);
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

  selectOptionTurnStyle = `
  position: absolute;
	width: 1px;
	height: 1px;
	margin: -1px;
	border: 0;
	padding: 0;
	white-space: nowrap;
	clip-path: inset(100%);
	clip: rect(0 0 0 0);
	overflow: hidden;
  `

  isMobile = {
    Android() {
      return navigator.userAgent.match(/Android/i);
    },
    BlackBerry() {
      return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS() {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera() {
      return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows() {
      return navigator.userAgent.match(/IEMobile/i);
    },
    any() {
      return (
        this.Android() ||
        this.BlackBerry() ||
        this.iOS() ||
        this.Opera() ||
        this.Windows());
    }
  };

  setAttributes() {
    this.selectBtn.type = 'button';
    this.selectBtn.setAttribute('aria-label', 'open select list');
    this.selectBtn.setAttribute('aria-controls', 'select-list');
    this.selectBtn.setAttribute('aria-expanded', 'false');
    this.selectList.id = 'select-list';
    this.selectOptions.forEach(option => option.type = 'button');
    if (this.selectInput) {
      this.selectInput.hidden = true;
    }
  }

  selectOpen() {
    this.toggleSelect(true);
  }

  selectClose() {
    this.toggleSelect(false);
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

  toggleSelect(open) {
    this.selectList.classList.toggle('select-list-show', open);
    this.selectBtn.classList.toggle('select-btn-active', open);
    this.selectBtn.setAttribute('aria-expanded', open.toString());
    this.selectBtn.setAttribute('aria-label', open ? 'close select list' : 'open select list');
    if (open && !this.options.mouseEvent) {
      document.addEventListener('click', this.selectCloseClick);
      document.addEventListener('keydown', this.selectCloseBtn);
    }
    else {
      document.removeEventListener('click', this.selectCloseClick);
      document.removeEventListener('keydown', this.selectCloseBtn);
    }
  }

  selectOption(currentOption) {
    if (this.options.turn) {
      this.selectOptions.forEach(option => option.style.cssText = '');
      currentOption.style.cssText = this.selectOptionTurnStyle;
    }
    if (this.options.storage) {
      localStorage.removeItem(this._elem);
      if (currentOption.dataset.selectValue === localStorage.getItem(this._elem)) {
        this.selectBtn.innerHTML = currentOption.innerHTML;
      }
      localStorage.setItem(this._elem, currentOption.dataset.selectValue);
      this.selectOptions.forEach(option => option.classList.remove('select-option-selected'));
      currentOption.classList.add('select-option-selected')
    } else {
      localStorage.removeItem(this._elem);
      this.selectOptions.forEach(option => option.classList.remove('select-option-selected'));
      currentOption.classList.add('select-option-selected');
    }
    this.selectBtn.innerHTML = currentOption.innerHTML;
    if (this.selectInput) {
      this.selectInput.value = currentOption.dataset.selectValue;
    }
    this.selectClose();
  }

  handleSelectEvent(e) {
    const currentOption = e.target.closest('.select-option');
    const currentItem = e.target.closest('.select-item');

    if (e.target === this.selectBtn) {
      if (this.selectList.classList.contains('select-list-show') &&
        this.selectBtn.classList.contains('select-btn-active') &&
        !this.options.mouseEvent) {
        this.selectClose();
      }
      else {
        this.selectOpen();
      }
    }

    if (currentItem) {
      e.stopPropagation();
    }

    if (currentOption) {
      this.selectOption(currentOption);
    }
  }
}