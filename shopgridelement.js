import Vector from "./vector.js";
import Colours from "./colours.js";

export default class ShopGridElement{
    constructor(context, canvas, game){
        this.c = context;
        this.canvas = canvas;
        this.size = 50;
        this.position = new Vector(0.0);
        this.colour = Colours.shopColour;
        this.item = null;
        this.isSelected = false;
        this.game = game;
        this.isHovered = false;
    }



    draw(){

        if(!this.isSelected){
            this.c.fillStyle = this.colour;
        }else{
            this.c.fillStyle = Colours.selectedShopColour;
        }

        if(this.item){
            if(this.game.money < this.item.cost){
                this.c.fillStyle = 'red';
            }
        }


        this.c.fillRect(this.position.x, this.position.y, this.size, this.size);


        this.c.strokeStyle = 'black';
        this.c.borderWidth = 1;
        this.c.strokeRect(this.position.x, this.position.y, this.size, this.size)

        function wrapTextToTwoLines(ctx, text, maxWidth) {
            let words = text.split(' ');
            let line1 = '';
            let line2 = '';
        
            for (let word of words) {
                if (ctx.measureText(line1 + word + ' ').width <= maxWidth) {
                    line1 += word + ' ';
                } else if (ctx.measureText(line2 + word + ' ').width <= maxWidth) {
                    line2 += word + ' ';
                } else {
                    break; // Stop if both lines can't take more
                }
            }
        
            return [line1.trim(), line2.trim()];
        }

        if(this.item){

            this.c.fillStyle = 'white';
            this.c.font = '12px Arial';
            this.c.textAlign = 'center';
            const rawText = this.item.name; // or any other string
            const maxWidth = this.size - 5; // Padding from edges
        
            const [line1, line2] = wrapTextToTwoLines(this.c, rawText, maxWidth);
            

            

            if(line2){
                this.c.fillText(line1, this.position.x + this.size / 2, (this.position.y + this.size/2) - 5);
                this.c.fillText(line2, this.position.x + this.size / 2, (this.position.y + this.size/2) + 10);
            }else{
                this.c.fillText(line1, this.position.x + this.size / 2, (this.position.y + this.size/2));
            }
        }
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
            if(!this.item) return;
            var info = {name: this.item.name, cost: this.item.cost, description: this.item.description};
            this.game.updateInfoPanel(info, true);
        }else{
            this.colour = Colours.shopColour;
            
        }
    }

    onMouseOver() {

        console.log(`${this.name} - mouse over`);
        this.colour = Colours.selectedShopColour;
        this.draw();
    }

    update(deltaTime){
        if(this.isHovered){
            //console.log("hovered");
        }
    }
}