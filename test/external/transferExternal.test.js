// Bibliotecas
const request = require('supertest');
const { expect } = require('chai');

let token;
let authRequest;

describe('Transfer Controller - external', () => {
    before(async () => {
        await request('http://localhost:3000')
            .post('/users/register')                                                                     
            .send({ username: 'Naty', password: '123456' });

        const loginRes = await request('http://localhost:3000')
            .post('/users/login')
            .send({ username: 'Naty', password: '123456' });

        token = loginRes.body.user.token;
        authRequest = (method, route) => request('http://localhost:3000')[method](route).set('Authorization', `Bearer ${token}`);
    });


    it('Deve retornar 200 ao consultar transferências', async () => {
        const res = await authRequest('get', '/transfer');
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
    });
});