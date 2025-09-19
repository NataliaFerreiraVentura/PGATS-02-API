const { users } = require('../models/userModel');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'X9f8H7j6K5l4M3n2P1q0R9s8T7v6W5z4';

function generateToken(payload) {
    return jwt.sign(payload, SECRET, { expiresIn: '1h', algorithm: 'HS256' });
}

function registerUser({ username, password, favorecidos = [] }) {
    if (!username || !password) {
        throw new Error('Username e password são obrigatórios');
    }
    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
        return existingUser;
    }
    const bcrypt = require('bcryptjs');
    const hashedPassword = bcrypt.hashSync(password, 8);
    // Inicializa balance e favorecidos
    const user = { username, password: hashedPassword, favorecidos: Array.isArray(favorecidos) ? favorecidos : [], saldo: 0 };
    users.push(user);
    return user;
}

function loginUser({ username, password }) {
    const bcrypt = require('bcryptjs');
    const user = users.find(u => u.username === username && bcrypt.compareSync(password, u.password));
    if (!user) throw new Error('Credenciais inválidas');
    // Gera JWT
    const token = generateToken({ username: user.username });
    // Retorna saldo como 'saldo'
    const { balance, saldo, ...rest } = user;
    return { ...rest, saldo: user.saldo ?? user.balance ?? 0, token };
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
    if (user.saldo === undefined) {
        user.saldo = 0;
    }
    user.saldo += amount;
    return { username: user.username, saldo: user.saldo };
}

function getBalance(username) {
    const user = users.find(u => u.username === username);
    if (!user) {
        throw new Error('Usuário não encontrado');
    }
    return { username: user.username, saldo: user.saldo ?? user.balance ?? 0 };
}

module.exports = {
    registerUser,
    loginUser,
    getUsers,
    rechargeCredit,
    getBalance,
};
