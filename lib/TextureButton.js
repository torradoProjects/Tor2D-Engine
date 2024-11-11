import { BaseButton, SpriteSheet, Vector2} from "./Import.js"; 
import { uiCtx, uiCanvas, currentScene } from "./Variables.js";
export class TextureButton extends BaseButton
{
    #pressed;
    #waitPressed = false;
    #rotation;
    #waitUp;
	constructor(name = "undefined", position = new Vector2(), size = new Vector2(), texture_normal = "undefined", texture_pressed = "undefined")
	{
		try {
            // Inicialización de propiedades heredadas
            super(name, position, size);
    
            // Crear las imágenes
            this.texture_pressed = new Image();
            this.texture_normal = new Image();
            this.img = new Image();
    
            // Asignar el src de las texturas
            this.texture_pressed.src =
                typeof texture_pressed === "string" ? texture_pressed : "";
            this.texture_normal.src =
                typeof texture_normal === "string" ? texture_normal : "";
            this.img.src = typeof texture_normal === "string" ? texture_normal : "";
    
            // Manejo de SpriteSheet
            this.textureNormalSpriteSheet =
                texture_normal instanceof SpriteSheet ? texture_normal : null;
            this.texturePressedSpriteSheet =
                texture_pressed instanceof SpriteSheet ? texture_pressed : null;
    
            // Inicializar tamaño y posición de corte
            this.cutSize = new Vector2();
            this.cutPosition = new Vector2();
    
            // Asignar propiedades del SpriteSheet normal
            if (this.textureNormalSpriteSheet !== null) {
                this.img.src = texture_normal.img.src;
                this.texture_normal.src = texture_normal.img.src;
                this.cutSize = texture_normal.size;
                this.cutPosition = texture_normal.position;
            }
    
            // Asignar propiedades del SpriteSheet presionado
            if (this.texturePressedSpriteSheet !== null) {
                this.texture_pressed.src = texture_pressed.img.src;
            }
    
            // Inicialización de otras propiedades
            this.#pressed = false;
            this.#waitUp = false;
            this.activeTouches = new Set();
            this.#rotation = 0;
    
            // Manejar errores de carga de imágenes
            this.img.onerror = () => {
                console.error("Error al cargar la imagen:", this.img.src);
                this.img = null;
            };
            this.texture_normal.onerror = () => {
                console.error("Error al cargar la textura normal:", this.texture_normal.src);
                this.texture_normal = null;
            };
            this.texture_pressed.onerror = () => {
                console.error("Error al cargar la textura presionada:", this.texture_pressed.src);
                this.texture_pressed = null;
            };
        } catch (error) {
            console.error(`Error en el constructor: ${error.message}`);
    
            // Asignar valores seguros para evitar fallos
            this.texture_pressed = null;
            this.texture_normal = null;
            this.img = null;
            this.textureNormalSpriteSheet = null;
            this.texturePressedSpriteSheet = null;
            this.cutSize = new Vector2();
            this.cutPosition = new Vector2();
            this.#pressed = false;
            this.#waitUp = false;
            this.activeTouches = new Set();
            this.#rotation = 0;
        }

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
        return this.#pressed;
    }
    isDown()
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
    isUp()
    {
        if (this.#waitUp && !this.#pressed) 
        {
            this.#waitUp = false;
            return !this.#pressed;
        } else if (this.#pressed)
        {
            this.#waitUp = true;
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
        if (this.myScene !== currentScene.name) return;
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
                if (this.texturePressedSpriteSheet !== null)
                {
                    this.cutPosition = this.texturePressedSpriteSheet.position;
                    this.cutSize = this.texturePressedSpriteSheet.size;
                }
                this.activeTouches.add(touches[i].identifier); // Añadir toque único
            }
        }
    }
    handleTouchEnd(event) 
    {
        if (this.myScene !== currentScene.name) return;
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
                    if (this.textureNormalSpriteSheet !== null)
                    {
                        this.cutPosition = this.textureNormalSpriteSheet.position;
                        this.cutSize = this.textureNormalSpriteSheet.size;
                    }
                }
            }
        }
    }

    handleMouseDown(event) 
    {
        if (this.myScene !== currentScene.name) return;
        const rect = uiCanvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        if (super.isInsideBounds(mouseX, mouseY)) 
        {
            if (!this.disabled) this.#pressed = true;
            this.img = this.texture_pressed;
            if (this.texturePressedSpriteSheet !== null)
            {
                this.cutPosition = this.texturePressedSpriteSheet.position;
                this.cutSize = this.texturePressedSpriteSheet.size;
            }
        }
    }

    handleMouseUp(event) 
    {
        if (this.myScene !== currentScene.name) return;
        const rect = uiCanvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        if (super.isInsideBounds(mouseX, mouseY)) 
        {
            if (!this.disabled) this.#pressed = false;
            this.img = this.texture_normal;
            if (this.textureNormalSpriteSheet !== null)
            {
                this.cutPosition = this.textureNormalSpriteSheet.position;
                this.cutSize = this.textureNormalSpriteSheet.size;
            }
        }
    }
}