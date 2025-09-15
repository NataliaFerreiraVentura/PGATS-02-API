const { users } = require('../models/userModel');
const { transfers } = require('../models/transferModel');

function transferValue({ from, to, amount }) {
    const sender = users.find(u => u.username === from);
    const recipient = users.find(u => u.username === to);
    if (!sender || !recipient) {
        const err = new Error('Usuário remetente ou destinatário não encontrado');
        err.status = 400;
        throw err;
    }

    // Garante que favorecidos e balance estejam inicializados
    if (!Array.isArray(sender.favorecidos)) sender.favorecidos = [];
    if (!Array.isArray(recipient.favorecidos)) recipient.favorecidos = [];
    if (typeof sender.balance !== 'number') sender.balance = 0;
    if (typeof recipient.balance !== 'number') recipient.balance = 0;

    if (typeof amount !== 'number' || amount <= 0) {
        const err = new Error('Valor da transferência deve ser maior que zero');
        err.status = 400;
        throw err;
    }

    if (sender.balance < amount) {
        const err = new Error('Saldo insuficiente');
        err.status = 400;
        throw err;
    }

    // Regra de favorecido removida: qualquer valor pode ser transferido para qualquer usuário

    sender.balance -= amount;
    recipient.balance += amount;

    const transfer = { from, to, amount, date: new Date().toISOString() };
    transfers.push(transfer);
    return transfer;
}

function getTransfers() {
    return transfers;
}

module.exports = {
    transferValue,
    getTransfers,
};
