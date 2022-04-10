const { Router } = require('express');

const { cargarArchivo } = require('../controllers/uploads');
const { validarArchivoSubir } = require('../middlewares/validar-archivo');

const router = Router();

router.post('/', validarArchivoSubir, cargarArchivo);

module.exports = router;