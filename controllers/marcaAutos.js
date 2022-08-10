const { response, request } = require('express');

const MarcaAuto = require('../models/marcaAuto');

const obtenerMarcaAutos = async (req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true }

    const [total, marcaAutos] = await Promise.all([
        MarcaAuto.countDocuments(query),
        MarcaAuto.find(query)
            .populate('marcaAutoModelo','nombre')
            .skip(Number(desde))
            .limit(Number(limite))
            .sort({ nombre: 1 })
    ]);

    res.json({
        total,
        marcaAutos
    })

}

const obtenerMarcaAuto = async (req = request, res = response) => {

    const { id } = req.params;
    const marcaAuto = await MarcaAuto.findById({ _id: id }).populate('marcaAutoModelo');
    res.json({ marcaAuto });

}

const crearMarcaAuto = async (req, res = response) => {

    try {
        const nombre = req.body.nombre.toUpperCase();

        //  Verifico si no existe la marca
        const marcaAutoDB = await MarcaAuto.findOne({ nombre });
        if (marcaAutoDB) {
            return res.status(400).json({
                msg: `La marca ${marcaAutoDB.nombre}, ya existe`
            })
        }

        const marcaAuto = new MarcaAuto({ nombre });

        // Guardar en BD
        await marcaAuto.save();

        res.status(201).json(marcaAuto)

    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: 'No se pudo actualizar marca auto'
        })
    }
}

const actualizarMarcaAuto = async (req, res = response) => {

    const { id } = req.params;
    const { estado, ...data } = req.body;

    if (data.nombre) {
        data.nombre = data.nombre.toUpperCase();
    }

    const marcaAuto = await MarcaAuto.findByIdAndUpdate(id, data, { new: true });

    res.json({ marcaAuto });

}

const borrarMarcaAuto = async (req, res = response) => {

    const { id } = req.params;
    const marcaAuto = await MarcaAuto.findByIdAndUpdate(id, { estado: false });

    res.json({
        marcaAuto,
    })

}

module.exports = {
    obtenerMarcaAutos,
    obtenerMarcaAuto,
    crearMarcaAuto,
    actualizarMarcaAuto,
    borrarMarcaAuto
}