// an animated fullscreen background

var bgFrameCount = 0;

function drawBackground(pic) {
    
    const size1 = 256; // 64
    const range1 = 64; //50;
    const size2 = 128; // 80
    const range2 = 64; //40;
    
    colorRect(0, 0, canvas.width, canvas.height, 'rgb(0,0,0)');
    bgFrameCount++;
    
    canvasContext.globalCompositeOperation = 'lighten';//'difference';//screen
    //canvasContext.globalAlpha = 0.5;
    
    canvasContext.drawImage(pic,
        pic.width/2 + Math.sin(bgFrameCount/200)*range1-(size1/2), // sx
        pic.height/2 + Math.sin(bgFrameCount/233)*range1-(size1/2), // sy
        size1, // sw
        size1, // sh
        0,0,canvas.width,canvas.height);

    canvasContext.drawImage(pic,
        pic.width/2 + Math.sin(bgFrameCount/111)*-range2-(size2/2), // sx
        pic.height/2 + Math.sin(bgFrameCount/99)*range2-(size2/2), // sy
        size2, // sw
        size2, // sh
        0,0,canvas.width,canvas.height);
    
    canvasContext.globalCompositeOperation = 'source-over';
    //canvasContext.globalAlpha = 1;


}