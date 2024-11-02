import {BaseButton} from "./Import.js";
export  class Button extends BaseButton
{
	#rotation;
	constructor(name, position, size, color, borderColor, pressedColor)
	{
		super(name, position, size);
		this.color = color || "white"; // Color normal
        this.borderColor = borderColor || "black"; // Color del borde
        this.pressedColor = pressedColor || "grey"; // Color cuando el botón está presionado
		this.#rotation = 0;
	}
}