const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User'); // Ajusta la ruta si es necesario

async function crearAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Guarden sus nombres de usuario, correo y contraseña en .env
    const nombre = process.env.ADMIN_NAME;
    const correo = process.env.ADMIN_MAIL;
    const password = process.env.ADMIN_PASS; 

    const existe = await User.findOne({ correo });
    if (existe) {
      console.log('⚠️ El administrador ya existe.');
      return process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const contrasenaHasheada = await bcrypt.hash(password, salt);

    const nuevoAdmin = new User({
      nombre,
      correo,
      contrasena: contrasenaHasheada,
      rol: 'admin',
    });

    await nuevoAdmin.save();
    console.log('✅ Administrador creado correctamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creando administrador:', error);
    process.exit(1);
  }
}

crearAdmin();