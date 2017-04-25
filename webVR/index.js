// var box = document.querySelector('a-box');
// box.getAttribute('position');
// box.addEventListener('click', function () {
//   box.setAttribute('color', 'red');
// });

AFRAME.registerComponent('test', {
  schema: {default: ''},
  init() {
    const sky = document.querySelector('a-sky');
    this.el.addEventListener('click', () => {
      this.el.setAttribute('color', 'pink')
    });
  }
});
