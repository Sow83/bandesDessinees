const express = require("express")
const mysql = require('promise-mysql')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const  authMiddleware  = require('./middleware/authMiddleware')
const cors = require('cors')
require('dotenv').config()

const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(cors())
app.use(express.static('public'))

/**
 * Connexion database.
 */
const config = {
  host     : process.env.DB_HOST,
  database :  process.env.DB,
  user     : process.env.DB_USER,
  password : process.env.DB_PASS,
  port : 3306, //port mysql
}

mysql.createConnection(config)
.then(async (connection) => {
  console.log('connected to database')

  // Recupération de toutes les bandes dessinées (books)
  app.get('/books', async(req, res) => {
    const rows = await connection.query('SELECT * FROM books')   
    res.status(200).send(rows) 
  })

  // Recupération des genres des bandes dessinées
  app.get('/genres', async(req, res) => {
    const rows = await connection.query('SELECT * FROM genres')   
    res.status(200).send(rows) 
  })

   // Recupération des bandes dessinées selon leur genre
   app.get('/genres/:id', async(req, res) => {
    const {id} = req.params
    const rows = await connection.query('SELECT * FROM books WHERE id_genres =?', [id])
    res.status(200).send(rows)     
 })

  //  Recupération des informations des bandes dessinées des tables books, auteurs et genres(détails) 
  app.get('/bookDetails/:id', async (req, res) => {
    const { id } = req.params;
    const rows = await connection.query(`
      SELECT books.id, reference, title, summary, price, releaseDate, genres.genresName, authors.authorsName
      FROM books
      LEFT JOIN genres ON books.id_genres = genres.id
      LEFT JOIN authors ON books.id_authors = authors.id
      WHERE books.id = ?
    `, [id]); 
    if (rows.length === 0) {
      res.status(404).send('Book not found')
    } else {
      res.status(200).send(rows[0])
    }
  });

  
  //  Inscription  d'un utilisateur
  // app.post('/signUp', async(req, res) => {
    
  //   const { sexe, nom, prenom, email, telephone, password, dateDeNaissance} = req.body
  //   if (email) {
  //     res.status(404).end()
  //   }
  //   const {numero,	nomDeRue, codePostal,	ville, pays} = req.body
  //   const rows1 = await connection.query('INSERT INTO adresses (numero, nomDeRue, codePostal, ville, pays) VALUES (?,?,?,?,?)', [numero, nomDeRue, codePostal, ville, pays])
  //   const adresses_id = rows1.insertId
  //   const rows2 = await connection.query('INSERT INTO users (sexe, nom, prenom, email, telephone, password, dateDeNaissance, adresses_id) VALUES (?,?,?,?,?,?,?,?)', [sexe, nom, prenom, email, telephone, password, dateDeNaissance, adresses_id])
  
  //   const rows = []
  //   rows.push(rows1)
  //   rows.push(rows2)
  //   res.status(200).send(rows)
  // })
  app.post('/signUp', async(req, res) => {   
    try {
      const { sexe, surname, firstName, email, phone,	dateOfBirth, streetNumberAndName, addressPostalCode,	addressCity, addressCountry } = req.body  
      let {	password } = req.body
      const existingUser = await connection.query('SELECT * FROM users WHERE email = ?', [email])
      if (existingUser.length > 0) {
        return res.status(409).json({ message: 'Cet email existe déjà' })
      } 
      const saltRounds = 10
      const hashedPassword =  await bcrypt.hash(password, saltRounds)
      password = hashedPassword
      const rows = await connection.query('INSERT INTO users (sexe, surname, firstName, email, phone,	password,	dateOfBirth, streetNumberAndName, addressPostalCode,	addressCity, addressCountry) VALUES (?,?,?,?,?,?,?,?,?,?,?)', [sexe, surname, firstName, email, phone,	password,	dateOfBirth, streetNumberAndName, addressPostalCode,	addressCity, addressCountry]) 
      res.status(200).send(rows)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Erreur serveur' })
    }
  })
  
  
  
  // Connexion d'un utilisateur
  app.post('/login', async(req, res) => {
    const { email, password } = req.body
    if (email && password) {
      await connection.query('SELECT * FROM users WHERE email = ?', [email], async function(error, results, fields) {
        if (error) {
          res.status(500).json({ message: "Erreur de base de données" })
          return;
        }
        if (results.length > 0) {
          const user = results[0];
          console.log(user)
          const match = await bcrypt.compare(password, user.password)
          if (match) {
            // Generate token
            const token = jwt.sign({ userId: user.id }, 'mysecretkey', { expiresIn: '1h' })
            // Send token in response header
            res.setHeader('Authorization', `Bearer ${token}`)
            // Send response with token in body
            res.status(200).json({ message: "Authentification réussie", user: user, token: token })
            return;
          } else {
            res.status(401).json({ message: "Mot de passe et / ou email incorect(s)" })
            return;
          }
        } else {
          res.status(401).json({ message: "Mot de passe et / ou email incorect(s)" })
          return;
        }
      });
    } else {
      res.status(400).json({ message: "Veuillez entrer un email et un mot de passe" })
      return;
    } 
  });
  
  // Middleware d'authentification pour protéger une route
app.get('/api/protected', authMiddleware, async (req, res) => {
  try {
    // Recupération de UserId via le middleware "authMiddleware"
    const userId = req.auth.userId
    // Récupération des informations de l'utilisateur à partir de la base de données
    const  user = await connection.query('SELECT * FROM users WHERE users.id = ?', [userId])
    // Envoi des informations de l'utilisateur dans la réponse
    res.status(200).json({ message: 'Accès autorisé', authenticated: true, user: user })
  } catch (error) {
    res.status(500).json({ error: 'Une erreur est survenue' })
  }
});

// app.use(function(err, req, res, next) {
//   if (err.status === 401) {
//     res.status(401).json({ message: "Authentication required" });
//   } else {
//     next(err);
//   }
// });
})
  //  connection.end();

module.exports = app









