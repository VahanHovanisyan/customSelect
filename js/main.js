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

// const buttonIndex = [1,2,3,4,5];
// console.log(buttonIndex.indexOf(0));