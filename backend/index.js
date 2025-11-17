//const {APP_NAME}=require("shared");
//console.log(`Iniciando ${APP_NAME}...`);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const bodyParser=require('body-parser');

app.use(bodyParser.json({limit:"100mb"}));
app.use(bodyParser.urlencoded({extended:true,limit:"100mb"}));

// ✅ CONFIGURACIÓN CORS CORREGIDA
const allowedOrigins = [
  'http://localhost:5173', 
  'http://127.0.0.1:5173',
];

const corsOptions = {
    origin: '*', // Permite CUALQUIER origen para facilitar la prueba con el móvil
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true, 
};

app.use(cors(corsOptions));

// Middleware para analizar JSON
app.use(express.json());

// Servir Archivos Estáticos (Imágenes)
app.use('/uploads', express.static('uploads'));


// Rutas existentes
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

const tokenRoutes = require('./routes/tokenRoutes'); 
app.use('/api/tokens', tokenRoutes); 


// ✅ RUTA DE NOTIFICACIONES IMPORTADA Y USADA
const notificationRoutes = require('./routes/notificationRoutes'); 
app.use('/api', notificationRoutes); 


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