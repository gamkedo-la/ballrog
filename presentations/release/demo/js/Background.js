// an animated fullscreen background

var bgFrameCount = 0;
var newBackground = [];

function drawBackground(pic1,pic2,pic3,pic4) {
    
    bgFrameCount++;
   
    colorRect(0, 0, canvas.width, canvas.height, 'rgb(0,0,0)');
    canvasContext.globalCompositeOperation = 'screen';
    
    if (pic1) {
        var size1 = pic1.width/4; //256; // 64
        var range1 = pic1.width/4; //64; //50;
        canvasContext.drawImage(pic1,
            pic1.width/2 + Math.sin(bgFrameCount/200)*range1-(size1/2), // sx
            pic1.height/2 + Math.sin(bgFrameCount/233)*range1-(size1/2), // sy
            size1, // sw
            size1, // sh
            0,0,canvas.width,canvas.height);
    }

    if (pic2) {
        var size2 = pic2.width/4; //128; // 80
        var range2 = pic2.width/4; //64; //40;
        canvasContext.drawImage(pic2,
            pic2.width/2 + Math.sin(bgFrameCount/111)*-range2-(size2/2), // sx
            pic2.height/2 + Math.sin(bgFrameCount/99)*range2-(size2/2), // sy
            size2, // sw
            size2, // sh
            0,0,canvas.width,canvas.height);
    }

    if (pic3) {
        var size3 = pic3.width/8; //128; // 80
        var range3 = pic3.width/6; //64; //40;
        canvasContext.drawImage(pic2,
            pic3.width/2 + Math.sin(bgFrameCount/142)*-range3-(size3/2), // sx
            pic3.height/2 + Math.sin(bgFrameCount/231)*range3-(size3/2), // sy
            size3, // sw
            size3, // sh
            0,0,canvas.width,canvas.height);
    }

    if (pic4) {
        var size4 = pic4.width/2; //128; // 80
        var range4 = pic4.width/8; //64; //40;
        canvasContext.drawImage(pic4,
            pic4.width/2 + Math.sin(bgFrameCount/313)*-range4-(size4/2), // sx
            pic4.height/2 + Math.sin(bgFrameCount/309)*range4-(size4/2), // sy
            size4, // sw
            size4, // sh
            0,0,canvas.width,canvas.height);
    }

    canvasContext.globalCompositeOperation = 'source-over';
    //canvasContext.globalAlpha = 1;


}

function createBackground() {
	newBackground = [];
	for (var i = 0; i < 3; i++) {
		if (Math.random() > 0.3) {
			newBackground.push(backgroundImages[getRandomIntInclusive(0, backgroundImages.length - 1)]);
			//console.log("Added background");
		}
	};
}







