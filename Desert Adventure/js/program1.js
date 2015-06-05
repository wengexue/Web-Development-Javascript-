// JavaScript Document
var stage = document.querySelector("#stage");
var output = document.querySelector("#output");
var playButton = document.querySelector("#playButton");
var musicSwitch = document.querySelector("#musicSwitch");
var direction = document.querySelector("#direction");
var Music = document.getElementsByName("Music");
var aud = document.getElementById("myAudio"); 


playButton.addEventListener("click", clickHandler, false);
//Music.addEventListener("onchange", radioChangeHandler, false);

//Add a keyboard listener
window.addEventListener("keydown", keydownHandler, false);


//The game map
var map =
[
  [0, 2, 0, 0, 0, 0, 0, 3],
  [0, 0, 0, 1, 0, 2, 0, 0],
  [0, 2, 0, 0, 0, 0, 0, 0],
  [1, 0, 0, 0, 2, 0, 1, 0],
  [0, 0, 0, 1, 0, 0, 0, 0],
  [0, 2, 0, 0, 0, 1, 0, 0],
  [0, 0, 1, 0, 2, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]
];

//The game objects map
var gameObjects =
[
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 5, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [4, 0, 0, 0, 0, 0, 0, 0]
];

//Map code
var DESERT = 0;
var WATER = 1;
var BANDIT = 2;
var HOME = 3;
var EXPLORER = 4;
var MONSTER = 5;

//The size of each cell
var SIZE = 64;

//The number of rows and columns
var ROWS = map.length;
var COLUMNS = map[0].length;

//Arrow key codes
var UP = 38;
var DOWN = 40;
var RIGHT = 39;
var LEFT = 37;

//setting the explorer's and monster's start positions
var explorerRow;
var explorerColumn;
var monsterRow;
var monsterColumn;

for(var row = 0; row < ROWS; row++) 
{	
  for(var column = 0; column < COLUMNS; column++) 
  {
    if(gameObjects[row][column] === EXPLORER)
    { 
      explorerRow = row;
      explorerColumn = column;
    }
	if(gameObjects[row][column] === MONSTER)
    { 
      monsterRow = row;
      monsterColumn = column;
    }
  }
}

//The game variables
var water = 12;
var gold = 12;
var experience = 0;
var gameMessage = "Use the arrow keys to find your way home.";

render();


function clickHandler(){
	aud.play();
	//playButton.remove();
	//direction.remove();
	//playButton.style.visibility="hidden";
	//direction.style.visibility="hidden";
	playButton.style.display="none";
	direction.style.display="none";
	stage.style.visibility="visible";
	musicSwitch.style.visibility="visible";
}


function radioChangeFunction(){
	for(var i = 0; i < Music.length; i++){
		if (Music.item(i).checked == true && Music.item(i).value == 0){
			aud.pause();
			//let radio button lose focus.
			Music.item(0).blur();
			Music.item(1).blur();						
		}
		else {
			aud.play();
			//let radio button lose focus.
			Music.item(0).blur();
			Music.item(1).blur();						
		}
	}
}


function keydownHandler(event)
{
  switch(event.keyCode)
  {
	case UP:
	
	//Find out if the EXPLORER's move will be within the playing field
	  if(explorerRow > 0)
	  {
		//If it is, clear the EXPLORER's current cell
		gameObjects[explorerRow][explorerColumn] = 0;
		
		//Subract 1 from the EXPLORER's row to move it up one row on the map
		explorerRow--;
		
		//Apply the EXPLORER's new updated position to the array
		gameObjects[explorerRow][explorerColumn] = EXPLORER;
	  }
	  break;
	
	case DOWN:
	  if(explorerRow < ROWS - 1)
	  {
		gameObjects[explorerRow][explorerColumn] = 0;
		explorerRow++;
		gameObjects[explorerRow][explorerColumn] = EXPLORER;
	  }
	  break;
	  
	case LEFT:
	  if(explorerColumn > 0)
	  {
		gameObjects[explorerRow][explorerColumn] = 0;
		explorerColumn--;
		gameObjects[explorerRow][explorerColumn] = EXPLORER;
	  }
	  break;  
	  
	case RIGHT:
	  if(explorerColumn < COLUMNS - 1)
	  {
		gameObjects[explorerRow][explorerColumn] = 0;
		explorerColumn++;
		gameObjects[explorerRow][explorerColumn] = EXPLORER;
	  }
	  break; 
  }
  //find out what kind of cell the explorer is on
  switch(map[explorerRow][explorerColumn])
  {
    case DESERT:
      gameMessage = "You walk in the desert";
      break;
    
    case WATER:
	  trade();
      console.log("water");
      break; 
    
    case BANDIT:
	  fight();
      console.log("bandit");
      break; 
      
    case HOME:
	  endGame();
      console.log("home");
      break;    
  }
  
  //Move the monster
  moveMonster();
  
  //Find out if the explorer is touching the monster
  if(gameObjects[explorerRow][explorerColumn] === MONSTER)
  {
    endGame();
  }
  
  //Subtract some water each turn
  water--;
  
  //Find out if the explorer has run out of water or gold
  if(water <= 0 || gold <= 0)
  {
    endGame();
  }  
  render();
}


function moveMonster()
{
  //The 4 possible directions that the monster can move
  var UP = 1;
  var DOWN = 2;
  var LEFT = 3;
  var RIGHT = 4;
  
  //An array to store the valid direction that the monster is allowed to move in
  var validDirections = [];
  
  //The final direction that the monster will move in
  var direction = undefined;
  
  //Find out what kinds of things are in the cells that surround the monster. If the cells contain desert, push the corresponding direction into the validDirections array
  if(monsterRow > 0)
  {
    var thingAbove = map[monsterRow - 1][monsterColumn];
    if(thingAbove === DESERT)
	  {
	    validDirections.push(UP)
	  }
  }
  if(monsterRow < ROWS - 1)
  { 
    var thingBelow = map[monsterRow + 1][monsterColumn];
    if(thingBelow === DESERT)
	  {
	    validDirections.push(DOWN)
	  }
  }
  if(monsterColumn > 0)
  {
    var thingToTheLeft = map[monsterRow][monsterColumn - 1];
    if(thingToTheLeft === DESERT)
	  {
	    validDirections.push(LEFT)
	  }
  } 
  if(monsterColumn < COLUMNS - 1)
  {
    var thingToTheRight = map[monsterRow][monsterColumn + 1];
    if(thingToTheRight === DESERT)
	  {
	    validDirections.push(RIGHT)
	  }
  } 
  
  //The validDirections array now contains 0 to 4 directions that the contain DESERT cells. Which of those directions will the monster choose to move in? If a valid direction was found, Randomly choose one of the possible directions and assign it to the direction variable
  if(validDirections.length !== 0)
  {
    var randomNumber = Math.floor(Math.random() * validDirections.length);
    direction = validDirections[randomNumber];
  }
  
  //Move the monster in the chosen direction
  switch(direction)
  {
    case UP:
      //Clear the monster's current cell
	  gameObjects[monsterRow][monsterColumn] = 0;
	  //Subtract 1 from the monster's row
	  monsterRow--; 
	  //Apply the monster's new updated position to the array
	  gameObjects[monsterRow][monsterColumn] = MONSTER;
	  break;
	  
	case DOWN:
	  gameObjects[monsterRow][monsterColumn] = 0;
	  monsterRow++;
	  gameObjects[monsterRow][monsterColumn] = MONSTER;
      break;
	  
	case LEFT:
	  gameObjects[monsterRow][monsterColumn] = 0;
	  monsterColumn--;
	  gameObjects[monsterRow][monsterColumn] = MONSTER;
	  break;
	 
	case RIGHT:
	  gameObjects[monsterRow][monsterColumn] = 0;
	  monsterColumn++;
	  gameObjects[monsterRow][monsterColumn] = MONSTER;
  }
}


function trade()
{
  //Figure out how much water in this place has and how much it should cost
  var placeWater = experience + gold;
  var cost = Math.ceil(Math.random() * placeWater);
  
  //Let the player buy water if there's enough gold to afford it
  if(gold > cost)
  {
    water += placeWater;
    gold -= cost;
    experience += 2;
    
    gameMessage 
      = "You buy " + placeWater + " water"
      + " for " + cost + " gold pieces."
  }
  else
  {
    //Tell the player if they don't have enough gold
    experience += 1;
    gameMessage = "You don't have enough gold to buy water."
  }
}

function fight()
{
  //The explorer strength
  var explorerStrength = Math.ceil((water + gold) / 2);
  
  //A random number between 1 and the explorer's strength
  var banditStrength = Math.ceil(Math.random() * explorerStrength * 2);
  
  if(banditStrength > explorerStrength)
  {
    //The bandit rob gold from the explorer
    var robbedGold = Math.round(banditStrength / 2);
    gold -= robbedGold;
    
    //Give the player some experience for trying  
    experience += 1;
    
    //Update the game message
    gameMessage 
      = "You fight and LOSE " + robbedGold + " gold pieces."
      + " explorer's strength: " + explorerStrength 
      + " bandit's strength: " + banditStrength;
  }
  else
  {
    //You win the bandit's gold
    var banditStrength = Math.round(banditStrength / 2);
    gold += banditStrength;
    
    //Add some experience  
    experience += 2;
    
    //Update the game message
    gameMessage 
      = "You fight and WIN " + banditStrength + " gold pieces."
      + " explorer's strength: " + explorerStrength 
      + " bandit's strength: " + banditStrength;
  } 
}

function endGame()
{
  if(map[explorerRow][explorerColumn] === HOME)
  {
    //Calculate the score
    var score = water + gold + experience;
    
    //Display the game message
    gameMessage 
      = "You made it home ALIVE! " + "Final Score: " + score; 
  }
  else if(gameObjects[explorerRow][explorerColumn] === MONSTER)
  {
    gameMessage 
      = "The explorer has been swallowed by a desert monster!";
  }
  else
  {
    //Display the game message if the player has run out of gold or water
    if(gold <= 0)
    {
      gameMessage += " You've run out of gold!"; 
    }
    else
    {
      gameMessage += " You've run out of water!"; 
    }
    
    gameMessage 
      += " You feel so tired!"; 
  }
  
  //Remove the keyboard listener to end the game
  window.removeEventListener("keydown", keydownHandler, false);
  //stop the music
  aud.pause();
  //music radio disable
  Music.item(1).checked=true;
  Music.item(0).disabled=true;  
  Music.item(1).disabled=true;
}


function render(){
  //Clear the stage of img tag cells from the previous turn
  
  if(stage.hasChildNodes())
  {
    for(var i = 0; i < ROWS * COLUMNS; i++) 
    {	 
      stage.removeChild(stage.firstChild);
    }
  }
  
  //Render the game by looping through the map arrays
  for(var row = 0; row < ROWS; row++) 
  {	
    for(var column = 0; column < COLUMNS; column++) 
    { 
      //Create a img tag called cell
      var cell = document.createElement("img");

      //Set it's CSS class to "cell"
      cell.setAttribute("class", "cell");

      //Add the img tag to the <div id="stage"> tag
      stage.appendChild(cell);

      //Find the correct image for this map cell
      switch(map[row][column])
      {
        case DESERT:
          cell.src = "images/desert1.png";
          break;

        case WATER:
          cell.src = "images/water1.png";
          break; 

        case BANDIT:
          cell.src = "images/bandit1.png";
          break; 

        case HOME:
          cell.src = "images/home1.png";
          break;   
      } 
      //Add the explorer from the gameObjects array
	  switch(gameObjects[row][column])
	  {
	    case EXPLORER:
	      cell.src = "images/explorer1.png";
	      break; 
	    case MONSTER:
	      cell.src = "images/monster1.png";
	      break;    
	  }
      //Position the cell 
      cell.style.top = row * SIZE + "px";
      cell.style.left = column * SIZE + "px";
    }
  }
  //Display the game message
  output.innerHTML = gameMessage;
  
  //Display the player's water, gold, and experience
  output.innerHTML 
	+= "<br>Gold: " + gold + ", Water: " 
	+ water + ", Experience: " + experience;
}    

