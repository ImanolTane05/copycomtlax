const mongoose = require('mongoose');

const RespuestaSchema = new mongoose.Schema({
  preguntaId: { type: mongoose.Schema.Types.ObjectId, required: true },
  respuesta: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
});

const PreguntaSchema = new mongoose.Schema({
  texto: { type: String, required: true },
  tipo: {
    type: String,
    enum: ['Abierta', 'Cerrada', 'Opción múltiple'],
    required: true,
  },
  opciones: {
    type: [String],
    default: [],
  },
  resumen: {
    type: Map,
    of: Number,
    default: {},
  }, // Estadísticas
});

const EncuestaSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  preguntas: [PreguntaSchema],
  respuestas: [RespuestaSchema], // <-- aquí almacenamos respuestas
  creadaPor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fechaCreacion: { type: Date, default: Date.now },
  fechaPublicacion: { type: Date },
  cerrada: { type: Boolean, default: false },
});

module.exports = mongoose.model('Encuesta', EncuestaSchema);
