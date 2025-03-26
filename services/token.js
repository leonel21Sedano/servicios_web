const jwt = require('jsonwebtoken');
require('dotenv').config();

// Generar un token JWT
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '24h' // El token expira en 24 horas
    }
  );
};

// Verificar un token JWT
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return {
      success: true,
      data: decoded
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Middleware para proteger rutas
const authenticateToken = (req, res, next) => {
  // Obtener el token del header 'Authorization'
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
  }
  
  const verification = verifyToken(token);
  if (!verification.success) {
    return res.status(403).json({ error: 'Token inválido o expirado.' });
  }
  
  req.user = verification.data;
  next();
};

module.exports = {
  generateToken,
  verifyToken,
  authenticateToken
};