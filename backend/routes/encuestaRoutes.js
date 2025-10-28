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
    obtenerResumenRespuestasAbiertas,
} = require('../controllers/encuestaController');

// RUTAS DE ADMINISTRACIÓN (protegidas por Token y Admin)
router.get('/admin', verifyToken, verifyAdmin, obtenerEncuestasAdmin); 
router.post('/', verifyToken, verifyAdmin, crearEncuesta);
router.put('/:id', verifyToken, verifyAdmin, actualizarEncuesta);
router.delete('/:id', verifyToken, verifyAdmin, eliminarEncuesta);
router.patch('/:id/estado', verifyToken, verifyAdmin, cambiarEstadoEncuesta);

// Nueva ruta para el resumen con IA
router.get('/:encuestaId/pregunta/:preguntaId/resumen', verifyToken, verifyAdmin, obtenerResumenRespuestasAbiertas); 


// RUTAS PÚBLICAS (No requieren token)

router.get('/', obtenerEncuestasPublicas); 
router.get('/:id', obtenerEncuestaPorId); // ✅ DETALLE DE UNA ENCUESTA
router.post('/:id/responder', responderEncuesta); // Responder una encuesta


module.exports = router;