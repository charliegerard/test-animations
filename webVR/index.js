AFRAME.registerComponent('test', {
  schema: {default: ''},
  init() {
    const sky = document.querySelector('a-sky');
    const cursor = document.getElementById("cursor");
    this.el.addEventListener('click', () => {
      // this.el.setAttribute('material', 'opacity: 1')
      // cursor.setAttribute("geometry", "radiusInner", 0.04);
      // cursor.setAttribute("geometry", "radiusOuter", 0.06);
    });
  }
});
