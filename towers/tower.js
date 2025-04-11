import Vector from "../vector.js";
import Projectile from "../projectile.js";

export default class Tower{
    constructor(canvas, context, game){
        this.canvas = canvas;
        this.position = new Vector(0,0);
        this.gridPosition = new Vector(0,0);
        this.c = context;
        this.width = 25;
        this.height = 40;
        this.lastfireTime = 0;
        this.baseFireRate = 1000;
        this.fireRate = this.baseFireRate;
        this.enemies = [];
        this.target = null;
        this.isRangeBuffed = false;
        this.game = game;
        this.damage = 1;
        this.baseRadius = 150;
        this.radius = this.baseRadius;
        this.projeciles = [];
        this.name = "Tower";
        this.cost = 100;
        var seconds = this.fireRate / 1000;
        this.description = `Fires a projectile every ${seconds} ${seconds === 1 ? 'second' : 'seconds'}, this tower will target the closest enemy`;
        this.isPlaced = false;
        this.projectileSpeed = 500;
        this.isSelected = false;
        this.isActive = true;

        }

    clone() {
        const clone = new Tower(this.canvas, this.c, this.game);

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
        if(!this.isActive) return;

        const halfWidth = this.width / 2;
        const topLeftX = this.position.x - halfWidth;
        const topLeftY = this.position.y;

        let fillStyle, strokeStyle;

        if (this.isPlaced) {
            this.projeciles.forEach(element => element.draw());
            fillStyle = 'red';
            strokeStyle = 'black';

            if(this.isSelected){
                this.drawRadius();
            }

        } else {
            this.drawRadius();
            fillStyle = 'rgba(255, 0, 0, 0.5)';   // red with 50% opacity
            strokeStyle = 'rgba(0, 0, 0, 0.5)';   // black with 50% opacity
            
        }



        
        this.c.fillStyle = fillStyle;
        this.c.strokeStyle = strokeStyle;

        
        this.c.fillRect(topLeftX, topLeftY, this.width, -this.height);
        this.c.strokeStyle = 'black'; 
        this.c.borderWidth = 2;
        this.c.strokeRect(topLeftX, topLeftY, this.width, -this.height);
    }

    drawRadius(){
        this.c.beginPath();
        this.c.arc(this.position.x,this.position.y, this.radius, 0, Math.PI * 2, false);
        this.c.fillStyle = 'rgba(0,0,0,0.25)';
        this.c.fill();
    }

    getTarget() {
        let enemies = this.game.enemies;
    
        if (this.target && this.target.isDead) {
            this.target = null;
        }
    
        if (this.target && Vector.Distance(this.position, this.target.position) < this.radius) {
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

        if(!this.isActive) return;

        const currentTime = Date.now();
        if(currentTime - this.lastfireTime >= this.fireRate){
            this.getTarget();
            if(this.target){
                
                if(Vector.Distance(this.target.position, this.position) > this.radius){
                    this.target = null;
                }

                var projectile = new Projectile(this.canvas, this.c, this.damage, this.projectileSpeed);
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

    onDestroy(){

    }
}