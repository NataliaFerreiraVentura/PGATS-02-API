const express = require('express');
const router = express.Router();

const authHS256 = require('../middleware/authHS256');
const transferService = require('../services/transferService');


router.post('/', authHS256, (req, res) => {
    try {
        const transfer = transferService.transferValue(req.body);
        res.status(201).json(transfer);
    } catch (err) {
        if (err.message && err.message.startsWith('Usuário')) {
            res.status(400).json({ error: err.message });
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
