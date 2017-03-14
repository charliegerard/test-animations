var soundBlocks = $('.sound');
var howls = {};
var sounds = [];
var activeSounds = [];
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
  }

  $(document).on('click', '.sound', function(e){
    e.preventDefault();
    var blockId = e.target.dataset.id;

    var isFirstSound = checkIfFirstSound();
    if(isFirstSound){
      durationLoop = howls[sounds[blockId]].duration(blockId);
    }

    if(activeSounds.includes(howls[sounds[blockId]])){
      howls[sounds[blockId]].stop();
      var elementIndex = activeSounds.indexOf(howls[sounds[blockId]]);
      activeSounds.splice(elementIndex, 1);
    } else {
      activeSounds.push(howls[sounds[blockId]]);
    }

    if(activeSounds.length === 1){
      for(var i = 0; i < activeSounds.length; i++){
        activeSounds[i].play();
      }

    } else {
      activeSounds[0].on('end', function(){
        activeSounds[0].stop();
        for(var i = 0; i < activeSounds.length; i++){
          activeSounds[i].play();
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
