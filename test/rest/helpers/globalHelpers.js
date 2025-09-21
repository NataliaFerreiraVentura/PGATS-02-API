const request = require('supertest');
const app = require('../../../app');

function getRequestTarget(target) {
    return typeof target === 'string' ? target : app;
}

async function registerUser(username, password, favorecidos = [], target = app) {
    await request(getRequestTarget(target))
        .post('/users/register')
        .send({ username, password, favorecidos });
}

async function loginAndGetToken(username, password, target = app) {
    const res = await request(getRequestTarget(target))
        .post('/users/login')
        .send({ username, password });
    return res.body.user.token;
}

function authRequest(token, target = app) {
    return (method, route) => request(getRequestTarget(target))[method](route).set('Authorization', `Bearer ${token}`);
}

module.exports = {
    registerUser,
    loginAndGetToken,
    authRequest
};
