// an arkanoid-inspired "glint" light reflection

function ShineFX(shineImage) {

    this.active = false;
    this.img = shineImage;
    this.w = BRICK_W;
    this.h = BRICK_H;
    this.x = 0;
    this.y = 0;
    this.frame = 0;
    this.frameCount = 8;
    
    this.trigger = function(x,y) {
        this.active = true;
        this.frame = 0;
        this.x = x;
        this.y = y;
    }
    
    this.draw = function() {
    
        if (this.active) {
            canvasContext.drawImage(
                this.img,0,0,this.w,this.h,
                this.x,this.y,this.w*(this.frame/this.frameCount),this.h);
            this.frame++;
            this.active = this.frame < this.frameCount;
        }

    }

}

