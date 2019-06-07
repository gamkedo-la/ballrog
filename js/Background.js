// an animated fullscreen background

var bgFrameCount = 0;

function drawBackground(pic1,pic2) {
    
    const size1 = pic1.width/4; //256; // 64
    const range1 = pic1.width/4; //64; //50;
    const size2 = pic2.width/4; //128; // 80
    const range2 = pic2.width/4; //64; //40;

    bgFrameCount++;
    
    colorRect(0, 0, canvas.width, canvas.height, 'rgb(0,0,0)');
    //canvasContext.globalCompositeOperation = 'lighten';

    //colorRect(0, 0, canvas.width, canvas.height, 'rgb(255,255,255)');
    canvasContext.globalCompositeOperation = 'screen';
    
    //canvasContext.globalAlpha = 0.5;
    
    canvasContext.drawImage(pic1,
        pic1.width/2 + Math.sin(bgFrameCount/200)*range1-(size1/2), // sx
        pic1.height/2 + Math.sin(bgFrameCount/233)*range1-(size1/2), // sy
        size1, // sw
        size1, // sh
        0,0,canvas.width,canvas.height);

    canvasContext.drawImage(pic2,
        pic2.width/2 + Math.sin(bgFrameCount/111)*-range2-(size2/2), // sx
        pic2.height/2 + Math.sin(bgFrameCount/99)*range2-(size2/2), // sy
        size2, // sw
        size2, // sh
        0,0,canvas.width,canvas.height);
    
    canvasContext.globalCompositeOperation = 'source-over';
    //canvasContext.globalAlpha = 1;


}