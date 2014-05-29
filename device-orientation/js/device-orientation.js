$(document).ready(function(){
	var platformTop = $('#platform')[0].offsetTop;
	var platformHeight = $('#platform')[0].offsetHeight;
	var platformWidth = $('#platform')[0].offsetWidth;
	var platformLeft = $('#platform')[0].offsetLeft;
	var platformRight = platformLeft + platformWidth;
	var platformBottom = platformTop + platformHeight;

	var randomNumber = function(min, max){
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	var drawHole = function(){
		//Creates a new whole at random coordinates on the page on each page load.
		$('#hole').css({
			left: randomNumber(platformLeft, platformRight - 100) + 'px',
			top: randomNumber(platformTop, platformBottom - 100) + 'px'
		})
	}

	drawHole();

	if(! window.DeviceOrientationEvent){
		return;
	}

	$(window).on('deviceorientation', function(event){
		//console.log(event.originalEvent.alpha, event.originalEvent.beta, event.originalEvent.gamma);
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
		//Checks if the coordinates of the ball match the ones of the hole.
		if((parseInt($('#circle')[0].style.marginLeft) >= parseInt($('#hole')[0].offsetLeft) && parseInt($('#circle')[0].style.marginLeft) <= parseInt($('#hole')[0].offsetLeft) + 100) && 
		  ((parseInt($('#circle')[0].offsetTop) >= parseInt($('#hole')[0].offsetTop) && parseInt($('#circle')[0].offsetTop) <= parseInt($('#hole')[0].offsetTop) + 100))){
		 	drawHole();
		 	counter++;
		 	$('#score').html(counter)
		 	score = parseInt($('#score').html()[0]);

		 	if(score >= 10){
	 			//$('#platform').append("<p>" + 'CONGRATS! There\'s actually nothing there but at least you got to play!' + "</p>")
	 			alert("CONGRATS! There's actually nothing here but at least you got to play!")
			}
		}
	}

});