import dbConnection from '../database/config.js';
import categorias from './categorias.js';
import marcaAuto from './marcaAuto.js';
import marcaProducto from './marcaProducto.js';
import roles from './roles.js';
import usuarios from './usuarios.js';
import proveedores from './proveedores.js';

import Categoria from '../models/categoria.js';
import MarcaAuto from '../models/marcaAuto.js';
import MarcaAutoModelo from '../models/marcaAutoModelo.js';
import MarcaProducto from '../models/marcaProducto.js';
import Producto from '../models/producto.js';
import Role from '../models/role.js';
import Usuario from '../models/usuario.js';
import Proveedores from '../models/proveedor.js';
import HistorialPrecios from '../models/historialPrecios.js'

import dotenv from  "dotenv";
dotenv.config();

const importarDatos = async () => {
    try {

        // conexion a la BD
        await dbConnection();

        // Insertar los datos
        await Promise.all([
            Categoria.insertMany(categorias),
            MarcaAuto.insertMany(marcaAuto),
            MarcaProducto.insertMany(marcaProducto),
            Role.insertMany(roles),
            Usuario.insertMany(usuarios),
            Proveedores.insertMany(proveedores)
        ])

        console.log('Datos importados Correctamente');
        process.exit()

    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}

const eliminarDatos = async () => {
    try {

        // conexion a la BD
        await dbConnection();

        await Promise.all([
            Categoria.deleteMany(),
            MarcaAuto.deleteMany(),
            MarcaAutoModelo.deleteMany(),
            MarcaProducto.deleteMany(),
            Producto.deleteMany(),
            Role.deleteMany(),
            Usuario.deleteMany(),
            Proveedores.deleteMany(),
            HistorialPrecios.deleteMany(),
        ])

        console.log('Datos Elimnados Correctamente');
        process.exit()
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}

if (process.argv[2] === "-i") {
    importarDatos();
}

if (process.argv[2] === "-e") {
    eliminarDatos();
}