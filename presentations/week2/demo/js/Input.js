const PAUSE_KEY = 'p';
const MUTE_KEY = 'm';
const DEBUG_KEY = 'd';
const EDIT_KEY = 'e';
const DEATH_KEY = 'q';
let didInteract = false;

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
  didInteract = true;
  if (evt.key == PAUSE_KEY) {
    if (gamePaused) {
      gamePaused = false;
	  resetLetters();
    } else {
		var letter;
		gamePaused = true;
		letter = new letterP(73, 300); // Initiate letters P A U S E
		letters.push(letter);
		letter = new letterAA(219, 300);
		letters.push(letter);
		letter = new letterU(365, 300);
		letters.push(letter);
		letter = new letterS(511, 300);
		letters.push(letter);
		letter = new letterEE(657, 300);
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
	if (evt.key == DEATH_KEY) {
		canvas.dispatchEvent(outaLivesEvent);
	}
	if (evt.key == EDIT_KEY) {
		levelEditor.enabled = !levelEditor.enabled;
	}
	if (levelEditor.enabled) {
		initLevelEditor();
		messageArea.innerHTML = '<strong>LEVEL EDITOR ENABLED</strong>';
	} else if (debugMode) {
		messageArea.innerHTML = '<strong>DEBUG MODE ENABLED</strong><br>left and right arrow keys move through levels<br>"r" key reloads current level';
		switch (evt.key) {
		case 'm': // debug test multiball
			startMultiBall(4);
			break;
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
