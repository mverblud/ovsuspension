import mongoose from 'mongoose';

const ProductoSchema = mongoose.Schema({
    codigo: {
        type: String,
        required: [true, 'El codigo es obligatorio'],
        trim: true,
        uppercase: true
    },
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true,
        uppercase: true
    },
    marcaProducto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MarcaProducto'
    },
    marcaAuto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MarcaAuto'
    },
    categoria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categoria'
    },
    marcaAutoModelo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MarcaAutoModelo'
    },
    proveedor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proveedor'
    },
    stock: {
        type: Number,
        default: 0
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
    img: {
        type: String,
        default: ''
    }
},
    {
        timestamps: true
    }
);

ProductoSchema.methods.toJSON = function () {
    const { __v, ...producto } = this.toObject();
    return producto;
}

// Realizo calculo de precios antes de guardar
ProductoSchema.pre('save', async function () {
    if ( this.precio > 0 &&  this.iva > 0) {
        this.precioIva = ((this.precio * this.iva) / 100) + this.precio
    } else {
        this.precioIva = this.precio
    }
});

const Producto = mongoose.model('Producto', ProductoSchema);
export default Producto; 