const mongoose = require('mongoose');

const RespuestaSchema = new mongoose.Schema({
  encuestaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Encuesta', required: true },
  preguntaId: { type: mongoose.Schema.Types.ObjectId, required: true },
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  respuesta: { type: mongoose.Schema.Types.Mixed, required: true },
  fecha: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Respuesta', RespuestaSchema);
