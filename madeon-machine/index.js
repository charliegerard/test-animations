window.onload = function(){
  var containerDiv = document.getElementById('container');
  var context;
  var sounds = document.getElementsByClassName('sound');
  var soundArray = [];
  var bufferLoader, buffersArray;
  var activeSounds = [];
  var playing = false;
  var soundObjects = [];

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
    playing = false;
    for(var i = 0; i < activeSounds.length; i++){
      soundObjects[i].play();
    }
  }

  containerDiv.addEventListener('click', function(e){
    activeSounds = [];
    var soundId = parseInt(e.target.dataset.id);
    activeSounds.push(soundId);

    console.log(soundObjects[e.target.dataset.id].element);

    if(!soundObjects[soundId].playing){
      soundObjects[soundId].play();
    } else {
      soundObjects[soundId].stop();
    }

    // for(var i = 0; i < activeSounds.length; i++){
    //   if(!soundObjects[i].playing){
    //
    //     soundObjects[i].play(buffersArray[activeSounds[i]]);
    //     // playSound(soundObjects[activeSounds[i]]);
    //   } else {
    //     soundObjects[i].stop();
    //   }
    // }
  });
}
