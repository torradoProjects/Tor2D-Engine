import {GameObject, SpriteSheet, Vector2} from "./Import.js";
import {bufferCtx, currentScene} from "./Variables.js";
export class Sprite extends GameObject 
{
    #rotation;
    constructor(name = "undefined", position = new Vector2(), size = new Vector2(), path = "undefined") 
    {
        super(name, position, size);
        try {
            // Crear la imagen y asignar el src
            this.img = new Image();
    
            if (typeof path === "string") {
                this.img.src = path;
            } else if (path instanceof SpriteSheet && path.img && path.img.src) {
                // Si es un SpriteSheet válido, usar su imagen
                this.path = path;
                this.img.src = this.path.img.src;
            } else {
                // Si el path no es válido, asignar null y mostrar advertencia
                console.warn("El parámetro 'path' no es una cadena válida ni un SpriteSheet válido.");
                this.img.src = "";
                this.path = null;
            }
        } catch (error) {
            console.error(`Error al cargar la imagen: ${error.message}`);
            this.img = null; // Asignar null para evitar errores posteriores
            this.path = null;
        }
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
