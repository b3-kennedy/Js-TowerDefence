import Text from "./text.js";
import Helper from "./helper.js";

export default class GameOverPanel {
    constructor(canvas, context, game, dimensions) {
        this.canvas = canvas;
        this.c = context;
        this.game = game;
        this.dimensions = dimensions;
        this.isButtonHovered = false;

        this.titleTextPos = {
            x: this.dimensions.x + this.dimensions.width / 2,
            y: this.dimensions.y + 25,
            width: 300,
            height: 100
        };

        this.paragraphPos = {
            x: this.dimensions.x + this.dimensions.width / 2,
            y: this.dimensions.y + 75,
            width: 300,
            height: 100
        };

        this.buttonPos ={
            x: (this.dimensions.x + this.dimensions.width / 2) - (75/2),
            y: this.dimensions.y + 115,
            width: 75,
            height: 40
        }
    }

    draw() {
        this.c.fillStyle = 'lightblue';
        this.c.fillRect(this.dimensions.x, this.dimensions.y, this.dimensions.width, this.dimensions.height);
        Text.boxWrap(this.c, "GAME OVER", this.titleTextPos.x, this.titleTextPos.y, this.titleTextPos.width, this.titleTextPos.height, 25, 'black', 25, 'center', 'top');
        Text.boxWrap(
            this.c, 
            "You reached wave " + this.game.waveSpawner.waveNumber.toString(), 
            this.paragraphPos.x, 
            this.paragraphPos.y, 
            this.paragraphPos.width, 
            this.paragraphPos.height,
            25,
            'black',
            16,
            'center',
            'top'
        );

        this.c.fillStyle = this.isButtonHovered ? 'darkblue' : 'blue';
        this.c.fillRect(this.buttonPos.x, this.buttonPos.y, this.buttonPos.width, this.buttonPos.height);
        Text.boxWrap(
            this.c, 
            "Restart", 
            this.buttonPos.x + (this.buttonPos.width / 2), 
            this.buttonPos.y + (this.buttonPos.height / 2), 
            this.buttonPos.width, 
            this.buttonPos.height, 
            25, 
            'black', 
            14, 
            'center', 
            'middle'
        );
    }

    update(){
        var mouseX = this.game.mousePosition.x;
        var mouseY = this.game.mousePosition.y;
        this.isButtonHovered = Helper.isInBox(mouseX, mouseY,this.buttonPos.x, this.buttonPos.y, this.buttonPos.width, this.buttonPos.height);
    }
}