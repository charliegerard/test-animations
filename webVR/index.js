// var box = document.querySelector('a-box');
// box.getAttribute('position');
// box.addEventListener('click', function () {
//   box.setAttribute('color', 'red');
// });

var entity = document.querySelector('a-entity');
var model = document.getElementById('tree-obj');
model.addEventListener('model-loaded', function(){
  console.log('boo');
  // model.setAttribute('obj-model', "obj: #tree-obj; mtl: #tree-mtl")
})
