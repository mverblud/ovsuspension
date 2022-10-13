import Usuario from '../models/usuario.js';
import emailRegistro from '../helpers/emailRegistro.js';

const usuarioGet = async (req = request, res = response) => {

    try {
        const { limite = 50, desde = 0 } = req.query;
        const query = { estado: true }
    
        const [total, usuarios] = await Promise.all([
            Usuario.countDocuments(query),
            Usuario.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ])
    
        res.json({
            total,
            usuarios
        })        
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: 'No se pudo obtener los usuario'
        })        
    }
}

const usuarioPost = async (req, res = response) => {
    try {
        const { nombre, email, password, telefono } = req.body;
        const usuario = new Usuario({ nombre, email, password, telefono });
        // Guardar en BD
        await usuario.save();

        //  Envio de email con token para que se confirme el usuario
        emailRegistro({ email, nombre, token: usuario.token });

        res.json({ usuario });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: 'No se pudo registrar el usuario'
        })
    }
};

const usuarioPut = async (req, res = response) => {

    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    // TODO validar contra base de datos
    if (password) {
        // Encriptar la contraseña
        const salt = bcrypt.genSaltSync();
        resto.password = bcrypt.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json({
        msg: 'put API - controlador',
        usuario
    })

}

const usuarioPatch = (req, res = response) => {

    res.json({
        msg: 'patch API - controlador',
    })

}

const usuarioDelete = async (req, res = response) => {

    const { id } = req.params;
    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

    res.json({
        usuario,
    })

}

export {
    usuarioGet,
    usuarioPost,
    usuarioPut,
    usuarioPatch,
    usuarioDelete,
}