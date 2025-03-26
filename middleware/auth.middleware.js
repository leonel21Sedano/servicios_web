const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  // Obtener el token del header Authorization
  const authHeader = req.headers['authorization'];
  
  // Verificar si existe el header y tiene el formato correcto
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error: 'Acceso denegado', 
      message: 'Token de autenticación no proporcionado' 
    });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = decoded;
    
    next();
  } catch (error) {
    console.error('Error de autenticación:', error.message);
    return res.status(403).json({ 
      error: 'Acceso denegado', 
      message: 'Token inválido o expirado' 
    });
  }
};

module.exports = authMiddleware;