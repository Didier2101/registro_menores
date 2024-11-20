const express = require("express");
const router = express.Router();

const {
  crearPaciente,
  obtenerPacientes,
  eliminarPaciente,
  actualizarPaciente,
  obtenerPacientePorId,
} = require("../controllers/pacienteController");

// Routes para pacientes
router.get("/paciente/:id", obtenerPacientePorId);
router.post("/paciente", crearPaciente);
router.get("/paciente", obtenerPacientes);
router.delete("/paciente/:id", eliminarPaciente);
router.put("/paciente/:id", actualizarPaciente);

module.exports = router;
