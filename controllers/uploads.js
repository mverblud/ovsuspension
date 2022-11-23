import { subirArchivo } from "../helpers/subir-archivo.js";
import { leerLista, leerListaPrecios } from '../helpers/leerLista.js';
import { actualizarPrecioProducto, impactarLista, impactarProductos } from "../helpers/impactarLista.js";
//import ActualizaPrecios from "../models/actualizaPrecios.js";

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
        const { id } = req.params;
        const { header } = req.body;

        const uploadPath = await subirArchivo(req.files, undefined, 'lista');
        //  Obtengo solo el nombre
        const nombreCortado = uploadPath.split('\\');
        const nombreArch = nombreCortado[nombreCortado.length - 1];

        //  Obtengo productos desde archivo
        const { productos } = await leerListaPrecios(uploadPath, header);
        //  Impacto en la BD
        const { cantActualizada, cantTotal, nombre, productoGuardado } = await actualizarPrecioProducto(productos, id);

/*         // Grabo info de la actualizacion de precio en BD
        const actualizaPrecio = new ActualizaPrecios({
            nombreArch,
            proveedor: id,
            cantLeidos: productos.length,
            cantActualizados: cantActualizada,
            productos: productoGuardado
        })

        // Guardar en BD
        await actualizaPrecio.save(); */

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