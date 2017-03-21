var soundBlocks = $('.sound');
var howls = {};
var sounds = [];
var activeSounds = [];
var inactiveSounds = [];
var soundObjects = [];
var locationBlocks = $('.location');

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
      },
      onpause: function(){
      },
      onend: function(){
      }
    });
    // Classify all sounds as inactive at first.
    inactiveSounds.push(howls[sounds[i]]);
    // Array of objects pairing howler sound object to DOM element.
    soundObjects.push({soundNode: howls[sounds[i]], element: soundBlocks[i], id: i})
  }
}

function start(){
  selectedLocation(locationBlocks[0]);

  $(document).on('click', '.sound', function(e){
    e.preventDefault();
    var blockId = e.target.dataset.id;
    var soundClicked = soundObjects[blockId].soundNode;
    var elementIndex = activeSounds.indexOf(soundClicked);

    if(activeSounds.includes(soundClicked)){
      moveSoundToCorrectArray(soundClicked, elementIndex, 'inactive');
    } else {
      moveSoundToCorrectArray(soundClicked, elementIndex, 'active');
    }
    soundObjects[blockId].element.classList.add('pending');

    if(activeSounds[0] && activeSounds[0].playing()){
      activeSounds[0].on('end', function(){
        stopInactiveSounds();
        startActiveSounds();
      });

      //If there is one sound active but not playing yet (1st sound when launching the app.)
    } else if (activeSounds[0] && !activeSounds[0].playing()) {
      activeSounds[0].play();
      changeStateOfActiveSounds(activeSounds[0]);
    } else { // If all sounds removed, stop the ones playing.
      inactiveSounds[inactiveSounds.length-1].on('end', function(){
        stopInactiveSounds();
        startActiveSounds();
      });
    }
  });

  $(document).on('click', '.location', function(e){
    e.preventDefault();
    var backgroundImage = $(e.target).css('background-image');
    var url = /^url\((['"]?)(.*)\1\)$/.exec(backgroundImage);

    $('main').css('background-image', url[0]);

    selectedLocation(e.target);
  })
}

function moveSoundToCorrectArray(sound, index, array){
  if(array === 'inactive'){
    inactiveSounds.push(sound);
    activeSounds.splice(index, 1);
  } else if (array === 'active'){
    inactiveSounds.splice(index, 1);
    activeSounds.push(sound);
  }
};

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

function selectedLocation(location){
  locationBlocks.filter(function(x){
    if(locationBlocks[x] === location){
      location.classList.add('location-selected');
    } else {
      locationBlocks[x].classList.remove('location-selected')
    }
  });
}
