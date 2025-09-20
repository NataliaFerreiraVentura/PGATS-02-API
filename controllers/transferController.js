const express = require('express');
const router = express.Router();

const authHS256 = require('../middleware/authHS256');
const transferService = require('../services/transferService');


router.post('/', authHS256, (req, res, next) => {
    const { from, to, amount } = req.body;
    // Validação básica dos campos
    if (!from || !to || typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ error: 'Dados inválidos para transferência' });
    }
    // Validação: o campo 'from' deve ser igual ao usuário autenticado
    if (req.user.username !== from) {
        return res.status(403).json({ error: 'Usuário autenticado não corresponde ao remetente da transferência' });
    }
    try {
        const transfer = transferService.transferValue(req.body);
        res.status(201).json(transfer);
    } catch (err) {
        if (err.status) {
            res.status(err.status).json({ error: err.message });
        } else {
            next(err);
        }
    }
});

router.get('/', authHS256, (req, res, next) => {
    try {
        res.json(transferService.getTransfers());
    } catch (err) {
        next(err);
    }
});

module.exports = router;
