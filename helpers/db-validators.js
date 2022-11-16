import MarcaAuto       from '../models/marcaAuto.js';
import MarcaAutoModelo from '../models/marcaAutoModelo.js';
import MarcaProducto   from '../models/marcaProducto.js';
import Categoria       from '../models/categoria.js';
import Producto        from '../models/producto.js';
import Role            from '../models/role.js';
import Usuario         from '../models/usuario.js';
import Provedor from '../models/proveedor.js';

const esRolValido = async (rol = '') => {
    const existeRol = await Role.findOne({ rol });
    if (!existeRol) {
        throw new Error(`El rol ${rol} no está registrado en la BD`);
    }
}

const emailExiste = async (email = '') => {
    const existeEmail = await Usuario.findOne({ email });
    if (existeEmail) {
        throw new Error(`El email: ${email} ya está registrado en la BD`);
    };
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

const existeProveedor = async (id = '') => {
    const existeProveedor = await Provedor.findById({ _id:id });
    if (!existeProveedor) {
        throw new Error(`El id no existe ${id}`);
    }
}

const camposObligatorios = async (array) => {

    if (!array.includes('codigo') ) {
        throw new Error(`Es obligatorio que se incluya en el headers con los campos : Codigo`);
    } 

    if (!array.includes('precio') ) {
        throw new Error(`Es obligatorio que se incluya en el headers con los campos : Precio`);
    } 
}

export {
    esRolValido,
    emailExiste,
    existeUsuarioPorId,
    existeMarcaAuto,
    existeMarcaAutoModelo,
    existeMarcaProducto,
    existeCategoria,
    existeProducto,
    existeProveedor,
    camposObligatorios
}