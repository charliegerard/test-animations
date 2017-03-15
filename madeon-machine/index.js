var soundBlocks = $('.sound');
var howls = {};
var sounds = [];
var activeSounds = [];
var inactiveSounds = [];
var durationLoop;

getSoundsUrls();
init();

function getSoundsUrls(){
  for(var i = 0; i < soundBlocks.length; i++){
    sounds.push(soundBlocks[i].dataset.url);
  }
}

function init(){

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
        console.log("Finished: ", sounds[i])
      }
    })
    inactiveSounds.push(howls[sounds[i]])
  }

  $(document).on('click', '.sound', function(e){
    e.preventDefault();
    var blockId = e.target.dataset.id;

    var isFirstSound = checkIfFirstSound();
    if(isFirstSound){
      durationLoop = howls[sounds[blockId]].duration(blockId);
    }

    if(activeSounds.includes(howls[sounds[blockId]])){
      console.log('removing');
      var elementIndex = activeSounds.indexOf(howls[sounds[blockId]]);
      inactiveSounds.push(howls[sounds[blockId]]);
      activeSounds.splice(elementIndex, 1);
    } else {
      console.log('adding')
      var elementIndex = activeSounds.indexOf(howls[sounds[blockId]]);
      inactiveSounds.splice(elementIndex, 1);
      activeSounds.push(howls[sounds[blockId]]);
    }

    if(activeSounds[0]){
      if(activeSounds[0].playing()){
        activeSounds[0].on('end', function(){
          for(var x = 0; x < inactiveSounds.length; x++){
            inactiveSounds[x].stop();
          }
          if(activeSounds.length === 1){
            activeSounds[0].stop();
            activeSounds[0].play();
          } else if (activeSounds.length > 1){
            for(var i = 0; i < activeSounds.length; i++){
              activeSounds[i].stop();
              activeSounds[i].play();
            }
          }
        })
      } else {
        activeSounds[0].play();
        soundBlocks[blockId].className += ' active';
      }
    }
  })
}

function checkIfFirstSound(){
  if(activeSounds.length === 0){
    return true;
  }
}
