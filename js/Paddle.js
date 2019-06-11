var paddleWidth = 100;
const PADDLE_ORIGINAL_W = 100;
const PADDLE_THICKNESS = 48;
var paddleX = (800 - paddleWidth)/2;
const PADDLE_ORIGINAL_Y = 540;
var paddleY = PADDLE_ORIGINAL_Y;
var paddleGun = 0;
var paddleShoot = false;
var paddleShotDraw = 0;
var paddleAltShot = false;

var jumpSpeedY = 0;
var currentJumpFactorIndex = 0;
const JUMP_POWER_FACTORS = [1.2*340, 1.5*340, 1.8*340];
const GRAVITY = 1000;
const AIR_RESISTANCE = 9;

var paddleAlpha = 1;
var paddleScale = {x: 1, y: 1};
var paddleFrozen = false;


function movePaddleOnMouseMove(evt) {
	var mousePos = calculateMousePos(evt);
	if(!(demoScreen || paddleFrozen)){
		paddleX = mousePos.x - (paddleWidth/2);
	}

	len = allBalls.length;
	for (var i = 0; i < len;i++) {
		ball = allBalls[i];
		if (ball.ballHeld) {
			ball.X = paddleX + paddleWidth/2;
		}
	} // end of for in
} // end of movePaddleOnMouseMove

let jumpSoundPlaying = false;
let firstJumpSoundPlayed = false;

function paddleJump(dt) {
	if (!firstJumpSoundPlayed) {
		playMultiSound(arrayOfPaddleJumpSounds);
		firstJumpSoundPlayed = true;
	}

	if (paddleY >= PADDLE_ORIGINAL_Y) {
		let power = JUMP_POWER_FACTORS[currentJumpFactorIndex];
		jumpSpeedY = -power;
		currentJumpFactorIndex++;
		if (currentJumpFactorIndex >= JUMP_POWER_FACTORS.length) {
			currentJumpFactorIndex = 0;
		}
	}
	// jumpSpeedY *= AIR_RESISTANCE;
	jumpSpeedY += GRAVITY*dt;
	paddleY += jumpSpeedY*dt;

	console.log(jumpSoundPlaying);
	if (paddleY >= 535) {
		console.log("paddleY", paddleY);
		if (!jumpSoundPlaying) {
			playMultiSound(arrayOfPaddleJumpSounds);
			jumpSoundPlaying = true;
			setTimeout(function() {
				jumpSoundPlaying = false;
			}, 750)
		}
	}

}

function paddleShooting()
{
	var brickIndex = -1;
	var shootX = paddleX - (paddleWidth/2) + (paddleAltShot ? paddleWidth : 0);
	var tileRow = 0;
	do {
		var tileCol = Math.floor(shootX / BRICK_W);
		brickIndex = brickToTileIndex(tileCol, tileRow);
		tileRow++;
	} while (!isValidBrick(brickGrid[brickIndex]) && tileRow < BRICK_ROWS);
	
	if(isValidBrick(brickGrid[brickIndex]))
	{
		var brickHitEvent = new CustomEvent('brickHit', {detail: {
			index: brickIndex,
			col: tileCol,
			row: tileRow,
			x: shootX,
			y: tileRow * ROW_H,
			ball: null
		}});
		canvas.dispatchEvent(brickHitEvent);
	}
	
	paddleShoot = false;
	paddleGun -= 1;
	
	paddleAltShot = !paddleAltShot;
	
	paddleShotDraw = 4;
}

function moveComputerPaddle(whichBall) {
	var speed = whichBall.getSpeedFromVelocity(whichBall.VelX, whichBall.VelY)*0.06;
	var checkX = whichBall.X;
	if (whichBall.VelY > 0) {
		if (checkX > paddleX + paddleWidth*0.75) {
			paddleX += speed;
		} else if (checkX < paddleX + paddleWidth*0.25) {
			paddleX -= speed;
		}
	}
	if (paddleX + paddleWidth > canvas.width) {
		paddleX = canvas.width - paddleWidth;
	}
	if (paddleX < 0) {
		paddleX = 0;
	}
}

// the paddle blinks when it hits the ball, the impact is felt
function paddleBlink() {
	blinkCounter = 5;
}

// draw googly eyes that follow the ball just for fun =)
var blinkCounter = 0;
function drawGooglyEyes(whichBall) {

	var eyeX = Math.floor((paddleX)/paddleScale.x) + 7;
	var eyeY = paddleY + 21;
	var eyeSpacing = 62;
	var pupilDistance = 4; // how much movement
	var angle;
	if (!paddleFrozen) {
		angle = Math.atan2(whichBall.Y-paddleY, whichBall.X-paddleX);
	} else {
		eyeX = Math.floor((paddleX)/paddleScale.x);
		eyeY = paddleY;
	}

	// blink occasionally
	if (blinkCounter && !paddleFrozen) {
		drawBitMap(eyelidsPic,eyeX,eyeY);
		drawBitMap(eyelidsPic,eyeX+eyeSpacing,eyeY);
		blinkCounter--;
	} else {
		// whites
		drawBitMap(eyeballPic,eyeX,eyeY);
		drawBitMap(eyeballPic,eyeX+eyeSpacing,eyeY);
		// pupils
		eyeX += pupilDistance * Math.cos(angle) + 3;
		eyeY += pupilDistance * Math.sin(angle) + 3;
		drawBitMap(pupilPic,eyeX,eyeY);
		drawBitMap(pupilPic,eyeX+eyeSpacing,eyeY);
	}

	if (!paddleFrozen) {
		if (Math.random() < 0.01) { // maybe start a new blink or stay closed longer
		blinkCounter = 5; // frames of closed eyes
		}
	}
	
}

function drawPaddle() {
	var image = paddleFrozen ? paddleFrozenPic : paddlePic;
	canvasContext.save();
	canvasContext.globalAlpha = paddleAlpha;
	canvasContext.scale(paddleScale.x, paddleScale.y);
	drawBitMap(image, Math.floor(paddleX/paddleScale.x), paddleY + 5);
	if(paddleShotDraw > 0)
	{
		drawBitMap(shotPic, paddleX  - (paddleWidth/2) + (paddleAltShot ? 0 : paddleWidth), paddleY - 70);
		paddleShotDraw--;
	}
	drawGooglyEyes(allBalls[0]);
	canvasContext.restore();
}
