import {TextureButton, Vector2} from "./Import.js"; 
import { currentScene, uiCanvas, uiCtx } from "./Variables.js";
export class Joystick extends TextureButton 
{
    constructor(name = "undefined", position = new Vector2(), size = new Vector2(), texture_outer = "undefined", texture_inner = "undefined", maxDistance = 50) 
    {
        super(name, position, size, texture_outer, texture_outer);
        try {
            // Intentar cargar la textura interior
            this.texture_inner = new Image();
            this.texture_inner.src = texture_inner;
        } catch (error) {
            console.error(`Error al cargar la textura_inner '${texture_inner}':`, error.message);
            this.texture_inner = null; // Asignar null si hay error para evitar problemas
        }

        this.axisX = 0;
        this.axisY = 0;
        this.center = { x: this.position.x + this.size.x / 2, y: this.position.y + this.size.y / 2 };
        this.maxDistance = maxDistance;
        this.innerPos = { x: this.center.x, y: this.center.y };

        // Añadir evento touchmove para capturar el movimiento
        uiCanvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
    }

    // No se ajusta a la posición de la cámara, solo se renderiza en coordenadas fijas de la pantalla
    Render() 
    {
        // Renderizar el aro exterior (fondo del joystick)
        uiCtx.drawImage(this.img, this.position.x, this.position.y, this.size.x, this.size.y);

        // Renderizar el círculo interior
        uiCtx.drawImage(
            this.texture_inner,
            this.innerPos.x - this.size.x / 4,
            this.innerPos.y - this.size.y / 4,
            this.size.x / 2,
            this.size.y / 2
        );

        // Renderizar los hijos si existen
        super.RenderChild();
    }
    handleTouchMove(event) 
    {
        const touches = event.changedTouches;
        const rect = uiCanvas.getBoundingClientRect();

        for (let i = 0; i < touches.length; i++) 
        {
            let touchX = touches[i].clientX - rect.left;
            let touchY = touches[i].clientY - rect.top;

            if (this.isPressed && this.activeTouches.has(touches[i].identifier)) 
            {
                let deltaX = touchX - this.center.x;
                let deltaY = touchY - this.center.y;

                let distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                if (distance > this.maxDistance) {
                    let ratio = this.maxDistance / distance;
                    deltaX *= ratio;
                    deltaY *= ratio;
                }

                this.innerPos.x = this.center.x + deltaX;
                this.innerPos.y = this.center.y + deltaY;

                this.axisX = deltaX / this.maxDistance;
                this.axisY = deltaY / this.maxDistance;

                if (this.onMove && !currentScene.pause) this.onMove(this.axisX, this.axisY);
            }
        }
    }
    handleTouchEnd(event) 
    {
        super.handleTouchEnd(event);

        if (this.activeTouches.size === 0) 
        {
            this.innerPos.x = this.center.x;
            this.innerPos.y = this.center.y;
            this.axisX = 0;
            this.axisY = 0;
        }
    }
}