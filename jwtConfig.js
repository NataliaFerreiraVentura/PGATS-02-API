const jwt = require('jsonwebtoken');
const SECRET = 'pgats-api-secret'; // Troque por uma variável de ambiente em produção

function generateToken(payload) {
    return jwt.sign(payload, SECRET, { expiresIn: '1h' });
}

function verifyToken(token) {
    try {
        return jwt.verify(token, SECRET);
    } catch (err) {
        return null;
    }
}

module.exports = { generateToken, verifyToken };
