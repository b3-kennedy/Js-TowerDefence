import Vector from "./vector.js";
import Projectile from "./projectile.js";

export default class Tower{
    constructor(canvas, context, game){
        this.canvas = canvas;
        this.position = new Vector(0,0);
        this.c = context;
        this.width = 25;
        this.height = 40;
        this.lastfireTime = 0;
        this.fireRate = 1000;
        this.enemies = [];
        this.target = null;
        this.game = game;
        this.radius = 250;
        this.projeciles = [];

        }

    draw(){

        this.c.fillStyle = 'red';
        this.c.fillRect(this.position.x-this.width/2, this.position.y, this.width, -this.height);
        this.c.strokeStyle = 'black';
        this.c.borderWidth = 1;
        this.c.strokeRect(this.position.x-this.width/2, this.position.y, this.width, -this.height)
        this.projeciles.forEach(element => {
            element.draw();
        });

    }

    getTarget(){
        let enemies = this.game.enemies;  // Get the latest enemy list
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

        // Update target
        this.target = closestEnemy;
    }

    update(){

        
        const currentTime = Date.now();
        if(currentTime - this.lastfireTime >= this.fireRate){

            this.getTarget();
            if(this.target){
                
                if(Vector.Distance(this.target.position, this.position) > this.radius){
                    this.target = null;
                }

                var projectile = new Projectile(this.canvas, this.c);
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