const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const bodyParser=require('body-parser');

app.use(bodyParser.json({limit:"100mb"}));
app.use(bodyParser.urlencoded({extended:true,limit:"100mb"}));

// Middleware CORS - configuración explícita
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

app.use(express.json());

// Rutas
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const encuestaRoutes = require('./routes/encuestaRoutes');
app.use('/api/encuestas', encuestaRoutes);

const noticiaRoutes = require('./routes/noticiaRoutes');
app.use('/api/noticias', noticiaRoutes);

const uploadRoutes=require('./middleware/imgUploadMiddleware');
app.use('/api/upload',uploadRoutes);

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error de conexión:', err));

// Puerto del servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
