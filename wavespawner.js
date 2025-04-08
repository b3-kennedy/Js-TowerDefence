import Enemy from "./enemy.js";
import Enemy2 from "./enemy2.js";
import Vector from "./vector.js";


class Wave{
    constructor(enemyCount, spawnInterval, spawnChances){
        this.enemyCount = enemyCount;
        this.spawnInterval = spawnInterval;
        this.spawnChances = spawnChances;
    }
}

export default class WaveSpawner{
    constructor(canvas, context, game){
        this.canvas = canvas;
        this.c = context;
        this.game = game;
        this.waveNumber = 0;
        this.timeBetweenWave = 10000;
        this.waves = []
        this.setupWaves();

    }

    setupWaves(){

        this.waves = [
            new Wave(10, 1000, {enemy1: 100, enemy2: 0}),
            new Wave(15, 1000, {enemy1: 50, enemy2: 50})
        ];
    }

    startSequence(){
        this.pause();
    }

    spawnWave(){
        this.waveNumber++;        
        console.log(`Wave: ${this.waveNumber} | Enemy Count: ${this.waves[this.waveNumber-1].enemyCount} | Spawn Interval: ${this.waves[this.waveNumber-1].spawnInterval} | Spawn Chances: ${JSON.stringify(this.waves[this.waveNumber-1].spawnChances)}`);
        for(var i =0; i < this.waves[this.waveNumber-1].enemyCount; i++){
            setTimeout(() => {
                let enemyType = this.getEnemy();
                let enemy = null;
                switch(enemyType){
                    case "enemy1":
                        enemy = new Enemy(this.canvas, this.c, this.game.waypoints, this.game.drawingArea, this.game);
                        break;
                    case "enemy2":
                        enemy = new Enemy2(this.canvas, this.c, this.game.waypoints, this.game.drawingArea, this.game);
                        break;
                }
                enemy.position = new Vector(
                    this.game.waypoints[0].getCentrePosition().x - 50,
                    this.game.waypoints[0].getCentrePosition().y
                );
                this.game.enemies.push(enemy);
                this.game.waveStarted = true;
            }, (i + 1) * this.waves[this.waveNumber-1].spawnInterval);
        }

        
    }

    getEnemy(){
        var randomNum = Math.floor(Math.random() * 100) + 1;
        let sum = 0;

        for (const [enemyType, chance] of Object.entries(this.waves[this.waveNumber-1].spawnChances)) {
            sum += chance;
            if (randomNum <= sum) {
                return enemyType;
            }
        }

    }

    updateWave(){
        this.enemyCount += 5;
        this.spawnChances.enemy1 -= 50;
        this.spawnChances.enemy2 += 50;
    }

    pause(){
        setTimeout(() => this.spawnWave(), this.timeBetweenWave);
    }

    
}