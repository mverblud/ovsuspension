import mongoose from 'mongoose';

import Producto from '../models/producto.js';
import Categoria from '../models/categoria.js';
import MarcaAuto from '../models/marcaAuto.js';
import MarcaProducto from '../models/marcaProducto.js';
import Proveedor from '../models/proveedor.js';

const coleccionesPermitidas = [
    'categorias',
    'productos',
    'marcaAutos',
    'marcaProductos',
    'proveedores'
];

const buscarMarcaAutos = async (termino = '', res = response) => {
    const esMongoID = mongoose.Types.ObjectId.isValid(termino);
    if (esMongoID) {
        const marcaAuto = await MarcaAuto.findById(termino);
        return res.json({
            results: (marcaAuto) ? [marcaAuto] : []
        })
    }

    const regex = new RegExp(termino, 'i')
    const marcaAutos = await MarcaAuto.find({
        $or: [{ nombre: regex }],
        $and: [{ estado: true }]
    })

    res.json({
        results: marcaAutos
    })
}

const buscarMarcaProductos = async (termino = '', res = response) => {

    const esMongoID = mongoose.Types.ObjectId.isValid(termino);
    if (esMongoID) {
        const marcaProducto = await MarcaProducto.findById(termino);
        return res.json({
            results: (marcaProducto) ? [marcaProducto] : []
        })
    }

    const regex = new RegExp(termino, 'i')
    const marcaProductos = await MarcaProducto.find({
        $or: [{ nombre: regex }],
        $and: [{ estado: true }]
    })

    res.json({
        results: marcaProductos
    })
}

const buscarCategorias = async (termino = '', res = response) => {

    const esMongoID = mongoose.Types.ObjectId.isValid(termino);
    if (esMongoID) {
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: (categoria) ? [categoria] : []
        })
    }

    const regex = new RegExp(termino, 'i')
    const categorias = await Categoria.find({ nombre: regex, estado: true });

    res.json({
        results: categorias
    })
}

const buscarProductos = async (termino = undefined, req, res = response) => {

    // paginado y filtro
    let filter = {};
    const { limite = 50, desde = 0, categoria, marcaAuto, marcaProducto, proveedor } = req.query;

    if (termino !== undefined) {

        //  Expresion regular
        const regex = new RegExp(termino, 'i');
        filter = { $and: [{ $or: [{ nombre: regex }, { codigo: regex }] }, { $and: [{ estado: true }] }] };
        switch (true) {
            case ((categoria !== undefined) && (marcaProducto !== undefined) && (marcaAuto !== undefined)):
                filter = { $and: [{ $or: [{ nombre: regex }, { codigo: regex }] }, { $and: [{ estado: true }, { categoria: categoria }, { marcaProducto: marcaProducto }, { marcaAuto: marcaAuto }] }] };
                break;

            case (categoria !== undefined):
                filter = { $and: [{ $or: [{ nombre: regex }, { codigo: regex }] }, { $and: [{ estado: true }, { categoria: categoria }] }] };
                if (marcaProducto !== undefined) {
                    filter = { $and: [{ $or: [{ nombre: regex }, { codigo: regex }] }, { $and: [{ estado: true }, { categoria: categoria }, { marcaProducto: marcaProducto }] }] };
                }
                if (marcaAuto !== undefined) {
                    filter = { $and: [{ $or: [{ nombre: regex }, { codigo: regex }] }, { $and: [{ estado: true }, { categoria: categoria }, { marcaAuto: marcaAuto }] }] };
                }
                break;

            case (marcaProducto !== undefined):
                filter = { $and: [{ $or: [{ nombre: regex }, { codigo: regex }] }, { $and: [{ estado: true }, { marcaProducto: marcaProducto }] }] };
                if (marcaAuto !== undefined) {
                    filter = { $and: [{ $or: [{ nombre: regex }, { codigo: regex }] }, { $and: [{ estado: true }, { marcaProducto: marcaProducto }, { marcaAuto: marcaAuto }] }] };
                }
                break;

            case (marcaAuto !== undefined):
                filter = { $and: [{ $or: [{ nombre: regex }, { codigo: regex }] }, { $and: [{ estado: true }, { marcaAuto: marcaAuto }] }] };
                break;
        }

    } else {
        switch (true) {
            case (categoria !== undefined):
                filter = { $and: [{ estado: true }, { categoria: categoria }] };
                switch (true) {
                    case ((marcaProducto !== undefined) && (marcaAuto !== undefined)):
                        filter = { $and: [{ estado: true }, { categoria: categoria }, { marcaProducto: marcaProducto }, { marcaAuto: marcaAuto }] };
                        break;

                    case (marcaProducto !== undefined):
                        filter = { $and: [{ estado: true }, { categoria: categoria }, { marcaProducto: marcaProducto }] };
                        break;

                    case (marcaAuto !== undefined):
                        filter = { $and: [{ estado: true }, { categoria: categoria }, { marcaAuto: marcaAuto }] };
                        break;
                }

                break;

            case (marcaProducto !== undefined):
                filter = { $and: [{ estado: true }, { marcaProducto: marcaProducto }] }
                if (marcaAuto !== undefined) {
                    filter = { $and: [{ estado: true }, { marcaProducto: marcaProducto }, { marcaAuto: marcaAuto }] }
                }
                break;

            case (marcaAuto !== undefined):
                filter = { $and: [{ estado: true }, { marcaAuto: marcaAuto }] };
                break;
        }
    }

    const [total, productos] = await Promise.all([
        Producto.countDocuments(filter),
        Producto.find(filter)
            .populate('categoria', 'nombre')
            .populate('marcaAuto', 'nombre')
            .populate('marcaProducto', 'nombre')
            .populate('proveedor', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ])

    res.json({
        results: {
            total,
            productos,
        }
    })

}

const buscarProveedores = async (termino = '', res = response) => {

    const esMongoID = mongoose.Types.ObjectId.isValid(termino);
    if (esMongoID) {
        const proveedor = await Proveedor.findById(termino);
        return res.json({
            results: (proveedor) ? [proveedor] : []
        })
    }

    const regex = new RegExp(termino, 'i')
    const proveedores = await Proveedor.find({ nombre: regex });

    res.json({
        results: proveedores
    })
}

const buscar = (req, res = response) => {

    const { coleccion } = req.params;
    const { termino } = req.query;

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`,
        })
    }

    switch (coleccion) {
        case 'marcaAutos':
            buscarMarcaAutos(termino, res);
            break;
        case 'marcaProductos':
            buscarMarcaProductos(termino, res);
            break;
        case 'categorias':
            buscarCategorias(termino, res);
            break;
        case 'productos':
            buscarProductos(termino, req, res);
            break;
        case 'proveedores':
            buscarProveedores(termino, res);
            break;

        default:
            return res.status(500).json({
                msg: 'Busqueda sin desarrollo'
            })
    }
}

export {
    buscar
}