const path = require('path');

const subirArchivo = (files, extensionValidas = ['txt', 'csv'], carpeta = '') => {

    return new Promise((resolve, reject) => {

        const { archivo } = files;
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[nombreCortado.length - 1];

        // Validar la extension
        if (!extensionValidas.includes(extension)) {
            return reject(`La extensión ${extension} no es permitida, ${extensionValidas}`)
        }

        const uploadPath = path.join(__dirname, '../uploads/', carpeta, archivo.name);

        archivo.mv(uploadPath, (err) => {
            if (err) {
                return reject(err);
            }

            resolve(uploadPath);
        });
    })
}

module.exports = {
    subirArchivo
}