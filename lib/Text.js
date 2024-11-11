import { Label, Vector2 } from "./Import.js"; 
import { bufferCtx, currentScene } from "./Variables.js";
export class Text extends Label 
{
    #rotation;
    constructor(text = "undefined", position = new Vector2(), size = 50, font = "Arial", color = "white") 
    {
        super(text, position, size, font, color);
        this.localPosition = position;
        this.#rotation = 0; 
    }
    setRotation(grados) 
    {
        if (currentScene.pause) return;
        this.#rotation = Number.isInteger(grados) ? grados * (Math.PI / 180) : 0; 
    }

    Render() 
    {
        bufferCtx.save();  // Guardar el estado actual del contexto

        // Establecer la fuente para medir el ancho del texto
        bufferCtx.font = `${this.size} ${this.font}`;
        const textWidth = bufferCtx.measureText(this.text).width;
        const textHeight = parseInt(this.size);  // Convertir el tamaño del texto a número

        // Trasladar al centro del texto
        bufferCtx.translate(this.position.x + textWidth / 2, this.position.y + textHeight / 2);

        // Aplicar la rotación
        bufferCtx.rotate(this.#rotation);

        // Dibujar el texto centrado en (0, 0)
        bufferCtx.textBaseline = "middle";
        bufferCtx.textAlign = "center";
        bufferCtx.fillStyle = this.color;
        bufferCtx.fillText(this.text, 0, 0);  // Dibuja en (0, 0) tras la traslación

        bufferCtx.restore();  // Restaurar el estado original del contexto
    }

    globalPosition(parentPosition = new Vector2()) 
    {
        this.position = parentPosition.add(this.localPosition);
    }
}