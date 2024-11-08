// Configuración inicial del motor Tor2D
let config = {
    container: "contenedor", // ID del contenedor HTML donde se renderiza el juego
    width: 400,               // Ancho de la ventana del juego
    height: 600,              // Alto de la ventana del juego
    texture_filter: false,    // Filtro de textura desactivado para mostrar correctamente el pixel art
    debugs: false            // Modo debug desactivado
};

// Creación de la instancia del motor de juego
let tor2d = new TOR2D(config);

// Variables del juego
let layer2, bird, gravedad = 2100, salto = -300, grados = 0;
let cielo, gameover = false, tubos = [];
let distanceTubos = 2, speedTubos = 150, tuto;
let trigger, puntos = 0, lastPuntos = 0, puntos_text, time, ventana, point, lastPoit, oreMedalla, plataMedalla, getReady;
let boton_replay, boton_menu, oreMedallaKey = false, plataMedallaKey = false, textNew, textNewKey = false, pause = false, tutoKey = false;
let sound_jump, sound_die, sound_hit, sound_point, sound_swoosh; 

// Definición de la escena Game del juego
let Game =
{
    name: "Game",
    ready() // Función que se ejecuta al inicio para configurar los objetos y elementos de la escena
    {
        // Fondo de desplazamiento para simular movimiento en el cielo
        let bg = new ParallaxBackground("bg", new Vector2());
        this.add_child(bg);

        // Capa de fondo que representa el cielo
        let fondo = new SpriteSheet("fondo", new Vector2(0, 0), new Vector2(1, 1), new Vector2(144, 256), "./assets/flappy.png");
        let layer1 = new ParallaxLayer("layer1", new Vector2(), new Vector2(config.width, config.height), fondo, 0);
        bg.add_child(layer1);

        // Capa de desplazamiento para el suelo
        let piso = new SpriteSheet("ground", new Vector2(2, 0), new Vector2(1, 1), new Vector2(146, 50), "./assets/flappy.png");
        layer2 = new ParallaxLayer("layer2", new Vector2(0, config.height- 100), new Vector2(config.width, 100), piso, 0);
        bg.add_child(layer2);
        
        // Configuración del jugador "bird" (pájaro) con animación
        bird = new GameObject("Player", new Vector2(100, 200), new Vector2(100, 100));
        this.add_child(bird);
        let animBird = new SpriteSheet("idle", new Vector2(0, 22), new Vector2(3, 1), new Vector2(28 , 22), "./assets/flappy.png");
        bird.anim = new AnimatedSprite("anim", new Vector2(), bird.size, [animBird], 0.1);
        bird.add_child(bird.anim);
        bird.anim.play("idle");

        // Colisionador del jugador (caja que define el área de colisión)
        bird.colis = new BoxCollider("solid", new Vector2(-7, 8), new Vector2(57, 55), 1, 3, "CharacterBody");
        bird.add_child(bird.colis);

        // Trigger para detectar puntos y colisiones
        trigger = new GameObject("objetoTrigger", new Vector2(), bird.size);
        trigger.colis = new BoxCollider("colis", new Vector2(-7, 8), new Vector2(57, 55), 2, [4, 5], "Trigger");
        trigger.add_child(trigger.colis);
        bird.add_child(trigger);
        
        // Techo invisible que delimita el movimiento vertical del pájaro
        cielo = new GameObject("cielo", new Vector2(0, -10), new Vector2(config.width, 10));
        cielo.colis = new BoxCollider("solid", new Vector2(), cielo.size, 3, 1, "Static");
        cielo.add_child(cielo.colis);
        this.add_child(cielo);

        // Función para generar obstáculos (tubos)
        let  spawner =()=>
        {
            if (!tutoKey) return; // No genera tubos si el tutorial no ha terminado

            // Configuración de una caja con colisiones que detecta al player para sumar los puntos
            let box = new GameObject("box", new Vector2(config.width+ 60, random(100, 300)), new Vector2(60, 150));
            box.colis = new BoxCollider("colis", new Vector2(), new Vector2(60, 150), 4, 2, "Trigger");
            box.instantiate(); // genera un nombre unico para que se puedan añadir a la escena 
            box.add_child(box.colis);
            box.velocity.x = -speedTubos;
            box.layer = -1;

            // recortes de los tubos superior e inferior
            let down = new SpriteSheet("tuboDown", new Vector2(3, 2), new Vector2(1, 1), new Vector2(28, 159), "./assets/flappy.png");
            let up = new SpriteSheet("tuboUp", new Vector2(2, 2), new Vector2(1, 1), new Vector2(28, 162), "./assets/flappy.png");

            // Creación del tubo superior con colisión
            let tuboUp = new Sprite("tuboUp", new Vector2(0, -320), new Vector2(50, 500), up);
            tuboUp.colis = new BoxCollider("colisUp", new Vector2(), new Vector2(50, 480), 5, 2, "Trigger");
            tuboUp.add_child(tuboUp.colis);
            box.add_child(tuboUp);

            // Creación del tubo inferior con colisión
            let tuboDown = new Sprite("tuboDown", new Vector2(0, 315), new Vector2(50, 500), down);
            tuboDown.colis = new BoxCollider("colisDown", new Vector2(), new Vector2(50, 470), 5, 2, "Trigger");
            tuboDown.add_child(tuboDown.colis);
            box.add_child(tuboDown);

            // Agrega el tubo a la escena y lo guarda en el arreglo de tubos
            this.add_child(box);
            tubos.push(box);
        };
        
        // Configuración del temporizador para generar tubos cada cierto tiempo
        time = new Timer(distanceTubos);
        this.add_child(time);
        time.start(spawner);

        // Texto para mostrar los puntos del jugador en pantalla
        puntos_text = new Label(""+puntos, new Vector2((config.width / 2)- 40, 20), 80, "Verdana", "white");
        this.add_child(puntos_text);
        
        // Ventana de fin de juego
        let vent = new SpriteSheet("vent", new Vector2(0, 4), new Vector2(1, 1), new Vector2(120, 64.5), "./assets/flappy.png");
        ventana = new Texture("ventana", new Vector2((config.width/2)- 150, (config.height/2)- 100), new Vector2(300, 200), vent);
        this.add_child(ventana);
        ventana.visible = false;

        // Texto para mostrar puntos obtenidos en la ventana de fin de juego
        point = new Label("0", new Vector2(200, 60), 30, "Verdana", "white");
        ventana.add_child(point);

        // Texto para mostrar el último puntaje máximo
        lastPoit = new Label("0", new Vector2(200, 120), 30, "Verdana", "white");
        ventana.add_child(lastPoit);
        
        // Texto de game Over
        let gameoverimg = new SpriteSheet("text", new Vector2(4, 2), new Vector2(1, 1), new Vector2(98.5, 28), "./assets/flappy.png");
        let gameOverImg = new Texture("img", new Vector2(25, -70), new Vector2(250, 80), gameoverimg);
       ventana.add_child(gameOverImg);

       //medalla de oro 
       let imgOreMedalla = new SpriteSheet("imgOreMedalla", new Vector2(5, 12), new Vector2(1, 1), new Vector2(24, 23.4), "./assets/flappy.png");
       oreMedalla = new Texture("oreMedalla", new Vector2(35, 60), new Vector2(60, 80), imgOreMedalla);
       oreMedalla.visible = false;
       ventana.add_child(oreMedalla);

       // medalla de plata
       let imgPlataMedalla = new SpriteSheet("imgPlataMedalla", new Vector2(5, 11), new Vector2(1, 1), new Vector2(24, 23.4), "./assets/flappy.png");
       plataMedalla = new Texture("plataMedalla", new Vector2(35, 60), new Vector2(60, 80), imgPlataMedalla);
       plataMedalla.visible = false;
       ventana.add_child(plataMedalla);

       // boton para reiniciar el juego
       let botonUp = new SpriteSheet("btnUp", new Vector2(6, 3), new Vector2(1, 1), new Vector2(59, 39), "./assets/flappy.png");
       boton_replay = new TextureButton("replay", new Vector2((ventana.size.x/2)- 60, 185), new Vector2(120, 80), botonUp, botonUp);
       ventana.add_child(boton_replay);
       boton_replay.disabled = true;
       
       // carga las variables guardadas en memoria
       plataMedallaKey = loadData("plataMedalla") ? loadData("plataMedalla"): false;
       oreMedallaKey = loadData("oreMedalla") ? loadData("oreMedalla"): false;
       textNewKey = loadData("new") ? loadData("new"): false;
       
       // Texto new que indica si la medalla fue apenas obtenida
       let textNewImg = new SpriteSheet("newImg", new Vector2(4, 25), new Vector2(1, 1), new Vector2(26, 20), "./assets/flappy.png");
       textNew = new Texture("textNew", new Vector2(25, 60), new Vector2(50, 50), textNewImg);
       textNew.setRotation(-40);
       textNew.visible = false;
       ventana.add_child(textNew);

       //boton de pausa
       let btnPause = new SpriteSheet("btnPause", new Vector2(7, 18), new Vector2(1, 1), new Vector2(17, 17), "./assets/flappy.png");
       boton_pause = new TextureButton("boton_pause", new Vector2((config.width - 70), 20), new Vector2(50, 50), btnPause, btnPause);
       this.add_child(boton_pause);
       
        // imagen que indica que toquen la pantalla o den chick para iniciar el juego
       let imgReady = new SpriteSheet("ready", new Vector2(3, 2), new Vector2(1, 1), new Vector2(98.5, 28), "./assets/flappy.png");
       getReady = new Texture("getReady", new Vector2((config.width/2)- 125, 100), new Vector2(250, 80), imgReady);
       this.add_child(getReady);

       let imgTuto = new SpriteSheet("imgTuto", new Vector2(5, 1.5), new Vector2(1, 1), new Vector2(58, 56), "./assets/flappy.png");
       tuto = new Texture("tuto", new Vector2((config.width/2)- 100, getReady.position.y + 250), new Vector2(150, 150), imgTuto);
       this.add_child(tuto);

       // boton para volver al menu
       let imgMenu = new SpriteSheet("btnMenu", new Vector2(21, 9), new Vector2(1, 1), new Vector2(15.9, 15.5), "./assets/flappy.png");
       boton_menu = new TextureButton("boton_menu", new Vector2(ventana.size.x - 50, ventana.size.y + 100), new Vector2(80, 80), imgMenu, imgMenu);
       ventana.add_child(boton_menu);

       // muestra las imagenes del tutorial una unica vez al entrar a la escena Game
       tutoKey = loadData("tuto") || false;
       getReady.visible = !tutoKey;
       tuto.visible = !tutoKey;
       boton_pause.visible = tutoKey;
       boton_pause.disabled = !tutoKey;
       puntos_text.visible = tutoKey;
       bird.layer = 1;

       //sonidos
        sound_jump = new AudioPlayer("soundJump", "./assets/audio/wing.ogg");
        bird.add_child(sound_jump);
        sound_hit = new AudioPlayer("soundHit", "./assets/audio/hit.ogg");
        bird.add_child(sound_hit);
        sound_point = new AudioPlayer("soundPoint", "./assets/audio/point.ogg");
        this.add_child(sound_point);
        sound_die = new AudioPlayer("soundDie", "./assets/audio/die.ogg");
        bird.add_child(sound_die);
        sound_swoosh = new AudioPlayer("soundSwoosh", "./assets/audio/swoosh.ogg");
        this.add_child(sound_swoosh);
        
    },
    process(delta) // procesa la logica de tu juego
    {
        layer2.offset -= 2; // desplasa el parallaxLayer del suelo hacia la hizquierda para simular movimiento
        puntos_text.text = puntos; // actualiza el texto de los puntos 
        lastPuntos = puntos > lastPuntos ? puntos: lastPuntos; // actualiza el valor si los puntos superan a el mayor puntaje
        time.time = distanceTubos; // actualiza el tiempo de spawner de los tubos 

        // aplica gravedad al pajaro si el tutorial ya se hizo.
        if (tutoKey) bird.velocity.y += gravedad * delta;

        // Controla la rotación del pájaro para simular el movimiento de caída
        if (puntos === 100 && !plataMedallaKey)
        {
            plataMedallaKey = true;
            saveData("plataMedalla", true);
            textNewKey = true;
            textNew.visible = true;
        } else if (puntos === 500 && !oreMedallaKey)
        {
            oreMedallaKey = true;
            saveData("oreMedalla", true);
            textNewKey = true;
            textNew.visible = true;
        }

        if (bird.velocity.y > 0 && grados < 15) 
        {
            bird.setRotation(grados);
            grados += 1;
        } else if (bird.velocity.y < 0 && grados > -15)
        {
            bird.setRotation(grados);
            grados -= 1;
        }

        // Al hacer clic, si el juego no ha terminado, el pájaro "salta"
        if (Input.isMouseDown() && !gameover)
        {
            if (!tutoKey) // Inicia el juego si es el primer clic
            {
                saveData("tuto", true);
                tutoKey = true;
                getReady.visible = false;
                tuto.visible = false;
                boton_pause.visible = true;
                boton_pause.disabled = false;
                puntos_text.visible = true;
            }
            sound_jump.play(); // inicia el sonido al saltar
            bird.velocity.y = salto; // Establece la velocidad de salto
        } 


        // Si el pájaro se sale de la pantalla, termina el juego
        if (!isVisible(bird)) 
        {
            if (!gameover) sound_swoosh.play();
            bird.destroy();
            gameover = true;
            time.stop();
            ventana.visible = true;
            puntos_text.visible = false;
            point.text = puntos;

            // Actualiza el puntaje máximo guardado
            lastPuntos = loadData("lastPoint") ? loadData("lastPoint"): 0;
            lastPoit.text = lastPuntos;
            if (puntos > lastPuntos) saveData("lastPoint", puntos);

            // Muestra las medallas según el puntaje
            plataMedalla.visible = !oreMedallaKey ? plataMedallaKey: false;
            oreMedalla.visible = oreMedallaKey;
            boton_replay.disabled = false;
            boton_pause.visible = false;
            boton_pause.disabled = true;
        } 

        // Elimina los tubos que están fuera de la pantalla
        tubos.forEach(obj =>{
            if (obj.position.x + obj.size.x < 0) obj.destroy();
        });

        // Incrementa puntos cuando el pájaro pasa el trigger de la caja de puntos que esta en medio de los tubos
        trigger.is_trigger_exit = function()
        {
            if (!gameover) 
            {
                puntos++;
                sound_point.play();
            }
        }

        // Termina el juego si el pájaro choca con un tubo
        trigger.is_trigger_enter = function(body)
        {
            if (body.name === "tuboUp" || body.name === "tuboDown")
            {
                if (!gameover) sound_hit.play(), sound_die.play(); // inicia el sonido al tocar un tubo
                gameover = true;
                
            }
        }
        
        // Ajusta la frecuencia de aparición de tubos cuando se alcanzan 50 puntos
        if (puntos === 50) distanceTubos = 1.5;

        // Reinicia el juego si se presiona el botón de replay
        if (boton_replay.isDown())
        {
            let pos = boton_replay.position;
            boton_replay.position = pos.add(new Vector2(10, 10));
            boton_replay.scale = 0.8;
            if (textNewKey)
            {
                saveData("new", false);
            }
            tor2d.reload_scene() // Recarga la escena para reiniciar el juego
        } 

        // Pausa y reanuda el juego al presionar el botón de pausa
        if (boton_pause.isDown() && !gameover)
        {
            if (!pause) pause_scene(true), pause = true;
            else if (pause) pause_scene(false), pause = false;
        } 
        
        // boton menu, vuelve a la escena menu
        if (boton_menu.isDown()) tor2d.change_scene(Menu);
    }
};

// Inicia el juego con la configuración del objeto Game
tor2d.add_scene(Game);