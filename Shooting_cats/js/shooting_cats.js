$(document).ready(function(){
	var movingCat = $('#shooting_cat');

	//Sound
	var catSound = new Audio("http://www.kessels.com/CatSounds/kitten4.wav");

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
	}

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

	 	for(i = 0; i <= 4; i++){
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

}); //End of document ready

