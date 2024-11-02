let config =
{
    container: "contenedor",
    width: 800,
    height: 600,
    texture_filter: false,
    debugs: true,
    color: "gray"
};

let tor2d = new TOR2D(config);

let Main =
{
    name: "Main",
    ready() // crea y añade los objetos a la escena
    {
        let texto = new Label("¡Hola mundo!", new Vector2(200, 200), 50, "Verdana", "blue");
        this.add_child(texto);
        
    },
    process(delta) // procesa la logica de tu juego
    {
        
    }
};
tor2d.start(Main);