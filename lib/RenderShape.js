import {GameObject, Vector2} from "./Import.js";
import { bufferCtx, currentScene} from "./Variables.js";
export class RenderShape extends GameObject 
{
    #rotation;
    constructor(name = "undefind", position = new Vector2(), size = new Vector2(), shape = "Rectangle", color = "white") 
    {
        super(name, position, size);
        this.shape = shape;
        this.color = color;
        this.#rotation = 0; 
    }
    setRotation(grados)
    {
        if (currentScene.pause) return;
        this.#rotation = Number.isInteger(grados) ? grados * (Math.PI / 180): 0;
        this.child.forEach(obj => {
            if (typeof obj.setRotation === "function") obj.setRotation(grados);
        });
    }
    Render() 
    {
        super.scaler(); // se escala
        bufferCtx.save(); // Guardar el estado actual del contexto

        // Trasladar al centro de la forma para aplicar la rotación
        bufferCtx.translate(this.position.x + this.size.x / 2, this.position.y + this.size.y / 2);

        // Aplicar la rotación
        bufferCtx.rotate(this.#rotation);

        // Dibujar la forma según su tipo, centrada en el punto de referencia
        switch (this.shape) 
        {
            case "Rectangle":
                {
                    bufferCtx.fillStyle = this.color;
                    bufferCtx.fillRect(-this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y);
                }
                break;
            case "Circle":
                {
                    let radio = this.size.x / 2;
                    bufferCtx.beginPath();
                    bufferCtx.arc(0, 0, radio, 0, Math.PI * 2);
                    bufferCtx.closePath();
                    bufferCtx.fillStyle = this.color;
                    bufferCtx.fill();
                }
                break;
            case "Triangle":
                {
                    bufferCtx.beginPath();
                    bufferCtx.moveTo(0, -(Math.sqrt(3) / 2) * this.size.x / 2);
                    bufferCtx.lineTo(-this.size.x / 2, (Math.sqrt(3) / 2) * this.size.x / 2);
                    bufferCtx.lineTo(this.size.x / 2, (Math.sqrt(3) / 2) * this.size.x / 2);
                    bufferCtx.closePath();
                    bufferCtx.fillStyle = this.color;
                    bufferCtx.fill();
                }
                break;
        }

        bufferCtx.restore(); // Restaurar el estado original del contexto

        super.Render(); // Renderiza los hijos si los tiene
    }
}
