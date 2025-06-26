const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) return res.status(401).json({ mensaje: 'Token no proporcionado' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // puedes acceder al rol y _id desde aquí
    next();
  } catch (err) {
    return res.status(401).json({ mensaje: 'Token inválido o expirado' });
  }
};

module.exports = verifyToken;
