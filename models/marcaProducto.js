const { Schema, model } = require('mongoose');

const MarcaProductoSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true,
    },
    img: {
        type: String,
        default: ''
    },
    nombreCorto: {
        type: String,
    },
    estado: {
        type: Boolean,
        required: [true],
        default: true,
    }
});

MarcaProductoSchema.methods.toJSON = function () {
    const { __v, ...marcaProductos } = this.toObject();
    return marcaProductos;
}

module.exports = model('MarcaProducto', MarcaProductoSchema)