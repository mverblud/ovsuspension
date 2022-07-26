const bcryptjs = require("bcryptjs");
const { response } = require("express");

const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");
const Usuario = require('../models/usuario');

const login = async (req, res = response) => {

    const { correo, password } = req.body;

    try {

        // Verificar si el emial existe
        const usuario = await Usuario.findOne({ correo })
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            });
        }

        // Si el usuario esta activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - Estado : False'
            });
        }

        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password)
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - Password'
            });
        }

        // Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })

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

module.exports = {
    login,
    googleSingIn
}