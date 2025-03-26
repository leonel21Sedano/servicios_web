const User = require('../models/User');
const bcrypt = require('bcrypt');
const { status } = require('http-status');

const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(status.BAD_REQUEST).json({ error: "Todos los campos son obligatorios." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });

        return res.status(status.CREATED).json({
            message: "Usuario creado exitosamente.",
            user: { id: user.id, name: user.name, email: user.email }
        });
    } catch (error) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({ error: "Error al crear el usuario." });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        return res.status(status.OK).json(users);
    } catch (error) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({ error: "Error al obtener los usuarios." });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(status.NOT_FOUND).json({ error: "Usuario no encontrado." });
        }
        return res.status(status.OK).json(user);
    } catch (error) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({ error: "Error al obtener el usuario." });
    }
};

const updateUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(status.NOT_FOUND).json({ error: "Usuario no encontrado." });
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (password) user.password = await bcrypt.hash(password, 10);

        await user.save();
        return res.status(status.OK).json({ message: "Usuario actualizado exitosamente.", user });
    } catch (error) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({ error: "Error al actualizar el usuario." });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(status.NOT_FOUND).json({ error: "Usuario no encontrado." });
        }

        await user.destroy();
        return res.status(status.OK).json({ message: "Usuario eliminado exitosamente." });
    } catch (error) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({ error: "Error al eliminar el usuario." });
    }
};

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
};