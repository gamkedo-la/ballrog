const TURBO_MODE = false; // hardcore 2x speed
const INITIAL_LIVES = 3;
const BRICK_HIT_POINTS = 100;
const NEW_LIFE_SCORE_MILESTONE = 3000;

var debugMode = false;
var canvas;
var canvasContext;
var score = 0;
var highScore = 0;
var lives = INITIAL_LIVES;
var outaLivesEvent = new CustomEvent('outaLives');
var allBalls = [];
allBalls[0] = new ballClass();
const boss = new bossClass();
var ballCount = 1;
//power ups
var paddleJumping = false;
var stickyBall = false;
var letterG = false;
var letterA = false;
var letterM = false;
var letterK = false;
var letterE = false;
var letterD = false;
var letterO = false;
var gamkedo = false;
var magneticBall = false;
//game states
var showTitle = true;
var demoScreen = false;
var gamePaused = false;
var gameOverScreen = false;
var levelTransition = false;
var lastScore = score;
var currentLevelIndex = 0;
var gameMuted = false;
var battlingBoss = false;
var sounds = {
	paddleHit: new SoundOverlapsClass("audio/paddleHit", "paddleHit"),
	paddleHitHalfStepDown: new SoundOverlapsClass("audio/paddleHitHalfStepDown", "paddleHitHalfStepDown"),
	paddleHitHalfStepUp: new SoundOverlapsClass("audio/paddleHitHalfStepUp", "paddleHitHalfStepUp"),
	paddleHitWholeStepDown: new SoundOverlapsClass("audio/paddleHitWholeStepDown", "paddleHitWholeStepDown"),
	paddleHitWholeStepUp: new SoundOverlapsClass("audio/paddleHitWholeStepUp", "paddleHitWholeStepUp"),
	paddleJump: new SoundOverlapsClass("audio/paddleJump", "paddleJump"),
	paddleJumpHalfStepUp: new SoundOverlapsClass("audio/paddleJumpHalfStepUp", "paddleJumpHalfStepUp"),
	paddleJumpWholeStepUp: new SoundOverlapsClass("audio/paddleJumpWholeStepUp", "paddleJumpWholeStepUp"),
	paddleJumpHalfStepDown: new SoundOverlapsClass("audio/paddleJumpHalfStepDown", "paddleJumpHalfStepDown"),
	paddleJumpWholeStepDown: new SoundOverlapsClass("audio/paddleJumpWholeStepDown", "paddleJumpWholeStepDown"),
	brickHit: new SoundOverlapsClass("audio/brickHit", "brickHit"),
	brickHitHalfStepDown: new SoundOverlapsClass("audio/brickHitHalfStepDown", "brickHitHalfStepDown"),
	brickHitHalfStepUp: new SoundOverlapsClass("audio/brickHitHalfStepUp", "brickHitHalfStepUp"),
	brickHitWholeStepDown: new SoundOverlapsClass("audio/brickHitWholeStepDown", "brickHitWholeStepDown"),
	brickHitWholeStepUp: new SoundOverlapsClass("audio/brickHitWholeStepUp", "brickHitWholeStepUp"),
	brickHitSteel: new SoundOverlapsClass("audio/brickHitSteel", "brickHitSteel"),
	wallHit: new SoundOverlapsClass("audio/wallHit", "wallHit"),
	wallHitHalfStepDown: new SoundOverlapsClass("audio/wallHitHalfStepDown", "wallHitHalfStepDown"),
	wallHitHalfStepUp: new SoundOverlapsClass("audio/wallHitHalfStepUp", "wallHitHalfStepUp"),
	wallHitWholeStepDown: new SoundOverlapsClass("audio/wallHitWholeStepDown", "wallHitWholeStepDown"),
	wallHitWholeStepUp: new SoundOverlapsClass("audio/wallHitWholeStepUp", "wallHitWholeStepUp"),
	invaderPillMove1: new SoundOverlapsClass("audio/InvaderMove1", "invaderPillMove1"),
	invaderPillMove2: new SoundOverlapsClass("audio/InvaderMove2", "invaderPillMove2"),
	// FIXME: gameStart: new SoundOverlapsClass("audio/gameStart"),
	// FIXME: newLevel: new SoundOverlapsClass("audio/newLevel"),
	// FIXME: lifeGet: new SoundOverlapsClass("audio/lifeGet"), //this file is missing, causing a 404 error
	lifeLost: new SoundOverlapsClass("audio/lifeLost", "lifeLost"),
	levelComplete: new SoundOverlapsClass("audio/levelComplete", "levelComplete"),
	gameOver: new SoundOverlapsClass("audio/gameOver", "gameOver"),
	spawnMultiBall: new SoundOverlapsClass("audio/multiBallSpawn", "spawnMultiBall"),
	stretchPaddleSound: new SoundOverlapsClass("audio/stretchPaddle", "stretchPaddleSound"),
	shrinkPaddleSound: new SoundOverlapsClass("audio/shrinkPaddle", "shrinkPaddleSound"),
	wizardFlyIn: new SoundOverlapsClass("audio/fairyEntrance", "wizardFlyIn"),
	wizardPlacesBrick: new SoundOverlapsClass("audio/wizardPlacesBrick", "wizardPlacesBrick"),
	swallowPill1: new SoundOverlapsClass("audio/swallow1", "swallow1"),
	swallowPill2: new SoundOverlapsClass("audio/swallow2", "swallow2"),
	swallowPill3: new SoundOverlapsClass("audio/swallow3", "swallow3"),
	swallowPill4: new SoundOverlapsClass("audio/swallow4", "swallow4"),
	swallowPill5: new SoundOverlapsClass("audio/swallow5", "swallow5"),
	gPillSound: new SoundOverlapsClass("audio/gPill", "gPill"),
	aPillSound: new SoundOverlapsClass("audio/aPill", "aPill"),
	mPillSound: new SoundOverlapsClass("audio/mPill", "mPill"),
	kPillSound: new SoundOverlapsClass("audio/kPill", "kPill"),
	ePillSound: new SoundOverlapsClass("audio/ePill", "ePill"),
	dPillSound: new SoundOverlapsClass("audio/dPill", "dPill"),
	oPillSound: new SoundOverlapsClass("audio/oPill", "oPill"),
	stickyPillSound: new SoundOverlapsClass("audio/stickToPaddleSound", "stickyPillSound"),
	paddleFreezeSound: new SoundOverlapsClass("audio/player_freeze_3", "paddleFreezeSound"),
	gamePlayMusic1: new Audio("audio/gamePlayMusic" + audioFormat),
	gamePlayMusic2: new Audio("audio/gamePlayMusicV2" + audioFormat),
	gamePlayMusic3: new Audio("audio/gamePlayMusicV3" + audioFormat),
	moneyPillSound: new SoundOverlapsClass("audio/moneyPill", "moneyPillSound"),
	ghostPillSound: new SoundOverlapsClass("audio/ghostPill", "ghostPillSound"),
	magnetizingSound: new SoundOverlapsClass("audio/magnetizingSound", "magnetizingSound")
};

var arrayOfBrickHitSounds = [sounds.brickHit, sounds.brickHitHalfStepDown, sounds.brickHitHalfStepUp,
							 sounds.brickHitWholeStepDown, sounds.brickHitWholeStepUp];
var arrayOfPaddleHitSounds = [sounds.paddleHit, sounds.paddleHitHalfStepDown, sounds.paddleHitHalfStepUp,
								sounds.paddleHitWholeStepDown, sounds.paddleHitWholeStepUp];
var arrayOfWallHitSounds = [sounds.wallHit, sounds.wallHitHalfStepDown, sounds.wallHitHalfStepUp,
								sounds.wallHitWholeStepDown, sounds.wallHitWholeStepUp];
var arrayOfInvaderSounds = [sounds.invaderPillMove1, sounds.invaderPillMove2];
var arrayOfPaddleJumpSounds = [sounds.paddleJump, sounds.paddleJumpHalfStepUp, sounds.paddleJumpWholeStepUp,
															sounds.paddleJumpHalfStepDown, sounds.paddleJumpWholeStepDown];
var arrayOfSwallowPillSounds = [sounds.swallowPill1, sounds.swallowPill2, sounds.swallowPill3, sounds.swallowPill4,
																sounds.swallowPill5];
var arrayOfBackgroundMusicTracks = [sounds.gamePlayMusic1, sounds.gamePlayMusic2, sounds.gamePlayMusic3];

var messageArea;
var dt = 0, last = timestamp();
const gameUpdateStep = 1/30;
const framesPerSecond = 60;

function timestamp() {
	return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}

function runGameStep(browserTimeStamp) {
	handleJoystickControls();
	dt += Math.min(1, (browserTimeStamp - last)/1000);
	while(dt > gameUpdateStep) {
		dt -= gameUpdateStep;
		moveEverything(gameUpdateStep);
		gameLogic(gameUpdateStep);
		if (TURBO_MODE) {
			moveEverything(gameUpdateStep);
			gameLogic(gameUpdateStep);
		}
	}
	drawEverything(); // was drawEverything(dt) - not needed?
	last = browserTimeStamp;
	window.requestAnimationFrame(runGameStep);
}

// onclick or button press to start game or release ball
function gameClicked(evt) {
	if (showTitle) {
		showTitle = false;
		// FIXME: sounds.gameStart.play();
		testBackgroundMusic.play();
		resetBricks();
		createBackground();
	} else if (gameOverScreen) {
		resetGame();
		gameOverScreen = false;
	} else if (demoScreen) {
		resetGame();
		demoScreen = false;
	} else if (bricksInPlace && checkIfBallHeld()) {
			allBallsUnheld();
			serveTimer = undefined;
	} else {
		if (paddleGun > 0) {
			paddleShoot = true;
		}
	}
}

window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');
	messageArea = document.createElement('p');
	canvas.parentNode.insertBefore(messageArea, canvas.nextSibling);
	loadImages();
	canvas.addEventListener('allImagesLoaded', function() {
		canvas.removeEventListener('allImagesLoaded', this);
		resetBricks();
		initPills();
		enemiesManager.init();
		boss.init();
		canvas.addEventListener('mousemove', movePaddleOnMouseMove);
		canvas.addEventListener('mousemove', handleEditorMouseMove);
		canvas.addEventListener('mousemove', debugBallMovement);
		canvas.addEventListener('ballMiss', dropLife);
		canvas.addEventListener('brickHit', handleBrickHit);
		//canvas.addEventListener('brickHit', function() {playMultiSound(arrayOfBrickHitSounds)});
		canvas.addEventListener('brickRemoved', increaseScore);
		canvas.addEventListener('brickRemoved', increaseBallSpeed);
		canvas.addEventListener('brickRemoved', maybeDropPowerPill);
		canvas.addEventListener('paddleHit', function() {playMultiSound(arrayOfPaddleHitSounds)});
		canvas.addEventListener('paddleHit', paddleBlink);
		canvas.addEventListener('wallHit', function() {playMultiSound(arrayOfWallHitSounds)});
		//canvas.addEventListener('outaLives', resetGame);
		canvas.addEventListener('noMoreBricks', loadNextLevel);
		canvas.addEventListener('outaLives', sounds.gameOver.play);
		canvas.addEventListener('scoreIncrease', checkAndRewardPlayer);
		//FIXME: canvas.addEventListener('newLevel', sounds.newLevel.play);
		//FIXME: canvas.addEventListener('ballMiss', sounds.lifeLost.play);
		canvas.addEventListener('bossDefeated', function () {
			console.log('DEFEATED BOSS!');
			increaseScore(lives * 1000);
			loadNextLevel(); // NOTE: goes to credits roll
		});
		canvas.addEventListener('wheel', handleEditorMouseScroll);
		canvas.addEventListener('mouseup', setEditorPencilUp);
		canvas.addEventListener('mousedown', setEditorPencilDown);
		canvas.addEventListener('mousedown', selectLevelOnMouseDown);
		canvas.addEventListener('mousedown', pushEditorButton);
		canvas.addEventListener('mousedown', gameClicked);
		window.addEventListener('focus', function () {
			gamePaused = false;
		});
		window.addEventListener('blur', function () {
			gamePaused = true;
		});
		//allBalls.forEach(function (ball) { ball.ballReset(); }); // multiball
		allBalls = []; // completely wipe the array
		allBalls[0] = new ballClass();
		allBalls[0].ballReset(ballCount);
		setupInput();
		invaderMovementTimerFull = 1/gameUpdateStep;
		invaderMovementTimer = invaderMovementTimerFull;
		window.requestAnimationFrame(runGameStep);
	});
	let randomBackgroundMusicIndex = getRandomInt(0, arrayOfBackgroundMusicTracks.length - 1);
	testBackgroundMusic = arrayOfBackgroundMusicTracks[randomBackgroundMusicIndex];
	console.log(testBackgroundMusic);
	for (let i = 0; arrayOfBackgroundMusicTracks.length - 1; i++) {
		arrayOfBackgroundMusicTracks[i].loop = true;
	}
	testBackgroundMusic.volume = 0.15;
}

function resetGame() {
	currentLevelIndex = 0;
	lastScore = score;

	// FIXME perhaps this should be in ballReset() function below
	allBalls = []; // completely wipe the array
	allBalls[0] = new ballClass();
	ballCount = 1;
	allBalls[0].ballReset(ballCount);
	allBalls[0].ballHeld = true;
	heldBall = allBalls[0];
	allBalls.forEach(function (ball) {
		ball.baseSpeed = INITIAL_SPEED;
		ball.maxSpeed = INITIAL_MAX_SPEED;
	}); // multiball

	resetBricks();
	resetScore();
	resetGAMKEDO();

	//allBalls.forEach(function (ball) { ball.ballReset(); }); // multiball

	lives = INITIAL_LIVES;
	ballrogSpin = 0;
	ballrogSpinStep = Math.PI/36;
	showTitle = true;
	testBackgroundMusic.pause();
	testBackgroundMusic.currentTime = 0;
	titleScreenTimer = 0;
	clearAllPillTimers();
	clearPillAbilites();
	initPills();
	enemiesManager.init();
	boss.reset();
	battlingBoss = false;
}

function resetGAMKEDO(){
	letterG = false;
	letterA = false;
	letterM = false;
	letterK = false;
	letterE = false;
	letterD = false;
	letterO = false;
}

function resetLevel() {
	resetBricks();
	resetPills();
	clearAllPillTimers();
	clearPillAbilites();
	allBalls = []; // completely wipe the array
	ballCount = 1;
	allBalls[0] = new ballClass();
	allBalls[0].ballReset(ballCount)
	//allBalls.forEach(function (ball) { ball.ballReset(); }); // multiball
	activePills = 0;
	enemiesManager.reset();
	testBackgroundMusic.play();
}

function checkLevelIndex() {
	if (currentLevelIndex < 0) {
		currentLevelIndex = LEVEL_SEQ.length;
	}
	if (currentLevelIndex == LEVEL_SEQ.length) {
		clearBricks();
		battlingBoss = true;
	} else if (currentLevelIndex == LEVEL_SEQ.length + 1) {
		battlingBoss = false;
		creditsManager.roll();
	} else if (currentLevelIndex > LEVEL_SEQ.length + 1) {
		currentLevelIndex = 0;
		battlingBoss = false;
		creditsManager.stop();
	} else {
		creditsManager.stop();
		battlingBoss = false;
	}
}

function loadNextLevel() {
	setTimeout(function () {
		levelTransition = true;
		bricksInPlace = false;
		currentLevelIndex++;
		checkLevelIndex();
		if (battlingBoss || creditsManager.rolling) {
			return;
		}
		setTimeout(function () {
			resetLevel();
			allBalls[0].baseSpeed += 0.5;
			allBalls[0].maxSpeed += 0.5;
			levelTransition = false;

			let newLevelEvent = new CustomEvent('newLevel');
			canvas.dispatchEvent(newLevelEvent);
		}, 1500);
	}, 600 - allBalls[0].getSpeedFromVelocity(allBalls[0].VelX, allBalls[0].VelY));
}

function dropLife() {
	if(ballCount ==1){
		allBalls[0].ballHeld = true;
		lives--;
	}
	if (lives < 0) {
		canvas.dispatchEvent(outaLivesEvent);
		testBackgroundMusic.pause();
		sounds.gameOver.play();
		gameOverScreen = true;
		paddleY = -canvas.height/1.5;
		paddleWobbleTimer = paddleWobbleTimerFull;
	}
}

function resetScore() {
	score = 0;
}

function increaseScore(points) {
	if (typeof(points) != 'number') {
		points = BRICK_HIT_POINTS;
	}
	score += points;
	if(highScore < score && !demoScreen){
		highScore = score;
	}
	var scoreIncreaseEvent = new CustomEvent('scoreIncrease');
	canvas.dispatchEvent(scoreIncreaseEvent);
}

function checkAndRewardPlayer() {
	var prevScore = score - BRICK_HIT_POINTS; // FIXME: score is now increased by variable amounts
	if (score > 0 && score % NEW_LIFE_SCORE_MILESTONE == 0) {
		lives++;
		//sounds.lifeGet.play(); //FIXME
	}
}

function drawTitleScreen() {
	var line = 120;
	//colorRect(0, 0, canvas.width, canvas.height, 'black');
	drawBackground(plasma4Pic,plasma4Pic,plasma4Pic,plasma4Pic);
	drawBitMap(titlePic, 0, 0);
	canvasContext.textAlign = 'center';
	if (lastScore > 0) {
		canvasContext.fillStyle = 'black';
		canvasContext.fillText("LAST SCORE " + lastScore.toString(), canvas.width/2+1, line+1);
		canvasContext.fillStyle = 'white';
		canvasContext.fillText("LAST SCORE " + lastScore.toString(), canvas.width/2, line);
		line += 20;
	}
	canvasContext.fillStyle = 'black';
	canvasContext.fillText("GET A NEW LIFE EVERY " + NEW_LIFE_SCORE_MILESTONE + " POINTS!", canvas.width/2+1, line+1);
	canvasContext.fillStyle = 'white';
	canvasContext.fillText("GET A NEW LIFE EVERY " + NEW_LIFE_SCORE_MILESTONE + " POINTS!", canvas.width/2, line);

	drawCreditsPrompt(line);
}

function drawCreditsPrompt(line) {
	canvasContext.save();
	const creditsText = "[C] For Credits";
	canvasContext.fillStyle = '#639bff';
	canvasContext.font = 'small-caps bold 30px Sans-serif';
	canvasContext.fillText(creditsText, canvas.width / 2, line + 325);
	canvasContext.strokeStyle = 'black';
	canvasContext.lineWidth = 2;
	canvasContext.strokeText(creditsText, canvas.width / 2, line + 325);
	canvasContext.restore();
}

function drawLevelTransition() {
	var line = 120;
	colorRect(0, 0, canvas.width, canvas.height, 'black');
	createBackground();
	drawBackground(newBackground[0],newBackground[1],newBackground[2],newBackground[3]);
	canvasContext.textAlign = 'center';
	canvasContext.fillStyle = 'black';
	canvasContext.fillText("LOADING NEW LEVEL", canvas.width/2 + 1, line + 1);
	canvasContext.fillStyle = 'white';
	canvasContext.fillText("LOADING NEW LEVEL", canvas.width/2, line);
	canvasContext.fillStyle = 'black';
	canvasContext.fillText("GET PSYCHED!", canvas.width/2 + 1, line + 20 + 1);
	canvasContext.fillStyle = 'white';
	canvasContext.fillText("GET PSYCHED!", canvas.width/2, line + 20);
}

let arrayOfJumpsSoundsInitialized = false;

function drawEverything() {
	if (showTitle) {
		drawTitleScreen();
		if(titleScreenTimer < 1000){
			titleScreenKeepTime();
		}
	} else if (levelEditor.enabled) {
		for (var col=0; col<Math.floor(canvas.width/editorBackgroundTile.width); col++) {
			for (var row=0; row<Math.floor(canvas.height/editorBackgroundTile.height); row++) {
				drawBitMap(editorBackgroundTile, col*editorBackgroundTile.width, row*editorBackgroundTile.height);
			}
		}
		drawBricks();
		drawSelectedBrickType();
		drawLevelSelector();
		drawEditorButtons();
	} else if (demoScreen) {
		demoKeepTime();
		drawDemoScreen();
	} else if(gamePaused){
		drawPauseScreen();
	} else if (levelTransition) {
		drawLevelTransition();
	} else if(gameOverScreen){
		drawGameOverScreen();
	} else if(battlingBoss) {
		drawBackground(plasmaPic,plasmaPic);
		drawGUI();
		boss.draw();
		allBalls.forEach(function (ball) { ball.drawBall(); }); // multiball
		drawBricks();
		drawPills();
		drawPaddle();
	} else if(creditsManager.rolling) {
		creditsManager.draw();
	} else { // normal gameplay render:
		drawBackground(newBackground[0],newBackground[1],newBackground[2],newBackground[3]);
		drawGUI();
		allBalls.forEach(function (ball) { ball.drawBall(); }); // multiball
		drawBricks();
		drawPills();
		enemiesManager.draw();
		drawPaddle();
		//console.log(sounds.paddleHit.mainSound.volume);
	}
}

var ballrogSpin = 0;
var ballrogSpinStep = Math.PI/36;

function drawGameOverScreen(){
	var line = 120;
	colorRect(0, 0, canvas.width, canvas.height, 'black');
	drawBackground(plasma2Pic,plasma2Pic);
	canvasContext.save();
	if (paddleY < -paddlePic.height/2) {
		paddleY++;
	} else {
		ballrogSpinStep = lerp(ballrogSpinStep, Math.PI/90, 0.05);
	}
	if (paddleWobbleTimer >= 0) {
		if (paddleWobbleTimer % 7 == 0) {
			wobbleScaleAngle = setWobbleScaleAngle(wobbleScaleAngle);
			wobbleScale.x = Math.sin(wobbleScaleAngle) * 3;
			wobbleScale.y = wobbleScale.x;
		}
		paddleWobbleTimer--;
	} else {
		paddleWobbleTimer = paddleWobbleTimerFull;
	}
	ballrogSpin += ballrogSpinStep;
	canvasContext.translate(canvas.width/2,canvas.height/2);
	canvasContext.rotate(ballrogSpin);
	canvasContext.drawImage(paddlePic, 0,0,paddlePic.width,paddlePic.height,
					-paddlePic.width/2 + (-0.5 * wobbleScale.x), paddleY + (-0.5 * wobbleScale.y),
					paddlePic.width + wobbleScale.x, paddlePic.height + wobbleScale.y);
	canvasContext.restore();
	canvasContext.textAlign = 'center';
	canvasContext.fillStyle = 'black';
	canvasContext.fillText("GAME OVER", canvas.width/2 + 1, line + 1);
	canvasContext.fillStyle = 'white';
	canvasContext.fillText("GAME OVER", canvas.width/2, line);
	canvasContext.textAlign = 'center';
	canvasContext.fillStyle = 'black';
	canvasContext.fillText("Click for Main Menu!", canvas.width/2 + 1, (line * 4) + 1);
	canvasContext.fillStyle = 'white';
	canvasContext.fillText("Click for Main Menu!", canvas.width/2, line * 4);
}

function gameLogic(dt) {
	if (waitForLastPills) {
		checkPillsLive();
		if (activePills > 0) {
			return;
		}
		waitForLastPills = false;
		setTimeout(function() {
			let noMoreBricksEvent = new CustomEvent('noMoreBricks');
			canvas.dispatchEvent(noMoreBricksEvent);
		}, 500)
	}
}

function moveEverything(dt) {
	if (!(showTitle || gamePaused  || levelTransition || levelEditor.enabled || gameOverScreen || creditsManager.rolling)) {
		allBalls[0].ballMove(dt);
		allBalls.forEach(function (ball) { ball.ballMove(dt); }); // multiball
		pillsMove(dt);

		if (battlingBoss) {
			boss.update(dt);
		} else {
			enemiesManager.update(dt);
		}
		handleJoystickControls();
		updatePaddleState(dt);
		if(demoScreen){
			moveComputerPaddle(allBalls[0]);
		}
	}
	if (gamePaused){
		lettersMove();
	}
	if (creditsManager.rolling) {
		creditsManager.update(dt);
	}
}
