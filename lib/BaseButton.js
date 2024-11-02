import {Vector2, Label} from "./Import.js";
import {uiCanvas, uiCtx, currentScene} from "./Variables.js";
export  class BaseButton 
{
    #pressed;
    #waitPressed;
    #rotation;
	constructor(name, position, size)
	{
		this.name = typeof name === "string" ? name: "indefinido";
        this.parent = null;
        this.position = position instanceof Vector2 ? position : new Vector2();
        this.size = size instanceof Vector2 ? size : new Vector2(100, 100);
        this.visible = true;
        this.scale = 1
        this.layer = 0;
        this.child = [];
        this.color = "white"; // Color normal
        this.borderColor =  "black"; // Color del borde
        this.pressedColor =  "grey"; // Color cuando el botón está presionado
        this.#pressed = false;
        this.activeTouches = new Set(); // Para manejar múltiples toques
        this.borderRadius = 10; // Radio de los bordes redondeados
        this.shadowOffsetX = 4; // Desplazamiento de la sombra en X
        this.shadowOffsetY = 4; // Desplazamiento de la sombra en Y
        this.shadowBlur = 10; // Desenfoque de la sombra
        this.shadowColor = "rgba(0, 0, 0, 0.3)"; // Color de la sombra
        this.disabled = false;
        this.#waitPressed = false;
        this.#rotation = 0;
        // Eventos touch
        uiCanvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
        uiCanvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
        uiCanvas.addEventListener('touchcancel', this.handleTouchEnd.bind(this));

        // Eventos mouse
        uiCanvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        uiCanvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
	}
    setRotation(grados)
    {
        if (currentScene.pause) return;
        this.#rotation = Number.isInteger(grados) ?  grados * (Math.PI / 180) : 0;
        this.child.forEach(obj => {
            if (typeof obj.setRotation === "function") obj.setRotation(grados);
        });
    }
	isVisible() 
    {
        if (this.parent && this.parent.visible) return true;
        else if (this.visible) return true;
        else return false;
    }
    isPressed()
    {
        if (!this.#waitPressed && this.#pressed) 
        {
            this.#waitPressed = true;
            return this.#pressed;
        } else if (!this.#pressed)
        {
            this.#waitPressed = false;
        }
        return false;
    }
    scaler()
    {
        if (this.scale < 1 && this.scale > 0.1)
        {
            this.size = this.size.multiply(this.scale);
            this.scale = 1;
        } 
    }
    Render() 
    {
        // se escala 
        this.scaler();

        const rectColor = this.#pressed ? this.pressedColor : this.color; // Cambia el color cuando está presionado
        uiCtx.fillStyle = rectColor;

        // Guardar el contexto y aplicar rotación
        uiCtx.save();

        // Trasladar al centro del botón antes de rotar
        const centerX = this.position.x + this.size.x / 2;
        const centerY = this.position.y + this.size.y / 2;
        uiCtx.translate(centerX, centerY);
        uiCtx.rotate(this.#rotation);

        // Dibujar el botón desde el centro
        uiCtx.translate(-centerX, -centerY);
        uiCtx.shadowOffsetX = this.shadowOffsetX;
        uiCtx.shadowOffsetY = this.shadowOffsetY;
        uiCtx.shadowBlur = this.shadowBlur;
        uiCtx.shadowColor = this.shadowColor;

        // Dibujar botón con bordes redondeados
        this.roundRect(uiCtx, this.position.x, this.position.y, this.size.x, this.size.y, this.borderRadius);
        uiCtx.fill();

        // Dibujar el borde
        uiCtx.strokeStyle = this.borderColor;
        uiCtx.lineWidth = 2;
        uiCtx.stroke();

        // Restaurar el contexto
        uiCtx.restore();

        // Renderizar los hijos
        this.RenderChild();
    }
    RenderChild()
    {
        this.child.sort((a, b) => a.layer - b.layer);
        this.child.forEach(obj => {
            if (obj.Render && obj.visible) obj.Render();
        });
    }
    roundRect(ctx, x, y, width, height, radius) 
    {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }
    handleTouchStart(event) 
    {
        const touches = event.changedTouches; // Toques que cambiaron
        const rect = uiCanvas.getBoundingClientRect();

        for (let i = 0; i < touches.length; i++) 
        {
            let touchX = touches[i].clientX - rect.left;
            let touchY = touches[i].clientY - rect.top;

            // Verificar si el toque está dentro del área del botón
            if (this.isInsideBounds(touchX, touchY)) 
            {
                if (!this.disabled) this.#pressed = true;
                this.activeTouches.add(touches[i].identifier); // Añadir toque único
                if (this.is_action_pressed && !this.disabled) this.is_action_pressed(touches[i].identifier); // Ejecutar acción al precionar
            }
        }
    }
    handleTouchEnd(event) 
    {
        const changedTouches = event.changedTouches; // Toques que cambiaron

        for (let i = 0; i < changedTouches.length; i++) 
        {
            let touchId = changedTouches[i].identifier;

            // Solo liberar el botón si el toque que finalizó pertenece a este botón
            if (this.activeTouches.has(touchId)) 
            {
                this.activeTouches.delete(touchId); // Eliminar el toque que terminó

                // Soltar el botón solo si no quedan más toques activos para este botón
                if (this.activeTouches.size === 0) 
                {
                    if (!this.disabled) this.#pressed = false;
                    if (this.is_action_released && !this.disabled) this.is_action_released(); // Ejecutar acción al soltar
                }
            }
        }
    }
    handleMouseDown(event) 
    {
        const rect = uiCanvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        if (this.isInsideBounds(mouseX, mouseY)) 
        {
            if (!this.disabled) this.#pressed = true;
            if (this.is_action_pressed && !this.disabled) this.is_action_pressed(); // Ejecutar acción
        }
    }
    handleMouseUp(event) 
    {
        const rect = uiCanvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        if (this.isInsideBounds(mouseX, mouseY)) 
        {
            if (!this.disabled) this.#pressed = false;
            if (this.is_action_released && !this.disabled) this.is_action_released(); // Ejecutar acción al soltar
        }
    }
    isInsideBounds(x, y) 
    {
        return x >= this.position.x && x <= this.position.x + this.size.x &&
               y >= this.position.y && y <= this.position.y + this.size.y;
    }

    add_child(obj) 
    {
        if (obj instanceof Label) 
        {
            let pos = this.position.add(obj.position);
            obj.position = pos;
            this.child.push(obj);
        } else 
        {
            console.error(`El objeto ${obj.name} no se puede añadir al objeto ${this.name}.\n`);
            console.warn("El objeto permitido es: Label.");
        }
    }
}