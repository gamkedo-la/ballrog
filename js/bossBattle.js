bossClass.prototype = new FSMEnemyClass();
function bossClass() {
	const MAX_BOSS_LIVES = 4;
	this.width = PADDLE_ORIGINAL_W;
	this.height = PADDLE_THICKNESS;
	this.X = 400 - this.width/2;
	this.Y = 40;
	this.speed = 500;
	this.image = paddlePic;
	this.visible = true;
	this.ballIntersect = null;
	this.transitions = [
		['wait', 'slide', ballNotHeld],
		['slide', 'brickAttack', justMissedBall],
		['brickAttack', 'wait', brickAttackFinished],
		['slide', 'freezeAttack', ballTravellingDown],
		['freezeAttack', 'slide', ballTravellingUp],
		['slide', 'wait', ballHeld]
	];
	this.startState = 'wait';
	this.lives = MAX_BOSS_LIVES;
	this.attackRow = BRICK_ROWS - 1;
	this.attackCol = 0;
	this.defeatedEvent = new CustomEvent('bossDefeated');
	this.justMissedBall = false;
	const FREEZE_TIMEOUT = 1 + 1/3;
	this.freezeShot = {
		live: false,
		X: this.X,
		Y: this.Y,
		width: 10,
		height: this.height*0.6,
		speed: 500,
		draw: function() {
			if (this.live) {
				colorRect(this.X, this.Y, this.width, this.height, 'white');
			}
		},
		update: function(dt) {
			if (this.live) {
				this.Y += this.speed*dt;
				if (this.Y > canvas.height) {
					this.live = false;
				}
				if (this.X + this.width >= paddleX
					&& this.X <= paddleX + paddleWidth
					&& this.Y + this.height >= paddleY) {
					freezePaddle(FREEZE_TIMEOUT);
					this.live = false;
				}
			}
		}
	}

	this.superClassInit = this.init;
	this.init = function() {
		this.superClassInit();
		this.live = true;
		const self = this;
		canvas.addEventListener('bossMissedBall', function() {
			self.dropLife();
		});			
	};

	this.superClassUpdate = this.update;
	this.update = function(dt) {
		if (this.live) {
			this.superClassUpdate(dt);
			this.freezeShot.update(dt);
		}
	}

	this.superClassReset = this.reset;
	this.reset = function() {
		this.live = true;
		this.lives = MAX_BOSS_LIVES;
	};

	this.superClassDraw = this.draw;
	this.draw = function() {
		this.superClassDraw();
		this.freezeShot.draw();
	};

	this.dropLife = function() {
		this.live = --this.lives > 0;
		this.justMissedBall = true;
		if (!this.live) {
			canvas.dispatchEvent(this.defeatedEvent);
		}
		console.log('Boss lost life, lives remaining', this.lives);
	};
	
	this.states = {
		wait: noopState,
		slide: {
			enter: function(boss, dt) {
				const ball = allBalls[0];
				let velX = ball.VelX;
				let velY = ball.VelY;
				boss.ballIntersect = {X: ball.X, Y: ball.Y};
				let interY = boss.Y + boss.height;
				do {
					boss.ballIntersect = getIntersectPoint(
						velX, velY,
						boss.ballIntersect.X, boss.ballIntersect.Y,
						interY
					);
					velX *= -1;
				} while(boss.ballIntersect.Y > interY);
			},
			update: function(boss, dt) {
				boss.speed = ball.getSpeedFromVelocity(ball.VelX, ball.VelY);
				boss.speed *= MAX_BOSS_LIVES/boss.lives;
				if (boss.ballIntersect.X > boss.X + boss.width/2 + 20) {
					boss.X += boss.speed*dt;
				} else if (boss.ballIntersect.X < boss.X + boss.width/2 - 20) {
					boss.X -= boss.speed*dt;
				}
				if (boss.X < 0) {
					boss.X = 0;
				}
				if (boss.X > canvas.width - boss.width) {
					boss.X = canvas.width - boss.width;
				}				
			},
			exit: noop
		},
		brickAttack: {
			enter: function(boss, dt) {
				boss.attackCol = 0;
			},
			update: function(boss, dt) {
				if (boss.attackCol < BRICK_COLS) {
					let brickIndex = brickToTileIndex(
						boss.attackCol,
						boss.attackRow
					);
					if (brickGrid[brickIndex] < BRICK_TYPES.threehit) {
						brickGrid[brickIndex]++;
						sounds.wizardPlacesBrick.play();

						// don't end the level too soon
						if (brickGrid[brickIndex] - 1 == BRICK_TYPES.empty) {
							bricksLeft++; 
						}

					}
					boss.attackCol++;
				}
			},
			exit: function(boss, dt) {
				boss.attackRow--;
				if (boss.attackRow < 1) {
					boss.attackRow = BRICK_ROWS - 1;
				}
			}
		},
		freezeAttack: {
			enter: function(boss, dt) {
				boss.freezeShot.live = boss.freezeShot.visible = true;
				boss.freezeShot.X = boss.X + boss.width/2;
				boss.freezeShot.Y = boss.Y + boss.height;
			},
			update: noop,
			exit: noop,
		}
	}

	function ballHeld(boss) {
		return allBalls[0].ballHeld;
	}

	function ballNotHeld(boss) {
		return !ballHeld(boss);
	}

	function justMissedBall(boss) {
		if (boss.justMissedBall) {
			boss.justMissedBall = false;
			return true;
		}
		return false;
	}

	function brickAttackFinished(boss) {
		return boss.attackCol >= BRICK_COLS;
	}

	function ballTravellingDown(boss) {
		return (allBalls[0].VelY > 0);
	}

	function ballTravellingUp(boss) {
		return (allBalls[0].VelY < 0);
	}
}

function getIntersectPoint(velX, velY, posX, posY, interY) {
	const result = {Y: interY};
	if (velX == 0) {
		result.X = posX;
		return result;
	} 
	const m = velY/velX;
	result.X = (interY - posY)/m + posX;
	if (result.X < 0) {
		result.X = 0;
		result.Y = posY - m*posX;
	} else if (result.X > canvas.width) {
		result.X = canvas.width;
		result.Y = m*(result.X - posX) + posY;
	}
	return result;
}
