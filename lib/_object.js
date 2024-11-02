import { Vector2 } from "./Import.js";
export  class _object
{
    constructor(name, position, size)
    {
        this.name = name;
        this.parent = null;
        this.position = position;
        this.localPosition = position;
        this.size = size;
        this.velocity = new Vector2();
        this.visible = true;
        this.layer = 0;
        this.child = [];
    }
}