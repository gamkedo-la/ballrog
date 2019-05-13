const PAUSE_KEY = 'p';
const MUTE_KEY = 'm';
const DEBUG_KEY = 'd';


function calculateMousePos(evt) {
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	var mouseX = evt.clientX - rect.left - root.scrollLeft;
	var mouseY = evt.clientY - rect.top - root.scrollTop;
	return {
		x: mouseX,
		y: mouseY
	}
}

function setupInput() {
  document.addEventListener('keydown', keyPressed);
}

function keyPressed(evt) {
  console.log(evt);
  if (evt.key == PAUSE_KEY) {
    if (gamePaused) {
      gamePaused = false;
	  resetLetters();
    } else {
		gamePaused = true;
		var letter = new letterP(73, 300); // Initiate letters P A U S E
		letters.push(letter);
		var letter = new letterA(219, 300);
		letters.push(letter);
		var letter = new letterU(365, 300);
		letters.push(letter);
		var letter = new letterS(511, 300);
		letters.push(letter);
		var letter = new letterE(657, 300);
		letters.push(letter);
    }// end pause else
  }//end pause if 
	if(evt.key == MUTE_KEY){
		if(gameMuted){
			gameMuted = false;
		} else{
			gameMuted = true;			
		}//end muted else
	}//end muted if
	if (evt.key == DEBUG_KEY) {
		debugMode = !debugMode;
	}
	if (debugMode) {
		messageArea.innerHTML = '<strong>DEBUG MODE ENABLED</strong><br>left and right arrow keys move through levels<br>"r" key reloads current level';
		switch (evt.key) {
		case 'ArrowRight':
			currentLevelIndex++;
			if (currentLevelIndex >= LEVEL_SEQ.length) {
				currentLevelIndex = 0;
			}
			resetLevel();
			break;
		case 'ArrowLeft':
			currentLevelIndex--;
			if (currentLevelIndex < 0) {
				currentLevelIndex = LEVEL_SEQ.length - 1;
			}
			resetLevel();
			break;
		case 'r':
			resetLevel();
			break;
		}
	} else {
		messageArea.innerHTML = '';
	}
 }//end keyPressed function
