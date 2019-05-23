// in-game GUI display (score, lives, etc)

function drawGUI() {
    canvasContext.fillStyle = 'white';
    canvasContext.textAlign = 'center';
    canvasContext.fillText(score.toString(), canvas.width/2, 10);
    canvasContext.fillText('High Score: ' + highScore.toString(), 50, 10);
    drawLives();
    drawGAMKEDO();
}