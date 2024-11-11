import {Particle, Vector2} from "./Import.js";
import { currentScene } from "./Variables.js";
export class ParticleSystem
{
    constructor(position = new Vector2(), numParticles = 1, color = "white") // posicion y color de las particulas
    {
        this.position = position;
        this.localPosition = position;
        this.visible = true;
        this.particles = []; // Array para almacenar partículas
        this.color = color;
        this.nomberParticles = numParticles;
    }
    emit() // Método para agregar nuevas partículas
    {
        if (this.visible && !currentScene.pause)
        {
            for (let i = 0; i < this.nomberParticles; i++) 
            { 
                this.particles.push(new Particle(this.position, this.color));
            }
        }
    }
    process()
    {
        if (currentScene.pause) return;
        this.particles = this.particles.filter(p => !p.isDead()); // Eliminar partículas muertas
        this.particles.forEach(p => p._process()); // Actualizar cada partícula
    }
    Render()
    {
        this.particles.forEach(p => { // recorre los objetos
            if (p.Render && p.visible) p.Render(); // renderiza cada uno de ellos
        }); 
    }
    globalPosition(parentPosition = new Vector2()) // ancla esta posicion a la del padre
    {
        this.position = parentPosition.add(this.localPosition);
    }
}