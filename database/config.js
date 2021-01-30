/**
 * Mongoose provides a straight-forward, schema-based solution to model your application data. 
 * It includes built-in type casting, validation, query building, 
 * business logic hooks and more, out of the box.
 * 
 * 
 * Toda la configuración para conectarnos a la base de datos(MongoDB), 
 * utilizando Mongoose (npm i mongoose).
 * */

const mongoose = require('mongoose');

const dbConnect = async() => {
    try {
        await mongoose.connect(process.env.DB_CONNECTION, {
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            //En consola especifica que la opción useCreateIndex no está soportada
            useCreateIndex: true,//No viene preconfigurada pero es "necesaria"
            useFindAndModify: false,
        });

        console.log('DATABASE CONECTADA');

    } catch (err) {

        console.log(err);
 
        throw new Error('Error al intentar inicializar la conexión con la base de datos');

    }
}

module.exports = {
    dbConnect
}