LETTER_H = 20;
LETTER_W = 80;
var letters = [];


letterP.prototype = new letterClass();
function letterP(xPosition, yPosition) {
	this.imageOffsetX = 0;
	this.imageOffsetY = 0;
	this.x = xPosition;
	this.y = yPosition;
}

letterA.prototype = new letterClass();
function letterA(xPosition, yPosition) {
	this.imageOffsetX = 0;
	this.imageOffsetY = LETTER_H;
	this.x = xPosition;
	this.y = yPosition;
}


letterU.prototype = new letterClass();
function letterU(xPosition, yPosition) {
	this.imageOffsetX = 0;
	this.imageOffsetY = LETTER_H * 2;
	this.x = xPosition;
	this.y = yPosition;
}

letterS.prototype = new letterClass();
function letterS(xPosition, yPosition) {
	this.imageOffsetX = 0;
	this.imageOffsetY = LETTER_H * 3;
	this.x = xPosition;
	this.y = yPosition;
}

letterE.prototype = new letterClass();
function letterE(xPosition, yPosition) {
	this.imageOffsetX = 0;
	this.imageOffsetY = LETTER_H * 4;
	this.x = xPosition;
	this.y = yPosition;
}

function drawLetters() {
	for (var i=0; i<letters.length; i++) {
		letters[i].draw();
	}
}

function letterClass() {
	this.imageOffsetX = 0;
	this.imageOffsetY = 0;
	this.x = 0
	this.y = 0;
	this.live = true;
	
	this.draw = function () {
		if (this.live) {
			canvasContext.drawImage(letterBrickPic, this.imageOffsetX, this.imageOffsetY, LETTER_W, LETTER_H, this.x, this.y, LETTER_W, LETTER_H);
		}
	};

	this.dropFrom = function(dropX, dropY) {
		this.live = true;
		this.x = dropX;
		this.y = dropY;
	};
	
	this.move = function (stopY) {
		if (this.live) {
			if(this.y < stopY){
			this.y += LETTER_DROP_SPEED;
			}
		}
	};
	
	this.reset = function() {
		this.live = false;
	};
}
