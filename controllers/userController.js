

const express = require('express');
const router = express.Router();
const userService = require('../services/userService');
const authHS256 = require('../middleware/authHS256');

router.get('/balance', authHS256, (req, res) => {
    try {
        const username = req.user.username;
        const result = userService.getBalance(username);
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.post('/recharge', authHS256, (req, res) => {
    const { username, amount } = req.body;
    try {
        const result = userService.rechargeCredit(username, amount);
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.post('/register', (req, res) => {
    try {
        const user = userService.registerUser(req.body);
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.post('/login', (req, res) => {
    try {
        const user = userService.loginUser(req.body);
        res.status(200).json({ message: 'Login realizado com sucesso', user });
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
});

router.get('/', (req, res) => {
    res.json(userService.getUsers());
});

module.exports = router;
