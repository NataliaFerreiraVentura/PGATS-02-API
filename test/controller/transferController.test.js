// test/controllers/transferController.test.js

const sinon = require('sinon');
const { expect } = require('chai');
const transferService = require('../../services/transferService');
const { registerUser, loginAndGetToken, authRequest } = require('../helpers/globalHelpers');

describe('Transfer Controller', () => {
  let token, authed;

  // ----------------------------
  // Antes de todos os testes
  // ----------------------------
  before(async () => {
    // Cria os usuários uma única vez
    await registerUser('Naty', '123456', ['Nathan']);
    await registerUser('Nathan', '123456', []);
  });

  // ----------------------------
  // Antes de cada teste
  // ----------------------------
  beforeEach(async () => {
    // Faz login e cria helper de requisição autenticada
    token = await loginAndGetToken('Naty', '123456');
    authed = authRequest(token);
  });

  // ----------------------------
  // Limpa todos os mocks após cada teste
  // ----------------------------
  afterEach(() => sinon.restore());

  // ----------------------------
  // Testes POST /transfer
  // ----------------------------
  describe('POST /transfer', () => {
    it('Deve retornar 400 quando saldo é insuficiente', async () => {
      const userModel = require('../../models/userModel');
      const naty = userModel.users.find(u => u.username === 'Naty');
      if (naty) naty.balance = 0; // mocka saldo insuficiente

      // Recarga mínima
      await authed('post', '/users/recharge').send({ username: 'Naty', amount: 10 });

      const res = await authed('post', '/transfer')
        .send({ from: 'Naty', to: 'Nathan', amount: 100 });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('error', 'Saldo insuficiente');
    });

    it('Deve retornar 500 quando ocorre erro na transferência', async () => {
      // Simula erro no serviço
      sinon.stub(transferService, 'transferValue')
        .throws(new Error('Erro simulado na transferência'));

      const res = await authed('post', '/transfer')
        .send({ from: 'Naty', to: 'Nathan', amount: 100 });

      expect(res.status).to.equal(500);
      expect(res.body).to.have.property('error', 'Erro simulado na transferência');
    });

    it('Deve retornar 400 quando usuário remetente ou destinatário não existe', async () => {
      const res = await authed('post', '/transfer')
        .send({ from: 'INEXISTENTE', to: 'QA', amount: 100 });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('error', 'Usuário remetente ou destinatário não encontrado');
      console.log('Resposta do corpo:', res.body);
    });

    it('Deve retornar 400 usando mock quando remetente não existe', async () => {
      const err = new Error('Usuário remetente ou destinatário não encontrado');
      err.status = 400;
      sinon.stub(transferService, 'transferValue').throws(err);

      const res = await authed('post', '/transfer')
        .send({ from: 'QA', to: 'JULIO', amount: 100 });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('error', 'Usuário remetente ou destinatário não encontrado');
    });

    it('Deve retornar 201 usando mock quando a transferência é válida', async () => {
      const respostaEsperada = require('../fixture/Respostas/transferFixtureComSucesso.json').transferList[0];

      // Mocka transferência bem-sucedida
      const mockData = {
        from: 'Naty',
        to: 'Nathan',
        amount: 100,
        date: new Date().toISOString()
      };
      sinon.stub(transferService, 'transferValue').returns(mockData);

      const res = await authed('post', '/transfer')
        .send({ from: 'Naty', to: 'Nathan', amount: 100 });

      expect(res.status).to.equal(201);

      // Remove data para comparação exata
      delete res.body.date;
      const respostaSemData = { ...respostaEsperada };
      delete respostaSemData.date;

      expect(res.body).to.deep.equal(respostaSemData);
      expect(res.status).to.equal(201);

      console.log('Resposta do corpo:', res.body);
    });
  });

  // ----------------------------
  // Testes GET /transfer - listagem de transferências
  // ----------------------------
  describe('GET /transfer', () => {
    it('Deve retornar 200 e uma lista de transferências', async () => {
      const res = await authed('get', '/transfer');

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
    });
  });
});
