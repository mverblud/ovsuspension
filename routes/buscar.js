const { Router } = require('express');
const { buscar } = require('../controllers/buscar');

const router = Router();

router.get('/:coleccion/', buscar)

module.exports = router;