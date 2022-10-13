import { Router } from "express";
import { check } from "express-validator";

import validarCampos from "../middlewares/validar-campos.js";
import { login, googleSingIn, confirmarUsuario } from "../controllers/auth.js";

const router = Router();

// Area de acceso publico
router.get('/confirmar/:token', confirmarUsuario);

router.post('/login', [
    check('email', 'El Email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatorio').not().isEmpty(),
    validarCampos
], login);

router.post('/google', [
    check('id_token', 'id_token de google es necesario').not().isEmpty(),
    validarCampos
], googleSingIn);

export default router;