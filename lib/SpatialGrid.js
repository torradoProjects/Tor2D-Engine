export class SpatialGrid 
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
	        x: obj.position.x + obj.size.x,
	        y: obj.position.y + obj.size.y
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