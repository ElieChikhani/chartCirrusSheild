
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

    static drawNeedle(ctx,color,startX,startY,length){
        //needle drawing
        ctx.beginPath(); 
        ctx.strokeStyle=color;
        ctx.fillStyle=color; 
        ctx.moveTo(startX-10  ,startY);
        ctx.lineTo(startX, length); 
        ctx.lineTo(startX + 10 , startY); 
        ctx.fill(); 
        ctx.stroke(); 

        //the circle 
        ctx.beginPath(); 
        ctx.arc(startX, startY, 10, 0, 360 * Math.PI/180,false);
        ctx.fill(); 

        ctx.restore(); 
    }

   
}