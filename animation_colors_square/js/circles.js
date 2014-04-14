// window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame

// canvas = document.getElementById("b")
// ctx = canvas.getContext('2d')

// var originCanvas = {
//   w: canvas.width,
//   h: canvas.clientHeight
// }

// onresize = function(){
//   canvas.width = canvas.clientWidth
//   canvas.height = canvas.clientHeight
// }
// onresize()


// function getRandom(min, max) {
//   return Math.round (Math.random() * (max - min) + min) -1;
// }

// var arc = function(x,y,r,op) {
//   ctx.beginPath();
//   ctx.arc( x, y, r, 0, 2*Math.PI, false);
//   // ctx.fillStyle = '#111a22';
//   // ctx.fill();
//   ctx.lineWidth = 5;
//   ctx.strokeStyle = 'rgba('+ getRandom(0, 255)+','+
//                              getRandom(0, 255)+','+
//                              getRandom(0, 255)+','+ op +')';
//   ctx.stroke();
//   ctx.closePath();
// }


// //
// var repeat = [];
// var interval_start = 0;
// var interval_end = 3;

// // Draw
// var draw = function(){
//   for (var i = 0 ; i <repeat.length; i++) {
//     arc(repeat[i].x, repeat[i].y, repeat[i].arc, repeat[i].op);
//     repeat[i].arc = repeat[i].arc + 5;
//     repeat[i].op -= 0.1;
//     if(repeat[i].arc > repeat[i].max_arc){
//        repeat[i].arc = getRandom(1,7);
//        repeat[i].x = getRandom(0, canvas.width);
//        repeat[i].y = getRandom(0, canvas.height);
//        repeat[i].op = 1;
//     }
//   }
// }

// var generateRepeat = function(number){
//   for( var i = 0; i < number ; i++ ){
//      repeat.push({
//             arc:getRandom(1,7),
//             max_arc : getRandom(30,50),
//             x:getRandom(0, canvas.width),
//             y:getRandom(0, canvas.height),
//             op:1
//      })
//   }
// }

// var initial = function() {
//   generateRepeat(30);
//   requestAnimationFrame(loop);
// }

// loop = function(){
  
//   if(interval_start == interval_end) {
//     ctx.clearRect(0,0,canvas.width,canvas.height);
//     draw()
//     interval_start = 0;
//   } else {
//     interval_start++;
//   }
//   requestAnimationFrame(loop)
  
// }

// initial();
