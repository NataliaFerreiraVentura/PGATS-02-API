const { users } = require('../models/userModel');
const { generateToken } = require('../jwtConfig');

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

module.exports = {
    registerUser,
    loginUser,
    getUsers,
};
