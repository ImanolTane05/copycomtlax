const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const {
  crearEncuesta,
  obtenerEncuestas,
  obtenerResultados,
  responderEncuesta,
} = require('../controllers/encuestaController');

// Crear encuesta (solo admin autenticado)
router.post('/', verifyToken, crearEncuesta);

// Obtener todas las encuestas (público)
router.get('/', obtenerEncuestas);

// Obtener resultados (solo admin autenticado)
router.get('/resultados/:id', verifyToken, obtenerResultados);

// Responder encuesta (público, sin token)
router.post('/:id/responder', responderEncuesta);

module.exports = router;
