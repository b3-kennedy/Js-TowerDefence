import Vector from './vector.js';

export default class Enemy{
    constructor(canvas, context, waypoints, drawingArea){
        this.radius = 10;
        this.position = new Vector(0,0);
        this.colour = 'blue';
        this.canvas = canvas;
        this.c = context;
        this.waypoints = waypoints;
        this.velocity = new Vector(1,0);
        this.target = this.waypoints[1];
        this.waypointIndex = 1;
        this.speed = 1;
        this.finalDir = new Vector(1,0);
        this.isDead = false;
        this.drawingArea = drawingArea;
        this.health = 3;
        
    }

    takeDamage(damage){
        this.health -= damage;
        if(this.health <= 0){
            this.isDead = true;
        }
    }

    isInDrawingArea(){
        return (
            this.position.x >= this.drawingArea.x && 
            this.position.x < this.drawingArea.x + this.drawingArea.width && 
            this.position.y >= this.drawingArea.y && 
            this.position.y < this.drawingArea.y + this.drawingArea.height);
    }

    draw(){
        if(!this.isDead && this.isInDrawingArea()){
            this.c.beginPath();
            this.c.arc(this.position.x,this.position.y, this.radius, 0, 360, false);
            this.c.fillStyle = 'blue';
            this.c.fill();
        }

    }

    move(){
        if (this.waypoints.length > 0) {
            
            if(this.waypointIndex+1 == this.waypoints.length){
                this.velocity = Vector.Normalize(this.finalDir);
                this.velocity = Vector.Multiply(this.velocity, this.speed);

                this.position = Vector.Add(this.position, this.velocity);
            }else{
                const dir = Vector.Direction(this.position, this.target.getCentrePosition());
            
                this.velocity = Vector.Normalize(dir);
                this.velocity = Vector.Multiply(this.velocity, this.speed);
    
                this.position = Vector.Add(this.position, this.velocity);
        
                if (Vector.Distance(this.position, this.target.getCentrePosition()) <= 1) {
                    this.waypointIndex++;
                    if (this.waypointIndex + 1 < this.waypoints.length) {
                        this.target = this.waypoints[this.waypointIndex];
                    }
                    else
                    {
                        this.finalDir = Vector.Direction(this.position, this.waypoints[this.waypoints.length-1].getCentrePosition())
                    }
                }
            }
        }
    }

    update(){

        if(!this.isDead){
            this.move();
            if(this.position.x < 0 && this.waypointIndex > 1){
                console.log("Offscreen");
                this.isDead = true;
            }
        }

        
    }
}