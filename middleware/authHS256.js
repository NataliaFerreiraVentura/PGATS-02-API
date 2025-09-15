// middleware/authHS256.js
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'X9f8H7j6K5l4M3n2P1q0R9s8T7v6W5z4';

function authHS256(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ status: 401, message: 'Token não informado' });
    const token = authHeader && authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, SECRET, { algorithms: ['HS256'] });
        req.user = payload;
        next();
    } catch (err) {
        return res.status(401).json({ status: 401, message: 'Token inválido' });
    }
}

module.exports = authHS256;
