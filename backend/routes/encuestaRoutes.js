const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');
const {
  crearEncuesta,
  obtenerEncuestas,
  obtenerResultados,
  responderEncuesta,
} = require('../controllers/encuestaController');

// Crear encuesta (solo admin)
router.post('/', verifyToken, verifyAdmin, crearEncuesta);

// Obtener todas las encuestas (público)
router.get('/', obtenerEncuestas);

// Obtener resultados (solo admin)
router.get('/resultados/:id', verifyToken, verifyAdmin, obtenerResultados);

// Responder encuesta (público)
router.post('/:id/responder', responderEncuesta);

module.exports = router;
