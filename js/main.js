

const customSelect1 = new CustomSelect('select', {
  mouseEvent: true,
  storage: true,
  turn: true
});
const customSelect = new CustomSelect('select2');



// let isMobile = {
//   Android() {
//     return navigator.userAgent.match(/Android/i);
//   },
//   BlackBerry() {
//     return navigator.userAgent.match(/BlackBerry/i);
//   },
//   iOS() {
//     return navigator.userAgent.match(/iPhone|iPad|iPod/i);
//   },
//   Opera() {
//     return navigator.userAgent.match(/Opera Mini/i);
//   },
//   Windows() {
//     return navigator.userAgent.match(/IEMobile/i);
//   },
//   any() {
//     return (
//       this.Android() ||
//       this.BlackBerry() ||
//       this.iOS() ||
//       this.Opera() ||
//       this.Windows());
//   }
// };

// if (isMobile.any()) {
//   document.body.classList.add('page__body_mobile')
// } else {
//   document.body.classList.remove('page__body_mobile')
// }