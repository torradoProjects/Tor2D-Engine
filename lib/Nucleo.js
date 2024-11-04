/***********************************************************************************/
/*                             // TOR2D Engine //                                  */                  
/***********************************************************************************/
/* @Author TorradoProjects                                                         */
/* @Comment Version 2.0                                               19/10/2024   */
/*                                                                                 */
/* Este motor de juego 2D está diseñado para juegos de plataformas sencillos,      */
/* utilizando JavaScript y HTML5 Canvas.                                           */
/* Los juegos que podrias construir con el son (RPG, PLATAFORMA, TYCOON, CASUALES) */
/*                                                                                 */
/***********************************************************************************/

import { canvas, ctx, bufferCanvas, bufferCtx, uiCanvas, uiCtx, debugs, currentScene, SceneTree, spatialGrid, collisions} from "./Variables.js";
import { Label, Vector2, UI, SpatialGrid, Time, Camera, isVisible, AudioPlayer, BaseButton, Texture, ParallaxBackground, Input, add_in_grid} from "./Import.js";
export class TOR2D // Nucleo
{
    #aps; // contador de aps
    #fps; // contador de fps
    #texture_filter = false;
    constructor(config)
    {
        document.body.style.overflow = 'hidden'; // desactiva el scroll

        // configuracion canvas principal
        let container = config.container !== undefined ? document.getElementById(config.container): document.body;
        canvas = document.createElement("canvas");
        canvas.style.position = "absolute";
        canvas.style.left = `${container.left}px`;
        canvas.style.top = `${container.top}px`;
        canvas.width = config.width;
        canvas.height = config.height;
        canvas.style.background = config.color !== undefined ? config.color: "black";
        ctx = canvas.getContext("2d");
        container.appendChild(canvas);

        // configuracion bufferCanvas
        bufferCanvas = document.createElement("canvas");
        bufferCtx = bufferCanvas.getContext("2d");
        bufferCanvas.width = config.width;
        bufferCanvas.height = config.height;

        // configuracion uiCanvas
        uiCanvas = document.createElement("canvas");
        uiCtx = uiCanvas.getContext("2d");
        uiCanvas.width = config.width;
        uiCanvas.height = config.height;
        uiCanvas.style.position = "absolute";
        uiCanvas.style.left = `${container.left}px`;
        uiCanvas.style.top = `${container.top}px`;
        container.appendChild(uiCanvas);
        

        // filtro de suavizado de texturas
        this.#texture_filter = config.texture_filter !== undefined ? config.texture_filter : false;
        debugs = config.debugs;

        // contador de fps
        this.#aps = 0;
        this.#fps = 0;
		this.debugFPS = new Label("FPS : "+ this.#fps, new Vector2(15, 25), 20, "Arial", "black");
		this.debugFPS.type = "FPS";
        debugs = config.debugs !== undefined ? config.debugs : false;
		UI.add_child(this.debugFPS);

        spatialGrid = new SpatialGrid(250); 
    }
    #Clear()
    {
        bufferCtx.clearRect(0, 0, bufferCanvas.width, bufferCanvas.height);
    }
    #Render()
    {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(bufferCanvas, 0, 0);
    }
    #Process(currentTime)
    {
        this.#aps++;
        if (!currentScene.pause) 
        {
            // Calcula Time.delta de forma normal si no está en pausa
            Time.delta = Math.min((currentTime - Time.lastTime) / 1000, 0.1);
            Time.lastTime = currentTime; // Actualiza el último tiempo para el próximo frame
        } else Time.delta = 0, Time.lastTime = 0;

        // muestra los FPS en pantalla si el debug esta activado
        if (debugs && currentTime - Time.lastUpdateFps >= 1000)
        {
            this.#fps = this.#aps;
            this.#aps = 0;
            this.debugFPS.text = "FPS : "+ this.#fps
            Time.lastUpdateFps = currentTime;
        }
        // renderizar ParallaxBackground
        if (Camera.child.length > 0) Camera.Render();

        // buscar la escena que esta corriendo
        let scene = currentScene;
        if (scene)
        {
            scene.child.sort((a, b) => a.layer - b.layer); // ordena el array de menor a mayor segun el layer
            scene.child.forEach(child => {
                if (child.process !== undefined && !scene.pause) child.process(); // ejecuta el process del objeto si la tiene
                if (child.move_and_slide !== undefined && !scene.pause) child.move_and_slide(); // ejecuta el move_and_slide del objeto
                if (child.Render !== undefined && isVisible(child) && child.visible ) child.Render(); // rederiza el objeto
            });

            // envia los hijos de la escena a comprobacion de coliciones
            if (scene.child.length > 0)
            {
                scene.child.forEach(child => {
                    if (child.collider !== undefined && child.collider !== null) collisions.push(child.collider);
                    if (child.child !== undefined ) child.addCollision();
                });
                
            }
            if (collisions.length > 1)
            {
                add_in_grid(collisions);
                collisions = [];
            }


            if (scene.process !== undefined && !scene.pause) scene.process(Time.deltaTime()); // ejecuta el process de la escena
            else if (scene.process !== undefined) scene.process(0);

        }

    }
    #RenderUI()
    {
        
        UI.Render();
        UI.Process();
    }
    #Loop(currentTime)
    {
        this.#Clear(); // limpia los canvas buffer y pricipal
        bufferCtx.imageSmoothingEnabled = this.#texture_filter; // aplica el filtro
        uiCtx.imageSmoothingEnabled = this.#texture_filter; // aplica el filtro
        if (Camera.target != undefined) Camera.applyTransformation(); // sigue al player si fue asignado 
        uiCtx.clearRect(0, 0, uiCanvas.width, uiCanvas.height);
        if (UI.child.length > 0) this.#RenderUI(); // renderiza los objetos de la interfaz
        this.#Process(currentTime); // procesa las escenas 
        this.#Render(); // renderiza el buffer en el canvas principal
        if (Camera.target != undefined) Camera.resetTransformation();
        window.requestAnimationFrame(this.#Loop.bind(this)); // loop
    }
    add_scene(scene)
    {
        scene.child = []; // se añade un array donde se almacenaran todos los hijos que tendra la escena
		scene.audios = []; // se añade un array para almacenar los audios de la escena
		scene.pause = false; // variable que pausa y reanuda la escena

        scene.add_child = function(obj) // crea una funcion para añadir objetos a la escena
        {
            if (obj instanceof AudioPlayer)
            {
                currentScene.audios.push(obj);
                return;
            }

            if (obj instanceof Label || obj instanceof BaseButton || obj instanceof Texture) // si el objeto es de interfaz, se añade a la interfaz
            {
                UI.add_child(obj);
                return;
            }
            // añadir ParallaxBackground a la camara
			if (obj instanceof ParallaxBackground)
            {
                Camera.child.push(obj);
                return;
            }	

            let child = currentScene.child.find(child => child.name === obj.name);
            if (child) 
            {
                console.error(`El objeto ${obj.name} ya existe.`);
                console.error("Si lo que deseas es instanciar varios objetos, intenta usando el metodo 'instantiate()'.");
                return;
            }

            obj.parent = scene;
            scene.child.push(obj);
        };
        scene.name = scene.name || SceneTree.length; // le asigna un numero segun su entrada al arbol si no tiene nombre
        SceneTree.push(scene); // añade la escena al arbol de escenas
    }
    change_scene(scene)
    {
        Camera.child = []; // limpia los parallaxBackground de la camara
		Camera.reset(); // resetea la camara
		Camera.resetTransformation(); // resetea las transformaciones
		UI.child = []; // limpia la interfaz

        currentScene.audios.forEach(obj => { // recorre los audios
            obj.stop(); // detiene los audios uno por uno
        });
        currentScene.audios = []; // limpia el array de audios
        currentScene.child = []; // limpia el array de objetos
        
        if (SceneTree.includes(scene) && currentScene.name !== scene.name)
        {
            currentScene = scene;
            if (scene.ready !== undefined) scene.ready();
        }
    }
    start(scene) // funcion para iniciar el loop y la escena como principal
	{
		window.addEventListener("load", ()=>{
			Input.update(); // escucha entradas de teclado
			this.add_scene(scene); // añade la escena al arbol de escenas
			currentScene = scene; // asigna la escena como escena en ejecucion
			if (typeof scene.ready === "function") scene.ready(); // ejecuta la funcion ready por unica vez
			this.#Loop(0); // empieza el loop con un tiempo de cero
		});
	}
    
}