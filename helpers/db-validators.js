const MarcaAuto  = require('../models/marcaAuto');
const MarcaAutoModelo = require('../models/marcaAutoModelo');
const MarcaProducto = require('../models/marcaProducto');
const Categoria = require('../models/categoria');
const Producto = require('../models/producto');
const Role = require('../models/role');
const Usuario = require('../models/usuario');

const esRolValido = async (rol = '') => {
    const existeRol = await Role.findOne({ rol });
    if (!existeRol) {
        throw new Error(`El rol ${rol} no está registrado en la BD`);
    }
}

const emailExiste = async (correo = '') => {

    const existeEmail = await Usuario.findOne({ correo })
    if (existeEmail) {
        throw new Error(`El corre: ${correo} ya está registrado en la BD`);
    }

}

const existeMarcaAuto = async (id = '') => {

    const existeMarca = await MarcaAuto.findById({ _id:id });

    if (!existeMarca) {
        throw new Error(`El id no existe ${id}`);
    }

}

const existeUsuarioPorId = async (id = '') => {

    const existeUsuario = await Usuario.findById({ _id: id })
    if (!existeUsuario) {
        throw new Error(`El id no existe ${id}`);
    }

}

const existeMarcaAutoModelo = async (id = '') => {

    const existeMarcaModelo = await MarcaAutoModelo.findById({ _id:id });

    if (!existeMarcaModelo) {
        throw new Error(`El id no existe ${id}`);
    }

}

const existeMarcaProducto = async (id = '') => {

    const existeMarcaProducto = await MarcaProducto.findById({ _id:id });

    if (!existeMarcaProducto) {
        throw new Error(`El id no existe ${id}`);
    }

}

const existeCategoria = async (id = '') => {
    
    const existeCategoria = await Categoria.findById({ _id:id });

    if (!existeCategoria) {
        throw new Error(`El id no existe ${id}`);
    }

}

const existeProducto = async (id = '') => {
    
    const existeProducto = await Producto.findById({ _id:id });

    if (!existeProducto) {
        throw new Error(`El id no existe ${id}`);
    }

}

module.exports = {
    esRolValido,
    emailExiste,
    existeUsuarioPorId,
    existeMarcaAuto,
    existeMarcaAutoModelo,
    existeMarcaProducto,
    existeCategoria,
    existeProducto
}