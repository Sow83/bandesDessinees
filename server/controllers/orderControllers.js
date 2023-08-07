const pool = require('../databaseConfig')


/* Middleware de validation de données. Vérifie la validité des données 
  de la commande(orders) avant de les insérer dans la base de données
 */
exports.validateOrderDataMiddleware = (req, res, next) => {
  const { totalWithoutShipping, shippingCost, orderTotal, id_users, articles } = req.body;

  // Vérifie que toutes les données sont présentes
  if (!totalWithoutShipping || !orderTotal || !id_users || !articles) {
    return res.status(400).send({ message: "Toutes les données de commande sont requises." });
  }

  // Vérifie le type de données
  if (typeof totalWithoutShipping !== "number" || typeof orderTotal !== "number" || typeof id_users !== "number" || !Array.isArray(articles)) {
    return res.status(400).send({ message: "Les types de données de la commande sont incorrects." });
  }

  // Vérifie les valeurs des données
  if (totalWithoutShipping < 0 || orderTotal < 0 || id_users < 0 || articles.some(article => article.reference < 0 || article.title < 0 || article.price < 0 || article.quantity < 0 || article.totalLine < 0 || article.bookId < 0)) {
    return res.status(400).send({ message: "Les valeurs des données de la commande sont invalides." });
  }

  // Vérifie la valeur de shippingCost qui peut etre égal à zero 
  if (shippingCost && typeof shippingCost !== "number") {
    return res.status(400).send({ message: "Le type de données de shippingCost est incorrect." });
  }

  next();
}

// Insertion des données de commandes lorsqu'un utilisateur passe commnde 
exports.createOrder = async (req, res) => {
  const { totalWithoutShipping, shippingCost, orderTotal, orderNumber, id_users, articles } = req.body;
  const connection = await pool.getConnection();

  try {
    // Début d'une transaction pour garantir l'intégrité des données lors de l'insertion de la commande
    await connection.beginTransaction();

    // Insertion de la nouvelle commande dans la table `orders`
    const orderPromise = await connection.query(
      'INSERT INTO orders (totalWithoutShipping, shippingCost, orderTotal, orderNumber, id_users) VALUES (?, ?, ?, ?, ?)',
      [totalWithoutShipping, shippingCost, orderTotal, orderNumber, id_users]
    );
    const orderId = orderPromise[0].insertId;

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
  } finally {
    connection.release(); // Remettre la connexion dans le pool
  }
}


// Recupération de l'historique de commande(s) d'un utilisateurconnecté
exports.getOrderHistory = async (req, res) => {
  try {
    const userId = req.auth.userId;

    /* On ne met pas ORDER BY orders.orderDate DESC pour le trie décroissant des commandes 
      parce que les deux tables "orders" et "order-line" ne peuvent pas être jointes sur une même table: 
      plusieurs lignes de la table "order-line" peuvent correspondre à une ligne de la table "orders". 
      Donc l'affichage de l'historique des commandes par ordre décroissant se fera après la récupération
      du résultat avec la méthode reverse() pour inverser la table en ordre décroissant  */
    const query = `
                SELECT orders.id, orders.totalWithoutShipping, orders.shippingCost, orders.orderTotal, orders.orderDate, orders.orderNumber, order_line.reference, order_line.title, order_line.price, order_line.quantity, order_line.id_books
                FROM orders
                INNER JOIN order_line ON orders.id = order_line.id_orders
                WHERE orders.id_users = ?
              `;

    const [results] = await pool.query(query, [userId]);

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

    /* Avec "Object.values(orders)" on aura un tableau plutôt qu'un objet pour pouvoir itérer 
      facilement les données côté front. La méthode reverse() va inverser le tableau pour que le trie 
      du tableau soit décroissant. Cela fait que les commandes seront affichées par ordre décroissant, c'est-à-dire
      des plus récentes aux plus anciennes. */
    res.json({ orders: Object.values(orders).reverse() });
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes de l\'utilisateur :', error);
    res.status(500).json({ error: 'Une erreur est survenue' });
  }
}
