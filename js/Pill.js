const PILL_W = 50;
const PILL_H = 20;
const PILL_DROP_SPEED = 4;
const PILL_DROP_CHANCE = 0.4;
const MAX_PILLS = 40;
const ENABLED_PILLS = [pointsPill, stretchPill, ghostPill, stickyBallPill, shrinkPill, accellPill, moveUpPill, invaderPill, jumpPill, extraLifePill];
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
		if (paddleY = 540) {
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
		//needs to be added
	}

	this.endPower = function () {
		//needs to be added
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

letterG.prototype = new pillClass();
function letterG() {
	this.imageOffsetX = 0;
	this.imageOffsetY = PILL_H * 7;
	
	this.startPower = function() {
		letterG = true;
	}
	checkForGAMKEDO();
}

letterA.prototype = new pillClass();
function letterA() {
	this.imageOffsetX = 0;
	this.imageOffsetY = PILL_H * 8;
	
	this.startPower = function() {
		letterA = true;
	}
	checkForGAMKEDO();
}

letterM.prototype = new pillClass();
function letterM() {
	this.imageOffsetX = 0;
	this.imageOffsetY = PILL_H * 9;
	
	this.startPower = function() {
		letterM = true;
	}
	checkForGAMKEDO();
}

letterK.prototype = new pillClass();
function letterK() {
	this.imageOffsetX = PILL_W;
	this.imageOffsetY = PILL_H * 7;
	
	this.startPower = function() {
		letterK = true;
	}
	checkForGAMKEDO();
}

letterE.prototype = new pillClass();
function letterE() {
	this.imageOffsetX = PILL_W;
	this.imageOffsetY = PILL_H * 8;
	
	this.startPower = function() {
		letterE = true;
	}
	checkForGAMKEDO();
}

letterD.prototype = new pillClass();
function letterD() {
	this.imageOffsetX = PILL_W;
	this.imageOffsetY = PILL_H * 9;
	
	this.startPower = function() {
		letterD = true;
	}
	checkForGAMKEDO();
}

letterO.prototype = new pillClass();
function letterO() {
	this.imageOffsetX = PILL_W;
	this.imageOffsetY = PILL_H * 10;
	
	this.startPower = function() {
		letterO = true;
	}
	checkForGAMKEDO();
}



function checkForGAMKEDO(){
	if(letterG && letterA && letterM && letterK && letterE && letterD && letterO &&){
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
	};
	
	this.move = function () {
		if (this.live) {
			this.y += PILL_DROP_SPEED;
			if (this.x > paddleX - PILL_W - 1 && this.x < paddleX + PADDLE_W && this.y > paddleY - PILL_H/2) {
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
