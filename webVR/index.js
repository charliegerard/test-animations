var box = document.querySelector('a-box');
box.getAttribute('position');
box.addEventListener('click', function () {
  box.setAttribute('color', 'red');
});
