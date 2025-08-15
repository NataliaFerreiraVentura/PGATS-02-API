const { users } = require('../models/userModel');
const { transfers } = require('../models/transferModel');

function transferValue({ from, to, amount }) {
    const sender = users.find(u => u.username === from);
    const recipient = users.find(u => u.username === to);
    if (!sender || !recipient) throw new Error('Usuário remetente ou destinatário não encontrado');

    if (typeof amount !== 'number' || amount <= 0) {
        throw new Error('Valor da transferência deve ser maior que zero');
    }

    if (sender.balance === undefined || sender.balance < amount) {
        throw new Error('Saldo insuficiente');
    }

    const isFavorecido = sender.favorecidos && sender.favorecidos.includes(to);
    if (!isFavorecido && amount >= 5000) {
        throw new Error('Transferências acima de R$ 5.000,00 só podem ser feitas para favorecidos');
    }

    sender.balance -= amount;
    if (recipient.balance === undefined) {
        recipient.balance = 0;
    }
    recipient.balance += amount;

    const transfer = { from, to, amount, date: new Date() };
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
