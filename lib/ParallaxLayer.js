<<<<<<< HEAD
import {ParallaxBackground, SpriteSheet, Vector2, Camera} from "./Import.js";
import {bufferCanvas, bufferCtx, currentScene} from "./Variables.js";
export class ParallaxLayer extends ParallaxBackground 
{
    constructor(name, position, size, path, moveSpeed) 
    {
        super(name, position);
        this.size = size;
        this.moveSpeed = moveSpeed;
        this.img = new Image();
        this.img.src = typeof path === "string" ? path : "";
        this.path = path instanceof SpriteSheet ? path: null;
        if (this.path !== null) this.img.src = this.path.img.src;
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
=======
import {ParallaxBackground, SpriteSheet, Vector2, Camera} from "./Import.js";
import {bufferCanvas, bufferCtx, currentScene} from "./Variables.js";
export class ParallaxLayer extends ParallaxBackground 
{
    constructor(name, position, size, path, moveSpeed) 
    {
        super(name, position);
        this.size = size;
        this.moveSpeed = moveSpeed;
        this.img = new Image();
        this.img.src = typeof path === "string" ? path : "";
        this.path = path instanceof SpriteSheet ? path: null;
        if (this.path !== null) this.img.src = this.path.img.src;
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
>>>>>>> f5ef691cf3fe1d0dd2a7e52dcaf2fb2884fe8617
}