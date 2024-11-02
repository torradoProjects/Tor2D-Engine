import {ParallaxLayer, isVisible, Vector2} from "./Import.js";
export class ParallaxBackground 
{
    constructor(name, position) // objeto que sigue la camara y contiene los ParallaxLayer
    {
        this.name = name;
        this.position = position;
        this.localPosition = position;
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
            if (obj.visible && obj.Render && isVisible(obj)) obj.Render(); // renderiza los hijos
            if (obj._process) obj._process(); // ejecuta los procesos de los hijos
        });
    }
    globalPosition(parentPosition = new Vector2()) // ancla su posicion a la del padre
    {
        this.position = parentPosition.add(this.localPosition);
    }
}