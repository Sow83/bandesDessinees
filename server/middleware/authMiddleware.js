const jwt = require('jsonwebtoken')
 
const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw new Error('Missing Authorization header');
        }
        const token = authHeader.split(' ')[1];
        const decodedToken = jwt.verify(token, 'mysecretkey');
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
        next();
    } catch(error) {
        res.status(401).json({ error })
    }
 };
 module.exports = authMiddleware


 
 