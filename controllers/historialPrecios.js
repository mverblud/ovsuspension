import HistorialPrecios from '../models/historialPrecios.js'

const obtenerHistorialPrecios = async (req, res) => {

    try {
        const { limite = 50, desde = 0 } = req.query;

        const [total, historialPrecios] = await Promise.all([
            HistorialPrecios.countDocuments(),
            HistorialPrecios.find()
                .populate('proveedor', 'nombre')
                .skip(Number(desde))
                .limit(Number(limite))
                .sort({ nombre: 1 })
        ]);

        res.json({
            total,
            historialPrecios
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: 'No se pudo obtener las historialPrecios'
        })
    }

}

const obtenerHistorialPrecio = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const historialPrecio = await HistorialPrecios.findById({ _id: id }).populate('proveedor', 'nombre');
        res.json({ historialPrecio });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: 'No se pudo obtener la obtenerHistorialPrecio'
        })
    }
}

const borrarHistorialPrecios = async (req, res = response) => {

    try {
        const { id } = req.params;
        const historialPrecio = await HistorialPrecios.deleteOne(id);

        res.json({
            historialPrecio,
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: 'No se pudo borrar la borrarHistorialPrecios'
        })
    }
}

export {
    obtenerHistorialPrecios,
    obtenerHistorialPrecio,
    borrarHistorialPrecios
}