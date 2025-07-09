const verifyAdmin = (req, res, next) => {
  if (!req.user || req.user.rol !== 'admin') {
    return res.status(403).json({ mensaje: 'Acceso restringido a administradores' });
  }
  next();
};

module.exports = {
  verifyAdmin
};
