import { Router } from "express";
import { check } from "express-validator";

import validarCampos from "../middlewares/validar-campos.js";
import validarJWT from "../middlewares/validarJWT.js";

import { actualizarPrecios, cargarArchivo } from '../controllers/uploads.js';
import { validarArchivoSubir } from '../middlewares/validar-archivo.js';
import { esAdminRole } from '../middlewares/validar-roles.js';
import { camposObligatorios, existeProveedor, tieneProductosProveedor } from "../helpers/db-validators.js";

const router = Router();

router.post('/', [
    validarJWT,
    esAdminRole,
    validarArchivoSubir
], cargarArchivo);

router.post('/actualizar-precios/:id', [
    //validarJWT,
    //esAdminRole,
    validarArchivoSubir,
    check('id', 'El proveedor es obligatorio').not().isEmpty(),
    check('id', 'No es un un ID válido').isMongoId(),
    check('id').custom(existeProveedor),
    check('id').custom(tieneProductosProveedor),
    check('header').custom(camposObligatorios),
    validarCampos
], actualizarPrecios);

export default router;