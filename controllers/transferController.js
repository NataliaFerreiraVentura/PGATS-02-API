const express = require('express');
const router = express.Router();

const authHS256 = require('../middleware/authHS256');
const transferService = require('../services/transferService');


router.post('/', authHS256, (req, res) => {
    try {
        const transfer = transferService.transferValue(req.body);
        res.status(201).json(transfer);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get('/', authHS256, (req, res) => {
    res.json(transferService.getTransfers());
});

module.exports = router;
