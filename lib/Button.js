import {BaseButton, Vector2} from "./Import.js"; 
export  class Button extends BaseButton
{
	#rotation;
	constructor(name = "undefind", position = new Vector2(), size = new Vector2(), color = "white", borderColor = "black", pressedColor = "grey")
	{
		super(name, position, size);
		this.color = color; // Color normal
        this.borderColor = borderColor; // Color del borde
        this.pressedColor = pressedColor; // Color cuando el botón está presionado
		this.#rotation = 0;
	}
}