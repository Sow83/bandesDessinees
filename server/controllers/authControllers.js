const pool = require('../databaseConfig')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

/* Authentification, vérifie si l'utilisateur est authentifié
   en utilisant le contexte (React) */
exports.getAuth = async (req, res) => {
  try {
    // Récupère l'ID de l'utilisateur à partir du middleware "authMiddleware"
    const userId = req.auth.userId;

    if (!userId) {
      // Si l'ID de l'utilisateur est manquant, cela signifie qu'il n'est pas connecté
      // Retourne une réponse statut 401 (non autorisé) sans corps de réponse.
      return res.status(401).end();
    }

    // Récupère les informations de l'utilisateur depuis la base de données
    const [user] = await pool.query('SELECT * FROM users WHERE users.id = ?', [userId]);

    // Envoie les informations de l'utilisateur (user) et l'état de connexion dans la réponse
    res.status(200).json({ message: 'Accès autorisé', authenticated: true, user: user });
  } catch (error) {
    // Gérer d'éventuelles autres erreurs
    res.status(500).json({ error: 'Une erreur est survenue' });
  }
}


//  Inscription  d'un utilisateur
exports.signUp = async (req, res) => {
  try {
    const { sexe, firstName, lastName, email, phone, dateOfBirth, streetNumberAndName, addressPostalCode, addressCity, addressCountry } = req.body
    let { password } = req.body
    const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [email])
    if (existingUser.length > 0) {
      return res.status(409).json({ message: 'Cet email existe déjà' })
    }
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    password = hashedPassword
    const query = 'INSERT INTO users (sexe, firstName, lastName,  email, phone,	password,	dateOfBirth, streetNumberAndName, addressPostalCode,	addressCity, addressCountry) VALUES (?,?,?,?,?,?,?,?,?,?,?)'
    const params = [sexe, firstName, lastName, email, phone, password, dateOfBirth, streetNumberAndName, addressPostalCode, addressCity, addressCountry]
    await pool.query(query, params)
    res.status(201).json({ message: 'Inscription réussie' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}


// Connexion d'un utilisateur
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email && password) {
      const [results] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
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
}
