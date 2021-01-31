/**Por asuntos ajenos, el intellisense ya no detecta los comandos precargados de express por lo que
 * hay que volver a cargar express y el intellisense pueda detectar los comandos que ya no cargaban.
 */
const { response } = require('express'); // Para autocompletar funciones de response dentro de los controladores
const bcrypt = require('bcryptjs'); //para encriptar las contraseñas ingresadas a la db(para no ingresarlas de manera plana)
const User = require('../models/User');

//Generador de JWT que devuelve promesa
const { generarJWT } = require('../helpers/jwt');

//errores capturados en el middleware del validador en la ruta a especificar
//const { validationResult } = require('express-validator');

const crearUsuario = async(req, res = response) => {
    //console.log('body',req.body) req.body muestra la información enviada desde el request en JSON
    const { email, password } = req.body;

    //Validación para casos pequeños
    /**if ( name && name.length < 5 ) {
        return res.status(400).json({ 
            //Código de status (400) en caso de que sea incorrecto el request
            exito: false,
            msg:'Verifique el nombre'
        })
    } */

    /**Para casos más extensos, lo más usual es instalar un paquete de validador.
     * Uno de los más comunes es el express validator (npm i express-validator)
     * se manejan en el lado del router como segundo argumento en las rutas
     */

    //Manejo de errores utilizando validationResult, después de haber sido capturado
    //algún error en el middleware de la ruta

    //Para que no se repita en cada función este validador se utiliza un custom middleware(validar-campos)
    /**const errors = validationResult(req);//especificamos que errores hay en request de esta ruta
    if( !errors.isEmpty() ) { //Si errors no está vacío( si hay errores, entonces...)
        return res.status(400).json({
            exito:false,
            errors: errors.mapped(), //mapea los errores de forma manejable
        });
    } */

    /**Implementación del nuevo modelo creado User, para crear un usuario con la información en base
     * al esquema creado dentro del modelo, usando un try/catch por manejo de errores
     */
    try {
        let user = await User.findOne({ email });
        /**Model.findOne(); retorna los datos desde DB si el argumento ingresado encuentra un Model
         * en la database con el mismo argumento.
         */

        if (user) {
            return res.status(400).json({
                exito:false,
                msg: 'Usuario ya existe con ese correo',
            })
        }

        //console.log('usuario', usuario);

        user = new User( req.body );

        //Encriptado de contraseña
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        await user.save();

        //Generar el JWT para iniciar sesión una vez registrado
        const token = await generarJWT( user.id, user.name );

        //status 201 -> creado correctamente
        res.status(201).json({ // <-- escribir res.j ... no mostraba la lista de los comandos precargados de express
            exito: true,
            msg:'Se ha verificado correctamente',
            uid: user.id,
            name: user.name,
            token
        });
    } catch (error) {
        console.log('Error en creación de usuarios: ', error);
        res.status(500).json({
            exito: false,
            msg:'Verifique los datos ingresados',
        });
    }
    
    
}

const inicioSesion = async(req, res = response) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if ( !user ) {
            return res.status(400).json({
                exito:false,
                msg: 'Usuario no existe con ese correo', //No dejar tantas pistas al usuario dejando un mensaje más genérico que este
            })
        }

        //Confirmar la contraseña
        const validPassword = bcrypt.compareSync(password, user.password);

        if( !validPassword ) {
            return res.status(400).json({
                exito:false,
                msg: 'La contraseña no es válida', 
            })
        }

        //Generación del JSON Web Token, una vez validado el correo y la contraseña
        const token = await generarJWT( user.id, user.name );

        return res.json({
            exito: true,
            msg:'Se ha iniciado sesión correctamente',
            uid: user.id,
            name: user.name,
            token
        })

    } catch (error) {
        console.log('Error en inicio de sesión de usuario: ', error);
        res.status(500).json({
            exito: false,
            msg:'Verifique los datos ingresados',
        });
    }

    res.status(200).json({
        exito: true,
        msg:'Se ha verificado correctamente',
        user:{
            correo: email,
            contraseña: password,
        },
        
    });
}

const renovarToken = async(req, res = response) => {
    /**Una vez "modificado" el request desde el middleware, que verifica la JWT
     * enviada a través del header, se pueden traer los valores asociados con ésta
     * aunque no se encuentren directamente en el body
     */
    //console.log(req.uid, req.name);
    const { uid, name } = req;

    const token = await generarJWT( uid, name );

    res.json({
        exito: true,
        msg:'JWT Verificado y regenerado',
        token,
        uid,
        name
    });
}


module.exports = {
    crearUsuario,
    inicioSesion,
    renovarToken,
}