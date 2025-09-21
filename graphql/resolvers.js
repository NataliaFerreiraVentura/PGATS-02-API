const userService = require('../services/userService');
const transferService = require('../services/transferService');

module.exports = {
    Query: {
        users: () => userService.getUsers(),
        userBalance: (_, { username }, context) => {
            // Se contexto existir, valida username
            if (context && context.user && context.user.username !== username) {
                throw new Error('Usuário autenticado não corresponde ao username informado');
            }
            return userService.getBalance(username);
        },
        transfers: () => transferService.getTransfers(),
    },
    Mutation: {
        registerUser: (_, { username, password, favorecidos }) => {
            return userService.registerUser({ username, password, favorecidos });
        },
        loginUser: (_, { username, password }) => {
            return userService.loginUser({ username, password });
        },
        rechargeCredit: (_, { username, valor }, context) => {
            if (!context.user) throw new Error('Autenticação obrigatória');
            // Validação: username deve ser igual ao usuário autenticado
            if (context.user.username !== username) {
                throw new Error('Usuário autenticado não corresponde ao username informado');
            }
            return userService.rechargeCredit(username, valor);
        },
        transfer: (_, { from, to, valor }, context) => {
            if (!context.user) throw new Error('Autenticação obrigatória');
            // Validação: o campo 'from' deve ser igual ao usuário autenticado
            if (context.user.username !== from) {
                throw new Error('Usuário autenticado não corresponde ao remetente da transferência');
            }
            return transferService.transferValue({ from, to, amount: valor });
        },
    },
};
