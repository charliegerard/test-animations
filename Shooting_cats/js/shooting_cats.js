$(document).ready(function(){
	var movingCat = $('#shooting_cat');

	//Sound
	var catSound = new Audio("http://www.kessels.com/CatSounds/kitten4.wav");

	var makeCats = function () {
		for(i = 0; i <= 7; i++){
			//Create x number of cats 
			var newCats = document.createElement("img");
				newCats.setAttribute("src", "http://media.giphy.com/media/67j0Iy0UzvBG8/giphy.gif")
				$(newCats).addClass('dancingCats');
				newCats.id = ('newCat' + i)
				document.getElementById("cats").appendChild(newCats)

				//Access left coordinate of each cat.
				newCats.style.left = (120 * (i+1)) + 'px';

				//Helps access each cat in the cats div
				// Store an array of cat objects, where each has the cat image as a jquery object and a speed.
				var dancingCatArray = $('.dancingCats')
				var catsArray = []
				catsArray.push(newCats)
				//console.log(catsArray[0])
		}
	};
	makeCats();

	$(window).mousemove(function(){
		var e = window.event;
		var posX = (e.clientX) - 50;
		var posY = (e.clientY);

		//Make the cat move with the movement of the mouse
		$(movingCat).css({
			left: posX,
		});

		//Stops the shooting cat from going offscreen on left and right sides.
		if(parseInt(movingCat[0].style.left) < 0){
		 	$(movingCat).css({
		 		left: 0
		 	})
		} else if(parseInt(movingCat[0].style.left) >= (window.innerWidth - 100)){
		 	$(movingCat).css({
		 		left: (window.innerWidth - 100) + 'px'       
		 	})
		}
	});

 	//Laser starts when the user clicks on the cat
	$('#shooting_cat').click(function(){
	 	var e = window.event;
	 	var newPosX = (e.clientX);
	 	var newPosY = e.clientY;

	 	//Create a new laser everytime the user clicks on the cat
	 	var newLaser = document.createElement('div')
	 	newLaser.id = "newLaser";
	 	$(newLaser).css('left', newPosX);
	 	$('#body').append(newLaser);

	 	//Add class but laser not moving up
	 	setTimeout(function () {
		 	$(newLaser).addClass('active');
		 }, 100);

	 	//Trying to make the cats fall on the screen but doesnt work
		// 	setTimeout(function () {
		// 	 $(dancingCatArray).addClass('active');
		// }, 1000);

	 	for(i = 0; i <= 7; i++){
	 		if (hitsCat(i, newPosX)) {
	 			setTimeout(function () {
		 			$(dancingCatArray[i]).hide();
		 			catSound.play(); 
		 		}, 200); 
		 		/*As below loop will return true or false as soon as the laser is shot, 
		 		and not when the laser actually touches the cat, play the sound a bit 
		 		after the laser is shot to make it more real.*/
	 			break;
	 		}
	 	}
	});

	//Function that checks if a cat is hit or not.
	//laserLeft refers to newPosX
	var hitsCat = function (i, laserLeft) {
		var $cat = $(dancingCatArray[i]);
		var catLeft = parseInt($cat.css('left'));
		var catRight = catLeft + $cat.width();
		if ($cat.is(':hidden')) {
			return false; // Already dead, no need to do anything.
		}
		if (laserLeft >= catLeft && laserLeft <= catRight) {
			return true; //If laser is shot between the left and right coordinates of the cat, execute the code in the for loop above.
		}
	}

	window.onload = function animateCats(){
		//for(var x=0; x<=7; x++){
			//$('.dancingCats')[0].style.top = '0px'
			$('.dancingCats').css('top', 0).addClass('animated');
			$('.dancingCats').each(function () {
				// Save a random speed for each cat.
				var speed = 50 + (Math.random() * 100);
				$(this).data('speed', speed);
			});
			var fallingCats = function(){
			//Makes all the cats move down at the same time
				var test = function(){
					var movingDown = parseInt($('.dancingCats').css('top'));
					// var newPosition = movingDown + 100;
					// $('.dancingCats') = newPosition + 'px'
					//$('.dancingCats').css('top', '+=100');
					$('.dancingCats').each(function () {
						$(this).css('top', '+=' + $(this).data('speed'));
					});
					  if(movingDown > (window.innerHeight * 1.5)){
					     	//clearInterval(fallingCatsTimer)
					    $('.dancingCats').remove();
						makeCats();
						animateCats();
							// $('.dancingCats').removeClass('animated').css('top', -300);
							// setTimeout(function () {
							// 	$('.dancingCats').addClass('animated');
							// }, 200);
					  }

					// $.each(dancingCatArray, function(){
					// 	//console.log(this)
					// 	//Make the cats move down
					// 	var movingDown = parseInt(this.style.top);
					// 	var newPosition = movingDown + 100;
					// 	this.style.top = newPosition + 'px'

					// 	  if(movingDown > window.innerHeight){
					// 	     	//clearInterval(fallingCatsTimer)
					// 			$('.dancingCats').removeClass('animated').css('top', -300);
					// 			setTimeout(function () {
					// 				$('.dancingCats').addClass('animated');
					// 			}, 200);
					// 	  }
					// });
				}
				var fallingCatsTimer = window.setInterval(test, 700)
			}
		//}
	return[fallingCats()];
	};
	
}); //End of document ready

