var jwt = require('jsonwebtoken');
const JWT_SECRET = 'As@disgoodb0y';

const fetchUser = (req, res, next) => {
    // Get the user from the JWT token and add ID to req object
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ error: "Please authenticate using a valid token!" })
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({ error: "Please authenticate using a valid token!" })
    }
}

module.exports = fetchUser;