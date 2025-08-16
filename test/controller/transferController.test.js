// Bibliotecas
const request = require('supertest');
const sinon = require('sinon');
const { expect } = require('chai');

// Aplicação 
const app = require('../../app');

// Serviço a ser mockado
const transferService = require('../../services/transferService');

describe('Transfer Controller', () => {
  let token;

  // Cria usuário e faz login antes de todos os testes
  before(async () => {
    await request(app)
      .post('/users/register')
      .send({ username: 'Naty', password: '123456' });

    const loginRes = await request(app)
      .post('/users/login')
      .send({ username: 'Naty', password: '123456' });

    token = loginRes.body.user.token;
  });

  // Limpa todos os mocks após cada teste
  afterEach(() => sinon.restore());

  // Helper para requests autenticadas
  const authRequest = (method, route) => request(app)[method](route).set('Authorization', `Bearer ${token}`);

  describe('POST /transfer', () => {
    it('Deve retornar 400 quando remetente ou destinatário não existem', async () => {
      const res = await authRequest('post', '/transfer')
        .send({ from: 'Naty', to: 'QA', amount: 100 });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('error', 'Usuário remetente ou destinatário não encontrado');
    });

    it('Deve retornar 400 usando mock quando remetente ou destinatário não existem', async () => {
      sinon.stub(transferService, 'transferValue').throws(new Error('Usuário remetente ou destinatário não encontrado'));

      const res = await authRequest('post', '/transfer')
        .send({ from: 'Naty', to: 'JULIO', amount: 100 });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('error', 'Usuário remetente ou destinatário não encontrado');
    });

    it('Deve retornar 201 usando mock quando a transferência é válida', async () => {
      const mockData = {
        from: 'Naty',
        to: 'Nathan',
        amount: 100,
        date: new Date().toISOString()
      };
      sinon.stub(transferService, 'transferValue').returns(mockData);

      const res = await authRequest('post', '/transfer')
        .send({ from: 'Naty', to: 'Nathan', amount: 100 });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('from', 'Naty');
      expect(res.body).to.have.property('to', 'Nathan');
      expect(res.body).to.have.property('amount', 100);
    });
  });

  describe('GET /transfer', () => {
    it('Deve retornar 200 e uma lista de transferências', async () => {
      const res = await authRequest('get', '/transfer');

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
    });
  });
});
