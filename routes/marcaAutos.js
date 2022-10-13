import { Router } from "express";
import { check }  from "express-validator";

import validarCampos from "../middlewares/validar-campos.js";
import validarJWT    from "../middlewares/validarJWT.js";

import { obtenerMarcaAuto, obtenerMarcaAutos, crearMarcaAuto, actualizarMarcaAuto, borrarMarcaAuto } from '../controllers/marcaAutos.js';
import { existeMarcaAuto } from '../helpers/db-validators.js';
import { esAdminRole }     from '../middlewares/validar-roles.js';

const router = Router();

router.get('/',validarJWT, obtenerMarcaAutos);

router.get('/:id', [
    validarJWT,
    check('id', 'No es un un ID válido').isMongoId(),
    check('id').custom(existeMarcaAuto),
    validarCampos
], obtenerMarcaAuto);

router.post('/', [
    validarJWT,
    esAdminRole,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearMarcaAuto);

router.put('/:id', [
    validarJWT,
    esAdminRole,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un un ID válido').isMongoId(),
    check('id').custom(existeMarcaAuto),
    validarCampos
], actualizarMarcaAuto);

router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un un ID válido').isMongoId(),
    check('id').custom(existeMarcaAuto),
    validarCampos
], borrarMarcaAuto);

export default router;