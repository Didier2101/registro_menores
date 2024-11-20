const { loginService } = require("../services/loginService");

const login = async (req, res) => {
  const { usuario, contrasena } = req.body;

  try {
    if (!usuario || !contrasena) {
      return res
        .status(400)
        .json({ error: "Todos los campos son obligatorios" });
    }

    const result = await loginService(usuario, contrasena);
    res.status(200).json({ message: "Inicio de sesión exitoso", ...result });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

module.exports = { login };
