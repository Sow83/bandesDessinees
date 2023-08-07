
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB,
  port: process.env.DB_PORT,
});

// Vérifie si la connexion à la base de données est réussie
pool.getConnection()
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((error) => {
    console.error('Failed to connect to the database:', error.message);
  });
  // Gérer les erreurs lors de la récupération de la connexion depuis le pool
pool.on('error', (err) => {
  console.error('Error in MySQL connection pool :', err);
});

module.exports = pool;
