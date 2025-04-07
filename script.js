import GridElement from './gridelement.js';
import Enemy from './enemy.js';
import Vector from './vector.js';
import Colours from './colours.js';
import Tower from './tower.js';
import LaserTower from './lasertower.js';
import ShopGridElement from './shopgridelement.js';

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
console.log(c);




export default class Game
{
    constructor(width, height, bgColour, canvas, context, gridSize){
        canvas.width = width;
        canvas.height = height;


        this.shopArea = {
            x: 4,
            y: canvas.height-905,
            width: 100,
            height: 800
        };



        this.drawingArea = {
            x: (canvas.width - 800) / 2,  // Centering
            y: (canvas.height - 800) / 2,
            width: 800,
            height: 800
        };

        c.fillStyle = bgColour;
        c.fillRect(this.drawingArea.x,this.drawingArea.y,this.drawingArea.width,this.drawingArea.height);



        this.width = this.drawingArea.width;
        this.height = this.drawingArea.height;
        this.bgColour = bgColour;
        this.canvas = canvas;
        this.c = context;
        this.grid = [];
        this.shopGrid = [];
        this.gridSize = gridSize;
        this.squareSize = this.drawingArea.width/this.gridSize;
        this.enemies = [];
        this.towers = [];
        this.waypoints = [];
        this.selectedTower = null;

        this.start();
    }

    start(){

        this.createGrid();
        this.createPath();
        this.createEnemy();
        this.createShop();
        this.update();
    }

    createShop(){
        var size = (this.shopArea.width/2)+0.06; //0.06 to align to game view
        var gridXSize = this.shopArea.width/size;
        var gridYSize = this.shopArea.height/size;

        
        //add items to the shop
        var defaultTower = new Tower(this.canvas, this.c, this);
        var laserTower = new LaserTower(this.canvas, this.c, this);
        var shopItems = []
        shopItems.push(defaultTower);
        shopItems.push(laserTower);

        console.log(shopItems[1]);

        for (let i = 0; i < gridYSize; i++) {
            this.shopGrid[i] = [];
            for (let j = 0; j < gridXSize; j++) {
                var shopElement = new ShopGridElement(this.c, this.canvas);
                shopElement.size = size;
                shopElement.position = new Vector(this.shopArea.x + (j * size), this.shopArea.y + (i * size));
                this.shopGrid[i][j] = shopElement;
                var index = i * gridXSize + j;
                this.shopGrid[i][j].item = shopItems[index];
            }
        }

        canvas.addEventListener("mousedown", (event) =>{
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            this.selectItem(event,x,y, gridXSize, gridYSize);


        });
        
        canvas.addEventListener('mousemove', (event) => {
            this.shopGrid.flat().forEach(element => {
                if (!element.isPath && !element.hasTower) {
                    element.onMouseMove(event);
                }
            });
        });

        canvas.addEventListener('mouseleave', () => {
            this.shopGrid.flat().forEach(element => {
                if (!element.isPath && ! element.hasTower) {
                    element.colour = Colours.shopColour;
                }
            });
        });

        



    }

    selectItem(event, x, y, gridXSize, gridYSize){

        for(var i = 0; i < gridYSize; i++){
            for(var j = 0; j < gridXSize; j++){
                var gridElement = this.shopGrid[i][j];
                var gridPos = this.shopGrid[i][j].position;
                if (
                    x > gridPos.x && x < gridPos.x + this.grid[i][j].size &&
                    y > gridPos.y && y < gridPos.y + this.grid[i][j].size
                ) 
                {
                    if(gridElement.item){
                        this.selectedItem = gridElement.item;
                    }

                }               
            }
        }
    }

    createEnemy(){

        for(var i =0; i < 5; i++){
            setTimeout(() => {
                let enemy = new Enemy(this.canvas, this.c, this.waypoints, this.drawingArea);
                enemy.position = new Vector(
                    this.waypoints[0].getCentrePosition().x - 50,
                    this.waypoints[0].getCentrePosition().y
                );
                enemy.radius = 15;
                enemy.speed = 1;
                this.enemies.push(enemy);
            }, (i + 1) * 1000); // Spawns enemies 1 second apart
        }

    }

    buildTowers(event, x, y){

        for(var i = 0; i < this.gridSize; i++){
            for(var j = 0; j < this.gridSize; j++){
                var gridElement = this.grid[i][j];
                var gridPos = this.grid[i][j].position;
                if(!gridElement.isPath && !gridElement.hasTower){
                    if (
                        x > gridPos.x && x < gridPos.x + this.grid[i][j].size &&
                        y > gridPos.y && y < gridPos.y + this.grid[i][j].size
                    ) 
                    {
                        if(this.selectedItem){
                            var tower = this.selectedItem.clone();
                            tower.position = new Vector(gridElement.getCentrePosition().x, gridElement.getCentrePosition().y);
                            tower.enemies = this.enemies;
                            this.towers.push(tower);
                            gridElement.hasTower = true;
                            gridElement.colour = Colours.grass;
                            return;
                        }

                    }  
                }
             
            }
        }
    }

    createGrid(){
        for (var i = 0; i < this.gridSize; i++) {
            this.grid[i] = [];
            for (var j = 0; j < this.gridSize; j++) {  // Inner loop: X-axis
                var newGridElement = new GridElement(c, canvas, this.drawingArea);
                newGridElement.size = this.squareSize+1; //+1 to remove white gaps between squares
                newGridElement.position.x = this.drawingArea.x + (i * this.squareSize);
                newGridElement.position.y = this.drawingArea.y + (j * this.squareSize);
                newGridElement.colour = Colours.grass;
                newGridElement.borderColour = 'black';
                newGridElement.debug = false;
                this.grid[i][j] = newGridElement;
            }
        }

        canvas.addEventListener("mousedown", (event) =>{
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            this.buildTowers(event,x,y);


        });

        canvas.addEventListener('mousemove', (event) => {
            this.grid.flat().forEach(element => {
                if (!element.isPath && !element.hasTower) {
                    element.onMouseMove(event);
                }
            });
        });

        canvas.addEventListener('mouseleave', () => {
            this.grid.flat().forEach(element => {
                if (!element.isPath && ! element.hasTower) {
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
        this.shopGrid.flat().forEach(element => element.draw());
        this.towers.forEach(element => element.draw());

        // c.fillStyle = this.bgColour;
        // c.fillRect(this.shopArea.x, this.shopArea.y, this.shopArea.width, this.shopArea.height);
    }

    update(){
        requestAnimationFrame(this.update.bind(this));
        c.clearRect(0,0, canvas.width, canvas.height);
        this.enemies = this.enemies.filter(element => !element.isDead);

        this.enemies.forEach(element => {
            element.update();
        });

        this.towers.forEach(element => {element.update()})
    
        this.draw();
    }
}

var game = new Game(1010, 1010, 'lightblue', canvas, c, 17)






