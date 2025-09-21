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

    // Garante que favorecidos e saldo estejam inicializados
    if (!Array.isArray(sender.favorecidos)) sender.favorecidos = [];
    if (!Array.isArray(recipient.favorecidos)) recipient.favorecidos = [];
    if (typeof sender.saldo !== 'number') sender.saldo = 0;
    if (typeof recipient.saldo !== 'number') recipient.saldo = 0;

    if (typeof amount !== 'number' || amount <= 0) {
        const err = new Error('Valor da transferência deve ser maior que zero');
        err.status = 400;
        throw err;
    }

    if (sender.saldo < amount) {
        const err = new Error('Saldo insuficiente');
        err.status = 400;
        throw err;
    }

    // Regra: transferências para destinatários não favorecidos só podem ser realizadas se o valor for menor que R$ 5.000,00
    const isFavorecido = sender.favorecidos.includes(to);
    if (!isFavorecido && amount >= 5000) {
        const err = new Error('Transferências acima de R$ 5.000,00 só são permitidas para favorecidos');
        err.status = 403;
        throw err;
    }

    sender.saldo -= amount;
    recipient.saldo += amount;

    const transfer = { from, to, valor: amount, date: new Date().toISOString() };
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
