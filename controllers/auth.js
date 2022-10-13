import bcryptjs from "bcryptjs";
import { response } from "express";

import { generarJWT } from "../helpers/generar-jwt.js";
import { googleVerify } from "../helpers/google-verify.js";
import Usuario from '../models/usuario.js';

const login = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        // Verificar si el emial existe
        const usuario = await Usuario.findOne({ email })
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            });
        }

        // Si el usuario confirmado
        if (!usuario.confirmado) {
            return res.status(400).json({
                msg: 'Tu Cuenta no ha sido confirmada'
            });
        }

        if (await usuario.comprobarPassword(password)) {
            const usuarioOK = {
                _id: usuario._id,
                nombre: usuario.nombre,
                email: usuario.email,
                token: generarJWT(usuario._id)
            };
            return res.json({
                usuarioOK
            })
        } else {
            return res.status(403).json({
                msg: 'Usuario / Password no son correctos'
            });
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }

}

const googleSingIn = async (req, res = response) => {

    const { id_token } = req.body;

    try {

        const { nombre, img, correo } = await googleVerify(id_token);

        //  Verificar si el emial existe
        let usuario = await Usuario.findOne({ correo });

        if (!usuario) {

            const data = {
                nombre,
                img,
                correo,
                password: '::',
                google: true,
                rol: 'USER_ROLE'
            }

            usuario = new Usuario(data);
            await usuario.save();
        }

        // si el usuario en BD
        if (!usuario.estado) {
            res.status(401).json({
                msg: 'Hable con el administrador , usuario bloqueado'
            })
        }

        // Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })

    } catch (error) {

        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        })
    }

}

const confirmarUsuario = async (req, res = response) => {
    try {
        const { token } = req.params;
        //  Verifico que el token corresponda al usuario
        const usuarioConfirmar = await Usuario.findOne({ token });
        if (!usuarioConfirmar) {
            return res.status(500).json({ msg: "Token no valido" })
        };

        //  En caso de exito se elimina token y se confirma usuario
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;
        await usuarioConfirmar.save();

        return res.json({ msg: 'Usuario Confirmado Correctamente' });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
};


export {
    login,
    googleSingIn,
    confirmarUsuario
}