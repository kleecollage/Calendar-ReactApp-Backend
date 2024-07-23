/*
    Rutas de Usuarios / Events
    host + /api/events
*/
const { Router } = require("express");
const { check } = require("express-validator");
const router = Router()
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');
const { isDate } = require('../helpers/isDate');
const Evento = require('../models/Evento')

// Todas deben pasar por la validacion de JWT
router.use( validarJWT );

// Obtener eventos
router.get(
    '/',
    [ // middlewares
    ],
    getEventos
);

// Crear un nuevo evento
router.post(
    '/',
    [ // middlewares
        check('title', 'Debe tener un titulo').not().isEmpty(),
        check('start', 'Fecha de inicio obligatoria').custom( isDate ),
        check('end', 'Fecha de finalizacion obligatoria').custom( isDate ),
        validarCampos,
    ],
    crearEvento
);

// Acualizar evento
router.put(
    '/:id',
    [ // middlewares
        check('title', 'Debe tener un titulo').not().isEmpty(),
        validarCampos,
    ],
    actualizarEvento
);

// Eliminar evento
router.delete(
    '/:id',
    [ // middlewares
    ],
    eliminarEvento
);


module.exports = router