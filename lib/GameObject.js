import {_object, Vector2, AudioPlayer, BoxCollider, random, add_in_grid} from "./Import.js";
import { currentScene, collisions } from "./Variables.js";
export class GameObject extends _object
{
    #rotation;
    constructor(name, position, size)
    {
        super(name, position, size);
        this.slice_right = true;
        this.slice_left = true;
        this.slice_up = true;
        this.slice_down = true;
        this.isFloor = false;
        this.wasOnFloor = false;
        this.isWall = false;
        this.wasOnWall = false;
        this.isCeiling = false;
        this.wasOnCeiling = false;
        this.collider = null;
        this.scale = 1;
        this.restitution = 2;
        this.saveRestitution = this.restitution;
        this.isInstantiate = false;
    }
    setRestitution(rebound)
    {
        this.restitution = rebound;
        this.saveRestitution = rebound;
    }
    setRotation(grados)
    {
        if (currentScene.pause) return;
        this.#rotation = Number.isInteger(grados) ? grados * (Math.PI / 180): 0;
        this.child.forEach(obj => {
            if (typeof obj.setRotation === "function") obj.setRotation(grados);
        });
    }
    apply_impulse(x, y)
    {
        this.velocity.x += x;
        this.velocity.y += y;
    }
    scaler()
    {
        if (this.scale < 1 && this.scale > 0.1)
        {
            this.size = this.size.multiply(this.scale);
            this.scale = 1;
        } 
    }
    is_in_floor()
    {
        return this.isFloor;
    }
    is_in_floor_only()
    {
         if (this.is_in_floor() && !this.wasOnFloor) 
         {
            this.wasOnFloor = true; 
            return true;
        } 
        else if (!this.is_in_floor()) 
        {
          // Si no está en el suelo, reinicia el estado
          this.wasOnFloor = false;
        }
        return false;
    }
    is_in_wall()
    {
        return this.isWall;
    }
    is_in_wall_only()
    {
        if (this.is_in_wall() && !this.wasOnWall)
        {
            this.wasOnWall = true;
            return true;
        }
        else if (!this.is_in_wall())
        {
            this.wasOnWall = false;
        }
        return false;
    }
    is_in_ceiling()
    {
        return this.isCeiling;
    }
    is_in_ceiling_only()
    {
        if (this.is_in_ceiling() && !this.wasOnCeiling)
        {
            this.wasOnCeiling = true;
            return true;
        }
        else if (!this.is_in_ceiling())
        {
            this.wasOnCeiling = false;
        }
        return false;
    }
    instantiate()
    {
        this.name = this.name + random(1, 10000);
    }
    center()
    {
        return new Vector2(this.position.x + (this.size.x / 2), this.position.y + (this.size.y / 2));
    }
    add_child(obj) 
    {
        if (obj instanceof AudioPlayer) // añade objeto AudioPlayer
        {
            currentScene.audios.push(obj);
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
        if (obj.size != undefined)
        {
            obj.parent = this;
            let pos = this.center().subtract(new Vector2(obj.size.x / 2, obj.size.y / 2));
            obj.position = pos;
            this.child.push(obj);
        } else 
        {
            obj.parent = this;
            let pos = this.position.add(obj.position);
            obj.position = pos;
            this.child.push(obj);
        }
        
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
    globalPosition(parentPosition = new Vector2(), center = new Vector2()) // funcion para anclar la posicion con la del padre
    {
        let pos = center.subtract(new Vector2(this.size.x / 2, this.size.y / 2));
        this.position = this.localPosition.add(pos);
    }
    move_and_slide()
    {
        if (currentScene.pause) return;
        if (this.restitution <= 0 && !this.is_in_floor() && this.velocity.y < 0) this.restitution = this.saveRestitution;

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

        // Aplica fricción 
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
            obj.globalPosition(this.position, this.center());
            if (typeof obj.move_and_slide === 'function') obj.move_and_slide();
            if (typeof obj._process === 'function') obj._process();
            if (typeof obj.process === 'function') obj.process();
        }
    }
    addCollision()
    {
        if (this.child.length > 0)
        {
            this.child.forEach(obj => {
                // envia los hijos del objeto a comprobacion de coliciones
                if (obj.collider !== undefined && obj.collider !== null) collisions.push(obj.collider);
                if (obj.child !== undefined) obj.addCollision();
            });
        }
    }
}