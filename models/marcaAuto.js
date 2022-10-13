import mongoose from 'mongoose';

const MarcaAutoSchema = mongoose.Schema(
    {
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
    },
    {
        timestamps: true
    }
);

MarcaAutoSchema.methods.toJSON = function () {
    const { __v, ...marcaAutos } = this.toObject();
    return marcaAutos;
}

const MarcaAuto = mongoose.model('MarcaAuto', MarcaAutoSchema);
export default MarcaAuto; 