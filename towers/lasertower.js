import Vector from "../vector.js";
import Tower from "./tower.js";

export default class LaserTower extends Tower{
    constructor(canvas, context, game){
        super(canvas, context, game);
        this.baseFireRate = 100;
        this.fireRate = this.baseFireRate;
        this.radius = this.baseRadius;
        this.name = "Laser Tower";
        this.damage = 0.1;
        this.cost = 500;
        var seconds = this.baseFireRate/1000;
        this.description = `Fires a laser which deals damage every ${seconds} ${seconds === 1 ? 'second' : 'seconds'}, this tower will target the closest enemy`;
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
        const halfWidth = this.width / 2;
        const topLeftX = this.position.x - halfWidth;
        const topLeftY = this.position.y;
    

        let fillStyle, strokeStyle;

        if (this.isPlaced) {
            fillStyle = 'blue';
            strokeStyle = 'black';
            if(this.isSelected){
                this.drawRadius();
            }
        } else {
            this.drawRadius();
            fillStyle = 'rgba(0, 0, 255, 0.5)';   // red with 50% opacity
            strokeStyle = 'rgba(0, 0, 0, 0.5)';   // black with 50% opacity
        }
    
        this.c.fillStyle = fillStyle;
        this.c.strokeStyle = strokeStyle;
    
        this.c.fillRect(topLeftX, topLeftY, this.width, -this.height);
        this.c.strokeStyle = strokeStyle;
        this.c.borderWidth = 2;
        this.c.strokeRect(topLeftX, topLeftY, this.width, -this.height);
    
        if(this.target && this.isPlaced){
            this.drawLine(this.c, new Vector(this.position.x, this.position.y - this.height), this.target.position, 'red', 1);
        }
    }

    drawRadius(){
        super.drawRadius();
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