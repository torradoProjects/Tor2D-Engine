<<<<<<< HEAD
export let UI = 
{
	child: [], // array donde se guardan los objetos como (Button, TextureButton, TextureLayer, Joystick, Label)
	Render: function() // renderiza los hijos
	{
		this.child.sort((a, b) => a.layer - b.layer);
		this.child.forEach(obj => { // recorre los hijos
			if (obj.visible && obj.Render ) obj.Render(); // renderiza cada uno de los hijos
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
=======
export let UI = 
{
	child: [], // array donde se guardan los objetos como (Button, TextureButton, TextureLayer, Joystick, Label)
	Render: function() // renderiza los hijos
	{
		this.child.sort((a, b) => a.layer - b.layer);
		this.child.forEach(obj => { // recorre los hijos
			if (obj.visible && obj.Render ) obj.Render(); // renderiza cada uno de los hijos
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
>>>>>>> f5ef691cf3fe1d0dd2a7e52dcaf2fb2884fe8617
};