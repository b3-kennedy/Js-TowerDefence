import Text from "./text.js";

export default class InfoPanel{
    constructor(canvas, context, game, dimensions){
        this.canvas = canvas;
        this.c = context;
        this.game = game;
        this.dimensions = dimensions;

        this.x = dimensions.x;
        this.y = dimensions.y;
        this.width = dimensions.width;
        this.height = dimensions.height;

        this.yPadding = 20;
        this.xPadding = 10;

        this.cost = 0;
        this.nameText = "";
        
        this.descriptionText = "";
        

    }

    draw(){
        //name
        this.c.font = "16px Arial";  // Font size and type
        this.c.fillStyle = "black";  // Text color
        this.c.textAlign = "left";
        this.c.textBaseline = "middle";
        this.c.fillText(this.nameText, this.x + this.xPadding,this.y + this.yPadding);

        //cost
        this.costText = this.cost.toString();
        if(this.cost > 0){
            this.c.fillText(": $"+this.costText, this.x + this.xPadding + this.c.measureText(this.nameText).width,this.y + this.yPadding);
        }

        //description
        Text.boxWrap(this.c, this.descriptionText, this.x + this.xPadding, this.y + this.yPadding + 25, this.width-this.xPadding, this.height, 15);
        //this.c.fillText(this.descriptionText, this.x + this.xPadding, this.y + this.yPadding + 25);
        
    }
}