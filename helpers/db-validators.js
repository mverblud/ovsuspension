const MarcaAuto  = require('../models/marcaAuto');
const MarcaAutoModelo = require('../models/marcaAutoModelo');
const MarcaProducto = require('../models/marcaProducto');

const existeMarcaAuto = async (id = '') => {

    const existeMarca = await MarcaAuto.findById({ _id:id });

    if (!existeMarca) {
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

module.exports = {
    existeMarcaAuto,
    existeMarcaAutoModelo,
    existeMarcaProducto
}