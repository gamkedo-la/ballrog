const INITIAL_LIVES = 3;
const BRICK_HIT_POINTS = 100;
const NEW_LIFE_SCORE_MILESTONE = 3000;
var retroMode = false;
var canvas;
var canvasContext;
var framesPerSecond = 30;
var score = 0;
var lives = INITIAL_LIVES;
var outaLivesEvent = new CustomEvent('outaLives');
var ballHeld = true;
var showTitle = true;
var lastScore = score;
var sounds = {
	paddleHit: new SoundOverlapsClass("audio/paddleHit"),
	brickHit: new SoundOverlapsClass("audio/brickHit"),
	wallHit: new SoundOverlapsClass("audio/wallHit"),
	gameStart: new SoundOverlapsClass("audio/gameStart"),
	newLevel: new SoundOverlapsClass("audio/newLevel"),
	lifeGet: new SoundOverlapsClass("audio/lifeGet"),
	lifeLost: new SoundOverlapsClass("audio/lifeLost"),
	gameOver: new SoundOverlapsClass("audio/gameOver")
};

window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');
	loadImages();
	canvas.addEventListener('allImagesLoaded', function() {
		canvas.removeEventListener('allImagesLoaded', this);
		resetBricks();
		initPills();
		setInterval(function() {
			moveEverything();
			drawEverything();
		}, 1000/framesPerSecond);
		canvas.addEventListener('mousemove', movePaddleOnMouseMove);
		canvas.addEventListener('ballMiss', dropLife);
		// canvas.addEventListener('ballMiss', sounds.lifeLost.play);
		canvas.addEventListener('brickHit', handleBrickHit);
		// canvas.addEventListener('brickHit', sounds.brickHit.play);
		canvas.addEventListener('brickRemoved', increaseScore);
		canvas.addEventListener('brickRemoved', increaseSpeed);
		canvas.addEventListener('brickRemoved', maybeDropPowerPill);
		// canvas.addEventListener('paddleHit', sounds.paddleHit.play);
		// canvas.addEventListener('wallHit', sounds.wallHit.play);
		canvas.addEventListener('outaLives', resetGame);
		// canvas.addEventListener('outaLives', sounds.gameOver.play);
		canvas.addEventListener('scoreIncrease', checkAndRewardPlayer);
		// canvas.addEventListener('newLevel', sounds.newLevel.play);
		canvas.addEventListener('newLevel', resetPills);
		canvas.addEventListener('mousedown', function(evt) {
			if (showTitle) {
				showTitle = false;
				sounds.gameStart.play();
			} else {
				ballHeld = false;
			}
		});
		ballReset();
	});
}

function resetGame() {
	lastScore = score;
	baseSpeed = INITIAL_SPEED;
	maxSpeed = INITIAL_MAX_SPEED;
	resetBricks();
	resetScore();
	ballHeld = true;
	ballReset();
	lives = INITIAL_LIVES;
	showTitle = true;
	initPills();
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

function increaseScore(points) {
	if (typeof(points) != 'number') {
		points = BRICK_HIT_POINTS;
	}
	score += points;
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

function drawEverything() {
	if (showTitle) {
		drawTitleScreen();
	} else {
		colorRect(0, 0, canvas.width, canvas.height, 'rgb(75,105,47 )');
		canvasContext.fillStyle = 'white';
		canvasContext.textAlign = 'center';
		canvasContext.fillText(score.toString(), canvas.width/2, 10);
		drawPaddle();
		drawBall();
		drawBricks();
		drawLives();
		drawPills();
	}
}

function moveEverything() {
	if (!showTitle) {
		ballMove();
		pillsMove();
	}
}

function drawLives() {
	var posX = canvas.width - 30;
	var posY = 10;
	for (var i=0; i<lives; i++) {
		drawBitMap(livesPic, posX - i*20, posY);
	}
}
