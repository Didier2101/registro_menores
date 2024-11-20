const pool = require("../config/db");
const bcrypt = require("bcryptjs");

const agregarUsuario = async (usuario) => {
  try {
    if (
      !usuario.nombres ||
      !usuario.numero_documento ||
      !usuario.usuario ||
      !usuario.contrasena ||
      !usuario.rol
    ) {
      throw new Error("Todos los campos son obligatorios");
    }

    const [cedulaExistente] = await pool.query(
      "SELECT * FROM usuarios WHERE numero_documento = ?",
      [usuario.numero_documento]
    );
    if (cedulaExistente.length > 0) {
      throw new Error("El número de documento ya está registrado");
    }

    const contrasenaEncriptada = await bcrypt.hash(usuario.contrasena, 10);

    const insertarUsuario = `INSERT INTO usuarios(nombres, numero_documento, usuario, contrasena, rol)
    VALUES(?,?,?,?,?)`;

    const valoresUsuario = [
      usuario.nombres,
      usuario.numero_documento,
      usuario.usuario,
      contrasenaEncriptada,
      usuario.rol,
    ];

    const [resultadoUsuarioInsertado] = await pool.query(
      insertarUsuario,
      valoresUsuario
    );

    return resultadoUsuarioInsertado.insertId;
  } catch (error) {
    throw error;
  }
};

// codigo para obtener usuarios

const obtenerUsuarios = async () => {
  try {
    const resultadoUsuarios = "SELECT * FROM usuarios";
    const [usuarios, _] = await pool.query(resultadoUsuarios);
    return usuarios;
  } catch (error) {
    console.error("Error al obtener los usuarios", error);
    throw error;
  }
};

// codigo para editar usuarios
const editarUsuario = async (idUsuario, nuevoUsuario) => {
  try {
    // Validar si todos los campos necesarios están presentes
    if (!nuevoUsuario.nombres || !nuevoUsuario.numero_documento) {
      throw new Error("Todos los campos son obligatorios");
    }

    // Actualizar el usuario
    const consultaActualizar = `
    UPDATE usuarios
    SET nombres = ?, numero_documento = ?
    WHERE id = ?`;

    const valores = [
      nuevoUsuario.nombres,
      nuevoUsuario.numero_documento,
      idUsuario,
    ];
    const [resultado] = await pool.query(consultaActualizar, valores);

    if (resultado.affectedRows === 0) {
      throw new Error("No se encontró el usuario con el ID proporcionado");
    }

    return { message: "Usuario actualizado exitosamente" };
  } catch (error) {
    console.error("Error al editar el usuario", error);
    throw error;
  }
};

const eliminarUsuario = async (idUsuario) => {
  try {
    const consultaEliminar = "DELETE FROM usuarios WHERE id = ?";
    const [resultado] = await pool.query(consultaEliminar, [idUsuario]);

    if (resultado.affectedRows === 0) {
      throw new Error("No se encontró el usuario con el ID proporcionado");
    }

    return { message: "Usuario eliminado correctamente" };
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    throw error;
  }
};

module.exports = {
  agregarUsuario,
  obtenerUsuarios,
  editarUsuario,
  eliminarUsuario,
};
