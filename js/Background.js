// an animated fullscreen background

var bgFrameCount = 0;

function drawBackground() {
    
    colorRect(0, 0, canvas.width, canvas.height, 'rgb(0,0,0)');
    bgFrameCount++;
    
    canvasContext.globalCompositeOperation = 'lighten';//'difference';
    //canvasContext.globalAlpha = 0.5;
    
    canvasContext.drawImage(plasmaPic,
        plasmaPic.width/2 + Math.cos(bgFrameCount/200)*50, // sx
        plasmaPic.height/2 + Math.cos(bgFrameCount/233)*50, // sy
        64, // sw
        64, // sh
        0,0,canvas.width,canvas.height);

    canvasContext.drawImage(plasmaPic,
        plasmaPic.width/2 + Math.cos(bgFrameCount/111)*-40, // sx
        plasmaPic.height/2 + Math.cos(bgFrameCount/99)*40, // sy
        80, // sw
        80, // sh
        0,0,canvas.width,canvas.height);
    
    canvasContext.globalCompositeOperation = 'source-over';
    //canvasContext.globalAlpha = 1;


}