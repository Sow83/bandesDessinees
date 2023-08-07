/*
Ce routeur gère les routes liées à la gestion des produits(livres), telles que la récupération
des produits, le trie,les détails, l'ajout, la modification ou la suppression de produits, etc.
*/
const express = require('express')
const bookRouter = express.Router();
const booksCtrl = require ('../controllers/booksControllers')


// Recupération de toutes les bandes dessinées (books)
bookRouter.get('/', booksCtrl.getAllBooks)

// Trie des bandes dessinnées par ordre croissant et décroissant
bookRouter.get('/sorted', booksCtrl.sortedAllBooks);

//  Recupération des détails de chaque bande dessinée sur les 3 tables( books, auteurs et categories)
bookRouter.get('/bookDetails/:id', booksCtrl.getBookDetailsById);

module.exports = bookRouter
