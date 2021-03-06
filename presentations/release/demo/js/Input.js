const PAUSE_KEY = 'p';
const MUTE_KEY = 'm';
const MULTIBALL_KEY = 'b';
const PADDLEJUMP_KEY = 'j';
const STRETCH_PADDLE = 's';
const DEBUG_KEY = 'd';
const EDIT_KEY = 'e';
const DEATH_KEY = 'q';
const UNDO_REDO_KEY = 'z';
const BACKSPACE_KEY = 'Backspace';
const SHIFT_KEY = 'Shift';
const CNTRL_KEY = 'Control';
const CMD_KEY = 'Meta';
const DESTROY_BRICK = 'Minus';
const CREDITS_KEY = 'c';
const BEAT_BOSS_KEY = 'k';
let didInteract = false;
let cmd_cntrl_down = false;
let shift_down = false;
const VOLUME_DOWN = 'Minus';
const VOLUME_UP = 'Equal';
const CREDITS_SPEED_UP_KEY = 'ArrowUp';
const CREDITS_SPEED_DOWN_KEY = 'ArrowDown';
const CREDITS_PAUSE_KEY = PAUSE_KEY;

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
  //console.log(evt);
  didInteract = true;
  if (evt.key == PAUSE_KEY && !creditsManager.rolling) {
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
	if (debugMode && battlingBoss && evt.key == BEAT_BOSS_KEY) {
		boss.lives = 0;
		boss.live = false;
		canvas.dispatchEvent(boss.defeatedEvent);
	}
	if (creditsManager.rolling) {
		if (evt.key == CREDITS_SPEED_UP_KEY) {
			creditsManager.speedUp();
		}
		if (evt.key == CREDITS_SPEED_DOWN_KEY) {
			creditsManager.speedDown();
		}
		if (evt.key == CREDITS_PAUSE_KEY) {
			creditsManager.togglePause();
		}
	}
	if (showTitle && evt.key == CREDITS_KEY) {
		showTitle = false;
		creditsManager.roll();
	} else if (creditsManager.rolling && (evt.key == CREDITS_KEY || evt.key == 'Escape')) {
		creditsManager.stop();
		showTitle = true;
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
		messageArea.innerHTML = '<strong>DEBUG MODE ENABLED</strong><br>' +
		'left and right arrow keys move through levels<br>' +
		'"r" key reloads current level<br>' +
		'"b" key starts multiball<br>' +
		'"j" starts paddleJump()<br>' +
		'"l" starts debug ball';
		switch (evt.key) {
		case 'b': // debug test multiball
			startMultiBall(4);
			break;
		case 'j':// debug test paddleJump();

			if (paddleJumping) {
				paddleJumping = false;
			} else {
				paddleJumping = true;
			}
			console.log(paddleJumping);
			break;
		case 's':// debug stretchedPaddle
			stretchPill.startPower();

			break;
		case 'l':// debug ball
			debugBall = !debugBall;
			//console.log("debugBall: " + debugBall);
			break;
		case 'v'://volcano, aka sticky pill
			stickyBall = true;

			break;
		case 'ArrowRight':
			currentLevelIndex++;
			checkLevelIndex();
			resetLevel();
			levelCompleteSoundEvents();
			break;
		case 'ArrowLeft':
			currentLevelIndex--;
			checkLevelIndex();
			resetLevel();
		  levelCompleteSoundEvents();
			break;
		case 'r':
			resetLevel();
			break;
		case 'f':
			if (!battlingBoss) {
				battlingBoss = true;
			} else {
				battlingBoss = false;
			}
			break;
		case 'a'://magneticPower on, a for attract because m is taken?
			magneticBall = true;

			break;
		}
	} else {
		messageArea.innerHTML = '';
		debugBall = false;
		const keys = Object.keys(sounds);

		switch(evt.code) {
		case 'Minus':
			if(testBackgroundMusic.volume >= 0.015) {
				testBackgroundMusic.volume -= 0.015;
			} else {
				testBackgroundMusic.volume = 0;
			}

			for(let i = 0; i < keys.length; i++) {
				if(sounds[keys[i]].volume >= 0.1) {
					sounds[keys[i]].volume -= 0.1;
				} else {
					sounds[keys[i]].volume = 0;
				}
			}
			break;
		case 'Equal':
			if(testBackgroundMusic.volume <= 0.985) {
				testBackgroundMusic.volume += 0.015;
			} else {
				testBackgroundMusic.volume = 1;
			}

			//console.log(keys);
			for(let i = 0; i < keys.length; i++) {
				if(sounds[keys[i]].volume <= 0.9) {
					sounds[keys[i]].volume += 0.1;
				} else {
					sounds[keys[i]].volume = 1;
				}
			}
			break;
		}
	}
 }//end keyPressed function
