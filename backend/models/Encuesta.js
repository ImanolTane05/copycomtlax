const mongoose = require('mongoose');

// Subdocumento de pregunta
const PreguntaSchema = new mongoose.Schema({
  texto: { type: String, required: true },
  tipo: { 
    type: String, 
    enum: ['Abierta', 'Cerrada', 'Opción múltiple'], 
    required: true 
  },
  opciones: [String] // Solo se usa si tipo es Cerrada u Opción múltiple
});

// Esquema de encuesta principal
const EncuestaSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  preguntas: [PreguntaSchema],
  creadaPor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fechaCreacion: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Encuesta', EncuestaSchema);
