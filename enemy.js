import Vector from './vector.js';

export default class Enemy{
    constructor(canvas, context, waypoints){
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
        
    }

    draw(){
        this.c.beginPath();
        this.c.arc(this.position.x,this.position.y, this.radius, 0, 360, false);
        this.c.fillStyle = 'blue';
        this.c.fill();
    }



    update(){
        if (this.waypoints.length > 0) {
            const dir = Vector.Direction(this.position, this.target.getCentrePosition());
            
            this.velocity = Vector.Normalize(dir);
            this.velocity = Vector.Multiply(this.velocity, this.speed);

            this.position = Vector.Add(this.position, this.velocity);
    
            if (Vector.Distance(this.position, this.target.getCentrePosition()) <= 1) {
                if (this.waypointIndex + 1 < this.waypoints.length) {
                    this.waypointIndex++;
                    this.target = this.waypoints[this.waypointIndex];
                }
            }
        }
        
    }
}