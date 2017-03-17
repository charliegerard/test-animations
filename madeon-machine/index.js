var soundBlocks = $('.sound');
var howls = {};
var sounds = [];
var activeSounds = [];
var inactiveSounds = [];
var soundObjects = [];

getSoundsUrls();
initSoundObjects();
start();

function getSoundsUrls(){
  for(var i = 0; i < soundBlocks.length; i++){
    sounds.push(soundBlocks[i].dataset.url);
  }
}

function initSoundObjects(){
  for(var i = 0; i < soundBlocks.length; i++){
    howls[sounds[i]] = new Howl({
      src: [soundBlocks[i].dataset.url],
      preload: true,
      loop: true,
      volume: 1,
      onplay: function(){
        console.log("Playing");
      },
      onpause: function(){
      },
      onend: function(){
        console.log("Finished: ", this._src);
      }
    });
    // Classify all sounds as inactive at first.
    inactiveSounds.push(howls[sounds[i]]);
    // Array of objects pairing howler sound object to DOM element.
    soundObjects.push({soundNode: howls[sounds[i]], element: soundBlocks[i], id: i})
  }
}

function start(){
  $(document).on('click', '.sound', function(e){
    e.preventDefault();
    var blockId = e.target.dataset.id;
    var elementIndex = activeSounds.indexOf(soundObjects[blockId].soundNode);

    var isFirstSound = checkIfFirstSound();

    // If the sound clicked is already playing, move it from the active array to the inactive one.
    // And apply the pending style.
    // Otherwise if it's inactive, move it to the active array.
    if(activeSounds.includes(soundObjects[blockId].soundNode)){
      inactiveSounds.push(soundObjects[blockId].soundNode);
      activeSounds.splice(elementIndex, 1);

      soundObjects[blockId].element.classList.add('pending');
    } else {
      inactiveSounds.splice(elementIndex, 1);
      activeSounds.push(soundObjects[blockId].soundNode);

      if(!isFirstSound){
        soundObjects[blockId].element.classList.add('pending');
      }
    }
    
    // If there is at least 1 sound and it is currently playing.
    if(activeSounds[0] && activeSounds[0].playing()){

      activeSounds[0].on('end', function(){
        stopInactiveSounds();
        startActiveSounds();
      });

      //If there is one sound added but it's not playing yet (when clicking on 1st sound when launching the app.)
    } else if (activeSounds[0] && !activeSounds[0].playing()) {
      activeSounds[0].play();
      changeStateOfActiveSounds(activeSounds[0]);
    } else { // If all sounds removed, stop the ones playing.
      inactiveSounds[inactiveSounds.length-1].on('end', function(){
        stopInactiveSounds();
      });
    }
  });
}

function checkIfFirstSound(){
  if(activeSounds.length === 0){
    return true;
  }
}

function changeStateOfInactiveSounds(sound){
  soundObjects.filter(function(e){
    if(e.soundNode === sound && e.element.classList.contains('pending')){
      e.element.classList.remove('pending');
      e.element.classList.remove('active');
    }
  });
}

function changeStateOfActiveSounds(sound){
  soundObjects.filter(function(e){
    if(e.soundNode === sound && sound === activeSounds[0]){
      e.element.classList.add('active');
    }

    if(e.soundNode === sound && !e.element.classList.contains('active')){
      e.element.classList.add('active');
    }

    if(e.soundNode === sound && e.element.classList.contains('pending')){
      e.element.classList.remove('pending');
    }
  });
}

function stopInactiveSounds(){
  for(var x = 0; x < inactiveSounds.length; x++){
    inactiveSounds[x].stop();
    changeStateOfInactiveSounds(inactiveSounds[x]);
  }
}

function startActiveSounds(){
  for(var i = 0; i < activeSounds.length; i++){
    activeSounds[i].stop();
    activeSounds[i].play();
    changeStateOfActiveSounds(activeSounds[i]);
  }
}
