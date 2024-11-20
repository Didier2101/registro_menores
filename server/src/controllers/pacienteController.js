const pacienteService = require("../services/pacienteService");

const crearPaciente = async (req, res) => {
  try {
    const paciente = req.body;
    const pacienteId = await pacienteService.agregarPaciente(paciente);
    res.status(201).json({
      message: "Paciente creado exitosamente",
      pacienteId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Hubo un error al crear el paciente",
      error: error.message,
    });
  }
};

// codigo para obtener pacientes

const obtenerPacientes = async (req, res) => {
  try {
    const pacientes = await pacienteService.obtenerPacientes();
    res.status(200).json(pacientes);
  } catch (error) {
    console.error("error la obtener los pacientes", error);
    res.status(500).json({ message: "Hubo un error al obtener los pacientes" });
  }
};

const actualizarPaciente = async (req, res) => {
  const { id } = req.params;
  const { fecha_salida, salida } = req.body;

  try {
    const resultado = await pacienteService.actualizarPaciente(
      id,
      fecha_salida,
      salida
    );
    if (resultado) {
      res.status(200).json({ message: "Paciente actualizado exitosamente" });
    } else {
      res.status(404).json({ error: "Paciente no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Hubo un error al actualizar el paciente" });
  }
};

module.exports = { actualizarPaciente };

// Código para eliminar paciente
const eliminarPaciente = async (req, res) => {
  try {
    const { id } = req.params; // Obtener el id del paciente desde los parámetros de la URL

    // Llamar al servicio para eliminar el paciente
    const result = await pacienteService.eliminarPaciente(id);

    if (result) {
      res.status(200).json({
        message: "Paciente eliminado exitosamente",
      });
    }
  } catch (error) {
    console.error("Error al eliminar el paciente", error);
    res.status(500).json({
      message: "Hubo un error al eliminar el paciente",
      error: error.message,
    });
  }
};

// Código para buscar paciente por id

const obtenerPacientePorId = async (req, res) => {
  try {
    const { id } = req.params; // Obtener el id del paciente desde los parámetros de la URL

    // Llamar al servicio para obtener el paciente por id
    const paciente = await pacienteService.obtenerPacientePorId(id);

    if (paciente) {
      res.status(200).json(paciente);
    } else {
      res.status(404).json({ error: "Paciente no encontrado" });
    }
  } catch (error) {
    console.error("Error al obtener el paciente por id", error);
    res.status(500).json({
      message: "Hubo un error al obtener el paciente por id",
      error: error.message,
    });
  }
};

module.exports = {
  crearPaciente,
  obtenerPacientes,
  eliminarPaciente,
  actualizarPaciente,
  obtenerPacientePorId,
};
