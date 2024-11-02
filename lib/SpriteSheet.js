import { Vector2 } from "./Import.js";
export class SpriteSheet
{
    constructor(name, position, frames, pixels, pathImage)
    {
        this.name = name;
        this.position = new Vector2(position.x * pixels.x, position.y * pixels.y);
        this.size = new Vector2(frames.x * pixels.x, frames.y * pixels.y);
        this.img = new Image();
        this.img.src = pathImage;
        this.frames = pixels;
    }
    
}