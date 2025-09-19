const bcrypt = require('bcryptjs');

// In-memory user database
const users = [
    {
        username: 'Naty',
        password: bcrypt.hashSync('123456', 8),
        favorecidos: ['sophia'],
        saldo: 10000
    },
    {
        username: 'sophia',
        password: bcrypt.hashSync('123456', 8),
        favorecidos: ['Naty'],
        saldo: 100
    },
    {
        username: 'Nathan',
        password: bcrypt.hashSync('123456', 8),
        favorecidos: ['Naty'],
        saldo: 10
    }
];



module.exports = {
    users
};
