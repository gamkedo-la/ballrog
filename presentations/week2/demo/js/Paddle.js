var paddleWidth = 100;
const PADDLE_ORIGINAL_W = 100;
const PADDLE_THICKNESS = 48;
var paddleX = (800 - paddleWidth)/2;
const PADDLE_ORIGINAL_Y = 540;
var paddleY = PADDLE_ORIGINAL_Y;

var jumpSpeedY = 0;
var currentJumpFactorIndex = 0;
const JUMP_POWER_FACTORS = [1.2, 1.5, 1.8];
const GRAVITY = .99;
const AIR_RESISTANCE = .9;

var paddleAlpha = 1;
var paddleScale = {x: 1, y: 1};

function movePaddleOnMouseMove(evt) {
	var mousePos = calculateMousePos(evt);
	if(!demoScreen){
		paddleX = mousePos.x - (paddleWidth/2);
	}
	if (ballHeld) {
		allBalls[0].X = paddleX + paddleWidth/2;
	}
}

function paddleJump() {
	if (paddleY >= PADDLE_ORIGINAL_Y) {
		let power = PADDLE_THICKNESS/JUMP_POWER_FACTORS[currentJumpFactorIndex];
		jumpSpeedY = -power;
		currentJumpFactorIndex++;
		if (currentJumpFactorIndex >= JUMP_POWER_FACTORS.length) {
			currentJumpFactorIndex = 0;
		}
	}

	if (paddleY === PADDLE_ORIGINAL_Y) {

	}
	
	jumpSpeedY *= AIR_RESISTANCE;
	jumpSpeedY += GRAVITY;
	paddleY += jumpSpeedY;
}

function moveComputerPaddle(whichBall) {
	var speed = whichBall.getSpeedFromVelocity(whichBall.VelX, whichBall.VelY)*0.96;
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
	var angle = Math.atan2(whichBall.Y-paddleY, whichBall.X-paddleX);

	// blink occasionally
	if (blinkCounter) {
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

	if (Math.random() < 0.01) { // maybe start a new blink or stay closed longer
		blinkCounter = 5; // frames of closed eyes
	}
}

function drawPaddle() {
	canvasContext.save();
	canvasContext.globalAlpha = paddleAlpha;
	canvasContext.scale(paddleScale.x, paddleScale.y);
	drawBitMap(paddlePic, Math.floor(paddleX/paddleScale.x), paddleY + 5);
	drawGooglyEyes(allBalls[0]);
	canvasContext.restore();
}
