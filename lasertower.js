import Vector from "./vector.js";
import Tower from "./tower.js";

export default class LaserTower extends Tower{
    constructor(canvas, context, game){
        super(canvas, context, game);
        this.baseFireRate = 100;
        this.name = "Laser Tower";
        this.damage = 0.1;
        this.cost = 500;
    }

    clone()
    {
        const clone = new LaserTower(this.canvas, this.c, this.game);

        clone.position = new Vector(this.position.x, this.position.y);
        clone.width = this.width;
        clone.height = this.height;
        clone.lastfireTime = this.lastfireTime;
        clone.fireRate = this.fireRate;
        clone.damage = this.damage;
        clone.range = this.range;
        clone.radius = this.radius;

        clone.enemies = [];
        clone.target = null;
        clone.projeciles = [];

        return clone;
    }

    draw(){
        this.c.fillStyle = 'blue';
        this.c.fillRect(this.position.x-this.width/2, this.position.y, this.width, -this.height);
        this.c.strokeStyle = 'black';
        this.c.borderWidth = 1;
        this.c.strokeRect(this.position.x-this.width/2, this.position.y, this.width, -this.height)

        if(this.target){
            this.drawLine(this.c, new Vector(this.position.x, this.position.y - this.height), this.target.position, 'red', 2);
        }
    }

    getTarget(){
        super.getTarget();
    }

    drawLine(ctx, vector1, vector2, color = 'black', width = 2) {
        ctx.beginPath();
        ctx.moveTo(vector1.x, vector1.y);       // Starting point
        ctx.lineTo(vector2.x, vector2.y);       // Ending point
        ctx.strokeStyle = color;  // Line color
        ctx.lineWidth = width;    // Line thickness
        ctx.stroke();
    }

    update(deltaTime){
        const currentTime = Date.now();
        if(currentTime - this.lastfireTime >= this.fireRate){

            this.getTarget();
            if(this.target){
                
                if(Vector.Distance(this.target.position, this.position) > this.radius){
                    this.target = null;
                }

                this.target.takeDamage(this.damage);
            }

        }        
    }
}