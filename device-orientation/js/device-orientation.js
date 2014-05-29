$(document).ready(function(){

	var drawWhole = function(){
		//Creates a new whole at random coordinates on the page on each page load.
		$('#whole').css({
			left: Math.floor(Math.random() * (window.innerWidth - 100)),
			top: Math.floor(Math.random() * (window.innerHeight - 100))
		})
	}

	drawWhole();

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
		if((parseInt($('#circle')[0].style.marginLeft) >= parseInt($('#whole')[0].offsetLeft) && parseInt($('#circle')[0].style.marginLeft) <= parseInt($('#whole')[0].offsetLeft) + 80) && (parseInt($('#circle')[0].style.marginTop) >= parseInt($('#whole')[0].offsetTop) && (parseInt($('#circle')[0].style.marginTop) <= parseInt($('#whole')[0].offsetTop) + 80))){
		 	drawWhole();
		 	counter++;
		 	var score = $('#score').html(counter);
		}
	}

	if(parseInt($('#score').html()) == 1){
	 	$('#platform').html("Yeah")
	}
});