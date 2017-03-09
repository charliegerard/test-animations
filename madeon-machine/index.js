window.onload = function(){
  var containerDiv = document.getElementById('container');
  var context;
  var sounds = document.getElementsByClassName('sound');
  var soundArray = [];
  var bufferLoader, buffersArray;
  var activeSounds = [];
  var playing = false;
  var soundObjects = [];

  var firstSoundPlaying;

  init();

  function init() {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext();

    for(var i = 0; i < sounds.length; i++){
      // loadSound(sounds[i].dataset.url);

      soundArray.push(sounds[i].dataset.url);
      soundObjects.push(new Sound(sounds[i].dataset.url, context))
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
    return soundObjects;
  }

  // function onEnded(){
  //   console.log('ended');
  //   playing = false;
  //   for(var i = 0; i < activeSounds.length; i++){
  //     playSound(buffersArray[i]);
  //   }
  // }

  containerDiv.addEventListener('click', function(e){
    var soundId = parseInt(e.target.dataset.id);
    activeSounds.push(soundId);
    soundObjects[soundId].element = document.getElementsByClassName('sound')[soundId];

    for(var i = 0; i < activeSounds.length; i++){
      if(!soundObjects[i].playing){
        soundObjects[i].play(buffersArray[activeSounds[i]]);
        // playSound(soundObjects[activeSounds[i]]);
      } else {
        soundObjects[i].stop();
      }
    }
  });
}
