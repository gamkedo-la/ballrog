const creditsManager = new (function() {
	this.rolling = false;
	var scroll = 0;
	var speed = 20;
	const BG_COLOR = '#222034';

	this.roll = function() {
		this.rolling = true;
	};

	this.stop = function() {
		this.rolling = false;
		scroll = 0;
	}
	this.update = function(dt) {
		if (this.rolling) {
			scroll -= speed*dt;
		}
	};

	this.draw = function() {
		if (!this.rolling) {
			return;
		}
		colorRect(0, 0, canvas.width, canvas.height, BG_COLOR);
		drawBitMap(paddlePic, 20, 20); // TODO: draw eyes, scale paddle up a bit
		for (let i=0; i<(canvas.height - (20 + paddlePic.height)); i++) {
			drawBitMap(nyanPic, 20, 20 + paddlePic.height + i*nyanPic.height);
		}
		// TODO: animate nyan rainbow
		canvasContext.save();
		canvasContext.translate(0, scroll);
		colorTextCentered("CREDITS HERE", canvas.width/2, canvas.height/2);
		canvasContext.restore();
	};
})();
