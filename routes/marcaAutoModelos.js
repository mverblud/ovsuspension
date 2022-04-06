const { Router } = require('express');
const { check } = require('express-validator');
const { crearMarcaAutoModelo, obtenerMarcaAutoModelos, obtenerMarcaAutoModelo, actualizarMarcaAutoModelo, borrarMarcaAutoModelo } = require('../controllers/marcaAutoModelos');
const { existeMarcaAuto, existeMarcaAutoModelo } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.get('/', obtenerMarcaAutoModelos);

router.get('/:id', [
    check('id', 'No es un un ID válido').isMongoId(),
    check('id').custom(existeMarcaAutoModelo),
    validarCampos
], obtenerMarcaAutoModelo);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('marcaAuto','La marca del auto es obligatorio').not().isEmpty(),
    check('marcaAuto', 'No es un un ID válido').isMongoId(),
    check('marcaAuto').custom(existeMarcaAuto),
    validarCampos
], crearMarcaAutoModelo);

router.put('/:id', [
//    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un un ID válido').isMongoId(),
    check('id').custom(existeMarcaAutoModelo),
    validarCampos
], actualizarMarcaAutoModelo);

router.delete('/:id', [
//    validarJWT,
//    esAdminRole,
    check('id', 'No es un un ID válido').isMongoId(),
    check('id').custom(existeMarcaAutoModelo),
    validarCampos
], borrarMarcaAutoModelo);

module.exports = router;