// Woosh trail / speed lines effect by McFunkypants
// not a particle system; just one sprite that never dies
// and gets stretched around a path based on player movement

function TrailFX(wooshImage) {

    // private vars
    let trailImage = null;
    let trailXY = []; // list of previous positions
    
    if (!wooshImage) wooshImage = trailImage; // default: see ImageLoading.js

    let trailMaxLength = 4; // for a long trail, try 16

    const CURVY_MODE = false; // chop into many small lines? if false, just one long smooth line

    // rotates and stretches a bitmap to go from point A to point B, used by Woosh Lines FX
    function drawBitmapLine(useBitmap, startX, startY, endX, endY) {
        
        // avoid an upside down sprite
        // FIXME but then the faded edge of the png is in the wrong place
        //var temp = 0;
        //if (startX > endX) { temp=startX; startX=endX; endX=temp; } 
        //if (startY > endY) { temp=startY; startY=endY; endY=temp; } 
        
        var lineLength = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
        var lineAngle = Math.atan2(endY - startY, endX - startX);
        // edge case: avoid floating point imprecision flickering of angle on small values
        if (lineLength < 1) {
            // we COULD just not render, but this leaves gaps in the effect
            // if we are drawing multiple lines close together
            // return; 
            lineAngle = 0;
            lineLength = 1;
        }
        canvasContext.save();
        
        //FIXME: "skew" the sprite - looks better at 45 deg angles
        //canvasContext.setTransform(1, Math.tan(lineAngle), 0, 1, startX, startY);
        //canvasContext.setTransform(1, Math.tan(lineAngle), 0, 1, 0, 0);

        // when moving vertically, the line looks too wide, so squish it
        var squish = 1;
        //console.log('lineAngle:'+lineAngle.toFixed(1));
        if (lineAngle>1.5 && lineAngle<1.7) // going upish
            squish = 0.3;
        if (lineAngle<-1.5 && lineAngle>-1.7) // going downish
            squish = 0.3;
        
        // rotate the sprite - works great but looks bad when moving up or down
        canvasContext.translate(startX, startY);
        canvasContext.rotate(lineAngle);
        canvasContext.translate(0, - useBitmap.height * squish / 2);

        canvasContext.drawImage(useBitmap,
            0, 0, useBitmap.width, useBitmap.height, // src 
            0, 0, lineLength, useBitmap.height*squish);     // dest
        canvasContext.restore();
    }

    this.update = function(newX, newY) {

        //console.log(newX,newY);
        //prevents draw if we stand still for too long
        if (trailXY.length != 0 && newX == trailXY[0].x && newY == trailXY[0].y) {
            trailXY = [{ x: newX, y: newY }]; //saves the current pos here until we trigger a change
            //console.log("Here")
            return;
        }
        // add current position to the list
        trailXY.push({ x: newX, y: newY }); // not super happy about new objects being created here
        //console.log("push")

        // remove the oldest entry if the array is full
        // TODO: allow for > 2 coordinates for curvy chopped up lines
        if (trailXY.length > trailMaxLength) {
            trailXY.shift(); // low performance - optimize out?
        }

        //console.log("Wooshtrail trailXY.length=" + trailXY.length + " draw at " + newX + "," + newY);

    }
    
    // public funcs
    this.draw = function() {

        if (CURVY_MODE) {

            // draws many small lines
            // not stretched and "chopped" as intended
            // but this supports "curves"
            for (let segment = 0, count = trailXY.length - 1; segment < count; segment++) {

                drawBitmapLine(wooshImage,
                    trailXY[segment].x - 1, trailXY[segment].y,
                    trailXY[segment + 1].x + 1, trailXY[segment + 1].y);

            }
        }
        else {// draw one solid line
            // draws a line from oldest to newest with no regard to curvature
            drawBitmapLine(wooshImage,
                trailXY[0].x, trailXY[0].y,
                trailXY[trailXY.length - 1].x, trailXY[trailXY.length - 1].y);

        } // curvy
    } // draw 
} // class