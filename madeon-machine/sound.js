var Sound = function(url, context){
  this.playing = false;
  this.url = url;
  this.context = context;
  this.element;
};

Sound.prototype.play = function(buffer){
  this.playing = true;

  this.source = this.context.createBufferSource();
  this.source.buffer = buffer;
  this.source.connect(this.context.destination);
  this.source.onended = this.onEnded;
  this.source.start(0);
};

Sound.prototype.onEnded = function(){
  this.playing = false;
};

Sound.prototype.stop = function(){
  this.source.stop();
  console.log(activeSounds);
};
