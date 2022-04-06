const { Schema, model } = require('mongoose');

const CategoriaSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true,
    },
    estado: {
        type: Boolean,
        required: [true],
        default: true,
    },
    habilitado: {
        type: Boolean,
        required: [true],
        default: true,
    }
});

CategoriaSchema.methods.toJSON = function () {
    const { __v, ...categoria } = this.toObject();
    return categoria;
}

module.exports = model('Categoria', CategoriaSchema)