import { subirArchivo } from "../helpers/subir-archivo.js";
import { leerLista, leerListaPrecios } from '../helpers/leerLista.js';
import { actualizarPrecioProducto, impactarLista, impactarProductos } from "../helpers/impactarLista.js";
import HistorialPrecios from "../models/historialPrecios.js";
import HistorialPreciosDetalle from "../models/historialPreciosDetalle.js";
import Producto from "../models/producto.js";
import Proveedor from "../models/proveedor.js";

const cargarArchivo = async (req, res) => {

    try {
        //  Subo Archivo csv
        const uploadPath = await subirArchivo(req.files, undefined, 'lista');
        //  obtengo resultado de la lectura
        const { productos, marcaProductos, marcaAutos, categorias, proveedores } = await leerLista(uploadPath);

        //  impacto marcaProductos, marcaAutos, Categorias y completo productos con sus ids
        const productosCompletos = await impactarLista(marcaProductos, marcaAutos, categorias, productos, proveedores);
        // impacto producto con toda la info ya completa
        await impactarProductos(productosCompletos);

        res.json({
            uploadPath,
            productos: productos.length,
            marcaAutos: marcaAutos.length,
            categorias: categorias.length,
            marcaProductos: marcaProductos.length,
            proveedores: proveedores.length
        });

    } catch (error) {
        console.log('Error al cargarArchivo', error);
        res.status(400).json({ msg: 'Error al cargarArchivo' });
    }

}

const actualizarPrecios = async (req, res) => {

    try {
        const { id: proveedor } = req.params;
        const { header } = req.body;

        const uploadPath = await subirArchivo(req.files, undefined, 'lista');
        const nombreCortado = uploadPath.split('\\');
        const nombreArch = nombreCortado[nombreCortado.length - 1];

        //  Obtengo productos desde archivo
        const { productos } = await leerListaPrecios(uploadPath, header);

        //  Impacto en la BD
        const { cantActualizada, productoGuardado } = await actualizarPrecioProducto(productos, proveedor);

        // Info Proveedor
        const [cantTotal, { nombre }] = await Promise.all([
            Producto.countDocuments({ proveedor }),
            Proveedor.findById({ _id: proveedor })
        ]);

    //  Grabo informacion de la actualizacion en la BD
        const historialPrecio = await HistorialPrecios.create({
            nombreArch,
            proveedor,
            cantLeidos: productos.length,
            cantActualizados: cantActualizada,
        })

        // Grabo HistorialPrecioDetalle
        await Promise.all(productoGuardado.map(async producto => {
            await HistorialPreciosDetalle.create({
                historialPrecio: historialPrecio._id,
                producto: producto.producto,
                precioAnterior: producto.precioAnterior,
                precioNuevo: producto.precioNuevo,
                diferencia: producto.diferencia
            })
        }))

        res.json({
            proveedor: {
                nombre,
                cantProductos: cantTotal,
            },
            infoArchivo: {
                nombreArchivo: nombreArch,
                header,
                productosLeidos: productos.length,
            },
            resultado: {
                cantLeidos: cantActualizada,
                cantActualizada,
            },
        });

    } catch (error) {
        console.log('Error al cargarArchivo', error);
        res.status(400).json({ msg: 'Error al cargarArchivo', error });
    }
}

export {
    cargarArchivo,
    actualizarPrecios
}