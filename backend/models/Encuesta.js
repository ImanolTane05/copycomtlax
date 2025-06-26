const mongoose = require('mongoose');

const RespuestaSchema = new mongoose.Schema({
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  respuesta: { type: mongoose.Schema.Types.Mixed }
});

const EncuestaSchema = new mongoose.Schema({
  pregunta: { type: String, required: true },
  tipo: { type: String, enum: ['opcion', 'abierta'], required: true },
  opciones: [String],
  respuestas: [RespuestaSchema],
  creadaPor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fechaCreacion: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Encuesta', EncuestaSchema);
