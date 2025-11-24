const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "100mb" }));

// CORS liberado para conexión móvil
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Rutas principales
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/encuestas', require('./routes/encuestaRoutes'));
app.use('/api/noticias', require('./routes/noticiaRoutes'));
app.use('/api/upload', require('./middleware/imgUploadMiddleware'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/tokens', require('./routes/tokenRoutes'));


app.use('/api', require('./routes/notificationRoutes'));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Conectado a MongoDB'))
    .catch((err) => console.error('❌ Error de conexión:', err));

app.get("/", (req, res) => {
    res.send("API ejecutándose correctamente");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`)
);
