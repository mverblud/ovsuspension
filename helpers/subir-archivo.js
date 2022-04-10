const path = require('path');
const { v4: uuidv4 } = require('uuid');

const subirArchivo = (files, extensionValidas = ['txt', 'csv'], carpeta = '') => {

    return new Promise((resolve, reject) => {

        const { archivo } = files;
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[nombreCortado.length - 1];

        // Validar la extension
        if (!extensionValidas.includes(extension)) {
            return reject(`La extensión ${extension} no es permitida, ${extensionValidas}`)
        }

        const nombreTemp = uuidv4() + '.' + extension;

        const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemp);

        // Use the mv() method to place the file somewhere on your server
        archivo.mv(uploadPath, (err) => {
            if (err) {
                return reject(err);
            }

            resolve({
                nombreTemp,
                nombre: archivo.name,
                uploadPath
            });
        });
    })
}

module.exports = {
    subirArchivo
}