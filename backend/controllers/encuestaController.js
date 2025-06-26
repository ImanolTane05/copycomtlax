const Encuesta = require('../models/Encuesta');

// Crear nueva encuesta (requiere token admin)
exports.crearEncuesta = async (req, res) => {
  try {
    const encuesta = new Encuesta({
      ...req.body,
      creadaPor: req.user.id
    });
    await encuesta.save();
    res.status(201).json(encuesta);
  } catch (err) {
    console.error('❌ Error al crear encuesta:', err);
    res.status(500).json({ mensaje: 'Error al crear encuesta' });
  }
};

// Obtener todas las encuestas (público)
exports.obtenerEncuestas = async (req, res) => {
  try {
    const encuestas = await Encuesta.find().sort({ fechaCreacion: -1 });
    res.json(encuestas);
  } catch (err) {
    console.error('❌ Error al obtener encuestas:', err);
    res.status(500).json({ mensaje: 'Error al obtener encuestas' });
  }
};

// Responder encuesta (público, sin token)
exports.responderEncuesta = async (req, res) => {
  const { id } = req.params;
  const { respuesta } = req.body;

  try {
    const encuesta = await Encuesta.findById(id);
    if (!encuesta) return res.status(404).json({ mensaje: 'Encuesta no encontrada' });

    encuesta.respuestas.push({
      usuarioId: null,  // respuesta anónima
      respuesta
    });

    await encuesta.save();
    res.json({ mensaje: 'Respuesta guardada correctamente' });
  } catch (error) {
    console.error('❌ Error al responder encuesta:', error);
    res.status(500).json({ mensaje: 'Error al guardar la respuesta' });
  }
};

// Obtener resultados (requiere token admin)
exports.obtenerResultados = async (req, res) => {
  try {
    const encuesta = await Encuesta.findById(req.params.id);
    if (!encuesta) return res.status(404).json({ mensaje: 'Encuesta no encontrada' });

    res.json(encuesta.respuestas);
  } catch (err) {
    console.error('❌ Error al obtener resultados:', err);
    res.status(500).json({ mensaje: 'Error al obtener resultados' });
  }
};
