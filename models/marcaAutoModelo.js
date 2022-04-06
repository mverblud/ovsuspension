const { Schema, model } = require('mongoose');

const MarcaAutoModeloSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true,
    },
    marcaAuto: {
        type: Schema.Types.ObjectId,
        ref:'MarcaAuto',
        required : true
    }
});

MarcaAutoModeloSchema.methods.toJSON = function () {
    const { __v, ...marcaAutosModelo } = this.toObject();
    return marcaAutosModelo;
}

module.exports = model('MarcaAutoModelo', MarcaAutoModeloSchema)