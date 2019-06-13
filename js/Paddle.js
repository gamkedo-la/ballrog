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

var paddleWobbleTimerFull = 45;
var paddleWobbleTimer = 0;
var wobbleScaleAngle = Math.PI/6;
var wobbleScale = {x: 1, y: 1};

var jumpSpeedY = 0;
var currentJumpFactorIndex = 0;
const JUMP_POWER_FACTORS = [1.2*340, 1.5*340, 1.8*340];
const GRAVITY = 1000;
const AIR_RESISTANCE = 9;

var paddleAlpha = 1;
var paddleScale = {x: 1, y: 1};
var paddleFrozen = false;

function maybeMoveHeldBall() {
	len = allBalls.length;
	for (var i = 0; i < len;i++) {
		ball = allBalls[i];
		if (ball.ballHeld) {
			ball.X = paddleX + paddleWidth/2;
		}
	} // end of for in
}

function movePaddleOnMouseMove(evt) {
	var mousePos = calculateMousePos(evt);
	if(!(demoScreen || paddleFrozen)){
		paddleX = mousePos.x - (paddleWidth/2);
	}
	maybeMoveHeldBall();
} // end of movePaddleOnMouseMove

let jumpSoundPlaying = false;
let firstJumpSoundPlayed = false;

function freezePaddle(timeout) {
	paddleFrozen = true;
	paddleFrozenTimer = 0;
	paddleFrozenTimeout = timeout;
}

function updatePaddleState(dt) {
	if (paddleFrozen) {
		paddleFrozenTimer += dt;
		paddleFrozen = paddleFrozenTimer < paddleFrozenTimeout;
	}
	if (paddleJumping) {
		paddleJump(dt);
	}
	if (paddleShoot) {
		paddleShooting();
	}
}

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
	if (heldBall != undefined || serveTimer > 0) { 
		angle = Math.atan2((whichBall.Y - (BALL_RADIUS * 15)) - paddleY, whichBall.X-paddleX);
		if (heldBall != undefined) {
			serveTimer = 20;
		} else {
			serveTimer--;
		}
	} else if (!paddleFrozen) {
		angle = Math.atan2(whichBall.Y - paddleY, whichBall.X-paddleX);
	} else {
		eyeX = Math.floor((paddleX)/paddleScale.x);
		eyeY = paddleY;
	}

	// blink occasionally
	if (blinkCounter && !paddleFrozen) {
		canvasContext.drawImage(eyelidsPic, 0,0,eyelidsPic.width,eyelidsPic.height, 
								eyeX, eyeY, 
								eyelidsPic.width, eyelidsPic.height);
		canvasContext.drawImage(eyelidsPic, 0,0,eyelidsPic.width,eyelidsPic.height, 
								eyeX + eyeSpacing, eyeY, 
								eyelidsPic.width, eyelidsPic.height);
		blinkCounter--;
	} else {
		// whites
		canvasContext.drawImage(eyeballPic, 0,0,eyeballPic.width,eyeballPic.height, 
								eyeX, eyeY, 
								eyeballPic.width, eyeballPic.height);
		canvasContext.drawImage(eyeballPic, 0,0,eyeballPic.width,eyeballPic.height, 
								eyeX + eyeSpacing, eyeY, 
								eyeballPic.width, eyeballPic.height);
		// pupils
		eyeX += pupilDistance * Math.cos(angle) + 3;
		eyeY += pupilDistance * Math.sin(angle) + 3;
		canvasContext.drawImage(pupilPic, 0,0,pupilPic.width,pupilPic.height, 
								eyeX, eyeY, 
								pupilPic.width, pupilPic.height);
		canvasContext.drawImage(pupilPic, 0,0,pupilPic.width,pupilPic.height, 
								eyeX + eyeSpacing, eyeY, 
								pupilPic.width, pupilPic.height);
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

	if (paddleShotDraw > 0)
	{
		drawBitMap(shotPic, paddleX  - (paddleWidth/2) + (paddleAltShot ? 0 : paddleWidth), paddleY - 70);
		paddleShotDraw--;
	}
	if (paddleWobbleTimer > 0) {
		if (paddleWobbleTimer % 7 == 0) {
			wobbleScaleAngle = setWobbleScaleAngle(wobbleScaleAngle);
			wobbleScale.x = Math.sin(wobbleScaleAngle) * 3;
			wobbleScale.y = wobbleScale.x;	
		}
		canvasContext.drawImage(image, 0,0,image.width,image.height, 
								Math.floor(paddleX/paddleScale.x) + (-0.5 * wobbleScale.x), paddleY + 5 + (-0.5 * wobbleScale.y),  
								image.width + wobbleScale.x, image.height + wobbleScale.y);
		paddleWobbleTimer--;
	} else {
		drawBitMap(image, Math.floor(paddleX/paddleScale.x), paddleY + 5);
		wobbleScale.x = 1;
		wobbleScale.y = 1;
	}

	if (checkIfBallHeld()) {
		drawGooglyEyes(heldBall);
	} else {
		if (allBalls.length > 1) {
			sortForLowestBall();
		}
		drawGooglyEyes(allBalls[0]);
	}
	canvasContext.restore();
}

var direction = 1;

function setWobbleScaleAngle(angle) {

	if (angle >= Math.PI || angle <= 0) {
		direction *= -1;
	}
	
	angle += Math.PI/12 * direction;
	return angle * -1;
}
