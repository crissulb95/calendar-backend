/**
 *      RUTAS DE EVENTOS
 *      host + /api/event
 */


const { Router } = require('express');
const { check } = require('express-validator');

const router = Router(); //Enrutador
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');
const isDate = require('../helpers/isDate');

//Controllers
const { 
    crearEvento, 
    obtenerEventos, 
    actualizarEvento,
    borrarEvento, 
} = require('../controllers/EventController');

//vvv Middleware general para todas las rutas que se encuentren por debajo de la línea de aplicación vvv
router.use( validarJWT ); 

//Routes

router.post(
    '/create',
    [
        check('title', 'Verifique el campo de título').not().isEmpty(),
        check('start', 'Fecha de inicio es necesaria').custom( isDate ),
        check('end', 'Fecha de finalización es necesaria').custom( isDate ),
        validarCampos
    ],
    crearEvento
);

router.get(
    '/',
    obtenerEventos
);


router.put(
    '/:id',
    actualizarEvento
);

router.delete(
    '/:id',
    borrarEvento
);

module.exports = router;