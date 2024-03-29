import csv from 'csv-parser';
import fs from 'fs';

const leerLista = (nombreArch) => {
    return new Promise((resolve, reject) => {

        let productos = [];
        const marcaProductos = [];
        const marcaAutos = [];
        const categorias = [];
        const proveedores = [];

        fs.createReadStream(nombreArch)
            .pipe(csv({
                separator: ';',
                newline: '\n',
                headers: ['codigo', 'marcaProducto', 'marcaAuto', 'categoria', 'nombre', 'proveedor'],
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

                if (!proveedores.includes(data.proveedor.toUpperCase().trim())) {
                    proveedores.push(data.proveedor.toUpperCase().trim())
                }

                const producto = {
                    codigo: data.codigo.toUpperCase().trim(),
                    marcaProducto: data.marcaProducto.toUpperCase().trim(),
                    marcaAuto: data.marcaAuto.toUpperCase().trim(),
                    categoria: data.categoria.toUpperCase().trim(),
                    nombre: data.nombre.toUpperCase().trim(),
                    proveedor: data.proveedor.toUpperCase().trim()
                }

                productos.push(producto);
            })
            .on('end', () => {

                productos = productos.filter(producto => producto.codigo !== '');
                productos = productos.filter(producto => producto.nombre !== '');

                resolve({
                    productos,
                    marcaProductos,
                    marcaAutos,
                    categorias,
                    proveedores
                });

            });

    })
};

const leerListaPrecios = (nombreArch, header = []) => {

    return new Promise((resolve, reject) => {

        let productos = [];

        fs.createReadStream(nombreArch)
            .pipe(csv({
                separator: ';',
                newline: '\n',
                headers: header,//['', 'codigo', 'precio', 'img',],
            }))
            .on('error', (err) => {
                console.log(err);
                return reject(`Error, ${err}`);
            })
            .on('data', (data) => {
                
                let precioIva = 0;
                let precio = 0;
                let iva = 21;

                if (!isNaN(data.precio)) {
                    precio = parseFloat(data.precio).toFixed(2);
                    precioIva = parseFloat((precio * 1.21)).toFixed(2);
                } else {
                    iva = 0;
                }

                const producto = {
                    codigo: data.codigo.toUpperCase().trim(),
                    precio: parseFloat(precio),
                    precioIva: parseFloat(precioIva),
                    iva
                }

                productos.push(producto);
            })
            .on('end', () => {
                productos = productos.filter(producto => producto.precio !== 0);
                productos = productos.filter(producto => producto.codigo !== '');
                resolve({
                    productos,
                });
            });

    })
};

export {
    leerLista,
    leerListaPrecios
}



