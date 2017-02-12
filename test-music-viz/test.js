var mouseX = 0, mouseY = 0, windowHalfX = window.innerWidth / 2, windowHalfY = window.innerHeight / 2, camera, scene, renderer, material, container;
var source;
var analyser;
var buffer;
var audioBuffer;
var dropArea;
var audioContext;
var source;
var analyser;
var xhr;
var started = false;

$(document).ready(function() {
		init();
});

function init() {

	//init 3D scene
	container = document.createElement('div');
	document.body.appendChild(container);
	camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000000);
	camera.position.z = 600;
	scene = new THREE.Scene();
	scene.add(camera);
	renderer = new THREE.WebGLRenderer({
		antialias : false,
		sortObjects : false
	});
	renderer.setSize(window.innerWidth, window.innerHeight);

	container.appendChild(renderer.domElement);

	// stop the user getting a text cursor
	document.onselectStart = function() {
		return false;
	};


	//init listeners
	$("#loadSample").click( loadSampleAudio);
	$(document).mousemove(onDocumentMouseMove);
	$(window).resize(onWindowResize);
	document.addEventListener('drop', onDocumentDrop, false);
	document.addEventListener('dragover', onDocumentDragOver, false);

	onWindowResize(null);
	audioContext = new window.webkitAudioContext();

}

function loadSampleAudio() {
	$('#loading').text("loading...");

	source = audioContext.createBufferSource();
	analyser = audioContext.createAnalyser();
	analyser.smoothingTimeConstant = 0.1;
	analyser.fftSize = 1024;

	// Connect audio processing graph
	source.connect(analyser);
	analyser.connect(audioContext.destination);

	loadAudioBuffer("audio/beytah.mp3");
}

function loadAudioBuffer(url) {

	// Load asynchronously
	var request = new XMLHttpRequest();
	request.open("GET", url, true);
	request.responseType = "arraybuffer";

	request.onload = function() {


		audioContext.decodeAudioData(request.response, function(buffer) {
			audioBuffer = buffer;
			finishLoad();
		}, function(e) {
			console.log(e);
		});


	};
	request.send();


	// Load asynchronously
	// var request = new XMLHttpRequest();
	// request.open("GET", url, true);
	// request.responseType = "arraybuffer";

	// request.onload = function() {
	// 	audioBuffer = audioContext.createBuffer(request.response, false );
	// 	finishLoad();
	// };

	// request.send();
}

function finishLoad() {
	source.buffer = audioBuffer;
	source.loop = true;
	source.start(0.0);
	startViz();
}

function onDocumentMouseMove(event) {
	mouseX = (event.clientX - windowHalfX);
	mouseY = (event.clientY - windowHalfY);
}

function onWindowResize(event) {
	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
	requestAnimationFrame(animate);
	render();
}

function render() {
	LoopVisualizer.update();

	var xrot = mouseX/window.innerWidth * Math.PI*2 + Math.PI;
	var yrot = mouseY/window.innerHeight* Math.PI*2 + Math.PI;

	// LoopVisualizer.loopHolder.rotation.x += (-yrot - LoopVisualizer.loopHolder.rotation.x) * 0.3;
	// LoopVisualizer.loopHolder.rotation.y += (xrot - LoopVisualizer.loopHolder.rotation.y) * 0.3;

	renderer.render(scene, camera);
}
//
// $(window).mousewheel(function(event, delta) {
// 	//set camera Z
// 	camera.position.z -= delta * 50;
// });

function onDocumentDragOver(evt) {

	$('#loading').show();
	$('#loading').text("drop MP3...");
	evt.stopPropagation();
	evt.preventDefault();
	return false;
}

function onDocumentDrop(evt) {
	evt.stopPropagation();
	evt.preventDefault();

	//clean up previous mp3
	if (source) source.disconnect();
	LoopVisualizer.remove();

	$('#loading').show();
	$('#loading').text("loading...");

	var droppedFiles = evt.dataTransfer.files;

	var reader = new FileReader();

	reader.onload = function(fileEvent) {
		var data = fileEvent.target.result;
		initAudio(data);
	};

	reader.readAsArrayBuffer(droppedFiles[0]);

}

function initAudio(data) {
	source = audioContext.createBufferSource();

	if(audioContext.decodeAudioData) {
		audioContext.decodeAudioData(data, function(buffer) {
			source.buffer = buffer;
			createAudio();
		}, function(e) {
			console.log(e);
			$('#loading').text("cannot decode mp3");
		});
	} else {
		source.buffer = audioContext.createBuffer(data, false );
		createAudio();
	}
}


function createAudio() {

	analyser = audioContext.createAnalyser();
	analyser.smoothingTimeConstant = 0.1;
	analyser.fftSize = 1024;

	source.connect(audioContext.destination);
	source.connect(analyser);
	source.start(0);
	source.loop = true;

	startViz();
}

function startViz(){

	$('#loading').hide();

	LoopVisualizer.init();

	if (!started){
		started = true;
		animate();
	}

}
