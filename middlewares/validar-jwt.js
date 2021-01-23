
const { response } = require('express');
const jwt = require('jsonwebtoken');

const validarJWT = (req, res = response, next) => {
    // request -> x-token (headers)
    const token = req.header('x-token');
    //console.log('token', token);

    if( !token ) {
        return res.status(401).json({
            exito:false,
            msg:'No existe token'
        });
    }

    try {

        const { uid, name } = jwt.verify( 
            token, 
            process.env.SECRET_JWT_SEED 
        );

        //modifica los valores actuales del request agregandole las siguientes propiedades
        //directo desde la verificación del JWT enviado a través del header
        req.uid = uid;
        req.name = name;

    } catch (error) {
        console.log(error)
        return res.status(401).json({
            exito:false,
            msg:'Token no válido'
        });
    }

    next();
}

module.exports = {
    validarJWT
}