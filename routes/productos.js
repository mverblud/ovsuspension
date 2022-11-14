import { Router } from "express";
import { check } from "express-validator";

import validarCampos from "../middlewares/validar-campos.js";
import validarJWT from "../middlewares/validarJWT.js";

import { crearProducto, obtenerProductos, obtenerProducto, actualizarProducto, borrarProducto } from '../controllers/productos.js';
import { existeCategoria, existeProducto, existeMarcaProducto, existeMarcaAuto,existeMarcaAutoModelo, existeProveedor } from '../helpers/db-validators.js';
import { esAdminRole } from '../middlewares/validar-roles.js';

const router = Router();

router.get('/',validarJWT, obtenerProductos);

router.get('/:id', [
    validarJWT,
    check('id', 'No es un un ID válido').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos
], obtenerProducto);

router.put('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un un ID válido').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos
], actualizarProducto);

router.post('/', [
    validarJWT,
    esAdminRole,
    check('codigo', 'El codigo es obligatorio').not().isEmpty(),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('marcaProducto', 'La marca producto es obligatorio').not().isEmpty(),
    check('marcaProducto', 'No es un un ID válido').isMongoId(),
    check('marcaProducto').custom(existeMarcaProducto),
    check('marcaAuto', 'La marca auto es obligatorio').not().isEmpty(),
    check('marcaAuto', 'No es un un ID válido').isMongoId(),
    check('marcaAuto').custom(existeMarcaAuto),
    check('categoria', 'La categoria es obligatorio').not().isEmpty(),
    check('categoria', 'No es un un ID válido').isMongoId(),
    check('categoria').custom(existeCategoria),
    check('marcaAutoModelo', 'El Modelo es obligatorio').not().isEmpty(),
    check('marcaAutoModelo', 'No es un un ID válido').isMongoId(),
    check('marcaAutoModelo').custom(existeMarcaAutoModelo),
    check('proveedor', 'El proveedor es obligatorio').not().isEmpty(),
    check('proveedor', 'No es un un ID válido').isMongoId(),
    check('proveedor').custom(existeProveedor),
    validarCampos
], crearProducto);

router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un un ID válido').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos
], borrarProducto);

export default router;