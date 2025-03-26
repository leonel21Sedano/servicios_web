const UserModel = require("../models/User");
const { status } = require("http-status");
const bcrypt = require("bcrypt"); 
const token = require("../services/token");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(status.BAD_REQUEST)
        .json({ error: "Todos los campos son obligatorios." });
    }

    // Verificar si ya existe un usuario con ese email
    const existingUser = await UserModel.findOne({ where: { email } });
    if (existingUser) {
      return res.status(status.CONFLICT).json({ error: "El email ya está registrado." });
    }

    // Hashear la contraseña usando bcrypt
    const saltRounds = 10; 
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = await UserModel.create({ name, email, password: hashedPassword });

    return res.status(status.CREATED).json({
      mensaje: "Usuario registrado exitosamente.",
      user: { id: user.id, name: user.name, email: user.email } 
      // No devuelvas la contraseña, ni siquiera hasheada
    });
  } catch (exception) {
    return res.status(status.INTERNAL_SERVER_ERROR).json({ error: exception.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(status.BAD_REQUEST)
        .json({ error: "Email y contraseña son obligatorios." });
    }

    // Buscar el usuario por email
    const user = await UserModel.findOne({ where: { email } });
    if (!user) {
      return res.status(status.UNAUTHORIZED).json({ error: "Credenciales inválidas." });
    }

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(status.UNAUTHORIZED).json({ error: "Credenciales inválidas." });
    }

    // Generar token JWT
    const accessToken = token.generateToken(user);

    return res.status(status.OK).json({
      mensaje: "Inicio de sesión exitoso",
      user: { id: user.id, name: user.name, email: user.email },
      token: accessToken
    });
  } catch (exception) {
    return res.status(status.INTERNAL_SERVER_ERROR).json({ error: exception.message });
  }
};

module.exports = { register, login };
