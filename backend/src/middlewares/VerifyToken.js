const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send('Access Denied: No token provided');
    }
    
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).send('Access Denied: No token provided');
    }

    try {
        const secret = process.env.JWT_SECRET || 'super_secret_jwt_key_12345';
        const verified = jwt.verify(token, secret);
        req.user = verified;
        next();
    } catch (err) {

        console.error("JWT Verification Error:", err.message);

        if (err.name === 'TokenExpiredError') {
            return res.status(401).send('Token Expired');
        }

        res.status(401).send('Invalid Token');
    }
};

module.exports = verifyToken;