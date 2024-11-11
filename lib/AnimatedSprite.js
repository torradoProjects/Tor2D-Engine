import { GameObject, Timer, Vector2 } from "./Import.js";
import {bufferCtx, currentScene} from "./Variables.js";
export  class AnimatedSprite extends GameObject
{
    #rotation;
    #_play;
    constructor(name = "undefined", position = new Vector2(), size = new Vector2(), animations = [], speed = 0.3) // nombre, posicion, escala, array con animaciones, velocidad 
    {
        super(name, position, size);
        try {
            if (!Array.isArray(animations)) {
                throw new Error("El parámetro 'animations' debe ser un array.");
            }
            this.anim = animations;
        } catch (error) {
            console.error("Error al inicializar AnimatedSprite:", error.message);
            this.anim = []; // Inicializar con un array vacío como valor predeterminado
        }
        this.flip_h = false;
        this.flip_v = false;
        this.currentAnim = "";
        this.x = 0;
        this.y = 0;
        this.loop = true;
        this.#_play = false; 
        this.speed = speed;
        this.speedFrame = new Timer(this.speed);
        this.animation_finish = false;
        this.#rotation = 0;
        this.color = null; 
        this.alpha = 1;
    }
    setRotation(grados)
    {
        if (currentScene.pause) return;
        this.#rotation = Number.isInteger(grados) ? grados * (Math.PI / 180): 0;
        this.child.forEach(obj => {
            if (typeof obj.setRotation === "function") obj.setRotation(grados);
        });
    }
    wait = ()=>
    {
        if (this.#_play)
        {
            const anim = this.anim.find(anim => anim.name === this.currentAnim);
            
            if (anim)
            {
                if (this.x < anim.size.x - anim.frames.x)
                {
                    this.x += anim.frames.x;
                } else if (this.y < anim.size.y - anim.frames.y) 
                {
                    this.y += anim.frames.y;
                    this.x = anim.position.x;
                } else if (this.loop)
                {
                    this.x = anim.position.x;
                    this.y = anim.position.y;
                } else 
                {
                    this.animation_finish = true;
                    this.stop();
                }
            }
            
        }
    }
    Render()
    {
        super.scaler();
        const anim = this.anim.find(anim => anim.name === this.currentAnim);

        bufferCtx.save(); // Guardar el estado actual del contexto
        bufferCtx.globalAlpha = this.alpha; // Aplicar transparencia
        bufferCtx.translate(this.position.x + this.size.x / 2, this.position.y + this.size.y / 2);
        bufferCtx.rotate(this.#rotation);

        if (this.flip_h || this.flip_v) {
            bufferCtx.scale(this.flip_h ? -1 : 1, this.flip_v ? -1 : 1);
        }

        // Dibujar la animación si está definida, de lo contrario dibujar la primera animación
        const frameImg = anim ? anim.img : this.anim[0].img;
        const frameX = anim ? this.x : this.anim[0].x;
        const frameY = anim ? this.y : this.anim[0].y;
        const frameW = anim ? anim.frames.x : this.anim[0].frames.x;
        const frameH = anim ? anim.frames.y : this.anim[0].frames.y;
        
        bufferCtx.drawImage(frameImg, frameX, frameY, frameW, frameH, -this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y);

        // Aplicar color de superposición si se ha especificado
        if (this.color) {
            bufferCtx.globalCompositeOperation = "source-atop"; // Mezcla el color con la imagen
            bufferCtx.fillStyle = this.color;
            bufferCtx.fillRect(-this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y);
            bufferCtx.globalCompositeOperation = "source-over"; // Restaurar a la operación predeterminada
        }

        bufferCtx.globalAlpha = 1; // Restaurar la transparencia original
        bufferCtx.restore(); // Restaurar el estado original del contexto

        super.Render(); // Renderizar los hijos si los tiene
    }
    process()
    {
        this.speedFrame.process(); // procesa el objeto Timer interno
        
        if (this.animation_finish_name != undefined && this.animation_finish) // funcion que se ejecuta cuando finaliza una animacion
        {
            this.animation_finish_name(this.currentAnim);
        }
    }
    play(anim) // inicia la animacion
    {
        if (anim !== this.currentAnim) this.stop();
        if (!this.#_play) 
        {
            if ( anim !== this.currentAnim )
            {
                this.anim.forEach(obj => {
                    if (obj.name === anim)
                    {
                        this.x = obj.position.x;
                        this.y = obj.position.y;
                    }
                });
                this.speedFrame.stop();
            }
            this.currentAnim = anim;
            this.animation_finish = false;
            this.#_play = true;
            this.anim.forEach(obj => {
                if (obj.name === anim)
                {
                    this.x = obj.position.x;
                    this.y = obj.position.y;
                }
            });
            this.speedFrame.start(this.wait);
        }
    }
    stop() // detiene la animacion
    {
        if (this.#_play) this.#_play = false;
    }
}