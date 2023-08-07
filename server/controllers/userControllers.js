const pool = require('../databaseConfig')
const bcrypt = require('bcryptjs')

// Recupére les informations d'inscription d'un utilisateur connecté pour pourvoir l'afficher dans leur compte
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.auth.userId
    const [result] = await pool.query("SELECT * FROM users WHERE users.id = ?", [userId])
    res.status(200).json({ result })
  } catch (error) {
    res.status.jon({ error: `Une erreur est survenue: ${error.message}` })
  }
}


// Mise à jour des informations d'inscription d'un utilisateur connecté("coordonnées personnelles")

exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.auth.userId
    // Recupération du mot de passe de l'utilisateur connecté dans la base de données
    const userPassword = await pool.query("SELECT `password` FROM users WHERE users.id = ?", [userId])

    const { sexe, firstName, lastName, email, phone, dateOfBirth, streetNumberAndName, addressPostalCode, addressCity, addressCountry } = req.body

    let password = req.body.password
    if (password === "") {
      // Si aucun mot de passe n'est fourni, utilise le mot de passe existant de l'utilisateur
      password = userPassword[0].password
    }
    else {
      try {
        // Hashage du nouveau mot de passe avant de le stocker dans la base de données
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        password = hashedPassword
      } catch (error) {
        throw new Error(`Erreur lors du hashage du mot de passe: ${error.message}`)
      }
    }
    // Mise à jour des informations de l'utilisateur dans la base de données
    const query = 'UPDATE users SET sexe=?, firstName=?, lastName=?, email=?, phone=?, password=?, dateOfBirth=?, streetNumberAndName=?, addressPostalCode=?, addressCity=?, addressCountry=? WHERE id=?'
    const params = [sexe, firstName, lastName, email, phone, password, dateOfBirth, streetNumberAndName, addressPostalCode, addressCity, addressCountry, userId]
    await pool.query(query, params)

    // Envoi d'une réponse indiquant que les mises à jour ont été effectuées avec succès 
    res.status(200).send({ message: 'Mises à jour effectuées avec succès' })
  } catch (error) {
    res.status(500).send({ error: `Une erreur est survenue: ${error.message}` })
  }
}
