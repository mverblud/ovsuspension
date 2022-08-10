const MarcaAuto = require("../models/marcaAuto");
const MarcaProducto = require("../models/marcaProducto");
const Categoria = require("../models/categoria");
const Producto = require("../models/producto");

const impactarLista = async (marcaProductos = [], marcaAutos = [], categorias = []) => {

    const marcasIds = await Promise.all(
        marcaAutos.map(async (marca) => {

            try {
                let id = ''
                const nombre = marca;

                //  Verifico si no existe la marca la guardo en BD
                const marcaAutoDB = await MarcaAuto.findOne({ nombre });
                if (!marcaAutoDB) {
                    const marcaAuto = new MarcaAuto({ nombre });
                    await marcaAuto.save();
                    id = marcaAuto._id;
                } else {
                    id = marcaAutoDB._id;
                }

                return {
                    nombre,
                    id
                }
            } catch (error) {
                console.log(error)
            }
        }));

    const categoriasIds = await Promise.all(

        categorias.map(async (categoria) => {
            try {
                let id = ''
                const nombre = categoria;

                //  Verifico si no existe la marca la guardo en BD
                const categoriaDB = await Categoria.findOne({ nombre });
                if (!categoriaDB) {
                    const categoria = new Categoria({ nombre });
                    await categoria.save();
                    id = categoria._id;
                } else {
                    id = categoriaDB._id;
                }

                return {
                    nombre,
                    id
                }
            } catch (error) {
                console.log(error)
            }
        }));

    const marcaProductosIds = await Promise.all(

        marcaProductos.map(async (marcaProducto) => {
            try {
                let id = ''
                const nombre = marcaProducto;

                //  Verifico si no existe la marca la guardo en BD
                const marcaProductoDB = await MarcaProducto.findOne({ nombre });
                if (!marcaProductoDB) {
                    const marcaProducto = new MarcaProducto({ nombre });
                    await marcaProducto.save();
                    id = marcaProducto._id;
                } else {
                    id = marcaProductoDB._id;
                }

                return {
                    nombre,
                    id
                }
            } catch (error) {
                console.log(error)
            }
        }));

    return {
        marcasIds,
        marcaProductosIds,
        categoriasIds
    }

}

const impactarProductos = async (productos = [], marcasIds = [], categoriasIds = [], marcaProductosIds = []) => {

    await Promise.all(productos.map(async (producto) => {

        try {

            let { codigo, marcaProducto, marcaAuto, categoria, nombre } = producto;
            const productoDB = await Producto.findOne({ codigo });
            if (!productoDB) {

                const marcaProductoId = await obtengoMarcaProductoId(marcaProductosIds, marcaProducto);
                const marcaId         = await obtengoMarcaId(marcasIds, marcaAuto);
                const CategoriaId     = await obtengoCategoriaId(categoriasIds, categoria);

                const producto = new Producto({
                    codigo,
                    nombre,
                    marcaAuto: marcaId.id,
                    marcaProducto: marcaProductoId.id,
                    categoria: CategoriaId.id
                });

                // Guardar en BD
                await producto.save();
            }
        } catch (error) {
            ok: false
        }

    }))

    return {
        ok: true,
    }

}

const obtengoMarcaProductoId = async (marcaProductosIds, marcaAuto) => {

    const marcaProductoId = marcaProductosIds.find(marcaP => marcaP.nombre === marcaAuto);

    return marcaProductoId;
}

const obtengoMarcaId = async (marcasIds, marcaAuto) => {

    const marcaId = marcasIds.find(marca => marca.nombre === marcaAuto);

    return marcaId;
}

const obtengoCategoriaId = async (categoriasIds, categoriaNombre) => {

    const CategoriaId = categoriasIds.find(categoria => categoria.nombre === categoriaNombre);

    return CategoriaId;
}


module.exports = {
    impactarLista,
    impactarProductos
}