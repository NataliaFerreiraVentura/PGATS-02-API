const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
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
