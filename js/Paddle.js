var PADDLE_W = 100;
const PADDLE_THICKNESS = 48;
var paddleX = (800 - PADDLE_W)/2;
var paddleAlpha = 1;
var paddleScale = {x: 1, y: 1};
const PADDLE_Y = 540;

function movePaddleOnMouseMove(evt) {
	var mousePos = calculateMousePos(evt);
	paddleX = mousePos.x - (PADDLE_W/2);
	if (ballHeld) {
		ballX = paddleX + PADDLE_W/2;
	}
}

// draw googly eyes that follow the ball just for fun =)
function drawGooglyEyes() {
	var eyeX = paddleX + 8;
	var eyeY = PADDLE_Y + 21;
	var eyeSpacing = 61;
	var pupilDistance = 4; // how much movement
	var angle = Math.atan2(ballY-PADDLE_Y, ballX-paddleX);
	// whites
	drawBitMap(eyeballPic,eyeX,eyeY);
	drawBitMap(eyeballPic,eyeX+eyeSpacing,eyeY);
	// pupils
	eyeX += pupilDistance * Math.cos(angle) + 3;
	eyeY += pupilDistance * Math.sin(angle) + 3;
	drawBitMap(pupilPic,eyeX,eyeY);
	drawBitMap(pupilPic,eyeX+eyeSpacing,eyeY);
}

function drawPaddle() {
	canvasContext.save();
	canvasContext.globalAlpha = paddleAlpha;
	canvasContext.scale(paddleScale.x, paddleScale.y);
	drawBitMap(paddlePic, Math.floor(paddleX/paddleScale.x), PADDLE_Y + 5);
	drawGooglyEyes();
	canvasContext.restore();
}
