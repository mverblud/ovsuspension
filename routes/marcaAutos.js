const { Router } = require('express');
const { check } = require('express-validator');
const { obtenerMarcaAuto, obtenerMarcaAutos, crearMarcaAuto, actualizarMarcaAuto, borrarMarcaAuto } = require('../controllers/marcaAutos');
const { existeMarcaAuto } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.get('/', obtenerMarcaAutos);

router.get('/:id', [
    check('id', 'No es un un ID válido').isMongoId(),
    check('id').custom(existeMarcaAuto),
    validarCampos
], obtenerMarcaAuto);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearMarcaAuto);

router.put('/:id', [
//    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un un ID válido').isMongoId(),
    check('id').custom(existeMarcaAuto),
    validarCampos
], actualizarMarcaAuto);

router.delete('/:id', [
//    validarJWT,
//    esAdminRole,
    check('id', 'No es un un ID válido').isMongoId(),
    check('id').custom(existeMarcaAuto),
    validarCampos
], borrarMarcaAuto);

module.exports = router;