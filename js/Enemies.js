var enemiesManager = new (function() {
	const ENABLED_ENEMIES = [iceEnemyClass];
	const RESPAWN_TIMEOUT = 12;
	const MAX_ENEMIES_PER_LEVEL = 20;
	var enemies = [];
	var reSpawnTimer = 0;

	this.init = function() {
		for (var i=0; i<MAX_ENEMIES_PER_LEVEL; i++) {
			let enemyType = ENABLED_ENEMIES[Math.floor(Math.random() * ENABLED_ENEMIES.length)];
			enemies.push(new enemyType());
		}
	};

	this.reset = function() {
		reSpawnTimer = 0;
		for (var i=0; i<MAX_ENEMIES_PER_LEVEL; i++) {
			enemies[i].reset();
		}
	};

	reSpawn = function() {
		for (var i=0; i<MAX_ENEMIES_PER_LEVEL; i++) {
			let enemy = enemies[i];
			if (!enemy.live) {
				enemy.reSpawn();
				break;
			}
		}
	}

	this.update = function(dt) {
		reSpawnTimer += dt;
		let liveEnemies = enemies.filter(function (enemy) {
			return enemy.live;
		}).length
		if (reSpawnTimer >= RESPAWN_TIMEOUT && liveEnemies < MAX_ENEMIES_PER_LEVEL) {
			reSpawn();
			reSpawnTimer = 0;
		}
		for (let i=0; i<enemies.length; i++) {
			if (enemies[i].live) {
				enemies[i].update(dt);
			}
		}
	};

	this.draw = function() {
		for (let i=0; i<enemies.length; i++) {
			let enemy = enemies[i];
			if (enemy.live) {
				enemies[i].draw();
			}
		}
	};
})();

function FSMEnemyClass() {
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
				console.log('Switching from ' + stateFrom + ' to ' + stateTo);
				this.state.exit(this, dt);
				this.setState(stateTo);
				this.state.enter(this, dt);
				return;
			}
		}
	}

	this.setState = function(stateKey) {
		this.currentStateKey = stateKey;
		this.state = this.states[stateKey];
	}
}

iceEnemyClass.prototype = new FSMEnemyClass();
function iceEnemyClass() {
	const ATTACK_TIMEOUT = 1.25;
	const SLIDE_TIMEOUT = 10;
	const MELT_TIMEOUT = 1;
	const DROP_SPEED = 200;
	const SLIDE_SPEED = 150;
	this.X = 0;
	this.Y = 0;
	this.velY = 0;
	this.velX = 0;
	this.width = 25;
	this.height = 21;
	this.image = iceEnemyPic;
	this.live = false;
	this.visible = true;
	this.transitions = [
		// [FROM_STATE, TO_STATE, CONDITION_FOR_SWITCH]
		['drop', 'slide', isCollidingWithBrickTop],
		['slide', 'drop', reachedBrickEdge],
		['slide', 'melt', slideTimerEnded],
		['melt', 'die', meltTimerEnded],
		['drop', 'attack', isCollidingWithPaddle],
		['attack', 'die', attackTimerEnded],
		['drop', 'die', movedBelowCanvasHeight]
	];
	this.startState = 'drop';
	this.state = null;
	this.init = function() {
		this.live = false;
		this.visible = true;
		this.X = Math.random()*(canvas.width - this.width);
		this.Y = this.height;
	}
	this.reset = function() {
		this.state = null;
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
	this.states = {
		drop: {
			enter: function (enemy, dt) {
				enemy.velY = DROP_SPEED;
			},
			update: function(enemy, dt) {
				enemy.Y += enemy.velY*dt;
			},
			exit: function(enemy, dt) {
				enemy.velY = 0;
			}
		},
		slide: {
			enter: function (enemy, dt) {
				enemy.velX = SLIDE_SPEED;
				enemy.slideTimer = 0;
			},
			update: function(enemy, dt) {
				if (enemy.X < 0) {
					enemy.X = 0;
					enemy.velX *= -1;
				} else if (enemy.X > canvas.width - enemy.width) {
					enemy.X = canvas.width - enemy.width;
					enemy.velX *= -1;
				} else {
					let tile = getTileForPixelCoord(
						enemy.velX > 0 ? enemy.X + enemy.width : enemy.X,
						enemy.Y + enemy.height/2
					);
					if (isValidBrick(getBrickAtTileCoord(tile.col, tile.row))) {
						enemy.velX *= -1;
					}
				}
				enemy.X += enemy.velX*dt;
				enemy.slideTimer += dt;
			},
			exit: function(enemy, dt) {
				enemy.velX = 0;
				enemy.slideTimer = 0;
			}
		},
		attack: {
			enter: function (enemy, dt) {
				paddleFrozen = true;
				enemy.visible = false;
				enemy.attackTimer = 0;
			},
			update: function(enemy, dt) {
				enemy.attackTimer += dt;
			},
			exit: function(enemy, dt) {
				paddleFrozen = false;
			}
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
		let enemyEndX = enemy.velX < 0 ? enemy.X + enemy.width : enemy.X;
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

	function attackTimerEnded(enemy) {
		return enemy.attackTimer >= ATTACK_TIMEOUT;
	}

	function movedBelowCanvasHeight(enemy) {
		return (enemy.Y > canvas.height);
	}
}
