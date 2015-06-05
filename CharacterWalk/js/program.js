// JavaScript Document

var smurf = {
	//The tilesheet image, its size, and the number of columns it has
	IMAGE: "images/smurf_sprite.png",
	SIZE: 128,
	COLUMNS: 4,	
  
	//The numbers of the animation frames and the starting frame
	numberOfFrames: 15,
	currentFrame: 0,
	
	//Properties of the animation frames's x and y positions on the tile sheet. They're 0 when this object first loads
	sourceX: 0,
	sourceY: 0,  
	
	//A variable to control the direction of the loop   
	forward: 0,
	backward: 1,
	state: 0,  
	
	// location of smurf in canvas
	x: 0,
	y: 160,
  
	speed: 3,    // speed is 3 pixels
	
	updateAnimation: function() {	
		//Figure out the smurf's state
		if(this.state == this.forward && this.x > canvas.width-this.SIZE){
				this .state = this.backward;
				this.currentFrame = 0;
		}
		else if (this.state == this.backward && this.x < 0){
				this .state = this.forward;
				this.currentFrame = 0;
		}
		else {
				if (this.currentFrame == this.numberOfFrames)
					this.currentFrame = 0;
				else
					this.currentFrame++;
		}
		
		// Change the behavior of smurf based on the state
		switch(this.state) {
			case this.forward:
				this.x+=this.speed;
				this.sourceX = Math.floor(this.currentFrame % this.COLUMNS) * this.SIZE;
				this.sourceY = Math.floor(this.currentFrame / this.COLUMNS) * this.SIZE;
				break;
			case this.backward:
				this.x-=this.speed;
				this.sourceX = Math.floor(this.currentFrame % this.COLUMNS) * this.SIZE;
				this.sourceY = Math.floor(this.currentFrame / this.COLUMNS) * this.SIZE+512;
				//alert(this.sourceX+","+this.sourceY);
				break;				
		}		
	}	
};

//get canvas context
var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");

var resetButton = document.querySelector("#reset");
resetButton.addEventListener("click", resetClickHandler, false);


// Load image
var smurfImage = new Image();
smurfImage.src = smurf.IMAGE;
smurfImage.addEventListener("load", loadHandler, false);


function loadHandler() {
	// Start the animation loop (walks indefinitely)
	animationLoop();
}

// Game animation loop
function animationLoop() {
  //Set a timer to call animationLoop every 50 milliseconds
  setTimeout(animationLoop, 50);
  
  //Update the smurf's animation frames
  smurf.updateAnimation();
  
  //Render the animation
  render();
}


// Draw smurf 
function render() {
	// Clear context
    ctx.clearRect( 0, 0, canvas.width, canvas.height);
    // Draw new smurf state
	ctx.drawImage(
	smurfImage,
	smurf.sourceX, smurf.sourceY, smurf.SIZE, smurf.SIZE, 
	smurf.x, smurf.y, smurf.SIZE, smurf.SIZE );
}

function resetClickHandler() {
	window.location.href = 'CharacterWalk.html';
}