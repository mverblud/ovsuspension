const { response } = require("express");
const { subirArchivo } = require("../helpers/subir-archivo");
const { leerLista } = require('../helpers/leerLista');
const MarcaAuto = require("../models/marcaAuto");
const Categoria = require("../models/categoria");
const Producto = require("../models/producto");


const cargarArchivo = async (req, res = response) => {

    try {

        //  Subo Archivo csv
        const { nombre, nombreTemp, uploadPath } = await subirArchivo(req.files, undefined, 'lista');
        //  obtengo resultado de la lectura
        const { productos, marcaAutos, categorias } = await leerLista(uploadPath);

        const marcasIds = await Promise.all(marcaAutos.map(async (e) => {

            let id = ''
            const nombre = e;

            //  Verifico si no existe la marca la guardo en BD
            const marcaAutoDB = await MarcaAuto.findOne({ nombre });
            if (!marcaAutoDB) {
                const marcaAuto = new MarcaAuto(nombre);
                await marcaAuto.save();
                id = marcaAuto._id;
            } else {
                id = marcaAutoDB._id;
            }

            return {
                nombre,
                id
            }
        }));

        const categoriasIds = await Promise.all(categorias.map(async (e) => {

            let id = ''
            const nombre = e;

            //  Verifico si no existe la marca la guardo en BD
            const categoriaDB = await Categoria.findOne({ nombre });
            if (!categoriaDB) {
                const categoria = new Categoria(nombre);
                await categoria.save();
                id = categoria._id;
            } else {
                id = categoriaDB._id;
            }

            return {
                nombre: e,
                id
            }
        }));

        productos.forEach(async producto => {

            try {

                let codigo = producto.codigo.toUpperCase();
                let marca = producto.marcaAuto;
                let categoria = producto.categoria;
                let nombre = producto.nombre;

                const productoDB = await Producto.findOne({ codigo });
                if (!productoDB) {

                    const marcaId = marcasIds.find(marca => marca.nombre = marca);
                    const CategoriaId = categoriasIds.find(categoria => categoria.nombre = categoria);

                    const producto = new Producto({
                        codigo,
                        nombre,
                        marcaAuto: marcaId.id,
                        categoria: CategoriaId.id
                    });

                    // Guardar en BD
                    await producto.save();
                }
            } catch (error) {
                console.log('estoy tirando el error', error)
            }
        });

        res.json({
            nombre,
            nombreTemp,
            uploadPath,
            productos: productos.length,
            marcaAutos: marcaAutos.length,
            categorias: categorias.length,
        });

    } catch (msg) {
        res.status(400).json({
            msg
        });
    }

}

module.exports = {
    cargarArchivo,
}