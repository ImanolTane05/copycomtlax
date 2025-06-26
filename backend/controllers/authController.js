const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { nombre, correo, contrasena, rol } = req.body;

    // Validar campos
    if (!nombre || !correo || !contrasena)
      return res.status(400).json({ mensaje: 'Faltan datos obligatorios' });

    // Verificar si ya existe usuario
    const existeUser = await User.findOne({ correo });
    if (existeUser) return res.status(400).json({ mensaje: 'Usuario ya existe' });

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const contrasenaHash = await bcrypt.hash(contrasena, salt);

    // Crear usuario
    const nuevoUser = new User({
      nombre,
      correo,
      contrasena: contrasenaHash,
      rol: rol || 'usuario', // por defecto usuario
    });

    await nuevoUser.save();

    res.status(201).json({ mensaje: 'Usuario registrado correctamente' });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

exports.login = async (req, res) => {
  const { correo, contrasena } = req.body;

  try {
    const user = await User.findOne({ correo });
    if (!user) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    const valido = await bcrypt.compare(contrasena, user.contrasena);
    if (!valido) return res.status(401).json({ mensaje: 'Contraseña incorrecta' });

    if (user.rol !== 'admin')
      return res.status(403).json({ mensaje: 'Acceso denegado: solo admins' });

    const token = jwt.sign(
      { _id: user._id, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, usuario: user.nombre });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};
