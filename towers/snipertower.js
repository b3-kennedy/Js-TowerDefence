import Projectile from "../projectile.js";
import Vector from "../vector.js";
import Tower from "./tower.js";

export default class SniperTower extends Tower{
    constructor(canvas, context, game){
        super(canvas, context, game);
        this.name = "Sniper Tower";
        this.baseFireRate = 5000;
        this.fireRate = this.baseFireRate;
        this.damage = 5;
        this.cost = 250;
        var seconds = this.baseFireRate /1000;
        this.description = `Fires a projectile every ${seconds} ${seconds === 1 ? 'second' : 'seconds'}, this tower will target the closest enemy`;
        this.baseRadius = 500;
        this.radius = this.baseRadius;
        this.projectileSpeed = 1000;
    }

    clone() {
        const clone = new SniperTower(this.canvas, this.c, this.game);

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
            fillStyle = 'brown';  // Change to brown
            strokeStyle = 'black';
            this.projeciles.forEach(element => element.draw());
            if(this.isSelected){
                this.drawRadius();
            }
        } else {
            this.drawRadius();
            fillStyle = 'rgba(139, 69, 19, 0.5)';  // brown with 50% opacity
            strokeStyle = 'rgba(0, 0, 0, 0.5)';    // black with 50% opacity
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

                var projectile = new Projectile(this.canvas, this.c,this.damage, this.projectileSpeed);
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