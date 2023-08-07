/*
 Ce routeur gère les routes liées à la gestion des profils utilisateur, 
 telles que la récupération du profil, la mise à jour des informations, etc.
*/
const express = require("express")
const userRouter = express.Router();
const authMiddleware = require('../middleware/authMiddleware')
const userCtrl = require('../controllers/userControllers')


// Recupére les informations d'inscription d'un utilisateur connecté pour pourvoir l'afficher dans leur compte
userRouter.get('/', authMiddleware, userCtrl.getUserProfile)

// Mise à jour des informations d'inscription d'un utilisateur connecté (coordonnées personnelles)
userRouter.put('/update', authMiddleware, userCtrl.updateUserProfile)

module.exports= userRouter