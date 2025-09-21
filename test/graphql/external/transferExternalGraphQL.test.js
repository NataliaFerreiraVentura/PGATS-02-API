const request = require('supertest');
const { expect, use } = require('chai');

const chaiExclude = require('chai-exclude');
use(chaiExclude);

describe('Testes de transferência - GraphQL', () => {

    before(async () => {

        const LoginUser = require('../fixtures/Request/Login/loginUser.json')
        const resposta = await request('http://localhost:4000/graphql')
            .post('')
            .send(LoginUser);
        token = resposta.body.data.loginUser.token;
    });

    beforeEach(() => {
        createTransfer = require('../fixtures/Request/Transfer/CreateTransfer.json')
    });

    it('Validar que é possivel transferir grana entre duas contas', async () => {
        const respostaEsperada = require('../fixtures/Request/Respostas/ValidarQueEPossivelTransferirGranaEntreDuasContas.json')
        const respostasTransferencia = await request('http://localhost:4000/graphql')
            .post('')
            .set('Authorization', `Bearer ${token}`)
            .send(createTransfer);
        expect(respostasTransferencia.status).to.equal(200);
        expect(respostasTransferencia.body.data.transfer)
        .excluding('date')
        .to.deep.equal(respostaEsperada.data.transfer);
    });


    it('Quando não houver saldo, deve retornar erro saldo insuficiente', async () => {
        createTransfer.variables.valor = 10000.0; // Valor alto para garantir saldo insuficiente
        const respostasTransferencia = await request('http://localhost:4000/graphql')
            .post('')
            .set('Authorization', `Bearer ${token}`)
            .send(createTransfer)

        expect(respostasTransferencia.body).to.have.property('errors');
        expect(respostasTransferencia.body.errors[0].message).to.equal('Saldo insuficiente');
        console.log('Erro retornado:', respostasTransferencia.body.errors[0].message);
    });
});