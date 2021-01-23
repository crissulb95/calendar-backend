/**
 *      RUTAS DE AUTENTICACIÓN
 *      host + /api/auth
 */

// const express = require('express');
// const router = express.Router();
const { Router } = require('express');
const router = Router(); //Enrutador para substituir el app 

//Express-validator
const { check } = require('express-validator');
/**check solo captura los errores que se obtengan desde el middleware aplicado a la ruta,
 * para poder utilizarlo en el manejo de errores son necesarios los valores que arroje
 * la función ###validationResult###, esto dentro del controlador que es donde se manejan los 
 * errores de manera propicia.
 */

//Custom middleware que pasara por cada check y no toque hacer una validación repetitiva en cada función del controlador
const { validarCampos } = require('../middlewares/validar-campos');

//Middleware para recibir y chequear la validez del JWT en la sesión del usuario
const { validarJWT } = require('../middlewares/validar-jwt');

//Funciones desde controladores
const { 
    crearUsuario, 
    inicioSesion, 
    renovarToken 
} = require('../controllers/AuthController');


/** RUTAS */
router.post(
    '/new', 
    [//express-validator como middlewares
        check('name', 'Verifique el campo de nombre').not().isEmpty(),
        check('email', 'Verifique que el email sea correcto').isEmail(),
        check('password', 'Verifique que la contraseña tenga la cantidad correcta de caracteres').isLength({ min: 7 }),
        validarCampos
    ],
    crearUsuario 
);


router.post(
    '/', 
    [
        check('email', 'El correo que ingresó es incorrecto').isEmail(),
        check('password', 'Verifique la contraseña').isLength({ min: 7 }),
        validarCampos
    ], 
    inicioSesion 
);

router.get(
    '/renew', 
    validarJWT,
    renovarToken 
);

/** Cómo aplicar callbacks a una ruta sin controlador
router.get('/renew', (req, res) => {
    res.json({
        exito: true,
    });
}); */

module.exports = router; //Manera de exportar módulos cuando se utiliza node en back