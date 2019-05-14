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
	console.log('Demo Timer: '+demoModeTimer);
}

function drawDemoScreen(){
	colorRect(0, 0, canvas.width, canvas.height, 'rgb(75,105,47 )');
}