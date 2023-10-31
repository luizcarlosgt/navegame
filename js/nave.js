class Nave {
    constructor(canvas){
        this.image = new Image();
        this.image.src = "https://cdn.akamai.steamstatic.com/steam/apps/507050/extras/player2.png?t=1475525449";
        this.width = 100;
        this.height = 50;
        this.x = (canvas.width - this.width) / 2; 
        this.y =  canvas.height - this.height - 25;
        this.speed = 5;
        this.image.onload = () => {
            this.draw(ctx);
        };
    }
    
    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}