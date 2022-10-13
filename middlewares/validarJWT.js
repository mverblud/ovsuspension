import jwt from 'jsonwebtoken';
import Usuario from '../models/usuario.js';

const validarJWT = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

            req.usuario = await Usuario.findById(decoded.id).select(
                "-password -token -confirmado"
            );

            return next();

        } catch (error) {
            console.log(error);
            const err = new Error("Token no valido")
            return res.status(403).json({ msg: err.message });
        }
    };

    if (!token) {
        const error = new Error("Token no valido o inexistente")
        return res.status(403).json({ msg: error.message });
    }
    next();
};

export default validarJWT;