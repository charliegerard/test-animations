$(document).ready(function(){

	winWidth = window.innerWidth;
	winHeight = window.innerHeight;
	winBody = document.getElementById("body");	

	window.two = new Two({
		fullscreen: true
	}).appendTo(winBody);

	ball();
});

function ball(){
	var x = 100;
	var y = 100;
	var dx = 7;
	var dy = 7;
	var ball = two.makeCircle(x,y,50);
		ball.fill = "#33CCFF";

	two.update();

	two.bind("update", function(){
	 	if(ball.translation.x < 50 || ball.translation.x > window.innerWidth-50){
	 		dx = (-dx);
	 	} else if(ball.translation.y < 50 || ball.translation.y > window.innerHeight-50){
	 		dy = (-dy);
	 	}
	 	ball.translation.x += dx;
	 	ball.translation.y += dy;
	}).play();
}

