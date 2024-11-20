const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db"); // Configuración de conexión a la base de datos

const loginService = async (usuario, contrasena) => {
  const consulta = "SELECT * FROM usuarios WHERE usuario = ?";
  const [usuarios] = await pool.query(consulta, [usuario]);

  // Verificar si el usuario existe
  if (usuarios.length === 0) {
    throw new Error("Usuario o contraseña incorrectos");
  }

  const usuarioData = usuarios[0];

  // Verificar la contraseña
  const esValida = await bcrypt.compare(contrasena, usuarioData.contrasena);
  if (!esValida) {
    throw new Error("Usuario o contraseña incorrectos");
  }

  // Generar el token JWT
  const payload = {
    id: usuarioData.id,
    rol: usuarioData.rol,
    nombres: usuarioData.nombres,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });

  return {
    token,
    rol: usuarioData.rol,
    nombres: usuarioData.nombres,
    id: usuarioData.id,
  };
};

module.exports = { loginService };
