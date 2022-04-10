const csv = require('csv-parser');
const fs = require('fs');

const leerLista = (nombreArch) => {

    return new Promise((resolve, reject) => {

        const productos  = [];
        const marcaAutos = [];
        const categorias = [];

        fs.createReadStream(nombreArch)
            .pipe(csv({
                separator: ',',
                newline: '\n',
                headers: ['codigo', 'marcaAuto', 'categoria', 'nombre', 'precio', 'iva'],
            }))
            .on('error', (err) => {
                return reject(`Error, ${err}`);
            })
            .on('data', (data) => {

                if (!marcaAutos.includes(data.marcaAuto.toUpperCase())) {
                    marcaAutos.push(data.marcaAuto.toUpperCase())
                }

                if (!categorias.includes(data.categoria.toUpperCase())) {
                    categorias.push(data.categoria.toUpperCase())
                }

                const producto = {
                    codigo: data.codigo.toUpperCase(),
                    marcaAuto: data.marcaAuto.toUpperCase(),
                    categoria: data.categoria.toUpperCase(),
                    nombre: data.nombre.toUpperCase(),
                }

                productos.push(producto);
            })
            .on('end', () => {

                resolve({
                    productos,
                    marcaAutos,
                    categorias
                });

            });

    })
};

module.exports = {
    leerLista
}



