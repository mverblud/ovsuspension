import { Router } from "express";
import { check } from "express-validator";

import validarCampos from "../middlewares/validar-campos.js";
import validarJWT from "../middlewares/validarJWT.js";

import { actualizarProveedor, borrarProveedor, crearProveedor, obtenerProveedor, obtenerProveedores } from '../controllers/proveedores.js';
import { existeProveedor } from '../helpers/db-validators.js';
import { esAdminRole } from '../middlewares/validar-roles.js';

const router = Router();

router.get('/', validarJWT, obtenerProveedores);

router.get('/:id', [
    validarJWT,
    check('id', 'No es un un ID válido').isMongoId(),
    check('id').custom(existeProveedor),
    validarCampos
], obtenerProveedor);

router.post('/', [
    validarJWT,
    esAdminRole,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('nombreCorto', 'El nombre Corto es obligatorio').not().isEmpty(),
    validarCampos
], crearProveedor);

router.put('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un un ID válido').isMongoId(),
    check('id').custom(existeProveedor),
    validarCampos
], actualizarProveedor);

router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un un ID válido').isMongoId(),
    check('id').custom(existeProveedor),
    validarCampos
], borrarProveedor);

export default router;