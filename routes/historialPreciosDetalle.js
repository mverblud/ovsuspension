import { Router } from "express";
import { check } from "express-validator";

import validarCampos from "../middlewares/validar-campos.js";
import validarJWT from "../middlewares/validarJWT.js";

import { existeHistorialPrecios } from '../helpers/db-validators.js';
import { esAdminRole } from '../middlewares/validar-roles.js';
import { obtenerHistorialPreciosDetalle } from "../controllers/historialPreciosDetalle.js";

const router = Router();

router.get('/:id', [
    // validarJWT,
    // esAdminRole,
    check('id', 'No es un un ID válido').isMongoId(),
    check('id').custom(existeHistorialPrecios),
    validarCampos
], obtenerHistorialPreciosDetalle);

export default router;