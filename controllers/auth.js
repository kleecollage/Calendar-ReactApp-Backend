const { response } = require('express'); // para no perder intellisense
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt')

const crearUsuario = async(req, res = response) => { 
    const { email, password } = req.body
    try { 
        let usuario = await Usuario.findOne({ email })
        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Este correo electronico ya existe en la base de datos'
            })
        }
        
        usuario = new Usuario(req.body);
        // encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);
        await usuario.save()

        //generar JWT
        const token = await generarJWT(usuario.id, usuario.name)

        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Porfavor hable con el administrador'
        })
    }
}


const loginUsuario = async (req, res = response) => {
    const { email, password } = req.body
    try {
        let usuario = await Usuario.findOne({ email })

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Este usuario no existe'
            })
        }
        // confirmar password
        const validPassword = bcrypt.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            })
        }
        // generar nuestro JWT
        const token = await generarJWT(usuario.id, usuario.name)

        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Porfavor hable con el administrador'
        })
    }
}



const revalidarToken = async(req, res = response) => {
    const { uid, name} = req
    // generar un nuevo JWT y retornalo en esta peticion
    const token = await generarJWT(uid, name)
    res.json({
        ok: true,
        token
    })
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken,
}