import { Vector2 } from "./Import.js";
export class SpriteSheet
{
    constructor(name = "undefined", position = new Vector2(), frames = new Vector2(), pixels = new Vector2(), pathImage = "undefined")
    {
        try {
            this.name = name;
    
            // Validar y asignar position, frames y pixels
            if (!(position instanceof Vector2) || !(frames instanceof Vector2) || !(pixels instanceof Vector2)) {
                throw new Error("Los parámetros 'position', 'frames' y 'pixels' deben ser instancias de Vector2.");
            }
    
            this.position = new Vector2(position.x * pixels.x, position.y * pixels.y);
            this.size = new Vector2(frames.x * pixels.x, frames.y * pixels.y);
    
            // Crear la imagen y asignar el src
            this.img = new Image();
            if (typeof pathImage === "string" && pathImage !== "undefined") {
                this.img.src = pathImage;
            } else {
                throw new Error("El parámetro 'pathImage' no es una cadena de texto válida.");
            }
    
            // Manejador de error de carga de la imagen
            this.img.onerror = () => {
                console.error(`No se pudo cargar la imagen: ${pathImage}`);
                this.img = null; // Asignar null si falla la carga
            };
    
            this.frames = pixels;
        } catch (error) {
            console.error(`Error en el constructor: ${error.message}`);
            this.name = "undefined";
            this.position = new Vector2();
            this.size = new Vector2();
            this.img = null;
            this.frames = new Vector2();
        }
    }
    
}