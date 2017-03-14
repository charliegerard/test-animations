window.onload = function(){
  var containerDiv = document.getElementById('container');
  var context;
  var sounds = document.getElementsByClassName('sound');
  var soundArray = [];
  var bufferLoader, buffersArray;
  var activeSounds = [];
  var playing = false;
  var soundObjects = [];
  var timestampFirstSound;
  var lengthLoop;

  init();

  function init() {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext();

    for(var i = 0; i < sounds.length; i++){
      soundArray.push(sounds[i].dataset.url); //Need to send the path to sound file in the bufferLoader.
      soundObjects.push(new Sound(sounds[i].dataset.url, context, i))
    }

    bufferLoader = new BufferLoader(
      context,
      soundArray,
      finishedLoading
    );

    bufferLoader.load();
  }

  function finishedLoading(bufferList) {
    buffersArray = bufferList;
    // return buffersArray;
    for(var i = 0; i < soundObjects.length; i++){
      soundObjects[i].source = context.createBufferSource();
      soundObjects[i].source.buffer = buffersArray[i];
      soundObjects[i].source.connect(context.destination);
      soundObjects[i].source.onended = onEnded;
    }

    return soundObjects;
  }

  function onEnded(){
    if(activeSounds.length == 1){
      var endFirstSound = new Date();
      var seconds = (endFirstSound - timestampFirstSound) / 1000;
      // console.log(seconds);
      lengthLoop = seconds;
    }
    // if(lengthLoop){
    //   var timer = setInterval(function(){
    //     console.log('boo');
    //     for(var i = 0; i < activeSounds.length; i++){
    //       activeSounds[i].play();
    //     }
    //   }, lengthLoop * 1000)
    // }
  }

  containerDiv.addEventListener('click', function(e){
    if(activeSounds.length === 0){
      timestampFirstSound = new Date();
    }
    e.preventDefault();
    var soundId = parseInt(e.target.dataset.id);
    if(!activeSounds.includes(soundObjects[soundId])){
      activeSounds.push(soundObjects[soundId]);
    } else {
      var indexElement = activeSounds.indexOf(soundObjects[soundId]);
      activeSounds.splice(indexElement, 1);
    }
    playSounds(activeSounds);
  });

  function playSounds(sounds){
    for(var i = 0; i < sounds.length; i++){
      sounds[i].play();
    }
  }


}
