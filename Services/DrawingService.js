
export default class DrawingService {

    static drawLine(ctx,color,startX,startY,endX,endY){
        ctx.save();
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
    }

    static fillText(ctx,color,font,align,text,x,y){
        ctx.save(); 
        ctx.fillStyle = color;
        ctx.font = font;
        ctx.textAlign = align;
        ctx.fillText(text, x, y); 
        ctx.restore();
    }

   
}