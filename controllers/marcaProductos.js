const { response, request } = require('express');

const MarcaProducto = require('../models/marcaProducto');

const obtenerMarcaProductos = async (req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true }

    const [total, marcaProductos] = await Promise.all([
        MarcaProducto.countDocuments(query),
        MarcaProducto.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ])

    res.json({
        total,
        marcaProductos
    })

}

const obtenerMarcaProducto = async (req = request, res = response) => {

    const { id } = req.params;
    const marcaProducto = await MarcaProducto.findById({ _id: id });

    res.json({ marcaProducto })

}

const crearMarcaProducto = async (req, res = response) => {

    try {
        const { nombre, nombreCorto, img } = req.body;

        //  Verifico si no existe la marca
        const marcaProductoDB = await MarcaProducto.findOne({ nombre: nombre.toUpperCase() });
        if (marcaProductoDB) {
            return res.status(400).json({
                msg: `La marca ${marcaProductoDB.nombre}, ya existe`
            })
        }

        const marcaProducto = new MarcaProducto({
            nombre: nombre.toUpperCase(),
            nombreCorto: nombreCorto.toUpperCase(),
            img
        });

        // Guardar en BD
        await marcaProducto.save();

        res.status(201).json(marcaProducto)

    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: 'No se pudo actualizar marca del producto'
        })
    }
}

const actualizarMarcaProducto = async (req, res = response) => {

    const { id } = req.params;
    const { estado, ...data } = req.body;

    if (data.nombre) {
        data.nombre = data.nombre.toUpperCase();
    }
    
    if (data.nombreCorto) {
        data.nombreCorto = data.nombreCorto.toUpperCase();
    }

    const marcaProducto = await MarcaProducto.findByIdAndUpdate(id, data ,{new:true});

    res.json({marcaProducto});

}

const borrarMarcaProducto = async (req, res = response) => {

    const { id } = req.params;
    const marcaProducto = await MarcaProducto.findByIdAndUpdate(id, { estado: false });

    res.json({
        marcaProducto,
    })

}

module.exports = {
    obtenerMarcaProductos,
    obtenerMarcaProducto,
    crearMarcaProducto,
    actualizarMarcaProducto,
    borrarMarcaProducto
}