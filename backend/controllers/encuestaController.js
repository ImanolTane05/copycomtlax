const Encuesta = require('../models/Encuesta');
const Respuesta = require('../models/Respuesta');

// Crear nueva encuesta
exports.crearEncuesta = async (req, res) => {
  try {
    const encuesta = new Encuesta({
      titulo: req.body.titulo,
      preguntas: req.body.preguntas,
      creadaPor: req.user?.id || null
    });
    await encuesta.save();
    res.status(201).json(encuesta);
  } catch (err) {
    console.error('❌ Error al crear encuesta:', err);
    res.status(500).json({ mensaje: 'Error al crear encuesta' });
  }
};

// Obtener todas las encuestas
exports.obtenerEncuestas = async (req, res) => {
  try {
    const encuestas = await Encuesta.find().sort({ fechaCreacion: -1 });
    res.json(encuestas);
  } catch (err) {
    console.error('❌ Error al obtener encuestas:', err);
    res.status(500).json({ mensaje: 'Error al obtener encuestas' });
  }
};

// Responder encuesta (guarda en colección separada)
exports.responderEncuesta = async (req, res) => {
  const { id: encuestaId } = req.params;
  const { preguntaId, respuesta } = req.body;

  try {
    const encuesta = await Encuesta.findById(encuestaId);
    if (!encuesta) return res.status(404).json({ mensaje: 'Encuesta no encontrada' });

    const preguntaExiste = encuesta.preguntas.some(p => p._id.toString() === preguntaId);
    if (!preguntaExiste) return res.status(404).json({ mensaje: 'Pregunta no encontrada en encuesta' });

    const nuevaRespuesta = new Respuesta({
      encuestaId,
      preguntaId,
      respuesta,
      usuarioId: req.user ? req.user.id : null
    });

    await nuevaRespuesta.save();

    res.status(201).json({ mensaje: 'Respuesta guardada correctamente' });
  } catch (error) {
    console.error('❌ Error al responder encuesta:', error);
    res.status(500).json({ mensaje: 'Error al guardar la respuesta' });
  }
};

// Obtener resultados (desde la colección Respuesta)
exports.obtenerResultados = async (req, res) => {
  try {
    const encuestaId = req.params.id;
    const encuesta = await Encuesta.findById(encuestaId);
    if (!encuesta) return res.status(404).json({ mensaje: 'Encuesta no encontrada' });

    // Obtener todas las respuestas relacionadas
    const respuestas = await Respuesta.find({ encuestaId });

    // Agrupar por pregunta
    const resultados = encuesta.preguntas.map(pregunta => {
      const respuestasDePregunta = respuestas.filter(r => r.preguntaId.toString() === pregunta._id.toString());
      return {
        _id: pregunta._id,
        texto: pregunta.texto,
        tipo: pregunta.tipo,
        opciones: pregunta.opciones,
        respuestas: respuestasDePregunta.map(r => ({ respuesta: r.respuesta }))
      };
    });

    res.json(resultados);
  } catch (err) {
    console.error('❌ Error al obtener resultados:', err);
    res.status(500).json({ mensaje: 'Error al obtener resultados' });
  }
};
