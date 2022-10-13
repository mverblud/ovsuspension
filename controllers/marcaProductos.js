import MarcaProducto from '../models/marcaProducto.js';

const obtenerMarcaProductos = async (req, res) => {
    try {
        const { limite = 50, desde = 0 } = req.query;
        const query = { estado: true }

        const [total, marcaProductos] = await Promise.all([
            MarcaProducto.countDocuments(query),
            MarcaProducto.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
                .sort({ nombre: 1 })
        ])

        res.json({
            total,
            marcaProductos
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: 'No se pudo obtener marcas del producto'
        })
    }
}

const obtenerMarcaProducto = async (req = request, res = response) => {

    try {
        const { id } = req.params;
        const marcaProducto = await MarcaProducto.findById({ _id: id });

        res.json({ marcaProducto })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: 'No se pudo obtener marca del producto'
        })
    }

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
            msg: 'No se pudo crear marca del producto'
        })
    }
}

const actualizarMarcaProducto = async (req, res = response) => {

    try {
        const { id } = req.params;
        const { estado, ...data } = req.body;

        if (data.nombre) {
            //  Verifico si no existe la marca
            const marcaProductoDB = await MarcaProducto.findOne({ nombre: data.nombre.toUpperCase() });
            if (marcaProductoDB) {
                return res.status(400).json({
                    msg: `La marca ${marcaProductoDB.nombre}, ya existe`
                })
            }
        }

        const marcaProducto = await MarcaProducto.findByIdAndUpdate(id, data, { new: true });

        res.json({ marcaProducto });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: 'No se pudo actualizar marca del producto'
        })
    }

}

const borrarMarcaProducto = async (req, res = response) => {

    try {
        const { id } = req.params;
        const marcaProducto = await MarcaProducto.findByIdAndUpdate(id, { estado: false });

        res.json({
            marcaProducto,
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: 'No se pudo borrar marca del producto'
        })
    }
}

export {
    obtenerMarcaProductos,
    obtenerMarcaProducto,
    crearMarcaProducto,
    actualizarMarcaProducto,
    borrarMarcaProducto
}