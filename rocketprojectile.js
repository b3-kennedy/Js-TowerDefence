import Projectile from "./projectile.js";
import Vector from "./vector.js";

export default class RocketProjectile extends Projectile{
    constructor(canvas, context, game){
        super(canvas,context);
        this.canvas = canvas;
        this.c = context;

        this.position = new Vector(0,0);
        this.velocity = new Vector(0,0);

        this.speed = 500;
        this.target = null;
        this.damage = 1;
        this.isActive = true;

        this.game = game;
        this.radius = 50;
    }

    draw(){
        if(this.isActive && this.target && !this.target.isDead){
            this.c.beginPath();
            this.c.arc(this.position.x,this.position.y, 5, 0, 360, false);
            this.c.fillStyle = 'blue';
            this.c.fill();
        }

    }

    doAoeDamage(){
        var enemies = this.game.enemies;
        for (let i = 0; i < enemies.length; i++) {
            var distance = Vector.Distance(this.position, enemies[i].position);
            if(distance <= this.radius){
                enemies[i].takeDamage(this.damage);
            }
            
        }        
    }


    update(deltaTime){
        if(!this.target) return;

        if(this.isActive){
            var dir = Vector.Direction(this.position, this.target.position);
            dir = Vector.Normalize(dir);
    
            this.velocity = Vector.Multiply(dir,this.speed * deltaTime);
    
            this.position = Vector.Add(this.position, this.velocity);
    
            if(Vector.Distance(this.position, this.target.position) <= 10){
                this.doAoeDamage();
                this.isActive = false;
            }
        }



    }
}