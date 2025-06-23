 const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ mensaje: 'Token no proporcionado' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.rol !== 'admin') return res.status(403).json({ mensaje: 'Solo admins pueden acceder' });
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ mensaje: 'Token inválido' });
  }
};

