import mongoose from 'mongoose';

const MarcaAutoModeloSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true,
        trim : true,
        uppercase : true
    },
    estado: {
        type: Boolean,
        required: [true],
        default: true,
    }
});

MarcaAutoModeloSchema.methods.toJSON = function () {
    const { __v, ...marcaAutosModelo } = this.toObject();
    return marcaAutosModelo;
}

const MarcaAutosModelo = mongoose.model('MarcaAutoModelo', MarcaAutoModeloSchema);
export default MarcaAutosModelo;