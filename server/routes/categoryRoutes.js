/* Ce routeur gère les routes liées aux catégories de livres,
  telles que l'affichage, l'ajout, la suppression etc.
 */

const express = require('express')
const categoryRouter = express.Router();
const categoryCtrl = require('../controllers/categoryControllers')

// Recupération de toutes les  categories de bandes dessinées
categoryRouter.get('/', categoryCtrl.getAllCategories)

// Recupération des bandes dessinées selon leur categorie
categoryRouter.get('/:id', categoryCtrl.getBooksByCategory)

module.exports = categoryRouter



