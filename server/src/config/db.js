// db.js
const mysql = require("mysql2");

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
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error al conectar con la base de datos:".bgRed, err.message);
  } else {
    console.log("Conexión exitosa a la base de datos".bgCyan);
    connection.release(); // Libera la conexión de prueba
  }
});

module.exports = pool.promise();