import Vector from "./vector.js";

export default class Projectile{
    constructor(canvas, context){
        this.canvas = canvas;
        this.c = context;

        this.position = new Vector(0,0);
        this.velocity = new Vector(0,0);

        this.speed = 5;
        this.target = null;

        this.isActive = true;

    }

    draw(){
        if(this.isActive && this.target && !this.target.isDead){
            this.c.beginPath();
            this.c.arc(this.position.x,this.position.y, 3, 0, 360, false);
            this.c.fillStyle = 'blue';
            this.c.fill();
        }

    }

    update(){
        if(!this.target) return;

        if(this.isActive){
            var dir = Vector.Direction(this.position, this.target.position);
            dir = Vector.Normalize(dir);
    
            this.velocity = Vector.Multiply(dir,this.speed);
    
            this.position = Vector.Add(this.position, this.velocity);
    
            if(Vector.Distance(this.position, this.target.position) <= 10){
                this.target.takeDamage(1);
                this.isActive = false;
            }
        }



    }
}