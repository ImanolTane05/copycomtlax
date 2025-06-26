require('dotenv').config();
const mongoose = require('mongoose');
const Encuesta = require('../models/Encuesta');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    await Encuesta.deleteMany();

    await Encuesta.insertMany([
      {
        pregunta: '¿Qué color prefieres?',
        tipo: 'opcion',
        opciones: ['Rojo', 'Azul', 'Verde'],
        respuestas: [],
      },
      {
        pregunta: '¿Qué mejorarías del sitio?',
        tipo: 'abierta',
        respuestas: [],
      }
    ]);

    console.log('Encuestas creadas');
    process.exit();
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
