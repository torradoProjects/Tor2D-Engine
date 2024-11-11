//*********************************************************************************//
//                            // VARIABLES GLOBALES //                             //
//*********************************************************************************//
export let SceneTree = []; // arbol de escenas 
export let currentScene = null; // escena que se esta ejecutando        
export let canvas = null; // canvas principal  
export let ctx = null; // contexto del canvas principal 
export let bufferCanvas = null;//canvas que es usado como bufer para renderizar todo 
export let bufferCtx = null; // contexto del canvas bufer 
export let uiCanvas = null; // canvas que contiene los objetos de la interfaz 
export let uiCtx = null; // contexto del canvas usado como interfaz
export let debugs = false; // bandera para renderizar todas las colisiones y mostrar FPS  
export let spatialGrid = null; // grig espacila de las colisiones
export let collisions = []; 
//*********************************************************************************//