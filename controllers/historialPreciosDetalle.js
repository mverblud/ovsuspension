import HistorialPreciosDetalle from '../models/historialPreciosDetalle.js'

const obtenerHistorialPreciosDetalle = async (req, res) => {

    try {
        const { limite = 50, desde = 0 } = req.query;
        const { id } = req.params;
        const query = { historialPrecio: id }

        const [total, historialPreciosDetalle] = await Promise.all([
            HistorialPreciosDetalle.countDocuments(query),
            HistorialPreciosDetalle.find(query)
                .populate('producto', ['nombre','codigo'])
                .skip(Number(desde))
                .limit(Number(limite))
                .sort({ nombre: 1 })
        ]);

        res.json({
            total,
            historialPreciosDetalle
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: 'No se pudo obtener las obtenerHistorialPreciosDetalle'
        })
    }

}

export {
    obtenerHistorialPreciosDetalle,
}