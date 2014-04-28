$(document).ready(function(){

	//Sound
	var catSound = new Audio("http://www.kessels.com/CatSounds/kitten4.wav");
		catSound.addEventListener("ended", function(){
			catSound.currentTime = 0
			// console.log("sound ended")
		});

	for(i = 0; i <= 4; i++){
		//Create 5 images 
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
	var movingCat = $('#shooting_cat');
	var e = window.event;
	var posX = (e.clientX) - 50;
	var posY = (e.clientY);

	//Make the cat move with the movement of the mouse
	$(movingCat).css({
		left: posX,
	});

	//Trying to make the cat stay fully in screen.
	if(parseInt(movingCat[0].style.left) < 0){
	 	$(movingCat).css({
	 		left: 0
	 	})
	} else if(parseInt(movingCat[0].style.left) >= 1200){
	 	$(movingCat).css({ //The else statement doesnt seem to work.
	 		right: 0       // The cat is not stopped once reaching the right border of the window.
	 	})
	}
});

	//Create laser using CSS instead of javascript
	// var laserMoveUp = function(){
	// 	var e = window.event;
	// 	var newPosX = (e.clientX)

	// 	var newlaser = document.createElement('div');
	// 		newlaser.id = "ball";
	// 		$(newlaser).css({
	// 			left: newPosX
	// 		})
	// 		$('#body').append(newlaser);

	// 	$('#shooting_cat').click(function(){
	// 		$(newlaser).addClass('active');
	// 	});
	// }


 //Laser starts when the user clicks on the cat
$('#shooting_cat').click(function(){
	//laserMoveUp()

	var movingCat = $('#shooting_cat');
 	var e = window.event;

 	//Create a new laser everytime the user clicks on the cat
 	var newLaser = document.createElement('div')
 	newLaser.id = "newLaser"
 	$(newLaser).addClass('active');
 	$('#body').append(newLaser)

 	var newPosX = (e.clientX);
 	var newPosY = e.clientY;
 	console.log("I just clicked the cat")
 	newLaser.style.top = (window.innerHeight - 50) + 'px';

 	//Other way to fire the lasers
 	 var laserMove = function(){
	  	var laserUp = function(){
	  		var movingUp = parseInt(newLaser.style.top);
	  		var newPosition = movingUp - 100;
	  		newLaser.style.top = newPosition + 'px';

	  		if (newPosition <= -100) {
	  			$(newLaser).remove();
	  			clearInterval(laserUpTimer);
	  		}

	 		//Should allow to shoot each cat separately but does not seem to work
		 	for(i = 0; i <= 4; i++){
		 		console.log("Cat " + i + " is between " + parseInt(dancingCatArray[i].style.left) + " and  " + (parseInt(dancingCatArray[i].style.left) + parseInt(dancingCatArray[i].width)))
		 		if(hitsCat(i, newLaser)) {
		 			$(dancingCatArray[i]).hide();
		 			catSound.play(); 
		 			break;
		 		}

		 	}
	 	}
	 	var laserUpTimer = window.setInterval(laserUp, 50);
	}

	laserMove();

 	//Sets the initial left position of newLaser
 	 $(newLaser).css({
 	 	left: newPosX
 	 })
});

var hitsCat = function (i, newLaser) {
	return (parseInt(newLaser.style.top) <= dancingCatArray[i].height) &&
		   ((parseInt(newLaser.style.left) >= parseInt(dancingCatArray[i].style.left)) && 
		   	(parseInt(newLaser.style.left) <= (parseInt(dancingCatArray[i].style.left) + parseInt(dancingCatArray[i].width))));
}

}); //End of document ready

