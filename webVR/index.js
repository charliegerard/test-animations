AFRAME.registerComponent('test', {
  schema: {default: ''},
  init() {
    const sky = document.querySelector('a-sky');
    const cursor = document.getElementById("cursor");
    this.el.addEventListener('mouseenter', (evt) => {
      evt.preventDefault();
      // Emit an event to start the cursor animation
      cursor.emit("found")
    });

    this.el.addEventListener('mouseleave', (evt) => {
      evt.preventDefault();
      // Emit an event to reset the cursor animation
      cursor.emit("lost")
    });
  }
});
