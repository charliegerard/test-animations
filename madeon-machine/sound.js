var Sound = function(url, context, index){
  this.playing = false;
  this.url = url;
  this.context = context;
  this.element = document.getElementsByClassName('sound')[index];
  // console.log(this.element);

  this.buffer;
  this.ended = false;
};

Sound.prototype.play = function(){
  this.playing = true;
  // this.source = this.context.createBufferSource();
  // this.source.buffer = buffer;
  // this.source.connect(this.context.destination);
  // this.source.onended = this.onEnded;
  // this.source.loop = true;
  this.source.start(0);
};

// Sound.prototype.onEnded = function(){
//   this.playing = false;
//   this.ended = true;
//
//   // this.play();
//   // this.play(this.buffer);
// };

Sound.prototype.stop = function(){
  this.playing = false;
  this.source.stop();
};
