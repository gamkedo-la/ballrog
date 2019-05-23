// in-game GUI display (score, lives, etc)

const GUI_Y = 20; // where the text is in relation to the top of the screen

function drawGUI() {
    guiTXT('Score: '+ score.toString(), canvas.width/2, GUI_Y);
    guiTXT('High Score: ' + highScore.toString(), 60, GUI_Y);
    drawLives();
    drawGAMKEDO();
}

function drawLives() {
	var posX = canvas.width - 24;
	var posY = GUI_Y - 10;
	for (var i=0; i<lives; i++) {
		drawBitMap(livesPic, posX - i*20, posY);
	}
}

function drawGAMKEDO(){
	var letterPills = [letterG, letterA, letterM, letterK, letterE, letterD, letterD];
	var letters = ['G','A','M','K','E','D','O'];
	for(i = 0; i < 7; i++){
		if(letterPills[i]){
			guiTXT(letters[i], 130 + (i*12), GUI_Y, 'green'); // on
		} else {
            guiTXT(letters[i], 130 + (i*12), GUI_Y, 'silver'); // off
        }
	}
}

function guiTXT(str,x,y,c) {
    if (!c) c = 'white';
    canvasContext.font = "bold 16px Arial";
    canvasContext.textAlign = 'center';
    canvasContext.fillStyle = 'black';
    canvasContext.fillText(str,x+1,y+1);
    canvasContext.fillStyle = c;
    canvasContext.fillText(str,x,y);
}