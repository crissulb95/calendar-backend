/**   -Para comenzar el armado y configuración del servidor, es necesario instalar nodemon para que se
 * mantenga escuchando cada cambio que hay en la aplicación (en este caso el comando nodemon no
 * funciona por si solo, aun habiendolo instalado de manera global, por lo que actualmente se
 * ejecuta utilizando el comando npx nodemon index.js).
 * 
 *     -Para levantar el servidor como tal de la manera más conocida, se utiliza express, es necesario 
 * instalarlo como una de las partes primordiales de nuestro back.
 * 
 */

const express = require('express');//Requerimos express asignado a una constante
const { dbConnect } = require('./database/config');//Configuración de conexión a base de datos
const cors = require('cors')

require('dotenv').config(); /**npm i dotenv:
    #Carga el contenido de los archivos .env en process.env #.

    Para utilizar cualquier variable de entorno solo es necesario escribir process.env.<variable>; al 
    mismo tiempo que se modifique el archivo .env, se tendrá que reiniciar el server para que se puedan
    visualizar los cambios hechos en su totalidad.
 */

const app = express(); //Lo llamamos como función para crear el servidor 

//Conexión de base de datos './database/config.js'
dbConnect();

//CORS
app.use(cors());

//Servidor público
//función app.use se aplica como un middleware, y express.static para mostrar la carpeta pública
//donde generalmente es 'path'
app.use( express.static('public') );

/**Lectura y parseo de body
 *      Express se encargará de procesar la información en json que se obtenga desde las llamadas a 
 *      la api (requests), a través del body, sin necesidad de librerías de terceros con express.json
 */
app.use( express.json() );
app.use( express.urlencoded({ extended: true }) ) // for parsing application/x-www-form-urlencoded

//Rutas 
/**Todo lo que contenga el archivo auth en ./routes podrá ser accesible desde la ruta /api/auth */
app.use( '/api/auth', require('./routes/auth')); 

//Rutas app.METHOD('ruta', 'handler o función callback'); cuando son pocas rutas
/**app.get('/example', (req, res) => {

    console.log('Prueba para primera ruta de ejemplo');
    
    res.json({
        exito: true,
    });

}); */

/**Indicamos al servidor la función que le permite escuchar peticiones, designando un puerto 
 * y a su vez una función callback
*/
app.listen( process.env.PORT , () => { 
    console.log('Ejecutando servidor ...')
});

