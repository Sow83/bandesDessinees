/*
 Ce routeur gère les routes liées à la gestion des commandes, telles que
la création d'une commande, l'affichage des commandes passées, etc.
*/
const express = require("express")
const orderRouter = express.Router();
const authMiddleware = require('../middleware/authMiddleware')
const orderCtrl = require('../controllers/orderControllers')

// Insertion des données de commandes lorsqu'un utilisateur passe commnde 
orderRouter.post('/', authMiddleware, orderCtrl.validateOrderDataMiddleware, orderCtrl.createOrder);

// Recupération de l'historique de commande(s) d'un utilisateurconnecté
orderRouter.get('/history', authMiddleware, orderCtrl.getOrderHistory);


module.exports = orderRouter



