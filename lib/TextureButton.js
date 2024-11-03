import { BaseButton, SpriteSheet, Vector2} from "./Import.js";
import { uiCtx, uiCanvas, currentScene } from "./Variables.js";
export class TextureButton extends BaseButton
{
    #pressed;
    #waitPressed = false;
    #rotation;
	constructor(name, position, size, texture_normal, texture_pressed)
	{
		super(name, position, size);
		this.texture_pressed = new Image();
		this.texture_normal = new Image();
		this.texture_pressed.src = typeof texture_pressed === "string" ? texture_pressed: "";
		this.texture_normal.src = typeof texture_normal === "string" ? texture_normal: "";
		this.img = new Image();
		this.img.src = typeof texture_normal === "string" ? texture_normal: "";
        this.textureNormalSpriteSheet = texture_normal instanceof SpriteSheet ? texture_normal : null;
        this.texturePressedSpriteSheet = texture_pressed instanceof SpriteSheet ? texture_pressed : null;
        this.cutSize = new Vector2();
        this.cutPosition = new Vector2();
        if (this.textureNormalSpriteSheet !== null) 
        {
            this.img.src = texture_normal.img.src;
            this.texture_normal.src = texture_normal.img.src;
            this.cutSize = texture_normal.size;
            this.cutPosition = texture_normal.position;
        }
        if (this.texturePressedSpriteSheet !== null) this.texture_pressed.src = texture_pressed.img.src;
		this.#pressed = false;
        this.activeTouches = new Set(); // Para manejar múltiples toques
        this.#rotation = 0;
	}
    setRotation(grados)
    {
        if (currentScene.pause) return;
        this.#rotation = Number.isInteger(grados) ?  grados * (Math.PI / 180) : 0;
        this.child.forEach(obj => {
            if (typeof obj.setRotation === "function") obj.setRotation(grados);
        });
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
	Render() 
	{
        super.scaler(); // se escala
        // Guardar el estado actual del contexto
        uiCtx.save();

        // Trasladar el contexto al centro del botón
        uiCtx.translate(this.position.x + this.size.x / 2, this.position.y + this.size.y / 2);
 
        // Aplicar la rotación
        uiCtx.rotate(this.#rotation);
 
        // Dibujar la imagen, pero ajustar las coordenadas para que se centre después de la rotación
        if (this.textureNormalSpriteSheet !== null && this.texturePressedSpriteSheet !== null)
        {
            uiCtx.drawImage(this.img, this.cutPosition.x, this.cutPosition.y, this.cutSize.x, this.cutSize.y, -this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y);
        } else 
        {
            uiCtx.drawImage(this.img, -this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y);
        }
 
        // Restaurar el estado original del contexto
        uiCtx.restore();
 
        // Renderizar los hijos del botón, si los hay
        super.RenderChild();
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
            if (touchX >= this.position.x && touchX <= this.position.x + this.size.x &&
                touchY >= this.position.y && touchY <= this.position.y + this.size.y) 
            {
                
                if (!this.disabled) this.#pressed = true;
                this.img = this.texture_pressed;
                this.cutPosition = this.texturePressedSpriteSheet.position;
                this.cutSize = this.texturePressedSpriteSheet.size;
                this.activeTouches.add(touches[i].identifier); // Añadir toque único
                if (this.is_action_pressed && !this.disabled) this.is_action_pressed(touches[i].identifier); // Ejecutar acción con el identificador
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
            if (this.activeTouches.has(touchId)) {
                this.activeTouches.delete(touchId); // Eliminar el toque que terminó

                // Soltar el botón solo si no quedan más toques activos para este botón
                if (this.activeTouches.size === 0) 
                {
                	
                    if (!this.disabled) this.#pressed = false;
                    this.img = this.texture_normal;
                    this.cutPosition = this.textureNormalSpriteSheet.position;
                    this.cutSize = this.textureNormalSpriteSheet.size;
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

        if (super.isInsideBounds(mouseX, mouseY)) 
        {
            if (!this.disabled) this.#pressed = true;
            this.img = this.texture_pressed;
            this.cutPosition = this.texturePressedSpriteSheet.position;
            this.cutSize = this.texturePressedSpriteSheet.size;
            if (this.is_action_pressed && !this.disabled) this.is_action_pressed(); // Ejecutar acción
        }
    }

    handleMouseUp(event) 
    {
        const rect = uiCanvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        if (super.isInsideBounds(mouseX, mouseY)) 
        {
            if (!this.disabled) this.#pressed = false;
            this.img = this.texture_normal;
            this.cutPosition = this.textureNormalSpriteSheet.position;
            this.cutSize = this.textureNormalSpriteSheet.size;
            if (this.is_action_released && !this.disabled) this.is_action_released(); // Ejecutar acción al soltar
        }
    }
}