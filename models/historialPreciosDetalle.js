import mongoose from 'mongoose';

const historialPreciosDetalleSchema = mongoose.Schema(
    {
        historialPrecio: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'HistorialPrecios'
        },
        producto: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Producto'
        },
        precioAnterior: { type: Number },
        precioNuevo: { type: Number },
        diferencia: { type: Number }
    },
    {
        timestamps: true
    }
);

const HistorialPreciosDetalle = mongoose.model('HistorialPreciosDetalle', historialPreciosDetalleSchema);
export default HistorialPreciosDetalle;