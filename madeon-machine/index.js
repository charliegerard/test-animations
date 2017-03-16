var soundBlocks = $('.sound');
var howls = {};
var sounds = [];
var activeSounds = [];
var inactiveSounds = [];
var durationLoop;
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
        console.log('pause');
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
    if(isFirstSound){
      durationLoop = howls[sounds[blockId]].duration(blockId);
    }

    if(activeSounds.includes(soundObjects[blockId].soundNode)){
      console.log('removing');
      inactiveSounds.push(soundObjects[blockId].soundNode);
      activeSounds.splice(elementIndex, 1);

      soundObjects[blockId].element.classList.add('pending');
    } else {
      console.log('adding');
      inactiveSounds.splice(elementIndex, 1);
      activeSounds.push(soundObjects[blockId].soundNode);

      if(!isFirstSound){
        soundObjects[blockId].element.classList.add('pending');
      }
    }

    if(activeSounds[0] && activeSounds[0].playing()){
      activeSounds[0].on('end', function(){
        for(var x = 0; x < inactiveSounds.length; x++){
          inactiveSounds[x].stop();

          soundObjects.filter(function(e){
            if(e.soundNode === inactiveSounds[x] && e.element.classList.contains('pending')){
              e.element.classList.remove('pending');
              console.log(e.element);
              e.element.classList.remove('active');
            }
          });
        }

        for(var i = 0; i < activeSounds.length; i++){
          soundObjects.filter(function(e){
            if(e.soundNode === activeSounds[i] && e.element.classList.contains('pending')){
              e.element.classList.remove('pending');

            }

            if(e.soundNode === activeSounds[i] && !e.element.classList.contains('active')){
              e.element.classList.add('active');
            }
          });


          activeSounds[i].stop();
          activeSounds[i].play();
        }
      })

    } else if (activeSounds[0] && !activeSounds[0].playing()) {
      activeSounds[0].play();
      soundObjects.filter(function(e){
        if(e.soundNode === activeSounds[0] && !e.element.classList.contains('active')){
          e.element.classList.add('active');

        }
      });
    } else { // If all sounds removed, stop the ones playing.
      inactiveSounds[inactiveSounds.length-1].on('end', function(){
        for(var i = 0; i < inactiveSounds.length; i++){
          inactiveSounds[i].stop();
        }
      })
    }
  })
}

function checkIfFirstSound(){
  if(activeSounds.length === 0){
    return true;
  }
}
