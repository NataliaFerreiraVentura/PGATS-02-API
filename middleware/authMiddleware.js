// middleware/authMiddleware.js

const { verifyToken } = require('../jwtConfig');

function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ status: 401, message: 'Token não informado' });
    const token = authHeader.replace('Bearer ', '');
    const payload = verifyToken(token);
    if (!payload) return res.status(401).json({ status: 401, message: 'Token inválido' });
    req.user = payload;
    next();
}

module.exports = authMiddleware;
