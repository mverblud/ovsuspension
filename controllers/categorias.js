import Categoria from '../models/categoria.js'

const obtenerCategorias = async (req, res) => {

    try {
        const { limite = 50, desde = 0 } = req.query;
        const query = { estado: true }

        const [total, categorias] = await Promise.all([
            Categoria.countDocuments(query),
            Categoria.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
                .sort({ nombre: 1 })
        ]);

        res.json({
            total,
            categorias
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: 'No se pudo obtener las categorias'
        })
    }

}

const obtenerCategoria = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const categoria = await Categoria.findById({ _id: id });
        res.json({ categoria });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: 'No se pudo obtener la categoria'
        })
    }
}

const crearCategoria = async (req, res = response) => {

    try {

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
            msg: 'No se pudo crear la categoria'
        })
    }
}

const actualizarCategoria = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;

        const categoria = await Categoria.findByIdAndUpdate(id, { nombre }, { new: true });

        res.json({ categoria })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: 'No se pudo actualizar la categoria'
        })
    }
}

const borrarCategoria = async (req, res = response) => {

    try {
        const { id } = req.params;
        const categoria = await Categoria.findByIdAndUpdate(id, { estado: false });

        res.json({
            categoria,
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: 'No se pudo borrar la categoria'
        })
    }
}

export {
    obtenerCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria
}