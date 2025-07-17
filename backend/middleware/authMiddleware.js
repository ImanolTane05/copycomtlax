const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ mensaje: 'Token requerido' });
  }

  // Validar que el authHeader tenga formato correcto "Bearer token"
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ mensaje: 'Token inválido o incompleto' });
  }

  const token = parts[1];
  if (!token) {
    return res.status(401).json({ mensaje: 'Token no proporcionado' });
  }

  console.log('Token recibido:', token);
  console.log('JWT_SECRET:', process.env.JWT_SECRET);

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      const mensaje = err.name === 'TokenExpiredError'
        ? 'Token expirado'
        : 'Token inválido';
      return res.status(401).json({ mensaje });
    }

    // Validar que el payload contenga id o _id y rol
    if (!decoded || (!decoded.id && !decoded._id) || !decoded.rol) {
      return res.status(401).json({ mensaje: 'Token inválido o incompleto' });
    }

    // Normalizar id para usar siempre req.user.id
    req.user = {
      id: decoded.id || decoded._id,
      rol: decoded.rol,
    };

    next();
  });
};

const verifyAdmin = (req, res, next) => {
  if (!req.user || req.user.rol !== 'admin') {
    return res.status(403).json({ mensaje: 'Acceso restringido a administradores' });
  }
  next();
};

module.exports = {
  verifyToken,
  verifyAdmin
};
