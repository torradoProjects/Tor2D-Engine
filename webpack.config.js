// webpack.config.js
const path = require('path');

module.exports = {
  entry: './lib/Import.js', // Cambia esto a tu archivo principal
  output: {
    filename: 'tor2d.js', // El archivo de salida que contendrá tu motor de juego 
    path: path.resolve(__dirname, 'build'), // La carpeta donde se guardará el archivo
    libraryTarget: 'window',  // Hace que cada exportación sea una variable global
  },
  mode: 'production', // Usa 'development' para incluir comentarios y no minificar el código
};
