const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');

router.get('/profile', authMiddleware, (req, res) => {
  res.json({ 
    message: 'Perfil accedido correctamente', 
    user: req.user 
  });
});

router.get('/settings', authMiddleware, (req, res) => {
  res.json({ 
    message: 'Configuración accedida correctamente',
    userId: req.user.id
  });
});

module.exports = router;