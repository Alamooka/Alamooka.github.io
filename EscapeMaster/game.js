const levels = [
	// level 0
	["vehicleflag", "walldnright", "wall", "wall", "wall",
	 "door", "wallupleft", "", "", "plant",
	 "", "", "", "animate", "walldnright",
	 "", "wallup", "", "animate", "wallup",
	 "robberright", "wallup", "", "animate", "item"],
	
	// level 1
	["bank", "", "", "", "cartwo",
	 "animate", "animate", "animate", "towerone", "towertwo",
	 "spike", "spike", "fence", "spike", "stationarypol",
	 "", "", "", "", "",
	 "vanup", "towerone", "car", "towertwo", "life"],
	
	// level 2
	["robberright", "", "animate", "animate", "animate",
	 "wall", "walldnleft", "plant", "", "walldnright",
	 "vehicleflag", "wallupright", "walldnleft", "", "plant",
	 "", "", "doorside", "", "wallup",
	 "tree", "", "wallup", "", "item"],	
	 
	 // level 3
	["airport", "", "", "", "animate",
	 "stationarypol", "swat", "stationarypol", "swat", "animate",
	 "", "", "", "house2", "animate",
	 "", "carthree", "", "", "vanleft",
	 "vehicledestroyer", "house3", "water", "house", "tree"],
	 
	 // level 4
	["", "doorside", "animate", "", "spikeup",
	 "", "wallup", "animate", "", "swatleft",
	 "", "wallup", "animate", "", "tower",
	 "", "wallup", "", "robberright", "",
	 "plane", "wallup", "", "propvehicletwo", "money"]
	]; // end of levels

const gridBoxes = document.querySelectorAll("#gameBoard div");
var currentLevel = 0; // starting level
var itemOn = false; // is the item on?
const noPassObstacles = ["tree", "water", "wallup", "wallupright", "wallupleft", "walldnright", "walldnleft", "wall", "plant", "towerone", "towertwo", "carone", "cartwo", "carthree", "spike", "spikeup", "stationarypol", "car", "house", "house2", "house3", "swat", "swatleft", "propvehicletwo"];
var currentLocationOfPlayer = 0;
var currentAnimation; // allows 1 animation per level
var widthOfBoard = 5;
var lives = 1; // amount of lives
var vehicleDestroy = false; // if player has the vehicle destroyer
var inMotion = false; // is the player on ramp/ in door?
var lost = false; // has player lost?

// start game
window.addEventListener("load", function () {
	loadLevel();
});

// move van or robber
document.addEventListener("keydown", function (e) {
	
	switch (e.keyCode) {
		case 65: // left arrow (A)
			if (currentLocationOfPlayer % widthOfBoard !== 0) {
				tryToMove("left");
			}
			break;
		case 87: // up arrow (W)
			if (currentLocationOfPlayer - widthOfBoard >= 0) {
				tryToMove("up");
			}
			break;
		case 68: // right arrow (D)
			if (currentLocationOfPlayer % widthOfBoard < widthOfBoard - 1) {
				tryToMove("right");
			}
			break;
		case 83: // down arrow (S)
			if (currentLocationOfPlayer + widthOfBoard < widthOfBoard * widthOfBoard) {
				tryToMove("down");
			}
			break;
	} // switch
}); // key event listener

// try to move van or robber
function tryToMove(direction) {
	
	// can't move while in ramp/door
	if (inMotion || lost) {
		return;
	}
	
	// location before move
	let oldLocation = currentLocationOfPlayer;
	
	// class of location before move
	let oldClassName = gridBoxes[oldLocation].className;
	
	let nextLocation = 0; // location we wish to move to
	let nextClass = ""; // class of location we wish to move to
	
	let nextLocation2 = 0;
	let nextClass2 = "";
	
	let newClass = ""; // new class to switch to if move successful
	
	switch (direction) {
		case "left":
			nextLocation = currentLocationOfPlayer - 1;
			break;
		case "right":
			nextLocation = currentLocationOfPlayer + 1;
			break;
		case "up":
			nextLocation = currentLocationOfPlayer - widthOfBoard;
			break;
		case "down":
			nextLocation = currentLocationOfPlayer + widthOfBoard;
			break;
	} // switch
	
	nextClass = gridBoxes[nextLocation].className;
	
	// if the obstacle is not passable, don't move
	if (vehicleDestroy == true && (nextClass == "stationarypol" || nextClass == "swat" || nextClass == "carthree")) {
		vehicleDestroy = false;
	} else if (noPassObstacles.includes(nextClass)) { return; }
	
	// if it's a fence, and there is no item, don't move
	if (!itemOn && (nextClass.includes("fence") || nextClass.includes("door"))) { return; }
	
	// if there is a fence, move two spaces with an animation
	if (nextClass.includes("fence") || nextClass.includes("door")) {
		
		inMotion = true;
		
		// item must be on to jump
		if (itemOn) {
			gridBoxes[currentLocationOfPlayer].className = "";
			oldClassName = gridBoxes[nextLocation].className;
			
			// set values according to direction
			if (direction == "left") {
				if  (isRobber() == true) {
					nextClass = "dooropenvertical";
					nextClass2 = "robberBagsleft";
 				} else {
					nextClass = "jumpleft";
					nextClass2 = "vanrideleft"; 
				} // else
				nextLocation2 = nextLocation - 1;
			} else if (direction == "right") {
				if  (isRobber() == true) {
					nextClass = "dooropenverticalin";
					nextClass2 = "robberBagsright";
 				} else {
					nextClass = "jumpright";
					nextClass2 = "vanrideright"; 
				} // else
				nextLocation2 = nextLocation + 1;
			} else if (direction == "up") {
				if  (isRobber() == true) {
					nextClass = "dooropen";
					nextClass2 = "robberBagsleft";
 				} else {
					nextClass = "jumpup";
					nextClass2 = "vanrideup"; 
				} // else
				nextLocation2 = nextLocation - widthOfBoard;
			} else if (direction == "down") {
				if  (isRobber() == true) {
					nextClass = "dooropen";
					nextClass2 = "robberBagsleft";
 				} else {
					nextClass = "jumpdown";
					nextClass2 = "vanridedown"; 
				} // else
				nextLocation2 = nextLocation + widthOfBoard;
			}
			
			// show player jumping
			gridBoxes[nextLocation].className = nextClass;
			
			setTimeout(function() {
				
				// set jump back to just a fence
				gridBoxes[nextLocation].className = oldClassName;
				
				// update current location of player to be 2 spaces past take off
				currentLocationOfPlayer = nextLocation2;
				
				// get class of box after jump
				nextClass = gridBoxes[currentLocationOfPlayer].className;
				
				// show player and item after landing
				gridBoxes[currentLocationOfPlayer].className = nextClass2;
				
				// if next box is a flag, go up a level
				levelUp(nextClass);
				
				// no longer in motion
				inMotion = false;
				
			}, 350);
			return;
		} // if itemOn
		
	} // if class has fence
	
	
	
	// if there is a item, add item
	if (nextClass == "item" || nextClass == "money") {
		itemOn = true;
	}
	
	// if there is a vehicledestroyer, add vehicledestroyer
	if (nextClass == "vehicledestroyer") {
		vehicleDestroy = true;
	}
	// if there is a life, add life
	if (nextClass == "life") {
		lives ++;
		document.getElementById("lives").setAttribute("style","background-repeat:repeat");
	}
	
	// if there is a bridge in the old location keep it
	if (oldClassName.includes("bridge")) {
		gridBoxes[oldLocation].className = "bridge";
	} else {
		gridBoxes[oldLocation].className = "";
	} // else
	
	// build name of new class
	if (isRobber() == true) {
		newClass = (itemOn) ? "robberBags" : "robber";
		if (direction == "right" || direction == "left") {
			newClass += direction;
		} else if (direction == "down" && nextClass == "money" || oldClassName.includes("enemy")){
			newClass += "right";
		} else {
			newClass = oldClassName;
		}
	} else if (vehicleDestroy == true){
			newClass = "vandestroy" + direction;
	} else {
		newClass = (itemOn) ? "vanride" : "van";
		newClass += direction;
	}
	
	// if there is a bridge in the next location, keep it
	if (gridBoxes[nextLocation].classList.contains("bridge")) {
		newClass += " bridge";
	}
	
	// move 1 space
	currentLocationOfPlayer = nextLocation;
	gridBoxes[currentLocationOfPlayer].className = newClass;
	
	// if it is an enemy
	if (nextClass.includes("enemy") || nextClass.includes("police")) {
		loseLife();
	}
	// move up to next level if needed
	levelUp(nextClass);
	
} // tryToMove

// is player a robber?
function isRobber() {
	if (levels[currentLevel].includes("robberright")){
		return true;}
	else { return false; }
} // isRobber

// if get hit lose life
function loseLife() {
	lives --;
	// if lives == 0 lose
	if (lives == 0) {
		document.getElementById("lives").className = "";
		document.getElementById("playAgain").style.display = "block";
		lost = true;
		return;
	} else {
		document.getElementById("lives").setAttribute("style","background-repeat:no-repeat");
	} // else
} // loseLife

// move up a level
function levelUp(nextClass) {
	if ((nextClass == "bank" || nextClass == "vehicleflag" || nextClass == "airport") && currentLevel != levels.length - 1) {
		document.getElementById("levelup").style.display = "block";
		clearTimeout(currentAnimation);
		setTimeout (function() {
			document.getElementById("levelup").style.display = "none";
			currentLevel++;
			loadLevel();
			
		}, 1000);
	} else if (nextClass == "plane" && currentLevel == levels.length -1) {
		document.getElementById("win").style.display = "block";
	}
	
}

// load levels 0 - maxlevel
function loadLevel(){
	let levelMap = levels[currentLevel];
	let animateBoxes;
	let animateBoxes2;
	if (isRobber() == false) { 
	itemOn = true;
	} else {
		itemOn = false;
	}
	
	// load board
	for (i = 0; i < gridBoxes.length; i++) {
		gridBoxes[i].className = levelMap[i];
		if (levelMap[i].includes("robber"))currentLocationOfPlayer = i;
		else if(levelMap[i].includes("van")) currentLocationOfPlayer = i;
	} // for
		
	animateBoxes = document.querySelectorAll(".animate");
	
	// set direction of animation
	if(currentLevel == 0 || currentLevel >= 3) {
		animateEnemy(animateBoxes, 0, "down");
	} else {
		animateEnemy(animateBoxes, 0, "right");
	}
	
	// set background image
	if(currentLevel == 0){
		document.getElementById("gameBoard").style.backgroundImage = "url(images/level1.jpg)";
	}
	else if(currentLevel == 1){
		document.getElementById("gameBoard").style.backgroundImage = "url(images/level2.jpg)";
	}
	else if(currentLevel == 2){
		document.getElementById("gameBoard").style.backgroundImage = "url(images/level3.jpg)";
	}
	else if(currentLevel == 3){
		document.getElementById("gameBoard").style.backgroundImage = "url(images/level4.png)";
	}
	else if(currentLevel == 4){
		document.getElementById("gameBoard").style.backgroundImage = "url(images/level5.jpg)";
	}
	
} // loadLevel

// animate enemy left to right (could add up and down to this)
// boxes - array of grid boxes that include animation
// index - current location of animation
// direction - current directioin of animation
function animateEnemy(boxes, index, direction) {
	let levelMap = levels[currentLevel];
	let firstLocationOfEnemy;
	
	// exit function if no animation
	if (boxes.length <= 0) { return; }
	
	// find first animate
	for (i = 0; i < gridBoxes.length; i++) {
		if (levelMap[i].includes("animate")) {
			firstLocationOfEnemy = i;
			break;
		}
	} // for
	
	// set image of enemy during animation
	if (currentLevel == 1 || currentLevel == 3) {
		enemyright = "policeright";
		enemyleft = "policeleft";
		enemyup = "policeup";
		enemydown = "policedown";
	} else if (currentLevel == 4) {
		enemyright = "enemyright"
		enemyleft = "enemyleft";
		enemyup = "enemyright";
		enemydown = "enemyright";
	} else {
		enemyright = "enemyright"
		enemyleft = "enemyleft";
		enemyup = "enemyleft";
		enemydown = "enemyleft";
	}
	
	// update images
	if (direction == "right") {
		boxes[index].classList.add(enemyright);
	} else if (direction == "left"){
		boxes[index].classList.add(enemyleft);
	} else if (direction == "up") {
		boxes[index/5].classList.add(enemyup);
	} else if (direction == "down") {
		boxes[index/5].classList.add(enemydown);
	}
	
	// if enemy hit player, lose life
	if (index + firstLocationOfEnemy == currentLocationOfPlayer) loseLife();
	
	// remove images from other boxes
	for (i = 0; i < boxes.length; i++) {
		if ((direction == "up" || direction == "down") && i != index/5){
			boxes[i].classList.remove(enemyleft);
			boxes[i].classList.remove(enemyright);
			boxes[i].classList.remove(enemyup);
			boxes[i].classList.remove(enemydown);
		} else if ((direction == "left" || direction == "right") && i != index){
			boxes[i].classList.remove(enemyleft);
			boxes[i].classList.remove(enemyright);
			boxes[i].classList.remove(enemyup);
			boxes[i].classList.remove(enemydown);
		}
	} // for
	
	//moving right
	if (direction == "right") {
		// turn around if hit right side
		if (index == boxes.length - 1){
			index--;
			direction = "left";
		} else {
			index++;
		} // else
	
	// moving left
	} else if (direction == "left"){
		// turn around if hit left side
		if (index == 0) {
			index++;
			direction = "right";
		} else {
			index --;
		} // else

	// moving up
	} else if (direction == "up"){
		// turn around if hit top side
		if (index == 0) {
			index = index + widthOfBoard;
			direction = "down";
		} else {
			index = index - widthOfBoard;
		} // else
	
	// moving down
	} else if (direction == "down"){
		// turn around if hit bottom side
		if (index == (boxes.length - 1) * widthOfBoard) {
			index = index - widthOfBoard;
			direction = "up";
		} else {
			index = index + widthOfBoard;
		} // else
	}

	currentAnimation = setTimeout(function() {
		animateEnemy(boxes, index, direction);
	}, 750);
} // animateEnemy
