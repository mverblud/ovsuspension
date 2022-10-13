import { Router } from "express";

import { cargarArchivo } from '../controllers/uploads.js';
import { validarArchivoSubir } from '../middlewares/validar-archivo.js';
import validarJWT from "../middlewares/validarJWT.js";
import { esAdminRole } from '../middlewares/validar-roles.js';

const router = Router();

router.post('/', [validarJWT,
    esAdminRole,
    validarArchivoSubir
], cargarArchivo);

export default router;