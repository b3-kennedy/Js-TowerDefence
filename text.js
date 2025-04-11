export default class Text{

    static boxWrap(ctx, text, x, y, width, height, lineHeight, colour, fontSize, align, baseline){

        ctx.fillStyle = colour;
        ctx.font = `${fontSize}px Arial`;
        ctx.textAlign = align;
        ctx.textBaseline = baseline;

        const words = text.split(' ');
        let line = '';
        let currentY = y;
      
        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + ' ';
            const testWidth = ctx.measureText(testLine).width;
    
            if (testWidth > width && i > 0) {
                if (currentY + lineHeight > y + height) break; // Stop if text would overflow box
                ctx.fillText(line, x, currentY);
                line = words[i] + ' ';
                currentY += lineHeight;
            } else {
                line = testLine;
            }
        }
    
        // Draw remaining line if within bounds
        if (currentY + lineHeight <= y + height) {
            ctx.fillText(line, x, currentY);
        }       
    }
}