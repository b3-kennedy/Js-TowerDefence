import Enemy from "./enemies/enemy.js";
import Enemy2 from "./enemies/enemy2.js";
import Enemy3 from "./enemies/enemy3.js";
import TankEnemy from "./enemies/tankenemy.js";
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
        this.allEnemiesSpawned = true;
        this.enemiesSpawned = 0;
        this.pauseTimer = 0;
        this.setupWaves();

    }

    setupWaves(){

        this.waves = [
            new Wave(25, 0.5, {enemy1: 20, enemy2: 20, enemy3: 60}),
            new Wave(10, 1, {enemy1: 100}),
            new Wave(15, 1, {enemy1: 50, enemy2: 50}),
            new Wave(20, 1, {enemy1: 20, enemy2: 20, enemy3: 60}),
            new Wave(30, 1, {tank: 50, enemy1: 50}),
            
        ];
    }

    spawnWave(){
        this.currentWave = this.waves[this.waveNumber] || this.waves[this.waves.length - 1];
        this.enemiesSpawned = 0;
        this.allEnemiesSpawned = false;
        this.spawnTimer = 0;
        this.spawnIndex = 0;
        this.pauseTimer = 0;
        this.isSpawning = true;
    
        console.log(
            `Wave: ${this.waveNumber + 1} | Enemy Count: ${this.currentWave.enemyCount} | Spawn Interval: ${this.currentWave.spawnInterval} | Spawn Chances: ${JSON.stringify(this.currentWave.spawnChances)}`
        );
    
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

    update(deltaTime){
        // Only pause and prepare for next wave when all enemies spawned AND no enemies on screen
        if (this.allEnemiesSpawned && this.game.enemies.length === 0) {
            this.pause(deltaTime);
        }
        // Continue spawning enemies for current wave
        else if (this.isSpawning && !this.allEnemiesSpawned) {
            this.spawnTimer += deltaTime;
            if (this.spawnTimer >= this.currentWave.spawnInterval && this.spawnIndex < this.currentWave.enemyCount) {
                this.spawnTimer = 0;
    
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
                        break;
                    case "tank":
                        enemy = new TankEnemy(this.canvas, this.c, this.game.waypoints, this.game.drawingArea, this.game);
                        break;

                }
    
                enemy.position = new Vector(
                    this.game.waypoints[0].getCentrePosition().x - 50,
                    this.game.waypoints[0].getCentrePosition().y
                );
    
                this.game.enemies.push(enemy);
                this.game.waveStarted = true;
    
                this.spawnIndex++;
                this.enemiesSpawned++;
    
                if (this.enemiesSpawned >= this.currentWave.enemyCount) {
                    this.allEnemiesSpawned = true;
                }
            }            
        }


    }



    pause(deltaTime) {    
        this.pauseTimer += deltaTime;
        this.isSpawning = false;
        this.draw();
    
        //console.log(`PauseTimer: ${this.pauseTimer.toFixed(2)} / ${this.remainingTime}`);
    
        if (this.pauseTimer >= this.timeBetweenWave/1000) {
            this.pauseTimer = 0;
            this.remainingTime = 0;
            this.spawnWave();
        }
        

        // const timerInterval = setInterval(() => {
        //     this.remainingTime--;
            
        //     if (this.remainingTime <= 0) {
        //         clearInterval(timerInterval); // Stop the timer
        //         this.spawnWave(); // Trigger the spawnWave
        //     }
        // }, 1000); // Update every second (1000 ms)
    }

    draw(){
        //this.c.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
        // Set up timer display properties
        this.c.fillStyle = "black";
        this.c.font = "30px Arial";
        this.c.textAlign = "center";
        this.c.textBaseline = "middle";
        
        var maxTime = this.timeBetweenWave/1000;
        // Display the timer text on the canvas
        if(!this.isSpawning){
            this.c.fillText(`Next Wave in: ${Math.round(maxTime - this.pauseTimer)}`, this.canvas.width / 2, 140);
        }else{
            this.c.fillText(`Wave ${this.waveNumber}`, this.canvas.width / 2, 140);
        }
        
    }

    
}