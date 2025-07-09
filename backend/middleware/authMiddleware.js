const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ mensaje: 'Token requerido' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ mensaje: 'Token no proporcionado' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      const mensaje = err.name === 'TokenExpiredError'
        ? 'Token expirado'
        : 'Token inválido';
      return res.status(401).json({ mensaje });
    }

    if (!decoded || !decoded.id || !decoded.rol) {
      return res.status(401).json({ mensaje: 'Token inválido o incompleto' });
    }

    req.user = decoded;
    next();
  });
};

const verifyAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ mensaje: 'No autenticado' });
  }
  if (req.user.rol !== 'admin') {
    return res.status(403).json({ mensaje: 'No autorizado' });
  }
  next();
};

module.exports = {
  verifyToken,
  verifyAdmin
};
