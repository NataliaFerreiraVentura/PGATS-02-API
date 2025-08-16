const { users } = require('../models/userModel');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'pgats-api-secret-1234567890abcdef';

function generateToken(payload) {
    return jwt.sign(payload, SECRET, { expiresIn: '1h', algorithm: 'HS256' });
}

function registerUser({ username, password, favorecidos = [] }) {
    if (!username || !password) {
        throw new Error('Username e password são obrigatórios');
    }
    if (users.find(u => u.username === username)) {
        throw new Error('Usuário já existe');
    }
    const user = { username, password, favorecidos };
    users.push(user);
    return user;
}

function loginUser({ username, password }) {
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) throw new Error('Credenciais inválidas');
    // Gera JWT
    const token = generateToken({ username: user.username });
    return { ...user, token };
}

function getUsers() {
    return users;
}

function rechargeCredit(username, amount) {
    if (!username || typeof amount !== 'number' || amount <= 0) {
        throw new Error('Dados inválidos para recarga');
    }
    const user = users.find(u => u.username === username);
    if (!user) {
        throw new Error('Usuário não encontrado');
    }
    if (user.balance === undefined) {
        user.balance = 0;
    }
    user.balance += amount;
    return { username: user.username, balance: user.balance };
}

function getBalance(username) {
    const user = users.find(u => u.username === username);
    if (!user) {
        throw new Error('Usuário não encontrado');
    }
    return { username: user.username, balance: user.balance || 0 };
}

module.exports = {
    registerUser,
    loginUser,
    getUsers,
    rechargeCredit,
    getBalance,
};
