const levels = [
	// level 0
	["flag", "rock", "", "", "",
	 "fenceside", "rock", "", "", "item",
	 "", "tree", "animate", "animate", "animate",
	 "", "water", "", "horseup", "",
	 "", "fence", "", "", ""],
	
	// level 1
	["flag", "water", "", "", "",
	 "fenceside", "water", "", "", "item",
	 "animate", "bridge animate", "animate", "animate", "animate",
	 "", "water", "", "", "",
	 "", "fence", "", "horseup", ""],
	
	// level 2
	["tree", "tree", "flag", "tree", "tree",
	 "animate", "animate", "animate", "animate", "animate",
	 "water", "bridge", "water", "water", "water",
	 "", "", "", "fence", "",
	 "item", "rock", "", "", "horseup"]	
	]; // end of levels

const gridBoxes = document.querySelectorAll("#gameBoard div");
var currentLevel = 0; // starting level
var itemOn = false; // is the item on?
const noPassObstacles = ["rock", "tree", "water"];
var currentLocationOfHorse = 0;
var currentAnimation; // allows 1 animation per level
var widthOfBoard = 5;

// start game
window.addEventListener("load", function () {
	loadLevel();
});

// move horse
document.addEventListener("keydown", function (e) {
	
	switch (e.keyCode) {
		case 65: // left arrow (A)
			if (currentLocationOfHorse % widthOfBoard !== 0) {
				tryToMove("left");
			}
			break;
		case 87: // up arrow (W)
			if (currentLocationOfHorse - widthOfBoard >= 0) {
				tryToMove("up");
			}
			break;
		case 68: // right arrow (D)
			if (currentLocationOfHorse % widthOfBoard < widthOfBoard - 1) {
				tryToMove("right");
			}
			break;
		case 83: // down arrow (S)
			if (currentLocationOfHorse + widthOfBoard < widthOfBoard * widthOfBoard) {
				tryToMove("down");
			}
			break;
	} // switch
}); // key event listener

// try to move horse
function tryToMove(direction) {
	
	// location before move
	let oldLocation = currentLocationOfHorse;
	
	// class of location before move
	let oldClassName = gridBoxes[oldLocation].className;
	
	let nextLocation = 0; // location we wish to move to
	let nextClass = ""; // class of location we wish to move to
	
	let nextLocation2 = 0;
	let nextClass2 = "";
	
	let newClass = ""; // new class to switch to if move successful
	switch (direction) {
		case "left":
			nextLocation = currentLocationOfHorse - 1;
			console.log("move left");
			break;
		case "right":
			nextLocation = currentLocationOfHorse + 1;
			console.log("move right");
			break;
		case "up":
			nextLocation = currentLocationOfHorse - widthOfBoard;
			console.log("move up");
			break;
		case "down":
			nextLocation = currentLocationOfHorse + widthOfBoard;
			console.log("move down");
			break;
	} // switch
	
	nextClass = gridBoxes[nextLocation].className;
	
	// if the obstacle is not passable, don't move
	if (noPassObstacles.includes(nextClass)) { return; }
	
	// if it's a fence, and there is no item, don't move
	if (!itemOn && nextClass.includes("fence")) { return; }
	
	// if there is a fence, move two spaces with an animation
	if (nextClass.includes("fence")) {
		
		// item must be on to jump
		if (itemOn) {
			gridBoxes[currentLocationOfHorse].className = "";
			oldClassName = gridBoxes[nextLocation].className;
			
			// set values according to direction
			if (direction == "left") {
				nextClass = "jumpleft";
				nextClass2 = "horserideleft";
				nextLocation2 = nextLocation - 1;
			} else if (direction == "right") {
				nextClass = "jumpright";
				nextClass2 = "horserideright";
				nextLocation2 = nextLocation + 1;
			} else if (direction == "up") {
				nextClass = "jumpup";
				nextClass2 = "horserideup";
				nextLocation2 = nextLocation - widthOfBoard;
			} else if (direction == "down") {
				nextClass = "jumpdown";
				nextClass2 = "horseridedown";
				nextLocation2 = nextLocation + widthOfBoard;
			} 
			// show horse jumping
			gridBoxes[nextLocation].className = nextClass;
			
			setTimeout(function() {
				
				// set jump back to just a fence
				gridBoxes[nextLocation].className = oldClassName;
				
				// update current location of horse to be 2 spaces past take off
				currentLocationOfHorse = nextLocation2;
				
				// get class of box after jump
				nextClass = gridBoxes[currentLocationOfHorse].className;
				
				// show horse and item after landing
				gridBoxes[currentLocationOfHorse].className = nextClass2;
				
				// if next box is a flag, go up a level
				levelUp(nextClass);
				
			}, 350);
			return;
		} // if itemOn
		
	} // if class has fence
	
	
	
	// if there is a item, add item
	if (nextClass == "item") {
		itemOn = true;
	}
	
	// if there is a bridge in the old location keep it
	if (oldClassName.includes("bridge")) {
		gridBoxes[oldLocation].className = "bridge";
	} else {
		gridBoxes[oldLocation].className = "";
	} // else
	
	// build name of new class
	newClass = (itemOn) ? "horseride" : "horse";
	newClass += direction;
	
	// if there is a bridge in the next location, keep it
	if (gridBoxes[nextLocation].classList.contains("bridge")) {
		newClass += " bridge";
	}
	
	// move 1 space
	currentLocationOfHorse = nextLocation;
	gridBoxes[currentLocationOfHorse].className = newClass;
	
	// if it is an enemy
	if (nextClass.includes("enemy")) {
		document.getElementById("playAgain").style.display = "block";
		return;
	}
	// move up to next level if needed
	levelUp(nextClass);
	
} // tryToMove

// move up a level
function levelUp(nextClass) {
	if (nextClass == "flag" && itemOn && currentLevel != levels.length - 1) {
		document.getElementById("levelup").style.display = "block";
		clearTimeout(currentAnimation);
		setTimeout (function() {
			document.getElementById("levelup").style.display = "none";
			currentLevel++;
			loadLevel();
			
		}, 1000);
	} else if (nextClass == "flag" && itemOn && currentLevel == levels.length -1) {
		document.getElementById("playAgain").style.display = "block";
	}
	
}

// load levels 0 - maxlevel
function loadLevel(){
	let levelMap = levels[currentLevel];
	let animateBoxes;
	itemOn = false;
	
	// load board
	for (i = 0; i < gridBoxes.length; i++) {
		gridBoxes[i].className = levelMap[i];
		if(levelMap[i].includes("horse")) currentLocationOfHorse = i;
	} // for
	
	animateBoxes = document.querySelectorAll(".animate");

	animateEnemy(animateBoxes, 0, "right");
	
} // loadLevel

// animate enemy left to right (could add up and down to this)
// boxes - array of grid boxes that include animation
// index - current location of animation
// direction - current directioin of animation
function animateEnemy(boxes, index, direction) {
	
	// exit function if no animation
	if (boxes.length <= 0) { return; }
	
	// update images
	if (direction == "right") {
		boxes[index].classList.add("enemyright");
	} else {
		boxes[index].classList.add("enemyleft");
	}
	
	// remove images from other boxes
	for (i = 0; i < boxes.length; i++) {
		if (i != index){
			boxes[i].classList.remove("enemyleft");
			boxes[i].classList.remove("enemyright");
		} // if
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
	} else {
		// turn around if hit left side
		if (index == 0) {
			index++;
			direction = "right";
		} else {
			index --;
		} // else
	} // else
		
	
	

	currentAnimation = setTimeout(function() {
		animateEnemy(boxes, index, direction);
	}, 750);
} // animateEnemy