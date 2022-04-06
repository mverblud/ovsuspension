const { response, request } = require('express');

const Categoria = require('../models/categoria');

const obtenerCategorias = async (req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true }

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,
        categorias
    })

}

const obtenerCategoria = async (req = request, res = response) => {

    const { id } = req.params;
    const categoria = await Categoria.findById({ _id: id });
    res.json({ categoria });

}

const crearCategoria = async (req, res = response) => {

    try {

    //  Guardo nombre siempre en mayuscula
        const nombre = req.body.nombre.toUpperCase();

    //  Verifico si no existe la marca
        const categoriaDB = await Categoria.findOne({ nombre });
        if (categoriaDB) {
            return res.status(400).json({
                msg: `La marca ${categoriaDB.nombre}, ya existe`
            })
        }

        const categoria = new Categoria({ nombre });
        await categoria.save();

        res.status(201).json(categoria)

    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: 'No se pudo actualizar la categoria'
        })
    }
}

const actualizarCategoria = async (req, res = response) => {

    const { id } = req.params;
    const { estado, ...data } = req.body;

    if (data.nombre) {
        data.nombre = data.nombre.toUpperCase();
    }

    const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });

    res.json({ categoria });

}

const borrarCategoria = async (req, res = response) => {

    const { id } = req.params;
    const categoria = await Categoria.findByIdAndUpdate(id, { estado: false });

    res.json({
        categoria,
    })

}

module.exports = {
    obtenerCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria
}