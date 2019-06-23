function colorRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {
	canvasContext.save();
	canvasContext.fillStyle = fillColor;
	canvasContext.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
	canvasContext.restore();
}

function colorCircle(centerX, centerY, radius, fillColor) {
	canvasContext.save();
	canvasContext.fillStyle = fillColor;
	canvasContext.beginPath();
	canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
	canvasContext.fill();
	canvasContext.restore();
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

function colorText(showWords, textX, textY, fillColor, font = "14px Arial Black") {
	canvasContext.save();
  canvasContext.textAlign = "left";
  canvasContext.fillStyle = fillColor;
  canvasContext.font = font;
	canvasContext.fillText(showWords, textX, textY);
	canvasContext.restore();
}

function colorTextCentered(showWords, textX, textY, fillColor, font = "14px Arial Black") {
	canvasContext.save();
  canvasContext.textAlign = "center";
  canvasContext.fillStyle = fillColor;
  canvasContext.font = font;
	canvasContext.fillText(showWords, textX, textY);
	canvasContext.restore();
}

function largerColorText(showWords, textX, textY, fillColor, font = "56px Arial Black") {
	canvasContext.save();
  canvasContext.textAlign = "left";
  canvasContext.fillStyle = fillColor;
  canvasContext.font = font;
	canvasContext.fillText(showWords, textX, textY);
	canvasContext.restore();
}
