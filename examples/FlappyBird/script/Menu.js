let play;

let Menu =
{
    name: "Menu",
    ready()
    {
        deleteData("tuto");
        // Fondo de desplazamiento para simular movimiento en el cielo
        let bg = new ParallaxBackground("bg", new Vector2());
        this.add_child(bg);

        // Capa de fondo que representa el cielo
        let fondo = new SpriteSheet("fondo", new Vector2(0, 0), new Vector2(1, 1), new Vector2(144, 256), "./assets/flappy.png");
        let layer1 = new ParallaxLayer("layer1", new Vector2(), new Vector2(config.width, config.height), fondo, 0);
        bg.add_child(layer1);

        // Texto Flappy bird
        let nameImg = new SpriteSheet("name", new Vector2(3.5, 3), new Vector2(1, 1), new Vector2(98, 29), "./assets/flappy.png");
        let name = new Texture("img", new Vector2((config.width/ 2)-130, 100), new Vector2(250, 80), nameImg);
        this.add_child(name);

        // boton para iniciar el juego
        let playImg = new SpriteSheet("btnPlay", new Vector2(6, 3), new Vector2(1, 1), new Vector2(59, 39), "./assets/flappy.png");
        play = new TextureButton("play", new Vector2((config.width/2)- 50, 300), new Vector2(100, 80), playImg, playImg);
        this.add_child(play);

        let nota = new Label("Este es un pequeño ejemplo del uso de TOR2D version 2.0.2.",new Vector2(5, config.height - 50), 10,"Verdana", "black");
        let nota2 = new Label("creditos de los Assets a sus respectivos dueños.",new Vector2(5, config.height - 30), 10,"Verdana", "black");
        this.add_child(nota);
        this.add_child(nota2);
       
    },
    process(delta)
    {
        if (play.isDown())
        {
            let pos = play.position;
            play.position = pos.add(new Vector2(10, 10));
            play.scale = 0.8;
            
        }
        if (play.isUp()) tor2d.change_scene(Game);
        
    }
};

tor2d.start(Menu);