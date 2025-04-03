import GridElement from './gridelement.js';
import Enemy from './enemy.js';
import Vector from './vector.js';
import Colours from './colours.js';

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
console.log(c);




class Game
{
    constructor(width, height, bgColour, canvas, context, gridSize){
        canvas.width = width;
        canvas.height = height;

        c.fillStyle = bgColour;
        c.fillRect(0,0,canvas.width,canvas.height);

        this.width = width;
        this.height = height;
        this.bgColour = bgColour;
        this.canvas = canvas;
        this.c = context;
        this.grid = [];
        this.gridSize = gridSize;
        this.squareSize = this.width/this.gridSize;
        this.enemies = [];
        this.waypoints = [];

        this.start();
    }

    start(){

        this.createGrid();
        this.createPath();
        this.createEnemy();
        this.update();
    }

    createEnemy(){
        var enemy = new Enemy(this.canvas, this.c, this.waypoints);
        enemy.position.x = this.waypoints[0].getCentrePosition().x - 50;
        enemy.position.y = this.waypoints[0].getCentrePosition().y;
        enemy.radius = 15;
        this.enemies.push(enemy);
    }

    createGrid(){
        for (var i = 0; i < this.gridSize; i++) {  // Outer loop: Y-axis
            this.grid[i] = []; // Create a new row
            for (var j = 0; j < this.gridSize; j++) {  // Inner loop: X-axis
                var newGridElement = new GridElement(c, canvas);
                newGridElement.size = this.squareSize;
                newGridElement.position.x = i * this.squareSize;  // j controls X
                newGridElement.position.y = j * this.squareSize;  // i controls Y
                newGridElement.colour = Colours.grass;
                newGridElement.borderColour = 'black';
                newGridElement.debug = false;
                this.grid[i][j] = newGridElement; // Store in a 2D array
            }
        }

        canvas.addEventListener('mousemove', (event) => {
            this.grid.flat().forEach(element => {
                if (!element.isPath) {
                    element.onMouseMove(event);
                }
            });
        });

        canvas.addEventListener('mouseleave', () => {
            this.grid.flat().forEach(element => {
                if (!element.isPath) {
                    element.colour = Colours.grass;
                }
            });
        });
    }

    createPath() {
        const grid = [
            "#################",
            "----------------#",
            "###############-#",
            "#---------------#",
            "#-###############",
            "#---------------#",
            "###############-#",
            "#---------------#",
            "#-###############",
            "#---------------#",
            "###############-#",
            "#---------------#",
            "#-###############",
            "#---------------#",
            "###############-#",
            "----------------#",
            "#################"
        ];
            
        for (let x = 0; x < grid[0].length; x++) {  
            for (let y = 0; y < grid.length; y++) { 
                if (grid[x][y] === '-') {
                    this.grid[y][x].isPath = true;
                    this.grid[y][x].colour = Colours.pathColour;
                }
            }
        }

        //waypoints for moving enemies
        this.waypoints = [
            this.grid[0][1], this.grid[15][1], this.grid[15][3], this.grid[1][3], this.grid[1][5], this.grid[15][5], this.grid[15][7], 
            this.grid[1][7],this.grid[1][9],this.grid[15][9],this.grid[15][11],this.grid[1][11], this.grid[1][13], this.grid[15][13],
            this.grid[15][15], this.grid[0][15]
        ];
    }

    draw(){
        this.grid.flat().forEach(element => element.draw());
        this.enemies.forEach(element => element.draw());
    }

    update(){
        requestAnimationFrame(this.update.bind(this));
        this.enemies = this.enemies.filter(element => !element.isDead);

        this.enemies.forEach(element => {
            element.update();
        });
    
        this.draw();
    }
}

var game = new Game(800, 800, 'lightblue', canvas, c, 17)






