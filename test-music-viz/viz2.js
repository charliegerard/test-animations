var LoopVisualizer = function(){
  var freqByteData;
  var loopHolder = new THREE.Object3D();
  var material;
  var geometry, parent;

  function init(){
		freqByteData = new Uint8Array(analyser.frequencyBinCount);

    scene.add(loopHolder);
    material = new THREE.MeshNormalMaterial();

    geometry = new THREE.BoxGeometry(1,1,1);
    parent = new THREE.Object3D;
    scene.add(parent);
  }

}
