import {GameObject, SpriteSheet} from "./Import.js";
import {bufferCtx, currentScene} from "./Variables.js";
export class Sprite extends GameObject 
{
    #rotation;
    constructor(name, position, size, path) 
    {
        super(name, position, size);
        this.img = new Image();
        this.img.src = typeof path === "string" ? path : "";
        this.path = path instanceof SpriteSheet ? path: null;
        if (this.path !== null) this.img.src = this.path.img.src;
        this.flip_h = false;
        this.flip_v = false;
        this.#rotation = 0; // rotación en radianes
        this.color = null;
        this.alpha = 1;
    }
    setRotation(grados) 
    {
        if (currentScene.pause) return;
        this.#rotation = Number.isInteger(grados) ? grados * (Math.PI / 180) : 0; 
        this.child.forEach(obj => {
            if (typeof obj.setRotation === "function") obj.setRotation(grados);
        });
    }
    Render() 
    {
        super.scaler();
        bufferCtx.save();
        bufferCtx.globalAlpha = this.alpha; // Aplicar transparencia
        bufferCtx.translate(this.position.x + this.size.x / 2, this.position.y + this.size.y / 2);
        bufferCtx.rotate(this.#rotation);

        if (this.flip_h || this.flip_v) {
            bufferCtx.scale(this.flip_h ? -1 : 1, this.flip_v ? -1 : 1);
        }

        if (this.path !== null) {
            bufferCtx.drawImage(this.img, this.path.position.x, this.path.position.y, this.path.size.x, this.path.size.y, -this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y);
        } else {
            bufferCtx.drawImage(this.img, -this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y);
        }

        // Aplicar color de superposición si se ha especificado
        if (this.color) {
            bufferCtx.globalCompositeOperation = "source-atop"; // Mezcla el color con la imagen
            bufferCtx.fillStyle = this.color;
            bufferCtx.fillRect(-this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y);
            bufferCtx.globalCompositeOperation = "source-over"; // Restaurar a la operación predeterminada
        }

        bufferCtx.globalAlpha = 1; // Restaurar la transparencia original
        bufferCtx.restore();
        super.Render();
    }
}
