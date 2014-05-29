$(document).ready(function(){
	var platformTop = $('#platform')[0].offsetTop;
	var platformHeight = $('#platform')[0].offsetHeight;
	var platformWidth = $('#platform')[0].offsetWidth;

	var drawHole = function(){
		//Creates a new whole at random coordinates on the page on each page load.
		$('#hole').css({
			left: (Math.floor(Math.random() * (platformWidth))) + 'px',
			// top: Math.floor(Math.random() * (window.innerHeight - 500))
			// top: Math.floor(Math.random() * (window.innerHeight - (platformTop + 70) ))
			'bottom': (Math.floor(Math.random() * platformHeight - 50)) + 'px'
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
	var score = $('#score').html(counter);

	var ballFall = function(){
		//Checks if the coordinates of the ball match the ones of the hole.
		if((parseInt($('#circle')[0].style.marginLeft) >= parseInt($('#hole')[0].offsetLeft) && parseInt($('#circle')[0].style.marginLeft) <= parseInt($('#hole')[0].offsetLeft) + 100) && 
		  ((parseInt($('#circle')[0].offsetTop) >= parseInt($('#hole')[0].offsetTop) && parseInt($('#circle')[0].offsetTop) <= parseInt($('#hole')[0].offsetTop) + 100))){
		 	drawHole();
		 	counter++;
		 	var score = $('#score').html(counter);
		}
	}

	if(parseInt($('#score').html()) === 10){
	 	$('#platform').append("Yeah")
	}
});