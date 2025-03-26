const express = require('express');
const router = express.Router();
const userService = require('../../services/userService');

// Crear un nuevo usuario
router.post('/', userService.createUser);

// Obtener todos los usuarios
router.get('/', userService.getAllUsers);

// Obtener un usuario por ID
router.get('/:id', userService.getUserById);

// Actualizar un usuario por ID
router.put('/:id', userService.updateUser);

// Eliminar un usuario por ID
router.delete('/:id', userService.deleteUser);

module.exports = router;