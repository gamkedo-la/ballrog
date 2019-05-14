var demoModeTimer = 0;
var titleScreenTimer = 0;
var displayClickToStart = false;
var clicksBetweenDisplayStartTimer = 0;

function titleScreenKeepTime(){
	titleScreenTimer++
	console.log('Title Screen Timer: ' + titleScreenTimer);
	if(titleScreenTimer > 999){
		showTitle = false;
		demoScreen = true;
	}
}

function demoKeepTime(){
	demoModeTimer++
	ballHeld = false;
}

function drawDemoScreen(){
		colorRect(0, 0, canvas.width, canvas.height, 'rgb(75,105,47 )');
		colorText(score.toString(), canvas.width/2, 20, 'white');
		colorText('High Score: ' + highScore.toString(), 10, 20, 'white');
		drawLives();
		drawGAMKEDO();
		drawPaddle();
		drawBricks();
		drawBall();
		drawPills();
		drawClickToStart();
		if (displayClickToStart){
			largerColorText('Click To Start', 225, 300,);
		}
}

function drawClickToStart(){
	clicksBetweenDisplayStartTimer++
	console.log(clicksBetweenDisplayStartTimer);
	if(clicksBetweenDisplayStartTimer >= 50){
		clicksBetweenDisplayStartTimer = 0;
		if(!displayClickToStart){
			displayClickToStart = true;
		} else {
			displayClickToStart = false;
		}
	}
}