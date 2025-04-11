import Vector from "../vector.js";
import Tower from "./tower.js";
import PierceProjectile from "../pierceprojectile.js";


export default class PierceTower extends Tower{
    constructor(canvas, context, game){
        super(canvas, context, game);
        this.baseFireRate = 3000;
        this.name = "Pierce Tower";
        this.radius = this.baseRadius;
        this.damage = 1;
        this.cost = 250;
        this.height = 50;
        this.maxPierce = 3;
        var seconds = this.baseFireRate / 1000;
        this.description = `Fires a piercing projectile every ${seconds} ${seconds === 1 ? 'second' : 'seconds'}. This projectile will pierce through ${this.maxPierce} enemies before being destroyed, this tower will target the furthest away enemy`;
    }
    clone() {
        const clone = new PierceTower(this.canvas, this.c, this.game);

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
            this.projeciles.forEach(element => element.draw());
            fillStyle = 'pink';
            strokeStyle = 'black';
            if(this.isSelected){
                this.drawRadius();
            }
        } else {
            this.drawRadius();
            fillStyle = 'rgba(255, 105, 180, 0.5)';   // pink with 50% opacity
            strokeStyle = 'rgba(0, 0, 0, 0.5)';   // black with 50% opacity
        }
    
        this.c.fillStyle = fillStyle;
        this.c.strokeStyle = strokeStyle;
    
        this.c.fillRect(topLeftX, topLeftY, this.width, -this.height);
        this.c.strokeStyle = strokeStyle;
        this.c.borderWidth = 2;
        this.c.strokeRect(topLeftX, topLeftY, this.width, -this.height);
        

    }

    drawRadius(){
        super.drawRadius();
    }

    getTarget(){
        let enemies = this.game.enemies;
        if (enemies.length === 0) {
            this.target = null;
            return;
        }
        
        let furthestEnemy = null;
        let furthestDistance = 0;
        
        for (let enemy of enemies) {
            let distance = Vector.Distance(this.position, enemy.position);
            if (distance <= this.radius && distance > furthestDistance) {
                furthestDistance = distance;
                furthestEnemy = enemy;
            }
        }
        
        this.target = furthestEnemy;
    }

    update(deltaTime){

        const currentTime = Date.now();
        if(currentTime - this.lastfireTime >= this.fireRate){

            this.getTarget();
            if(this.target){
                
                if(Vector.Distance(this.target.position, this.position) > this.radius){
                    this.target = null;
                }

                var projectile = new PierceProjectile(this.canvas, this.c, this.game, this.maxPierce);
                
                projectile.position = new Vector(this.position.x, this.position.y - this.height);
                projectile.direction = Vector.Direction(projectile.position, this.target.position);
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