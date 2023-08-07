
const pool = require('../databaseConfig')

// Recupération de toutes les  categories de bandes dessinées
exports.getAllCategories = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categories')
    res.status(200).send(rows)
  } catch (error) {
    res.status(500).json({ error: "Une erreur s'est produite lors de la récupération des données." });
  }
}


// Recupération des bandes dessinées selon leur categorie
exports.getBooksByCategory = async (req, res) => {
  try {
    const { id } = req.params
    const [rows] = await pool.query('SELECT * FROM books WHERE id_categories =?', [id])
    res.status(200).send(rows)
  } catch (error) {
    res.status(500).json({ error: "Une erreur s'est produite lors de la récupération des données." });
  }
}

