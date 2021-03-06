const { Router } = require('express');
const { check } = require('express-validator');
const { crearMarcaProducto, obtenerMarcaProductos, obtenerMarcaProducto, actualizarMarcaProducto, borrarMarcaProducto } = require('../controllers/marcaProductos');
const { existeMarcaProducto } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.get('/', obtenerMarcaProductos);

router.get('/:id', [
    check('id', 'No es un un ID válido').isMongoId(),
    check('id').custom(existeMarcaProducto),
    validarCampos
], obtenerMarcaProducto);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('nombreCorto', 'El nombre corto es obligatorio').not().isEmpty(),
    validarCampos
], crearMarcaProducto);

router.put('/:id', [
//    validarJWT,
    check('id', 'No es un un ID válido').isMongoId(),
    check('id').custom(existeMarcaProducto),
    validarCampos
], actualizarMarcaProducto);

router.delete('/:id', [
//    validarJWT,
//    esAdminRole,
    check('id', 'No es un un ID válido').isMongoId(),
    check('id').custom(existeMarcaProducto),
    validarCampos
], borrarMarcaProducto); 

module.exports = router;