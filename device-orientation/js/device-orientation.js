$(document).ready(function(){
	var platformTop = $('#platform')[0].offsetTop;
	var platformHeight = $('#platform')[0].offsetHeight;
	var platformWidth = $('#platform')[0].offsetWidth;
	var platformLeft = $('#platform')[0].offsetLeft;
	var platformRight = platformLeft + platformWidth;
	var platformBottom = platformTop + platformHeight;

	//Generate a random number to redraw the hole at random coordinates every time.
	var randomNumber = function(min, max){
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	var drawHole = function(){
		//Draw a new whole randomly between the borders of the platform.
		$('#hole').css({
			left: randomNumber(platformLeft, platformRight - 100) + 'px',
			top: randomNumber(platformTop, platformBottom - 100) + 'px'
		})
	}

	drawHole();

	if(! window.DeviceOrientationEvent){
		alert("It seems like your device or browser does not support device orientation :/")
		return;
	}

	$(window).on('deviceorientation', function(event){
		//Change the coordinates of the ball on device orientation.
		var drawCircle = function(){
			$('#circle').css({
				marginLeft: 10 * event.originalEvent.gamma,
				marginTop: 10 * event.originalEvent.beta
			})
		}
		drawCircle();
		ballFall();
	});

	var counter = 0;
	var score = parseInt($('#score').html(counter));

	var ballFall = function(){
		//Checks if the coordinates of the ball match the ones of the hole and if so, increase the counter by 1.
		if((parseInt($('#circle')[0].style.marginLeft) >= parseInt($('#hole')[0].offsetLeft) && parseInt($('#circle')[0].style.marginLeft) <= parseInt($('#hole')[0].offsetLeft) + 100) && 
		  ((parseInt($('#circle')[0].offsetTop) >= parseInt($('#hole')[0].offsetTop) && parseInt($('#circle')[0].offsetTop) <= parseInt($('#hole')[0].offsetTop) + 100))){
		 	drawHole();
		 	counter++;
		 	$('#score').html(counter)
		 	score = parseInt($('#score').html()[0]);

		 	//Pop an alert if the user reached a score of 10.
		 	//TODO: Make something else happen in the future.
		 	if(score >= 10){
	 			alert("CONGRATS! There's actually nothing here but at least you got to play!")
			}
		}
	}
});