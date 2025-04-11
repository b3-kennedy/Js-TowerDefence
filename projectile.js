import Vector from "./vector.js";

export default class Projectile{
    constructor(canvas, context, damage, speed){
        this.canvas = canvas;
        this.c = context;

        this.position = new Vector(0,0);
        this.velocity = new Vector(0,0);

        this.speed = speed;
        this.target = null;
        this.damage = damage;
        this.isActive = true;

        this.radius = 3;

    }

    draw(){
        if(this.isActive && this.target && !this.target.isDead){
            this.c.beginPath();
            this.c.arc(this.position.x,this.position.y, this.radius, 0, 360, false);
            this.c.fillStyle = 'blue';
            this.c.fill();
        }

    }

    update(deltaTime){
        if(!this.target) return;

        if(this.isActive){
            var dir = Vector.Direction(this.position, this.target.position);
            dir = Vector.Normalize(dir);
    
            this.velocity = Vector.Multiply(dir,this.speed * deltaTime);
    
            this.position = Vector.Add(this.position, this.velocity);
    
            if(Vector.Distance(this.position, this.target.position) <= this.target.radius + this.radius/2){
                this.target.takeDamage(this.damage);
                this.isActive = false;
            }
        }



    }
}