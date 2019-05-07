const LETTER_W = 50;
const LETTER_H = 20;
const LETTER_DROP_SPEED = 10;
const LETTER_DROP_CHANCE = 0.4;
const MAX_LETTERS = 40;
const ENABLED_LETTERS = [letterP, letterA, letterU, letterS, letterE];
var letters = [];


letterP.prototype = new letterClass();
function letterP() {
	this.imageOffsetX = 0;
	this.imageOffsetY = 0;
	this.stopY = (canvas.height/2)
}

letterA.prototype = new letterClass();
function letterA() {
	this.imageOffsetX = LETTER_W;
	this.imageOffsetY = 0;
	this.stopY = (canvas.height/2)
}


letterU.prototype = new letterClass();
function letterU() {
	this.imageOffsetX = 0;
	this.imageOffsetY = LETTER_H;
	this.stopY = (canvas.height/2)
}

letterS.prototype = new letterClass();
function letterS() {
	this.imageOffsetX = LETTER_W;
	this.imageOffsetY = LETTER_H;
	this.stopY = (canvas.height/2)
}

letterE.prototype = new letterClass();
function letterE() {
	this.imageOffsetX = LETTER_W;
	this.imageOffsetY = LETTER_H;
	this.stopY = (canvas.height/2)
}

function initLetters() {
	letters = [];
	for (var i=0; i<MAX_LETTERS; i++) { // Replace MAX_LETTERS with bricksLeft
		let letterType = ENABLED_LETTERS[i]
		var letter = new letterType();
		letters.push(letter);
	}
}

function resetLetters() {
	for (var i=0; i<MAX_LETTERS; i++) {
		letters[i].reset();
	}
}

function lettersMove(stopY) {
	for (var i=0; i<letters.length; i++) {
		letters[i].move(stopY);
	}
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
	this.live = false;
	
	this.draw = function () {
		if (this.live) {
			canvasContext.drawImage(lettersPic, this.imageOffsetX, this.imageOffsetY, LETTER_W, LETTER_H, this.x, this.y, LETTER_W, LETTER_H);
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
