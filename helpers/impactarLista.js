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
                producto.categoria = categoria.id
            }
        })
    });

    marcasIds.forEach(marca => {
        productos.forEach(producto => {
            if (producto.marcaAuto === marca.nombre) {
                producto.marcaAuto = marca.id;
            }
        })
    });

    marcaProductosIds.forEach(marcaP => {
        productos.forEach(producto => {
            if (producto.marcaProducto === marcaP.nombre) {
                producto.marcaProducto = marcaP.id;
            }
        })
    });

    proveedoresIds.forEach(proveedor => {
        productos.forEach(producto => {
            if (producto.proveedor === proveedor.nombreCorto) {
                producto.proveedor = proveedor.id;
            }
        })
    });

}

const impactarProductos = async (productos = []) => {

    try {
        Producto.insertMany(productos)
    } catch (error) {
        console.log('insertMany Productos', error);
    }
}

const actualizarPrecioProducto = async (productos, proveedor) => {

    let cantActualizada = 0;
    let productosNew = [];

    //  Verifico si existe y genero array para porder realizar update
    await Promise.all(productos.map(async producto => {
        const { codigo, precio, precioIva, iva } = producto;
        const productosDB = await Producto.find({ codigo, proveedor });
        if (productosDB.length !== 0) {
            productosDB.forEach(producto => {
                if (producto.precio !== precio) {
                    const productoNew = {
                        _id: producto._id,
                        precioIva,
                        iva,
                        precioAnterior: producto.precio,
                        precioNuevo: precio,
                        diferencia: parseFloat((precio - producto.precio).toFixed(2))
                    }
                    productosNew.push(productoNew);
                }
            })
        }
    }))

    console.log(productosNew);

    //  Impacto los productos
    await Promise.all(productosNew.map(async producto => {
        try {
            const { _id, precioNuevo, precioIva, iva } = producto;
            const productoUpd = await Producto.updateOne({ _id }, { precio: precioNuevo, precioIva, iva });
            if (productoUpd) {
                cantActualizada++;
            }
        } catch (error) {
            console.log('Explote en updateOne', error);
        }
    }))

    return {
        cantActualizada,
        productoGuardado: productosNew
    };
}

export {
    impactarLista,
    impactarProductos,
    actualizarPrecioProducto,
}