const jwt = require('jsonwebtoken');
// Secret forte (32+ caracteres)
const SECRET = process.env.JWT_SECRET || 'pgats-api-secret-1234567890abcdef1234567890abcdef';

function generateToken(payload) {
    return jwt.sign(payload, SECRET, { expiresIn: '1h', algorithm: 'HS256' });
}

function verifyToken(token) {
    try {
        return jwt.verify(token, SECRET, { algorithms: ['HS256'] });
    } catch (err) {
        console.error('Erro ao verificar JWT:', err.message);
        return null;
    }
}

module.exports = { generateToken, verifyToken };
