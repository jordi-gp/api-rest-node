const mongoose = require('mongoose');

const connection = async() => {
    try {
        
        let dataBaseUrl = 'mongodb://127.0.0.1:27017/mi_blog'
        await mongoose.connect(dataBaseUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        /*
            Posibles parametros a pasar en caso de tener algún aviso:
                useNewUrlParser: true
                useUnifiedTopology: true
                useCreateIndex: true
        */
        
        console.log('La conexión a la base de datos mi_blog ha sido un éxito');
    } catch(error) {
        console.log(error);
        throw new Error('Ha ocurrido un problema al realizar la conexión con la base de datos');
    }
}

module.exports = {
    connection
}