import {_object, Vector2, Camera} from "./Import.js";
import { bufferCanvas, currentScene } from "./Variables.js";

export  class AudioPlayer extends _object 
{
    #isPlay;
    #isStop;
    constructor(name = "undefined", audio = "undefined", loop = false) 
    {
        super(name, new Vector2());
        try {
            this.sound = new Audio(audio);
            this.sound.volume = 1.0; // Volumen inicial
            this.sound.loop = loop;
        } catch (error) {
            console.error(`Error al crear el audio '${audio}':`, error.message);
            this.sound = null; // Asignar null para evitar errores posteriores
        }
        this.#isPlay = false;
        this.#isStop = false;
    }
    setLoop(loop) 
    {
        this.sound.loop = loop; // Cambia el estado del loop dinámicamente
    }
    globalPosition(parentPosition = new Vector2()) 
    {
        this.position = parentPosition.add(this.localPosition);
    }

    play() 
    {
        if (!this.#isPlay && this.isVisible() && !currentScene.pause || !this.sound.loop && this.isVisible() && !currentScene.pause)
        {
            let scene = currentScene;
            if (scene)
            {
                let audio = scene.audios.find(audio => audio.name === this.name);
                if (audio)
                {
                    this.sound.play().catch((error) => {
                        console.error("Error al reproducir audio:", error);
                    });
                    this.#isPlay = true;
                    this.#isStop = false;
                } else console.error(`El objeto ${this.name} deve ser añadido a la Escena o a un objeto para que se pueda reproducir.`);
            } 
        }
    }
    stop() 
    {
        if (!this.#isStop)
        {
            this.sound.pause();
            this.sound.currentTime = 0; // Reiniciar el audio
            this.#isStop = true;
            this.#isPlay = false;
        }
    }
    isVisible()
    {
        return (this.position.x >= Camera.position.x  && this.position.x <= Camera.position.x + (bufferCanvas.width / Camera.zoomLevel) + 200 &&
            this.position.y >= Camera.position.y  && this.position.y <= Camera.position.y + (bufferCanvas.height / Camera.zoomLevel) + 200);
    }
    _process() 
    {
        // retorna si el sonido no se esta reproduciendo
        if (!this.#isPlay) return;

        if (currentScene.pause) 
        {
            this.stop();
            return;
        }
        
        // Verifica si el audio está en el área visible de la cámara
        if (this.isVisible()) 
        {
            
            // Obtener el centro de la cámara
            let cameraCenterX = Camera.position.x + bufferCanvas.width / 2 / Camera.zoomLevel;
            let cameraCenterY = Camera.position.y + bufferCanvas.height / 2 / Camera.zoomLevel;

            // Calcular la distancia entre la posición del sonido y el centro de la cámara
            let distance = Math.sqrt(
                Math.pow(this.position.x - cameraCenterX, 2) + Math.pow(this.position.y - cameraCenterY, 2)
            );

            // Definir un radio máximo en el que el sonido empieza a ser inaudible
            let maxDistance = 500; // Ajusta este valor según sea necesario

            // Ajustar el volumen en función de la distancia (más cerca = más volumen)
            if (distance < maxDistance) 
            {
                // Volumen proporcional a la cercanía (más cerca del centro de la cámara = volumen más alto)
                let volume = 1 - (distance / maxDistance);
                this.sound.volume = Math.max(0, Math.min(volume, 1)); // Asegurarse de que el volumen esté entre 0 y 1

            } 
            else 
            {
                // Si está fuera del rango máximo, el volumen se reduce a 0
                this.sound.volume = 0;
                this.stop(); // Detener el sonido si está fuera del rango audible
            }
        } 
        else 
        {
            // Si está fuera de la vista, reducir el volumen gradualmente y detener el audio si llega a 0
            if (this.sound.volume > 0) 
            {
                this.sound.volume = Math.max(this.sound.volume - 0.01, 0.0); // Disminuir suavemente el volumen
            }
            
            // Detener el sonido si el volumen llega a 0
            if (this.sound.volume === 0 && this.#isPlay) 
            {
                this.stop();
            }
        }
    }
}