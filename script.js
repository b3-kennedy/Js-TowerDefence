import GridElement from './gridelement.js';
import Vector from './vector.js';
import Colours from './colours.js';
import ShopGridElement from './shopgridelement.js';
import Tower from './tower.js';
import LaserTower from './lasertower.js';
import AttackSpeedTower from './attackspeedtower.js';
import RocketTower from './rockettower.js';
import WaveSpawner from './wavespawner.js';
import IceTower from './icetower.js';
import PierceTower from './piercetower.js';
import InfoPanel from './infopanel.js';
import SniperTower from './snipertower.js';


const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');




export default class Game
{
    constructor(width, height, bgColour, canvas, context, gridSize){
        canvas.width = width;
        canvas.height = height;




        this.bgColour = bgColour;
        this.canvas = canvas;
        this.c = context;
        this.grid = [];
        this.shopGrid = [];
        this.gridSize = gridSize;
        this.enemies = [];
        this.towers = [];
        this.placer;
        this.waypoints = [];
        this.selectedTower = null;
        this.money = 500;
        this.waveStarted = false;
        this.health = 100;
        this.mousePosition = new Vector(0,0);
        this.gridMousePosition = new Vector(0,0);
        
        this.lastTime = performance.now();
        this.mouseOnGame = false;

        this.shopArea = {
            x: 55,
            y: canvas.height-855,
            width: 100,
            height: 700
        };


        this.drawingArea = {
            x: (canvas.width - 700) / 2,  // Centering
            y: (canvas.height - 700) / 2,
            width: 700,
            height: 700
        };

        this.infoPanelDimensions = {
            x: (canvas.width - 700) / 2 - this.shopArea.width,
            y: this.canvas.height - 154,
            width: this.drawingArea.width + this.shopArea.width+1,
            height: 100            
        };

        this.infoPanel = new InfoPanel(this.canvas, this.c, this, this.infoPanelDimensions);

        this.width = this.drawingArea.width;
        this.height = this.drawingArea.height;
        this.squareSize = this.drawingArea.width/this.gridSize;
        
    }

    start(){

        this.createGrid();
        this.createPath();
        this.createEnemy();
        this.createShop();
        this.update = this.update.bind(this);
        requestAnimationFrame(this.update);
    }

    createShop(){
        var size = (this.shopArea.width/2)+0.06; //0.06 to align to game view
        var gridXSize = this.shopArea.width/size;
        var gridYSize = this.shopArea.height/size;

        
        //add items to the shop
        var shopItems = [
            new Tower(this.canvas, this.c, this),
            new LaserTower(this.canvas, this.c, this),
            new AttackSpeedTower(this.canvas, this.c, this),
            new RocketTower(this.canvas, this.c, this),
            new IceTower(this.canvas, this.c, this),
            new PierceTower(this.canvas, this.c, this),
            new SniperTower(this.canvas, this.c, this),
        ];

        for (let i = 0; i < gridYSize; i++) {
            this.shopGrid[i] = [];
            for (let j = 0; j < gridXSize; j++) {
                var shopElement = new ShopGridElement(this.c, this.canvas, this);
                shopElement.size = size;
                shopElement.position = new Vector(this.shopArea.x + (j * size), this.shopArea.y + (i * size));
                this.shopGrid[i][j] = shopElement;
                var index = Math.round(i * gridXSize + j);
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
                gridElement.isSelected = false;
                if (
                    x > gridPos.x && x < gridPos.x + this.grid[i][j].size &&
                    y > gridPos.y && y < gridPos.y + this.grid[i][j].size
                ) 
                {
                    if(gridElement.item){
                        this.selectedItem = gridElement.item;
                        var graphic = this.selectedItem.clone();
                        this.placer = graphic;
                        graphic.isPlaced = false;
                        gridElement.isSelected = true;
                    }

                }               
            }
        }
    }

    createEnemy(){
        this.waveSpawner = new WaveSpawner(this.canvas, this.c, this);

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
                        if(this.selectedItem && this.money >= this.selectedItem.cost){
                            var tower = this.selectedItem.clone();
                            tower.isPlaced = true;
                            tower.position = new Vector(gridElement.getCentrePosition().x, gridElement.getCentrePosition().y);
                            tower.enemies = this.enemies;
                            this.towers.push(tower);
                            this.placer = null;
                            this.updateAuraTowers();
                            gridElement.hasTower = true;
                            gridElement.colour = Colours.grass;
                            this.alterMoney(-this.selectedItem.cost)
                            this.selectedItem = null;
                            
                            return;
                        }

                    }  
                }
             
            }
        }
    }

    updateAuraTowers(){
        if(this.towers.length == 0){
            return;
        }

        for(let i = 0; i < this.towers.length; i++){
            if(this.towers[i].isAura){
                this.towers[i].applyBuff();
            }
        }
    }

    updateInfoPanel(info, isShop){
        if(isShop){
            this.infoPanel.nameText = info.name;
            this.infoPanel.cost = info.cost;
            this.infoPanel.descriptionText = info.description;
        }

    }

    setMousePosition(event){
        const rect = this.canvas.getBoundingClientRect();
        this.mousePosition.x = event.clientX - rect.left;
        this.mousePosition.y = event.clientY - rect.top;

        if(this.mousePosition.x >= this.drawingArea.x && this.mousePosition.x < this.drawingArea.x + this.drawingArea.width && 
            this.mousePosition.y >= this.drawingArea.y && this.mousePosition.y < this.drawingArea.y + this.drawingArea.height){
                const gridX = Math.floor((this.mousePosition.x - this.drawingArea.x) / this.squareSize);
                const gridY = Math.floor((this.mousePosition.y - this.drawingArea.y) / this.squareSize);

                this.gridMousePosition.x = gridX;
                this.gridMousePosition.y = gridY;
                this.mouseOnGame = true;

        }else{
            this.gridMousePosition.x = -1;
            this.gridMousePosition.y = -1;
            this.mouseOnGame = false;
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
            this.setMousePosition(event);
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

    alterMoney(value){
        this.money += value;
    }

    draw(){



        this.grid.flat().forEach(element => element.draw());
        this.enemies.forEach(element => element.draw());
        this.shopGrid.flat().forEach(element => element.draw());
        this.towers.forEach(element => element.draw());


        var gridX = this.gridMousePosition.x;
        var gridY = this.gridMousePosition.y;
        //only draw the placer if the mouse is on the game and not on a path square
        if(this.mouseOnGame && gridX > -1 && gridY > -1 && !this.grid[gridX][gridY].isPath && this.placer){
            this.placer.draw()
        }
        

        if(!this.waveSpawner.isSpawning){
            this.waveSpawner.draw();
        }
        

        this.c.font = "30px Arial";  // Font size and type
        this.c.fillStyle = "black";  // Text color
        this.c.fillText(`$${this.money}`, 100,140, 100); 

        // c.fillStyle = this.bgColour;
        // c.fillRect(this.shopArea.x, this.shopArea.y, this.shopArea.width, this.shopArea.height);
        
        //info panel
        c.fillStyle = this.bgColour;
        c.fillRect(this.infoPanel.x, this.infoPanel.y, this.infoPanel.width, this.infoPanel.height);

        this.c.strokeStyle = 'black';
        this.c.borderWidth = 2;
        this.c.strokeRect(this.infoPanel.x, this.infoPanel.y, this.infoPanel.width, this.infoPanel.height)

        this.infoPanel.draw();
    }

    damagePlayer(damage){
        this.health -= damage;
        console.log(`Player Health: ${this.health}`);
        if(this.health <= 0){
            console.log("GAME OVER");
        }
    }

    update(currentTime){

        let deltaTime = (currentTime - this.lastTime) / 1000;

        deltaTime = Math.min(deltaTime, 0.1); //limits deltaTime so when tabbed out the enemies dont have irrational movement

        this.lastTime = currentTime;
        requestAnimationFrame(this.update);
        c.clearRect(0,0, canvas.width, canvas.height);
        this.enemies = this.enemies.filter(element => !element.isDead);

        this.waveSpawner.update(deltaTime);

        if(this.placer){
            var gridX = this.gridMousePosition.x;
            var gridY = this.gridMousePosition.y;
            if(gridX > -1 && gridY > -1 && !this.grid[gridX][gridY].isPath){
                this.placer.position = this.grid[gridX][gridY].getCentrePosition();
            }
            
        }

        this.enemies.forEach(element => {
            element.update(deltaTime);
        });

        this.towers.forEach(element => {element.update(deltaTime)});

        this.shopGrid.flat().forEach(element => {element.update(deltaTime)});
    
        this.draw();
    }
}

var game = new Game(1010, 1010, 'lightblue', canvas, c, 17)
game.start();






