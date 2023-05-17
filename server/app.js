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
  connectionLimit: 10, // Nombre maximal de connexions dans le pool
  host     : process.env.DB_HOST,
  database :  process.env.DB,
  user     : process.env.DB_USER,
  password : process.env.DB_PASS,
  port : 3306, //port mysql
}

// Creation d'une pool de connexion
const pool = mysql.createPool(config);

mysql.createConnection(config)
.then(async (connection) => {
  console.log('connected to database')

  
  // Recupération de toutes les bandes dessinées (books)
  app.get('/books', async(req, res) => {
    try {
      const rows = await connection.query('SELECT * FROM books')   
      res.status(200).send(rows) 
    } catch (error) {
      res.status(500).json({ error: "Une erreur s'est produite lors de la récupération des données." });
    }
  })
  

  // // Recupération de toutes les bandes dessinées (books) triées par prix croissants
  // app.get('/books/ascending', async(req, res) => {
  //   try {
  //     const rows = await connection.query('SELECT * FROM books ORDER BY price ASC')   
  //     res.status(200).send(rows) 
  //   } catch (error) {
  //     res.status(500).json({ error: "Une erreur s'est produite lors de la récupération des données." });
  //   }
  // })

  //  // Recupération de toutes les bandes dessinées (books) triées par prix décroissants
  //  app.get('/books/decreasing', async(req, res) => {
  //   try {
  //     const rows = await connection.query('SELECT * FROM books ORDER BY price DESC')   
  //     res.status(200).send(rows) 
  //   } catch (error) {
  //     res.status(500).json({ error: "Une erreur s'est produite lors de la récupération des données." });
  //   }
  // })
  
  // Utilisation d'une seule route pour la récupération des bandes dessinées triées :
  //  Au lieu d'avoir deux routes distinctes pour les bandes dessinées triées par ordre croissant et décroissant
  app.get('/books/sorted', async (req, res, next) => {
    try {
      // Extraction du paramètre 'order' de l'URL de la requête
      const { order } = req.query;
      let orderBy = 'ASC';
      if (order === 'descending') {
        orderBy = 'DESC';
      }
      const rows = await connection.query(`SELECT * FROM books ORDER BY price ${orderBy}`);
      res.status(200).send(rows);
    } catch (error) {
      res.status(500).json({ error: "Une erreur s'est produite lors de la récupération des données." });
    }
  });
  
  

  // Recupération des genres des bandes dessinées
  app.get('/genres', async(req, res) => {
    try {
      const rows = await connection.query('SELECT * FROM genres')   
      res.status(200).send(rows) 
    } catch (error) {
      res.status(500).json({ error: "Une erreur s'est produite lors de la récupération des données." });
    }
  })

   // Recupération des bandes dessinées selon leur genre
   app.get('/genres/:id', async(req, res) => {
    try {
      const {id} = req.params
      const rows = await connection.query('SELECT * FROM books WHERE id_genres =?', [id])
      res.status(200).send(rows) 
    } catch (error) {
      res.status(500).json({ error: "Une erreur s'est produite lors de la récupération des données." });
    }      
 })

  //  Recupération des détails de chaque bande dessinée sur les 3 tables( books, auteurs et genres)
  app.get('/bookDetails/:id', async (req, res) => {
    try {
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
    } catch (error) {
      res.status(500).json({ error: "Une erreur s'est produite lors de la récupération des données." });
    }  
  });

  
  //  Inscription  d'un utilisateur
  app.post('/signUp', async(req, res) => {   
    try {
      const { sexe, firstName, lastName,  email, phone,	dateOfBirth, streetNumberAndName, addressPostalCode,	addressCity, addressCountry } = req.body  
      let {	password } = req.body
      const existingUser = await connection.query('SELECT * FROM users WHERE email = ?', [email])
      if (existingUser.length > 0) {
        return res.status(409).json({ message: 'Cet email existe déjà' })
      } 
      const saltRounds = 10
      const hashedPassword =  await bcrypt.hash(password, saltRounds)
      password = hashedPassword
      const rows = await connection.query('INSERT INTO users (sexe, firstName, lastName,  email, phone,	password,	dateOfBirth, streetNumberAndName, addressPostalCode,	addressCity, addressCountry) VALUES (?,?,?,?,?,?,?,?,?,?,?)', [sexe, firstName, lastName, email, phone,	password,	dateOfBirth, streetNumberAndName, addressPostalCode,	addressCity, addressCountry]) 
      res.status(200).send(rows)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Erreur serveur' })
    }
  })
  
  // Connexion d'un utilisateur
  app.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      if (email && password) {
        const results = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
        if (results.length > 0) {
          const user = results[0];
          const match = await bcrypt.compare(password, user.password);
          if (match) {
            // Génère un token
            const token = jwt.sign({ userId: user.id }, 'mysecretkey', { expiresIn: '24h' });
            // Envoyer le token dans l'en-tête de réponse (header)
            res.setHeader('Authorization', `Bearer ${token}`);
            // Envoyer la réponse avec le token dans le body
            res.status(200).json({ message: "Authentification réussie", user: user, token: token });
          } else {
            res.status(401).json({ message: "Mot de passe et/ou email incorrect(s)" });
          }
        } else {
          res.status(401).json({ message: "Mot de passe et/ou email incorrect(s)" });
        }
      } else {
        res.status(400).json({ message: "Veuillez entrer un email et un mot de passe" });
      }
    } catch (error) {
      res.status(500).json({ message: "Une erreur s'est produite lors de la récupération des données." });
    }
  });
  

  /* Middleware d'authentification pour le contexte d'authentification (React)
   Vérifie si l'utilisateur est authentifié en utilisant le contexte (React) */
app.get('/api/protected', authMiddleware, async (req, res) => {
  try {
    // Récupère l'ID de l'utilisateur à partir du middleware "authMiddleware"
    const userId = req.auth.userId
    // Récupère les informations de l'utilisateur depuis la base de données
    const  user = await connection.query('SELECT * FROM users WHERE users.id = ?', [userId])
    // Envoie les informations de l'utilisateur (user) et l'état de connexion dans la réponse
    res.status(200).json({ message: 'Accès autorisé', authenticated: true, user: user })
  } catch (error) {
    res.status(500).json({ error: 'Une erreur est survenue' })
  }
});

/* Middleware de validation de données. Vérifie la validité des données 
  de la commande(orders) avant de les insérer dans la base de données
 */
function validateOrderDataMiddleware(req, res, next) {
  const {totalWithoutShipping, shippingCost, orderTotal, id_users, articles } = req.body;

  // Vérifie que toutes les données sont présentes
  if (!totalWithoutShipping || !orderTotal || !id_users || !articles) {
    return res.status(400).send({ message: "Toutes les données de commande sont requises." });
  }

  // Vérifie le type de données
  if (typeof totalWithoutShipping !== "number" || typeof orderTotal !== "number" || typeof id_users !== "number" || !Array.isArray(articles)) {
    return res.status(400).send({ message: "Les types de données de la commande sont incorrects." });
  }

  // Vérifie les valeurs des données
  if (totalWithoutShipping < 0 || orderTotal < 0 || id_users < 0 || articles.some(article => article.reference < 0 || article.title < 0 || article.price < 0 || article.quantity < 0 ||  article.totalLine < 0 || article.bookId < 0)) {
    return res.status(400).send({ message: "Les valeurs des données de la commande sont invalides." });
  }

  // Vérifie la valeur de shippingCost qui peut etre égal à zero 
  if (shippingCost && typeof shippingCost !== "number") {
    return res.status(400).send({ message: "Le type de données de shippingCost est incorrect." });
  }

  next();
}

// Insertion des données de commandes lorsqu'un utilisateur passe commnde 
app.post('/orders', authMiddleware, validateOrderDataMiddleware, async (req, res) => {
  const {totalWithoutShipping, shippingCost, orderTotal, orderNumber, id_users, articles } = req.body;
  try {
    // Début d'une transaction pour garantir l'intégrité des données lors de l'insertion de la commande
    await connection.beginTransaction();

    // Insertion de la nouvelle commande dans la table `orders`
    const orderPromise = await connection.query(
      'INSERT INTO orders (totalWithoutShipping, shippingCost, orderTotal, orderNumber, id_users) VALUES (?, ?, ?, ?, ?)',
      [totalWithoutShipping, shippingCost, orderTotal, orderNumber, id_users]
    );
    const orderId = orderPromise.insertId;
    
    // Insertion des détails de chaque article commandé dans la table `order_line`
    const orderLinePromises = articles.map((article) => {
      return connection.query(
        'INSERT INTO `order_line` (reference, title, price, quantity, id_orders, id_books) VALUES (?, ?, ?, ?, ?, ?)',
        [article.reference, article.title, article.price, article.quantity, orderId, article.id]
      );
    });    

    // Attendre que toutes les requêtes d'insertion soient terminées
    await Promise.all([orderPromise, ...orderLinePromises]);

    // Validation et confirmation de la transaction, enregistrant les modifications dans la base de données
    await connection.commit();

    res.status(201).send({ message: "Votre paiement a été effectué avec succès." });
  } catch (error) {
    await connection.rollback();
    throw error;
  }
});

/* Recupérer l'historique de commande(s) d'un utilisateur
 Route pour afficher les commandes d'un utilisateur connecté
 */
app.get('/orders/history', authMiddleware, (req, res) => {
  try {
    const userId = req.auth.userId;
    /* On ne met pas ORDER BY orders.orderDate DESC pour le trie décroissant des commndes 
      parceque le deux tables "orders" et "oreder-line" ne peuvent pas se mettre sur une même table de jointure: 
      plusieurs lignes de la table "order-line" peuvent correpondre à une ligne de la table "orders". 
      Donc l'affichage de l'historique des commandes par ordre décroissant se fera après la récupération
      du résultat avec la méthode reverse() pour inverser la table en ordre décroissant  */
    const query = `
      SELECT orders.id, orders.totalWithoutShipping, orders.shippingCost, orders.orderTotal, orders.orderDate, orders.orderNumber, order_line.reference, order_line.title, order_line.price, order_line.quantity, order_line.id_books
      FROM orders
      INNER JOIN order_line ON orders.id = order_line.id_orders
      WHERE orders.id_users = ?
    `;
  
    connection.query(query, [userId], (err, results) => {
      if (err) {
        console.error('Erreur lors de la récupération des commandes de l\'utilisateur :', err);
        res.status(500).json({ error: 'Une erreur est survenue' });
        return;
      }
  
      const orders = {};
  
      results.forEach((result) => {
        // Vérifie si la commande correspondante existe déjà dans l'objet "orders"
        if (!orders[result.id]) {
        // Si la commande n'existe pas, crée une nouvelle entrée pour cette commande
        // Cela permet de garantir qu'une commande unique correspond à une seule entrée dans l'objet orders.
          orders[result.id] = { 
            totalWithoutShipping: result.totalWithoutShipping,
            shippingCost: result.shippingCost,
            orderTotal: result.orderTotal,
            orderDate: result.orderDate,
            orderNumber: result.orderNumber,
            items: [] 
          };
        }

    // Ajoute l'article de la commande actuelle à la liste des articles de cette commande
        orders[result.id].items.push({
          reference: result.reference,
          title: result.title,
          price: result.price,
          quantity: result.quantity,
          id_books: result.id_books,
          totalLine: result.price * result.quantity
        });
  
      });
  
        /* Avec "Object.values(orders)" on aura un tableau plutot qu'un objet pour pouvoir itérer 
          facilement les données coté front. La méthode reverve() va inverser le tableau pour que le trie 
          du tableau soit décroissant. Cela fait que les commandes seront affichées par ordre décroissante cad
          des plus récentes au plus anciennnes
         */
      res.json({ orders: Object.values(orders).reverse() });
    });
  } catch (error) {
    console.error('Une erreur est survenue lors de la récupération de l\'historique des commandes :', error);
    res.status(500).json({ error: 'Une erreur est survenue' });
  }
 
});


// Recupére les informations d'inscription d'un utilisateur connecté pour pourvoir l'afficher dans leur compte
app.get('/users', authMiddleware, async (req, res) => {
  try {
    const userId = req.auth.userId
    const result = await connection.query("SELECT * FROM users WHERE users.id = ?", [userId])
    res.status(200).json({result})
  } catch (error) {
    res.status.jon({error:`Une erreur est survenue: ${error.message}`})
  }
})

// Mise à jour des informations d'inscription d'un utilisateur connecté("coordonnées personnelles")
app.put('/users/update', authMiddleware, async (req, res) => {
  try {
    const userId = req.auth.userId
    // Recupération du mot de passe de l'utilisateur connecté dans la base de données
    const userPassword = await connection.query("SELECT `password` FROM users WHERE users.id = ?",  [userId])   
    
    const {sexe, firstName, lastName, email, phone, dateOfBirth, streetNumberAndName, addressPostalCode, addressCity, addressCountry} = req.body
    
    let password = req.body.password
    if (password === "") {
      // Si aucun mot de passe n'est fourni, utilise le mot de passe existant de l'utilisateur
       password = userPassword[0].password
    }
    else{
      try {
        // Hashage du nouveau mot de passe avant de le stocker dans la base de données
        const saltRounds = 10
        const hashedPassword =  await bcrypt.hash(password, saltRounds)
        password = hashedPassword
      } catch (error) {
        throw new Error(`Erreur lors du hashage du mot de passe: ${error.message}`)
      }
    } 
    // Mise à jour des informations de l'utilisateur dans la base de données
    const query = 'UPDATE users SET sexe=?, firstName=?, lastName=?, email=?, phone=?, password=?, dateOfBirth=?, streetNumberAndName=?, addressPostalCode=?, addressCity=?, addressCountry=? WHERE id=?'
    const params = [sexe, firstName, lastName, email, phone,	password,	dateOfBirth, streetNumberAndName, addressPostalCode,	addressCity, addressCountry, userId]
    await connection.query(query, params)   

    // Envoi d'une réponse indiquant que les mises à jour ont été effectuées avec succès 
    res.status(200).send({message:'Mises à jour effectuées avec succès'})
  } catch (error) {
    res.status(500).send({error: `Une erreur est survenue: ${error.message}`})
  }
})

app.use((err, req, res, next) => {
  console.error(err); // Journalisation de l'erreur
  res.status(500).json({ error: "Une erreur s'est produite." }); // Réponse d'erreur standardisée
});


})


module.exports = app









