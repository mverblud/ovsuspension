import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import generarTokenId from '../helpers/generarTokenId.js';

const UsuarioSchema = mongoose.Schema(
    {
        nombre: {
            type: String,
            required: [true, 'El nombre es obligatorio'],
            trim: true,
            lowercase: true
        },
        password: {
            type: String,
            required: [true, 'La Contraseña es obligatorio'],
        },
        email: {
            type: String,
            required: [true, 'El correo es obligatorio'],
            unique: true,
            lowercase: true
        },
        img: {
            type: String
        },
        rol: {
            type: String,
            required: true,
            enum: ['ADMIN_ROLE', 'USER_ROLE'],
            default: 'USER_ROLE'
        },
        telefono: {
            type: String,
            default: null,
            trim: true,
            lowercase: true
        },
        token: {
            type: String,
            default: generarTokenId(),
        },
        confirmado: {
            type: Boolean,
            default: false,
        },
        google: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true
    }
);

// Muestro la info que necesito
UsuarioSchema.methods.toJSON = function () {
    const { __v, password, /*_id, token devuelvo el token para poder confirmar por POSTMAN*/ ...usuario } = this.toObject();
    //usuario.uid = _id;
    return usuario;
}

// Realizo encriptacion con bcrypt a la password antes de guardar
UsuarioSchema.pre('save', async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UsuarioSchema.methods.comprobarPassword = async function (passwordFormulario) {
    return await bcrypt.compare(passwordFormulario, this.password)
}

const Usuario = mongoose.model('Usuario', UsuarioSchema)
export default Usuario;