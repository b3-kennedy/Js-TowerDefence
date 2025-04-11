import Enemy from "./enemy.js";
import Vector from "../vector.js";

export default class Enemy3 extends Enemy{
    constructor(canvas, context, waypoints, drawingArea, game){
        super(canvas, context, waypoints, drawingArea, game);
        this.position = new Vector(0,0);
        this.canvas = canvas;
        this.c = context;
        this.waypoints = waypoints;
        this.velocity = new Vector(1,0);
        this.target = this.waypoints[1];
        this.waypointIndex = 1;
        this.baseSpeed = 200;
        this.speed = this.baseSpeed;
        this.finalDir = new Vector(1,0);
        this.isDead = false;
        this.drawingArea = drawingArea;
        this.game = game;
        this.health = 3;
        this.bounty = 100;
        this.damageToPlayer = 1;
    }
    
    takeDamage(damage){
        this.health -= damage;
        if(this.health <= 0){
            this.isDead = true;
            this.game.alterMoney(this.bounty);
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
            this.c.fillStyle = 'yellow';
            this.c.fill();
        }        
    }

    slow(){
        super.slow();
    }

    move(deltaTime){
        super.move(deltaTime);
    }

    update(deltaTime){
        super.update(deltaTime);    
    }
}