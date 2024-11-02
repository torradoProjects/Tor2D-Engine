import { Time } from "./Import.js";
import { currentScene } from "./Variables.js";
export class Timer // crea un objeto astracto de tiempo
{
    #wait = 0;
	constructor(time) // tiempo que espera antes de ejecutar la funcion
	{
		this.time = time;
		this.#wait = 0;
		this.loop = true;
		this.play = false;
		this.time_finish = false;
	}
	process()
	{
		if (currentScene.pause) return;
		if (this.#wait < this.time && this.play)
		{
			this.#wait += Time.deltaTime();
		} else 
		{
			if (!this.time_finish) 
			{
				this.func();
				this.time_finish = true;
			}
			if (this.loop) 
			{
				this.#wait = 0;
				this.time_finish = false;
			}
		}
	}
	func(){} // funcion vacia que es remplazada por la del usuario
	start(func) // inicia el tiempo y al final ejecuta la funcion dada
	{
		if (!this.play)
		{
			this.func = func;
			this.play = true;
		}
	}
	stop() // detiene la cuenta regresiva 
	{
		if (this.play)
		{
			this.#wait = 0;
		}
	}
}