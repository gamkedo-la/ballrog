const BALL_RADIUS = 10;
const COLLISION_STEP = 3; // higher = faster, lower = precise
const INITIAL_SPEED = 180; // pixels/second
const INITIAL_MAX_SPEED = 400; // pixels/second
var highestHitRow = BRICK_ROWS;

var debugBall = false;
var servingX = undefined;
var servingY = undefined;

function increaseBallSpeed(evt) {
	var ball = allBalls[0];
	if (evt.detail.row < highestHitRow) {
		highestHitRow = evt.detail.row;
		ball.minSpeed += (BRICK_ROWS - highestHitRow);
		console.log('SET MIN SPEED TO', ball.minSpeed);
		if (ball.minSpeed > ball.getSpeedFromVelocity(ball.VelX, ball.VelY)) {
			ball.updateSpeed(ball.minSpeed);
		}
	}
}

function debugBallMovement(evt) {
	if (debugBall) {
		var mouse = calculateMousePos(evt);
		allBalls[0].X = mouse.x;
		allBalls[0].Y = mouse.y;
		allBalls[0].breakAndBounceOffBrickAtPixelCoord(
			allBalls[0].X - spaceInvadeX,
			allBalls[0].Y - spaceInvadeY,
			dt
		);
	}
}

function ballClass(x,y,vx,vy){
	this.X = x || 0;
	this.Y = y || 0;
	this.VelX = vx || 3;
	this.VelY = vy || -2;
	this.maxSpeed = INITIAL_MAX_SPEED;
	this.baseSpeed = INITIAL_SPEED;
	this.minSpeed = this.baseSpeed;
	this.ballHeld = false;
	this.ballMissEvent = new CustomEvent('ballMiss');
	this.bossMissedBallEvent = new CustomEvent('bossMissedBall');
	this.ballResetEvent = new CustomEvent('ballReset');
	this.wallHitEvent = new CustomEvent('wallHit');
	this.ballTrail = new TrailFX(ballTrailPic);
	this.bounceEffect = new BounceFX(bouncePic);

	this.ballReset = function(ballCount) {
		if(ballCount == 1){
			this.minSpeed = this.baseSpeed;
			this.X = paddleX + paddleWidth/2;
			this.Y = paddleY - BALL_RADIUS/2;
			this.ballHeld = true;
			this.serveReset();
			highestHitRow = BRICK_ROWS;
			this.ballResetEvent = new CustomEvent('ballReset');
			canvas.dispatchEvent(this.ballResetEvent);
		}//end if
	}// end ballReset

	this.updateVelocity = function(velX, velY) {
		var speedMultiplier;
		if (speedIncreased) {
			speedMultiplier = 1.02;
		} else {
			speedMultiplier = 1;
		}

		var onePercentOfSpeed = (Math.random() > 0.5) ? 0.01 : -0.01;
		this.VelX = velX + (velX * onePercentOfSpeed);
		this.VelY = velY + (velY * onePercentOfSpeed);
		this.VelX *= speedMultiplier;
		this.VelY *= speedMultiplier;
		if (this.VelX == 0) {
			this.VelX += onePercentOfSpeed;
		}
		if (this.VelY == 0) {
			this.VelY += onePercentOfSpeed;
		}
	}

	this.updateSpeed = function(speed) {
		if (speed > this.maxSpeed) {
			speed = this.maxSpeed;
		}
		var dir = this.getVelocityDir(this.VelX, this.VelY);
		this.updateVelocity(speed*dir.x, speed*dir.y);
	}

	this.getSpeedFromVelocity = function(velX, velY) {
		let currentVisualVelocity = Math.sqrt(Math.pow(velX, 2) + Math.pow(velY, 2));
		let conversionRate = 1/7.5;
		return Math.sqrt(Math.pow(velX, 2) + Math.pow(velY, 2));
	}

	this.getVelocityDir = function(velX, velY) {
		var speed = this.getSpeedFromVelocity(velX, velY);
		return {x: velX/speed, y: velY/speed};
	}

	this.serveReset = function() {
		//console.log('getting new serve');
		var servingDegree = getRandomIntInclusive(83,90);
		servingY = Math.sin(servingDegree * DEGREES_TO_RADS);
		var x = Math.cos(servingDegree * DEGREES_TO_RADS);
		servingX = (Math.random() > 0.5) ? x : -x;
		
		this.VelX = servingX;
		this.VelY = -servingY;
		this.updateSpeed(this.minSpeed);
	}
	
	this.ballMove = function(dt) {
		if (debugBall) {
			this.VelX = 1;
			this.VelY = 1;
			return;
		}

		if (this.ballHeld) {
			this.Y = paddleY - BALL_RADIUS/2;
			if (servingX == undefined) {
				this.serveReset();
			}
		} else {
			servingX = undefined; 
			servingY = undefined;
			//update ball position using current velocity
			this.X += this.VelX*dt;
			this.Y += this.VelY*dt;

			// bounce off side walls
			this.bounceOffSidesIfAppropriate();

			// bounce off the paddle
			this.bounceOffPaddleIfAppropriate(paddleX, paddleY, paddleWidth, paddleScale);
			if (battlingBoss) {
				this.bounceOffPaddleIfAppropriate(
					boss.X,
					boss.Y,
					boss.width,
					{x: 1, y: 1}
				);
			}

			// fell through floor
			this.fallThroughFloorIfAppropriate();

			// hit ceiling
			if (battlingBoss) {
				this.goThroughCeilingIfAppropriate();
			} else {
				this.bounceOffCeilingIfAppropriate();
			}

			// break a brick
			this.breakAndBounceOffBrickAtPixelCoord(
				this.X - spaceInvadeX + Math.sign(this.VelX)*BALL_RADIUS,
				this.Y - spaceInvadeY + Math.sign(this.VelY)*BALL_RADIUS,
				dt
			);

			// magnetic ball
			this.magneticBall();
		}

		this.ballTrail.update(this.X,this.Y);
	 }

	 this.bounceOffSidesIfAppropriate = function() {
		if ((this.X + BALL_RADIUS > canvas.width && this.VelX > 0) ||
		    (this.X - BALL_RADIUS < 0 && this.VelX < 0)) {  //keeps ball within screen
			this.bounceEffect.trigger(this.X+(this.VelX>0?BALL_RADIUS:-BALL_RADIUS),this.Y);
			this.updateVelocity(-1*this.VelX, this.VelY);
			canvas.dispatchEvent(this.wallHitEvent);
		}
	 }

	this.bounceOffPaddleIfAppropriate = function(posX, posY, width, scale) {
		if (this.didHitPaddle(posX, posY, width)) { //ball hit the paddle
			if (stickyBall) {
				stickyBall = false;
				this.ballHeld = true;
				return;
			}

			let deltaX = this.X - (posX + width/(2*scale.x));
			var randomAngle = (Math.random() * 0.1);
			this.updateVelocity(deltaX*6.3, -1*this.VelY);
			let currentSpeed = this.getSpeedFromVelocity(this.VelX, this.VelY);

			if (currentSpeed < this.minSpeed) {
				this.updateSpeed(this.minSpeed) * randomAngle;
			}

			let paddleHitEvent = new CustomEvent('paddleHit');
			canvas.dispatchEvent(paddleHitEvent);
			this.bounceEffect.trigger(this.X,this.Y+BALL_RADIUS+5);
		}
	}

	this.didHitPaddle = function(posX, posY, width) {
		let result = false;
		let thickness = posY > canvas.height/2 ? PADDLE_THICKNESS : 0;
		if ((this.Y + BALL_RADIUS > posY) &&
			(this.Y - BALL_RADIUS < posY + PADDLE_THICKNESS) &&
			((posY > canvas.height/2 && this.VelY > 0) || (posY < canvas.height/2 && this.VelY < 0))) { //same vertical position as paddle
				if ((this.X + BALL_RADIUS > posX) &&
				    (this.X - BALL_RADIUS < posX + width)) { //same horizontal position as paddle
						//console.log("hit paddle");
						result = true;
				}
		}

		return result;
	}

	this.goThroughCeilingIfAppropriate = function() {
		if (this.Y + BALL_RADIUS*2 < 0) {
			this.ballReset(ballCount);
			canvas.dispatchEvent(this.bossMissedBallEvent);
			if (ballCount != 1) {
				ballCount--;
				for (let i=0; i<allBalls.length; i++) {
					if (allBalls[i] === this) {
						allBalls.splice(i, 1);
						break;
					}
				}
			}
		}
	}
	
    this.fallThroughFloorIfAppropriate = function() {
		if (this.Y > canvas.height) {
			this.ballReset(ballCount);
			canvas.dispatchEvent(this.ballMissEvent);
			if(ballCount != 1) {
				ballCount--;
				for(var i = 0; i < allBalls.length; i++) {
					if(allBalls[i] === this) {
						allBalls.splice(i, 1); //destroy extra ball that falls through floor
					}//end if
				}//end for
			}//end if
		}//end if
	}

	 this.bounceOffCeilingIfAppropriate = function() {
		if (this.Y < 0) {
			this.updateVelocity(this.VelX, -1*this.VelY);
			canvas.dispatchEvent(this.wallHitEvent);
			this.bounceEffect.trigger(this.X,this.Y-BALL_RADIUS);
		}
	 }

	this.breakAndBounceOffBrickAtPixelCoord = function(pixelX, pixelY, dt) {
		if (pixelY > BRICK_H*BRICK_ROWS + TOP_MARGIN || pixelY < TOP_MARGIN) {
			return;
		}
		var brickIndex, srcX, srcY;
		var srcX = pixelX - this.VelX*dt;
		var srcY = pixelY - this.VelY*dt;
		var prevBallX = srcX;
		var prevBallY = srcY;
		var nextX, nextY;
		var dir = this.getVelocityDir(this.VelX, this.VelY);
		var counter = 0;
		const MAX_LOOPS = 10;
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
			if (++counter > MAX_LOOPS) {
				break;
			}
		} while (nextY < TOP_MARGIN || (
			!isValidBrick(brickGrid[brickIndex]) &&
				(dir.x > 0 ? pixelX - nextX : nextX - pixelX) > 0 &&
				(dir.y < 0 ? pixelY - nextY : nextY - pixelY) > 0));

		if (isValidBrick(brickGrid[brickIndex])) {
			if (checkBrickIndexWithPixelCoord(brickIndex, pixelX, pixelY - TOP_MARGIN)) {
				var prevTileCol = Math.floor(prevBallX / BRICK_W);
			if (prevTileCol != tileCol) {
				prevTileCol = tileCol + Math.sign(this.VelX);
			}
			if (prevTileCol < 0) {
				prevTileCol = 0;
			}
			if (prevTileCol > BRICK_COLS) {
				prevTileCol = BRICK_COLS;
			}
			var prevTileRow = Math.floor(prevBallY / BRICK_H);
			if (prevTileRow != tileRow) {
				prevTileRow = tileRow + Math.sign(-this.VelY);
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
					this.updateVelocity(-1*this.VelX, this.VelY);
					bothTestsFailed = false;
				}
			}
			if (prevTileRow != tileRow) { // must have come in vertically
				var adjacentBrickIndex = brickToTileIndex(tileCol, prevTileRow);
				if (prevTileRow < 0 || brickGrid[adjacentBrickIndex] == BRICK_TYPES.empty) {
					this.updateVelocity(this.VelX, -1*this.VelY);
					bothTestsFailed = false;
				}
			}

			if (bothTestsFailed) {
				if(tileRow == BRICK_ROWS - 1){
					this.updateVelocity(-1*this.VelX, -1*this.VelY);
				} else {
					this.updateVelocity(-1*this.VelX, 1*this.VelY);
				}
			}

			var brickHitEvent = new CustomEvent('brickHit', {detail: {
				index: brickIndex,
				col: tileCol,
				row: tileRow,
				x: this.X,
				y: this.Y,
				ball: this
			}});
			canvas.dispatchEvent(brickHitEvent);

			this.bounceEffect.trigger(this.X,this.Y+(this.VelY<0?BALL_RADIUS:-BALL_RADIUS));
			}
		}
	}

	this.magneticBall = function() {
		if(magneticBall && this.VelY > 0) {
			if(paddleX+paddleWidth/2 < this.X-BALL_RADIUS) {
				//Ball on the right of paddle
				this.X -= 7;
			} else if(paddleX+paddleWidth/2 > this.X+BALL_RADIUS) {
				//Ball on the left of paddle
				this.X += 7;
			}
		}
	}

	this.drawBall = function() {
		if(!this.ballHeld) {
			this.ballTrail.draw();
		}

		this.bounceEffect.draw();
		drawBitMap(ballPic, this.X - BALL_RADIUS, this.Y - BALL_RADIUS);
	}
}

var allBalls = [];
function startMultiBall(quantity) {
	console.log("MULTI BALL x"+quantity);
	for (let num=0; num < quantity; num++) {

		var newBall = new ballClass(
			allBalls[0].X+Math.random()*32-16,
			allBalls[0].Y+Math.random()*8-4,
			allBalls[0].VelX+Math.random()*8-4,
			allBalls[0].VelY+Math.random()*8-4);

		allBalls.push(newBall);
	}
	ballCount = ballCount + quantity;
	sounds.spawnMultiBall.play();
}

function allBallsUnheld() {
	len = allBalls.length;
	for (let i=0; i < len; i++) {
		ball = allBalls[i];
		if (ball.ballHeld) {
			ball.ballHeld = !ball.ballHeld;
		}
	}
}

function checkIfBallHeld() {
	var result = false;
	var len = allBalls.length;
	for (let i=0; i < len; i++) {
		ball = allBalls[i];
		if (ball.ballHeld) {
			result = true;
			break;
		}
	}
	return result;
}
