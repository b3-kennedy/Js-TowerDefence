import Projectile from "./projectile.js";
import Vector from "./vector.js";

export default class PierceProjectile extends Projectile{
    constructor(canvas, context, game){
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
        this.radius = 50;

        this.hitCount = 0;

        this.damagedEnemies = new Set();

        console.log("pierce");

    }

    draw(){
        if(this.isActive){
            this.c.beginPath();
            this.c.arc(this.position.x,this.position.y, 3, 0, 360, false);
            this.c.fillStyle = 'red';
            this.c.fill();
        }

    }

    update(deltaTime){
        if(!this.target) return;


        var enemies = this.game.enemies;

        if(this.isActive){
            var dir = Vector.Normalize(this.direction);
    
            this.velocity = Vector.Multiply(dir,this.speed * deltaTime);
    
            this.position = Vector.Add(this.position, this.velocity);
            
            for(var i = 0; i < enemies.length; i++){
                if(!this.damagedEnemies.has(enemies[i]) && Vector.Distance(this.position, enemies[i].position) <= 10){
                    enemies[i].takeDamage(this.damage);
                    this.damagedEnemies.add(enemies[i]);
                }
            }

        }



    }
}