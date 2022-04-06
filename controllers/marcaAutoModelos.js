const { response, request } = require('express');

const MarcaAutoModelo = require('../models/marcaAutoModelo');
const MarcaAuto = require('../models/marcaAuto');

const obtenerMarcaAutoModelos = async (req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true }

    const [total, marcaAutoModelos] = await Promise.all([
        MarcaAutoModelo.countDocuments(query),
        MarcaAutoModelo.find(query)
            .populate('marcaAuto', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ])

    res.json({
        total,
        marcaAutoModelos
    })

}

const obtenerMarcaAutoModelo = async (req = request, res = response) => {

    const { id } = req.params;
    const marcaAutoModelo = await MarcaAutoModelo.findById({ _id: id }).populate('marcaAuto', 'nombre');

    res.json({ marcaAutoModelo })

}

const crearMarcaAutoModelo = async (req, res = response) => {

    try {
        const { nombre, marcaAuto } = req.body;

        const marcaAutoModeloDB = await MarcaAutoModelo.findOne({ nombre: nombre.toUpperCase() });

        if (marcaAutoModeloDB) {
            return res.status(400).json({
                msg: `El modelo ${marcaAutoModeloDB.nombre}, ya existe`
            })
        }

        const marcaAutoModelo = new MarcaAutoModelo({ nombre: nombre.toUpperCase(), marcaAuto });
        // Guardar en BD
        await marcaAutoModelo.save();

        const marcaAutoAux = await MarcaAuto.findById(marcaAutoModelo.marcaAuto);
        marcaAutoAux.marcaAutoModelo.push(marcaAutoModelo._id);

        await MarcaAuto.updateOne({ _id: marcaAutoAux._id }, marcaAutoAux);

        res.status(201).json(marcaAutoModelo)

    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: 'No se pudo actualizar la caterogia'
        })
    }
}

const actualizarMarcaAutoModelo = async (req, res = response) => {

    const { id } = req.params;
    const { estado, marcaAuto, ...data } = req.body;

    if (data.nombre) {
        data.nombre = data.nombre.toUpperCase();
    }

    const marcaAutoModelo = await MarcaAutoModelo.findByIdAndUpdate(id, data, { new: true }).populate('marcaAuto', 'nombre');

    res.json({ marcaAutoModelo });

}

const borrarMarcaAutoModelo = async (req, res = response) => {

    const { id } = req.params;
    const marcaAutoModelo = await MarcaAutoModelo.findByIdAndUpdate(id, { estado: false });

    res.json({
        marcaAutoModelo,
    })

}

module.exports = {
    obtenerMarcaAutoModelos,
    obtenerMarcaAutoModelo,
    crearMarcaAutoModelo,
    actualizarMarcaAutoModelo,
    borrarMarcaAutoModelo
}