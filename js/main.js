if (document.querySelector("[data-select='select']")) {
  const customSelect1 = new CustomSelect('select');
}

if (document.querySelector("[data-select='select2']")) {
  const customSelect = new CustomSelect('select2', {
    storage: true,
    turn: true,
    mouseEvent: true
  });
}