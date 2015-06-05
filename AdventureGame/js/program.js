// JavaScript Document
var map = [];
map[0] = "An vicious monster.";
map[1] = "A huge castle.";
map[2] = "The edge of a mountain.";
map[3] = "A closed gate.";
map[4] = "A pathway.";
map[5] = "A demaged briage.";
map[6] = "An ancient tower.";
map[7] = "A cave.";
map[8] = "A prosperous market.";

var mapLocation = 4;

var images = [];
images[0] = "monster.png";
images[1] = "castle.png";
images[2] = "cliff.png";
images[3] = "gate.png";
images[4] = "path.png";
images[5] = "bridge.png";
images[6] = "tower.png";
images[7] = "cave.png";
images[8] = "market.png";

var blockedPathMessages = [];
blockedPathMessages[0] = "It's too dangerous to go through.";
blockedPathMessages[1] = "You are not allowed to enter the castle.";
blockedPathMessages[2] = "A cliff stop you forward.";
blockedPathMessages[3] = "The gate is locked. You can't get into.";
blockedPathMessages[4] = "";
blockedPathMessages[5] = "You can't pass through the demaged bridge.";
blockedPathMessages[6] = "The river is too deep to cross.";
blockedPathMessages[7] = "A mysterious force holds you back.";
blockedPathMessages[8] = "This is end road. You can't continue to advance.";

var helpMessages = [];
helpMessages[0] = "Maybe if you had a sword, you could kill the monster?";
helpMessages[1] = "I wonder if you could use something to open the locked door of the castle?";
helpMessages[2] = "";
helpMessages[3] = "";
helpMessages[4] = "";
helpMessages[5] = "";
helpMessages[6] = "";
helpMessages[7] = "";
helpMessages[8] = "Maybe you could use your golden to buy something in this market.This seems like a nice place for music.";

var items = ["key"];
var itemLocations = [6];

var backpack = [];

var playersInput = "";

var gameMessage = "";


var actionsIKnow = ["north", "east", "south", "west", "take", "use", "drop"];
var action = "";

var itemsIKnow = ["crown", "golden", "key", "sword"];
var item = "";


var output = document.querySelector("#output");
var input = document.querySelector("#input");
var helpoutput = document.querySelector("#helpInfo");

var image = document.querySelector("img");
//The button
var enterButton = document.querySelector("#enter");
var playButton = document.querySelector("#play");
var reloadButton = document.querySelector("#reload");
var saveButton = document.querySelector("#save");
var helpButton = document.querySelector("#help");

enterButton.addEventListener("click", enterClickHandler, false);
playButton.addEventListener("click", playClickHandler, false);
reloadButton.addEventListener("click", reloadClickHandler, false);
saveButton.addEventListener("click", saveClickHandler, false);
helpButton.addEventListener("click", helpClickHandler, false);

window.addEventListener("keydown", keydownHandler, false);

render();

function enterClickHandler()
{
  playGame();
}

function keydownHandler(event)
{

  if(event.keyCode === 13)
  {
    playGame();
  }
}

function playClickHandler()
{
	window.location.href = 'adventureGame.html';
}

function reloadClickHandler()
{
	if (typeof(Storage) != "undefined") {
		mapLocation = JSON.parse(localStorage["mapLocation"]);
		items = JSON.parse(localStorage["items"]);
		itemLocations = JSON.parse(localStorage["itemLocations"]);
		backpack = JSON.parse(localStorage["backpack"]);
		render();
	}
	else
	{
		alert("Sorry, your browser does not support Web Storage...");
	}
	
}

function saveClickHandler()
{
	if (typeof(Storage) != "undefined") {
		localStorage["mapLocation"] = mapLocation;
		localStorage["items"] = JSON.stringify(items);
		localStorage["itemLocations"] = JSON.stringify(itemLocations);
		localStorage["backpack"] = JSON.stringify(backpack);
		//localStorage["items"] = JSON.stringify(items);
	}
	else
	{
		alert("Sorry, your browser does not support Web Storage...");
	}
}

function helpClickHandler()
{
	var message = "";
	if(helpMessages[mapLocation] !== "")
	{
	  message = helpMessages[mapLocation] + " ";
	}
	message += "Try any of these words: " 
	message += "north, east, south, west, take, drop, ";
	message += "use, key, golden, sword, crown.";
	helpoutput.innerHTML=message;
}

function playGame()
{
  playersInput = input.value;
  playersInput = playersInput.toLowerCase();
  
  gameMessage = "";
  action = "";
  
  //get the player's action
  for(i = 0; i < actionsIKnow.length; i++)
  {
    if(playersInput.indexOf(actionsIKnow[i]) !== -1)
    {
      action = actionsIKnow[i];
      break;
    }
  }

  //get the player's item.
  for(i = 0; i < itemsIKnow.length; i++)
  {
    if(playersInput.indexOf(itemsIKnow[i]) !== -1)
    {
      item = itemsIKnow[i];
      console.log("player's item: " + item);
    }
  }
  
  //Choose the correct action
  switch(action)
  {
    case "north":
      if(mapLocation >= 3)
      {
        mapLocation -= 3;
      }
      else
      {
        gameMessage = blockedPathMessages[mapLocation];
      }
      break;
    
    case "east":
	    if(mapLocation % 3 != 2)
      {
        mapLocation += 1;
      }
      else
      {
        gameMessage = blockedPathMessages[mapLocation];
      }
      break;
      
    case "south":
      if(mapLocation < 6)
      {
        mapLocation += 3;
      }
      else
      {
        gameMessage = blockedPathMessages[mapLocation];
      }
      break;
      
    case "west":
      if(mapLocation % 3 != 0)
      {
        mapLocation -= 1;
      }
      else
      {
        gameMessage = blockedPathMessages[mapLocation];
      }
      break;
    		  
    case "take":
      takeItem()
		  break;
		
	case "drop":
	  dropItem();
	  break;
	  
	case "use":
	  useItem();
	  break;
		  
	default:
	  gameMessage = "I don't understand that.";
  }
  
  render();
}


function takeItem()
{
  var itemIndexNumber = items.indexOf(item);
//item exist and item is at current location
  if(itemIndexNumber !== -1 && itemLocations[itemIndexNumber] === mapLocation)
  {
//backpack can only keep two items
	if (backpack.length < 2)
	{
		if (item === "crown")
		{
		  gameMessage = "You take the " + item + ".<br>";
		  gameMessage += "<strong>"+"Congratulations! You win the game."+"</strong>";    
		  backpack.push(item);
		  items.splice(itemIndexNumber, 1);
		  itemLocations.splice(itemIndexNumber, 1);	
		  enterButton.disabled = true;
		  input.disabled = true;
		  saveButton.disabled = true;
		  reloadButton.disabled = true;	
		  helpButton.disabled = true;
		}
		else
		{
		  gameMessage = "You take the " + item + ".";    
		  backpack.push(item);
		  items.splice(itemIndexNumber, 1);
		  itemLocations.splice(itemIndexNumber, 1);
		}
	}
	else
	{
		gameMessage= "Your backpack can only keep two items. You can drop one."
	}
  }
  else
  {
    gameMessage = "You can't do that.";
  }
}


function dropItem()
{
  if(backpack.length !== 0)
  {
    var backpackIndexNumber = backpack.indexOf(item);
    if(backpackIndexNumber !== -1)		//item in backpack;
    {
   	 gameMessage = "You drop the " + item + ".";
     items.push(backpack[backpackIndexNumber]); //add the item at that location
     itemLocations.push(mapLocation); 			//
     backpack.splice(backpackIndexNumber, 1);	//remove the item from backpack
    }
    else	//item not in backpack
    {
      gameMessage = "You can't do that.";
    }
  }
  else		//the backpack is empty
  {
    gameMessage = "You're not carrying anything.";
  }
}


function useItem()
{
  var backpackIndexNumber = backpack.indexOf(item);
  if(backpackIndexNumber === -1) 	//item not in backpack 
  {
    gameMessage = "You're not carrying it.";
  }
  if(backpack.length === 0)			// backpack is empty
  {
    gameMessage += " Your backpack is empty";
  }

  if(backpackIndexNumber !== -1)
  {
	switch(item)
   {
	    case "key":
	      if(mapLocation === 1)
		  {
			gameMessage = "The door of castle is open. ";
			gameMessage += "You can enter the castle.";           
			items.push("golden");             //Add the sword to the world
			itemLocations.push(mapLocation);
		  }
		  else
		  {
			gameMessage = "You try to use the key, " 
			gameMessage += "but it can't be used for anything here.";
		  }
	      break;
	      
	    case "sword":
	      if(mapLocation === 0)
		  {
			gameMessage = "You swing the sword and kill the monster! ";
			gameMessage += "You can get the crown!";			
			items.push("crown");             //Add the crown to the world
			itemLocations.push(mapLocation);
		  }
		  else
		  {
			gameMessage = "You waste your energy.";
		  }
	      break;
	      
	    case "golden":
	      if(mapLocation === 8)
	      {
	        gameMessage = "You use golden to pay a man, he will make a sword for you.";	        
            backpack.splice(backpackIndexNumber, 1);		//remove golden from backpack
	        items.push("sword");	          //Add the sword to the world
	        itemLocations.push(mapLocation);
	      }
		  else
		  {
	        gameMessage = "You dissipate your money.";
	      }
	      break;			          
	   }
   }
}



function render()
{
  image.src = "images/"+images[mapLocation];
  output.innerHTML = map[mapLocation];
  
  for(var i = 0; i < items.length; i++)
  {
   if(mapLocation === itemLocations[i])
   {
     output.innerHTML 
      += "<br>You will find a <strong>" 
      + items[i]
      + "</strong> here.";
   }
  }

  if(backpack.length !== 0)
  {
    output.innerHTML += "<br>You are carrying: " + backpack.join(", ");  
  }
  
  output.innerHTML += "<br><em>" + gameMessage + "</em>";
  input.value = "";
  helpoutput.innerHTML="if you some help, please push the hint button";
}
