import mongoose from 'mongoose';

const historialPreciosSchema = mongoose.Schema(
    {
        nombreArch: {
            type: String,
            trim: true
        },
        proveedor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Proveedor'
        },
        cantLeidos: { type: Number },
        cantActualizados: { type: Number },
        productos: [{
            producto: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Producto'
            },
            precioAnterior: { type: Number },
            precioNuevo: { type: Number },
            diferencia: { type: Number }
        }]
    },
    {
        timestamps: true
    }
);

const HistorialPrecios = mongoose.model('HistorialPrecios', historialPreciosSchema);
export default HistorialPrecios; 