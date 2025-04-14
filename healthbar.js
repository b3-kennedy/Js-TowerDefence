export default class HealthBar{
    constructor(canvas, context, game, dimensions){
        this.canvas = canvas;
        this.c = context;
        this.game = game;
        this.dimensions = dimensions;

        console.log(this.game.healthHeight);
    }

    draw(){
        //healthbar background
        this.c.fillStyle = 'red';
        this.c.fillRect(this.dimensions.x, this.dimensions.y, this.dimensions.width, this.dimensions.height);
        this.c.strokeRect(this.dimensions.x, this.dimensions.y, this.dimensions.width, this.dimensions.height);

        this.c.fillStyle = 'green';
        this.c.fillRect(
            this.dimensions.x, 
            this.dimensions.y + (this.dimensions.height - this.game.healthHeight),  // move y down
            this.dimensions.width, 
            this.game.healthHeight
        );
        this.c.strokeRect(this.dimensions.x, this.dimensions.y, this.dimensions.width, this.dimensions.height);
    }
}