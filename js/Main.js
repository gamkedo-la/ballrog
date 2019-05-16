const INITIAL_LIVES = 3;
const BRICK_HIT_POINTS = 100;
const NEW_LIFE_SCORE_MILESTONE = 3000;
var debugMode = false;
var canvas;
var canvasContext;
var framesPerSecond = 60;
var score = 0;
var highScore = 0;
var lives = INITIAL_LIVES;
var outaLivesEvent = new CustomEvent('outaLives');
var allBalls = [];
allBalls[0] = new ballClass();
var ballCount = 1;
var ballHeld = true;
//power ups
var stickyBall = false;
var letterG = false;
var letterA = false;
var letterM = false;
var letterK = false;
var letterE = false;
var letterD = false;
var letterO = false;
var gamkedo = false;
//game states
var showTitle = true;
var demoScreen = false;
var gamePaused = false;
var levelTransition = false;
var lastScore = score;
var currentLevelIndex = 0;
var gameMuted = false;
var sounds = {
	paddleHit: new SoundOverlapsClass("audio/paddleHit"),
	brickHit: new SoundOverlapsClass("audio/brickHit"),
	brickHitHalfStepDown: new SoundOverlapsClass("audio/brickHitHalfStepDown"),
	brickHitHalfStepUp: new SoundOverlapsClass("audio/brickHitHalfStepUp"),
	brickHitWholeStepDown: new SoundOverlapsClass("audio/brickHitWholeStepDown"),
	brickHitWholeStepUp: new SoundOverlapsClass("audio/brickHitWholeStepUp"),
	wallHit: new SoundOverlapsClass("audio/wallHit"),
	// FIXME: gameStart: new SoundOverlapsClass("audio/gameStart"),
	// FIXME: newLevel: new SoundOverlapsClass("audio/newLevel"),
	lifeGet: new SoundOverlapsClass("audio/lifeGet"),
	lifeLost: new SoundOverlapsClass("audio/lifeLost"),
	gameOver: new SoundOverlapsClass("audio/gameOver"),

};

var arrayOfBrickHitSounds = [sounds.brickHit, sounds.brickHitHalfStepDown, sounds.brickHitHalfStepUp,
														 sounds.brickHitWholeStepDown, sounds.brickHitWholeStepUp];
var messageArea;

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
		setInterval(function() {
			moveEverything();
			drawEverything();
			gameLogic();						
		}, 1000/framesPerSecond);
		canvas.addEventListener('mousemove', movePaddleOnMouseMove);
		canvas.addEventListener('mousemove', handleEditorMouseMove);
		canvas.addEventListener('ballMiss', dropLife);
		canvas.addEventListener('brickHit', handleBrickHit);
		canvas.addEventListener('brickHit', function() {playMultiSound(arrayOfBrickHitSounds)});
		canvas.addEventListener('brickRemoved', increaseScore);
		canvas.addEventListener('brickRemoved', allBalls[0].increaseSpeed);
		canvas.addEventListener('brickRemoved', maybeDropPowerPill);
		canvas.addEventListener('paddleHit', sounds.paddleHit.play);
		canvas.addEventListener('paddleHit', paddleBlink);
		canvas.addEventListener('wallHit', sounds.wallHit.play);
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
	});
	testBackgroundMusic = new Audio("audio/pong6-19" + audioFormat);
	testBackgroundMusic.loop = true;
	testBackgroundMusic.volume = 0.05;
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
	clearPillTimers();
	clearPillAbilites();
	initPills();
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
	allBalls = []; // completely wipe the array
	allBalls[0] = new ballClass();
	allBalls[0].ballReset(ballCount)
	//allBalls.forEach(function (ball) { ball.ballReset(); }); // multiball	
	activePills = 0;
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
			allBalls[0].baseSpeed += 3;
			allBalls[0].maxSpeed += 3;
			levelTransition = false;
			let newLevelEvent = new CustomEvent('newLevel');
			canvas.dispatchEvent(newLevelEvent);
		}, 1500);
	}, 600 - allBalls[0].getSpeedFromVelocity(allBalls[0].VelX, allBalls[0].VelY));
}

function dropLife() {
	lives--;
	if (lives < 0) {
		canvas.dispatchEvent(outaLivesEvent);
	}
}

function resetScore() {
	score = 0;
}

function drawGAMKEDO(){
	var letterPills = [letterG, letterA, letterM, letterK, letterE, letterD, letterD];
	var letters = ['G','A','M','K','E','D','O']
	for(i = 0; i < 7; i++){
		if(letterPills[i]){
			canvasContext.fillText(letters[i], 130 + ([i]*10), 10);
		}
	}
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
	} else {
		colorRect(0, 0, canvas.width, canvas.height, 'rgb(75,105,47 )');
		canvasContext.fillStyle = 'white';
		canvasContext.textAlign = 'center';
		canvasContext.fillText(score.toString(), canvas.width/2, 10);
		canvasContext.fillText('High Score: ' + highScore.toString(), 50, 10);
		drawLives();
		drawGAMKEDO();
		allBalls[0].drawBall();
		allBalls.forEach(function (ball) { ball.drawBall(); }); // multiball
		drawBricks();
		drawPills();
		drawPaddle();
		//console.log(testBackgroundMusic.volume);
	}
}

function gameLogic() {
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

function moveEverything() {
	if (!showTitle && !gamePaused && !levelTransition && !levelEditor.enabled) {
		allBalls[0].ballMove();
		allBalls.forEach(function (ball) { ball.ballMove(); }); // multiball
		pillsMove();
		if(demoScreen){
			moveComputerPaddle(allBalls[0]);
		}
	}
	if (gamePaused){
		lettersMove();
	}
}

function drawLives() {
	var posX = canvas.width - 30;
	var posY = 10;
	for (var i=0; i<lives; i++) {
		drawBitMap(livesPic, posX - i*20, posY);
	}
}

function lerp(startPos, endPos, value) {
	return (endPos - startPos) * value + startPos;
}
