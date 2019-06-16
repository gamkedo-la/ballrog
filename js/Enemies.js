const enemiesManager = new (function() {
	const ENABLED_ENEMIES = [iceEnemyClass, wizEnemyClass];
	const MAX_ENEMIES_PER_LEVEL = 20;
	const DEFAULT_RESPAWN_TIMEOUT = 10;
	var activeEnemies = [];
	var reSpawnQueue = [];
	var reSpawnTimer = 0;
	var nextReSpawnTimeout = DEFAULT_RESPAWN_TIMEOUT;
	var nextReSpawnIndex = 0;

	this.init = function() {
		for (var i=0; i<MAX_ENEMIES_PER_LEVEL; i++) {
			let enemyType = ENABLED_ENEMIES[Math.floor(Math.random() * ENABLED_ENEMIES.length)];
			reSpawnQueue.push(new enemyType());
		}
		setNextReSpawnTimeout();
	};

	this.reset = function() {
		reSpawnTimer = 0;
		while (activeEnemies.length) {
			let enemy = activeEnemies.shift();
			enemy.reset();
			reSpawnQueue.push(enemy);
		}
	};

	function reSpawn() {
		let enemy = reSpawnQueue.shift();
		if (enemy) {
			enemy.reSpawn();
			activeEnemies.push(enemy);
		}
		setNextReSpawnTimeout();
	}

	function setNextReSpawnTimeout() {
		if (reSpawnQueue.length) {
			nextReSpawnTimeout = reSpawnQueue[0].reSpawnTimeout;
		}
	}

	this.update = function(dt) {
		reSpawnTimer += dt;
		if (reSpawnTimer >= nextReSpawnTimeout && activeEnemies < MAX_ENEMIES_PER_LEVEL) {
			reSpawn();
			reSpawnTimer = 0;
		}
		activeEnemies.forEach(function(enemy, index) {
			if (enemy.live) {
				enemy.update(dt);
			} else {
				reSpawnQueue.push(enemy);
				activeEnemies.splice(index, 1);
			}
		});
	};

	this.draw = function() {
		for (let i=0; i<activeEnemies.length; i++) {
			let enemy = activeEnemies[i];
			if (enemy.live) {
				activeEnemies[i].draw();
			}
		}
	};
})();

function BaseEnemyClass() {
	this.velY = 0;
	this.velX = 0;
	this.width = 20;
	this.height = 20;
	// this.image = squareEnemyPic;
	this.live = false;
	this.visible = true;
	this.reSpawnTimeout = 10;

	this.init = function() {
		this.live = false;
		this.visible = true;
	}

	this.reset = function() {
		this.velY = 0;
		this.velX = 0;
		this.init();
	}

	this.reSpawn = function() {
		this.reset();
		this.live = true;
	}

	this.draw = function() {
		if (this.visible) {
			drawBitMap(this.image, this.X, this.Y);
		}
	}
}

const noop = function() {};
const noopState = {enter: noop, update: noop, exit: noop};
FSMEnemyClass.prototype = new BaseEnemyClass();
function FSMEnemyClass() {
	this.state = null;
	this.update = function(dt) {
		if (!this.state) {
			this.setState(this.startState);
			this.state.enter(this, dt);
			return;
		}
		this.state.update(this, dt);
		for (let i=0; i<this.transitions.length; i++) {
			let stateFrom = this.transitions[i][0];
			let stateTo = this.transitions[i][1];
			let condition = this.transitions[i][2];
			if (stateFrom == this.currentStateKey && condition(this)) {
				//console.log('Switching from ' + stateFrom + ' to ' + stateTo);
				this.state.exit(this, dt);
				this.setState(stateTo);
				this.state.enter(this, dt);
				return;
			}
		}
	}

	this.superClassReset = this.reset;
	this.reset = function() {
		this.state = null;
		this.superClassReset();
	}

	this.setState = function(stateKey) {
		this.currentStateKey = stateKey;
		this.state = this.states[stateKey];
	}
}

wizEnemyClass.prototype = new FSMEnemyClass();
function wizEnemyClass() {
	const WIZ_FLY_SPEED = 80;
	const WIZ_FLY_TIMEOUT = 4;
	const WIZ_ATTACK_TIMEOUT = 1;
	const WIZ_MIN_ATTACK_DISTANCE = 4;

	this.width = 36;
	this.height = 45;
	this.VelX = 0;
	this.image = wizEnemyPic;
	this.reSpawnTimeout = 20;
	this.targetTile = getTileForPixelCoord(canvas.width/2, canvas.height/2);
	this.attackTimer = 0;
	this.transitions = [
		// [FROM_STATE, TO_STATE, CONDITION_FOR_SWITCH]
		['flyIn', 'attack', reachedAttackPosition],
		['flyIn', 'hitByBall', isCollidingWithBall],
		['hitByBall', 'flyOut', hitByBallTimerEnded],
		['attack', 'flyOut', attackTimerEnded],
		['flyOut', 'die', flewOffScreen],
	];
	this.startState = 'flyIn';

	this.superClassInit = this.init;
	this.init = function() {
		this.superClassInit();
		this.X = Math.random() > 0.5 ? -this.width : canvas.width;
		this.Y = Math.random()*ROW_H*BRICK_ROWS + TOP_MARGIN + this.height;
	};

	this.getTargetPixel = function() {
		return {
			X: getColXCoord(this.targetTile.col) + COL_W/2,
			Y: getRowYCoord(this.targetTile.row) + (ROW_H - this.height)/2
		};
	};

	this.getDistanceToPoint = function(pointX, pointY) {
		return Math.sqrt(
			Math.pow(pointX - this.X, 2) + Math.pow(pointY - this.Y, 2)
		);
	};

	this.lockOnTile = function(tile) {
		this.targetTile = tile;
		const targetPixel = this.getTargetPixel();
		const d = this.getDistanceToPoint(targetPixel.X, targetPixel.Y);
		this.VelX = (WIZ_FLY_SPEED/d)*(targetPixel.X - this.X);
		this.VelY = (WIZ_FLY_SPEED/d)*(targetPixel.Y - this.Y);
	};

	this.states = {
		flyIn: {
			enter: function(enemy, dt) {
				// select empty tile
				//fairySound probably goes here

				sounds.wizardFlyIn.play();
				var minCol, maxCol, targetTile;
				var count = 0, maxTries = 10;
				if (enemy.X < 0) {
					minCol = 0;
					maxCol = Math.ceil(BRICK_COLS/2) - 1;
				} else {
					minCol = Math.floor(BRICK_COLS/2);
					maxCol = BRICK_COLS;
				}
				do {
					targetTile = {
						col: Math.floor(Math.random()*(maxCol - minCol) + minCol),
						row: Math.floor(Math.random()*BRICK_ROWS)
					};
					count++;
				} while (getBrickAtTileCoord(targetTile.col, targetTile.row) >= BRICK_TYPES.threehit && count < maxTries);
				enemy.lockOnTile(targetTile);
			},
			update: function(enemy, dt) {
				enemy.X += enemy.VelX*dt;
				enemy.Y += enemy.VelY*dt;
			},
			exit: function(enemy, dt) {
			}
		},
		attack: {
			enter: function(enemy, dt) {
				// TODO: Start attack animation
				enemy.attackTimer = 0;
			},
			update: function(enemy, dt) {
				// TODO: Update attack animation
				enemy.attackTimer += dt;
			},
			exit: function(enemy, dt) {
				// End attack animation and restore brick
				var brickIndex = brickToTileIndex(enemy.targetTile.col, enemy.targetTile.row);
				if (brickGrid[brickIndex] < BRICK_TYPES.threehit) {
					brickGrid[brickIndex]++;
					
					sounds.wizardPlacesBrick.play();
					if (brickGrid[brickIndex] - 1 == BRICK_TYPES.empty) {
						bricksLeft++;
					}
				}
			}
		},
		hitByBall: {
			enter: function(enemy, dt) {
				// end current animation and start hit animation
			},
			update: function(enemy, dt) {
				// update hit animation
			},
			exit: function(enemy, dt) {
				// end hit animation and switch to "angry" sprite
			}
		},
		flyOut: {
			enter: function(enemy, dt) {
				enemy.VelX = -Math.sign(enemy.VelX)*WIZ_FLY_SPEED*0.8;
			},
			update: function(enemy, dt) {
				enemy.X += enemy.VelX*dt;
			},
			exit: function(enemy, dt) {
			}
		},
		die: {
			enter: function(enemy, dt) {
				enemy.live = false;
			},
			update: function(enemy, dt) {
			},
			exit: function(enemy, dt) {
			}
		}
	}

	function reachedAttackPosition(enemy) {
		const targetPixel = enemy.getTargetPixel();
		const d = enemy.getDistanceToPoint(targetPixel.X, targetPixel.Y);
		return d < WIZ_MIN_ATTACK_DISTANCE;
	}

	function isCollidingWithBall(enemy) {
		return false;
	}

	function hitByBallTimerEnded(enemy) {
		return false;
	}

	function attackTimerEnded(enemy) {
		return enemy.attackTimer > WIZ_ATTACK_TIMEOUT;
	}

	function flewOffScreen(enemy) {
		return enemy.X < -enemy.width || enemy.X > canvas.width;
	}
}

iceEnemyClass.prototype = new FSMEnemyClass();
function iceEnemyClass() {
	const FREEZE_TIMEOUT = 1.25;
	const SLIDE_TIMEOUT = 10;
	const MELT_TIMEOUT = 1;
	const DROP_SPEED = 200;
	const SLIDE_SPEED = 150;
	this.width = 25;
	this.height = 21;
	this.image = iceEnemyPic;
	this.transitions = [
		// [FROM_STATE, TO_STATE, CONDITION_FOR_SWITCH]
		['drop', 'slide', isCollidingWithBrickTop],
		['slide', 'drop', reachedBrickEdge],
		['slide', 'melt', slideTimerEnded],
		['melt', 'die', meltTimerEnded],
		['drop', 'attack', isCollidingWithPaddle],
		['attack', 'die', paddleNotFrozen],
		['drop', 'die', movedBelowCanvasHeight]
	];
	this.startState = 'drop';

	this.superClassInit = this.init;
	this.init = function() {
		this.superClassInit();
		this.X = Math.random()*(canvas.width - this.width);
		this.Y = -this.height;
	}

	this.draw = function() {
		if (this.visible) {
			drawBitMap(this.image, this.X + spaceInvadeX, this.Y + spaceInvadeY);
		}
	}

	this.states = {
		drop: {
			enter: function (enemy, dt) {
				enemy.VelY = DROP_SPEED;
			},
			update: function(enemy, dt) {
				enemy.Y += enemy.VelY*dt;
			},
			exit: function(enemy, dt) {
				enemy.VelY = 0;
			}
		},
		slide: {
			enter: function (enemy, dt) {
				enemy.VelX = SLIDE_SPEED;
				enemy.slideTimer = 0;
			},
			update: function(enemy, dt) {
				let tile = getTileForPixelCoord(
					enemy.VelX > 0 ? enemy.X + enemy.width : enemy.X,
					enemy.Y + enemy.height/2
				);
				if (enemy.X < 0) {
					enemy.X = 0;
					enemy.VelX *= -1;
				} else if (enemy.X > canvas.width - enemy.width) {
					enemy.X = canvas.width - enemy.width;
					enemy.VelX *= -1;
				} else {
					if (isValidBrick(getBrickAtTileCoord(tile.col, tile.row))) {
						enemy.VelX *= -1;
					}
				}
				enemy.X += enemy.VelX*dt;
				enemy.Y = getRowYCoord(tile.row);
				enemy.slideTimer += dt;
			},
			exit: function(enemy, dt) {
				enemy.VelX = 0;
				enemy.slideTimer = 0;
			}
		},
		attack: {
			enter: function (enemy, dt) {
				freezePaddle(FREEZE_TIMEOUT);
			},
			update: noop,
			exit: noop
		},
		melt: {
			enter: function(enemy, dt) {
				enemy.meltTimer = 0;
			},
			update: function(enemy, dt) {
				// TODO: move downwards
				enemy.meltTimer += dt;
			},
			exit: function(enemy, dt) {
				// FREEZE BRICK BELOW
				let tile = getTileForPixelCoord(
					enemy.X + enemy.width/2,
					enemy.Y + enemy.height/2
				);
				let index = brickToTileIndex(tile.col, tile.row + 1);
				let brickType = brickGrid[index] % 100;
				let brickState = brickGrid[index] - brickType;
				if (isValidBrick(brickGrid[index]) && brickState != BRICK_SPECIAL_STATES.frozen) {
					brickGrid[index] += BRICK_SPECIAL_STATES.frozen;
				}
			}
		},
		die: {
			enter: function(enemy, dt) {
				enemy.live = false;
			},
			update: function(enemy, dt) {
			},
			exit: function(enemy, dt) {
			}
		}
	};

	function isCollidingWithBrickTop(enemy) {
		let enemyBottomY = enemy.Y + enemy.height;
		let enemyEndX = enemy.VelX < 0 ? enemy.X + enemy.width : enemy.X;
		enemyEndX = Math.min(enemyEndX, canvas.width);
		enemyEndX = Math.max(enemyEndX, 0);
		let tile = getTileForPixelCoord(enemyEndX, enemyBottomY)
		return isValidBrick(getBrickAtTileCoord(tile.col, tile.row));
	}

	function reachedBrickEdge(enemy) {
		return !isCollidingWithBrickTop(enemy);
	}

	function slideTimerEnded(enemy) {
		return enemy.slideTimer > SLIDE_TIMEOUT;
	}

	function meltTimerEnded(enemy) {
		return enemy.meltTimer >= MELT_TIMEOUT;
	}

	function isCollidingWithPaddle(enemy) {
		// rectangle intersection
		return (enemy.X + enemy.width >= paddleX
				&& enemy.X <= paddleX + paddleWidth
				&& enemy.Y + enemy.height >= paddleY);
	}

	function paddleNotFrozen(enemy) {
		return !paddleFrozen;
	}

	function movedBelowCanvasHeight(enemy) {
		return (enemy.Y > canvas.height);
	}
}
