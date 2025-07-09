const Encuesta = require('../models/Encuesta');
const Respuesta = require('../models/Respuesta');

// Crear nueva encuesta (solo admin)
exports.crearEncuesta = async (req, res) => {
  try {
    const { titulo, preguntas } = req.body;

    if (!titulo || !Array.isArray(preguntas) || preguntas.length === 0) {
      return res.status(400).json({ mensaje: 'Datos de encuesta incompletos' });
    }

    // Validación de preguntas
    for (const pregunta of preguntas) {
      if (!pregunta.texto || !pregunta.tipo) {
        return res.status(400).json({ mensaje: 'Cada pregunta debe tener texto y tipo' });
      }

      const tiposPermitidos = ['Abierta', 'Cerrada', 'Opción múltiple'];
      if (!tiposPermitidos.includes(pregunta.tipo)) {
        return res.status(400).json({ mensaje: 'Tipo de pregunta inválido: ' + pregunta.tipo });
      }

      if (['Cerrada', 'Opción múltiple'].includes(pregunta.tipo)) {
        if (!Array.isArray(pregunta.opciones) || pregunta.opciones.some(op => !op.trim())) {
          return res.status(400).json({ mensaje: 'Opciones inválidas en pregunta cerrada o múltiple' });
        }
      }
    }

    const encuesta = new Encuesta({
      titulo,
      preguntas,
      creadaPor: req.user?.id || null
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

// Responder encuesta (público)
exports.responderEncuesta = async (req, res) => {
  const { id: encuestaId } = req.params;
  const { preguntaId, respuesta } = req.body;

  try {
    const encuesta = await Encuesta.findById(encuestaId);
    if (!encuesta) return res.status(404).json({ mensaje: 'Encuesta no encontrada' });

    const pregunta = encuesta.preguntas.find(p => p._id.toString() === preguntaId);
    if (!pregunta) return res.status(404).json({ mensaje: 'Pregunta no encontrada en encuesta' });

    // Validar formato según tipo
    if (pregunta.tipo === 'Abierta') {
      if (!respuesta || typeof respuesta !== 'string') {
        return res.status(400).json({ mensaje: 'Respuesta inválida para pregunta abierta' });
      }
    } else {
      if (!pregunta.opciones.includes(respuesta)) {
        return res.status(400).json({ mensaje: 'Respuesta no coincide con las opciones disponibles' });
      }
    }

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

// Obtener resultados (solo admin)
exports.obtenerResultados = async (req, res) => {
  try {
    const encuestaId = req.params.id;
    const encuesta = await Encuesta.findById(encuestaId);
    if (!encuesta) return res.status(404).json({ mensaje: 'Encuesta no encontrada' });

    const respuestas = await Respuesta.find({ encuestaId });

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
