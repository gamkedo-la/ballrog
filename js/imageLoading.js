var ballPic = document.createElement("img");
var letterBrickPic = document.createElement("img");
var paddlePic = document.createElement("img");
var brick1Pic = document.createElement("img");
var brick2Pic = document.createElement("img");
var brick3Pic = document.createElement("img");
var brick4Pic = document.createElement("img");
var brickRightPic = document.createElement("img");
var brickLeftPic = document.createElement("img");
var brickVertPic = document.createElement("img");
var brickEraserPic = document.createElement("img");
var livesPic = document.createElement("img");
var titlePic = document.createElement("img");
var pillsPic = document.createElement("img");
var pupilPic = document.createElement("img");
var eyeballPic = document.createElement("img");
var eyelidsPic = document.createElement("img");
var ballTrailPic = document.createElement("img");
var shinePic = document.createElement("img");
var bouncePic = document.createElement("img");
var editorBackgroundTile = document.createElement("img");
var plasmaPic = document.createElement("img");
var iceEnemyPic = document.createElement("img");
var imageList = [
	{varName: ballPic, theFile: "../images/ball.png"},
	{varName: paddlePic, theFile: "../images/paddle.png"},
	{varName: brick1Pic, theFile: "../images/brick1.png"},
	{varName: brick2Pic, theFile: "../images/brick2.png"},
	{varName: brick3Pic, theFile: "../images/brick3.png"},
	{varName: brick4Pic, theFile: "../images/brick4.png"},
	{varName: brickRightPic, theFile: "../images/brick_right.png"},
	{varName: brickLeftPic, theFile: "../images/brick_left.png"},
	{varName: brickVertPic, theFile: "../images/brick_vertical.png"},
	{varName: brickEraserPic, theFile: "../images/brickEraser.png"},
	{varName: livesPic, theFile: "../images/lifeicon.png"},
	{varName: titlePic, theFile: "../images/title.png"},
	{varName: pillsPic, theFile: "../images/pills.png"},
	{varName: letterBrickPic, theFile: "../images/letterBricks.png"},
	{varName: pupilPic, theFile: "../images/pupil.png"},
	{varName: eyeballPic, theFile: "../images/eyeball.png"},
	{varName: eyelidsPic, theFile: "../images/eyelids.png"},
	{varName: ballTrailPic, theFile: "../images/ballTrail.png"},
	{varName: shinePic, theFile: "../images/shine.png"},
	{varName: bouncePic, theFile: "../images/bounceEffect.png"},
	{varName: editorBackgroundTile, theFile: "../images/editorBG.png"},
	{varName: plasmaPic, theFile: "../images/plasma.png"},
	{varName: iceEnemyPic, theFile: "../images/iceEnemy.png"}
];
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
