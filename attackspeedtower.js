import Vector from "./vector.js";
import Tower from "./tower.js";

export default class AttackSpeedTower extends Tower{
    constructor(canvas, context, game){
        super(canvas, context, game);
        this.cost = 200;
        this.isAura = true;
        this.name = "Fire Rate Buff Tower";
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
            this.c.fillStyle = 'green';
            this.c.fillRect(this.position.x-this.width/2, this.position.y, this.width, -this.height);
            this.c.strokeStyle = 'black';
            this.c.borderWidth = 1;
            this.c.strokeRect(this.position.x-this.width/2, this.position.y, this.width, -this.height)
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