/**
 * Middleware simple para registrar operaciones de base de datos
 */
const logDatabaseOperation = (req, res, next) => {
  // Obtener la fecha y hora actual
  const timestamp = new Date().toISOString();
  
  // Registrar información básica de la operación
  console.log(`[${timestamp}] Operación DB: ${req.method} ${req.path}`);
  
  // Registrar cuando la operación se complete
  res.on('finish', () => {
    const endTimestamp = new Date().toISOString();
    console.log(`[${endTimestamp}] Operación DB completada: ${req.method} ${req.path} - Estado: ${res.statusCode}`);
  });
  
  // Continuar con la siguiente función
  next();
};

const handleDatabaseError = (err, req, res, next) => {
  // Verificar si es un error relacionado con la base de datos
  if (err.name && err.name.includes('Sequelize')) {
    console.error(`Error de base de datos: ${err.message}`);
    
    return res.status(500).json({
      error: 'Error en la base de datos',
      message: 'Ocurrió un problema al procesar la solicitud en la base de datos'
    });
  }
  
  next(err);
};

module.exports = {
  logDatabaseOperation,
  handleDatabaseError
};