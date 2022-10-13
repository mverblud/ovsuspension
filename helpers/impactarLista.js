import MarcaAuto from "../models/marcaAuto.js";
import MarcaProducto from "../models/marcaProducto.js";
import Categoria from "../models/categoria.js";
import Producto from "../models/producto.js";

const impactarLista = async (marcaProductos = [], marcaAutos = [], categorias = [], productos = []) => {

    const [marcasIds, categoriasIds, marcaProductosIds] = await Promise.all([
        obtengoMarcaAuto(marcaAutos),
        obtengoCategoria(categorias),
        obtengoMarcaProductos(marcaProductos)
    ]);

    await completoProductos(productos, categoriasIds, marcasIds, marcaProductosIds);
    return productos;
}

const obtengoMarcaAuto = async (marcaAutos) => {
    const marcasIds = await Promise.all(marcaAutos.map(async (marca) => {
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
    return marcasIds;
};

const obtengoCategoria = async (categorias) => {
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
    return categoriasIds;
}

const obtengoMarcaProductos = async (marcaProductos) => {
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
    return marcaProductosIds;
}

const completoProductos = async (productos, categoriasIds, marcasIds, marcaProductosIds) => {

    /*     categoriasIds.map(categoria => {
            console.log(categoria.nombre);
        }) */

    categoriasIds.forEach(categoria => {
        productos.forEach(producto => {
            if (producto.categoria === categoria.nombre) {
                producto.categoriaId = categoria.id
            }
        })
    });

    marcasIds.forEach(marca => {
        productos.forEach(producto => {
            if (producto.marcaAuto === marca.nombre) {
                producto.marcaAutoId = marca.id;
            }
        })
    });

    marcaProductosIds.forEach(marcaP => {
        productos.forEach(producto => {
            if (producto.marcaProducto === marcaP.nombre) {
                producto.marcaProductoId = marcaP.id;
            }
        })
    });

    //return productos;
}

const impactarProductos = async (productos = []) => {

    await Promise.all(productos.map(async (producto) => {

        try {
            let { codigo, marcaProductoId, marcaAutoId, categoriaId, nombre } = producto;
            const productoDB = await Producto.findOne({ codigo });
            if (!productoDB) {
                const producto = new Producto({
                    codigo,
                    nombre,
                    marcaAuto: marcaAutoId,
                    marcaProducto: marcaProductoId,
                    categoria: categoriaId
                });

                // Guardar en BD
                await producto.save();
            } 
        } catch (error) {
            console.log('impactarProductos', error);
        }

    }));
}

export {
    impactarLista,
    impactarProductos
}