import mongoose from 'mongoose';

import Producto from '../models/producto.js';
import Categoria from '../models/categoria.js';
import MarcaProducto from '../models/marcaProducto.js';
import MarcaAuto from '../models/marcaAuto.js';
import MarcaAutoModelo from '../models/marcaAutoModelo.js';
import Provedor from '../models/proveedor.js';


const obtenerProductos = async (req = request, res = response) => {

    try {
        const { limite = 5, desde = 0 } = req.query;
        const query = { estado: true }

        const [total, productos] = await Promise.all([
            Producto.countDocuments(query),
            Producto.find(query)
                .populate('categoria', 'nombre')
                .populate('marcaAuto', 'nombre')
                .populate('marcaProducto', 'nombre')
                .populate('marcaAutoModelo', 'nombre')
                .populate('proveedor', 'nombre')
                .skip(Number(desde))
                .limit(Number(limite))
        ])

        res.json({
            total,
            productos
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: 'No se pudo obtener los productos'
        })
    }
}

const obtenerProducto = async (req = request, res = response) => {

    try {
        const { id } = req.params;
        const producto = await Producto.findById({ _id: id })
            .populate('categoria', 'nombre')
            .populate('marcaAuto', 'nombre')
            .populate('marcaProducto', 'nombre')
            .populate('marcaAutoModelo', 'nombre')
            .populate('proveedor', 'nombre')

        res.json({ producto });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: 'No se pudo obtener el producto'
        })
    }
}

const crearProducto = async (req, res) => {

    try {

        const { codigo, nombre, marcaProducto, marcaAuto, marcaAutoModelo, categoria, stock, precio, iva, descuento, img, proveedor } = req.body;
        const productoDB = await Producto.findOne({ codigo });

        if (productoDB) {
            return res.status(400).json({
                msg: `El Producto ${productoDB.codigo}, ya existe`
            })
        }

        const producto = new Producto({
            codigo,
            nombre,
            marcaProducto,
            marcaAuto,
            marcaAutoModelo,
            categoria,
            stock,
            precio,
            iva,
            descuento,
            img,
            proveedor
        });

        // Guardar en BD
        await producto.save();

        res.status(201).json(producto)

    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: 'No se pudo crear el producto'
        })
    }
}

const actualizarProducto = async (req, res = response) => {

    try {
        const { id } = req.params;
        const { codigo, nombre, marcaProducto, marcaAuto, marcaAutoModelo, categoria, stock, precio, iva, descuento, img,proveedor } = req.body;

        if (codigo) {
            const productoDB = await Producto.findOne({ codigo });
            if (productoDB) {
                return res.status(400).json({
                    msg: `El Producto ${productoDB.codigo}, ya existe`
                })
            }
        }

        if (marcaProducto) {
            const esMongoID = mongoose.Types.ObjectId.isValid(marcaProducto);
            if (esMongoID) {
                //  Verifico si no existe la marca
                const existeMarcaProducto = await MarcaProducto.findById({ _id: marcaProducto });
                if (!existeMarcaProducto) {
                    return res.status(400).json({
                        msg: `La marca ${marcaProducto}, no existe existe`
                    })
                }
            } else {
                return res.status(400).json({
                    msg: `No es un un ID válido`
                })
            }
        }

        if (marcaAuto) {
            const esMongoID = mongoose.Types.ObjectId.isValid(marcaAuto);
            if (esMongoID) {
                //  Verifico si no existe la marca
                const existeMarcaAuto = await MarcaAuto.findById({ _id: marcaAuto });
                if (!existeMarcaAuto) {
                    return res.status(400).json({
                        msg: `La marca ${marcaAuto}, no existe existe`
                    })
                }
            } else {
                return res.status(400).json({
                    msg: `No es un un ID válido`
                })
            }
        }

        if (categoria) {
            const esMongoID = mongoose.Types.ObjectId.isValid(categoria);
            if (esMongoID) {
                //  Verifico si no existe la marca
                const existeCategoria = await Categoria.findById({ _id: categoria });
                if (!existeCategoria) {
                    return res.status(400).json({
                        msg: `La marca ${categoria}, no existe existe`
                    })
                }
            } else {
                return res.status(400).json({
                    msg: `No es un un ID válido`
                })
            }
        }

        if (marcaAutoModelo) {
            const esMongoID = mongoose.Types.ObjectId.isValid(marcaAutoModelo);
            if (esMongoID) {
                //  Verifico si no existe la marca
                const existeMarcaAutoModelo = await MarcaAutoModelo.findById({ _id: marcaAutoModelo });
                if (!existeMarcaAutoModelo) {
                    return res.status(400).json({
                        msg: `El modelo ${marcaAutoModelo}, no existe existe`
                    })
                }
            } else {
                return res.status(400).json({
                    msg: `No es un un ID válido`
                })
            }
        }

        if (proveedor) {
            const esMongoID = mongoose.Types.ObjectId.isValid(proveedor);
            if (esMongoID) {
                //  Verifico si no existe la marca
                const existeProveedor = await Provedor.findById({ _id: marcaAutoModelo });
                if (!existeProveedor) {
                    return res.status(400).json({
                        msg: `El Proveedor ${proveedor}, no existe existe`
                    })
                }
            } else {
                return res.status(400).json({
                    msg: `No es un un ID válido`
                })
            }
        }

        const data = {
            codigo,
            nombre,
            marcaProducto,
            marcaAuto,
            categoria,
            stock,
            precio,
            iva,
            descuento,
            img,
            proveedor
        };

        const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

        res.json({ producto });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: 'No se pudo actualizar el producto'
        })
    }
}

const borrarProducto = async (req, res = response) => {

    try {
        const { id } = req.params;
        const producto = await Producto.findByIdAndUpdate(id, { estado: false });

        res.json({
            producto,
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: 'No se pudo borrar el producto'
        })
    }
}

export {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto
}