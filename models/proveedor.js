import mongoose from 'mongoose';

const ProveedorSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El rol es obligatorio'],
        uppercase: true
    },
    nombreCorto: {
        type: String,
        trim: true,
        uppercase: true
    },
    direccion: {
        type: String,
        trim: true,
        lowercase: true
    },
    telefono: {
        type: String,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
},
    {
        timestamps: true
    }
);

const Provedor = mongoose.model('Proveedor', ProveedorSchema);
export default Provedor;