// an "poof" explosion sprite oriented to bounce normal

function BounceFX(bounceImage) {

    this.active = false;
    this.img = bounceImage;
    this.w = 100;
    this.h = 100;
    this.x = 0;
    this.y = 0;
    this.frame = 0;
    this.frameCount = 16;
    
    this.trigger = function(x,y) {
        this.active = true;
        this.frame = 0;
        this.x = x;
        this.y = y;
    }
    
    this.draw = function() {
    
        if (this.active) {
            
            var currentSize = this.w*(this.frame/this.frameCount);
            if (this.frame > this.frameCount / 2) { // shrink at 50% time
                currentSize = this.w - currentSize;
            }
            var offset = currentSize / 2;
            
            canvasContext.drawImage(
                this.img,0,0,
                this.w,this.h,
                this.x-offset,this.y-offset,
                currentSize,currentSize);
            
            this.frame++;
            this.active = this.frame < this.frameCount;

        }

    }

}

