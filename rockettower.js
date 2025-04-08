import Vector from "./vector.js";
import RocketProjectile from "./rocketprojectile.js";
import Tower from "./tower.js";

export default class RocketTower extends Tower{
    constructor(canvas, context, game){
        super(canvas, context, game);
        this.baseFireRate = 2000;
        this.name = "Rocket Tower";
        this.damage = 1;
        this.cost = 250;
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

    draw(){

        this.c.fillStyle = 'yellow';
        this.c.fillRect(this.position.x-this.width/2, this.position.y, this.width, -this.height);
        this.c.strokeStyle = 'black';
        this.c.borderWidth = 1;
        this.c.strokeRect(this.position.x-this.width/2, this.position.y, this.width, -this.height)
        this.projeciles.forEach(element => {
            element.draw();
        });

    }

    getTarget(){
        super.getTarget();
    }

    update(){

        
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
            element.update();
        });
    }
}