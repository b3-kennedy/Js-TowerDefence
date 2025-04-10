import Projectile from "./projectile.js";
import Vector from "./vector.js";

export default class PierceProjectile extends Projectile{
    constructor(canvas, context, game, maxHitCount){
        super(canvas, context);
        this.canvas = canvas;
        this.c = context;

        this.direction = new Vector(0,0);

        this.position = new Vector(0,0);
        this.velocity = new Vector(0,0);

        this.speed = 500;
        this.target = null;
        this.damage = 1;
        this.isActive = true;

        this.game = game;
        this.radius = 3;

        this.hitCount = 0;
        this.maxHitCount = maxHitCount;
        this.damagedEnemies = new Set();


    }

    draw(){
        if(this.isActive){
            this.c.beginPath();
            this.c.arc(this.position.x,this.position.y, this.radius, 0, 360, false);
            this.c.fillStyle = 'red';
            this.c.fill();
        }

    }

    update(deltaTime){
        if(!this.target) return;

        if(this.hitCount >= this.maxHitCount){
            this.isActive = false;
        }

        var enemies = this.game.enemies;

        if(this.isActive){
            var dir = Vector.Normalize(this.direction);
    
            this.velocity = Vector.Multiply(dir,this.speed * deltaTime);
    
            this.position = Vector.Add(this.position, this.velocity);
            
            for(var i = 0; i < enemies.length; i++){
                if(!this.damagedEnemies.has(enemies[i]) && Vector.Distance(this.position, enemies[i].position) <= enemies[i].radius + this.radius/2){
                    enemies[i].takeDamage(this.damage);
                    this.hitCount++;
                    if(!enemies[i].isDead){
                        this.damagedEnemies.add(enemies[i]);
                    }
                    
                }
            }

        }



    }
}