bossClass.prototype = new FSMEnemyClass();
function bossClass() {
	const MAX_BOSS_LIVES = 4;
	const BRICK_ATTACK_TIMEOUT = 12;
	this.width = PADDLE_ORIGINAL_W;
	this.height = PADDLE_THICKNESS;
	this.X = 400 - this.width/2;
	this.Y = 40;
	this.speed = 500;
	this.image = bossPic;
	this.visible = true;
	this.ballIntersect = null;
	this.brickAttackTimer = 0;
	this.transitions = [
		['wait', 'slide', ballNotHeld],
		['slide', 'brickAttack', justMissedBall],
		['slide', 'brickAttack', brickAttackTimerEnded],
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
		width: 20,
		height: 45,
		speed: 500,
		draw: function() {
			if (this.live) {
				drawBitMap(freezeAttackPic, this.X, this.Y);
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
		this.attackRow = BRICK_ROWS - 1;
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
		//console.log('Boss lost life, lives remaining', this.lives);
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
				boss.brickAttackTimer += dt;
				boss.speed = ball.getSpeedFromVelocity(ball.VelX, ball.VelY);
				boss.speed *= MAX_BOSS_LIVES/(boss.lives + 0.9);
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
				if (boss.attackRow < 2) {
					boss.attackRow = BRICK_ROWS - 1;
				}
				boss.brickAttackTimer = 0;
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

	function brickAttackTimerEnded(boss) {
		return (boss.brickAttackTimer >= BRICK_ATTACK_TIMEOUT);
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

const beatGameState = new (function() {
	var paddleFlySpeed = 0;
	var timer = 0;
	const PADDLE_FLY_ACCEL = 200;
	const STATE_TIMEOUT = 3;
	const COLOR_SWITCH_TIMEOUT = 1/6;
	const CONGRATS = {
		text: 'SWEET!',
		colors: ['#fbf236', '#ac3232', '#d77bba', '#6abe30', '#df7126'],
		colorIndex: 0,
		colorSwitchTimer: 0,
		X: 400,
		Y: 600,
		speed: 60,
		draw: function() {
			colorTextCentered(this.text, this.X, this.Y, this.colors[this.colorIndex], "64px Arial Black");
		},
		update: function(dt) {
			this.colorSwitchTimer += dt;
			if (this.colorSwitchTimer > COLOR_SWITCH_TIMEOUT) {
				this.colorSwitchTimer = 0;
				this.colorIndex++;
				if (this.colorIndex > this.colors.length) {
					this.colorIndex = 0;
				}
			}
			this.Y -= this.speed*dt;
			if (this.Y <= canvas.height/2) {
				this.Y = canvas.height/2;
			}
		}
	};

	this.init = function() {
		timer = 0;
		CONGRATS.X = allBalls[0].X = canvas.width/2;
		CONGRATS.Y = allBalls[0].Y = canvas.height;
		CONGRATS.colorIndex = 0;
		paddleFlySpeed = 0;
	};

	this.update = function(dt) {
		CONGRATS.update(dt);
		allBalls[0].Y = CONGRATS.Y;
		if (CONGRATS.Y <= canvas.height/2) {
			paddleFlySpeed += PADDLE_FLY_ACCEL*dt;
			paddleY -= paddleFlySpeed*dt;
		}
		if (paddleY < 0) {
			timer += dt;
		}
		if (timer >= STATE_TIMEOUT) {
			bossDefeated = false;
			creditsManager.roll();
		}
	};

	this.draw = function() {
		drawBackground(plasmaPic,plasmaPic);
		drawGUI();
		CONGRATS.draw();
		if (paddleFlySpeed > 0) {
			for (let i=0; i<(canvas.height - paddlePic.height); i++) {
				let width = nyanPic.width + map(Math.sin(i), -1, 1, -6, 8);
				canvasContext.save();
				canvasContext.translate(paddleX, paddleY + paddlePic.height + i*nyanPic.height);
				canvasContext.drawImage(nyanPic, 0, 0, nyanPic.width, nyanPic.height, -width/2 + paddlePic.width/2, 0, width, nyanPic.height);
				canvasContext.restore();
			}
		}
		drawPaddle();
	};

})();
