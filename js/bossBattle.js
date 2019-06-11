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
	this.transitions = [
		['slide', 'noop', function() {return false;}],
	];
	this.startState = 'slide';
	this.lives = MAX_BOSS_LIVES;
	this.defeatedEvent = new CustomEvent('bossDefeated');

	this.superClassInit = this.init;
	this.init = function() {
		this.superClassInit();
		this.live = true;
		const self = this;
		canvas.addEventListener('bossMissedBall', function() {
			self.dropLife();
		});			
	};

	this.superClassReset = this.reset;
	this.reset = function() {
		this.live = true;
		this.lives = MAX_BOSS_LIVES;
	};
	
	this.dropLife = function() {
		this.live = --this.lives > 0;
		if (!this.live) {
			canvas.dispatchEvent(this.defeatedEvent);
		}
		console.log('Bossed lost life, lives remaining', this.lives);
	};
	
	this.states = {
		slide: {
			enter: function(boss, dt) {
			},
			update: function(boss, dt) {
				const ball = allBalls[0];
				// if (ball.Y > canvas.height - PADDLE_ORIGINAL_Y - BALL_RADIUS*2) {
				// 	return;
				// }
				boss.speed = 2*ball.getSpeedFromVelocity(ball.VelX, ball.VelY);
				let checkY, intersect;
				let velX = ball.VelX;
				let velY = ball.VelY;
				let posX = ball.X;
				let posY = ball.Y;
				let interY = boss.Y + boss.height;
				do {
					intersect = getIntersectPoint(
						velX, velY,
						posX, posY,
						interY
					);
					posX = intersect.X;
					posY = intersect.Y;
					velX *= -1;
				} while(intersect.Y > interY);
				if (intersect.X > boss.X + boss.width/2 + 20) {
					boss.X += boss.speed*dt;
				} else if (intersect.X < boss.X + boss.width/2 - 20) {
					boss.X -= boss.speed*dt;
				}
				if (boss.X < 0) {
					boss.X = 0;
				}
				if (boss.X > canvas.width - boss.width) {
					boss.X = canvas.width - boss.width;
				}				
			},
			exit: function(boss, dt) {
			}
		},
		noop: {
			enter: function(boss, dt) {
			},
			update: function(boss, dt) {
			},
			exit: function(boss, dt) {
			}
		}
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
