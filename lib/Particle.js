import { Vector2 } from "./Import.js";
import {bufferCtx, currentScene} from "./Variables.js";
export class Particle 
{
    constructor(position, color) // posicion y color de la particula
    {
        this.position = new Vector2(position.x, position.y);
        this.vx = (Math.random() - 0.5) * 2; // Velocidad en x (aleatoria)
        this.vy = (Math.random() - 0.5) * 2; // Velocidad en y (aleatoria)
        this.life = 100; // Vida útil de la partícula
        this.size = Math.random() * 3 + 1; // Tamaño aleatorio
        this.color = color ? `rgba(${color}, ${this.life / 100})` : `rgba(255, 255, 255, ${this.life / 100})`;
        this.visible = true;
    }
    _process()
    {
        if (currentScene.pause) return;
        this.position.x += this.vx; // Mover en x
        this.position.y += this.vy; // Mover en y
        this.life -= 1;    // Reducir vida
    }
    Render() // renderiza un circulo
    {
        bufferCtx.beginPath();
        bufferCtx.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2);
        bufferCtx.fillStyle = this.color;
        bufferCtx.fill();
        bufferCtx.closePath();
    }
    isDead() // Comprobar si la partícula está muerta
    {
        return this.life <= 0;
    }
}