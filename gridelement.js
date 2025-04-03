import Vector from './vector.js';
import Colours from './colours.js';


export default class GridElement{
    constructor(context, canvas){
        this.size = 50;
        this.position = new Vector(0,0);
        this.colour = Colours.grass;
        this.selectedColour = 'blue';
        this.borderColour = 'black';
        this.borderWidth = 1;
        this.name = "GridElement: " + "(" + this.position.x + "," + this.position.y + ")";
        this.c = context;
        this.canvas = canvas;
        this.isPath = false;
        this.debug = false;
        
    }

    draw(){
        this.c.fillStyle = this.colour;
        this.c.fillRect(this.position.x, this.position.y, this.size, this.size);
        this.drawBorders();


        if(this.debug){
            this.c.font = "16px Arial";  // Font size and type
            this.c.fillStyle = "black";  // Text color
            this.c.fillText(`${Math.round(this.position.x / this.size)},${Math.round(this.position.y / this.size)}`, 
                             Math.round(this.position.x + 10), Math.round(this.position.y + 25)); 
            
            this.c.strokeStyle = this.borderColour;
            this.c.borderWidth = this.borderWidth;
            this.c.strokeRect(this.position.x, this.position.y, this.size, this.size)
        }

    }

    drawBorders(){
        if(this.position.x == 0){ //left border
            this.drawLeftBorder(this.position.x, this.position.y,);
        }
        if(this.position.x == this.canvas.width - this.size){
            this.drawRightBorder(this.position.x, this.position.y);
        }
        if(this.position.y == 0){
            this.drawTopBorder(this.position.x, this.position.y);
        }
        if(this.position.y == this.canvas.height - this.size){
            this.drawBottomBorder(this.position.x, this.position.y);
        }
    }

    drawRightBorder(xpos, ypos){
        this.c.strokeStyle = this.borderColour;
        this.c.lineWidth = this.borderWidth*3;
        this.c.beginPath();
        this.c.moveTo(xpos + this.size, ypos);
        this.c.lineTo(xpos + this.size, ypos + this.size);
        this.c.stroke();
    }

    drawLeftBorder(xpos, ypos){
        this.c.strokeStyle = this.borderColour;
        this.c.lineWidth = this.borderWidth*3;
        this.c.beginPath();
        this.c.moveTo(xpos, ypos);
        this.c.lineTo(xpos, ypos+this.size);
        this.c.stroke();
    }

    drawTopBorder(xpos, ypos){
        this.c.strokeStyle = this.borderColour;
        this.c.lineWidth = this.borderWidth*3;
        this.c.beginPath();
        this.c.moveTo(xpos, ypos);
        this.c.lineTo(xpos+this.size, ypos);
        this.c.stroke();
    }

    drawBottomBorder(xpos, ypos){
        this.c.strokeStyle = this.borderColour;
        this.c.lineWidth = this.borderWidth*3;
        this.c.beginPath();
        this.c.moveTo(xpos, ypos + this.size);  // Move to the bottom-left corner (ypos + this.size)
        this.c.lineTo(xpos + this.size, ypos + this.size);  // Draw the line horizontally to the right
        this.c.stroke();
    }

    onMouseMove(event) {
        if(this.isPath) return;

        const rect = this.canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        if (
            mouseX > this.position.x &&
            mouseX < this.position.x + this.size &&
            mouseY > this.position.y &&
            mouseY < this.position.y + this.size
        ) 
        {
            this.colour = Colours.selectedColour;
        }else{
            this.colour = Colours.grass;
        }
    }

    onMouseOver() {
        if(this.isPath) return;

        console.log(`${this.name} - mouse over`);
        this.colour = Colours.selectedColour;
        this.draw();
    }

    getCentrePosition(){
        var x = this.position.x + this.size/2;
        var y = this.position.y + this.size/2;
        var pos = {x : x, y: y};
        return pos;
    }
}