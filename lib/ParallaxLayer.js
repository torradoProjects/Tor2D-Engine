import {ParallaxBackground, SpriteSheet, Vector2, Camera} from "./Import.js"; 
import {bufferCanvas, bufferCtx, currentScene} from "./Variables.js";
export class ParallaxLayer extends ParallaxBackground 
{
    constructor(name = "undefined", position = new Vector2(), size = new Vector2(), path = "undefined", moveSpeed = 1) 
    {
        super(name, position);
        this.size = size;
        this.moveSpeed = moveSpeed;
        this.img = new Image();
        try {
            // Verificar si el path es una cadena válida y asignar src
            if (typeof path === "string") {
                this.img.src = path;
            } else if (path instanceof SpriteSheet && path.img && path.img.src) {
                // Si es un SpriteSheet válido, asignar el src de la imagen del SpriteSheet
                this.path = path;
                this.img.src = this.path.img.src;
            } else {
                // Si el path no es válido, asignar null y lanzar un error
                this.path = null;
                this.img.src = "";
                console.warn("El parámetro 'path' no es una cadena válida ni un SpriteSheet válido.");
            }
        } catch (error) {
            console.error(`Error al cargar la imagen: ${error.message}`);
            this.img = null; // Asignar null para evitar errores posteriores
        }
        this.speed = 0;
        this.offset = 0; // Para ajustar la posición de repetición
    }

    globalPosition(parentPosition = new Vector2()) 
    {
        this.position = parentPosition.add(this.localPosition);
    }

    Render() 
    {
        // Calculamos la posición de la imagen en base al offset
        let totalWidth = this.size.x;
        let offsetPos = this.position.x + this.offset;
        
        // Dibujar las imágenes para cubrir todo el ancho de la pantalla
        for (let i = -1; i <= Math.ceil(bufferCanvas.width / totalWidth); i++) 
        {
            let xPos = offsetPos + i * totalWidth;

            if (this.path !== null)
            {
                bufferCtx.drawImage(this.img, this.path.position.x, this.path.position.y, this.path.size.x, this.path.size.y, xPos, this.position.y, this.size.x, this.size.y);
            } else
            {
                bufferCtx.drawImage(this.img, xPos, this.position.y, this.size.x, this.size.y);
            }
        }
    }
    _process() 
    {
        if (currentScene.pause) 
        {
            this.offset = 0;
            return;
        }
        if (Camera.target) 
        {
            if (Camera.moveX > 0) this.speed = -this.moveSpeed;
            else if (Camera.moveX < 0) this.speed = this.moveSpeed;
            else this.speed = 0;
            this.offset += this.speed;

            // Si la imagen se mueve completamente fuera de la pantalla, reajustamos el offset
            if (this.offset <= -this.size.x) 
            {
                this.offset += this.size.x;
            } else if (this.offset >= this.size.x) 
            {
                this.offset -= this.size.x;
            }
        } else if (!currentScene.pause)
        {
           // Si la imagen se mueve completamente fuera de la pantalla, reajustamos el offset
           if (this.offset <= -this.size.x) 
            {
                this.offset += this.size.x;
            } else if (this.offset >= this.size.x) 
            {
                this.offset -= this.size.x;
            } 
        }
    }
}