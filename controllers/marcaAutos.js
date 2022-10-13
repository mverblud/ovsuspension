import MarcaAuto from '../models/marcaAuto.js';

const obtenerMarcaAutos = async (req, res) => {
    try {
        const { limite = 50, desde = 0 } = req.query;
        const query = { estado: true }

        const [total, marcaAutos] = await Promise.all([
            MarcaAuto.countDocuments(query),
            MarcaAuto.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
                .sort({ nombre: 1 })
        ]);

        res.json({
            total,
            marcaAutos
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: 'No se pudo obtener marcas de autos'
        });
    }
}

const obtenerMarcaAuto = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const marcaAuto = await MarcaAuto.findById({ _id: id });
        res.json({ marcaAuto });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: 'No se pudo obtener marca de auto'
        });
    }
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
            msg: 'No se pudo crear marca auto'
        })
    }
}

const actualizarMarcaAuto = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;

        const marcaAuto = await MarcaAuto.findByIdAndUpdate(id, { nombre }, { new: true });

        res.json({ marcaAuto });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: 'No se pudo actualizar marca de auto'
        });
    }
}

const borrarMarcaAuto = async (req, res = response) => {
    try {
        const { id } = req.params;
        const marcaAuto = await MarcaAuto.findByIdAndUpdate(id, { estado: false });

        res.json({
            marcaAuto,
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: 'No se pudo obtener borrar de autos'
        });
    }
}

export {
    obtenerMarcaAutos,
    obtenerMarcaAuto,
    crearMarcaAuto,
    actualizarMarcaAuto,
    borrarMarcaAuto
}