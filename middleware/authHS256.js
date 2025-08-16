// middleware/authHS256.js
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'pgats-api-secret-1234567890abcdef';

function authHS256(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ status: 401, message: 'Token não informado' });
    const token = authHeader.replace('Bearer ', '');
    try {
        const payload = jwt.verify(token, SECRET, { algorithms: ['HS256'] });
        req.user = payload;
        next();
    } catch (err) {
        return res.status(401).json({ status: 401, message: 'Token inválido' });
    }
}

module.exports = authHS256;
