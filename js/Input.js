const PAUSE_KEY = 'p';
const MUTE_KEY = 'm';
const MULTIBALL_KEY = 'b';
const DEBUG_KEY = 'd';
const EDIT_KEY = 'e';
const DEATH_KEY = 'q';
const UNDO_REDO_KEY = 'z';
const BACKSPACE_KEY = 'Backspace';
const SHIFT_KEY = 'Shift';
const CNTRL_KEY = 'Control';
const CMD_KEY = 'Meta';
const DESTROY_BRICK = 'Minus';
let didInteract = false;
let cmd_cntrl_down = false;
let shift_down = false;

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
  document.addEventListener('keyup', keyReleased);
}

function keyReleased(evt) {
	if((evt.key == CMD_KEY) || (evt.key == CNTRL_KEY)) {
		cmd_cntrl_down = false;
	} else if(evt.key == SHIFT_KEY) {
		shift_down = false;
	}
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
	if (evt.key == BACKSPACE_KEY) {
		if (levelEditor.enabled) {
			removeBrick();
		}
	}
	if (evt.key == CMD_KEY) {
		cmd_cntrl_down = true;
	}
	if (evt.key == CNTRL_KEY) {
		cmd_cntrl_down = true;
	}
	if (evt.key == SHIFT_KEY) {
		shift_down = true;
	}
	if (evt.key == UNDO_REDO_KEY) {
		if (levelEditor.enabled) {
			if(cmd_cntrl_down) {
				if(shift_down) {//redo action
					redo();
				} else {//undo action
					undo();
				}
			}
		}
	}
	if (evt.key == EDIT_KEY) {
		levelEditor.enabled = !levelEditor.enabled;
	}
	if (evt.key === DESTROY_BRICK) {
		brickGrid.pop();
	}
	if (levelEditor.enabled) {
		initLevelEditor();
		messageArea.innerHTML = '<strong>LEVEL EDITOR ENABLED</strong>';
	} else if (debugMode) {
		messageArea.innerHTML = '<strong>DEBUG MODE ENABLED</strong><br>left and right arrow keys move through levels<br>"r" key reloads current level<br>"m" key starts multiball';
		switch (evt.key) {
		case 'b': // debug test multiball
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
