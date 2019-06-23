var ballPic = document.createElement("img");
var letterBrickPic = document.createElement("img");
var bossPic = document.createElement("img");
var paddlePic = document.createElement("img");
var paddleFrozenPic = document.createElement("img");
var paddleHappyPic = document.createElement("img");
var nyanPic = document.createElement("img");
var brick1Pic = document.createElement("img");
var brick2Pic = document.createElement("img");
var brick3Pic = document.createElement("img");
var brick4Pic = document.createElement("img");
var brickRightPic = document.createElement("img");
var brickLeftPic = document.createElement("img");
var brickVertPic = document.createElement("img");
var brickEraserPic = document.createElement("img");
var brickFrozenPic = document.createElement("img");
var livesPic = document.createElement("img");
var titlePic = document.createElement("img");
var pillsPic = document.createElement("img");
var magnetPillPic = document.createElement("img");
var pupilPic = document.createElement("img");
var eyeballPic = document.createElement("img");
var eyelidsPic = document.createElement("img");
var ballTrailPic = document.createElement("img");
var shinePic = document.createElement("img");
var bouncePic = document.createElement("img");
var shotPic = document.createElement("img");
var editorBackgroundTile = document.createElement("img");
var plasmaPic = document.createElement("img");
var plasma2Pic = document.createElement("img");
var plasma3Pic = document.createElement("img");
var plasma4Pic = document.createElement("img");
var guiBGPic = document.createElement("img");
var iceEnemyPic = document.createElement("img");
var wizEnemyPic = document.createElement("img");
var freezeAttackPic = document.createElement("img");
var imageList = [
    {varName: ballPic, theFile: "../images/ball.png"},
    {varName: bossPic, theFile: "../images/boss.png"},
	{varName: paddlePic, theFile: "../images/paddle.png"},
	{varName: paddleHappyPic, theFile: "../images/paddleHappy.png"},
	{varName: paddleFrozenPic, theFile: "../images/paddleFrozen.png"},
	{varName: nyanPic, theFile: "../images/nyan.png"},
	{varName: brick1Pic, theFile: "../images/brick1.png"},
	{varName: brick2Pic, theFile: "../images/brick2.png"},
	{varName: brick3Pic, theFile: "../images/brick3.png"},
	{varName: brick4Pic, theFile: "../images/brick4.png"},
	{varName: brickRightPic, theFile: "../images/brick_right.png"},
	{varName: brickLeftPic, theFile: "../images/brick_left.png"},
	{varName: brickVertPic, theFile: "../images/brick_vertical.png"},
	{varName: brickEraserPic, theFile: "../images/brickEraser.png"},
	{varName: brickFrozenPic, theFile: "../images/brickFrozen.png"},
	{varName: livesPic, theFile: "../images/lifeicon.png"},
	{varName: titlePic, theFile: "../images/title.png"},
	{varName: pillsPic, theFile: "../images/pills.png"},
	{varName: magnetPillPic, theFile: "../images/magnetPill.png"},
	{varName: letterBrickPic, theFile: "../images/letterBricks.png"},
	{varName: pupilPic, theFile: "../images/pupil.png"},
	{varName: eyeballPic, theFile: "../images/eyeball.png"},
	{varName: eyelidsPic, theFile: "../images/eyelids.png"},
	{varName: ballTrailPic, theFile: "../images/ballTrail.png"},
	{varName: shinePic, theFile: "../images/shine.png"},
	{varName: bouncePic, theFile: "../images/bounceEffect.png"},
	{varName: shotPic, theFile: "../images/shot.png"},
	{varName: editorBackgroundTile, theFile: "../images/editorBG.png"},
	{varName: plasmaPic, theFile: "../images/plasma.png"},
	{varName: plasma2Pic, theFile: "../images/plasma2.png"},
	{varName: plasma3Pic, theFile: "../images/plasma3.png"},
	{varName: plasma4Pic, theFile: "../images/plasma4.png"},
	{varName: guiBGPic, theFile: "../images/guiBG.png"},
	{varName: iceEnemyPic, theFile: "../images/iceEnemy.png"},
	{varName: wizEnemyPic, theFile: "../images/wizEnemy.png"},
	{varName: freezeAttackPic, theFile: "../images/icecream.png"}
];
var backgroundImages = [plasmaPic,plasma2Pic,plasma3Pic,plasma4Pic];
var picsToLoad = imageList.length;
var allImagesLoadedEvent = new CustomEvent('allImagesLoaded');

function countLoadedImageAndLaunchIfReady() {
    picsToLoad--;
    if (picsToLoad == 0) {
		canvas.dispatchEvent(allImagesLoadedEvent);
    }
}

function beginLoadingImage(imgVar, fileName) {
//    console.log("Loading image", imgVar, fileName);
    imgVar.onload = countLoadedImageAndLaunchIfReady;
    imgVar.src = "images/" + fileName;
}

function loadImages() {
    for (var i=0; i<imageList.length; i++) {
		beginLoadingImage(imageList[i].varName, imageList[i].theFile);
    }
}
