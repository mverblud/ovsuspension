const { response } = require("express");
const { subirArchivo } = require("../helpers/subir-archivo");
const { leerLista } = require('../helpers/leerLista');
const { impactarLista, impactarProductos } = require("../helpers/impactarLista");


const cargarArchivo = async (req, res = response) => {

    try {

        //  Subo Archivo csv
        const uploadPath = await subirArchivo(req.files, undefined, 'lista');
        //  obtengo resultado de la lectura
        const { productos, marcaProductos, marcaAutos, categorias } = await leerLista(uploadPath);
        //  impacto marcaProductos, marcaAutos, Categorias
        const { marcasIds, categoriasIds, marcaProductosIds } = await impactarLista(marcaProductos, marcaAutos, categorias);
    
        const { ok } = await impactarProductos(productos,marcasIds, categoriasIds, marcaProductosIds);

        if (ok) {
            res.json({
                uploadPath,
                productos: productos.length,
                marcaAutos: marcaAutos.length,
                categorias: categorias.length,
            });            
        }else{
            res.status(400).json({
                msg: 'No se pudo procesar el archivo.'
            });
        }

    } catch (msg) {
        res.status(400).json({
            msg
        });
    }

}

module.exports = {
    cargarArchivo,
}