const express = require("express");
const router = express.Router();
const {
  crearUsuario,
  obtenerUsuarios,
  actualizarUsuario,
  eliminarUsuario,
} = require("../controllers/usuarioController");

// Ruta para crear un usuario
router.post("/usuarios", crearUsuario);
router.get("/usuarios", obtenerUsuarios);
router.put("/usuarios/:id", actualizarUsuario);
router.delete("/usuarios/:id", eliminarUsuario);

// Ruta que solo puede acceder el rol 'Administrador'

module.exports = router;
