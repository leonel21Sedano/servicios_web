require('dotenv').config();
const express = require('express');
const sequelize = require('./config/databases');
const routes = require('./routes/index');
const { logDatabaseOperation, handleDatabaseError } = require('./middleware/db.middleware');
const { validateUserData } = require('./middleware/validation.middleware');
const app = express();

const PORT = process.env.PORT || 3000;

// Middleware de base de datos para logging (aplicar primero)
app.use(logDatabaseOperation);

// Middleware estándar de Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

sequelize.sync()
    .then(() => console.log("DB is ready"))
    .catch(err => console.error(err));

// Aplicar middleware de validación a rutas específicas (ejemplo)
const authRouter = require('./routes/api/auth');
app.post('/api/register', validateUserData, authRouter);
app.post('/api/login', validateUserData, authRouter);

// Montar rutas regulares
const usersRouter = require('./routes/api/users');
app.use('/api/users', usersRouter);
app.use(routes.unprotectedRoutes);

// Montar las rutas privadas
const privateRoutes = require('./routes/private');
app.use('/api/private', privateRoutes);

// Middleware de manejo de errores de base de datos (debe ir después de todas las rutas)
app.use(handleDatabaseError);

// Middleware para manejar errores generales
app.use((err, req, res, next) => {
  console.error(`[Error] ${err.message}`);
  res.status(500).json({
    error: 'Error del servidor',
    message: process.env.NODE_ENV === 'production' ? 'Ocurrió un error interno' : err.message
  });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});




