import Tower from "./tower.js";
import Vector from "./vector.js";

export default class IceTower extends Tower{
        constructor(canvas, context, game){
            super(canvas, context, game);
            this.baseFireRate = 3000;
            this.name = "Ice Tower";
            this.damage = 0;
            this.cost = 250;
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
    
            this.c.fillStyle = 'lightblue';
            this.c.fillRect(this.position.x-this.width/2, this.position.y, this.width, -this.height);
            this.c.strokeStyle = 'black';
            this.c.borderWidth = 1;
            this.c.strokeRect(this.position.x-this.width/2, this.position.y, this.width, -this.height)
            this.projeciles.forEach(element => {
                element.draw();
            });
    
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