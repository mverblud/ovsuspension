import Proveedor from '../models/proveedor.js';

const obtenerProveedores = async (req, res) => {

    try {
        const { limite = 50, desde = 0 } = req.query;

        const [total, proveedores] = await Promise.all([
            Proveedor.countDocuments(),
            Proveedor.find()
                .skip(Number(desde))
                .limit(Number(limite))
                .sort({ nombre: 1 })
        ]);

        res.json({
            total,
            proveedores
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: 'No se pudo obtener los proveedores'
        })
    }

}

const obtenerProveedor = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const proveedor = await Proveedor.findById({ _id: id });
        res.json({ proveedor });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: 'No se pudo obtener el proveedor'
        })
    }
}

const crearProveedor = async (req, res = response) => {

    try {
        const { nombre, nombreCorto, direccion, telefono, email } = req.body;

        //  Verifico si no existe el rproveedor
        const proveedorDB = await Proveedor.findOne({ nombre });
        if (proveedorDB) {
            return res.status(400).json({
                msg: `El Proveedor ${proveedorDB.nombre}, ya existe`
            })
        };

        const proveedor = new Proveedor({ nombre, nombreCorto, direccion, telefono, email });
        await proveedor.save();
        res.status(201).json(proveedor)

    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: 'No se pudo crear el Proveedor'
        })
    }
}

const actualizarProveedor = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { nombre, nombreCorto, direccion, telefono, email } = req.body;

        if (nombre) {
            //  Verifico si no existe el rproveedor
            const proveedorDB = await Proveedor.findOne({ nombre });
            if (proveedorDB) {
                return res.status(400).json({
                    msg: `El Proveedor ${proveedorDB.nombre}, ya existe`
                })
            };
        }

        const proveedor = await Proveedor.findByIdAndUpdate(id, { nombre, nombreCorto, direccion, telefono, email }, { new: true });
        res.json({ proveedor });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: 'No se pudo actualizar el proveedor'
        })
    }
}

const borrarProveedor = async (req, res = response) => {

    try {
        const { id } = req.params;
        const proveedor = await Proveedor.deleteOne({ _id: id });
        res.json({ proveedor });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: 'No se pudo borrar el Proveedor'
        })
    }
}

export {
    obtenerProveedores,
    obtenerProveedor,
    crearProveedor,
    actualizarProveedor,
    borrarProveedor
}