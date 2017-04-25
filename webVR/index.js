// var box = document.querySelector('a-box');
// box.getAttribute('position');
// box.addEventListener('click', function () {
//   box.setAttribute('color', 'red');
// });

AFRAME.registerComponent('cursor-listener', {
  init: function(){
    var color = 'green';
    this.el.addEventListener('click', function(evt){
      this.setAttribute('material', 'color', color);
      console.log("clicked");
    })
  }
})
