(function() {
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();

var canvas = document.getElementById('canvas');
var ctx;
var radius = 50;
var newRadius;
var source, audioContext, analyser, freqByteData;
var boost = 0;

document.addEventListener('drop', onDropEvent, false);
document.addEventListener('dragover', onDragOver, false);

audioContext = new window.webkitAudioContext();

//Three.js variables
var scene, camera, renderer, container;
var geometry, material, cube, light;

init();

function init(){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    container = document.getElementById('canvas');

    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    geometry = new THREE.BoxGeometry( 0.5, 0.5, 0.5 );
    material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    cube = new THREE.Mesh( geometry, material );
    cube.rotation.set(0.5, 0, 0);
    scene.add( cube );

    light = new THREE.SpotLight(0x404040);
    scene.add(light);

    camera.position.z = 5;
}

function render() {
	requestAnimationFrame( render );
	renderer.render( scene, camera );
}
render();



function onDragOver(e){
  e.stopPropagation();
  e.preventDefault();
  return false;
}

function onDropEvent(e){
  e.stopPropagation();
  e.preventDefault();

  var droppedFiles = event.dataTransfer.files;
  var reader = new FileReader();

  reader.onload = function(fileEvent){
    var data = fileEvent.target.result;
    initAudio(data);
  }

  reader.readAsArrayBuffer(droppedFiles[0]);
}

function initAudio(data){
  source = audioContext.createBufferSource();

  if(audioContext.decodeAudioData){
    audioContext.decodeAudioData(data, function(buffer){
      source.buffer = buffer;
      createAudio();
    }, function(e){
      console.log('cannot decode mp3');
    })
  } else {
    source.buffer = audioContext.createBuffer(data, false);
    createAudio();
  }
}

function createAudio(){
  analyser = audioContext.createAnalyser();
  analyser.smoothingTimeConstant = 0.1;
  analyser.fftSize = 1024;

  source.connect(audioContext.destination);
  source.connect(analyser);
  source.start(0);

  initViz();
}

function initViz(){
  freqByteData = new Uint8Array(analyser.frequencyBinCount);
  setInterval(function(){
    update();
  },10)
}

function update(){
  analyser.getByteFrequencyData(freqByteData);

  for(var i = 0; i < freqByteData.length; i++){
    boost += freqByteData[i];
  }
  boost = (boost / freqByteData.length);

  var k = 0;
  var scale = (freqByteData[k]  + boost)/15;

  newRadius = radius + (scale < 1 ? 1 : scale);

  k += (k < freqByteData.length ? 1 : 0);

}
