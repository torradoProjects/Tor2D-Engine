import {GameObject, Vector2} from "./Import.js"; 
import {debugs, bufferCtx} from "./Variables.js";
export  class BoxCollider extends GameObject
{
    constructor(name = "undefined", position = new Vector2(), size = new Vector2(), layer = 0, mask = [], type = "undefined")
    {
        super(name, position, size);
        this.collision_layer = layer;
        this.mask = Array.isArray(mask) ? mask: Number.isInteger(mask) ? [mask] : [0];
        this.color = "rgba(0, 0, 230, 0.4)";
        this.type = type || "Trigger";
        this.visible = debugs;
        this.layer = 10;
        this.borderLeft = this.position.x;
        this.borderRight = this.position.x + this.size.x;
        this.borderUp = this.position.y;
        this.borderDown = this.position.y + this.size.y;
    }
    updateBorder()
    {
        this.borderLeft = this.position.x;
        this.borderRight = this.position.x + this.size.x;
        this.borderUp = this.position.y;
        this.borderDown = this.position.y + this.size.y;
    }
    set_collision_mask(value)
    {
        if (!Number.isInteger(value)) 
        {
            console.error("El parametro en el metodo 'set_collision_mask' no es valido.");
            return;
        }
        this.mask.forEach(mask => {
            if (value === mask)
            {
                console.error(`La mascara ${value} ya existe en el objeto de colision ${this.name}\n`);
                console.warn("El método set_collision_mask solo debe ser usado dentro de la función ready.");
                return; 
            }
        });
        this.mask.push(mask);
    }
    Render()
    {
        bufferCtx.fillStyle = this.color;
        bufferCtx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
        super.Render();
    }
    bodyEnter(obj)
    {
        if (this.borderRight >= obj.borderLeft && this.borderLeft <= obj.borderRight &&
            this.borderDown >= obj.borderUp && this.borderUp <= obj.borderDown) return true;
        else return false;
    }
}