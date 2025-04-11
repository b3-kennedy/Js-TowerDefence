import Text from "./text.js";
import Helper from "./helper.js";

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

        this.isButtonHovered = false;

        this.cost = 0;
        this.nameText = "";
        this.descriptionText = "";
        this.sell = 0;
        this.sellText = "";
        this.fireRateText = "";
        this.damageText = "";
        this.towerRange = "";

        this.isShop = false;

        this.buttonX = this.x + this.xPadding + 75 / 2;
        this.buttonY = this.y + 16 + (this.yPadding + 75 / 2);
        this.buttonWidth = 75;
        this.buttonHeight = 40;
        

    }

    shop(){
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

    towerStats() {
        this.c.font = "16px Arial";
        this.c.fillStyle = "black";
        this.c.textAlign = "left";
        this.c.textBaseline = "middle";
    
        const baseX = this.x + this.xPadding;
        const baseY = this.y + this.yPadding;
    
        // Name
        this.c.fillText(this.nameText, baseX, baseY);
        const nameWidth = this.c.measureText(this.nameText).width;
    
        // Fire rate text
        const fireRateFull = "Current Fire Rate: " + this.fireRateText + " |";
        const fireRateX = baseX;
        this.c.fillText(fireRateFull, fireRateX, baseY + 25);
        const fireRateWidth = this.c.measureText(fireRateFull).width;
    
        // Damage text
        const damageFull = "Damage: " + this.damageText + " |";
        const damageX = fireRateX + fireRateWidth + 5;
        this.c.fillText(damageFull, damageX, baseY + 25);
        const damageWidth = this.c.measureText(damageFull).width;

        // Range text
        const rangeFull = "Range: " + this.rangeText + "";
        const rangeX =  damageX + damageWidth + 5;
        this.c.fillText(rangeFull, rangeX, baseY + 25);

        // Sell button
        this.c.fillStyle = this.isButtonHovered ? 'darkblue' : 'blue';
        this.c.fillRect(baseX, baseY + 35, 75, 40);
        Text.boxWrap(this.c, `Sell $${this.sell}`, this.buttonX, this.buttonY, this.buttonWidth, this.buttonHeight, 15, 'black', 14, 'center', 'middle');
    }

    update(){
        if(!this.isShop){
            var mouseX = this.game.mousePosition.x;
            var mouseY = this.game.mousePosition.y;
            this.isButtonHovered = Helper.isInBox(mouseX, mouseY, this.x + this.xPadding, this.y + this.yPadding + 35, 75, 40);
        }

    }

    draw(){
        if(this.isShop){
            this.shop();
        }else{
            this.towerStats();
        }
    }
}