const request = require('supertest');

const BASE_URL = 'http://localhost:3000';

async function registerUserExternal(username, password, favorecidos = []) {
    await request(BASE_URL)
        .post('/users/register')
        .send({ username, password, favorecidos });
}

async function loginAndGetTokenExternal(username, password) {
    const res = await request(BASE_URL)
        .post('/users/login')
        .send({ username, password });
    if (!res.body.user || !res.body.user.token) {
        throw new Error(`Login falhou para ${username}: token não encontrado. Resposta: ${JSON.stringify(res.body)}`);
    }
    return res.body.user.token;
}

function authRequestExternal(token) {
    return (method, route) => request(BASE_URL)[method](route).set('Authorization', `Bearer ${token}`);
}

module.exports = {
    registerUserExternal,
    loginAndGetTokenExternal,
    authRequestExternal,
    BASE_URL
};
