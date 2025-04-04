import Vector from "./vector.js";
import Colours from "./colours.js";

export default class ShopGridElement{
    constructor(context, canvas){
        this.c = context;
        this.canvas = canvas;
        this.size = 50;
        this.position = new Vector(0.0);
        this.colour = Colours.shopColour;
        this.item = null;
    }

    draw(){
        this.c.fillStyle = this.colour;
        this.c.fillRect(this.position.x, this.position.y, this.size, this.size);

        this.c.strokeStyle = 'black';
        this.c.borderWidth = 1;
        this.c.strokeRect(this.position.x, this.position.y, this.size, this.size)
    }

    onMouseMove(event) {
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
            this.colour = Colours.selectedShopColour;
        }else{
            this.colour = Colours.shopColour;
        }
    }

    onMouseOver() {

        console.log(`${this.name} - mouse over`);
        this.colour = Colours.selectedShopColour;
        this.draw();
    }
}