const usuarioService = require("../services/usuarioService");

const crearUsuario = async (req, res) => {
  try {
    const usuario = req.body; // Suponiendo que los datos del usuario se envían en el cuerpo de la solicitud
    const usuarioId = await usuarioService.agregarUsuario(usuario);
    res.status(201).json({
      message: "Usuario creado exitosamente",
      usuarioId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Hubo un error al crear el usuario",
      error: error.message,
    });
  }
};

const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await usuarioService.obtenerUsuarios();
    res.status(200).json(usuarios);
  } catch (error) {
    console.error("error la obtener los usuarios", error);
    res.status(500).json({ message: "Hubo un error al obtener los usuarios" });
  }
};

const actualizarUsuario = async (req, res) => {
  try {
    // Obtener el ID del usuario desde los parámetros y los nuevos datos desde el cuerpo
    const idUsuario = req.params.id;
    const nuevoUsuario = req.body;

    await usuarioService.editarUsuario(idUsuario, nuevoUsuario);
    res.status(200).json({ message: "usuario actualizado correctamente" });
  } catch (error) {
    console.error("Error en el controlador actualizarUsuario:", error);

    // Manejo de errores
    res.status(500).json({
      message: "Hubo un error al actualizar el usuario",
      error: error.message,
    });
  }
};

const eliminarUsuario = async (req, res) => {
  try {
    const idUsuario = req.params.id;

    const resultado = await usuarioService.eliminarUsuario(idUsuario);

    res.status(200).json({
      message: resultado.message,
    });
  } catch (error) {
    console.error("Error en el controlador eliminarUsuario:", error);

    res.status(500).json({
      message: "Hubo un error al eliminar el usuario",
      error: error.message,
    });
  }
};

module.exports = {
  crearUsuario,
  obtenerUsuarios,
  actualizarUsuario,
  eliminarUsuario,
};
