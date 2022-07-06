const csv = require('csv-parser');
const fs = require('fs');

const leerLista = (nombreArch) => {

    return new Promise((resolve, reject) => {

        const productos  = [];
        const marcaProductos = [];
        const marcaAutos = [];
        const categorias = [];

        fs.createReadStream(nombreArch)
            .pipe(csv({
                separator: ';',
                newline: '\n',
                headers: ['codigo','marcaProducto','marcaAuto', 'categoria', 'nombre'],
            }))
            .on('error', (err) => {
                return reject(`Error, ${err}`);
            })
            .on('data', (data) => {

                if (!marcaProductos.includes(data.marcaProducto.toUpperCase().trim())) {
                    marcaProductos.push(data.marcaProducto.toUpperCase().trim())
                }

                if (!marcaAutos.includes(data.marcaAuto.toUpperCase().trim())) {
                    marcaAutos.push(data.marcaAuto.toUpperCase().trim())
                }

                if (!categorias.includes(data.categoria.toUpperCase().trim())) {
                    categorias.push(data.categoria.toUpperCase().trim())
                }

                const producto = {
                    codigo:         data.codigo.toUpperCase().trim(),
                    marcaProducto : data.marcaProducto.toUpperCase().trim(),
                    marcaAuto:      data.marcaAuto.toUpperCase().trim(),
                    categoria:      data.categoria.toUpperCase().trim(),
                    nombre:         data.nombre.toUpperCase().trim(),
                }

                productos.push(producto);
            })
            .on('end', () => {

                resolve({
                    productos,
                    marcaProductos,
                    marcaAutos,
                    categorias
                });

            });

    })
};

module.exports = {
    leerLista
}



