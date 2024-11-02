import { debugs } from "./Variables";
export let UI = 
{
	child: [], // array donde se guardan los objetos como (Button, TextureButton, TextureLayer, Joystick, Label)
	Render: function() // renderiza los hijos
	{
		this.child.forEach(obj => { // recorre los hijos
			if (obj.visible && obj.Render && obj.type === undefined) obj.Render(); // renderiza cada uno de los hijos
			else if (obj.type === "FPS" && debugs) obj.Render(); // renderiza los FPS si el debug es true
		});
	},
	Process: function() // ejecuta los procesos de los hijos
	{
		this.child.forEach(obj => { // recorre los hijos
			if (obj.process) obj.process(); // ejecuta los procesos de cada uno de los hijos
		});

	},
	add_child: function(obj) // funcion interna que añade objetos  a la interfaz
	{
		this.child.push(obj);
	}
};