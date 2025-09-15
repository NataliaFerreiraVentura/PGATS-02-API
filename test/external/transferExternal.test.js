
const { expect } = require('chai');
const request = require('supertest');
const {
    registerUserExternal,
    loginAndGetTokenExternal,
    authRequestExternal
} = require('../helpers/externalHelpers');

describe('Transfer Controller - external', () => {
    it('Deve retornar 400 se destinatário não estiver cadastrado', async () => {
        // Não cadastra o destinatário
        const userData = {
            from: 'Naty',
            to: 'QAS',
            amount: 100
        };
        const res = await authed('post', '/transfer').send(userData);
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('error', 'Usuário remetente ou destinatário não encontrado');
    });
    let token;
    let authed;
    before(async () => {
        await registerUserExternal('Naty', '123456', []);
        token = await loginAndGetTokenExternal('Naty', '123456');
        authed = authRequestExternal(token);
        await authed('post', '/users/recharge')
            .send({ username: 'Naty', amount: 1000 });
        expect(token).to.be.a('string');
        expect(token).to.not.be.empty;
        console.log('Token obtido no login:', token);
    });

    it('Deve retornar 201 quando a transferência é válida', async () => {
        
        await registerUserExternal('Nathan', '123456', []);
    
        const userData = {
            from: 'Naty',
            to: 'Nathan',
            amount: 100
        };
        const res = await authed('post', '/transfer').send(userData);
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('from', 'Naty');
        expect(res.body).to.have.property('to', 'Nathan');
        expect(res.body).to.have.property('amount', 100);
        expect(res.body).to.have.property('date');
        console.log('Resposta do corpo:', res.body);
    });

    it('Deve retornar 200 ao consultar transferências', async () => {
        const res = await authed('get', '/transfer');
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
    });

    it('Devo receber 200 e o valor do saldo ao consultar meu saldo', async () => {
        const res = await authed('get', '/users/balance');
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('username', 'Naty');
        expect(res.body).to.have.property('balance');
        expect(res.body.balance).to.be.a('number');
        expect(res.body.balance).to.be.at.least(0);

        console.log(res.body.balance);
    });
});

describe('Transfer Controller - external - outro exemplo mostrado em aula', () => {

    it('Deve retornar 201 quando a transferência é válida', async () => {
        //1- criar usuario
        const resgritroUser = await request('http://localhost:3000')
            .post('/users/register')
            .send({
                "username": "QA",
                "password": "123456",
                "favorecidos": [
                    ""
                ]
            });
        //2- capturar o token
        const respostaLogin = await request('http://localhost:3000')
            .post('/users/login')
            .send({
                username: 'QA',
                password: '123456'
            });

        const token = respostaLogin.body.user.token;

        // 3 - realizar transferencia

        const userData = {
            from: 'Naty',
            to: 'Nathan',
            amount: 100
        };

        const resposta = await request('http://localhost:3000')
            .post('/transfer')
            .set('Authorization', `Bearer ${token}`) // Adiciona o token no cabeçalho
            .send(userData);

        expect(resposta.status).to.equal(201);
        expect(resposta.body).to.have.property('from', 'Naty');
        expect(resposta.body).to.have.property('to', 'Nathan');
        expect(resposta.body).to.have.property('amount', 100);
        expect(resposta.body).to.have.property('date');
        console.log('Resposta do corpo:', resposta.body);
    });

})
