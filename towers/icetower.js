import Tower from "./tower.js";
import Vector from "../vector.js";
import Colours from "../colours.js";

export default class IceTower extends Tower{
        constructor(canvas, context, game){
            super(canvas, context, game);
            this.baseFireRate = 3000;
            this.radius = this.baseRadius
            this.name = "Ice Tower";
            this.damage = 0;
            this.cost = 250;
            this.description = `Slows all enemies within ${this.radius} units`;
        }
    
        clone() {
            const clone = new IceTower(this.canvas, this.c, this.game);
    
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
                fillStyle = Colours.iceColour;
                strokeStyle = 'black';
                if(this.isSelected){
                    this.drawRadius();
                }
            } else {
                this.drawRadius();
                fillStyle = 'rgba(191, 255, 254,0.5)';   // red with 50% opacity
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
    
        getTarget(){
            var enemies = this.game.enemies;
            var closeEnemies = []
            for (let i = 0; i < enemies.length; i++) {
                var distance = Vector.Distance(this.position, enemies[i].position);
                if(distance <= this.radius){
                    closeEnemies.push(enemies[i]);
                }
                
            } 
            return closeEnemies;
        }
    
        update(deltaTime){
    
            
            const currentTime = Date.now();
            if(currentTime - this.lastfireTime >= this.fireRate){
                var enemies = this.getTarget();
                if(enemies.length > 0){
                    enemies.forEach(element => element.slow());
                }
            }
        }
}