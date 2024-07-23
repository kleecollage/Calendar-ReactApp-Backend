const { response } = require("express");
const Evento = require('../models/Evento')

const getEventos = async (req, res = response) => {
     try {
         const eventos = await Evento
             .find()
             .populate('user', 'name password')
         if (eventos) {
             return res.json({
                 ok: true,
                 eventos: eventos
             })
         }
     } catch (error) {
         console.log(error)
         res.status(500).json({
             ok: false,
             msg: ('Error getting Evento')
         })
     }

}

const crearEvento = async(req, res = response) => {
    // console.log(req.body)
    const evento = new Evento(req.body)
    try {
        evento.user = req.uid;
        const eventoGuardado = await evento.save()
        res.json({
            ok: true,
            evento: eventoGuardado
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: ('Error creando Evento')
        })
    }
}

const actualizarEvento = async (req, res) => {
    const eventoId = req.params.id;
    const uid = req.uid;
    try {
        const evento = await Evento.findById(eventoId)
        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe ningun evento con este ID'
            })
        };
        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios para editar este evento'
            })
        };

        const nuevoEvento = {
            ...req.body,
            user: uid,
        }
        const eventoActualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento, { new: true });

        res.json({
            ok: true,
            evento: eventoActualizado
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error actualizando Evento'
        })
    }
}

const eliminarEvento = async (req, res = response) => {
    const eventoId = req.params.id;
    const uid = req.uid;
    try {
        const evento = await Evento.findById(eventoId)
        if (!evento) {
            return res.json({
                ok: false,
                msg: 'No se ha encontrado un evento con este ID'
            })
        }
        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios para eliminar este evento'
            })
        };
        await Evento.findByIdAndDelete(eventoId, { new: true });
        res.json({
            ok: true,
            msg: 'Evento eliminado correctamente'
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: ('Error eliminando Evento')
        })
    }
}

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}
