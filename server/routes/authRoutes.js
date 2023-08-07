/* Ce routeur gère les routes liées à l'authentification des utilisateurs,
  telles que la connexion, l'inscription, la réinitialisation du mot de passe, etc.
 */
const express = require("express")
const authRouter = express.Router();
const authMiddleware = require('../middleware/authMiddleware')
const authCtrl = require('../controllers/authControllers')


// Middleware d'authentification, vérifie si l'utilisateur est authentifié en utilisant le contexte (React) 
authRouter.get('/api/protected', authMiddleware, authCtrl.getAuth);

//  Inscription  d'un utilisateur
authRouter.post('/signUp', authCtrl.signUp)

// Connexion d'un utilisateur
authRouter.post('/login', authCtrl.login);

module.exports = authRouter










// /*
//  Ce routeur gère les routes liées à la gestion des profils utilisateur, 
//  telles que la récupération du profil, la mise à jour des informations, etc.
// */
// const express = require("express")
// const userRouter = express.Router();
// const authMiddleware = require('../middleware/authMiddleware')
// const bcrypt = require('bcryptjs')
// const pool = require('../databaseConfig')



// // Recupére les informations d'inscription d'un utilisateur connecté pour pourvoir l'afficher dans leur compte
// userRouter.get('/users', authMiddleware, async (req, res) => {
//   try {
//     const userId = req.auth.userId
//     const [result] = await pool.query("SELECT * FROM users WHERE users.id = ?", [userId])
//     res.status(200).json({ result })
//   } catch (error) {
//     res.status.jon({ error: `Une erreur est survenue: ${error.message}` })
//   }
// })

// // Mise à jour des informations d'inscription d'un utilisateur connecté("coordonnées personnelles")
// userRouter.put('/users/update', authMiddleware, async (req, res) => {
//   try {
//     const userId = req.auth.userId
//     // Recupération du mot de passe de l'utilisateur connecté dans la base de données
//     const userPassword = await pool.query("SELECT `password` FROM users WHERE users.id = ?", [userId])

//     const { sexe, firstName, lastName, email, phone, dateOfBirth, streetNumberAndName, addressPostalCode, addressCity, addressCountry } = req.body

//     let password = req.body.password
//     if (password === "") {
//       // Si aucun mot de passe n'est fourni, utilise le mot de passe existant de l'utilisateur
//       password = userPassword[0].password
//     }
//     else {
//       try {
//         // Hashage du nouveau mot de passe avant de le stocker dans la base de données
//         const saltRounds = 10
//         const hashedPassword = await bcrypt.hash(password, saltRounds)
//         password = hashedPassword
//       } catch (error) {
//         throw new Error(`Erreur lors du hashage du mot de passe: ${error.message}`)
//       }
//     }
//     // Mise à jour des informations de l'utilisateur dans la base de données
//     const query = 'UPDATE users SET sexe=?, firstName=?, lastName=?, email=?, phone=?, password=?, dateOfBirth=?, streetNumberAndName=?, addressPostalCode=?, addressCity=?, addressCountry=? WHERE id=?'
//     const params = [sexe, firstName, lastName, email, phone, password, dateOfBirth, streetNumberAndName, addressPostalCode, addressCity, addressCountry, userId]
//     await pool.query(query, params)

//     // Envoi d'une réponse indiquant que les mises à jour ont été effectuées avec succès 
//     res.status(200).send({ message: 'Mises à jour effectuées avec succès' })
//   } catch (error) {
//     res.status(500).send({ error: `Une erreur est survenue: ${error.message}` })
//   }
// })

// module.exports= userRouter