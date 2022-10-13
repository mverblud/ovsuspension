import { Router } from "express";
import { buscar } from '../controllers/buscar.js';
import validarJWT from "../middlewares/validarJWT.js";


const router = Router();

router.get('/:coleccion/', validarJWT, buscar)

export default router;