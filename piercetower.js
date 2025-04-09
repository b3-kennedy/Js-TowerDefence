import Vector from "./vector.js";
import Tower from "./tower.js";
import PierceProjectile from "./pierceprojectile.js";


export default class PierceTower extends Tower{
    constructor(canvas, context, game){
        super(canvas, context, game);
        this.baseFireRate = 3000;
        this.name = "Pierce Tower";
        this.damage = 1;
        this.cost = 250;
        this.height = 50;
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

        this.c.fillStyle = 'pink';
        this.c.fillRect(this.position.x-this.width/2, this.position.y, this.width, -this.height);
        this.c.strokeStyle = 'black';
        this.c.borderWidth = 1;
        this.c.strokeRect(this.position.x-this.width/2, this.position.y, this.width, -this.height)
        this.projeciles.forEach(element => {
            element.draw();
        });

    }

    getTarget(){
        let enemies = this.game.enemies;
        if (enemies.length === 0) {
            this.target = null;
            return;
        }

        let closestEnemy = null;
        let closestDistance = Infinity;

        for (let enemy of enemies) {
            let distance = Vector.Distance(this.position, enemy.position);
            if (distance < this.radius && distance < closestDistance) {
                closestDistance = distance;
                closestEnemy = enemy;
            }
        }

        this.target = closestEnemy;
    }

    update(deltaTime){

        const currentTime = Date.now();
        if(currentTime - this.lastfireTime >= this.fireRate){

            this.getTarget();
            if(this.target){
                
                if(Vector.Distance(this.target.position, this.position) > this.radius){
                    this.target = null;
                }

                var projectile = new PierceProjectile(this.canvas, this.c, this.game);
                
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