
const validateUserData = (req, res, next) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ 
      error: 'Faltan datos obligatorios',
      message: 'Nombre, email y contraseña son obligatorios' 
    });
  }
  
  // Validar formato de email (validación simple)
  if (!email.includes('@') || !email.includes('.')) {
    return res.status(400).json({ 
      error: 'Formato inválido',
      message: 'El email debe tener un formato válido' 
    });
  }
  
  // Validar longitud de contraseña
  if (password.length < 6) {
    return res.status(400).json({ 
      error: 'Contraseña débil',
      message: 'La contraseña debe tener al menos 6 caracteres' 
    });
  }
  
  next();
};

module.exports = {
  validateUserData
};