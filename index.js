const { connection } = require('./database/connection');
const express = require('express');
const cors = require('cors');

//Inicialización de la app
console.log('App iniciada');

//Servidor de node en express
const app = express();
const port = 3900;

//Configuración de cors
app.use(cors());

//Conversión del body a objeto JS
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Definición de rutas
const articleRoutes = require('./routes/ArticleRoute');

//Cargado de rutas
app.use('/api', articleRoutes);

//Creación del servidor y escucha de peticions HTTP
app.listen(port, () => {
    connection();
    console.log('Servidor corriendo en el puerto ' + port);
});
