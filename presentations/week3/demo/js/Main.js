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
var ballCount = 1;
var ballHeld = true;
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
var sounds = {
	paddleHit: new SoundOverlapsClass("audio/paddleHit", "paddleHit"),
	paddleHitHalfStepDown: new SoundOverlapsClass("audio/paddleHitHalfStepDown", "paddleHitHalfStepDown"),
	paddleHitHalfStepUp: new SoundOverlapsClass("audio/paddleHitHalfStepUp", "paddleHitHalfStepUp"),
	paddleHitWholeStepDown: new SoundOverlapsClass("audio/paddleHitWholeStepDown", "paddleHitWholeStepDown"),
	paddleHitWholeStepUp: new SoundOverlapsClass("audio/paddleHitWholeStepUp", "paddleHitWholeStepUp"),
	brickHit: new SoundOverlapsClass("audio/brickHit", "brickHit"),
	brickHitHalfStepDown: new SoundOverlapsClass("audio/brickHitHalfStepDown", "brickHitHalfStepDown"),
	brickHitHalfStepUp: new SoundOverlapsClass("audio/brickHitHalfStepUp", "brickHitHalfStepUp"),
	brickHitWholeStepDown: new SoundOverlapsClass("audio/brickHitWholeStepDown", "brickHitWholeStepDown"),
	brickHitWholeStepUp: new SoundOverlapsClass("audio/brickHitWholeStepUp", "brickHitWholeStepUp"),
	wallHit: new SoundOverlapsClass("audio/wallHit", "wallHit"),
	wallHitHalfStepDown: new SoundOverlapsClass("audio/wallHitHalfStepDown", "wallHitHalfStepDown"),
	wallHitHalfStepUp: new SoundOverlapsClass("audio/wallHitHalfStepUp", "wallHitHalfStepUp"),
	wallHitWholeStepDown: new SoundOverlapsClass("audio/wallHitWholeStepDown", "wallHitWholeStepDown"),
	wallHitWholeStepUp: new SoundOverlapsClass("audio/wallHitWholeStepUp", "wallHitWholeStepUp"),
	// FIXME: gameStart: new SoundOverlapsClass("audio/gameStart"),
	// FIXME: newLevel: new SoundOverlapsClass("audio/newLevel"),
	// FIXME: lifeGet: new SoundOverlapsClass("audio/lifeGet"),//this file is missing, causing a 404 error
	lifeLost: new SoundOverlapsClass("audio/lifeLost"),
	levelComplete: new SoundOverlapsClass("audio/levelComplete"),
	gameOver: new SoundOverlapsClass("audio/gameOver")
};

var arrayOfBrickHitSounds = [sounds.brickHit, sounds.brickHitHalfStepDown, sounds.brickHitHalfStepUp,
							 sounds.brickHitWholeStepDown, sounds.brickHitWholeStepUp];
var arrayOfPaddleHitSounds = [sounds.paddleHit, sounds.paddleHitHalfStepDown, sounds.paddleHitHalfStepUp,
								sounds.paddleHitWholeStepDown, sounds.paddleHitWholeStepUp];
var arrayOfWallHitSounds = [sounds.wallHit, sounds.wallHitHalfStepDown, sounds.wallHitHalfStepUp,
								sounds.wallHitWholeStepDown, sounds.wallHitWholeStepUp];

var messageArea;
var dt = 0, last = timestamp();
const gameUpdateStep = 1/30;

function timestamp() {
	return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}

function runGameStep(browserTimeStamp) {
	dt += Math.min(1, (browserTimeStamp - last)/1000);
	while(dt > gameUpdateStep) {
		dt -= gameUpdateStep;
		moveEverything(gameUpdateStep);
		gameLogic(gameUpdateStep);
	}
	drawEverything(dt);
	last = browserTimeStamp;
	window.requestAnimationFrame(runGameStep);
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
		initEnemies();
		canvas.addEventListener('mousemove', movePaddleOnMouseMove);
		canvas.addEventListener('mousemove', handleEditorMouseMove);
		canvas.addEventListener('ballMiss', dropLife);
		canvas.addEventListener('brickHit', handleBrickHit);
		canvas.addEventListener('brickHit', function() {playMultiSound(arrayOfBrickHitSounds)});
		canvas.addEventListener('brickRemoved', increaseScore);
		canvas.addEventListener('brickRemoved', increaseBallSpeed);
		canvas.addEventListener('brickRemoved', maybeDropPowerPill);
		canvas.addEventListener('paddleHit', function() {playMultiSound(arrayOfPaddleHitSounds)});
		canvas.addEventListener('paddleHit', paddleBlink);
		canvas.addEventListener('wallHit', function() {playMultiSound(arrayOfWallHitSounds)});
		canvas.addEventListener('outaLives', resetGame);
		canvas.addEventListener('noMoreBricks', loadNextLevel);
		canvas.addEventListener('outaLives', sounds.gameOver.play);
		canvas.addEventListener('scoreIncrease', checkAndRewardPlayer);
		//FIXME: canvas.addEventListener('newLevel', sounds.newLevel.play);
		canvas.addEventListener('ballMiss', sounds.lifeLost.play);
		canvas.addEventListener('wheel', handleEditorMouseScroll);
		canvas.addEventListener('mouseup', setEditorPencilUp);
		canvas.addEventListener('mousedown', setEditorPencilDown);
		canvas.addEventListener('mousedown', selectLevelOnMouseDown);
		canvas.addEventListener('mousedown', pushEditorButton);
		canvas.addEventListener('mousedown', function(evt) {
			if (showTitle) {
				showTitle = false;
				// FIXME: sounds.gameStart.play();
				testBackgroundMusic.play();
				resetBricks();
			} else if (demoScreen) {
				demoScreen = false;
				showTitle = true;
			} else {
				if (bricksInPlace) {
					ballHeld = false;
					stickyBall = false;
				}
			}
		});
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
	testBackgroundMusic = new Audio("audio/gameplayMusic" + audioFormat);
	testBackgroundMusic.loop = true;
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
	allBalls.forEach(function (ball) {
		ball.baseSpeed = INITIAL_SPEED;
		ball.maxSpeed = INITIAL_MAX_SPEED;
	}); // multiball

	resetBricks();
	resetScore();
	resetGAMKEDO();
	ballHeld = true;

	//allBalls.forEach(function (ball) { ball.ballReset(); }); // multiball

	lives = INITIAL_LIVES;
	showTitle = true;
	titleScreenTimer = 0;
	clearAllPillTimers();
	clearPillAbilites();
	initPills();
	initEnemies();
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
	testBackgroundMusic.play();
}

function loadNextLevel() {

	setTimeout(function () {
		levelTransition = true;
		bricksInPlace = false;
		currentLevelIndex++;

		if (currentLevelIndex >= LEVEL_SEQ.length) {
			currentLevelIndex = 0;
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
		ballHeld = true;
		lives--;
	}
	if (lives < 0) {
		canvas.dispatchEvent(outaLivesEvent);
		gameOverScreen = true;
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
		sounds.lifeGet.play();
	}
}

function drawTitleScreen() {
	var line = 120;
	colorRect(0, 0, canvas.width, canvas.height, 'black');
	drawBitMap(titlePic, 0, 0);
	canvasContext.fillStyle = 'white';
	canvasContext.textAlign = 'center';
	if (lastScore > 0) {
		canvasContext.fillText("LAST SCORE " + lastScore.toString(), canvas.width/2, line);
		line += 20;
	}
	canvasContext.fillText("GET A NEW LIFE ON EVERY " + NEW_LIFE_SCORE_MILESTONE + " POINTS!", canvas.width/2, line);
}


function drawLevelTransition() {
	var line = 120;
	colorRect(0, 0, canvas.width, canvas.height, 'black');
	canvasContext.fillStyle = 'white';
	canvasContext.textAlign = 'center';
	canvasContext.fillText("LOADING NEW LEVEL", canvas.width/2, line);
	canvasContext.fillText("GET PSYCHED!", canvas.width/2, line + 20);
}

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
		
	} else {
		drawBackground();
		drawGUI();
		allBalls.forEach(function (ball) { ball.drawBall(); }); // multiball
		drawEnemies();
		drawBricks();
		drawPills();
		drawPaddle();
	}
}

function drawGameOverScreen(){
	drawBackground();
	var line = 120;
	colorRect(0, 0, canvas.width, canvas.height, 'black');
	canvasContext.fillStyle = 'white';
	canvasContext.textAlign = 'center';
	canvasContext.fillText("TEMP GAME OVER SCREEN", canvas.width/2, line);
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
	if (!showTitle && !gamePaused && !levelTransition && !levelEditor.enabled) {
		allBalls[0].ballMove(dt);
		allBalls.forEach(function (ball) { ball.ballMove(dt); }); // multiball
		pillsMove(dt);
		enemiesMove(dt);
		if (paddleJumping) {
			paddleJump(dt);
		}
		if(demoScreen){
			moveComputerPaddle(allBalls[0]);
		}
	}
	if (gamePaused){
		lettersMove();
	}
}

function lerp(startPos, endPos, value) {
	return (endPos - startPos) * value + startPos;
}
