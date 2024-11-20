const mysql = require("mysql2/promise"); // Usa el módulo de promesas

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Probar la conexión de inmediato
(async () => {
  try {
    const connection = await pool.getConnection(); // Obtiene una conexión
    console.log(
      "Conexión a la base de datos establecida exitosamente clinica."
    );
    connection.release(); // Libera la conexión
  } catch (err) {
    console.error(
      "Error al conectar a la base de datos de clinica:",
      err.message
    );
  }
})();

module.exports = pool;
