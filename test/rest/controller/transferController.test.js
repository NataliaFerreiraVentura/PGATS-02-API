// test/controllers/transferController.test.js

const sinon = require('sinon');
const { expect } = require('chai');
const request = require('supertest');
const transferService = require('../../../services/transferService');
const { loginAndGetToken, authRequest } = require('../helpers/globalHelpers');
const app = require('../../../app');
describe('Transfer Controller', () => {
  let token, authed;

  before(async () => {
    // Faz login e cria helper de requisição autenticada
    token = await loginAndGetToken('Naty', '123456');
    authed = authRequest(token);

  })


  // ----------------------------
  afterEach(() => sinon.restore());

  // ----------------------------
  // Testes POST /transfer
  // ----------------------------
  describe('POST /transfer', () => {

    it('Deve retornar 400 quando saldo é insuficiente', async () => {
      const userModel = require('../../../models/userModel');
      const naty = userModel.users.find(u => u.username === 'Naty');
      if (naty) naty.saldo = 0; // mocka saldo insuficiente

      // Recarga mínima
      await authed('post', '/users/recharge').send({ username: 'Naty', amount: 10 });

      const res = await authed('post', '/transfer')
        .send({ from: 'Naty', to: 'Nathan', valor: 100 });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('error', 'Saldo insuficiente');
    });

    it('Deve retornar 500 quando ocorre erro na transferência', async () => {
      // Simula erro no serviço
      sinon.stub(transferService, 'transferValue')
        .throws(new Error('Erro simulado na transferência'));

      const res = await authed('post', '/transfer')
        .send({ from: 'Naty', to: 'Nathan', valor: 100 });

      expect(res.status).to.equal(500);
      expect(res.body).to.have.property('error', 'Erro simulado na transferência');
    });

    it('Deve retornar 403 quando usuário autenticado não bate com remetente', async () => {
      const res = await authed('post', '/transfer')
        .send({ from: 'INEXISTENTE', to: 'QA', valor: 100 });

      expect(res.status).to.equal(403);
      expect(res.body).to.have.property('error', 'Usuário autenticado não corresponde ao remetente da transferência');
    });

    it('Deve retornar 403 usando mock quando remetente não bate com autenticado', async () => {
      const err = new Error('Usuário autenticado não corresponde ao remetente da transferência');
      err.status = 403;
      sinon.stub(transferService, 'transferValue').throws(err);

      const res = await authed('post', '/transfer')
        .send({ from: 'QA', to: 'JULIO', valor: 100 });

      expect(res.status).to.equal(403);
      expect(res.body).to.have.property('error', 'Usuário autenticado não corresponde ao remetente da transferência');
    });

    it('Deve retornar 201 usando mock quando a transferência é válida', async () => {
      const respostaEsperada = require('../fixture/transferFixtureComSucesso.json').transferList[0];

      // Mocka transferência bem-sucedida
      const mockData = {
        from: 'Naty',
        to: 'Nathan',
        amount: 100,
        date: new Date().toISOString()
      };
      sinon.stub(transferService, 'transferValue').returns(mockData);

      const res = await authed('post', '/transfer')
        .send({ from: 'Naty', to: 'Nathan', valor: 100 });

      expect(res.status).to.equal(201);

      // Remove data para comparação exata
      delete res.body.date;
      const respostaSemData = { ...respostaEsperada };
      delete respostaSemData.date;

      expect(res.body).to.deep.equal(respostaSemData);
      expect(res.status).to.equal(201);
    });
  });

  describe('GET /transfer', () => {
    it('Deve retornar 200 e lista de transferências', async () => {
      const res = await authed('get', '/transfer');
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
    });
  });

  describe('Transfer Controller -  exemplo mostrado em aula', () => {
    it('Deve retornar 400 quando saldo é insuficiente', async () => {
      const respostaLogin = await request(app)
        .post('/users/login')
        .send({
          username: 'Nathan',
          password: '123456'
        });
      const token = respostaLogin.body.user.token;

      const res = await request(app)
        .post('/transfer')
        .set('Authorization', `Bearer ${token}`)
        .send({ from: 'Nathan', to: 'Naty', valor: 100 });
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('error', 'Saldo insuficiente');
    });

    it('Deve retornar 200 e lista de transferências', async () => {
      const res = await request(app)
        .get('/transfer')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
    });
  });
});
