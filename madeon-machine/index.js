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
        // When a sound is playing, add the class `active` to change the background color.
        for(var i = 0; i < soundBlocks.length; i++){
          if(this._src === soundBlocks[i].dataset.url && !soundBlocks[i].classList.contains('active')){
            soundBlocks[i].classList.add('active');
          }
        }
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
    } else {
      console.log('adding');
      inactiveSounds.splice(elementIndex, 1);
      activeSounds.push(soundObjects[blockId].soundNode);
    }

    // if(activeSounds.includes(howls[sounds[blockId]])){
    //   console.log('removing');
    //   inactiveSounds.push(howls[sounds[blockId]]);
    //   activeSounds.splice(elementIndex, 1);
    // } else {
    //   console.log('adding');
    //   inactiveSounds.splice(elementIndex, 1);
    //   activeSounds.push(howls[sounds[blockId]]);
    // }

    if(activeSounds[0] && activeSounds[0].playing()){
      activeSounds[0].on('end', function(){
        for(var x = 0; x < inactiveSounds.length; x++){
          inactiveSounds[x].stop();
          for(var y = 0; y < soundObjects.length; y++){
            console.log(soundObjects[y].id === blockId);
            if(soundObjects[y].id === blockId && soundObjects[y].element.classList.contains('active')){
              console.log('getting here?');
              soundObjects[y].element.classList.remove('active');
            }
          }

          // for(var i = 0; i < soundBlocks.length; i++){
          //   if(soundBlocks[i].dataset.url === inactiveSounds[x]._src){
          //     if(soundBlocks[i].classList.contains('active')){
          //
          //       soundBlocks[i].classList.remove('active');
          //     }
          //   }
          // }
        }

        for(var i = 0; i < activeSounds.length; i++){
          activeSounds[i].stop();
          activeSounds[i].play();
        }
      })
      
    } else if (activeSounds[0] && !activeSounds[0].playing()) {
      activeSounds[0].play();
    } else { // If all sounds removed, stop the ones playing.
      console.log('here?');
      inactiveSounds[inactiveSounds.length-1].on('end', function(){
        for(var i = 0; i < inactiveSounds.length; i++){
          inactiveSounds[i].stop();
        }
      })
    }

    // // If there is at least one active sound
    // if(activeSounds[0]){
    //   if(activeSounds[0].playing()){
    //     activeSounds[0].on('end', function(){
    //       for(var x = 0; x < inactiveSounds.length; x++){
    //         for(var i = 0; i < soundBlocks.length; i++){
    //           if(soundBlocks[i].dataset.url === inactiveSounds[x]._src){
    //             if(soundBlocks[i].classList.contains('active')){
    //               console.log('should remove');
    //               soundBlocks[i].classList.remove('active');
    //             }
    //           }
    //         }
    //         inactiveSounds[x].stop();
    //       }
    //
    //       if(activeSounds.length === 1){
    //         activeSounds[0].stop();
    //         activeSounds[0].play();
    //       } else if (activeSounds.length > 1){
    //         for(var i = 0; i < activeSounds.length; i++){
    //           activeSounds[i].stop();
    //           activeSounds[i].play();
    //         }
    //       }
    //     })
    //   } else {
    //     activeSounds[0].play();
    //   }
    // }
  })
}

function checkIfFirstSound(){
  if(activeSounds.length === 0){
    return true;
  }
}
