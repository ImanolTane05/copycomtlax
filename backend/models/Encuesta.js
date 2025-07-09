const mongoose = require('mongoose');

const PreguntaSchema = new mongoose.Schema({
  texto: { type: String, required: true },
  tipo: {
    type: String,
    enum: ['Abierta', 'Cerrada', 'Opción múltiple'],
    required: true
  },
  opciones: {
    type: [String],
    default: [] // solo se usa para preguntas cerradas o múltiples
  }
});

const EncuestaSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  preguntas: [PreguntaSchema],
  creadaPor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fechaCreacion: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Encuesta', EncuestaSchema);
