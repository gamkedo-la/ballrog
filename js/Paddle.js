var PADDLE_W = 100;
const PADDLE_THICKNESS = 48;
var paddleX = (800 - PADDLE_W)/2;
var paddleY = 540;
var paddleAlpha = 1;
var paddleScale = {x: 1, y: 1};

function movePaddleOnMouseMove(evt) {
	var mousePos = calculateMousePos(evt);
	paddleX = mousePos.x - (PADDLE_W/2);
	if (ballHeld) {
		ballX = paddleX + PADDLE_W/2;
	}
}

function moveComputerPaddle() {
	var speed = getSpeedFromVelocity(ballVelX, ballVelY)*0.96;
	var checkX = ballX;
	if (ballVelY > 0) {
		if (checkX > paddleX + PADDLE_W*0.75) {
			paddleX += speed;
		} else if (checkX < paddleX + PADDLE_W*0.25) {
			paddleX -= speed;
		}
	}
	if (paddleX + PADDLE_W > canvas.width) {
		paddleX = canvas.width - PADDLE_W;
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
function drawGooglyEyes() {

	var eyeX = Math.floor((paddleX)/paddleScale.x) + 7;
	var eyeY = paddleY + 21;
	var eyeSpacing = 62;
	var pupilDistance = 4; // how much movement
	var angle = Math.atan2(ballY-paddleY, ballX-paddleX);
	
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
	drawGooglyEyes();
	canvasContext.restore();
}
