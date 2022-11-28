import MarcaAuto from "../models/marcaAuto.js";
import MarcaProducto from "../models/marcaProducto.js";
import Categoria from "../models/categoria.js";
import Producto from "../models/producto.js";
import Proveedor from "../models/proveedor.js";

const impactarLista = async (marcaProductos = [], marcaAutos = [], categorias = [], productos = [], proveedores = []) => {

    const [marcasIds, categoriasIds, marcaProductosIds, proveedoresIds] = await Promise.all([
        obtengoMarcaAuto(marcaAutos),
        obtengoCategoria(categorias),
        obtengoMarcaProductos(marcaProductos),
        obtengoProveedor(proveedores)
    ]);

    await completoProductos(productos, categoriasIds, marcasIds, marcaProductosIds, proveedoresIds);
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

const obtengoProveedor = async (proveedores) => {
    const proveedoresIds = await Promise.all(

        proveedores.map(async (proveedor) => {
            try {
                let id = '';
                let nombre = '';
                const nombreCorto = proveedor;

                //  Verifico si no existe la marca la guardo en BD
                const proveedorDB = await Proveedor.findOne({ nombreCorto });
                if (!proveedorDB) {
                    const proveedor = new Proveedor({ nombreCorto });
                    await proveedor.save();
                    id = proveedor._id;
                } else {
                    id = proveedorDB._id;
                    nombre = proveedorDB.nombre;
                }

                return {
                    nombre,
                    id,
                    nombreCorto
                }
            } catch (error) {
                console.log(error)
            }
        }));
    return proveedoresIds;
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

const completoProductos = async (productos, categoriasIds, marcasIds, marcaProductosIds, proveedoresIds) => {

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

    proveedoresIds.forEach(proveedor => {
        productos.forEach(producto => {
            if (producto.proveedor === proveedor.nombreCorto) {
                producto.proveedorId = proveedor.id;
            }
        })
    });

    console.log(productos);

}

const impactarProductos = async (productos = []) => {

    await Promise.all(productos.map(async (producto) => {

        try {
            let { codigo, marcaProductoId, marcaAutoId, categoriaId, nombre, proveedorId } = producto;
            const productoDB = await Producto.findOne({ codigo });
            if (!productoDB) {
                const producto = new Producto({
                    codigo,
                    nombre,
                    marcaAuto: marcaAutoId,
                    marcaProducto: marcaProductoId,
                    categoria: categoriaId,
                    proveedor: proveedorId
                });

                // Guardar en BD
                await producto.save();
            }
        } catch (error) {
            console.log('impactarProductos', error);
        }

    }));
}

const actualizarPrecioProducto = async (productos, id) => {

    let cantActualizada = 0;
    let productoGuardado = [];

    const [cantTotal, proveedor] = await Promise.all([
        Producto.countDocuments({ proveedor: id }),
        Proveedor.findById({ _id: id })
    ])

    const { nombre } = proveedor;

    if (cantTotal !== 0) {
        await Promise.all(productos.map(async producto => {
            try {
                //  Se realiza un find porque existe mas de un producto con el mismo codigo , y luego findbyIdUpdate para obtener el documento
                //  que se actualizo para guardar en en historialPrecios
                const { codigo, precio, precioIva, iva } = producto;
                const productosDB = await Producto.find({ codigo, proveedor: id });
                if (productosDB.length !== 0) {
                    if (productosDB[0].precio !== precio) {
                        if (productosDB.length === 1) {
                            //  Actualizo cuando cambia el precio
                            const productoUpd = await Producto.findByIdAndUpdate({ _id: productosDB[0]._id }, { precio, precioIva, iva });
                            if (productoUpd) {
                                cantActualizada++;
                                productoGuardado.push({
                                    producto: productoUpd._id,
                                    precioAnterior: productoUpd.precio,
                                    precioNuevo: precio,
                                    diferencia: (precio - productoUpd.precio).toFixed(2)
                                });
                            }
                        } else {
                            await Promise.all(productosDB.map(async producto => {
                                try {
                                    const { _id, } = producto;
                                    const productoUpd = await Producto.findByIdAndUpdate({ _id }, { precio, precioIva, iva });
                                    if (productoUpd) {
                                        cantActualizada++;
                                        productoGuardado.push({
                                            producto: productoUpd._id,
                                            precioAnterior: productoUpd.precio,
                                            precioNuevo: precio,
                                            diferencia: (precio - productoUpd.precio).toFixed(2)
                                        });
                                    }
                                } catch (error) {
                                    console.log('Explote en actualizarPrecioProducto3 update ++ producto', producto, error);
                                }
                            }))
                        }
                    }
                }else{
                    console.log(codigo);
                }
            } catch (error) {
                console.log('Explote en actualizarPrecioProducto3 producto', producto, error);
            }
        }))
    }

    return {
        cantActualizada,
        cantTotal,
        nombre,
        productoGuardado
    };
}

export {
    impactarLista,
    impactarProductos,
    actualizarPrecioProducto,
}