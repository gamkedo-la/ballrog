const PILL_W = 50;
const PILL_H = 20;
const PILL_DROP_SPEED = 10;
const PILL_DROP_CHANCE = 0.4;
const MAX_PILLS = 40;
const ENABLED_PILLS = [pointsPill, stretchPill, ghostPill, stickyBallPill, shrinkPill, accellPill, moveUpPill, invaderPill, jumpPill];
var pills = [];


pointsPill.prototype = new pillClass();
function pointsPill() {
	this.imageOffsetX = 0;
	this.imageOffsetY = 0;

	this.startPower = function () {
		increaseScore(BRICK_HIT_POINTS*4);
	}

	this.endPower = function () {
	}
}

stretchPill.prototype = new pillClass();
function stretchPill() {
	this.imageOffsetX = PILL_W;
	this.imageOffsetY = 0;
	this.powerTime = 10000;
	this.startPower = function () {
		paddleScale.x = 2;
		PADDLE_W *= 2
	}

	this.endPower = function () {
		paddleScale.x = 1;
		PADDLE_W /= 2;
	}
}


volcanoPill.prototype = new pillClass();
function volcanoPill() {
	this.imageOffsetX = 0;
	this.imageOffsetY = PILL_H;
	this.powerTime = 4000;
	this.startPower = function () {
		stickyBall = true;
	}
	this.endPower = function () {
		stickyBall = false;
	}
}

ghostPill.prototype = new pillClass();
function ghostPill() {
	this.imageOffsetX = PILL_W;
	this.imageOffsetY = PILL_H;
	this.powerTime = 7000;
	this.startPower = function () {
		paddleAlpha = 0.08;
	}

	this.endPower = function () {
		paddleAlpha = 1;
	}
}

stickyBallPill.prototype = new pillClass();
function stickyBallPill() {
	this.imageOffsetX = 0;
	this.imageOffsetY = PILL_H * 3;
	this.powerTime = 4000;
	this.startPower = function () {
		stickyBall = true;
	}

	this.endPower = function () {
		stickyBall = false;
	}
}

shrinkPill.prototype = new pillClass();
function shrinkPill() {
	this.imageOffsetX = 0;
	this.imageOffsetY = PILL_H * 4;
	this.powerTime = 10000;
	this.startPower = function () {
		paddleScale.x = 0.5;
		PADDLE_W *= 0.5
	}

	this.endPower = function () {
		paddleScale.x = 1;
		PADDLE_W *= 2;
	}
}

accellPill.prototype = new pillClass();
function accellPill() {
	this.imageOffsetX = PILL_W;
	this.imageOffsetY = PILL_H * 4;
	this.powerTime = 10000;
	this.startPower = function () {
		//needs to be added
	}

	this.endPower = function () {
		//needs to be added
	}
}

invaderPill.prototype = new pillClass();
function invaderPill() {
	this.imageOffsetX = PILL_W; //needs to be added to pills Sprite
	this.imageOffsetY = PILL_H * 4;  //needs to be added to pills Sprite
	this.powerTime = 10000;
	this.startPower = function () {
		//needs to be added
	}

	this.endPower = function () {
		//needs to be added
	}
}

moveUpPill.prototype = new pillClass();
function moveUpPill() {
	this.imageOffsetX = 0;
	this.imageOffsetY = PILL_H * 5;
	this.powerTime = 10000;
	this.startPower = function () {
		//needs to be added
	}

	this.endPower = function () {
		//needs to be added2;
	}
}

jumpPill.prototype = new pillClass();
function jumpPill() {
	this.imageOffsetX = PILL_W;
	this.imageOffsetY = PILL_H * 5;
	this.powerTime = 10000;
	this.startPower = function () {
		//needs to be added
	}

	this.endPower = function () {
		//needs to be added
	}
}



function initPills() {
	pills = [];
	for (var i=0; i<MAX_PILLS; i++) { // Replace MAX_PILLS with bricksLeft
		let pillType = ENABLED_PILLS[Math.floor(Math.random() * ENABLED_PILLS.length)]
		var pill = new pillType();
		pills.push(pill);
	}
}

function resetPills() {
	for (var i=0; i<MAX_PILLS; i++) {
		pills[i].reset();
	}
}

function pillsMove() {
	for (var i=0; i<pills.length; i++) {
		pills[i].move();
	}
}

function drawPills() {
	for (var i=0; i<pills.length; i++) {
		pills[i].draw();
	}
}

function maybeDropPowerPill(evt) {
	var pill;
	if (Math.random() < PILL_DROP_CHANCE) {
		do {
			pill = pills.shift();
			if (pill.live) {
				pills.push(pill);
			}
		} while (pill.live); // FIXME: what happens if all pills are live?
		let x = getColXCoord(evt.detail.col) + (COL_W - PILL_W)/2;
		let y = getRowYCoord(evt.detail.row);
		pill.dropFrom(x, y);
		pills.push(pill);
	}
}

function pillClass() {
	this.imageOffsetX = 0;
	this.imageOffsetY = 0;
	this.x = 0
	this.y = 0;
	this.live = false;
	this.powerTime = 0;
	
	this.draw = function () {
		if (this.live) {
			canvasContext.drawImage(pillsPic, this.imageOffsetX, this.imageOffsetY, PILL_W, PILL_H, this.x, this.y, PILL_W, PILL_H);
		}
	};

	this.dropFrom = function(dropX, dropY) {
		this.live = true;
		this.x = dropX;
		this.y = dropY;
	};
	
	this.move = function () {
		if (this.live) {
			this.y += PILL_DROP_SPEED;
			if (this.x > paddleX - PILL_W - 1 && this.x < paddleX + PADDLE_W && this.y > PADDLE_Y - PILL_H/2) {
				this.startPower();
				setTimeout(this.endPower, this.powerTime);
				this.reset();
			}
			if (this.y > canvas.height) {
				this.reset();
			}
		}
	};
	
	this.startPower = function () {
	};

	this.endPower = function () {
	};
	
	this.reset = function() {
		this.live = false;
	};
}
