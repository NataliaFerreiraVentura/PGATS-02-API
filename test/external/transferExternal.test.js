
const { expect } = require('chai');
const request = require('supertest');
const {
    registerUserExternal,
    loginAndGetTokenExternal,
    authRequestExternal
} = require('../helpers/externalHelpers');

describe('Transfer - external', () => {
    let token;
    let authed;
    // Melhoria: garantir que o destinatário existe e resetar saldo antes de cada teste
    beforeEach(async () => {
        token = await loginAndGetTokenExternal('Naty', '123456');
        authed = authRequestExternal(token);

        // Resetar saldo do remetente
        await authed('post', '/users/recharge')
            .send({ username: 'Naty', amount: 1000 });

        // Garantir que destinatário existe para testes positivos
        await registerUserExternal('Nathan', '123456');

        expect(token).to.be.a('string');
        expect(token).to.not.be.empty;
    });

    it('Deve retornar 400 se destinatário não estiver cadastrado', async () => {
        // Melhoria: valida mensagem de erro e status
        // Não cadastra o destinatário 'QAS'
        const userData = {
            from: 'Naty',
            to: 'QAS',
            amount: 100
        };
        const res = await authed('post', '/transfer').send(userData);
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('error', 'Usuário remetente ou destinatário não encontrado');
        // Melhoria: checar tipo da resposta
        expect(res.body.error).to.be.a('string');
    });

    it('Deve retornar 201 quando a transferência é válida', async () => {
        // Melhoria: consulta saldo antes e depois
        // Consulta saldo inicial do remetente e destinatário
        const saldoRemetenteAntes = (await authed('get', '/users/balance')).body.saldo;
        const saldoDestinatarioAntes = (await request('http://localhost:3000')
            .post('/users/login')
            .send({ username: 'Nathan', password: '123456' })
            .then(res => res.body.user.token)
            .then(tokenNathan => request('http://localhost:3000')
                .get('/users/balance')
                .set('Authorization', `Bearer ${tokenNathan}`)
            )).body.saldo;

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
        // Melhoria: checar tipos
        expect(res.body.amount).to.be.a('number');
        expect(res.body.date).to.be.a('string');

        // Consulta saldo após transferência
        const saldoRemetenteDepois = (await authed('get', '/users/balance')).body.saldo;
        const saldoDestinatarioDepois = (await request('http://localhost:3000')
            .post('/users/login')
            .send({ username: 'Nathan', password: '123456' })
            .then(res => res.body.user.token)
            .then(tokenNathan => request('http://localhost:3000')
                .get('/users/balance')
                .set('Authorization', `Bearer ${tokenNathan}`)
            )).body.saldo;

        // Melhoria: valida saldo atualizado
        expect(saldoRemetenteDepois).to.equal(saldoRemetenteAntes - userData.amount);
        expect(saldoDestinatarioDepois).to.equal(saldoDestinatarioAntes + userData.amount);
    });

    it('Deve retornar 200 ao consultar transferências', async () => {
        // Melhoria: checar estrutura dos itens do array
        const res = await authed('get', '/transfer');
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        if (res.body.length > 0) {
            const item = res.body[0];
            expect(item).to.have.property('from');
            expect(item).to.have.property('to');
            expect(item).to.have.property('amount');
            expect(item).to.have.property('date');
        }
    });

    // Melhoria: teste de borda - valor zero
    it('Deve retornar 400 ao tentar transferir valor zero', async () => {
        const userData = {
            from: 'Naty',
            to: 'Nathan',
            amount: 0
        };
        const res = await authed('post', '/transfer').send(userData);
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('error');
    });

    // Melhoria: teste de borda - valor negativo
    it('Deve retornar 400 ao tentar transferir valor negativo', async () => {
        const userData = {
            from: 'Naty',
            to: 'Nathan',
            amount: -50
        };
        const res = await authed('post', '/transfer').send(userData);
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('error');
    });

    // Melhoria: limpeza - remover usuários criados após os testes (exemplo)
    afterEach(async () => {
        // Aqui você pode implementar lógica para remover usuários criados, se necessário
        // await deleteUserExternal('Nathan');
    });
});

describe('Transfer - external - outro exemplo mostrado em aula', () => {
    // Melhoria: padronizar async/await
    before(async function () {
        const respostaLogin = await request('http://localhost:3000')
            .post('/users/login')
            .send({ username: 'Naty', password: '123456' });
        this.token = respostaLogin.body.user.token;
    });

    it('Deve retornar 201 quando a transferência é válida', async function () {
        // Melhoria: garantir que destinatário existe
        await request('http://localhost:3000')
            .post('/users/register')
            .send({ username: 'sophia', password: '123456' });

        const userData = {
            from: 'Naty',
            to: 'sophia',
            amount: 1
        };

        const resposta = await request('http://localhost:3000')
            .post('/transfer')
            .set('Authorization', `Bearer ${this.token}`)
            .send(userData);

        expect(resposta.status).to.equal(201);
        expect(resposta.body).to.have.property('from', 'Naty');
        expect(resposta.body).to.have.property('to', 'sophia');
        expect(resposta.body).to.have.property('date');
        // Melhoria: checar tipos
        expect(resposta.body.amount).to.be.a('number');
        expect(resposta.body.date).to.be.a('string');
    });
});




