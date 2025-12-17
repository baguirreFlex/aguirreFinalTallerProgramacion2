const jwt = require('jsonwebtoken');
const config = require('../config');

const authMiddleware = (req, res, next) => {
  // Verificar JWT
  const authHeader = req.headers['authorization'];
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      statusCode: 401,
      error: 'No autorizado. Se requiere JWT válido en el header Authorization: Bearer <token>'
    });
  }

  const token = authHeader.substring(7);
  
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({
      statusCode: 401,
      error: 'Token JWT inválido o expirado'
    });
  }
};

module.exports = authMiddleware;

