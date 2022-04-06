const { Router } = require('express');
const { check } = require('express-validator');
const { obtenerCategoria, obtenerCategorias ,crearCategoria, actualizarCategoria, borrarCategoria} = require('../controllers/categorias');
const { existeCategoria } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.get('/', obtenerCategorias);

router.get('/:id', [
    check('id', 'No es un un ID válido').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos
], obtenerCategoria);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);

router.put('/:id', [
    //    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un un ID válido').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos
], actualizarCategoria);

router.delete('/:id', [
    //    validarJWT,
    //    esAdminRole,
    check('id', 'No es un un ID válido').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos
], borrarCategoria);

module.exports = router;