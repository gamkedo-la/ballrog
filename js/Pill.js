const PILL_W = 50;
const PILL_H = 20;
const PILL_DROP_SPEED = 4;
const MAX_PILLS = 40;
const PILL_DROP_CHANCE = 0.4;
const ENABLED_PILLS = [pointsPill, stretchPill, ghostPill, stickyBallPill, shrinkPill, accellPill, moveUpPill, invaderPill, jumpPill, extraLifePill, letterGPill, letterAPill, letterMPill, letterKPill, letterEPill, letterDPill, letterOPill];

// used for testing specific powerups - comment out other initializations
// const PILL_DROP_CHANCE = 1.1; //Math.random is 0-1 so random will always be < 1.1;
// const ENABLED_PILLS = [jumpPill]; 

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
	var stretchedPaddle = paddleWidth * 2;
	this.imageOffsetX = PILL_W;
	this.imageOffsetY = 0;
	this.powerTime = 10000;
	this.startPower = function () {
		if (paddleWidth == stretchedPaddle) {
			return;
		} 
		paddleScale.x = 2;
		paddleWidth = stretchedPaddle;
	}

	this.endPower = function () {
		if (paddleWidth == PADDLE_ORIGINAL_W) {
			return;
		} 
		paddleScale.x = 1;
		paddleWidth = PADDLE_ORIGINAL_W;
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
	var shrunkPaddle = paddleWidth * 0.5
	this.imageOffsetX = 0;
	this.imageOffsetY = PILL_H * 4;
	this.powerTime = 10000;
	this.startPower = function () {
		if (paddleWidth == shrunkPaddle) {
			return;
		} 
		paddleScale.x = 0.5;
		paddleWidth = shrunkPaddle;
	}

	this.endPower = function () {
		paddleScale.x = 1;
		paddleWidth = PADDLE_ORIGINAL_W;
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
		if (paddleY == PADDLE_ORIGINAL_Y) {
			paddleY -= PADDLE_THICKNESS * 2;
		}
	}

	this.endPower = function () {
		paddleY = 540;
	}
}

jumpPill.prototype = new pillClass();
function jumpPill() {
	this.imageOffsetX = PILL_W;
	this.imageOffsetY = PILL_H * 5;
	this.powerTime = 10000; 
	this.startPower = function () {
		paddleJumping = true;
	}

	this.endPower = function () {
		if (!paddleJumping) {
			return;
		}
		paddleJumping = false;
		paddleY = PADDLE_ORIGINAL_Y;
	}
}

extraLifePill.prototype = new pillClass();
function extraLifePill() {
	this.imageOffsetX = 0;
	this.imageOffsetY = PILL_H * 6;

	this.startPower = function() {
		lives++;
	}
}

letterGPill.prototype = new pillClass();
function letterGPill() {
	this.imageOffsetX = 0;
	this.imageOffsetY = PILL_H * 7;
	
	this.startPower = function() {
		letterG = true;
	}
	checkForGAMKEDO();
}

letterAPill.prototype = new pillClass();
function letterAPill() {
	this.imageOffsetX = 0;
	this.imageOffsetY = PILL_H * 8;
	
	this.startPower = function() {
		letterA = true;
	}
	checkForGAMKEDO();
}

letterMPill.prototype = new pillClass();
function letterMPill() {
	this.imageOffsetX = 0;
	this.imageOffsetY = PILL_H * 9;
	
	this.startPower = function() {
		letterM = true;
	}
	checkForGAMKEDO();
}

letterKPill.prototype = new pillClass();
function letterKPill() {
	this.imageOffsetX = PILL_W;
	this.imageOffsetY = PILL_H * 7;
	
	this.startPower = function() {
		letterK = true;
	}
	checkForGAMKEDO();
}

letterEPill.prototype = new pillClass();
function letterEPill() {
	this.imageOffsetX = PILL_W;
	this.imageOffsetY = PILL_H * 8;
	
	this.startPower = function() {
		letterE = true;
	}
	checkForGAMKEDO();
}

letterDPill.prototype = new pillClass();
function letterDPill() {
	this.imageOffsetX = PILL_W;
	this.imageOffsetY = PILL_H * 9;
	
	this.startPower = function() {
		letterD = true;
	}
	checkForGAMKEDO();
}

letterOPill.prototype = new pillClass();
function letterOPill() {
	this.imageOffsetX = PILL_W;
	this.imageOffsetY = PILL_H * 10;
	
	this.startPower = function() {
		letterO = true;
	}
	checkForGAMKEDO();
}

function checkForGAMKEDO(){
	if(letterG && letterA && letterM && letterK && letterE && letterD && letterO){
		gamkedo = true; //unlocks GAMKEDO level
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

function checkPillsLive() {
	activePills = pills.filter(
		pill => pill.live).length;
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
	if (debugMode) {
		for (var i=0; i<Math.floor(canvas.width/PILL_W); i++) {
			let pill = pills[i];
			let x = i*PILL_W;
			canvasContext.drawImage(pillsPic, pill.imageOffsetX, pill.imageOffsetY, PILL_W, PILL_H, x, 0, PILL_W, PILL_H);
		}
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
		this.timer;
	};
	
	this.move = function () {
		if (this.live) {
			this.y += PILL_DROP_SPEED;
			if (this.x > paddleX - PILL_W - 1 && this.x < paddleX + paddleWidth && this.y > paddleY - PILL_H/2) {
				this.startPower();
				this.timer = setTimeout(this.endPower, this.powerTime);
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

function clearPillTimers() {
	var timersArrayLength = pills.length;
	for (var i=0; i<timersArrayLength; i++) {
  		clearTimeout(pills[i].timer);
	}
}

function clearPillAbilites() {
	paddleScale.x = 1;
	paddleWidth = PADDLE_ORIGINAL_W;
	paddleY = PADDLE_ORIGINAL_Y;
	stickyBall = false;
	paddleJumping = false;
	paddleAlpha = 1;
}