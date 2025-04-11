import Vector from "../vector.js";
import Tower from "./tower.js";

export default class AttackSpeedTower extends Tower{
    constructor(canvas, context, game){
        super(canvas, context, game);
        this.cost = 200;
        this.isAura = true;
        this.baseFireRate = 0;
        this.name = "Fire Rate Buff Tower";
        this.description = `Increases the fire rate for all towers within ${this.radius} units`
        this.applyBuff();
        
    }

        clone()
        {
            const clone = new AttackSpeedTower(this.canvas, this.c, this.game);
    
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
            const halfWidth = this.width / 2;
            const topLeftX = this.position.x - halfWidth;
            const topLeftY = this.position.y;

            let fillStyle, strokeStyle;
        
            if (this.isPlaced) {
                fillStyle = 'green';
                strokeStyle = 'black';
                if(this.isSelected){
                    this.drawRadius();
                }
            } else {
                this.drawRadius();
                fillStyle = 'rgba(0, 255, 0, 0.5)';   // red with 50% opacity
                strokeStyle = 'rgba(0, 0, 0, 0.5)';   // black with 50% opacity
            }
        
            this.c.fillStyle = fillStyle;
            this.c.strokeStyle = strokeStyle;
        
            this.c.fillRect(topLeftX, topLeftY, this.width, -this.height);
            this.c.strokeStyle = strokeStyle;
            this.c.borderWidth = 2;
            this.c.strokeRect(topLeftX, topLeftY, this.width, -this.height);
        
        }

        drawRadius(){
            super.drawRadius();
        }
    
        getTargets(){
            var towers = this.game.towers;
            var inRangeTowers = []
            for (let i = 0; i < towers.length; i++) {
                var distance = Vector.Distance(this.position, towers[i].position);
                if(distance <= this.radius){
                    inRangeTowers.push(towers[i]);
                }
                
            }

            return inRangeTowers;   
        }

        applyBuff(){
            var towers = this.getTargets();
            if(towers.length == 0){
                return;
            }

            for(let i = 0; i < towers.length; i++){
                towers[i].fireRate = towers[i].baseFireRate / 2;
            }
        }
    
        // drawLine(ctx, vector1, vector2, color = 'black', width = 2) {
        //     ctx.beginPath();
        //     ctx.moveTo(vector1.x, vector1.y);       // Starting point
        //     ctx.lineTo(vector2.x, vector2.y);       // Ending point
        //     ctx.strokeStyle = color;  // Line color
        //     ctx.lineWidth = width;    // Line thickness
        //     ctx.stroke();
        // }
    
        update(deltaTime){
            
        }
}