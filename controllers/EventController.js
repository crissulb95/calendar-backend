
const { response } = require('express');
const Event = require('../models/Event');

const crearEvento = async(req, res = response) => {
    //Comprobación de que existe el evento y lo datos sean los necesarios
    //console.log(req.body);

    const evento = new Event( req.body );

    try {

        evento.user = req.uid;

        const savedEvent = await evento.save();

        return res.status(201).json({
            exito:true,
            msg:'Evento creado',
            event:savedEvent,
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            exito:false,
            msg:'No se pudo guardar en la base de datos'
        });
    }
}   

const obtenerEventos = async(req, res = response) => {

    /**   populate devuelve los datos generales de un modelo de acuerdo a la dependencia que se le inserte
     * en lugar de solo enviar el id del user a través del evento, puede devolver los datos generales
     * completos del modelo de ese id.
     *    Si solo se quieren datos específicos del modelo, se detallan dentro de un string todos los  
     * datos que se necesiten, ej: populate('user', 'name email');
     * */

    const eventos = await Event.find()
                                .populate('user','name');

    res.json({
        exito: true,
        msg: 'Obtener eventos', 
        eventos
    })

}   

const actualizarEvento = async(req, res = response) => {

    const eventId = req.params.id;
    const uid = req.uid;
    
    try {
        const event = await Event.findById( eventId );

        if( !event ) {
            return res.status(400).json({
                exito:false,
                msg:'No se encontró el evento en la base de datos por ese id'
            });
        }

        if ( event.user.toString() !== uid ) {
            return res.status(401).json({
                exito:false,
                msg:'No tiene autorización para cambiar el estado de este evento'
            });
        }

        const newEvent = {
            ...req.body,
            user: uid
        }

        const updatedEvent = await Event.findByIdAndUpdate( eventId, newEvent, { new: true } );
        //Opción { new: true } permite que se le asigne a la constante el valor que se actualizó en el momento y no el valor
        //previo a la actualización.

        return res.status(200).json({
            exito:true,
            msg:'Evento actualizado',
            updatedEvent
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            exito:false,
            msg:'No se pudo actualizar el evento en la base de datos'
        });
    }
}   

const borrarEvento = async(req, res = response) => {

    const eventId = req.params.id;
    const uid = req.uid;
    
    try {
        const event = await Event.findById( eventId );

        if( !event ) {
            return res.status(400).json({
                exito:false,
                msg:'No se encontró el evento en la base de datos por ese id'
            });
        }

        if ( event.user.toString() !== uid ) {
            return res.status(401).json({
                exito:false,
                msg:'No tiene autorización para cambiar el estado de este evento'
            });
        }
        
        await Event.findByIdAndDelete( eventId );
        //Opción { new: true } permite que se le asigne a la constante el valor que se actualizó en el momento y no el valor
        //previo a la actualización.

        return res.status(200).json({
            exito:true,
            msg:'Evento eliminado',
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            exito:false,
            msg:'No se pudo actualizar el evento en la base de datos'
        });
    }

}   

module.exports = { 
    crearEvento, 
    obtenerEventos, 
    actualizarEvento,
    borrarEvento, 
}