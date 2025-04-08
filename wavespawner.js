import Enemy from "./enemy.js";
import Enemy2 from "./enemy2.js";
import Enemy3 from "./enemy3.js";
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
        this.currentWave = this.waves[0];
        this.remainingTime = 0;
        this.isSpawning = false;
        this.allEnemiesSpawned = false;
        this.enemiesSpawned = 0;
        this.setupWaves();

    }

    setupWaves(){

        this.waves = [
            new Wave(10, 1000, {enemy1: 100}),
            new Wave(15, 1000, {enemy1: 50, enemy2: 50}),
            new Wave(20, 1000, {enemy1: 20, enemy2: 20, enemy3: 60}),
            new Wave(25, 500, {enemy1: 20, enemy2: 20, enemy3: 60}),
        ];
    }

    startSequence(){
        this.pause();
    }

    spawnWave(){
        this.currentWave = this.waves[this.waveNumber] || this.waves[this.waves.length - 1];

        this.enemiesSpawned = 0;
        this.allEnemiesSpawned = false;


        console.log(
            `Wave: ${this.waveNumber + 1} | Enemy Count: ${this.currentWave.enemyCount} | Spawn Interval: ${this.currentWave.spawnInterval} | Spawn Chances: ${JSON.stringify(this.currentWave.spawnChances)}`
        );

        this.isSpawning = true;
        
        for (let i = 0; i < this.currentWave.enemyCount; i++) {
            setTimeout(() => {
                let enemyType = this.getEnemy();
                let enemy = null;
                switch (enemyType) {
                    case "enemy1":
                        enemy = new Enemy(this.canvas, this.c, this.game.waypoints, this.game.drawingArea, this.game);
                        break;
                    case "enemy2":
                        enemy = new Enemy2(this.canvas, this.c, this.game.waypoints, this.game.drawingArea, this.game);
                        break;
                    case "enemy3":
                        enemy = new Enemy3(this.canvas, this.c, this.game.waypoints, this.game.drawingArea, this.game);

                }

                this.enemiesSpawned++;
                if(this.enemiesSpawned >= this.currentWave.enemyCount){
                    this.allEnemiesSpawned = true;
                }

                enemy.position = new Vector(
                    this.game.waypoints[0].getCentrePosition().x - 50,
                    this.game.waypoints[0].getCentrePosition().y
                );
                this.game.enemies.push(enemy);
                this.game.waveStarted = true;
            }, (i + 1) * this.currentWave.spawnInterval);
        }
        
        this.waveNumber++;

        
    }

    getEnemy(){
        var randomNum = Math.floor(Math.random() * 100) + 1;
        let sum = 0;

        for (const [enemyType, chance] of Object.entries(this.currentWave.spawnChances)) {
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

    pause() {
        this.remainingTime = this.timeBetweenWave / 1000; // Time in seconds
        this.isSpawning = false;
        const timerInterval = setInterval(() => {
            this.remainingTime--;
            
            if (this.remainingTime <= 0) {
                clearInterval(timerInterval); // Stop the timer
                this.spawnWave(); // Trigger the spawnWave
            }
        }, 1000); // Update every second (1000 ms)
    }

    draw(){
        //this.c.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
        // Set up timer display properties
        this.c.fillStyle = "black";
        this.c.font = "30px Arial";
        this.c.textAlign = "center";
        this.c.textBaseline = "middle";
        
        // Display the timer text on the canvas
        this.c.fillText(`Next Wave in: ${this.remainingTime}`, this.canvas.width / 2, 70);
    }

    
}