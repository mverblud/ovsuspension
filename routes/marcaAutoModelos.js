import { Router } from "express";
import { check }  from "express-validator";

import validarCampos from "../middlewares/validar-campos.js";
import validarJWT    from "../middlewares/validarJWT.js";

import { crearMarcaAutoModelo, obtenerMarcaAutoModelos, obtenerMarcaAutoModelo, actualizarMarcaAutoModelo, borrarMarcaAutoModelo } from '../controllers/marcaAutoModelos.js';
import { existeMarcaAuto, existeMarcaAutoModelo } from '../helpers/db-validators.js';
import { esAdminRole } from '../middlewares/validar-roles.js';

const router = Router();

router.get('/', validarJWT, obtenerMarcaAutoModelos);

router.get('/:id', [
    validarJWT,
    check('id', 'No es un un ID válido').isMongoId(),
    check('id').custom(existeMarcaAutoModelo),
    validarCampos
], obtenerMarcaAutoModelo);

router.post('/', [
    validarJWT,
    esAdminRole,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearMarcaAutoModelo);

router.put('/:id', [
    validarJWT,
    esAdminRole,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un un ID válido').isMongoId(),
    check('id').custom(existeMarcaAutoModelo),
    validarCampos
], actualizarMarcaAutoModelo);

router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un un ID válido').isMongoId(),
    check('id').custom(existeMarcaAutoModelo),
    validarCampos
], borrarMarcaAutoModelo);

export default router;