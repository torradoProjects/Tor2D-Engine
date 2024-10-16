# Tor2D
Un motor de juego 2D ligero escrito en JavaScript.

## Descripción
Tor2D es un motor de juego 2D ligero escrito en JavaScript, ideal para crear juegos sencillos como clickers, juegos de plataformas, RPG y títulos casuales. Ofrece una estructura básica pero flexible que permite a los desarrolladores centrarse en la mecánica del juego sin preocuparse por configuraciones complejas. Con Tor2D, es fácil manejar sprites, animaciones, físicas simples y detectar colisiones, lo que lo convierte en una excelente opción para prototipos rápidos o proyectos pequeños.

## Características principales
- Fácil de integrar y comenzar a desarrollar juegos.
- Funcionalidad de física básica con el método `move_and_slide()` para gestionar el movimiento y la fricción.
- Manejo sencillo de sprites y animaciones.
- Detección de colisiones entre objetos del juego.
- Soporte para guardar datos de juego utilizando LocalStorage.
- Bucle principal de juego personalizable.
- Ideal para juegos sencillos como clickers, plataformas, RPG y juegos casuales.

## Instalación
Para comenzar a utilizar Tor2D, puedes clonar el repositorio desde GitHub:

```bash
git clone https://github.com/torradoProjects/Tor2D-Engine.git
cd Tor2D

```
Incluir en tu proyecto
``` html
<script src="path-to-Tor2D.js"></script>
```
## Ejemplo de uso

A continuación, se muestra un ejemplo básico de cómo configurar y usar el motor Tor2D para crear un juego sencillo con animaciones, colisiones y controles de teclado.

### Configuración

Primero, se debe definir una configuración básica para el juego, que incluye el lienzo donde se va a renderizar, el tamaño de la ventana, y otras opciones como el suavisado de texturas y el debug para mostrar colisiones y contador de FPS:

```javascript
let config = {
    canvas: "canvas",
    width: window.innerWidth,
    height: window.innerHeight,
    texture_filter: false,
    debugs: false
};

let tom = new Tor2D(config);

// Creación de objetos
// Se pueden crear objetos en la escena como personajes animados, plataformas, colisionadores, botones y más:

let pers, animRun, animIdle, animJumpDown, animJumpUp;
let speed = 400;
let piso, plataforma, box, btn, particle, sound;

let Game = {
    name: "Game",
    ready: function() { // funcion ready se ejecuta una sola vez, es donde se cargan imagenes sonidos y se crean objetos

        animIdle = new SpriteSheet("idle", "img/pers_idle.png", 4, 1); // objeto que crea un recorte de una imagen 
        animRun = new SpriteSheet("run", "img/pers_run.png", 6, 1);
        animJumpDown = new SpriteSheet("jump_down", "img/pers_jump_down.png", 3, 1);
        animJumpUp = new SpriteSheet("jump_up", "img/pers_jump_up.png", 3, 1);
        let anim = [animIdle, animRun, animJumpUp, animJumpDown];
        
        pers = new AnimatedSprite("player", new Vector2(100, 50), new Vector2(100, 100), anim, 0.08);
        this.add_child(pers); // añade el objeto a la escena
        
        // Definición de colisionadores
        pers.colis = new BoxCollider("colision", new Vector2(15, 5), new Vector2(60, 90), 0, [1, 2], "CharacterBody");
        pers.add_child(pers.colis);
        pers.layer = 2;

        // Creación de una plataforma y colisionador
        piso = new RenderShape("piso", new Vector2(10, 400), new Vector2(1800, 50), "Rectangle", "brown");
        piso.colis = new BoxCollider("colision", new Vector2(), new Vector2(1800, 50), 1, [0, 2], "Static");
        piso.add_child(piso.colis);
        this.add_child(piso);

        // Otras plataformas, colisionadores y objetos
        plataforma = new RenderShape("plataforma", new Vector2(300, 250), new Vector2(400, 30), "Rectangle", "brown");
        plataforma.colis = new BoxCollider("colision", new Vector2(), new Vector2(400, 30), 1, [0, 2], "Plataform");
        plataforma.add_child(plataforma.colis);
        this.add_child(plataforma);

        box = new Sprite("box", new Vector2(300, 100), new Vector2(50, 50), "img/pelota.png");
        box.colis = new BoxCollider("colision", new Vector2(), new Vector2(50, 50), 2, [0, 1], "RigidBody");
        box.add_child(box.colis);
        this.add_child(box);

        Camera.follow(pers); // asigna a la camara el objeto que va a seguir

        // Fondo y parallax
        let bg = new ParallaxBackground("bg", new Vector2());
        this.add_child(bg);
        let layer0 = new ParallaxLayer("layer0", new Vector2(), new Vector2(config.width, config.height), "img/bg_0.png", 1);
        let layer1 = new ParallaxLayer("layer1", new Vector2(), new Vector2(config.width, config.height), "img/bg_1.png", 2);
        bg.add_child(layer0);
        bg.add_child(layer1);

        // Sonido y botón
        sound = new AudioPlayer("audio", new Vector2(), "audio/poin.ogg");
        box.add_child(sound);

        pause_scene(true); // pausa la escena al empezar 

        // boton play en el UI
        btn = new TextureButton("play", new Vector2(500, 300), new Vector2(200, 200), "img/up.png", "img/down.png");
        this.add_child(btn);

        // Partículas
        particle = new ParticleSystem(new Vector2(50, 100), "0, 100, 150");
        pers.add_child(particle);
    },
    
    // Lógica del juego (control de personajes y colisiones)
    process: function(delta) {
        if (!box.is_in_floor()) box.velocity.y += 1800 * delta;
        if (!pers.is_in_floor()) pers.velocity.y += 1500 * delta;

        let moveX = Input.isKeyDown("KeyD") - Input.isKeyDown("KeyA");
        pers.velocity.x = moveX * speed;
        pers.flip_h = Input.isKeyDown("KeyA");

        if (Input.isKeyDown("Space") && pers.is_in_floor()) pers.velocity.y = -600;

        // Animaciones basadas en el movimiento
        if (pers.velocity.x != 0) {
            pers.play("run");
            particle.emit();
        } else if (!pers.is_in_floor() && pers.velocity.y > 0) {
            pers.play("jump_down");
        } else if (pers.velocity.y < 0) {
            pers.play("jump_up");
        } else {
            pers.play("idle");
        }

        if (box.is_in_floor()) {
            box.velocity.y = -600;
            sound.play();
        }

        // Acción del botón
        btn.is_released = function() {
            sound.play();
            pause_scene(false);
            btn.visible = false;
        };
    }
};

// Iniciar el juego
tom.start(Game);
````

## Funciones principales

Tor2D incluye una serie de funciones útiles para el desarrollo de juegos 2D. A continuación se presentan las más importantes:

### `Tor2D(config)`
Constructor principal que inicializa el motor con la configuración especificada. Recibe un objeto `config` que debe contener los siguientes parámetros:
- `canvas`: ID del elemento canvas donde se dibujará el juego.
- `width`: Ancho del área de juego.
- `height`: Alto del área de juego.
- `texture_filter`: Habilita o deshabilita los filtros de texturas (para suavizado de gráficos).
- `debugs`: Modo de depuración para mostrar colisiones y otros datos.

### `add_scene(scene)`

Este método añade una nueva escena al árbol de escenas del motor Tor2D. Una escena es un contenedor que organiza y gestiona diferentes objetos del juego, como sprites, audios y botones. Al usar `add_scene(scene)`, puedes crear diferentes escenas dentro de tu juego, como un menú principal, niveles de juego o una pantalla de pausa. Cada escena puede tener hijos, que son los objetos que se mostrarán o interactuarán en esa escena.

#### Método `add_child(obj)`
Dentro de cada escena, se puede usar el método `add_child(obj)` para añadir objetos. Este método se encarga de diferentes tipos de objetos y los organiza según sus características:

#### Asignación automática de nombres:
Si la escena no tiene un nombre, el motor le asigna un número basado en el orden en que se añadió al árbol de escenas (`SceneTree`).

#### Ejemplo de uso:

```javascript
let gameScene = {
  name: "Nivel1",
  ready: function() {
    let player = new AnimatedSprite("player", new Vector2(100, 100), new Vector2(50, 50), [animIdle], 0.1);
    this.add_child(player);
  }
};

let tor2d = new Tor2D(config);
tor2d.add_scene(gameScene);
```

### `change_scene(scene)`

Este método permite cambiar entre diferentes escenas dentro del motor `Tor2D`. Al cambiar de escena, el motor se encarga de realizar una serie de tareas para asegurar que la transición entre escenas sea fluida, limpiando la escena anterior y cargando la nueva.

#### Ejemplo de uso:

```javascript
let menuScene = {
  name: "Menu",
  ready: function() {
    let playButton = new TextureButton("play", new Vector2(100, 100), new Vector2(200, 100), "img/play.png", "img/play_hover.png");
    this.add_child(playButton);
  },
  process: function(){
    playButton.is_pressed = function()
    {
        // Cambiar de la escena de menú a la escena de juego
        tor2d.change_scene(gameScene);
    };
  }
};

let gameScene = {
  name: "Game",
  ready: function() {
    let player = new AnimatedSprite("player", new Vector2(100, 100), new Vector2(50, 50), [animIdle], 0.1);
    this.add_child(player);
  }
};

let tor2d = new Tor2D(config);
tor2d.add_scene(gameScene);
tor2d.start(menuScene);
```

### `start(scene)`

El método `start(scene)` es el encargado de iniciar el ciclo principal (loop) del motor de juego `Tor2D`. Este ciclo actualiza y renderiza constantemente el juego, procesando entradas, movimientos, físicas, y la lógica de cada escena. La escena que se pasa como parámetro se añade al árbol de escenas y se inicia, permitiendo que el juego comience a ejecutarse. El método se activa una vez que la ventana del navegador ha cargado completamente.


#### Ejemplo de uso:

```javascript
let mainScene = {
  name: "MainScene",
  ready: function() {
    let player = new AnimatedSprite("player", new Vector2(100, 100), new Vector2(50, 50), [animIdle], 0.1);
    this.add_child(player);
  },
  process: function(delta) {
    // Lógica de actualización por fotograma
  }
};

let tor2d = new Tor2D(config);
tor2d.start(mainScene); // Inicia el motor de juego con la escena 'mainScene'
```

## Funciones Globales

Tor2D incluye una serie de funciones globales que simplifican la interacción con la consola, eventos del navegador, visibilidad de objetos en la cámara, y manejo de datos en el almacenamiento local. A continuación se describen estas funciones:

### `print(value)`
Imprime un valor en la consola del navegador. Útil para depuración o mostrar mensajes en tiempo de ejecución.
- **Parámetro**:
  - `value`: El valor que se desea imprimir en la consola.
  
#### Ejemplo de uso:
```javascript
print("Juego iniciado correctamente"); 
```
### `event(event, func)`
Agrega un evento al documento HTML para escuchar interacciones como clics o pulsaciones de teclas.
- **Parámetros**:
  - `event`: El tipo de evento que se desea escuchar (por ejemplo, `click`, `keydown`).
  - `func`: La función que se ejecutará cuando ocurra el evento.

#### Ejemplo de uso:
```javascript
event("click", function() {
    print("Se ha hecho clic en el documento");
});
```

### `isVisible(obj)`
Verifica si un objeto está dentro del área visible de la cámara. Devuelve true si el objeto es visible en la cámara y false en caso contrario.
- **Parámetro:**:
  - `obj`: El objeto cuya visibilidad se desea comprobar. Este objeto debe tener las propiedades `position` (posición) y `scale` (tamaño).

#### Ejemplo de uso:
```javascript
if (isVisible(player)) {
    print("El jugador está dentro de la cámara");
}
```

### `pause_scene(bool)`
Pausa o reanuda la escena que actualmente se está ejecutando.
- **Parámetro:**:
  - `bool`: `true` para pausar la escena, `false` para reanudarla.

#### Ejemplo de uso:
```javascript
pause_scene(true); // Pausa la escena
pause_scene(false); // Reanuda la escena
```

### `saveData(name, value)`
Guarda un dato en el almacenamiento local del navegador, útil para guardar configuraciones o el estado del juego.
- **Parámetros:**:
  - `name`: El nombre o clave con la que se identificará el dato guardado.
  - `value`: El valor que se desea almacenar.

#### Ejemplo de uso:
```javascript
saveData("highscore", 10000); // Guarda la puntuación más alta
```

### `loadData(name)`
Carga un dato previamente guardado en el almacenamiento local del navegador.
- **Parámetro:**:
  - `name`: El nombre o clave del dato que se desea recuperar.

#### Ejemplo de uso:
```javascript
let highscore = loadData("highscore");
print("Puntuación más alta: " + highscore);
```

### `deleteData(name)`
Elimina un dato específico del almacenamiento local.
- **Parámetro:**:
  - `name`: El nombre o clave del dato que se desea eliminar.

#### Ejemplo de uso:
```javascript
deleteData("highscore"); // Elimina la puntuación más alta guardada
```

### `deleteAllData()`
Elimina todos los datos guardados en el almacenamiento local del navegador.

#### Ejemplo de uso:
```javascript
deleteAllData(); // Borra todos los datos guardados
```

## `Vector2`

La clase `Vector2` representa un vector bidimensional con componentes `x` e `y`, que es útil para manipular posiciones, movimientos y direcciones en un espacio 2D dentro del motor Tor2D. A continuación se detallan los métodos principales de la clase y sus usos.

### Constructor: `new Vector2(x, y)`
Crea un nuevo vector con las componentes `x` e `y`. Si no se proporcionan valores, ambas componentes se inicializan en 0.
- **Parámetros**:
  - `x`: El valor de la componente horizontal (eje X).
  - `y`: El valor de la componente vertical (eje Y).

#### Ejemplo de uso:
```javascript
let vector = new Vector2(100, 50);
```

### `add(other)`
Suma el vector actual con otro vector other y devuelve un nuevo vector con la suma resultante.
- **Parámetro:**:
  - `other`: El vector que se sumará al actual.

#### Ejemplo de uso:
```javascript
let v1 = new Vector2(10, 20);
let v2 = new Vector2(30, 40);
let result = v1.add(v2); // Devuelve Vector2(40, 60)
```

### `length()`
Calcula la longitud o magnitud del vector. Esto es útil para conocer la distancia que representa el vector en el espacio 2D.

#### Ejemplo de uso:
```javascript
let v = new Vector2(3, 4);
let length = v.length(); // Devuelve 5, porque la magnitud de (3,4) es 5
```

### `normalize()`
Normaliza el vector actual, devolviendo un nuevo vector con la misma dirección pero con una longitud de 1. Si el vector tiene longitud cero, devuelve un vector (0, 0).
- `Nota`: Normalizar un vector es útil cuando necesitas trabajar con la dirección del vector sin cambiar su longitud.

#### Ejemplo de uso:
```javascript
let v = new Vector2(10, 0);
let normalized = v.normalize(); // Devuelve Vector2(1, 0)
```

### `multiply(scalar)`
Multiplica las componentes del vector actual por un valor escalar `scalar` y devuelve un nuevo vector resultante.
- **Parámetro:**:
  - `scalar`: El valor por el que se multiplicarán las componentes del vector.

#### Ejemplo de uso:
```javascript
let v = new Vector2(2, 3);
let result = v.multiply(2); // Devuelve Vector2(4, 6)
```

### `split(value)`
Divide los componentes del vector actual por un valor `value` y devuelve un nuevo vector con el resultado.
- **Parámetro:**:
  - `value`: El valor por el que se dividirán las componentes del vector.

#### Ejemplo de uso:
```javascript
let v = new Vector2(10, 20);
let result = v.split(2); // Devuelve Vector2(5, 10)
```

### `subtract(other)`
Resta un vector `other` del vector actual y devuelve un nuevo vector con el resultado.
- **Parámetro:**:
  - `other`: El vector que se restará al actual.

#### Ejemplo de uso:
```javascript
let v1 = new Vector2(10, 20);
let v2 = new Vector2(5, 7);
let result = v1.subtract(v2); // Devuelve Vector2(5, 13)
```

## `Camera`

La cámara en Tor2D es responsable de seguir a un objeto dentro de la escena, aplicar transformaciones al canvas y controlar el nivel de zoom. También maneja la renderización de elementos anclados a la cámara, como fondos de parallax. A continuación, se describen las funciones más importantes que el usuario puede utilizar.

### `follow(target, boundaryX, boundaryY)`

Asigna un objeto que la cámara seguirá durante el juego. Este objeto puede ser cualquier sprite o entidad en movimiento. La cámara se moverá suavemente hacia el objetivo, respetando los márgenes de seguimiento dados.

- **Parámetros**:
  - `target`: El objeto que la cámara debe seguir.
  - `boundaryX`: El margen horizontal antes de que la cámara empiece a seguir al objetivo. Si no se especifica, se establece en 100 píxeles.
  - `boundaryY`: El margen vertical antes de que la cámara empiece a seguir al objetivo. Si no se especifica, se establece en 100 píxeles.

#### Ejemplo de uso:
```javascript
let player = new AnimatedSprite("player", new Vector2(100, 50), new Vector2(100, 100), anim, 0.08);
Camera.follow(player, 50, 50); // La cámara sigue al jugador con un margen de 50 píxeles.
```

### `setZoom(level)`
Ajusta el nivel de zoom de la cámara. Un valor de 1 representa un zoom normal, valores mayores a 1 acercan la cámara, y valores menores a 1 alejan la vista.
- **Parámetro:**:
  - `level`: Un número que indica el nivel de zoom. Ejemplo: `1` es el nivel por defecto, `2` duplica el tamaño de la vista, `0.5` aleja la cámara.

#### Ejemplo de uso:
```javascript
Camera.setZoom(2); // Acerca la cámara, haciendo que los elementos se vean más grandes.
```

### `Timer`

La clase `Timer` se utiliza para gestionar tiempos de espera en el motor de juego. Puede esperar una cantidad de tiempo especificada antes de ejecutar una función, lo cual es útil para temporizadores, retrasos en eventos, o cualquier lógica dependiente del tiempo.

#### Propiedades:

- **loop**:
  Esta propiedad indica si el temporizador debe reiniciarse automáticamente cuando llega a su fin. Si se establece en `true`, el temporizador volverá a empezar una vez que el tiempo se haya cumplido. Si es `false`, el temporizador se ejecuta solo una vez y luego se detiene.

  **Uso**:
  ```javascript
  // dentro de la función ready de la escena
  let timer = new Timer(2); // Temporizador de 2 segundos
  this.add_child(timer); // se añade a la escena
  timer.loop = true; // El temporizador se repetirá indefinidamente
  ```
  - **Metodos**:
   - `start(func)`: Inicia el temporizador y ejecuta la función pasada como parámetro (func) cuando el tiempo especificado ha transcurrido. Si la propiedad loop está activada, la función se ejecutará repetidamente cada vez que el temporizador finalice.
   **Uso**:
    ```javascript
    timer.start(() => {
    console.log("El tiempo ha finalizado");
    });
    ```
   - `stop()`: Detiene el temporizador y reinicia el contador de espera (wait). No se ejecuta la función pasada a start si el tiempo aún no ha finalizado.
   **Uso**
   ```javascript
   timer.stop(); // Detiene el temporizador
   ```
#### Ejemplo Completo:
```javascript
let timer = new Timer(2); // Temporizador de 2 segundos
timer.loop = true; // Se repetirá indefinidamente
timer.start(() => {
    console.log("El temporizador ha terminado su ciclo");
});
```

### `Input`

El objeto `Input` se encarga de gestionar las entradas del teclado y del ratón en el motor de juego `Tor2D`. Este objeto escucha los eventos de entrada como presiones de teclas y movimientos del ratón, proporcionando métodos para consultar el estado de las entradas.

#### Métodos:

- **isKeyDown(keyCode)**:
  Devuelve `true` si la tecla correspondiente a `keyCode` está actualmente presionada. Utiliza el código de tecla (`keyCode`) como argumento, que puede ser cualquier código de tecla como `KeyW`, `ArrowUp`, etc.

  **Uso**:
  ```javascript
    if (Input.isKeyDown("KeyW")) {
        console.log("La tecla W está presionada");
    }
  ```
- **getMousePosition()**:
  Devuelve un objeto con las coordenadas actuales del ratón (x e y).

  **Uso**:
  ```javascript
    let mousePos = Input.getMousePosition();
    console.log(`Posición del ratón: X=${mousePos.x}, Y=${mousePos.y}`);
  ```
- **isMouseDown()**:
  Devuelve `true` si el botón del ratón está presionado.

  **Uso**:
  ```javascript
    if (Input.isMouseDown()) {
        console.log("El botón del ratón está presionado");
    }
  ```

## Objetos de Interfaz:


### `Label`

La clase `Label` se utiliza para renderizar texto en la interfaz de usuario (UI) dentro del motor de juego `Tor2D`. Es una clase simple que permite mostrar textos con varias propiedades configurables, como el tamaño, la fuente y el color.

#### Constructor:

```javascript
constructor(text, pos, size, font, color) 
```
- **text**: El contenido del texto que se va a renderizar.
- **pos**: Un objeto `Vector2` que representa la posición inicial del texto en la pantalla.
- **size**: El tamaño del texto en píxeles.
- **font**: La fuente del texto (por ejemplo, `Arial`, `Verdana`, etc.).
- **color**: El color del texto en formato de cadena (por ejemplo, `black`, `#FFFFFF`, etc.).

 #### Ejemplo de Uso:
 ```javascript
 let label = new Label("Puntuación", new Vector2(100, 50), 24, "Arial", "white");
 ```
 #### Propiedades:

 - **visible**: Determina si el texto es visible o no (booleano), por defecto todos son `true`.
 - **layer**: La capa en la que se renderiza el texto, por defecto todos son `0`.

 #### Ejemplo de Uso:
 ```javascript
 let puntos = new Label("1000", new Vector2(100, 50), 24, "Arial", "white");
 let estrellas = new Label("100", new Vector2(100, 50), 24, "Arial", "white");
 this.add_child(puntos);
 this.add_child(estrellas);
 // segun el orden de creacion, estrellas se renderiza sobre puntos

 puntos.layer = 1; // ahora los puntos se renderizan sobre las estrellas
 if (Input.isKeyDown("Space")) 
 {
    // al precionar la tecla espacio el texto desaparece pero sigue existiendo como hijo de la interfaz
    puntos.visible = false;
 }

 ```

### `Button`

 La clase `Button` permite crear botones interactivos dentro de la interfaz de usuario del motor de juego Tor2D, ofreciendo personalización de los colores del botón, tanto en estado normal como cuando está presionado.

#### Constructor:

```javascript
constructor(name, pos, scale, color, borderColor, pressedColor) 
```
- **name**: `String` - Nombre del botón para su identificación.
- **pos**: `Vector2` - Posición en pantalla donde se dibujará el botón.
- **scale**: `Vector2` - Tamaño del botón, definido por su ancho y alto.
- **color**: `String` - (opcional) - Color del botón en estado normal. Si no se especifica, el valor por defecto es blanco.
- **borderColor**: `String` - (opcional) - Color del borde del botón. Si no se especifica, el valor por defecto es negro.
- **pressedColor**: `String` - (opcional) - Color del botón cuando está presionado. Si no se especifica, el valor por defecto es gris.

#### Propiedades:

 - **visible**: Determina si el objeto es visible o no (booleano), por defecto todos son `true`.
 - **layer**: La capa en la que se renderiza el objeto, por defecto todos son `0`.
 - **is_pressed**: funcion `undefined` que es creada por el usuario que se ejecuta cuando esta presionado.
 - **is_released**: funcion `undefined` que es creada por el usuario que se ejecuta cuando es soltado.

 #### Ejemplo de Uso:
 ```javascript
 // dentro de la funcion ready de la escena
let button = new Button("playButton", new Vector2(50, 50), new Vector2(150, 50), "blue", "black", "green");
this.add_child(button); // se añade a la escena

// dentro de la funcion ready o process de la escena
button.is_pressed = function() {
    console.log("Botón presionado");
};

button.is_released = function() {
    console.log("Botón soltado");
};
 ```

 #### Metodos:

 - `getPressed`: funcion que devuelve `true` si es presionado.
 - `add_child`: Añade un objeto hijo a el boton. Este método solo permite el  objeto `Label`. 

#### Ejemplo de Uso:
 ```javascript
 // dentro de la funcion ready de la escena
let button = new Button("playButton", new Vector2(50, 50), new Vector2(150, 50), "blue", "black", "green");
this.add_child(button); // se añade a la escena

// dentro de la funcion process de la escena
if (button.getPressed())
{
    console.log("Botón presionado");
} else console.log("Botón soltado");

 ```

### `TextureButton`

 `TextureButton` es un botón especializado que muestra diferentes texturas dependiendo de si está presionado o no. Utiliza imágenes para representar los estados normal y presionado, permitiendo una apariencia visual más personalizada para el botón dentro de la interfaz del juego.

#### Constructor:

```javascript
constructor(name, pos, scale, texture_normal, texture_pressed)
```
- **name**: `String` - Nombre del botón para su identificación.
- **pos**: `Vector2` - Posición en pantalla donde se dibujará el botón.
- **scale**: `Vector2` - Tamaño del botón, definido por su ancho y alto.
- **texture_normal**: `path_to_image` - La textura que se muestra cuando el botón no está presionado.
- **texture_pressed**: `path_to_image` - La textura que se muestra cuando el botón está presionado.

#### Propiedades:

 - **visible**: Determina si el objeto es visible o no (booleano), por defecto todos son `true`.
 - **layer**: La capa en la que se renderiza el objeto, por defecto todos son `0`.
 - **is_pressed**: funcion `undefined` que es creada por el usuario que se ejecuta cuando esta presionado.
 - **is_released**: funcion `undefined` que es creada por el usuario que se ejecuta cuando es soltado.

 #### Ejemplo de Uso:
 ```javascript
 // dentro de la funcion ready de la escena
let button = new Button("playButton", new Vector2(50, 50), new Vector2(150, 50), "buttonNormal.png", "buttonPressed.png");
this.add_child(button); // se añade a la escena

// dentro de la funcion ready o process de la escena
button.is_pressed = function() {
    console.log("Botón presionado");
};

button.is_released = function() {
    console.log("Botón soltado");
};
 ```

 #### Metodo:

 - `getPressed`: funcion que devuelve `true` si es presionado.

#### Ejemplo de Uso:
 ```javascript
 // dentro de la funcion ready de la escena
let button = new Button("playButton", new Vector2(50, 50), new Vector2(150, 50), "buttonNormal.png", "buttonPressed.png");
this.add_child(button); // se añade a la escena

// dentro de la funcion process de la escena
if (button.getPressed())
{
    console.log("Botón presionado");
} else console.log("Botón soltado");

 ```

### `Joystick`

 La clase `Joystick` es un control táctil utilizado para simular un joystick virtual en la interfaz, permitiendo al usuario controlar movimientos en los ejes X e Y. El joystick consta de un aro exterior estático y un círculo interior que se mueve dentro de un límite definido por la distancia máxima permitida.

#### Constructor:

```javascript
constructor(name, pos, scale, texture_outer, texture_inner, maxDistance = 50)
```
- **name**: `String` - Nombre del joystick para su identificación.
- **pos**: `Vector2` - Posición en pantalla donde se dibujará el joystick.
- **scale**: `Vector2` - Tamaño del joystick , definido por su ancho y alto.
- **texture_outer**: `path_to_image` - La textura utilizada para el aro exterior del joystick (parte fija). 
- **texture_inner**: `path_to_image` - La textura utilizada para el círculo interior del joystick (parte móvil).
- **maxDistance**: `Int` - La distancia máxima que el círculo interior puede moverse desde el centro del joystick. Por defecto es 50 píxeles.

#### Propiedades:

 - **visible**: Determina si el objeto es visible o no (booleano), por defecto todos son `true`.
 - **layer**: La capa en la que se renderiza el objeto, por defecto todos son `0`.
 - **axisX**: valor normalizado entre -1 y 1 que representa el desplazamiento en el eje X. Indica la dirección y magnitud del movimiento del joystick.
 - **axisY**: valor normalizado entre -1 y 1 que representa el desplazamiento en el eje Y. Indica la dirección y magnitud del movimiento del joystick.

 #### Ejemplo de Uso:
 ```javascript
 // dentro de la funcion ready de la escena
let joystick = new Joystick("PlayerJoystick", new Vector2(50, 300), new Vector2(100, 100), "outer_texture.png", "inner_texture.png");

this.add_child(joystick); // se añade a la escena

// dentro de la funcion process de la escena

// Callback para manejar el movimiento del joystick
joystick.onMove = function(axisX, axisY) {
    console.log(`Moviendo el joystick: X=${axisX}, Y=${axisY}`);
    
    // Ejemplo: Usar los valores del joystick para mover un personaje
    player.position.x += axisX * player.speed;
    player.position.y += axisY * player.speed;
}
// o tambien puedes usar
player.position.x += joystick.axisX * player.speed;
player.position.y += joystick.axisY * player.speed;
 ```

### `Texture`

La clase `Texture` permite renderizar imágenes o texturas en pantalla en un entorno gráfico, como un juego 2D. Esta clase es útil para representar fondos de interzas, fondos o cualquier otro elemento visual que se desee mostrar.

#### Constructor

```javascript
constructor(name, pos, scale, path)
```
- **name**: `String` - El nombre de la textura, utilizado para identificarla.
- **pos**: `Vector2` - La posición en la que se dibujará la textura en la pantalla.
- **scale**: `Vector2` - La escala de la textura, representando su tamaño en píxeles (ancho y alto).
- **path**: `String` - La ruta de la imagen que se cargará como textura.

#### Propiedades:

 - **visible**: Determina si el objeto es visible o no (booleano), por defecto todos son `true`.
 - **layer**: La capa en la que se renderiza el objeto, por defecto todos son `0`.
 - **flip_h**: Indica si la textura debe ser volteada horizontalmente. Por defecto es `false`.
 - **flip_v**: Indica si la textura debe ser volteada verticalmente. Por defecto es `false`.

#### Metodo:

 - `add_child`: Añade un objeto hijo a la textura. Este método solo permite los siguientes objetos: `Label`, `Button`, `TextureButton`, `Joystick` y `Texture`.

#### Ejemplo de Uso:
 ```javascript
 // dentro de la funcion ready de la escena
let fondo_gameOver = new Texture("fondo_gameOver", new Vector2(50, 300), new Vector2(100, 100), "path/texture.png");
let button = new Button("playButton", new Vector2(50, 50), new Vector2(150, 50), "buttonNormal.png", "buttonPressed.png");

this.add_child(fondo_gameOver); // se añade a la escena
fondo_gameOver.add_child(button); // añade el boton como hijo de la Textura 

 ```
## Objetos del Mundo:

### `GameObject`

`GameObject` es un objeto vacío que actúa como un contenedor en la jerarquía de objetos del juego. Este objeto puede tener hijos, comportamientos personalizados y propiedades adicionales según sea necesario en una escena. Es ideal para gestionar la estructura de objetos en un juego sin que tenga funcionalidades propias específicas.

#### Constructor:
```javascript
constructor(name, pos, scale)
```
- **name**: `String` - Nombre del objeto.
- **pos**: `Vector2` - Posición inicial del objeto
- **scale**: `Vector2` - Escala del objeto

#### Propiedades:

 - **visible**: Determina si el objeto es visible o no (booleano), por defecto todos son `true`.
 - **layer**: La capa en la que se renderiza el objeto, por defecto todos son `0`.
 - **velocity**: Es un `Vector2` usado para aplicar velocidad a el objeto.

#### Metodos:

 - `is_in_floor`: Devuelve `true` si el objeto está en el suelo.
 - `destroy`: Elimina el objeto de su padre.
 - `add_child`: Añade un hijo al objeto, objetos que permite: `Timer`, `GameObject`, `RenderShape`, `Text`, `Sprite`, `AnimatedSprite`, `AudioPlayer`, `ParticleSystem` y `BoxCollider`.

#### Ejemplo de Uso:
 ```javascript
 // dentro de la funcion ready de la escena
let player = new GameObject("player", new Vector2(50, 300), new Vector2(100, 100));
let sprite = new Sprite("sprite_player", new Vector2(50, 50), new Vector2(150, 50), "sprite.png");

this.add_child(player); // se añade a la escena
player.add_child(sprite); // añade como hijo de el objeto 
 ```

### `RenderShape`

`RenderShape` es una clase que permite renderizar formas geométricas simples en la pantalla. Extiende de `GameObject` y proporciona funcionalidades específicas para dibujar diferentes tipos de formas, como rectángulos, círculos y triángulos.

#### Constructor:
```javascript
constructor(name, pos, scale, shape, color)
```
- **name**: `String` - Nombre del objeto.
- **pos**: `Vector2` - Posición inicial del objeto
- **scale**: `Vector2` - Escala del objeto
- **shape**: `String` - Tipo de forma a renderizar. Puede ser `Rectangle`, `Circle` o `Triangle`. Por defecto, es `Rectangle`.
- **color**: `String` - Color de la forma en formato de `cadena`, `hexadecimal` o `RGBA`. Por defecto, es `white`.

#### Propiedades:

 - **visible**: Determina si el objeto es visible o no (booleano), por defecto todos son `true`.
 - **layer**: La capa en la que se renderiza el objeto, por defecto todos son `0`.
- **velocity**: Es un `Vector2` usado para aplicar velocidad a el objeto.

#### Metodos:

 - `is_in_floor`: Devuelve `true` si el objeto está en el suelo.
 - `destroy`: Elimina el objeto de su padre.
 - `add_child`: Añade un hijo al objeto, objetos que permite: `Timer`, `GameObject`, `RenderShape`, `Text`, `Sprite`, `AnimatedSprite`, `AudioPlayer`, `ParticleSystem` y `BoxCollider`.

#### Ejemplo de Uso:
 ```javascript
 // dentro de la funcion ready de la escena
let box = new RenderShape("box", new Vector2(50, 300), new Vector2(100, 100), "Triangle", "black");

this.add_child(box); // se añade a la escena
 ```

### `Text`

La clase `Text` se utiliza para renderizar texto en el mundo. Es una clase simple que permite mostrar textos con varias propiedades configurables, como el tamaño, la fuente y el color.

#### Constructor:

```javascript
constructor(text, pos, size, font, color) 
```
- **text**: El contenido del texto que se va a renderizar.
- **pos**: Un objeto `Vector2` que representa la posición inicial del texto en la pantalla.
- **size**: El tamaño del texto en píxeles.
- **font**: La fuente del texto (por ejemplo, `Arial`, `Verdana`, etc.).
- **color**: El color del texto en formato de cadena (por ejemplo, `black`, `#FFFFFF`, etc.).

 #### Propiedades:

 - **visible**: Determina si el texto es visible o no (booleano), por defecto todos son `true`.
 - **layer**: La capa en la que se renderiza el texto, por defecto todos son `0`.

 #### Ejemplo de Uso:
 ```javascript
 // dentro de la funcion ready de la escena
 let puntos = new Text("1000", new Vector2(100, 50), 24, "Arial", "white");
 this.add_child(puntos);

 ```

### `Sprite`

`Sprite` es una clase que permite renderizar imágenes o texturas en la pantalla. Extiende de `GameObject` y se utiliza comúnmente para representar personajes, objetos y elementos visuales en el juego.

#### Constructor:
```javascript
constructor(name, pos, scale, path)
```
- **name**: `String` - Nombre del objeto.
- **pos**: `Vector2` - Posición inicial del objeto
- **scale**: `Vector2` - Escala del objeto
- **path**: `String` - Ruta de la imagen o textura que se va a renderizar.

#### Propiedades:

 - **visible**: Determina si el objeto es visible o no (booleano), por defecto todos son `true`.
 - **layer**: La capa en la que se renderiza el objeto, por defecto todos son `0`.
 - **flip_h**: Indica si la textura debe ser volteada horizontalmente. Por defecto es `false`.
 - **flip_v**: Indica si la textura debe ser volteada verticalmente. Por defecto es `false`.
 - **velocity**: Es un `Vector2` usado para aplicar velocidad a el objeto.

#### Metodos:

 - `is_in_floor`: Devuelve `true` si el objeto está en el suelo.
 - `destroy`: Elimina el objeto de su padre.
 - `add_child`: Añade un hijo al objeto, objetos que permite: `Timer`, `GameObject`, `RenderShape`, `Text`, `Sprite`, `AnimatedSprite`, `AudioPlayer`, `ParticleSystem` y `BoxCollider`.

#### Ejemplo de Uso:
 ```javascript
 // dentro de la funcion ready de la escena
let box = new Sprite("box", new Vector2(50, 300), new Vector2(100, 100), "box.png");

this.add_child(box); // se añade a la escena
 ```

### `SpriteSheet`

`SpriteSheet` es una clase diseñada para manejar y almacenar sprites de una hoja de sprites (sprite sheet). Esta clase permite dividir una imagen grande en múltiples sprites más pequeños, facilitando su uso en juegos y aplicaciones gráficas.

#### Constructor:
```javascript
constructor(name, path, colum, filas)
```

- **name**: `String` - Nombre de la hoja de sprites.
- **path**: `String` - Ruta de la imagen de la hoja de sprites que se va a cargar.
- **colum**: `Int` - Numero de columnas.
- **filas**: `Int` - Numero de filas.

#### Ejemplo de Uso:
 ```javascript
 // dentro de la funcion ready de la escena
let idle = new SpriteSheet("idle", "spriteSheet_idle.png", 4, 1);
 ```

### `AnimatedSprite`

`AnimatedSprite` es una clase diseñada para manejar la representación y animación de sprites en un juego. Permite reproducir una secuencia de imágenes que representan diferentes estados o movimientos de un objeto, creando así una animación fluida.

#### Constructor:
```javascript
constructor(name, pos, scale, animations, speed)
```

- **name**: `String` - Nombre del objeto.
- **pos**: `Vector2` - Posición inicial del objeto
- **scale**: `Vector2` - Escala del objeto
- **animations**: `Array` - Array de objetos que contienen las animaciones disponibles para este sprite.
- **speed**: `Float` - Velocidad de reproducción de la animación (en segundos por cuadro). Si no se proporciona, se establece en 0.3.

#### Propiedades:

 - **visible**: Determina si el objeto es visible o no (booleano), por defecto todos son `true`.
 - **layer**: La capa en la que se renderiza el objeto, por defecto todos son `0`.
 - **flip_h**: Indica si la textura debe ser volteada horizontalmente. Por defecto es `false`.
 - **flip_v**: Indica si la textura debe ser volteada verticalmente. Por defecto es `false`.
 - **velocity**: Es un `Vector2` usado para aplicar velocidad a el objeto.
 - **loop**: Booleano que indica si la animación debe repetirse en bucle.
 - **animation_finish**: Booleano que indica si la animación ha terminado.

#### Metodos:

 - `is_in_floor`: Devuelve `true` si el objeto está en el suelo.
 - `destroy`: Elimina el objeto de su padre.
 - `add_child`: Añade un hijo al objeto, objetos que permite: `Timer`, `GameObject`, `RenderShape`, `Text`, `Sprite`, `AnimatedSprite`, `AudioPlayer`, `ParticleSystem` y `BoxCollider`.
 - `play`: Inicia la animación especificada. Si la animación actual es diferente.
 - `stop`: Detiene la animación actual.
 - `animation_finish_name`: funcion `undefined` que devuelve el nombre de la animacion que finalizo.

#### Ejemplo de Uso:
 ```javascript
    // dentro de la funcion ready de la escena
    animIdle = new SpriteSheet("idle", "img/pers_idle.png", 4, 1);
    animRun = new SpriteSheet("run", "img/pers_run.png", 6, 1);
    animJumpDown = new SpriteSheet("jump_down", "img/pers_jump_down.png", 3, 1);
    animJumpUp = new SpriteSheet("jump_up", "img/pers_jump_up.png", 3, 1);
    let animations = [animIdle, animRun, animJumpUp, animJumpDown];

    pers = new AnimatedSprite("player", new Vector2(100, 50), new Vector2(100, 100), animations, 0.08);
    pers.play("idle"); // se inicia la animacion con el nombre de la clase SpriteSheet
    this.add_child(pers); // se añade a la escena
    pers.loop = false; // apaga el loop para que se ejecute la funcion animation_finish_name;

    // dentro de la funcion process de la escena
    pers.animation_finish_name = function(name) // esta funcion se ejecuta siempre y cuando la animacion no este en loop
    {
        if (name === "idle")
        {
            print("la animacion idle finalizo");
        }
    };
 ```

### `ParallaxBackground`

`ParallaxBackground` es una clase que gestiona el fondo en movimiento (parallax) de una escena. Este fondo sigue a la cámara y contiene varias capas (`ParallaxLayer`), permitiendo crear un efecto de profundidad con el desplazamiento de diferentes capas a diferentes velocidades.

#### Constructor:
```javascript
constructor(name, pos)
```
- **name**: `String` - Nombre del objeto.
- **pos**: `Vector2` - Posición inicial del objeto

#### Propiedades:

 - **visible**: Determina si el objeto es visible o no (booleano), por defecto todos son `true`.
 - **layer**: La capa en la que se renderiza el objeto, por defecto todos son `0`.

#### Metodo:

 - `add_child`: Añade un hijo al objeto, objetos que permite: `ParallaxLayer`.

#### Ejemplo de Uso:
 ```javascript
    // dentro de la funcion ready de la escena
    background = new ParallaxBackground("background", new Vector2());
    this.add_child(background);
 ```

### `ParallaxLayer`

`ParallaxLayer` es una clase que extiende a `ParallaxBackground` y se utiliza para crear capas individuales dentro de un fondo parallax. Cada capa puede tener su propia imagen, velocidad de desplazamiento, y escala, lo que permite crear el efecto de profundidad al mover la cámara en un juego.

#### Constructor:
```javascript
constructor(name, pos, scale, image, moveSpeed)
```

- **name**: `String` - Nombre de la capa parallax.
- **pos**: `Vector2` - Posición inicial de la capa.
- **scale**: `Vector2` - Tamaño de la capa (ancho y alto).
- **image**: `String` - Ruta de la imagen de la capa.
- **moveSpeed**: `Float` - Velocidad de desplazamiento de la capa cuando la cámara se mueve.

#### Propiedades:

 - **visible**: Determina si el objeto es visible o no (booleano), por defecto todos son `true`.
 - **layer**: La capa en la que se renderiza el objeto, por defecto todos son `0`.
 - **offset**: Valor de desplazamiento horizontal de la capa, utilizado para repetir la imagen y simular un desplazamiento continuo.

#### Ejemplo de Uso:
 ```javascript
    // dentro de la funcion ready de la escena
    background = new ParallaxBackground("background", new Vector2());
    this.add_child(background); // se añade a la escena
    layer1 = new ParallaxLayer("layer1", new Vector2(), new Vector2(anchoVentana, altoVentana), "parallax.png", 1);
    background.add_child(layer1); // se añade al objeto background
 ```

### `AudioPlayer`

`AudioPlayer` es una clase utilizada para manejar la reproducción de sonidos dentro del juego. Permite reproducir, detener y ajustar el volumen de los sonidos en función de la distancia del objeto con respecto a la cámara, lo que simula un efecto de proximidad auditiva.

#### Constructor:
```javascript
constructor(name, pos, audio, loop = false)
```
- **name**: `String` - Nombre del objeto de audio.
- **pos**: `Vector2` - Posición inicial del audio en el juego.
- **audio**: `String` - Ruta del archivo de audio a reproducir.
- **loop**: `Boolean` - Determina si el audio debe repetirse en bucle. Por defecto, es `false`.

#### Propiedades:

 - **loop**: Define si el audio se repite en bucle.

#### Metodos:

 - `setLoop`: Ajusta si el audio debe repetirse en bucle.
 - `play`: Reproduce el sonido si no está ya en reproducción y si el objeto es visible para la cámara. Si el sonido no está en bucle, se reproduce solo una vez.
 - `stop`: Detiene el sonido.

#### Ejemplo de Uso:
 ```javascript
    // dentro de la funcion ready de la escena
    musica_fondo = new AudioPlayer("music", new Vector2(), "music.mp3", true);
    this.add_child(musica_fondo);
    musica_fondo.play();

    // añadir sonido a un objeto
    pelota = new Sprite("pelota", new Vector2(100, 100), new Vector2(50, 50), "pelota.png");
    this.add_child(pelota);
    sound = new AudioPlayer("sound", new Vector2(), "music.mp3", false);
    pelota.add_child(sound);
    sound.play();
 ```

### `ParticleSystem`

`ParticleSystem` es una clase utilizada para gestionar y renderizar sistemas de partículas en el juego. Genera partículas en una posición específica, actualiza su comportamiento y las elimina cuando ya no son visibles o están "muertas".

#### Constructor:
```javascript
constructor(pos, color)
```
- **pos**: `Vector2` - La posición inicial donde se emiten las partículas.
- **color**: `String` - El color de las partículas en RGB, ejemplo: "255, 255, 255".

#### Propiedades:

 - **visible**: Determina si el objeto es visible o no (booleano), por defecto todos son `true`.

#### Metodo:

 - `emit`: Genera nuevas partículas en la posición actual.

#### Ejemplo de Uso:
 ```javascript
    // dentro de la funcion ready de la escena
    particle = new ParticleSystem(new Vector2(10, 10), "255, 0, 0");
    this.add_child(particle);

    // dentro de la funcion process de la escena
    particle.emit();
 ```

### `BoxCollider`

`BoxCollider` es una clase que extiende de `GameObject` y se utiliza para gestionar colisiones en el motor de juego. Define un área rectangular (caja) que puede detectar colisiones con otros objetos, y tiene una capa y una máscara para gestionar con qué puede colisionar.

#### Constructor:
```typescript
constructor(name, pos, scale, layer, mask, type)
```

- **name**: `String` - Nombre del colisionador.
- **pos**: `Vector2` - Posición inicial del colisionador.
- **scale**: `Vector2` - Tamaño del colisionador.
- **layer**: `Int` - Capa de colisión en la que se encuentra el colisionador.
- **mask**: `Array` o `Int` - Máscara de colisión, puede ser un array o un número que define con qué capas puede colisionar.
- **type**: `String` - Tipo de colisionador, por defecto es `Trigger`, pero puede tener otros valores como `Static`, `Plataform`, `CharacterBody` y `RigidBody`.

 #### Nota:
  - El `CharacterBody` es especial para los objetos que seran controlados por el usuario como ("Player").
  - El `RigidBody` es especial para objetos como cajas u otros.
  - El `Plataform` es especial para objetos estaticos pero con colision de plataforma.
  - El `Static` es especial para objetos estaticos como suelos paredes y otros.
  - El `Trigger` es especial para detectar cuando un objeto entra en contacto con otro sin colision solida.

#### Propiedades:

 - **visible**: Determina si el objeto es visible o no (booleano), por defecto  es `false`.
 - **layer**: La capa en la que se renderiza el objeto, por defecto es `10`.
 - **collision_layer**: Capa de colisión en la que se encuentra el colisionador.

#### Metodos:

 - `set_collision_mask`: Añade una nueva máscara de colisión.
 - `is_trigger_enter`: funcion `undefined` que deve ser creada por el usuario que se ejecuta si un collider entra en otro.
 - `is_trigger_exit`: funcion `undefined` que deve ser creada por el usuario que se ejecuta cuando un collider sale de otro.

 #### Ejemplo de Uso Colision Trigger:
 ```javascript
    // dentro de la funcion ready de la escena

    // objetos
    box = new Sprite("box", new Vector2(50, 300), new Vector2(100, 100), "box.png");
    box2 = new Sprite("box2", new Vector2(50, 300), new Vector2(100, 100), "box.png");
    this.add_child(box); // se añaden a la escena
    this.add_child(box2);
    // colisiones
    colision_box = new BoxCollider("box1", new Vector2(), new Vector2(100, 100), 1, 2, "Trigger");
    colision_box2 = new BoxCollider("box2", new Vector2(), new Vector2(100, 100), 2, 1, "Trigger");
    box.add_child(colision_box); // se añaden como colision de los objetos
    box2.add_child(colision_box2);

    // dentro de la funcion process de la escena

    colision_box.is_trigger_enter = function(body)
    {
        print(`el objeto ${box.name} colisiono con ${body.name}`); // entro en colision
    }

    colision_box.is_trigger_exit = function(body)
    {
        print(`el objeto ${box.name} salio de ${body.name}`); // salio de colision
    }

 ```
