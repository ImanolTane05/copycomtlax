const express = require('express');
const router = express.Router();
const Encuesta = require('../models/encuesta');
const Respuesta = require('../models/Respuesta');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// Obtener todas las encuestas con resumen real de respuestas (solo admin)
router.get('/admin', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const encuestas = await Encuesta.find();

    const encuestasConResumen = await Promise.all(
      encuestas.map(async (encuesta) => {
        const preguntasConResumen = await Promise.all(
          encuesta.preguntas.map(async (pregunta) => {
            if (pregunta.tipo === 'Abierta') {
              return {
                ...pregunta.toObject(),
                resumen: {},
              };
            } else {
              const respuestas = await Respuesta.aggregate([
                { $match: { encuestaId: encuesta._id, preguntaId: pregunta._id } },
                { $group: { _id: '$respuesta', count: { $sum: 1 } } },
              ]);

              const resumen = {};
              respuestas.forEach((r) => {
                resumen[r._id] = r.count;
              });

              return {
                ...pregunta.toObject(),
                resumen,
              };
            }
          })
        );

        return {
          ...encuesta.toObject(),
          preguntas: preguntasConResumen,
        };
      })
    );

    res.json(encuestasConResumen);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener encuestas con resultados' });
  }
});

// Obtener todas las encuestas públicas (sin resumen)
router.get('/', async (req, res) => {
  try {
    const encuestas = await Encuesta.find({ cerrada: { $ne: true } });
    res.json(encuestas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener encuestas' });
  }
});

// Crear nueva encuesta - solo admin
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const nuevaEncuesta = new Encuesta({
      ...req.body,
      creadaPor: req.user.id,
      fechaPublicacion: new Date(),
    });
    await nuevaEncuesta.save();
    res.status(201).json(nuevaEncuesta);
  } catch (err) {
    res.status(400).json({ error: 'Error al crear encuesta' });
  }
});

// Editar encuesta existente - solo admin
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const encuesta = await Encuesta.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!encuesta) return res.status(404).json({ error: 'Encuesta no encontrada' });
    res.json(encuesta);
  } catch (err) {
    res.status(400).json({ error: 'Error al editar encuesta' });
  }
});

// Eliminar encuesta y respuestas relacionadas - solo admin
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const encuestaId = req.params.id;
    await Encuesta.findByIdAndDelete(encuestaId);
    await Respuesta.deleteMany({ encuestaId });
    res.json({ mensaje: 'Encuesta y respuestas eliminadas' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar encuesta y respuestas' });
  }
});

// Cerrar encuesta - solo admin
router.put('/cerrar/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const encuesta = await Encuesta.findByIdAndUpdate(req.params.id, { cerrada: true }, { new: true });
    if (!encuesta) return res.status(404).json({ error: 'Encuesta no encontrada' });
    res.json(encuesta);
  } catch (err) {
    res.status(500).json({ error: 'Error al cerrar encuesta' });
  }
});

// Responder encuesta (todas las respuestas juntas)
router.post('/:id/responder', async (req, res) => {
  try {
    const encuestaId = req.params.id;
    const { respuestas, usuarioId } = req.body; // [{ preguntaId, respuesta }, ...]

    const encuesta = await Encuesta.findById(encuestaId);
    if (!encuesta) return res.status(404).json({ error: 'Encuesta no encontrada' });

    if (!Array.isArray(respuestas) || respuestas.length === 0) {
      return res.status(400).json({ error: 'No se enviaron respuestas válidas' });
    }

    const respuestasDocs = respuestas.map((r) => ({
      encuestaId,
      preguntaId: r.preguntaId,
      usuarioId: usuarioId || null,
      respuesta: r.respuesta,
      fecha: new Date(),
    }));

    await Respuesta.insertMany(respuestasDocs);

    res.status(201).json({ message: 'Respuestas guardadas correctamente' });
  } catch (error) {
    console.error('Error al guardar respuestas:', error);
    res.status(500).json({ error: 'Error al guardar respuestas' });
  }
});

module.exports = router;
