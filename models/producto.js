const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({
    codigo: {
        type: String,
        required: [true, 'El codigo es obligatorio'],
    },
    nombre: {
        type: String,
        required: [true, 'El codigo es obligatorio']
    },
    marcaProducto: {
        type: Schema.Types.ObjectId,
        ref:'MarcaProducto'    
    },
    marcaAuto: {
        type: Schema.Types.ObjectId,
        ref:'MarcaAuto'    
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref:'Categoria'    
    },
    stock: {
        type: Number,
        default:0    
    },
    fechaAlta: {
        type: Date,
        default: Date.now    
    },
    precio: {
        type: Number,
        default: 0    
    },
    iva: {
        type: Number,
        default: 0    
    },
    precioIva: {
        type: Number,
        default: 0    
    },
    descuento: {
        type: Number,
        default: 0    
    },
    precioFinal: {
        type: Number,
        default: 0    
    },
    habilitado: {
        type: Boolean,
        default: true    
    },
    estado: {
        type: Boolean,
        required: [true],
        default: true,
    },
    img: [{
        type: String,
        default: ''
    }]
});

ProductoSchema.methods.toJSON = function () {
    const { __v, ...producto } = this.toObject();
    return producto;
}

module.exports = model('Producto', ProductoSchema)