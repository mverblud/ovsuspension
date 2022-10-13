import { Router } from "express";
import { check }  from "express-validator";

import validarCampos from "../middlewares/validar-campos.js";
import validarJWT    from "../middlewares/validarJWT.js";

import { usuarioGet, usuarioPut, usuarioPost, usuarioDelete, usuarioPatch } from '../controllers/usuarios.js';
import { esRolValido, emailExiste, existeUsuarioPorId }                     from '../helpers/db-validators.js';
import { esAdminRole } from '../middlewares/validar-roles.js';

//,tieneRole

const router = Router();

router.get('/', [
    validarJWT,
    esAdminRole,
    validarCampos
],usuarioGet);

/* router.put('/:id', [
    check('id', 'No es un un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(esRolValido),
    validarCampos
], usuarioPut); */

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe tener mas de 6 letras').isLength({ min: 6 }),
    check('email', 'El Email no es válido').isEmail(),
    check('email').custom(emailExiste),
    validarCampos
], usuarioPost);

/* router.patch('/', usuarioPatch);

router.delete('/:id', [
    validarJWT,
    //esAdminRole,
    //tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es un un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], usuarioDelete); */

export default router;