const mongoose = require('mongoose');

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
});

const EncuestaSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  preguntas: [PreguntaSchema],
  creadaPor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fechaCreacion: { type: Date, default: Date.now },
  fechaPublicacion: { type: Date },
  cerrada: { type: Boolean, default: false }, // Asegúrate de que se llame 'cerrada'
});

module.exports = mongoose.model('Encuesta', EncuestaSchema);