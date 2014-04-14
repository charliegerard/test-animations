$(document).ready(function(){
	//Declaring variables colors.
	var colors = ["#ccc", "#FF66CC", "#33CC33", "#993399", "#33CCFF", "#FF0000"];

	//Creates the circles.
	// var circlesFile = document.createElement("script");
	// circlesFile.type = "text/javascript"
	// circlesFile.src = "js/circles.js"

	// document.body.appendChild(circlesFile)
	// $canvas = $('#b');

	var b_canvas = document.getElementById("b");
 	var b_context = b_canvas.getContext("2d");
 	// var c_canvas = document.getElementById("circle");
 	// var c_context = c_canvas.getContext("2d");

  	window.addEventListener('resize', resizeCanvas, false);

	function resizeCanvas(){
	  	b_canvas.width = window.innerWidth;
	  	b_canvas.height = window.innerHeight;

	  	draw();
	}

	resizeCanvas();

	function draw(){
		//Creates a first canva the size of the window and fills it with black defautl color
		b_context.strokeStyle = "#eee";
		b_context.fillRect(0,0,b_canvas.width,b_canvas.height);
		b_context.fillStyle = "#ccc";
		b_context.stroke();

		//Recreates the canva to be able to change the color.
		b_context.fillRect(0,0,b_canvas.width,b_canvas.height);
		b_context.fillStyle = "#ccc";
		b_context.stroke();

		// //Create circle
		// var arc = function(x,y,r,op){
		// 	c_context.beginPath();
		// 	c_context.arc(x, y, r, 0, 2*Math.PI, false);
		// 	c_context.fillStyle = 'yellow';
	 //      	c_context.fill();
	 //      	c_context.lineWidth = 5;
	 //      	c_context.strokeStyle = 'rgba('+ getRandom(0, 255)+','+
  //                            				 getRandom(0, 255)+','+
  //                             				 getRandom(0, 255)+','+ op +')';
	 //      	c_context.stroke();
	 //      	c_context.closePath();
	 //     };
	     
	}

	function changeColor(colorIndex){
		console.log(colorIndex)

		b_context.fillRect(0,0,b_canvas.width,b_canvas.height);
		b_context.fillStyle = colors[colorIndex]; //Grey
		b_context.stroke();

		b_context.fillRect(0,0,b_canvas.width,b_canvas.height);
		b_context.fillStyle = colors[colorIndex]; //Grey
		b_context.stroke();
	}

	$(document).keydown(function(e){
			switch(e.keyCode){
				//Letter 'Q'
				case 81:
					changeColor(0); //Grey
				break;

				//Letter 'W'
				case 87:
					changeColor(1); //Pink
				break;

				//Letter 'E'
				case 69:
					changeColor(2); //Green
				break;

				//Letter 'R'
				case 82:
					changeColor(3); //Purple
					break;

				//Letter 'T'
				case 84:
					changeColor(4); //Blue
					break;

				//Letter 'Y'
				case 89:
					changeColor(5); //Red
					break;
			}
		});
});