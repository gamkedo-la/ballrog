// in-game GUI display (score, lives, etc)

function drawGUI() {
    guiTXT(score.toString(), canvas.width/2);
    guiTXT('High Score: ' + highScore.toString(), 50, 10);
    drawLives();
    drawGAMKEDO();
}

function drawLives() {
	var posX = canvas.width - 30;
	var posY = 10;
	for (var i=0; i<lives; i++) {
		drawBitMap(livesPic, posX - i*20, posY);
	}
}

function drawGAMKEDO(){
	var letterPills = [letterG, letterA, letterM, letterK, letterE, letterD, letterD];
	var letters = ['G','A','M','K','E','D','O'];
	for(i = 0; i < 7; i++){
		if(letterPills[i]){
			guiTXT(letters[i], 130 + (i*10), 10, 'green');
		} else {
            guiTXT(letters[i], 130 + (i*10), 10, 'red');
        }
	}
}

function guiTXT(str,x,y,c) {
    if (!c) c = 'white';
    canvasContext.textAlign = 'center';
    canvasContext.fillStyle = 'black';
    canvasContext.fillText(str,x+1,y+1);
    canvasContext.fillStyle = c;
    canvasContext.fillText(str,x,y);
}