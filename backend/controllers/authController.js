const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { correo, contrasena } = req.body;

  try {
    const user = await User.findOne({ correo });
    if (!user) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    const valido = await bcrypt.compare(contrasena, user.contrasena);
    if (!valido) return res.status(401).json({ mensaje: 'Contraseña incorrecta' });

    if (user.rol !== 'admin') return res.status(403).json({ mensaje: 'Acceso denegado: solo admins' });

    const token = jwt.sign({ id: user._id, rol: user.rol }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token, usuario: user.nombre });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

