function colorRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {
	canvasContext.fillStyle = fillColor;
	canvasContext.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
}

function colorCircle(centerX, centerY, radius, fillColor) {
	canvasContext.fillStyle = 'white';
	canvasContext.beginPath();
	canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
	canvasContext.fill();
}

function drawBitMap(graphic, x, y) {
	canvasContext.save();
	canvasContext.translate(x, y);
	canvasContext.drawImage(graphic, 0, 0);
	canvasContext.restore();
}

function drawBitmapCenteredWithRotation(useBitmap, atX, atY, withAng) {
	canvasContext.save();
	canvasContext.translate(atX, atY);
	canvasContext.rotate(withAng);
	canvasContext.drawImage(useBitmap, -useBitmap.width / 2, -useBitmap.height / 2);
	canvasContext.restore();
  }
