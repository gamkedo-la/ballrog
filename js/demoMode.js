var demoModeTimer = 0;
var titleScreenTimer = 0;

function titleScreenKeepTime(){
	titleScreenTimer++
	console.log('Title Screen Timer: ' + titleScreenTimer);
	if(titleScreenTimer > 999){
		showTitle = false;
		demoScreen = true;
		console.log('Title Screen: '+showTitle);
		console.log('Demo Screen: '+demoScreen);
	}
}

function demoKeepTime(){
	demoModeTimer++
	ballHeld = false;
	console.log('Demo Timer: '+demoModeTimer);
}

function drawDemoScreen(){
		colorRect(0, 0, canvas.width, canvas.height, 'rgb(75,105,47 )');
		canvasContext.fillStyle = 'white';
		canvasContext.textAlign = 'center';
		canvasContext.fillText(score.toString(), canvas.width/2, 10);
		canvasContext.fillText('High Score: ' + highScore.toString(), 50, 10);
		drawLives();
		drawGAMKEDO();
		drawPaddle();
		drawBricks();
		drawBall();
		drawPills();
}

