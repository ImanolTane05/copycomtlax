const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');
const {
  crearEncuesta,
  obtenerEncuestas,
  obtenerResultados,
  responderEncuesta,
  actualizarEncuesta,
  eliminarEncuesta,
  cerrarEncuesta
} = require('../controllers/encuestaController');

// Crear encuesta (solo admin)
router.post('/', verifyToken, verifyAdmin, crearEncuesta);

// Obtener todas las encuestas (público)
router.get('/', obtenerEncuestas);

// Obtener resultados de una encuesta (solo admin)
router.get('/resultados/:id', verifyToken, verifyAdmin, obtenerResultados);

// Responder encuesta (público)
router.post('/:id/responder', responderEncuesta);

// Editar encuesta (solo admin)
router.put('/:id', verifyToken, verifyAdmin, actualizarEncuesta);

// Eliminar encuesta (solo admin)
router.delete('/:id', verifyToken, verifyAdmin, eliminarEncuesta);

// Cerrar encuesta (solo admin)
router.patch('/:id/cerrar', verifyToken, verifyAdmin, cerrarEncuesta);

module.exports = router;
