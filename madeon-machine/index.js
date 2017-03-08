window.onload = function(){
  var containerDiv = document.getElementById('container');
  var timer = 0;
  var context, soundBuffer;
  var timerDiv = document.getElementById('counter');
  var sounds = document.getElementsByClassName('sound');
  var soundArray = [];
  var bufferLoader;
  var buffersArray;
  var activeSounds = [];

  function BufferLoader(context, urlList, callback) {
    this.context = context;
    this.urlList = urlList;
    this.onload = callback;
    this.bufferList = new Array();
    this.loadCount = 0;
  }

  BufferLoader.prototype.loadBuffer = function(url, index) {
    // Load buffer asynchronously
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    var loader = this;

    request.onload = function() {
      // Asynchronously decode the audio file data in request.response
      loader.context.decodeAudioData(
        request.response,
        function(buffer) {
          if (!buffer) {
            alert('error decoding file data: ' + url);
            return;
          }
          loader.bufferList[index] = buffer;
          if (++loader.loadCount == loader.urlList.length)
            loader.onload(loader.bufferList);
        },
        function(error) {
          console.error('decodeAudioData error', error);
        }
      );
    }

    request.onerror = function() {
      alert('BufferLoader: XHR error');
    }
    request.send();
  }

  BufferLoader.prototype.load = function() {
    for (var i = 0; i < this.urlList.length; ++i)
    this.loadBuffer(this.urlList[i], i);
  }

  function init() {
    // Fix up prefixing
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext();

    for(var i = 0; i < sounds.length; i++){
      // loadSound(sounds[i].dataset.url);
      soundArray.push(sounds[i].dataset.url);
    }

    bufferLoader = new BufferLoader(
      context,
      soundArray,
      finishedLoading
      );

    bufferLoader.load();
  }

  init();

  function finishedLoading(bufferList) {
    buffersArray = bufferList;
    return buffersArray;
  }

  function playSound(buffer){
    var source = context.createBufferSource(); // creates a sound source
    source.buffer = buffer;                 // tell the source which sound to play
    source.connect(context.destination);
    // source.loop = true;      // connect the source to the context's destination (the speakers)
    source.onended = onEnded;
    source.start(0);                         // play the source now
  }

  function onEnded(){
    console.log('ended');
    for(var i = 0; i < activeSounds.length; i++){
      playSound(buffersArray[i]);
    }
  }

  containerDiv.addEventListener('click', function(e){
    activeSounds.push(parseInt(e.target.dataset.id));

    for(var i = 0; i < activeSounds.length; i++){
      playSound(buffersArray[activeSounds[i]]);
    }
  });
}
