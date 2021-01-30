const { Schema, model } = require('mongoose');

const EventSchema = Schema({
    title:{
        type: String,
        required: true,
    },
    notes:{
        type: String,
    },
    start:{
        type: Date,
        required: true,
    },
    end:{
        type: Date,
        required: true,
    },
    user:{
        type: Schema.Types.ObjectId,
        ref:'User',
        required: true,
    }
});

EventSchema.method('toJSON', function() {
    /**Eliminar o extraer datos o nombres que guarda por default un objeto al ser
     * almacenado en la base de datos, y que se pueden sustituir
     */

    //Se sustituye _id por id.
    const { __v, _id, ...object} = this.toObject();
    object.id = _id; 
    return object;
});

module.exports = model('Event', EventSchema);