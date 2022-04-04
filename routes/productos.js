const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({
    codigo: {
        type: String,
        required: [true, 'El codigo es obligatorio'],
        unique: true,
    },
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
    },
    provedor: {
        type: String,
        required: [true, 'El proveedor es obligatorio'],
    },
    marcaAuto: {
        type: String,
        required: [true, 'La marca del auto es obligatorio'],
    },
    marcaProducto: {
        type: String,
        required: [true, 'La Marca del producto es obligatorio'],
    },
    rubro: {
        type: String,
        required: [true, 'La Marca del producto es obligatorio'],
    },
    stock:{
        type:Number,
        default:0
    },
    img: {
        type: String
    },
    descuento:{
        type:Number,
        default:0
    },
    fechaAlta:{
        type: Date,
        default: Date.now
    },
    fechaBaja:{
        type: Date
    },
    precio: {
        type: Number,
        default: 0
    },
});

/* ProductoSchema.methods.toJSON = function () {
    const { __v, estado, ...data } = this.toObject();
    return data;
} */

module.exports = model('Producto', ProductoSchema)