import mongoose from 'mongoose';

const MarcaProductoSchema = mongoose.Schema(
    {
        nombre: {
            type: String,
            required: [true, 'El nombre es obligatorio'],
            unique: true,
            trim : true,
            uppercase : true
        },
        img: {
            type: String,
        },
        nombreCorto: {
            type: String,
            trim : true,
            uppercase : true
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
    },
    {
        timestamps: true
    }
);

MarcaProductoSchema.methods.toJSON = function () {
    const { __v, ...marcaProductos } = this.toObject();
    return marcaProductos;
}

const MarcaProducto = mongoose.model('MarcaProducto', MarcaProductoSchema);
export default MarcaProducto;