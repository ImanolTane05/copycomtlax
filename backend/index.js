const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Configurar CORS: permitir solicitudes desde localhost:3000 (tu frontend)
app.use(cors({
  origin: 'http://localhost:3000',  // Cambia aquí si tu frontend usa otro origen
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,  // Importante si usas cookies o sesiones
}));

// Middleware para parsear JSON, después de CORS
app.use(express.json());

// Rutas
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const encuestaRoutes = require('./routes/encuestaRoutes');
app.use('/api/encuestas', encuestaRoutes);

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error de conexión:', err));

// Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
