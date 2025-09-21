const request = require('supertest');
const { expect, use } = require('chai');
require('dotenv').config();

const chaiExclude = require('chai-exclude');
use(chaiExclude);

describe('Testes de transferência - GraphQL', () => {

    before(async () => {

        const LoginUser = require('../fixtures/Request/Login/loginUser.json')
        const resposta = await request(process.env.BASE_URL_GRAPHQL)
            .post('')
            .send(LoginUser);
        token = resposta.body.data.loginUser.token;
    });

    beforeEach(() => {
        createTransfer = require('../fixtures/Request/Transfer/CreateTransfer.json')
    });

    it('Validar que é possivel transferir grana entre duas contas', async () => {
        const respostaEsperada = require('../fixtures/Request/Respostas/ValidarQueEPossivelTransferirGranaEntreDuasContas.json')
        const respostasTransferencia = await request(process.env.BASE_URL_GRAPHQL)
            .post('')
            .set('Authorization', `Bearer ${token}`)
            .send(createTransfer);
        expect(respostasTransferencia.status).to.equal(200);
        expect(respostasTransferencia.body.data.transfer)
        .excluding('date')
        .to.deep.equal(respostaEsperada.data.transfer);
    });

    const testesDeErroDeNegocio = require('../fixtures/Request/Transfer/CreateTransferWithError.json');
    testesDeErroDeNegocio.forEach((teste) => {
        it(`Regra: ${teste.nomeDoTeste}`, async () => {
            const respostasTransferencia = await request(process.env.BASE_URL_GRAPHQL)
                .post('')
                .set('Authorization', `Bearer ${token}`)
                .send(teste.transfer);

            expect(respostasTransferencia.body.errors[0].message).to.equal(teste.mensagemEsperada);
        });
    });
});