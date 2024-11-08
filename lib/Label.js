import {Vector2, random} from "./Import.js";
import {uiCtx, currentScene} from "./Variables.js";
export class Label 
{
    #rotation;
    constructor(text, position, size, font, color) 
    {
        let rand = random(position.x+ position.y+ size, 10000);
        this.name = `${rand}`;
        this.text = typeof text === "string" ? text : "";
        this.font = typeof font === "string" ? font : "Arial";
        this.position = position instanceof Vector2 ? position : new Vector2();
        this.size = Number.isInteger(size) ? size + "px" : "10px";
        this.color = typeof color === "string" ? color : "blue";
        this.visible = true;
        this.layer = 0;
        this.#rotation = 0; 
    }
    setRotation(grados)
    {
        if (currentScene.pause) return;
        this.#rotation = Number.isInteger(grados) ? grados * (Math.PI / 180): 0;
    }
    Render() 
    {

        uiCtx.save(); // Guardar el estado actual del contexto

        // Establecer la fuente para medir el ancho del texto
        uiCtx.font = `${this.size} ${this.font}`;
        const textWidth = uiCtx.measureText(this.text).width;

        // Trasladar el origen al centro del texto
        uiCtx.translate(this.position.x + textWidth / 2, this.position.y + parseInt(this.size) / 2);

        // Aplicar la rotación
        uiCtx.rotate(this.#rotation);

        // Dibujar el texto centrado
        uiCtx.textBaseline = "middle";
        uiCtx.textAlign = "center";
        uiCtx.fillStyle = this.color;
        uiCtx.fillText(this.text, 0, 0); // Dibuja en (0, 0) después de la traslación y rotación

        uiCtx.restore(); // Restaurar el estado original del contexto
    }
}