$(document).ready(function(){
	//movingCat refers to the one at the bottom.
	var movingCat = $('#shooting_cat');
	//dancingCatArray refers to the targets.
	var dancingCatArray = $('.dancingCats');

	var counter = 0;
	var score = $('#score').html(counter);

	//Sound
	var catSound = new Audio("http://www.kessels.com/CatSounds/kitten4.wav");

	var makeCats = function () {
		for(i = 0; i <= 7; i++){
			//Create a certain number of cats 
			var newCats = document.createElement("img");
				newCats.setAttribute("src", "http://media.giphy.com/media/67j0Iy0UzvBG8/giphy.gif");
				$(newCats).addClass('dancingCats');
				newCats.id = ('newCat' + i);
				document.getElementById("cats").appendChild(newCats);

				//Determines left coordinate of each cat.
				newCats.style.left = (120 * (i+1)) + 'px';

				//Helps access each cat in the cats div
				//Store an array of cat objects, where each has the cat image as a jquery object and a speed.
				var dancingCatArray = $('.dancingCats')
				var catsArray = []
				catsArray.push(newCats)
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

 	//Laser starts when the user clicks anywhere on the window.
	$(window).click(function(){
	 	var e = window.event;
	 	var newPosX = (e.clientX);
	 	var newPosY = e.clientY;

	 	//Create a new laser everytime the user clicks on the cat.
	 	var newLaser = document.createElement('div')
	 	newLaser.id = "newLaser";
	 	$(newLaser).css('left', newPosX);
	 	$('#body').append(newLaser);

	 	//Add class to the laser so it moves upwards.
	 	setTimeout(function () {
		 	$(newLaser).addClass('active');
		}, 100);

	 	//This function runs only if a cat is hit.
	 	for(i = 0; i <= 7; i++){
	 		if (hitsCat(i, newPosX)) {
	 			setTimeout(function () {
	 				//Hide the cat that's just been shot.
		 			$($('.dancingCats')[i]).hide();
		 			catSound.play(); 
		 			//Increment the score by 1 every time a cat dies.
		 			counter++;
		 			$('#score').html(counter);
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
		var $cat = $('.dancingCats')[i];
		var catLeft = $cat.offsetLeft; //Left position of the cat
		var catRight = catLeft + $cat.offsetWidth;

		// if ($cat.is(':hidden')) {
		// 	return false; // Already dead, no need to do anything.
		// }
		if (laserLeft >= catLeft && laserLeft <= catRight) {
			return true; //If laser is shot between the left and right coordinates of the cat, execute the code in the for loop above.
		}
	}

	window.onload = function animateCats(){
		//Animates the cats.
		$('.dancingCats').css('top', 0).addClass('animated');
		$('.dancingCats').each(function () {
			// Save a random speed for each cat.
			var speed = 50 + (Math.random() * 100);
			$(this).data('speed', speed);
		});

		var fallingCats = function(){
		//Makes all the cats move down at the same time
			var test = function(){
				//Get the top coordinate of the cats.
				var movingDown = parseInt($('.dancingCats').css('top'));
				//Adds the speed.
				$('.dancingCats').each(function () {
					$(this).css('top', '+=' + $(this).data('speed'));
				});

				//If all the cats go off screen, make them restart at the top.
				if(movingDown > (window.innerHeight * 1.5)){
				    $('.dancingCats').remove();
					makeCats();
					animateCats();
			    }
			}
			var fallingCatsTimer = window.setInterval(test, 700)
		}
	return[fallingCats()];
	};	
}); //End of document ready

