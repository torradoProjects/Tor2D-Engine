import { Vector2, SpriteSheet } from "./Import.js";
import { uiCtx, currentScene } from "./Variables.js";
export class Texture 
{
    #rotation;
    constructor(name = "undefined", position = new Vector2(), size = new Vector2(), path = "undefined") 
    {
        this.name = typeof name === "string" ? name : "indefinido";
        this.position = position instanceof Vector2 ? position : new Vector2();
        this.size = size instanceof Vector2 ? size : new Vector2();
        this.scale = 1;
        this.visible = true;
        this.layer = 0;
        this.child = [];
        this.img = new Image();
        this.img.src = typeof path === "string" ? path : "";
        this.path = path instanceof SpriteSheet ? path: null;
        if (this.path !== null) this.img.src = this.path.img.src;
        this.flip_h = false;
        this.flip_v = false;
        this.#rotation = 0;  
        this.color = null;
        this.alpha = 1;
    }
    scaler()
    {
        if (this.scale < 1)
        {
            this.size = this.size.multiply(this.scale);
            this.scale = 1;
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
    add_child(obj) 
    {
        this.child.forEach(child => {
            if (child.name === obj.name) 
            {
                console.error(`El objeto ${obj.name} ya existe.`);
                return;
            }
        });

        let pos = this.position.add(obj.position);
        obj.position = pos;
        this.child.push(obj);
    }
    Render() 
    {
        // escalar
        this.scaler();
        uiCtx.save();  // Guardar el estado actual del contexto
        uiCtx.globalAlpha = this.alpha; // Aplicar transparencia
        // Trasladar el origen a la posición de la textura para aplicar la rotación
        uiCtx.translate(this.position.x + this.size.x / 2, this.position.y + this.size.y / 2);

        // Aplicar la rotación
        uiCtx.rotate(this.#rotation);

        // Aplicar transformación de volteo si flip_h o flip_v son verdaderos
        if (this.flip_h || this.flip_v) 
        {
            uiCtx.scale(this.flip_h ? -1 : 1, this.flip_v ? -1 : 1);
        }

        if (this.path !== null)
        {
            uiCtx.drawImage(this.img, this.path.position.x, this.path.position.y, this.path.size.x, this.path.size.y, -this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y);
        } else
        {
            uiCtx.drawImage(this.img, -this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y);
        }
        

        // Aplicar color de superposición si se ha especificado
        if (this.color) {
            uiCtx.globalCompositeOperation = "source-atop"; // Mezcla el color con la imagen
            uiCtx.fillStyle = this.color;
            uiCtx.fillRect(-this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y);
            uiCtx.globalCompositeOperation = "source-over"; // Restaurar a la operación predeterminada
        }

        uiCtx.globalAlpha = 1; // Restaurar la transparencia original
        uiCtx.restore();  // Restaurar el estado original del contexto

        // Renderizar todos los hijos
        if (this.child.length > 0) 
        {
            this.child.sort((a, b) => a.layer - b.layer); // Ordena el array de menor a mayor teniendo en cuenta el layer
            for (let obj of this.child) 
            {
                if (obj.Render != undefined && obj.visible) obj.Render(); // Renderiza uno a uno
            }
        }
    }
}
