import { Router } from "express";
import { check }  from "express-validator";

import validarCampos from "../middlewares/validar-campos.js";
import validarJWT    from "../middlewares/validarJWT.js";

import { crearMarcaProducto, obtenerMarcaProductos, obtenerMarcaProducto, actualizarMarcaProducto, borrarMarcaProducto } from '../controllers/marcaProductos.js';
import { existeMarcaProducto } from '../helpers/db-validators.js';
import { esAdminRole }         from '../middlewares/validar-roles.js';

const router = Router();

router.get('/',validarJWT, obtenerMarcaProductos);

router.get('/:id', [
    validarJWT,
    check('id', 'No es un un ID válido').isMongoId(),
    check('id').custom(existeMarcaProducto),
    validarCampos
], obtenerMarcaProducto);

router.post('/', [
    validarJWT,
    esAdminRole,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('nombreCorto', 'El nombre corto es obligatorio').not().isEmpty(),
    validarCampos
], crearMarcaProducto);

router.put('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un un ID válido').isMongoId(),
    check('id').custom(existeMarcaProducto),
    validarCampos
], actualizarMarcaProducto);

router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un un ID válido').isMongoId(),
    check('id').custom(existeMarcaProducto),
    validarCampos
], borrarMarcaProducto); 

export default router;