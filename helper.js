export default class Helper{

    static isInBox(x, y, boxX, boxY, width, height){
        return x >= boxX && x <= boxX + width && y >= boxY && y <= boxY + height;
    }
}