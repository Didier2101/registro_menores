const pool = require("../config/db");

// codigo para agregar un paciente
const agregarPaciente = async (paciente) => {
  try {
    if (
      // Validar si todos los campos necesarios están presentes
      !paciente.nombre_menor ||
      !paciente.apellidos_menor ||
      !paciente.numero_manilla ||
      !paciente.edad ||
      !paciente.genero_menor ||
      !paciente.tipo_documento_menor ||
      !paciente.numero_documento_menor ||
      !paciente.nacionalidad_menor ||
      !paciente.nombres_acompanante ||
      !paciente.tipo_documento_acompanante ||
      !paciente.numero_documento_acompanante ||
      !paciente.parentesco ||
      !paciente.genero_acompanante ||
      !paciente.nacionalidad_acompanante ||
      !paciente.fecha_ingreso ||
      !paciente.entrada ||
      !paciente.vigilante_id
    ) {
      throw new Error("Todos los campos son obligatorios");
    }

    const insertarPaciente = `INSERT INTO pacientes(nombre_menor, apellidos_menor, numero_manilla, edad, genero_menor, tipo_documento_menor, numero_documento_menor, nacionalidad_menor, nombres_acompanante, tipo_documento_acompanante, numero_documento_acompanante, parentesco, genero_acompanante, nacionalidad_acompanante,  fecha_ingreso, fecha_salida, entrada, salida, vigilante_id)
        VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        `;

    const valoresPaciente = [
      paciente.nombre_menor,
      paciente.apellidos_menor,
      paciente.numero_manilla,
      paciente.edad,
      paciente.genero_menor,
      paciente.tipo_documento_menor,
      paciente.numero_documento_menor,
      paciente.nacionalidad_menor,
      paciente.nombres_acompanante,
      paciente.tipo_documento_acompanante,
      paciente.numero_documento_acompanante,
      paciente.parentesco,
      paciente.genero_acompanante,
      paciente.nacionalidad_acompanante,
      paciente.fecha_ingreso,
      paciente.null,
      paciente.entrada,
      paciente.null,
      paciente.vigilante_id,
    ];

    const [resultadoPacienteInsertado] = await pool.query(
      insertarPaciente,
      valoresPaciente
    );
    return resultadoPacienteInsertado.insertId;
  } catch (error) {
    throw error;
  }
};

// codigo para obtener pacientes
const obtenerPacientes = async () => {
  try {
    const resultadoPacientes = `
      SELECT 
        p.id,
        p.nombre_menor,
        p.apellidos_menor,
        p.numero_manilla,
        p.edad,
        p.genero_menor,
        p.tipo_documento_menor,
        p.numero_documento_menor,
        p.nacionalidad_menor,
        p.nombres_acompanante,
        p.tipo_documento_acompanante,
        p.numero_documento_acompanante,
        p.parentesco,
        p.genero_acompanante,
        p.nacionalidad_acompanante,
        p.fecha_ingreso,
        p.fecha_salida,
        p.entrada,
        p.salida,
        u.nombres AS nombre_vigilante
      FROM 
        clinica_menores.pacientes p
      INNER JOIN 
        clinica_menores.usuarios u
      ON 
        p.vigilante_id = u.id;
    `;

    const [pacientes, _] = await pool.query(resultadoPacientes);
    return pacientes;
  } catch (error) {
    throw error;
  }
};

const actualizarPaciente = async (id, fecha_salida, salida) => {
  try {
    const query = `
          UPDATE pacientes
          SET fecha_salida = ?, salida = ?
          WHERE id = ?
      `;
    const [resultado] = await pool.query(query, [fecha_salida, salida, id]);
    return resultado.affectedRows > 0; // Retorna true si se actualizó algún registro
  } catch (error) {
    throw error;
  }
};

// Código para eliminar un paciente
const eliminarPaciente = async (id) => {
  try {
    // Verificar si el paciente existe
    const pacienteExistente = await pool.query(
      "SELECT * FROM pacientes WHERE id = ?",
      [id]
    );

    if (pacienteExistente[0].length === 0) {
      throw new Error("Paciente no encontrado");
    }

    // Realizar la eliminación
    const eliminarPacienteQuery = "DELETE FROM pacientes WHERE id = ?";
    const [resultado] = await pool.query(eliminarPacienteQuery, [id]);

    // Si no se afectaron filas, significa que no se pudo eliminar
    if (resultado.affectedRows === 0) {
      throw new Error("Hubo un error al eliminar el paciente");
    }

    return true; // Retornar true si la eliminación fue exitosa
  } catch (error) {
    throw error; // Lanzar el error para ser manejado por el controlador
  }
};

// Código para buscar pacientes por id
const obtenerPacientePorId = async (id) => {
  try {
    const query = "SELECT * FROM pacientes WHERE id =?";
    const [paciente] = await pool.query(query, [id]);
    return paciente[0];
  } catch (error) {
    throw error;
  }
};

module.exports = {
  agregarPaciente,
  obtenerPacientes,
  eliminarPaciente,
  actualizarPaciente,
  obtenerPacientePorId,
};
