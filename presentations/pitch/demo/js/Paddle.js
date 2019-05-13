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

function drawPaddle() {
	canvasContext.save();
	canvasContext.globalAlpha = paddleAlpha;
	canvasContext.scale(paddleScale.x, paddleScale.y);
	drawBitMap(paddlePic, Math.floor(paddleX/paddleScale.x), PADDLE_Y + 5);
	canvasContext.restore();
}
