/*
    Rutas de Usuarios / Auth
    host + /api/auth
*/
// const express = require('express');
// const router = express.Router;
const { Router } = require('express');
const { check } = require('express-validator')
const router = Router();
const { crearUsuario, revalidarToken, loginUsuario } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt')


router.post(
    '/new',
    [ // middlewares
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'Esta cuenta de correo no es valida').isEmail(),
        check('password', 'El password debe tener almenos 6 caracteres').isLength({ min: 6 }),
        validarCampos
    ],
    crearUsuario
);

router.post(
    '/',
    [
        check('email', 'Este correo no es valido').isEmail(),
        check('password', 'La contraseña debe tener almenos 6 caracteres').isLength({ min: 6 }),
        validarCampos
    ],
    loginUsuario
);


router.get(
    '/renew',
    validarJWT, //middleware
    revalidarToken
);


module.exports = router