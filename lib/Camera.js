import {Vector2, lerp} from "./Import.js";
import { bufferCanvas, bufferCtx } from "./Variables.js";
export let Camera = {
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