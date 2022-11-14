import express    from "express";
import cors       from "cors";
import fileUpload from "express-fileupload";

import dbConnection           from '../database/config.js';
import authRoute              from '../routes/auth.js';
import buscarRoute            from '../routes/buscar.js';
import usuariosRoute          from '../routes/usuarios.js';
import categoriasRoute        from '../routes/categorias.js';
import marcaProductosRoute    from '../routes/marcaProductos.js';
import marcaAutosRoute        from '../routes/marcaAutos.js';
import marcaAutosModelosRoute from '../routes/marcaAutoModelos.js';
import productosRoute         from '../routes/productos.js';
import proveedoresRoute       from '../routes/proveedores.js';
import uploadsRouter          from '../routes/uploads.js';

export default class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.path = {
            auth:              '/api/auth',
            buscar :           '/api/buscar',
            categorias:        '/api/categorias',
            marcaAutos:        '/api/marcaAutos',
            marcaAutosModelos: '/api/marcaAutoModelos',
            marcaProductos:    '/api/marcaProductos',
            productos:         '/api/productos',
            proveedores:       '/api/proveedores',
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
        this.app.use(express.urlencoded({ extended: true }));
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

        this.app.use(this.path.auth, authRoute);
        this.app.use(this.path.buscar, buscarRoute);
        this.app.use(this.path.categorias, categoriasRoute);
        this.app.use(this.path.productos, productosRoute);
        this.app.use(this.path.proveedores, proveedoresRoute)
        this.app.use(this.path.marcaProductos, marcaProductosRoute);
        this.app.use(this.path.marcaAutos, marcaAutosRoute);
        this.app.use(this.path.marcaAutosModelos, marcaAutosModelosRoute);
        this.app.use(this.path.usuarios, usuariosRoute);
        this.app.use(this.path.uploads, uploadsRouter);

    }

    listen() {

        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en el puerto', this.port);
        })
    }

}