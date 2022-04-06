const { Router } = require('express');
const { check } = require('express-validator');

const { existeCategoria, existeProducto, existeMarcaProducto, existeMarcaAuto } = require('../helpers/db-validators');
const { crearProducto, obtenerProductos,obtenerProducto, actualizarProducto, borrarProducto } = require('../controllers/productos');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.get('/',obtenerProductos);

router.get('/:id',[
    check('id', 'No es un un ID válido').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos
] ,obtenerProducto);

router.put('/:id', [
//    validarJWT,
    check('id', 'No es un un ID válido').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos
], actualizarProducto);

router.post('/', [
//    validarJWT,
    check('codigo','El codigo es obligatorio').not().isEmpty(),
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('marcaProducto','La marca producto es obligatorio').not().isEmpty(),
    check('marcaProducto', 'No es un un ID válido').isMongoId(),
    check('marcaProducto').custom(existeMarcaProducto),
    check('marcaAuto','La marca auto es obligatorio').not().isEmpty(),
    check('marcaAuto', 'No es un un ID válido').isMongoId(),
    check('marcaAuto').custom(existeMarcaAuto),
    check('categoria','La categoria es obligatorio').not().isEmpty(),
    check('categoria', 'No es un un ID válido').isMongoId(),
    check('categoria').custom(existeCategoria),
    validarCampos
], crearProducto);

router.delete('/:id', [
//    validarJWT,
//    esAdminRole,
    check('id', 'No es un un ID válido').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos
], borrarProducto);

module.exports = router;