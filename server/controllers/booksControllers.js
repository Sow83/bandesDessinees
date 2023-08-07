const pool = require('../databaseConfig')


// Recupération de toutes les bandes dessinées (books)
exports.getAllBooks = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM books')
    res.status(200).send(rows)
  } catch (error) {
    res.status(500).json({ error: "Une erreur s'est produite lors de la récupération des données." });
  }
}


/* Utilisation d'une seule route pour la récupération des bandes dessinées triées :
   Au lieu d'avoir deux routes distinctes pour les bandes dessinées triées par ordre croissant et décroissant
*/
exports.sortedAllBooks = async (req, res, next) => {
  try {
    // Extraction du paramètre 'order' de l'URL de la requête
    const { order } = req.query;
    let orderBy = 'ASC';
    if (order === 'descending') {
      orderBy = 'DESC';
    }
    const [rows] = await pool.query(`SELECT * FROM books ORDER BY price ${orderBy}`);
    res.status(200).send(rows);
  } catch (error) {
    res.status(500).json({ error: "Une erreur s'est produite lors de la récupération des données." });
  }
}


//  Recupération des détails de chaque bande dessinée sur les 3 tables( books, auteurs et categories)
exports.getBookDetailsById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(`
        SELECT books.id, reference, title, summary, price, releaseDate, categories.categoryName, authors.authorsName
        FROM books
        LEFT JOIN categories ON books.id_categories = categories.id
        LEFT JOIN authors ON books.id_authors = authors.id
        WHERE books.id = ?
      `, [id]);
    if (rows.length === 0) {
      res.status(404).send('Livre non trouvé')
    } else {
      res.status(200).send(rows[0])
    }
  } catch (error) {
    res.status(500).json({ error: "Une erreur s'est produite lors de la récupération des données." });
  }
}
