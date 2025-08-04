const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const { correo, contrasena } = req.body;

  try {
    const user = await User.findOne({ correo });
    if (!user) return res.status(404).json({ mensaje: "Usuario no encontrado" });

    const isMatch = await bcrypt.compare(contrasena, user.contrasena);
    if (!isMatch) return res.status(401).json({ mensaje: "Contraseña incorrecta" });

    if (user.rol !== "admin") {
      return res.status(403).json({ mensaje: "Acceso no autorizado" });
    }

    const token = jwt.sign(
      { id: user._id, rol: user.rol }, // ← CAMBIO AQUÍ
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al iniciar sesión", error: error.message });
  }
};

module.exports = { login };
