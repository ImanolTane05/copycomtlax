const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ mensaje: 'Token requerido' });

  const token = authHeader.split(' ')[1]; // Bearer token

  if (!token) return res.status(401).json({ mensaje: 'Token no proporcionado' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ mensaje: 'Token inválido' });
    req.user = decoded; // _id y rol
    next();
  });
};
