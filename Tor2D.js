/***********************************************************************************/
/*                             // TOR2D Engine //                                  */                  
/***********************************************************************************/
/* @Author TorradoProjects                                                         */
/* @Comment Version 1.0                                                  09/2024   */
/*                                                                                 */
/* Este motor de juego 2D está diseñado para juegos de plataformas sencillos,      */
/* utilizando JavaScript y HTML5 Canvas.                                           */
/* Los juegos que podrias construir con el son (RPG, PLATAFORMA, TYCOON, CASUALES) */
/*                                                                                 */
/***********************************************************************************/

//*********************************************************************************//
//                            // VARIABLES GLOBALES //                             //
//*********************************************************************************//
let SceneTree = []; // arbol de escenas 
let currentScene = undefined; // escena que se esta ejecutando        
let canvas = undefined; // canvas principal  
let ctx = undefined; // contexto del canvas principal 
let bufferCanvas = undefined;//canvas que es usado como bufer para renderizar todo 
let bufferCtx = undefined; // contexto del canvas bufer 
let uiCanvas = undefined; // canvas que contiene los objetos de la interfaz 
let uiCtx = undefined; // contexto del canvas usado como interfaz
let debugs = false; // bandera para renderizar todas las colisiones y mostrar FPS  
//*********************************************************************************//

//*********************************************************************************//
//                           // FUNCIONES GLOBALES //                              //
//*********************************************************************************//
function print(value) // muestra en consola el parametro dado
{ 
	console.log(value); 
} 

function event(event, func) // funcion para crear un evento "click, keydown"
{ 
	document.addEventListener(event, func); 
} 

function isVisible(obj) // devuelve true si el objeto es visible en la camara 
{
  return (
    obj.position.x + obj.scale.x > Camera.position.x &&
    obj.position.x < Camera.position.x + (bufferCanvas.width / Camera.zoomLevel) &&
    obj.position.y + obj.scale.y > Camera.position.y &&
    obj.position.y < Camera.position.y + (bufferCanvas.height / Camera.zoomLevel)
  );
}

function pause_scene(bool) // pausar o reanuda la escena que esta ejecutandose
{
    let scene = SceneTree.find(scene => scene.name === currentScene); // busca la escena que se esta ejecutando
    if (scene) scene.pause = bool; // modifica la variable pausa de la escena
}

function saveData(name, value) // guarda un dato en memoria (identificador, valor)
{
	localStorage.setItem(name, value);
}

function loadData(name) // carga un dato guardado en memoria (identificador)
{
	return localStorage.getItem(name);
}

function deleteData(name) // elimina un dato en memoria (identificador)
{
	localStorage.removeItem(name);
}

function deleteAllData() // elimina todos los datos guardados en memoria
{
	localStorage.clear();
}

function lerp(start, end, amount) // Función de interpolación lineal
{
    return (1 - amount) * start + amount * end;
}
//*********************************************************************************//

//*********************************************************************************//
//                                 // TIME //                                      //
//*********************************************************************************//
let Time =
{
	delta: 0,
	lastTime: 0,
	lastUpdateFps: 0
};
//*********************************************************************************//

//*********************************************************************************//
//                                // VECTOR2 //                                    //
//*********************************************************************************//
class Vector2
{
	constructor(x, y)
	{
		this.x = x || 0; 
		this.y = y || 0;
	}
	add(other) // suma dos vectores y devuelve un vector
	{
		return new Vector2(this.x + other.x, this.y + other.y);
	}
	length() // calcula la longitud de un vector 
	{
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
	normalize() // normaliza el vector manteniendo su direccion
	{
        let length = this.length();
        return length !== 0 ? this.split(length) : new Vector2(0, 0);
    }
    multiply(scalar) // multiplica el vector por un valor y devuelve un nuevo vector.
    {
        return new Vector2(this.x * scalar, this.y * scalar);
    }
    split(value) // divide el vector por el valor 
    {
    	return new Vector2(this.x / value, this.y / value);
    }
    subtract(other) // se le resta un vector y devuelve un nuevo vector.
    {
    	return new Vector2(this.x - other.x, this.y - other.y);
    }
}
//*********************************************************************************//

//*********************************************************************************//
//                               // CAMERA //                                      //
//*********************************************************************************//
let Camera = {
    position: new Vector2(0, 0), // posicion inicial de la camara
    canvas: bufferCanvas, // canvas donde se aplicaran las transformaciones
    target: undefined, // objeto que seguira la camara
    followSpeed: 0.05, // Menor valor para un seguimiento más suave
    boundaryX: 0, // Límites en X donde empieza a seguir al objeto asignado
    boundaryY: 0,  // Límites en Y donde empieza a seguir al objeto asignado
    zoomLevel: 1,  // Nivel de zoom (1 = normal)
    child: [], // hijos de la camara para renderizar y mantener en camara (ParallaxBackgrounds)
    moveX: 0, // indica si la camara se esta moviendo y a que direccion en el eje X
    moveY: 0, // indica si la camara se esta moviendo y a que direccion en el eje Y
    follow: function(target, boundaryX, boundaryY) // asigna el objeto que seguira la camara
    {
        if (this.target !== target) // si el objeto es diferente al ya asignado
        {
        	this.boundaryX = boundaryX <= 100 ? boundaryX: 100; //establece un margen de seguimiento de 100 pixeles en el eje X
        	this.boundaryY = boundaryY <= 100 ? boundaryY: 100; //establece un margen de seguimiento de 100 pixeles en el eje Y
        	this.target = target; // asigna el objeto dado como parametro
        }
    },
    applyTransformation: function() // aplica una transformacion en el bufferCanvas para simular una camara
    {
        // Distancia desde el centro de la cámara hasta el target
        let offsetX = this.target.position.x - (this.position.x + bufferCanvas.width / 2 / this.zoomLevel);
        let offsetY = this.target.position.y - (this.position.y + bufferCanvas.height / 2 / this.zoomLevel);

        // Solo mover la cámara si el player está fuera de los límites
        if (Math.abs(offsetX) > this.boundaryX) {
        	this.moveX = this.target.velocity.x;
            this.position.x = lerp(this.position.x, this.target.position.x - bufferCanvas.width / 2 / this.zoomLevel, this.followSpeed);
        } else this.moveX = 0;

        if (Math.abs(offsetY) > this.boundaryY) {
        	this.moveY = this.target.velocity.y;
            this.position.y = lerp(this.position.y, this.target.position.y - bufferCanvas.height / 2 / this.zoomLevel, this.followSpeed);
        } else this.moveY = 0;

        // Aplicar zoom y traducir la cámara
        bufferCtx.scale(this.zoomLevel, this.zoomLevel);
        bufferCtx.translate(-this.position.x, -this.position.y);
    },
    resetTransformation: function() // resetea la transformacion del bufferCanvas por defecto
    {
        bufferCtx.setTransform(1, 0, 0, 1, 0, 0);
    },
    setZoom: function(level) // Función para ajustar el zoom
    {
        this.zoomLevel = level;
    },
    Render: function() // renderiza los hijos si los tiene
    {
    	this.child.sort((a, b) => a.layer - b.layer); // ordena el array de menor a mayor segun su layer
    	this.child.forEach(obj => { // se recorren los hijos
    		if (obj.globalPosition) obj.globalPosition(this.position); // se ancla su posicion a la de la camara
    		if (obj.visible && obj.Render) obj.Render(); // se renderiza los hijos
    	});
    },
    reset: function() // resetea la posicion de la camara y elimina el objeto asignado 
    {
        this.position = new Vector2(0, 0); // Resetea la posición al origen
        this.target = undefined; // elimina el objeto que seguia
        this.followSpeed = 0.05; // resetea el speed 
        this.boundaryX = 0; // resetea el margen de seguimiento en el eje X
        this.boundaryY = 0; // resetea el margen de seguimiento en el eje Y
        this.zoomLevel = 1; // resetea el nivel de zoom
    }
    
};
//*********************************************************************************//

//*********************************************************************************//
//                                  // UI //                                       //
//*********************************************************************************//
let UI = 
{
	child: [], // array donde se guardan los objetos como (Button, TextureButton, TextureLayer, Joystick, Label)
	Render: function() // renderiza los hijos
	{
		this.child.forEach(obj => { // recorre los hijos
			if (obj.visible && obj.Render && obj.type === undefined) obj.Render(); // renderiza cada uno de los hijos
			else if (obj.type === "FPS" && debugs) obj.Render(); // renderiza los FPS si el debug es true
		});
	},
	process: function() // ejecuta los procesos de los hijos
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
//*********************************************************************************//

//*********************************************************************************//
//                              // SPATIALGRID //                                  //
//*********************************************************************************//
class SpatialGrid 
{
    constructor(cellSize) 
    {
        this.cellSize = cellSize;  // Tamaño de cada celda
        this.grid = new Map();     // Mapa donde almacenamos objetos según su celda
    }

    getCell(position) 
    {
        const x = Math.floor(position.x / this.cellSize);
        const y = Math.floor(position.y / this.cellSize);
        return `${x},${y}`;
    }

    addToGrid(obj) 
    {
	    const topLeftCell = this.getCell(obj.position);  // Celda en la esquina superior izquierda
	    const bottomRightCell = this.getCell({
	        x: obj.position.x + obj.scale.x,
	        y: obj.position.y + obj.scale.y
	    });  // Celda en la esquina inferior derecha

	    const [startX, startY] = topLeftCell.split(',').map(Number);
	    const [endX, endY] = bottomRightCell.split(',').map(Number);

	    // Asigna el objeto a todas las celdas que ocupa
	    for (let x = startX; x <= endX; x++) 
	    {
	        for (let y = startY; y <= endY; y++) 
	        {
	            const cellKey = `${x},${y}`;
	            if (!this.grid.has(cellKey)) {
	                this.grid.set(cellKey, []);
	            }
	            this.grid.get(cellKey).push(obj);
	        }
	    }
	}

    getNearbyObjects(obj) 
    {
        const cell = this.getCell(obj.position);
        const [x, y] = cell.split(',').map(Number);

        const nearbyObjects = [];
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                const neighborCell = `${x + i},${y + j}`;
                if (this.grid.has(neighborCell)) {
                    nearbyObjects.push(...this.grid.get(neighborCell));
                }
            }
        }
        return nearbyObjects;
    }

    clearGrid() 
    {
        this.grid.clear();
    }
}
//*********************************************************************************//

//*********************************************************************************//
//                                // NUCLEO //                                     //
//*********************************************************************************//
class Tor2D 
{
	constructor(config) // resive un objeto con la configuracion (canvas, width, height, texture_filter)
	{
		document.body.style.overflow = 'hidden'; // desactiva el scroll del navegador
		this.canvas = document.getElementById(config.canvas);
		canvas = this.canvas;
		ctx = this.canvas.getContext("2d");
		this.canvas.width = config.width;
		this.canvas.height = config.height;
		this.canvas.style.background = "gray";

		// Crear buffer canvas
        bufferCanvas = document.createElement('canvas');
        bufferCtx = bufferCanvas.getContext('2d');
        bufferCanvas.width = config.width;
        bufferCanvas.height = config.height;

        // crear el UI Canvas
        uiCanvas = document.createElement('canvas');
        uiCtx = uiCanvas.getContext("2d");
        uiCanvas.width = config.width;
        uiCanvas.height = config.height;
        uiCanvas.style.position = 'absolute';
        uiCanvas.style.top = '0';
        uiCanvas.style.left = '0';
        document.body.appendChild(uiCanvas);
        
		this.currentScene = "";
		currentScene = this.currentScene;
		if (config.texture_filter != undefined) this.texture_filter = config.texture_filter; // activa o desactiva el sombreado
		else this.texture_filter = true;
		this.spatialGrid = new SpatialGrid(200); 
		this.aps = 0;
		this.fps = 0;
		this.debugFPS = new Label("FPS : "+ this.fps, new Vector2(15, 25), 20, "Arial", "black");
		this.debugs = config.debugs !== undefined ? config.debugs: false;
		debugs = this.debugs;
		this.debugFPS.type = "FPS";
		UI.add_child(this.debugFPS);
		
	}
	clear() // funcion que se encarga de borrar el lienzo cada fotograma por segundo 
	{
		bufferCtx.clearRect(0, 0, bufferCanvas.width, bufferCanvas.height);
	}
	_process() // funcion que se llama cada fotograma por segundo, es la encargada de procesar las escenas
	{
		bufferCtx.imageSmoothingEnabled = this.texture_filter;
		const currentScene = SceneTree.find(scene => scene.name === this.currentScene); // busca la escena que esta asignada a ejecutarse
        if (currentScene) 
        {
            if (currentScene.child.length > 0) 
            {
                currentScene.child.sort((a, b) => a.layer - b.layer); // ordena el array de menor a mayor segun su layer
                for (let obj of currentScene.child) 
                {
                    if (obj.move_and_slide != undefined && !currentScene.pause) obj.move_and_slide(); // se ejecuta las fisicas
                    if (obj._process != undefined && !currentScene.pause) obj._process(); // se ejecuta los procesos
                    if (obj.visible && obj.Render != undefined && isVisible(obj)) obj.Render(); // se renderiza
                }
            }
            // envia los hijos de la escena a comprobacion de coliciones
            if (currentScene.child.length > 1)
            {
            	let obj = [];
            	currentScene.child.forEach(child => {
            		if (child.collider != undefined) obj.push(child);
            	});
            	this.physics(obj);
            }
            // ejecuta el process de la escena
            if (currentScene.process && !currentScene.pause) currentScene.process(Time.delta);
            else if (currentScene.process) currentScene.process(0);
        }
	}
	physics(collider)
	{
		// Limpiar el grid antes de cada fotograma
        this.spatialGrid.clearGrid();

        // Añadir todos los objetos al grid
        collider.forEach(obj => {
            this.spatialGrid.addToGrid(obj);
        });

        // Actualizar cada objeto y verificar colisiones
        collider.forEach(obj => {
            const nearbyObjects = this.spatialGrid.getNearbyObjects(obj);

            // Verificar colisiones solo con objetos cercanos
            nearbyObjects.forEach(other => {
                if ( obj.name !== other.name ) {
                    for (let mask of obj.collider.mask)
                    {
                    	if (other.collider.collision_layer === mask) this.collision(obj.collider, other.collider);
                    }
                }
            });
        });		
	}
	collision(a, b)
	{
		// colision Trigger
		if (a.type === "Trigger")
		{
			if (a.position.x + a.scale.x >= b.position.x && a.position.x <= b.position.x + b.scale.x &&
				a.position.y + a.scale.y >= b.position.y && a.position.y <= b.position.y + b.scale.y)
			{
				b.trigger = true;
				if (a.is_trigger_enter !== undefined) a.is_trigger_enter(b.parent);
			} else if (b.trigger)
			{
				if (a.is_trigger_exit !== undefined) a.is_trigger_exit(b.parent);
				b.trigger = false;
			}
		} 
		// colision solida
		if (a.type === "CharacterBody" && b.type === "Static" ) 
		{
    		if (a.position.x + a.scale.x >= b.position.x && a.position.x <= b.position.x + b.scale.x &&
        		a.position.y + a.scale.y >= b.position.y && a.position.y <= b.position.y + b.scale.y) 
    		{
		       	// Calcula la superposición en cada eje
		        const overlapX = Math.min(a.position.x + a.scale.x - b.position.x, b.position.x + b.scale.x - a.position.x);
		        const overlapY = Math.min(a.position.y + a.scale.y - b.position.y, b.position.y + b.scale.y - a.position.y);
		        b.collisionStatic = true;
		        // Asegurarse de que la corrección respete el eje principal del objeto más largo
		        if (overlapX  < overlapY ) 
		        {
		            // Corrección horizontal
		            if (a.position.x < b.position.x) 
		            {
		            	if (a.position.x + a.scale.x > b.position.x + 2) a.parent.position.x -= 1;
		                a.parent.velocity.x = 0;
		                a.parent.slice_right = false;
		            } 
		            else 
		            {
		            	if (a.position.x < b.position.x + b.scale.x - 2) a.parent.position.x += 1;
		               	a.parent.velocity.x = 0;
		                a.parent.slice_left = false;
		            }
		        } 
		        else 
		        {
		            // Corrección vertical
		            if (a.position.y < b.position.y ) 
		            {
		            	if (a.position.y + a.scale.y > b.position.y + 2) a.parent.position.y -= 1;
		                a.parent.velocity.y = 0;
		                a.parent.slice_down = false;
		                a.parent.isFloor = true;
		            } 
		            else 
		            {
		            	if (a.position.y < b.position.y + b.scale.y - 2) a.parent.position.y += 1;
		            	a.parent.velocity.y = 0;
		            	a.parent.slice_up = false;
		            }
		        }
		        
		        
		    } else if (b.collisionStatic)
		    {
		        // Resetea los flags de colisión
				a.parent.slice_right = true;
		        a.parent.slice_left = true;
		        a.parent.slice_down = true;
		        a.parent.slice_up = true;
		        a.parent.isFloor = false;
		        b.collisionStatic = false;
		    }
		} 
		// colision Plataforma
		if (a.type === "CharacterBody" && b.type === "Plataform" ) 
		{
    		if (a.position.x + a.scale.x >= b.position.x && a.position.x <= b.position.x + b.scale.x &&
        		a.position.y + a.scale.y >= b.position.y && a.position.y <= b.position.y + b.scale.y) 
    		{
		       	// Calcula la superposición en cada eje
		        const overlapX = Math.min(a.position.x + a.scale.x - b.position.x, b.position.x + b.scale.x - a.position.x);
		        const overlapY = Math.min(a.position.y + a.scale.y - b.position.y, b.position.y + b.scale.y - a.position.y);
		        b.collisionPlataform = true;
		        // Asegurarse de que la corrección respete el eje principal del objeto más largo
		        if (overlapX  < overlapY ) 
		        {
		            // Corrección horizontal
		            if (a.position.x < b.position.x) 
		            {
		            	if (a.position.x + a.scale.x > b.position.x + 2) a.parent.position.x -= 1;
		                a.parent.velocity.x = 0;
		                a.parent.slice_right = false;
		            } 
		            else 
		            {
		            	if (a.position.x < b.position.x + b.scale.x - 2) a.parent.position.x += 1;
		               	a.parent.velocity.x = 0;
		                a.parent.slice_left = false;
		            }
		        } 
		        else 
		        {
		            // Corrección vertical
		            if (a.position.y + a.scale.y < b.position.y + (b.scale.y / 2) && a.parent.velocity.y > 0) 
		            {
		                a.parent.velocity.y = 0;
		                a.parent.slice_down = false;
		                a.parent.isFloor = true;
		            } 
		            
		        }
		        
		        
		    } else if (b.collisionPlataform)
		    {
		        // Resetea los flags de colisión
				a.parent.slice_right = true;
		        a.parent.slice_left = true;
		        a.parent.slice_down = true;
		        a.parent.slice_up = true;
		        a.parent.isFloor = false;
		        b.collisionPlataform = false;
		    }
		}
		// colision CharacterBody
		if (a.type === "CharacterBody" && b.type === "RigidBody" ) 
		{
    		if (a.position.x + a.scale.x >= b.position.x && a.position.x <= b.position.x + b.scale.x &&
        		a.position.y + a.scale.y >= b.position.y && a.position.y <= b.position.y + b.scale.y) 
    		{
		       	// Calcula la superposición en cada eje
		        const overlapX = Math.min(a.position.x + a.scale.x - b.position.x, b.position.x + b.scale.x - a.position.x);
		        const overlapY = Math.min(a.position.y + a.scale.y - b.position.y, b.position.y + b.scale.y - a.position.y);
		        b.collisionRigidBody = true;
		        // Asegurarse de que la corrección respete el eje principal del objeto más largo
		        if (overlapX  < overlapY ) 
		        {
		            // Corrección horizontal
		            if (a.position.x < b.position.x) 
		            {
		            	a.parent.slice_right = false;
		            	b.parent.friction = 0.9;
		            	b.parent.velocity.x = (b.parent.velocity.x + Math.abs(a.parent.velocity.x / 4)) * b.parent.friction;
		            	
		            } 
		            else 
		            {
		                a.parent.slice_left = false;
		                b.parent.friction = 0.9;
		            	b.parent.velocity.x = (b.parent.velocity.x - Math.abs(a.parent.velocity.x / 4)) * b.parent.friction;
		            }
		        } 
		        else 
		        {
		            // Corrección vertical
		            if (a.position.y < b.position.y ) 
		            {
		            	if (a.position.y + a.scale.y > b.position.y + 2) a.parent.position.y -= 1;
		                a.parent.velocity.y = 0;
		                a.parent.slice_down = false;
		                a.parent.isFloor = true;
		            } 
		            else 
		            {
		            	if (a.position.y < b.position.y + b.scale.y - 2) a.parent.position.y += 1;
		            	a.parent.velocity.y = 0;
		            	a.parent.slice_up = false;
		            }
		            
		        }
		        
		        
		    } else if (b.collisionRigidBody)
		    {
		        // Resetea los flags de colisión
				a.parent.slice_right = true;
		        a.parent.slice_left = true;
		        a.parent.slice_down = true;
		        a.parent.slice_up = true;
		        a.parent.isFloor = false;
		        b.collisionRigidBody = false;
		    }
		}
		// colision statica con  rigidBody
		if (a.type === "RigidBody" && b.type === "Static") 
		{
    		if (a.position.x + a.scale.x >= b.position.x && a.position.x <= b.position.x + b.scale.x &&
        		a.position.y + a.scale.y >= b.position.y && a.position.y <= b.position.y + b.scale.y) 
    		{
		       	// Calcula la superposición en cada eje
		        const overlapX = Math.min(a.position.x + a.scale.x - b.position.x, b.position.x + b.scale.x - a.position.x);
		        const overlapY = Math.min(a.position.y + a.scale.y - b.position.y, b.position.y + b.scale.y - a.position.y);
		        b.rigidBody = true;
		        // Asegurarse de que la corrección respete el eje principal del objeto más largo
		        if (overlapX  < overlapY ) 
		        {
		            // Corrección horizontal
		            if (a.position.x < b.position.x) 
		            {
		            	if (a.position.x + a.scale.x > b.position.x + 2) a.parent.position.x -= 1;
		                a.parent.velocity.x = 0;
		                a.parent.slice_right = false;
		            } 
		            else 
		            {
		            	if (a.position.x < b.position.x + b.scale.x - 2) a.parent.position.x += 1;
		               	a.parent.velocity.x = 0;
		                a.parent.slice_left = false;
		            }
		        } 
		        else 
		        {
		            // Corrección vertical
		            if (a.position.y < b.position.y ) 
		            {
		            	if (a.position.y + a.scale.y > b.position.y + 2) a.parent.position.y -= 1;
		                a.parent.velocity.y = 0;
		                a.parent.slice_down = false;
		                a.parent.isFloor = true;
		            } 
		            else 
		            {
		            	if (a.position.y < b.position.y + b.scale.y - 2) a.parent.position.y += 1;
		            	a.parent.velocity.y = 0;
		            	a.parent.slice_up = false;
		            }
		        }
		        
		        
		    } else if (b.rigidBody)
		    {
		        // Resetea los flags de colisión
				a.parent.slice_right = true;
		        a.parent.slice_left = true;
		        a.parent.slice_down = true;
		        a.parent.slice_up = true;
		        a.parent.isFloor = false;
		        b.rigidBody = false;
		    }
		} 
		// colision rigiBody con plataforma
		if (a.type === "RigidBody" && b.type === "Plataform" ) 
		{
    		if (a.position.x + a.scale.x >= b.position.x && a.position.x <= b.position.x + b.scale.x &&
        		a.position.y + a.scale.y >= b.position.y && a.position.y <= b.position.y + b.scale.y) 
    		{
		       	// Calcula la superposición en cada eje
		        const overlapX = Math.min(a.position.x + a.scale.x - b.position.x, b.position.x + b.scale.x - a.position.x);
		        const overlapY = Math.min(a.position.y + a.scale.y - b.position.y, b.position.y + b.scale.y - a.position.y);
		        b.plataform = true;
		        // Asegurarse de que la corrección respete el eje principal del objeto más largo
		        if (overlapX  < overlapY ) 
		        {
		            // Corrección horizontal
		            if (a.position.x < b.position.x) 
		            {
		            	if (a.position.x + a.scale.x > b.position.x + 2) a.parent.position.x -= 1;
		                a.parent.velocity.x = 0;
		                a.parent.slice_right = false;
		            } 
		            else 
		            {
		            	if (a.position.x < b.position.x + b.scale.x - 2) a.parent.position.x += 1;
		               	a.parent.velocity.x = 0;
		                a.parent.slice_left = false;
		            }
		        } 
		        else 
		        {
		            // Corrección vertical
		            if (a.position.y + a.scale.y < b.position.y + (b.scale.y / 2) && a.parent.velocity.y > 0) 
		            {
		                a.parent.velocity.y = 0;
		                a.parent.slice_down = false;
		                a.parent.isFloor = true;
		            } 
		            
		        }
		        
		        
		    } else if (b.plataform)
		    {
		        // Resetea los flags de colisión
				a.parent.slice_right = true;
		        a.parent.slice_left = true;
		        a.parent.slice_down = true;
		        a.parent.slice_up = true;
		        a.parent.isFloor = false;
		        b.plataform = false;
		    }
		}

	}
	add_scene(scene) // funcion que se encarga de añadir escenas al arbol de escenas 
	{
		scene.child = []; // se añade un array donde se almacenaran todos los hijos que tendra la escena
		scene.audios = []; // se añade un array para almacenar los audios de la escena
		scene.pause = false; // variable que pausa y reanuda la escena
		scene.add_child = function(obj) // funcion que añade objetos a la escena
		{
			// añadir audios
			if (obj instanceof AudioPlayer)
			{
				scene.audios.push(obj);
				return;
			}
			// añadir ParallaxBackground a la camara
			if (obj instanceof ParallaxBackground)
			{
				Camera.child.push(obj);
				return;
			}	
		    // añadir objetos al UI
			if (obj instanceof Button || obj instanceof TextureButton || obj instanceof Joystick || obj instanceof Label ||
				obj instanceof Texture)
			{
				const child = UI.child.find(child => child.name === obj.name);
				if (child) 
				{
					console.error(`El objeto ${obj.name} ya existe, prueba cambiando su nombre.`);
					return;
				}
				UI.add_child(obj);
				return;
				
			}
			// evitar que se añada un objeto que ya existe
			const name = scene.child.find(child => child.name === obj.name);
			if (name)
			{
				console.error(`El objeto ${obj.name} ya existe como hijo de la escena ${scene.name}\n`);
	            console.warn("El método add_child solo debe ser usado dentro de la función ready.");
	            scene.pause = true;
	            return; // Salir del método si el objeto ya existe
			}

			// añade el objeto a la escena siempre y cuando no sea boxCollider, parallaxLayer o AudioPlayer
			if (!(obj instanceof BoxCollider) || !(obj instanceof ParallaxLayer) || !(obj instanceof AudioPlayer))
			{
				obj.parent = scene;
				scene.child.push(obj);
			} else 
			{
				console.error(`El objeto ${obj.name} no se puede añadir como hijo de la escena ${scene.name}\n`);
	            scene.pause = true;
	            return; 
			}

		};
		// si la escena no contiene nombre, se le asigna un numero segun el orden en el que entro al arbol de escenas
		scene.name = scene.name || SceneTree.length; 
		SceneTree.push(scene); // se añade la escena al arbol de escenas.


	}
	_loop(currentTime) // funcion que se encarga de auto llamarse haci misma cada fotograma
	{
		this.aps++;
		this.clear();
		uiCtx.clearRect(0, 0, uiCanvas.width, uiCanvas.height);
		if (Camera.target != undefined) Camera.applyTransformation(); // sigue al player si fue asignado 

        // Solo calcular Time.delta si no está en pausa
	    if (!this.currentScene.pause) 
	    {
	        // Calcula Time.delta de forma normal si no está en pausa
	        Time.delta = Math.min((currentTime - Time.lastTime) / 1000, 0.1);
	        Time.lastTime = currentTime; // Actualiza el último tiempo para el próximo frame
    	} else Time.delta = 0, Time.lastTime = 0;

        // muestra los FPS en pantalla si el debug esta activado
        if (this.debugs && currentTime - Time.lastUpdateFps >= 1000)
		{
			this.fps = this.aps;
			this.aps = 0;
			this.debugFPS.text = "FPS : "+ this.fps;
			Time.lastUpdateFps = currentTime;
		}
        
        // renderizar ParallaxBackground
        if (Camera.child.length > 0) Camera.Render();

        this._process(); // busca la escena que se esta ejecutando y procesa los hijos

        // Renderiza UI
        if (UI.child.length > 0)
        {
        	UI.Render();
        	UI.process();
        }
        if (Camera.target != undefined) Camera.resetTransformation();

        // Copiar el contenido del buffer al canvas principal
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(bufferCanvas, 0, 0);
        window.requestAnimationFrame(this._loop.bind(this));
	}
	change_scene(scene) // funcion que sirve para cambiar entre escenas
	{
		if (SceneTree.includes(scene) && this.currentScene !== scene.name) // verifica que la escena a cambiar sea diferente de la actual
		{
			Camera.child = []; // limpia los parallaxBackground de la camara
			Camera.reset(); // resetea la camara
			Camera.resetTransformation(); // resetea las transformaciones
			UI.child = []; // limpia la interfaz
			let _scene = SceneTree.find(scene => scene.name === this.currentScene); // busca la escena que esta corriendo
			if (_scene)
			{
				_scene.audios.forEach(obj => { // recorre los audios
					obj.stop(); // detiene los audios uno por uno
				});
				_scene.audios = []; // limpia el array de audios
				_scene.child = []; // limpia el array de objetos
			} 
            
            currentScene = scene.name; // asigna la nueva escena como escena en ejecucion
            this.currentScene = scene.name; // asigna a la variable local la nueva escena como escena en ejecucion
            if (scene.ready) scene.ready(); // ejecuta la funcion ready de la nueva escena una unica vez 
            
        }
		
	}
	start(scene) // funcion para iniciar el loop encargado de actualizar todo
	{
		window.addEventListener("load", ()=>{
			Input.update(); // escucha entradas de teclado
			this.add_scene(scene); // añade la escena al arbol de escenas
			currentScene = scene.name; // asigna la escena como escena en ejecucion
			this.currentScene = scene.name; // asigna la variable local como escena en ejecucion
			if (scene.ready) scene.ready(); // ejecuta la funcion ready por unica vez
			this._loop(0); // empieza el loop con un tiempo de cero
		});
	}
}
//*********************************************************************************//

//*********************************************************************************//
//                                  // TIMER //                                    //
//*********************************************************************************//
class Timer // crea un objeto astracto de tiempo
{
	constructor(time) // tiempo que espera antes de ejecutar la funcion
	{
		this.time = time;
		this.wait = 0;
		this.loop = true;
		this.play = false;
		this.time_finish = false;
	}
	_process()
	{
		if (this.wait < this.time && this.play)
		{
			this.wait += Time.delta;
		} else 
		{
			if (!this.time_finish) 
			{
				this.func();
				this.time_finish = true;
			}
			if (this.loop) 
			{
				this.wait = 0;
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
			this.wait = 0;
		}
	}
}
//*********************************************************************************//

//*********************************************************************************//
//                                   // INPUT //                                   //
//*********************************************************************************//
let Input =
{
	keys: {},
    mouse: { x: 0, y: 0, isDown: false },
    isMouseMoving: false,
    update: function()
    {
    	window.addEventListener('keydown', (e) => {
    		if (!this.keys[e.code]) {this.keys[e.code] = true; e.preventDefault();}
    	});
        window.addEventListener('keyup', (e) => {
        	if (this.keys[e.code]) {this.keys[e.code] = false; e.preventDefault();}
        }); 
        window.addEventListener('mousedown', (e) => {
        	if (!this.mouse.isDown)
        	{
        		this.mouse.isDown = true;
	            this.mouse.x = e.clientX;
	            this.mouse.y = e.clientY;
        	}
        });
        window.addEventListener('mouseup', () => {
        	if (this.mouse.isDown) this.mouse.isDown = false;
        });
        window.addEventListener('mousemove', (e) => {
            if (!this.isMouseMoving) 
            {
            	this.isMouseMoving = true; 
            	this.mouse.x = e.clientX;
            	this.mouse.y = e.clientY;
            }
        });
    },
    isKeyDown: function(keyCode) // funcion de devuelve true si una tecla fue precionada
    {
    	return !!this.keys[keyCode];
    },
    getMousePosition: function()
    {
    	return { x: this.mouse.x, y: this.mouse.y };
    },
    isMouseDown: function()
    {
    	return this.mouse.isDown;
    }
};
//*********************************************************************************//

//*********************************************************************************//
//                           // OBJETOS DE TIPO INTERFAZ //                        //
//*********************************************************************************//

//*********************************************************************************//
//                                  // LABEL //                                    //     
//*********************************************************************************//
class Label  // renderiza texto en UI
{
	constructor(text, pos, size, font, color) // texto, posicion, tamaño en pixeles, fuente del texto, color del texto
	{	
		this.text = text;
		this.font = font;
		this.position = pos;
		this.localPosition = pos;
		this.size = size + "px";
		this.color = color;
		this.visible = true;
		this.layer = 0;

	}
	Render() // renderiza el texto en la interfaz
	{
		uiCtx.font = `${this.size} ${this.font}`;
		uiCtx.fillStyle = this.color;
		uiCtx.fillText(this.text, this.position.x, this.position.y);
	}
	globalPosition(parentPosition = new Vector2()) // ancla este objeto al padre
	{
		this.position = parentPosition.add(this.localPosition);
	}
} 
//*********************************************************************************//

//*********************************************************************************//
//                                 // BUTTON BASE //                               //
//*********************************************************************************//
class BaseButton 
{
	constructor(name, pos, scale)
	{
		this.name = name;
        this.parent = null;
        this.position = pos;
        this.scale = scale;
        this.visible = true;
        this.layer = 0;
        this.child = [];
        this.color = "white"; // Color normal
        this.borderColor =  "black"; // Color del borde
        this.pressedColor =  "grey"; // Color cuando el botón está presionado
        this.isPressed = false;
        this.activeTouches = new Set(); // Para manejar múltiples toques
        this.borderRadius = 10; // Radio de los bordes redondeados
        this.shadowOffsetX = 4; // Desplazamiento de la sombra en X
        this.shadowOffsetY = 4; // Desplazamiento de la sombra en Y
        this.shadowBlur = 10; // Desenfoque de la sombra
        this.shadowColor = "rgba(0, 0, 0, 0.3)"; // Color de la sombra

        // Eventos touch
        uiCanvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
        uiCanvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
        uiCanvas.addEventListener('touchcancel', this.handleTouchEnd.bind(this));

        // Eventos mouse
        uiCanvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        uiCanvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
	}
	isVisible() 
    {
        if (this.parent && this.parent.visible) return true;
        else if (this.visible) return true;
        else return false;
    }
    Render() 
    {
        const rectColor = this.isPressed ? this.pressedColor : this.color; // Cambia el color cuando está presionado
        uiCtx.fillStyle = rectColor;

        // Agrega una sombra y borde redondeado para que se vea más como un botón
        uiCtx.save();
        uiCtx.shadowOffsetX = this.shadowOffsetX;
        uiCtx.shadowOffsetY = this.shadowOffsetY;
        uiCtx.shadowBlur = this.shadowBlur;
        uiCtx.shadowColor = this.shadowColor;

        // Dibujar botón con bordes redondeados
        this.roundRect(uiCtx, this.position.x, this.position.y, this.scale.x, this.scale.y, this.borderRadius);
        uiCtx.fill();

        // Dibujar el borde
        uiCtx.strokeStyle = this.borderColor;
        uiCtx.lineWidth = 2;
        uiCtx.stroke();
        uiCtx.restore();

        this.child.sort((a, b) => a.layer - b.layer);
        this.child.forEach(obj => {
            if (obj.Render && obj.visible) obj.Render();
        });
    }
    roundRect(ctx, x, y, width, height, radius) 
    {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }
    handleTouchStart(event) 
    {
        const touches = event.changedTouches; // Toques que cambiaron
        const rect = uiCanvas.getBoundingClientRect();

        for (let i = 0; i < touches.length; i++) 
        {
            let touchX = touches[i].clientX - rect.left;
            let touchY = touches[i].clientY - rect.top;

            // Verificar si el toque está dentro del área del botón
            if (this.isInsideBounds(touchX, touchY)) 
            {
                if (this.isVisible()) this.isPressed = true;
                this.activeTouches.add(touches[i].identifier); // Añadir toque único
                if (this.is_pressed && this.isVisible()) this.is_pressed(touches[i].identifier); // Ejecutar acción
            }
        }
    }
    handleTouchEnd(event) 
    {
        const changedTouches = event.changedTouches; // Toques que cambiaron

        for (let i = 0; i < changedTouches.length; i++) 
        {
            let touchId = changedTouches[i].identifier;

            // Solo liberar el botón si el toque que finalizó pertenece a este botón
            if (this.activeTouches.has(touchId)) 
            {
                this.activeTouches.delete(touchId); // Eliminar el toque que terminó

                // Soltar el botón solo si no quedan más toques activos para este botón
                if (this.activeTouches.size === 0) 
                {
                    if (this.isVisible()) this.isPressed = false;
                    if (this.is_released && this.isVisible()) this.is_released(); // Ejecutar acción al soltar
                }
            }
        }
    }
    handleMouseDown(event) 
    {
        const rect = uiCanvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        if (this.isInsideBounds(mouseX, mouseY)) 
        {
            if (this.isVisible()) this.isPressed = true;
            if (this.is_pressed && this.isVisible()) this.is_pressed(); // Ejecutar acción
        }
    }
    handleMouseUp(event) 
    {
        const rect = uiCanvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        if (this.isInsideBounds(mouseX, mouseY)) 
        {
            if (this.isVisible()) this.isPressed = false;
            if (this.is_released && this.isVisible()) this.is_released(); // Ejecutar acción al soltar
        }
    }
    isInsideBounds(x, y) 
    {
        return x >= this.position.x && x <= this.position.x + this.scale.x &&
               y >= this.position.y && y <= this.position.y + this.scale.y;
    }

    add_child(obj) 
    {
        if (obj instanceof Label) 
        {
            let pos = obj.position.add(this.position);
            obj.position = pos;
            this.child.push(obj);
        } else 
        {
            console.error(`El objeto ${obj.name} no se puede añadir al objeto ${this.name}.\n`);
            console.warn("El objeto permitido es: Label.");
        }
    }
}
//*********************************************************************************//

//*********************************************************************************//
//                                 // BUTTON //                                    //
//*********************************************************************************//
class Button extends BaseButton
{
	constructor(name, pos, scale, color, borderColor, pressedColor)
	{
		super(name, pos, scale);
		this.color = color || "white"; // Color normal
        this.borderColor = borderColor || "black"; // Color del borde
        this.pressedColor = pressedColor || "grey"; // Color cuando el botón está presionado
	}
}
//*********************************************************************************//

//*********************************************************************************//
//                              // TEXTUREBUTTON //                                //
//*********************************************************************************//
class TextureButton extends BaseButton
{
	constructor(name, pos, scale, texture_normal, texture_pressed)
	{
		super(name, pos, scale);
		this.texture_pressed = new Image();
		this.texture_normal = new Image();
		this.texture_pressed.src = texture_pressed;
		this.texture_normal.src = texture_normal;
		this.img = new Image();
		this.img.src = texture_normal;
		this.isPressed = false;
        this.activeTouches = new Set(); // Para manejar múltiples toques
	}
	Render() 
	{
        uiCtx.drawImage(this.img, this.position.x, this.position.y, this.scale.x, this.scale.y);
        this.child.sort((a, b) => a.layer - b.layer);
        this.child.forEach(obj => {
        	if (obj.Render && obj.visible) obj.Render();
        });
    }
    handleTouchStart(event) 
    {
        const touches = event.changedTouches; // Toques que cambiaron
        const rect = uiCanvas.getBoundingClientRect();

        for (let i = 0; i < touches.length; i++) 
        {
            let touchX = touches[i].clientX - rect.left;
            let touchY = touches[i].clientY - rect.top;

            // Verificar si el toque está dentro del área del botón
            if (touchX >= this.position.x && touchX <= this.position.x + this.scale.x &&
                touchY >= this.position.y && touchY <= this.position.y + this.scale.y) 
            {
                
                if (super.isVisible()) this.isPressed = true;
                this.img = this.texture_pressed;
                this.activeTouches.add(touches[i].identifier); // Añadir toque único
                if (this.is_pressed && super.isVisible()) this.is_pressed(touches[i].identifier); // Ejecutar acción con el identificador
            }
        }
    }
    handleTouchEnd(event) 
    {
        const changedTouches = event.changedTouches; // Toques que cambiaron

        for (let i = 0; i < changedTouches.length; i++) 
        {
            let touchId = changedTouches[i].identifier;

            // Solo liberar el botón si el toque que finalizó pertenece a este botón
            if (this.activeTouches.has(touchId)) {
                this.activeTouches.delete(touchId); // Eliminar el toque que terminó

                // Soltar el botón solo si no quedan más toques activos para este botón
                if (this.activeTouches.size === 0) 
                {
                	
                    if (super.isVisible()) this.isPressed = false;
                    this.img = this.texture_normal;
                    if (this.is_released && super.isVisible()) this.is_released(); // Ejecutar acción al soltar
                }
            }
        }
    }

    handleMouseDown(event) 
    {
        const rect = uiCanvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        if (super.isInsideBounds(mouseX, mouseY)) 
        {
            if (super.isVisible()) this.isPressed = true;
            this.img = this.texture_pressed;
            if (this.is_pressed && super.isVisible()) this.is_pressed(); // Ejecutar acción
        }
    }

    handleMouseUp(event) 
    {
        const rect = uiCanvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        if (super.isInsideBounds(mouseX, mouseY)) 
        {
            if (super.isVisible()) this.isPressed = false;
            this.img = this.texture_normal;
            if (this.is_released && super.isVisible()) this.is_released(); // Ejecutar acción al soltar
        }
    }
}
//*********************************************************************************//

//*********************************************************************************//
//                                // JOYSTICK //                                   //
//*********************************************************************************//
class Joystick extends TextureButton 
{
    constructor(name, pos, scale, texture_outer, texture_inner, maxDistance = 50) 
    {
        super(name, pos, scale, texture_outer, texture_outer);
        this.texture_inner = new Image();
        this.texture_inner.src = texture_inner;

        this.axisX = 0;
        this.axisY = 0;
        this.center = { x: this.position.x + this.scale.x / 2, y: this.position.y + this.scale.y / 2 };
        this.maxDistance = maxDistance;
        this.innerPos = { x: this.center.x, y: this.center.y };

        // Añadir evento touchmove para capturar el movimiento
        uiCanvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
    }

    // No se ajusta a la posición de la cámara, solo se renderiza en coordenadas fijas de la pantalla
    Render() 
    {
        // Renderizar el aro exterior (fondo del joystick)
        uiCtx.drawImage(this.img, this.position.x, this.position.y, this.scale.x, this.scale.y);

        // Renderizar el círculo interior
        uiCtx.drawImage(
            this.texture_inner,
            this.innerPos.x - this.scale.x / 4,
            this.innerPos.y - this.scale.y / 4,
            this.scale.x / 2,
            this.scale.y / 2
        );

        // Renderizar los hijos si existen
        this.child.sort((a, b) => a.layer - b.layer);
        this.child.forEach(obj => {
            if (obj.Render && obj.visible) obj.Render();
        });
    }
    handleTouchMove(event) 
    {
        const touches = event.changedTouches;
        const rect = uiCanvas.getBoundingClientRect();

        for (let i = 0; i < touches.length; i++) 
        {
            let touchX = touches[i].clientX - rect.left;
            let touchY = touches[i].clientY - rect.top;

            if (this.isPressed && this.activeTouches.has(touches[i].identifier)) 
            {
                let deltaX = touchX - this.center.x;
                let deltaY = touchY - this.center.y;

                let distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                if (distance > this.maxDistance) {
                    let ratio = this.maxDistance / distance;
                    deltaX *= ratio;
                    deltaY *= ratio;
                }

                this.innerPos.x = this.center.x + deltaX;
                this.innerPos.y = this.center.y + deltaY;

                this.axisX = deltaX / this.maxDistance;
                this.axisY = deltaY / this.maxDistance;

                if (this.onMove) this.onMove(this.axisX, this.axisY);
            }
        }
    }
    handleTouchEnd(event) 
    {
        super.handleTouchEnd(event);

        if (this.activeTouches.size === 0) 
        {
            this.innerPos.x = this.center.x;
            this.innerPos.y = this.center.y;
            this.axisX = 0;
            this.axisY = 0;
        }
    }
}
//*********************************************************************************//

//*********************************************************************************//
//                                  // TEXTURE //                                  //
//*********************************************************************************//
class Texture   
{
    constructor(name, pos, scale, path) // renderiza una imagen o textura en pantalla
    {
        this.name = name;
        this.position = pos;
        this.scale = scale;
        this.visible = true;
        this.layer = 0;
        this.child = [];
        this.img = new Image();
        this.img.src = path;
        this.flip_h = false;
        this.flip_v = false;
    }
    add_child(obj)
    {
        this.child.forEach(child => {
            if (child.name === obj.name)
            {
                console.error(`El objeto ${obj.name} ya existe.`);
                return;
            }
        });

        if (obj instanceof BoxCollider || obj instanceof GameObject) // verifica que el objeto que se va a añadir no sea un objeto del mundo
        {
            console.error(`El objeto ${obj.name} no se puede añadir como hijo a un objeto de tipo Control.`);
            return;
        }
        let pos = this.position.add(obj.position);
        obj.position = pos;
        this.child.push(obj);
    }
    Render()
    {
        uiCtx.save();  // Guardar el estado actual del contexto

        // Aplicar transformación de volteo si flip_h o flip_v son verdaderos
        if (this.flip_h || this.flip_v) 
        {
            uiCtx.translate(
                this.flip_h ? this.position.x + this.scale.x : this.position.x, 
                this.flip_v ? this.position.y + this.scale.y : this.position.y
            );
            uiCtx.scale(this.flip_h ? -1 : 1, this.flip_v ? -1 : 1);
        } else 
        {
            uiCtx.translate(this.position.x, this.position.y);
        }

        // Dibujar la imagen
        uiCtx.drawImage(this.img, 0, 0, this.scale.x, this.scale.y);

        uiCtx.restore();  // Restaurar el estado original del contexto
        
        // renderizamos todos los hijos
        if (this.child.length > 0)
        {
            this.child.sort((a, b) => a.layer - b.layer); // ordena el array de menor a mayor teniedo en cuenta el layer
            for (let obj of this.child)
            {
                if (obj.Render != undefined && obj.visible) obj.Render(); // renderiza uno a uno 
            }
        }
    }
}
//*********************************************************************************//

//*********************************************************************************//
//                            // OBJETOS DEL MUNDO //                              //    
//*********************************************************************************//

//*********************************************************************************//
//                               // BASEOBJECT //                                  //
//*********************************************************************************//
class _object
{
    constructor(name, pos, scale)
    {
        this.name = name;
        this.parent = null;
        this.position = pos;
        this.localPosition = pos;
        this.scale = scale;
        this.velocity = new Vector2();
        this.visible = true;
        this.layer = 0;
        this.child = [];
    }
}
//*********************************************************************************//

//*********************************************************************************//
//                              // GAMEOBJECT //                                   //
//*********************************************************************************//
class GameObject extends _object
{
    constructor(name, pos, scale)
    {
        super(name, pos, scale);
        this.slice_right = true;
        this.slice_left = true;
        this.slice_up = true;
        this.slice_down = true;
        this.isFloor = false;
        this.collider = null;
        this.friction = 0;
    }
    is_in_floor()
    {
        return this.isFloor;
    }
    add_child(obj) 
    {
        if (obj instanceof AudioPlayer) // añade objeto AudioPlayer
        {
            let scene = SceneTree.find(scene => scene.name === currentScene);
            if (scene)
            {
                scene.audios.push(obj);
            } 
        }
        if (obj.name === this.name) // verifica que el objeto no sea el mismo
        {
            console.error(`El objeto ${obj.name} no se puede agregar a si mismo\n`);
            return; // Salir del método si el objeto ya existe
        }
        for (let child of this.child) // Verificar si el objeto ya existe entre los hijos
        {
            if (obj.name === child.name) 
            {
                console.error(`El objeto ${obj.name} ya existe como hijo de ${this.name}\n`);
                console.warn("El método add_child solo debe ser usado dentro de la función ready.");
                return; // Salir del método si el objeto ya existe
            }
        }
        if ((obj instanceof BoxCollider) && this.collider === null) // Si el objeto es una colision, se añade como colision
        {
            obj.parent = this;
            this.collider = obj;
        } else if ( obj instanceof BoxCollider) // si el objeto es una colision y ya existe una, retorna 
        {
            console.error(`El objeto ${this.name} ya tiene una colisión.`);
            return;
        } 

        // Ajustar la posición del hijo con respecto al padre y se agrega como hijo
        obj.parent = this;
        let pos = obj.position;
        obj.position = pos.add(this.position);
        this.child.push(obj);
        
    }
    destroy() // se elimina haci mismo del padre
    {
        if (this.parent != undefined )
        {
            for (let i = 0; i < this.parent.child.length; i++)
            {  
                if (this.parent.child[i].name === this.name) this.parent.child.splice(i, 1);
            }
        }
    }
    Render() // se renderiza
    {
        if (this.child.length > 0) // si tiene hijos los renderiza
        {
            this.child.sort((a, b) => a.layer - b.layer); // ordena el array de menor a mayor segun su layer
            for (let obj of this.child)
            {
                if (obj.Render != undefined && obj.visible) obj.Render(); // renderiza uno a uno
            }
        }
    }
    globalPosition(parentPosition = new Vector2()) // funcion para anclar la posicion con la del padre
    {
        this.position = parentPosition.add(this.localPosition);
    }
    move_and_slide()
    {
        // Almacena el delta para evitar repetir cálculos
        const deltaX = this.velocity.x * Time.delta;
        const deltaY = this.velocity.y * Time.delta;

        // Procesa el movimiento horizontal
        if (this.slice_right && this.velocity.x > 0) 
        {
            this.position.x += deltaX;
        } else if (this.slice_left && this.velocity.x < 0) 
        {
            this.position.x += deltaX;
        }

        // Procesa el movimiento vertical
        if (this.slice_down && this.velocity.y > 0) 
        {
            this.position.y += deltaY;
        } else if (this.slice_up && this.velocity.y < 0) 
        {
            this.position.y += deltaY;
        }

        // Aplica fricción si es necesario
        if (this.friction > 0) 
        {
            this.velocity.x *= this.friction;
            this.velocity.y *= this.friction;
        }

        // Procesa los hijos
        this._processChildren();
    }
    _processChildren() 
    {
        for (let obj of this.child) 
        {
            obj.globalPosition(this.position);
            if (typeof obj.move_and_slide === 'function') obj.move_and_slide();
            if (typeof obj._process === 'function') obj._process();
        }
    }
}
//*********************************************************************************//

//*********************************************************************************//
//                              // RENDERSHAPE //                                  //
//*********************************************************************************//
class RenderShape extends GameObject 
{
    constructor(name, pos, scale, shape, color) //renderiza formas geometricas sensillas 
    {
        super(name, pos, scale);
        this.shape = shape || "Rectangle";
        this.color = color || "white";
    }
    Render()
    {
        switch(this.shape)
        {
            case "Rectangle": // renderiza forma rectangular
                {
                    bufferCtx.fillStyle = this.color;
                    bufferCtx.fillRect(this.position.x, this.position.y, this.scale.x, this.scale.y);
                } break;
            case "Circle": // renderiza forma circular
                {
                    let radio = this.scale.x / 2;
                    let ang = 0;
                    let angEnd = Math.PI * 2;
                    bufferCtx.beginPath();
                    bufferCtx.arc(this.position.x, this.position.y, radio, ang, angEnd);
                    bufferCtx.closePath();
                    bufferCtx.fillStyle = this.color;
                    bufferCtx.fill();
                } break;
            case "Triangle": // renderiza forma triangular
                {
                    bufferCtx.beginPath();
                    bufferCtx.moveTo(this.position.x, this.position.y);
                    bufferCtx.lineTo(this.position.x + this.scale.x, this.position.y);
                    bufferCtx.lineTo(this.position.x + (this.scale.x / 2), this.position.y - (Math.sqrt(3) / 2) * this.scale.x);
                    bufferCtx.closePath();
                    bufferCtx.fillStyle = this.color;
                    bufferCtx.fill();
                } break;
        }
        super.Render(); // renderiza los hijos si los tiene
    }

}
//*********************************************************************************//

//*********************************************************************************//
//                                  // TEXT //                                     //
//*********************************************************************************//
class Text extends Label 
{
    constructor(text, pos, size, font, color) // renderiza texto en el mundo
    {   
        super(text, pos, size, font, color);
    }
    Render()
    {
        bufferCtx.font = `${this.size} ${this.font}`;
        bufferCtx.fillStyle = this.color;
        bufferCtx.fillText(this.text, this.position.x, this.position.y);
    }
} 
//*********************************************************************************//

//*********************************************************************************//
//                               // SPRITE //                                      //
//*********************************************************************************//
class Sprite extends GameObject 
{
    constructor(name, pos, scale, path) // renderiza una imagen o textura en pantalla 
    {
        super(name, pos, scale);
        this.img = new Image();
        this.img.src = path;
        this.flip_h = false;
        this.flip_v = false;
    }
    Render()
    {

        bufferCtx.save();  // Guardar el estado actual del contexto

        // Aplicar transformación de volteo si flip_h o flip_v son verdaderos
        if (this.flip_h || this.flip_v) 
        {
            bufferCtx.translate(
                this.flip_h ? this.position.x + this.scale.x : this.position.x, 
                this.flip_v ? this.position.y + this.scale.y : this.position.y
            );
            bufferCtx.scale(this.flip_h ? -1 : 1, this.flip_v ? -1 : 1);
        } else 
        {
            bufferCtx.translate(this.position.x, this.position.y);
        }

        // Dibujar la imagen
        bufferCtx.drawImage(this.img, 0, 0, this.scale.x, this.scale.y);

        bufferCtx.restore();  // Restaurar el estado original del contexto
        super.Render(); // renderiza los hijos si los tiene.
    }
}
//*********************************************************************************//

//*********************************************************************************//
//                              // SPRITESHEET //                                  //
//*********************************************************************************//
class SpriteSheet
{
    constructor(name, path, spriteW, spriteH)
    {
        this.name = name;
        this.img = new Image();
        this.img.src = path;
        this.imageWidth = 0;
        this.imageHeight = 0;
        this.spriteW = spriteW;
        this.spriteH = spriteH;
        this.loaded = false;

        this.img.onload = () => {
            this.imageWidth = this.img.width / this.spriteW;
            this.imageHeight = this.img.height / this.spriteH;
            this.loaded = true;  // Indicar que la imagen ha cargado
        };
    }
}
//*********************************************************************************//

//*********************************************************************************//
//                            // ANIMATEDSPRITE //                                 //                     
//*********************************************************************************//
class AnimatedSprite extends GameObject
{
    constructor(name, pos, scale, animations, speed) // nombre, posicion, escala, array con animaciones, velocidad 
    {
        super(name, pos, scale);
        this.flip_h = false;
        this.flip_v = false;
        this.currentAnim = "";
        this.anim = animations;
        this.x = 0;
        this.y = 0;
        this.loop = true;
        this._play = false; 
        this.speed = speed || 0.3;
        this.speedFrame = new Timer(this.speed);
        this.animation_finish = false;
    }
    wait = ()=>
    {
        if (this._play)
        {
            const  anim = this.anim.find(anim => anim.name === this.currentAnim);
            if (anim)
            {
                if (this.x < anim.img.width - anim.imageWidth)
                {
                    this.x += anim.imageWidth;
                } else if (this.y < anim.img.height - anim.imageHeight) {
                    this.y += anim.imageHeight;
                    this.x = 0;
                } else if (this.loop)
                {
                    this.x = 0;
                    this.y = 0;
                } else 
                {
                    this.animation_finish = true;
                    this.stop();
                }
            }
            
        }
    }
    Render()
    {
        const anim = this.anim.find(anim => anim.name === this.currentAnim);
        if (anim && anim.loaded)
        {
            if (anim.imageWidth === 0)
            {
                anim.imageWidth = anim.img.width / anim.spriteW;
                anim.imageHeight = anim.img.height / anim.spriteH;
            }

            bufferCtx.save();  // Guardar el estado actual del contexto

            // Aplicar transformación de volteo si flip_h o flip_v son verdaderos
            if (this.flip_h || this.flip_v) 
            {
                bufferCtx.translate(
                    this.flip_h ? this.position.x + this.scale.x : this.position.x, 
                    this.flip_v ? this.position.y + this.scale.y : this.position.y
                );
                bufferCtx.scale(this.flip_h ? -1 : 1, this.flip_v ? -1 : 1);
            } else 
            {
                bufferCtx.translate(this.position.x, this.position.y);
            }

            bufferCtx.drawImage(anim.img, this.x, this.y, anim.imageWidth, anim.imageHeight, 0, 0, this.scale.x, this.scale.y);
            bufferCtx.restore();  // Restaurar el estado original del contexto
        
        } else 
        {
            bufferCtx.save();  // Guardar el estado actual del contexto

            // Aplicar transformación de volteo si flip_h o flip_v son verdaderos
            if (this.flip_h || this.flip_v) 
            {
                bufferCtx.translate(
                    this.flip_h ? this.position.x + this.scale.x : this.position.x, 
                    this.flip_v ? this.position.y + this.scale.y : this.position.y
                );
                bufferCtx.scale(this.flip_h ? -1 : 1, this.flip_v ? -1 : 1);
            } else 
            {
                bufferCtx.translate(this.position.x, this.position.y);
            }

            bufferCtx.drawImage(this.anim[0].img, this.x, this.y, this.anim[0].imageWidth, this.anim[0].imageHeight, 0, 0, this.scale.x, this.scale.y);
            bufferCtx.restore();  // Restaurar el estado original del contexto
        }
        super.Render(); // renderiza los hijos si los tiene
    }
    _process()
    {
        this.speedFrame._process(); // procesa el objeto Timer interno
        
        if (this.animation_finish_name != undefined && this.animation_finish) // funcion que se ejecuta cuando finaliza una animacion
        {
            this.animation_finish_name(this.currentAnim);
        }
    }
    play(anim) // inicia la animacion
    {
        if (!this._play) 
        {
            if ( anim !== this.currentAnim )
            {
                this.x = 0;
                this.y = 0;
                this.speedFrame.stop();
            }
            this.currentAnim = anim;
            this.animation_finish = false;
            this._play = true;
            this.speedFrame.start(this.wait);
        }
    }
    stop() // detiene la animacion
    {
        if (this._play) this._play = false;

    }
}
//*********************************************************************************//

//*********************************************************************************//
//                          // PARALLAXBACKGROUND //                               //
//*********************************************************************************//
class ParallaxBackground 
{
    constructor(name, pos) // objeto que sigue la camara y contiene los ParallaxLayer
    {
        this.name = name;
        this.position = pos;
        this.localPosition = pos;
        this.scale = new Vector2();
        this.visible = true;
        this.layer = 0;
        this.child = [];

    }
    add_child(obj) // añade hijos de tipo ParallaxLayer
    {
        // verificar que solo se puedan añadir objetos de tipo ParallaxLayer
        if (!(obj instanceof ParallaxLayer))
        {
            console.error(`Solo se permite objetos de tipo ParallaxLayer.`);
            return;
        }
        if (obj.name === this.name) 
        {
            console.error(`No puedes añadir ${obj.name} a si mismo.`);
            return;
        }
        const child = this.child.find(child => child.name === obj.name);
        if (child)
        {
            console.error(`El objeto ${obj.name} ya existe.`);
            return;
        }

        let pos = obj.position;
        obj.position = pos.add(this.position);
        this.child.push(obj);
    }
    Render() // renderiza los hijos
    {
        this.child.sort((a, b) => a.layer - b.layer); // ordena el array de menor a mayor segun su layer
        this.child.forEach(obj => { // recorre los hijos
            if (obj.globalPosition) obj.globalPosition(this.position); // ancla los hijos a su posicion
            if (obj.visible && obj.Render) obj.Render(); // renderiza los hijos
            if (obj._process) obj._process(); // ejecuta los procesos de los hijos
        });
    }
    globalPosition(parentPosition = new Vector2()) // ancla su posicion a la del padre
    {
        this.position = parentPosition.add(this.localPosition);
    }
}
//*********************************************************************************//

//*********************************************************************************//
//                             // PARALLAXLAYER //                                 //
//*********************************************************************************//
class ParallaxLayer extends ParallaxBackground 
{
    constructor(name, pos, scale, image, moveSpeed) 
    {
        super(name, pos);
        this.scale = scale;
        this.moveSpeed = moveSpeed;
        this.img = new Image();
        this.img.src = image;
        this.speed = 0;
        this.offset = 0; // Para ajustar la posición de repetición
    }

    globalPosition(parentPosition = new Vector2()) 
    {
        this.position = parentPosition.add(this.localPosition);
    }

    Render() 
    {
        // Calculamos la posición de la imagen en base al offset
        let totalWidth = this.scale.x;
        let offsetPos = this.position.x + this.offset;
        
        // Dibujar las imágenes para cubrir todo el ancho de la pantalla
        for (let i = -1; i <= Math.ceil(bufferCanvas.width / totalWidth); i++) {
            let xPos = offsetPos + i * totalWidth;
            bufferCtx.drawImage(this.img, xPos, this.position.y, this.scale.x, this.scale.y);
        }
    }
    _process() 
    {
        if (Camera.target) 
        {
            if (Camera.moveX > 0) this.speed = -this.moveSpeed;
            else if (Camera.moveX < 0) this.speed = this.moveSpeed;
            else this.speed = 0;
            this.offset += this.speed;

            // Si la imagen se mueve completamente fuera de la pantalla, reajustamos el offset
            if (this.offset <= -this.scale.x) 
            {
                this.offset += this.scale.x;
            } else if (this.offset >= this.scale.x) 
            {
                this.offset -= this.scale.x;
            }
        }
    }
}
//*********************************************************************************//

//*********************************************************************************//
//                              // AUDIOPLAYER //                                  //
//*********************************************************************************//
class AudioPlayer extends _object 
{
    constructor(name, pos, audio, loop = false) 
    {
        super(name, pos);
        this.sound = new Audio(audio);
        this.sound.volume = 1.0; // Volumen inicial
        this.sound.loop = loop;
        this.isPlay = false;
        this.isStop = false;
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
        if (!this.isPlay && this.isVisible() || !this.sound.loop && this.isVisible())
        {
            let scene = SceneTree.find(scene => scene.name === currentScene);
            if (scene)
            {
                let audio = scene.audios.find(audio => audio.name === this.name);
                if (audio)
                {
                    this.stop();
                    this.sound.play();
                    this.isPlay = true;
                    this.isStop = false;
                } else console.error(`El objeto ${this.name} deve ser añadido a la Escena o a un objeto para que se pueda reproducir.`);
            } 
        }
    }
    stop() 
    {
        if (!this.isStop)
        {
            this.sound.pause();
            this.sound.currentTime = 0; // Reiniciar el audio
            this.isStop = true;
            this.isPlay = false;
        }
    }
    isVisible()
    {
        return (this.position.x >= Camera.position.x  && this.position.x <= Camera.position.x + (bufferCanvas.width / Camera.zoomLevel) + 200 &&
            this.position.y >= Camera.position.y  && this.position.y <= Camera.position.y + (bufferCanvas.height / Camera.zoomLevel) + 200);
    }
    _process() 
    {
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

                // Reproducir si el sonido no se está reproduciendo
                if (!this.isPlay) {
                    this.play();
                }
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
            if (this.sound.volume === 0 && this.isPlay) 
            {
                this.stop();
            }
        }
    }
}
//*********************************************************************************//

//*********************************************************************************//
//                               // PARTICLES //                                   //
//*********************************************************************************//
class Particle 
{
    constructor(pos, color) // posicion y color de la particula
    {
        this.position = new Vector2(pos.x, pos.y);
        this.vx = (Math.random() - 0.5) * 2; // Velocidad en x (aleatoria)
        this.vy = (Math.random() - 0.5) * 2; // Velocidad en y (aleatoria)
        this.life = 100; // Vida útil de la partícula
        this.size = Math.random() * 5 + 1; // Tamaño aleatorio
        this.color = color ? `rgba(${color}, ${this.life / 100})` : `rgba(255, 255, 255, ${this.life / 100})`;
        this.visible = true;
    }
    _process()
    {
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
//*********************************************************************************//

//*********************************************************************************//
//                           // PARTICLESYSTEM //                                  //
//*********************************************************************************//
class ParticleSystem
{
    constructor(pos, color) // posicion y color de las particulas
    {
        this.position = pos;
        this.localPosition = pos;
        this.scale = new Vector2();
        this.visible = true;
        this.particles = []; // Array para almacenar partículas
        this.color = color;
    }
    emit() // Método para agregar nuevas partículas
    {
        if (this.visible)
        {
            for (let i = 0; i < 1; i++) // Generar 1 partículas por emisión
            { 
                this.particles.push(new Particle(this.position, this.color));
            }
        }
    }
    _process()
    {
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
//*********************************************************************************//

//*********************************************************************************//
//                            // OBJETOS DE COLISION //                            //
//*********************************************************************************//

//*********************************************************************************//
//                              // BOXCOLLIDER //                                  //
//*********************************************************************************//
class BoxCollider extends GameObject
{
    constructor(name, pos, scale, layer, mask, type)
    {
        super(name, pos, scale);
        this.collision_layer = layer;
        this.mask = Array.isArray(mask) ? mask: Number.isInteger(mask) ? [mask] : [0];
        this.color = "rgba(0, 0, 230, 0.4)";
        this.type = type || "Trigger";
        this.visible = debugs;
        this.layer = 10;
    }
    set_collision_mask(value)
    {
        if (!Number.isInteger(value)) 
        {
            console.error("El parametro en el metodo 'set_collision_mask' no es valido.");
            return;
        }
        this.mask.forEach(mask => {
            if (value === mask)
            {
                console.error(`La mascara ${value} ya existe en el objeto de colision ${this.name}\n`);
                console.warn("El método set_collision_mask solo debe ser usado dentro de la función ready.");
                return; 
            }
        });
        this.mask.push(mask);
    }
    Render()
    {
        bufferCtx.fillStyle = this.color;
        bufferCtx.fillRect(this.position.x, this.position.y, this.scale.x, this.scale.y);
        super.Render();
    }
}
//*********************************************************************************//
