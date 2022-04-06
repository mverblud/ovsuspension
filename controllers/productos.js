const { response, request } = require('express');
const { ObjectId } = require('mongoose').Types;

const Producto = require('../models/producto');
const Categoria = require('../models/categoria');
const MarcaProducto = require('../models/marcaProducto');
const MarcaAuto = require('../models/marcaAuto');


const obtenerProductos = async (req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true }

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('categoria', 'nombre')
            .populate('marcaAuto', 'nombre')
            .populate('marcaProducto', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ])

    res.json({
        total,
        productos
    })

}

const obtenerProducto = async (req = request, res = response) => {

    const { id } = req.params;
    const producto = await Producto.findById({ _id: id })
        .populate('categoria', 'nombre')
        .populate('marcaAuto', 'nombre')
        .populate('marcaProducto', 'nombre')

    res.json({ producto })

}

const crearProducto = async (req, res = response) => {

    try {
        const { codigo, nombre, marcaProducto, marcaAuto, categoria, stock, precio, iva, descuento, img } = req.body;


        const productoDB = await Producto.findOne({ codigo: codigo.toUpperCase() });

        if (productoDB) {
            return res.status(400).json({
                msg: `El Producto ${productoDB.codigo}, ya existe`
            })
        }

        //  calculo precios
        let precioIva = 0

        if (precio > 0 && iva > 0) {
            precioIva = ((precio * iva) / 100) + precio
        } else {
            precioIva = precio
        }

        const producto = new Producto({
            codigo: codigo.toUpperCase(),
            nombre: nombre.toUpperCase(),
            marcaProducto,
            marcaAuto,
            categoria,
            stock,
            precio,
            iva,
            precioIva,
            descuento,
            img
        });

        // Guardar en BD
        await producto.save();

        res.status(201).json(producto)

    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: 'No se pudo crear el producto'
        })
    }
}

const actualizarProducto = async (req, res = response) => {

    const { id } = req.params;
    const { codigo, nombre, marcaProducto, marcaAuto, categoria, stock, precio, iva, descuento, img } = req.body;

    if (codigo) {
        const productoDB = await Producto.findOne({ codigo: codigo.toUpperCase() });
        if (productoDB) {
            return res.status(400).json({
                msg: `El Producto ${productoDB.codigo}, ya existe`
            })
        }
        codigo = codigo.toUpperCase();
    }

    if (nombre) {
        nombre = nombre.toUpperCase()
    }

    if (marcaProducto) {
        const esMongoID = ObjectId.isValid(marcaProducto);
        if (esMongoID) {
            //  Verifico si no existe la marca
            const existeMarcaProducto = await MarcaProducto.findById({ _id: marcaProducto });
            if (!existeMarcaProducto) {
                return res.status(400).json({
                    msg: `La marca ${marcaProducto}, no existe existe`
                })
            }
        } else {
            return res.status(400).json({
                msg: `No es un un ID válido`
            })
        }
    }

    if (marcaAuto) {
        const esMongoID = ObjectId.isValid(marcaAuto);
        if (esMongoID) {
            //  Verifico si no existe la marca
            const existeMarcaAuto = await MarcaAuto.findById({ _id: marcaAuto });
            if (!existeMarcaAuto) {
                return res.status(400).json({
                    msg: `La marca ${marcaAuto}, no existe existe`
                })
            }
        } else {
            return res.status(400).json({
                msg: `No es un un ID válido`
            })
        }
    }

    if (categoria) {
        const esMongoID = ObjectId.isValid(categoria);
        if (esMongoID) {
            //  Verifico si no existe la marca
            const existeCategoria = await Categoria.findById({ _id: categoria });
            if (!existeCategoria) {
                return res.status(400).json({
                    msg: `La marca ${categoria}, no existe existe`
                })
            }
        } else {
            return res.status(400).json({
                msg: `No es un un ID válido`
            })
        }
    }


    const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

    res.json({ producto });

}

const borrarProducto = async (req, res = response) => {

    const { id } = req.params;
    const producto = await Producto.findByIdAndUpdate(id, { estado: false });

    res.json({
        producto,
    })

}

module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto
}