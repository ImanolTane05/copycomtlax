const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');
const {
    crearEncuesta,
    obtenerEncuestasAdmin,
    obtenerEncuestasPublicas,
    obtenerEncuestaPorId,
    actualizarEncuesta,
    eliminarEncuesta,
    cambiarEstadoEncuesta,
    responderEncuesta,
} = require('../controllers/encuestaController');

// Rutas públicas
router.get('/', obtenerEncuestasPublicas);
router.post('/:id/responder', responderEncuesta);

// Rutas de administración (protegidas)
router.get('/admin', verifyToken, verifyAdmin, obtenerEncuestasAdmin);
router.get('/:id', verifyToken, verifyAdmin, obtenerEncuestaPorId);
router.post('/', verifyToken, verifyAdmin, crearEncuesta);
router.put('/:id', verifyToken, verifyAdmin, actualizarEncuesta);
router.delete('/:id', verifyToken, verifyAdmin, eliminarEncuesta);
router.put('/:id/estado', verifyToken, verifyAdmin, cambiarEstadoEncuesta);

module.exports = router;