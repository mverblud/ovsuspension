const { Schema, model } = require('mongoose');

const MarcaAutoSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true,
    },
    marcaAutoModelo: [{
        type: Schema.Types.ObjectId, 
        ref: 'MarcaAutoModelo',
    }],
    estado: {
        type: Boolean,
        required: [true],
        default: true,
    }
});

MarcaAutoSchema.methods.toJSON = function () {
    const { __v, ...marcaAutos } = this.toObject();
    return marcaAutos;
}

module.exports = model('MarcaAuto', MarcaAutoSchema)