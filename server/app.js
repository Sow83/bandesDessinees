require('dotenv').config()
const express = require("express")
const cors = require('cors')
const helmet = require("helmet")
const path = require('path')

const app = express()

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(cors())
app.use(express.static('public'))

// Définie le dossier de fichiers statiques react (build) (en production)
app.use(express.static(path.join(__dirname, '../build')));

// Middleware de sécurité
app.use(helmet())
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'none'"],
    scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
    styleSrc: ["'self'", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com"],
    imgSrc: ["'self'", "data:"],
    fontSrc: ["'self'", "https://cdnjs.cloudflare.com"],
    connectSrc: ["'self'"],
    manifestSrc: ["'self'"]
  }
}));

// Middleware CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');
const corsOptions = {
  origin: allowedOrigins,
};
app.use(cors(corsOptions));

// Import des routes
const categoryRoutes = require("./routes/categoryRoutes") 
const bookRoutes = require("./routes/bookRoutes") 
const authRoutes = require("./routes/authRoutes")  
const userRoutes = require("./routes/userRoutes")
const orderRoutes = require("./routes/orderRoutes")

// Montage des routes
app.use('/categories', categoryRoutes)
app.use('/books', bookRoutes)
app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/orders', orderRoutes)

// Toutes les URL qui ne sont pas gérées par l'API seront redirigées vers l'application React.
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '../build/index.html'), function (err) {
    if (err) {
      res.status(500).send(err)
    }
  })
})

module.exports = app

