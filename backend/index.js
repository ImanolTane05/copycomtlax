const {APP_NAME}=require("shared");
console.log(`Iniciando ${APP_NAME}...`);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const bodyParser=require('body-parser');

app.use(bodyParser.json({limit:"100mb"}));
app.use(bodyParser.urlencoded({extended:true,limit:"100mb"}));

// Configurar CORS: permitir solicitudes desde localhost:3000 
app.use(cors({
  origin: 'http://localhost:5173',  // Cambia aquí si tu frontend usa otro origen
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true,  // Importante si usas cookies o sesiones
}));

// Middleware para analizar JSON, después de CORS
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
const contactRoutes = require('./routes/contactRoutes');
app.use('/api/contact', contactRoutes);

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error de conexión:', err));

app.get("/",(req,res)=>{
    res.send("API ejecutándose correctamente");
})

// Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});