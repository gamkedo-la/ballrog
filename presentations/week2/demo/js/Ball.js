const BALL_RADIUS = 10;
const COLLISION_STEP = 2; // higher = faster, lower = precise
const INITIAL_SPEED = 4;
const INITIAL_MAX_SPEED = 12;

function ballClass(x,y,vx,vy){
	this.X = x || 0;
	this.Y = y || 0;
	this.VelX = vx || 3;
	this.VelY = vy || -2;
	this.maxSpeed = INITIAL_MAX_SPEED;
	this.baseSpeed = INITIAL_SPEED;
	this.minSpeed = this.baseSpeed;
	this.ballMissEvent = new CustomEvent('ballMiss');
	this.ballResetEvent = new CustomEvent('ballReset');
	this.highestHitRow = BRICK_ROWS;
	this.passingThrough = false;
	this.wallHitEvent = new CustomEvent('wallHit');
	this.ballTrail = new TrailFX(ballTrailPic);
	this.bounceEffect = new BounceFX(bouncePic);


	this.ballReset = function(ballCount) {
		if(ballCount == 1){			
			this.minSpeed = this.baseSpeed;
			this.X = paddleX + paddleWidth/2;
			this.Y = paddleY - BALL_RADIUS/2;
			this.updateVelocity(this.VelX, this.VelY > 0 ? -this.VelY : this.VelY);
			this.updateSpeed(this.minSpeed);
			this.highestHitRow = BRICK_ROWS;
			passingThrough = false;
			this.ballResetEvent = new CustomEvent('ballReset');
			canvas.dispatchEvent(this.ballResetEvent);
		}//end if
	}// end ballReset

	 this.updateVelocity = function(velX, velY) {
		this.VelX = velX;
		this.VelY = velY;
	}

	 this.updateSpeed = function(speed) {
		if (speed > this.maxSpeed) {
			speed = this.maxSpeed;
		}
		var dir = this.getVelocityDir(this.VelX, this.VelY);
		this.updateVelocity(speed*dir.x, speed*dir.y);
	}

	 this.increaseSpeed = function(evt) {
		if (evt.detail.row < this.highestHitRow) {
			this.highestHitRow = evt.detail.row;
			this.minSpeed += (BRICK_ROWS - this.highestHitRow)*0.44;
			if (this.minSpeed > this.getSpeedFromVelocity(this.VelX, this.VelY)) {
				this.updateSpeed(this.minSpeed);
			}
		}
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

	 this.ballMove = function() {
		if (!ballHeld) {
			//update ball position using current velocity
			this.X += this.VelX;
			this.Y += this.VelY;

			// bounce off side walls
			this.bounceOffSidesIfAppropriate();

			// bounce off the paddle
			this.bounceOffPaddleIfAppropriate();

			// fell through floor
			this.fallThroughFloorIfAppropriate();

			// hit ceiling
			this.bounceOffCeilingIfAppropriate();

			// break a brick
			this.breakAndBounceOffBrickAtPixelCoord(
				this.X + Math.sign(this.VelX)*BALL_RADIUS,
				this.Y + Math.sign(this.VelY)*BALL_RADIUS
			);
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

	 this.bounceOffPaddleIfAppropriate = function() {
		if (this.didHitPaddle()) { //ball hit the paddle
			if(stickyBall) {
				ballHeld = true;
			}

			let deltaX = this.X - (paddleX + paddleWidth/(2*paddleScale.x));
			var randomAngle = (Math.random() * 0.1);
			this.updateVelocity(deltaX*0.13, -1*this.VelY);
			let currentSpeed = this.getSpeedFromVelocity(this.VelX, this.VelY);
			
			if (currentSpeed < this.minSpeed) {
				this.updateSpeed(this.minSpeed) * randomAngle;
			}

			let paddleHitEvent = new CustomEvent('paddleHit');
			canvas.dispatchEvent(paddleHitEvent);
			this.bounceEffect.trigger(this.X,this.Y+BALL_RADIUS+5);
		}
	 }

	 this.didHitPaddle = function() {
		let result = false;
		if ((this.Y + BALL_RADIUS > paddleY) && 
			(this.Y - BALL_RADIUS < paddleY + PADDLE_THICKNESS) && 
			(this.VelY > 0)) { //same vertical position as paddle
				if ((this.X + BALL_RADIUS > paddleX) && 
				    (this.X - BALL_RADIUS < paddleX + paddleWidth)) { //same horizontal position as paddle
					//ball hits the paddle
					result = true;
				}
			}

		return result;
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

	 this.breakAndBounceOffBrickAtPixelCoord = function(pixelX, pixelY) {
		if (pixelY > BRICK_H*BRICK_ROWS + TOP_MARGIN || pixelY < TOP_MARGIN) {
			return;
		}
		var brickIndex, srcX, srcY;
		var srcX = pixelX - this.VelX;
		var srcY = pixelY - this.VelY;
		var prevBallX = srcX;
		var prevBallY = srcY;
		var nextX, nextY;
		var dir = this.getVelocityDir(this.VelX, this.VelY);
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
				this.updateVelocity(-1*this.VelX, -1*this.VelY);
			}

			var brickHitEvent = new CustomEvent('brickHit', {detail: {
				index: brickIndex,
				col: tileCol,
				row: tileRow,
				x: this.X,
				y: this.Y,
				ball:this
			}});
			canvas.dispatchEvent(brickHitEvent);
			
			this.bounceEffect.trigger(this.X,this.Y+(this.VelY<0?BALL_RADIUS:-BALL_RADIUS));

		}
	}

	this.drawBall = function() {
		if(!ballHeld) {
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
			allBalls[0].velX+Math.random()*8-4,
			allBalls[0].velY+Math.random()*8-4);

		allBalls.push(newBall);		
	}
	ballCount = ballCount + quantity;
}

