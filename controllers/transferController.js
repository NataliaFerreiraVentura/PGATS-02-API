const express = require('express');
const router = express.Router();
// Middleware de autenticação JWT
const { verifyToken } = require('../jwtConfig');
function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ error: 'Token não informado' });
    const token = authHeader.replace('Bearer ', '');
    const payload = verifyToken(token);
    if (!payload) return res.status(401).json({ error: 'Token inválido' });
    req.user = payload;
    next();
}
const transferService = require('../services/transferService');

router.post('/', authMiddleware, (req, res) => {
    try {
        const transfer = transferService.transferValue(req.body);
        res.status(201).json(transfer);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get('/', authMiddleware, (req, res) => {
    res.json(transferService.getTransfers());
});

module.exports = router;
