// in-game GUI display (score, lives, etc)

const GUI_Y = 22; // where the text is in relation to the top of the screen
const GAMKEDO_X = 200; // where the collectable letters start
const GAMKEDO_LETTER_W = 12; // pixels per letter

var prevScore = 0; // so we can animate the increase

function drawGUI() {
    if (prevScore<score) prevScore += 10;
    
    canvasContext.drawImage(guiBGPic,0,0);

    guiTXT('High Score: ' + highScore.toString(), 8, GUI_Y, "white","left");
    guiTXT('Score: '+ prevScore, canvas.width/2, GUI_Y);
    guiTXT('Level: '+ currentLevelIndex, canvas.width/2 + 200, GUI_Y, "silver", "center");

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
			guiTXT(letters[i], GAMKEDO_X + (i*GAMKEDO_LETTER_W), GUI_Y, '#00FF00'); // on
		} else {
            guiTXT(letters[i], GAMKEDO_X + (i*GAMKEDO_LETTER_W), GUI_Y, 'silver'); // off
        }
	}
}

function guiTXT(str,x,y,c,align) {
    if (!c) c = 'white';
    if (!align) align = 'center';
    canvasContext.font = "bold 16px Arial";
    canvasContext.textAlign = align;
    canvasContext.fillStyle = 'black';
    canvasContext.fillText(str,x+1,y+1);
    canvasContext.fillStyle = c;
    canvasContext.fillText(str,x,y);
}