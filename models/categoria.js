import mongoose from 'mongoose';

const CategoriaSchema = mongoose.Schema(
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

CategoriaSchema.methods.toJSON = function () {
    const { __v, ...categoria } = this.toObject();
    return categoria;
}

const Categoria = mongoose.model('Categoria', CategoriaSchema);
export default Categoria; 