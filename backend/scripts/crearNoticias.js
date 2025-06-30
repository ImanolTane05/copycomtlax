require('dotenv').config();
const mongoose = require('mongoose');
const Noticia = require('../models/Noticia');

// TODO CREAR NOTICIAS
mongoose.connect(process.env.MONGO_URI)
    .then(async ()=> {
        try {
            // TODO
        } catch (e) {
            console.error("Error al insertar noticia: ",e);
            process.exit(1);
        }
    })