const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');
const fileUpload = require('express-fileupload');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.path = {
            auth:              '/api/auth',
            buscar :           '/api/buscar',
            productos:         '/api/productos',
            categorias:        '/api/categorias',
            marcaProductos:    '/api/marcaProductos',
            marcaAutos:        '/api/marcaAutos',
            marcaAutosModelos: '/api/marcaAutoModelos',
            usuarios:          '/api/usuarios',
            uploads:           '/api/uploads'
        }

        // Conectar a base de datos
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {

        // CORS
        this.app.use(cors());

        // Lectura y Parseo
        this.app.use(express.json());

        // Directorio publico
        this.app.use(express.static('public'));

        // Directorio publico
        this.app.use(express.static('public'));

        // Fileupload - Carga de Archivos
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }));
    }

    routes() {

        this.app.use(this.path.auth, require('../routes/auth'));
        this.app.use(this.path.buscar, require('../routes/buscar'));
        this.app.use(this.path.categorias, require('../routes/categorias'));
        this.app.use(this.path.productos, require('../routes/productos'));
        this.app.use(this.path.marcaProductos, require('../routes/marcaProductos'));
        this.app.use(this.path.marcaAutos, require('../routes/marcaAutos'));
        this.app.use(this.path.marcaAutosModelos, require('../routes/marcaAutoModelos'));
        this.app.use(this.path.usuarios, require('../routes/usuarios'));
        this.app.use(this.path.uploads, require('../routes/uploads'));

    }

    listen() {

        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en el puerto ', this.port);
        })
    }

}

module.exports = Server;