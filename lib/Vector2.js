export class Vector2
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