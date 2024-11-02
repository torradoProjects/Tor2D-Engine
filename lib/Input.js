export let Input =
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
        window.addEventListener("click", () =>
        {
            if (this.isClick != undefined) this.isClick();
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