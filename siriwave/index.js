window.onload = function(){

  var source;
  var audioContext;
  var analyser;
  var $siri_classic = document.getElementById('container-classic');
  var freqByteData;
  var boost = 0;
  var SW;

  document.addEventListener('drop', onDropEvent, false);
  document.addEventListener('dragover', onDragOver, false);

  audioContext = new window.webkitAudioContext();

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

      // SW = new SiriWave({
  		// 		width: window.innerWidth,
  		// 		height: window.innerHeight /1.5,
  		// 		speed: 0.12,
  		// 		amplitude: 0,
      //     frequency: 2,
  		// 		container: $siri_classic,
      //     color: '#843593',
  		// 		autostart: false,
  		// });

      SW = new SiriWave9({
        width: window.innerWidth,
        height: window.innerHeight,
        speed: 0.05,
        amplitude: 0.2,
        frequency: 0.2,
        container: $siri_classic,
        autostart: true,
      });

      SW.start();

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
    var scale = (freqByteData[k]  + boost) / 20;

    SW.setAmplitude(scale/90);
    k += (k < freqByteData.length ? 1 : 0);
  }

}
