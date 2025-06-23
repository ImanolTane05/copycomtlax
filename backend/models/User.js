 const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  contrasena: { type: String, required: true },
  rol: { type: String, enum: ['usuario', 'admin'], default: 'usuario' }
});

module.exports = mongoose.model('User', UserSchema);

