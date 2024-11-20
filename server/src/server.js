require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const colors = require("colors");
const db = require("./config/db");

const PORT = process.env.PORT || 3306;

const usuarioRouter = require("./routes/usuarioRoutes");
const loginRouter = require("./routes/loginRouter");
const pacienteRouter = require("./routes/pacienteRoutes");

app.use(express.json());
app.use(cors());

// Usar las rutas de usuarios

app.use(loginRouter);
app.use(usuarioRouter);
app.use(pacienteRouter);
// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`.bgGreen);
});
