<<<<<<< HEAD
import {Camera, Collision} from "./Import.js";
import { bufferCanvas, currentScene, spatialGrid} from "./Variables.js";
// funciones globales
export function print(value, otherValue) // muestra en consola el o los parametros dados
{ 
	otherValue !== undefined ? console.log(value, otherValue) : console.log(value); 
} 

export function event(event, func) // funcion para crear un evento "click, keydown"
{ 
	document.addEventListener(event, func); 
} 

export function isVisible(obj) // devuelve true si el objeto es visible en la camara 
{
  if (obj.size != undefined)
  {
    return (
        obj.position.x + obj.size.x > Camera.position.x &&
        obj.position.x < Camera.position.x + (bufferCanvas.width / Camera.zoomLevel) &&
        obj.position.y + obj.size.y > Camera.position.y &&
        obj.position.y < Camera.position.y + (bufferCanvas.height / Camera.zoomLevel)
      );
  } else 
  {
    return (
        obj.position.x  > Camera.position.x &&
        obj.position.x < Camera.position.x + (bufferCanvas.width / Camera.zoomLevel) &&
        obj.position.y  > Camera.position.y &&
        obj.position.y < Camera.position.y + (bufferCanvas.height / Camera.zoomLevel)
      );
  }
}

export function pause_scene(bool) // pausar o reanuda la escena que esta ejecutandose
{
    if (typeof bool === "boolean")
    {
        currentScene.pause = bool;
    } else console.error("el parametro no es un boolean (true, false)");
}

export function saveData(name, value) // guarda un dato en memoria (identificador, valor)
{
	localStorage.setItem(name, value);
}

export function loadData(name) // carga un dato guardado en memoria (identificador)
{
	return localStorage.getItem(name);
}

export function deleteData(name) // elimina un dato en memoria (identificador)
{
	localStorage.removeItem(name);
}

export function deleteAllData() // elimina todos los datos guardados en memoria
{
	localStorage.clear();
}

export function lerp(start, end, amount) // Función de interpolación lineal
{
    return (1 - amount) * start + amount * end;
}

export function random(min, max) // Funcion que devuelve un numero aleatorio entre el minimo y el maximo
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function min(min, max) // Funcion que devuelve el valor minimo de dos valores
{
    return min < max ? min : min === max ? min : max;
}

export function max(min, max) // Funcion que devuelve el valor maximo de dos valores
{
    return max > min ? max : max === min ? max : min;
}

export function add_in_grid(collider)
{

    // Limpiar el grid antes de cada fotograma
    spatialGrid.clearGrid();

    // Añadir todos los objetos al grid
    collider.forEach(obj => {
        spatialGrid.addToGrid(obj);
    });

    // Actualizar cada objeto y verificar colisiones
    collider.forEach(obj => {
        
        const nearbyObjects = spatialGrid.getNearbyObjects(obj);

        // Verificar colisiones solo con objetos cercanos
        nearbyObjects.forEach(other => {
            if ( obj.parent.name !== other.parent.name ) 
            {
                for (let mask of obj.mask)
                {
                    if (other.collision_layer === mask) Collision(obj, other);
                }
            }
        });
    });		
=======
import {Camera, Collision} from "./Import.js";
import { bufferCanvas, currentScene, spatialGrid} from "./Variables.js";
// funciones globales
export function print(value, otherValue) // muestra en consola el o los parametros dados
{ 
	otherValue !== undefined ? console.log(value, otherValue) : console.log(value); 
} 

export function event(event, func) // funcion para crear un evento "click, keydown"
{ 
	document.addEventListener(event, func); 
} 

export function isVisible(obj) // devuelve true si el objeto es visible en la camara 
{
  if (obj.size != undefined)
  {
    return (
        obj.position.x + obj.size.x > Camera.position.x &&
        obj.position.x < Camera.position.x + (bufferCanvas.width / Camera.zoomLevel) &&
        obj.position.y + obj.size.y > Camera.position.y &&
        obj.position.y < Camera.position.y + (bufferCanvas.height / Camera.zoomLevel)
      );
  } else 
  {
    return (
        obj.position.x  > Camera.position.x &&
        obj.position.x < Camera.position.x + (bufferCanvas.width / Camera.zoomLevel) &&
        obj.position.y  > Camera.position.y &&
        obj.position.y < Camera.position.y + (bufferCanvas.height / Camera.zoomLevel)
      );
  }
}

export function pause_scene(bool) // pausar o reanuda la escena que esta ejecutandose
{
    if (typeof bool === "boolean")
    {
        currentScene.pause = bool;
    } else console.error("el parametro no es un boolean (true, false)");
}

export function saveData(name, value) // guarda un dato en memoria (identificador, valor)
{
	localStorage.setItem(name, value);
}

export function loadData(name) // carga un dato guardado en memoria (identificador)
{
	return localStorage.getItem(name);
}

export function deleteData(name) // elimina un dato en memoria (identificador)
{
	localStorage.removeItem(name);
}

export function deleteAllData() // elimina todos los datos guardados en memoria
{
	localStorage.clear();
}

export function lerp(start, end, amount) // Función de interpolación lineal
{
    return (1 - amount) * start + amount * end;
}

export function random(min, max) // Funcion que devuelve un numero aleatorio entre el minimo y el maximo
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function min(min, max) // Funcion que devuelve el valor minimo de dos valores
{
    return min < max ? min : min === max ? min : max;
}

export function max(min, max) // Funcion que devuelve el valor maximo de dos valores
{
    return max > min ? max : max === min ? max : min;
}

export function add_in_grid(collider)
{

    // Limpiar el grid antes de cada fotograma
    spatialGrid.clearGrid();

    // Añadir todos los objetos al grid
    collider.forEach(obj => {
        spatialGrid.addToGrid(obj);
    });

    // Actualizar cada objeto y verificar colisiones
    collider.forEach(obj => {
        
        const nearbyObjects = spatialGrid.getNearbyObjects(obj);

        // Verificar colisiones solo con objetos cercanos
        nearbyObjects.forEach(other => {
            if ( obj.parent.name !== other.parent.name ) 
            {
                for (let mask of obj.mask)
                {
                    if (other.collision_layer === mask) Collision(obj, other);
                }
            }
        });
    });		
>>>>>>> f5ef691cf3fe1d0dd2a7e52dcaf2fb2884fe8617
}