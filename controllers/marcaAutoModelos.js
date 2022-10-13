import MarcaAutoModelo from '../models/marcaAutoModelo.js';
import MarcaAuto from '../models/marcaAuto.js';

const obtenerMarcaAutoModelos = async (req, res) => {
    try {
        const { limite = 50, desde = 0 } = req.query;
        const query = { estado: true };

        const [total, marcaAutoModelos] = await Promise.all([
            MarcaAutoModelo.countDocuments(query),
            MarcaAutoModelo.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
                .sort({ nombre: 1 })
        ]);

        res.json({
            total,
            marcaAutoModelos
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: 'No se pudo obtener marca auto modelo'
        });
    }
}

const obtenerMarcaAutoModelo = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const marcaAutoModelo = await MarcaAutoModelo.findById({ _id: id });
        res.json({ marcaAutoModelo });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: 'No se pudo obtener marca auto modelo'
        });
    }
}

const crearMarcaAutoModelo = async (req, res = response) => {
    try {
        const { nombre } = req.body;
        const marcaAutoModeloDB = await MarcaAutoModelo.findOne({ nombre: nombre.toUpperCase() });

        if (marcaAutoModeloDB) {
            return res.status(400).json({
                msg: `El modelo ${marcaAutoModeloDB.nombre}, ya existe`
            })
        }

        const marcaAutoModelo = new MarcaAutoModelo({ nombre });
        await marcaAutoModelo.save();
        res.status(201).json(marcaAutoModelo)

    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: 'No se pudo crear marca auto modelo'
        })
    }
}

const actualizarMarcaAutoModelo = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;

        const marcaAutoModelo = await MarcaAutoModelo.findByIdAndUpdate(id, { nombre }, { new: true });
        res.json({ marcaAutoModelo });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: 'No se pudo actualizar marca auto modelo'
        })
    }
}

const borrarMarcaAutoModelo = async (req, res = response) => {

    const { id } = req.params;
    const marcaAutoModelo = await MarcaAutoModelo.findByIdAndUpdate(id, { estado: false });

    res.json({
        marcaAutoModelo,
    })
}

export {
    obtenerMarcaAutoModelos,
    obtenerMarcaAutoModelo,
    crearMarcaAutoModelo,
    actualizarMarcaAutoModelo,
    borrarMarcaAutoModelo
}