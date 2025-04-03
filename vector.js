export default class Vector{
    constructor(posX, posY){
        this.x = posX;
        this.y = posY;
    }

    static Normalize(vector){
        const magnitude = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
        if (magnitude !== 0) {
            let newX = vector.x / magnitude;
            let newY = vector.y / magnitude;
            return new Vector(newX, newY);
        }
        
    }

    static Add(vector1, vector2){
        return new Vector(vector1.x + vector2.x, vector1.y + vector2.y);
    }

    static Multiply(vector, scalar) {
        return new Vector(vector.x * scalar, vector.y * scalar);
    }
    

    static Distance(vector1, vector2){
        const dx = vector1.x - vector2.x;
        const dy = vector1.y - vector2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    static Direction(A, B) {
        let dx = B.x - A.x;
        let dy = B.y - A.y;

        return new Vector(dx, dy);
    }

}