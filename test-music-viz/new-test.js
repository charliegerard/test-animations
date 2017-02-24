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






















// to 32 <= FFTSIZE=2^n <= 2048. Note: in standard mode, the number of bars visible in the circle is FFTSIZE / 2. In Symmetry mode, the number of bars is equal to FFTSIZE.
// var FFTSIZE = 128;
var FFTSIZE = 256;

var audio = {
  buffer: {},
  compatibility: {},
  file: "http://s.cdpn.io/1715/the_xx_-_intro.mp3",
  proceed: true,
  playing: true,
  source: {}
};

window.AudioContext = window.AudioContext || window.webkitAudioContext;
var audioCtx = new AudioContext();

var oscillator = audioCtx.createOscillator();
var gainNode = audioCtx.createGain();

function loadSound(url) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  // Decode asynchronously
  request.onload = function() {
    context.decodeAudioData(request.response, function(buffer) {
      dogBarkingBuffer = buffer;
    }, onError);
  }
  request.send();
}

loadSound(audio.file);

function playSound(buffer) {
  var source = context.createBufferSource(); // creates a sound source
  source.buffer = buffer;                    // tell the source which sound to play
  source.connect(context.destination);       // connect the source to the context's destination (the speakers)
  source.start(0);                           // play the source now
                                             // note: on older systems, may have to use deprecated noteOn(time);
}



audio.context = new window.AudioContext();
audio.analyser = audio.context.createAnalyser();
audio.analyser.fftSize = FFTSIZE;

var playButton = document.getElementById('play-button');

if (audio.proceed) {
  (function() {
    var req = new XMLHttpRequest();
    req.open('GET', audio.file, true);
    req.responseType = 'arraybuffer';
    req.onload = function() {
      audio.context.decodeAudioData(
        req.response,
        function(buffer) {
          console.log('booooo');
          audio.buffer = buffer;
          audio.source = {};
        },
        function() {
          alert('Error decoding audio "' + audio.file + '".');
        }
      );
    };
    req.send();
  })();
}

playButton.onclick = function(){
  audio.play();
}

//-----------------
// Audio Functions
//-----------------
audio.play = function() {
  audio.playing = true;
  audio.source = audio.context.createBufferSource();
  audio.source.buffer = audio.buffer;
  audio.source.connect(audio.analyser);
  audio.analyser.connect(audio.context.destination);
  audio.start();
  // audio.source[audio.compatibility.start](0);
};

audio.stop = function() {
  // audio.source[audio.compatibility.stop](0);
  audio.playing = false;
  audio.source._startTime = audio.source.currentTime;
};
