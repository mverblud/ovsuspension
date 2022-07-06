const { response } = require("express");
const { ObjectId } = require('mongoose').Types;

const Producto = require('../models/producto');
const Categoria = require('../models/categoria');
const MarcaAuto = require('../models/marcaAuto');
const MarcaProducto = require('../models/marcaProducto');

const coleccionesPermitidas = [
    'categorias',
    'productos',
    'marcaAutos',
    'marcaProductos'
];

const buscarMarcaAutos = async (termino = '', res = response) => {

    const esMongoID = ObjectId.isValid(termino);

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

    const esMongoID = ObjectId.isValid(termino);

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

const buscarProductos = async (termino = '', req, res = response) => {

    let producto = [];
    let filter = {};
    const regex = new RegExp(termino, 'i');
    const { limite = 10, desde = 0, categoria, marcaAuto, marcaProducto } = req.query;

    //  Busqueda por _id mongo
    const esMongoID = ObjectId.isValid(termino);
    if (esMongoID) {
        producto = await Producto.findById(termino)
            .populate('categoria', 'nombre')
            .populate('marcaAuto', 'nombre')
            .populate('marcaProducto', 'nombre');

        return res.json({
            results: (producto) ? [producto] : []
        })
    }

    /*     if (categoria !== undefined) {
            const esMongoID = ObjectId.isValid(categoria);
            if (esMongoID) {
    
            }
        }
    
        if (marcaAuto !== undefined) {
            const esMongoID = ObjectId.isValid(marcaAuto);
            if (esMongoID) {
    
            }
        }
    
        if (marcaProducto !== undefined) {
            const esMongoID = ObjectId.isValid(marcaProducto);
            if (esMongoID) {
            }
        } */

    /*     
        filter = { $and: [{ $or: [{ nombre: regex }, { codigo: regex }] }, { $and: [{ estado: true }] }] };
        filter = { $and: [{ $or: [{ nombre: regex }, { codigo: regex }] }, { $and: [{ estado: true }, { categoria: categoria }] }] };
        filter = { $and: [{ $or: [{ nombre: regex }, { codigo: regex }] }, { $and: [{ estado: true }, { categoria: categoria }, { marcaProducto: marcaProducto }] }] };
        filter = { $and: [{ $or: [{ nombre: regex }, { codigo: regex }] }, { $and: [{ estado: true }, { categoria: categoria }, { marcaAuto: marcaAuto }] }] };
        filter = { $and: [{ $or: [{ nombre: regex }, { codigo: regex }] }, { $and: [{ estado: true }, { marcaProducto: marcaProducto }] }] };
        filter = { $and: [{ $or: [{ nombre: regex }, { codigo: regex }] }, { $and: [{ estado: true }, { marcaProducto: marcaProducto }, { marcaAuto: marcaAuto }] }] };
        filter = { $and: [{ $or: [{ nombre: regex }, { codigo: regex }] }, { $and: [{ estado: true }, { marcaAuto: marcaAuto }] }] };
        filter = { $and: [{ $or: [{ nombre: regex }, { codigo: regex }] }, { $and: [{ estado: true }, { categoria: categoria }, { marcaProducto: marcaProducto }, { marcaAuto: marcaAuto }] }] };

        filter = { $and: [{ estado: true }, { categoria: categoria }] }
        filter = { $and: [{ estado: true }, { categoria: categoria }, { marcaProducto: marcaProducto }] }
        filter = { $and: [{ estado: true }, { categoria: categoria }, { marcaAuto: marcaAuto }] }
        filter = { $and: [{ estado: true }, { categoria: categoria }, { marcaProducto: marcaProducto }, { marcaAuto: marcaAuto }] }

        filter = { $and: [{ estado: true }, { marcaProducto: marcaProducto }] }
        filter = { $and: [{ estado: true }, { marcaProducto: marcaProducto }, { marcaAuto: marcaAuto }] }
        filter = { $and: [{ estado: true }, { marcaAuto: marcaAuto }] }
     */

    const [total, productos] = await Promise.all([
        Producto.countDocuments(filter),
        Producto.find(filter)
            .populate('categoria', 'nombre')
            .populate('marcaAuto', 'nombre')
            .populate('marcaProducto', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ])

    res.json({
        results: {
            total,
            productos
        }
    })
}

const buscarCategorias = async (termino = '', res = response) => {

    const esMongoID = ObjectId.isValid(termino);

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

const buscar = (req, res = response) => {

    const { coleccion, termino } = req.params;

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

        default:
            return res.status(500).json({
                msg: 'Busqueda sin desarrollo'
            })
    }
}

module.exports = {
    buscar
}