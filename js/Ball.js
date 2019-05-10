const BALL_RADIUS = 10;
const COLLISION_STEP = 4; // higher = faster, lower = precise
const INITIAL_SPEED = 8;
const INITIAL_MAX_SPEED = 30;
var ballX;
var ballY;
var ballVelX = 6;
var ballVelY = -4;
var maxSpeed = INITIAL_MAX_SPEED;
var baseSpeed = INITIAL_SPEED;
var minSpeed = baseSpeed;
var ballMissEvent = new CustomEvent('ballMiss');
var ballResetEvent = new CustomEvent('ballReset');
var highestHitRow = BRICK_ROWS;
var passingThrough = false;
var wallHitEvent = new CustomEvent('wallHit');
var ballTrail = new TrailFX(ballTrailPic);


function ballReset() {
	minSpeed = baseSpeed;
	ballX = paddleX + PADDLE_W/2;
	ballY = paddleY - BALL_RADIUS/2;
	updateVelocity(ballVelX, ballVelY > 0 ? -ballVelY : ballVelY);
	updateSpeed(minSpeed);
	highestHitRow = BRICK_ROWS;
	passingThrough = false;
	var ballResetEvent = new CustomEvent('ballReset');
	canvas.dispatchEvent(ballResetEvent);
}

function updateVelocity(velX, velY) {
	ballVelX = velX;
	ballVelY = velY;
}

function updateSpeed(speed) {
	if (speed > maxSpeed) {
		speed = maxSpeed;
	}
	var dir = getVelocityDir(ballVelX, ballVelY);
	updateVelocity(speed*dir.x, speed*dir.y);
}

function increaseSpeed(evt) {
	if (evt.detail.row < highestHitRow) {
		highestHitRow = evt.detail.row;
		minSpeed += (BRICK_ROWS - highestHitRow)*0.44;
		if (minSpeed > getSpeedFromVelocity(ballVelX, ballVelY)) {
			updateSpeed(minSpeed);
		}
	}
}

function getSpeedFromVelocity(velX, velY) {
	return Math.sqrt(Math.pow(velX, 2) + Math.pow(velY, 2));
}

function getVelocityDir(velX, velY) {
	var speed = getSpeedFromVelocity(velX, velY);
	return {x: velX/speed, y: velY/speed};
}

function ballMove() {
	if (!ballHeld) {
		ballX += ballVelX;
		ballY += ballVelY;
		if ((ballX + BALL_RADIUS > canvas.width && ballVelX > 0) || (ballX - BALL_RADIUS < 0 && ballVelX < 0)){  //keeps ball within screen (sides and top)
			updateVelocity(-1*ballVelX, ballVelY);
			canvas.dispatchEvent(wallHitEvent);
		}
		if (ballY + BALL_RADIUS > paddleY && ballY - BALL_RADIUS < paddleY + PADDLE_THICKNESS && ballVelY > 0) { //ball hits the paddle
			if (ballX + BALL_RADIUS > paddleX && ballX - BALL_RADIUS < paddleX + PADDLE_W) {
				if(stickyBall){
					ballHeld = true;
				}
				let deltaX = ballX - (paddleX + PADDLE_W/(2*paddleScale.x));
				var randomAngle = (Math.random() *0.1);
				updateVelocity(deltaX*0.44, -1*ballVelY);
				let currentSpeed = getSpeedFromVelocity(ballVelX, ballVelY);
				if (currentSpeed < minSpeed) {
					updateSpeed(minSpeed) * randomAngle;
				}
				passingThrough = false;
				let paddleHitEvent = new CustomEvent('paddleHit');
				canvas.dispatchEvent(paddleHitEvent);
			}
		}
		if (ballY > canvas.height) {
			ballReset();
			canvas.dispatchEvent(ballMissEvent);
		}
		if (ballY < 0) {
			updateVelocity(ballVelX, -1*ballVelY);
			canvas.dispatchEvent(wallHitEvent);
		}
		breakAndBounceOffBrickAtPixelCoord(
			ballX + Math.sign(ballVelX)*BALL_RADIUS,
			ballY + Math.sign(ballVelY)*BALL_RADIUS
		);
	}

	ballTrail.update(ballX,ballY);

}

function breakAndBounceOffBrickAtPixelCoord(pixelX, pixelY) {
	if (pixelY > BRICK_H*BRICK_ROWS + TOP_MARGIN || pixelY < TOP_MARGIN) {
		return;
	}
	var brickIndex, srcX, srcY;
	var srcX = pixelX - ballVelX;
	var srcY = pixelY - ballVelY;
	var prevBallX = srcX;
	var prevBallY = srcY;
	var nextX, nextY;
	var dir = getVelocityDir(ballVelX, ballVelY);
	do {
		nextX = srcX + dir.x*COLLISION_STEP;
		if (nextX < 0) {
			nextX = 0;
		}
		if (nextX > canvas.width) {
			nextX = canvas.width;
		}
		nextY = srcY + dir.y*COLLISION_STEP;
		if (nextY < 0) {
			nextY = 0;
		}
		if (nextY > canvas.height) {
			nextY = canvas.height;
		}
		var tileCol = Math.floor(nextX / BRICK_W);
		var tileRow = Math.floor((nextY - TOP_MARGIN) / BRICK_H);
		srcX = nextX;
		srcY = nextY;
		brickIndex = brickToTileIndex(tileCol, tileRow);
	} while (nextY < TOP_MARGIN || (
		!isValidBrick(brickGrid[brickIndex]) &&
			(dir.x > 0 ? pixelX - nextX : nextX - pixelX) > 0 &&
			(dir.y < 0 ? pixelY - nextY : nextY - pixelY) > 0));

	if (isValidBrick(brickGrid[brickIndex])) {
		ballX = nextX;
		ballY = nextY;
		var prevTileCol = Math.floor(prevBallX / BRICK_W);
		if (prevTileCol != tileCol) {
			prevTileCol = tileCol + Math.sign(ballVelX);
		}
		if (prevTileCol < 0) {
			prevTileCol = 0;
		}
		if (prevTileCol > BRICK_COLS) {
			prevTileCol = BRICK_COLS;
		}
		var prevTileRow = Math.floor(prevBallY / BRICK_H);
		if (prevTileRow != tileRow) {
			prevTileRow = tileRow + Math.sign(-ballVelY);
		}
		if (prevTileRow < 0) {
			prevTilerow = 0;
		}
		if (prevTileRow > BRICK_ROWS) {
			prevTileRow = BRICK_ROWS;
		}

		var bothTestsFailed = true;

		if (prevTileCol != tileCol) { // must have come in horizontally
		    var adjacentBrickIndex = brickToTileIndex(prevTileCol, tileRow);
		    if (brickGrid[adjacentBrickIndex] == BRICK_TYPES.empty) {
				updateVelocity(-1*ballVelX, ballVelY);
				bothTestsFailed = false;
		    }
		}
		if (prevTileRow != tileRow) { // must have come in vertically
		    var adjacentBrickIndex = brickToTileIndex(tileCol, prevTileRow);
		    if (prevTileRow < 0 || brickGrid[adjacentBrickIndex] == BRICK_TYPES.empty) {
				updateVelocity(ballVelX, -1*ballVelY);
				bothTestsFailed = false;
		    }
		}

		if (bothTestsFailed) {
			updateVelocity(-1*ballVelX, -1*ballVelY);
		}

		var brickHitEvent = new CustomEvent('brickHit', {detail: {
			index: brickIndex,
			col: tileCol,
			row: tileRow,
			x: ballX,
			y: ballY
		}});
		canvas.dispatchEvent(brickHitEvent);
	}
}

function drawBall() {
	ballTrail.draw();
	drawBitMap(ballPic, ballX - BALL_RADIUS, ballY - BALL_RADIUS);
}
