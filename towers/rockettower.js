import Vector from "../vector.js";
import RocketProjectile from "../rocketprojectile.js";
import Tower from "./tower.js";

export default class RocketTower extends Tower{
    constructor(canvas, context, game){
        super(canvas, context, game);
        this.baseFireRate = 2000;
        this.radius = this.baseRadius;
        this.name = "Rocket Tower";
        this.damage = 1;
        this.cost = 250;
        var seconds = this.baseFireRate /1000;
        this.description = `Fires a rocket every ${seconds} ${seconds === 1 ? 'second' : 'seconds'} which explodes dealing damage in an area, this tower will target the closest enemy`;
    }

    clone() {
        const clone = new RocketTower(this.canvas, this.c, this.game);

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

    drawRadius(){
        super.drawRadius();
    }

    draw(){

        const halfWidth = this.width / 2;
        const topLeftX = this.position.x - halfWidth;
        const topLeftY = this.position.y;
    
        let fillStyle, strokeStyle;

        if (this.isPlaced) {
            fillStyle = 'yellow';
            strokeStyle = 'black';
            this.projeciles.forEach(element => element.draw());
            if(this.isSelected){
                this.drawRadius();
            }
        } else {
            this.drawRadius();
            fillStyle = 'rgba(255, 255, 0, 0.5)';   // yellow with 50% opacity
            strokeStyle = 'rgba(0, 0, 0, 0.5)';   // black with 50% opacity
        }
    
        this.c.fillStyle = fillStyle;
        this.c.strokeStyle = strokeStyle;
    
        this.c.fillRect(topLeftX, topLeftY, this.width, -this.height);
        this.c.strokeStyle = strokeStyle;
        this.c.borderWidth = 2;
        this.c.strokeRect(topLeftX, topLeftY, this.width, -this.height);
        

    }

    getTarget(){
        super.getTarget();
    }

    update(deltaTime){

        
        const currentTime = Date.now();
        if(currentTime - this.lastfireTime >= this.fireRate){

            this.getTarget();
            if(this.target){
                
                if(Vector.Distance(this.target.position, this.position) > this.radius){
                    this.target = null;
                }

                var projectile = new RocketProjectile(this.canvas, this.c, this.game);
                projectile.enemies = this.enemies;
                projectile.position = new Vector(this.position.x, this.position.y - this.height);
                this.projeciles.push(projectile);
                projectile.target = this.target;
                this.lastfireTime = currentTime;
            }

        }

        this.projeciles.forEach(element => {
            element.update(deltaTime);
        });
    }
}