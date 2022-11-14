import { subirArchivo } from "../helpers/subir-archivo.js";
import { leerLista, leerListaPrecios } from '../helpers/leerLista.js';
import { actualizarPrecioProducto, impactarLista, impactarProductos } from "../helpers/impactarLista.js";

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
        const uploadPath = await subirArchivo(req.files, undefined, 'lista');
        const { productos } = await leerListaPrecios(uploadPath);
        const { cantActualizada, cantTotal } = await actualizarPrecioProducto(productos, id)
        res.json({
            productosLeidos: productos.length,
            cantTotal,
            cantActualizada
        });

    } catch (error) {
        console.log('Error al cargarArchivo', error);
        res.status(400).json({ msg: 'Error al cargarArchivo' });
    }
}

export {
    cargarArchivo,
    actualizarPrecios
}