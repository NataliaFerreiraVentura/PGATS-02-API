// Bibliotecas
const request = require('supertest');
const sinon = require('sinon');
const { expect } = require('chai');

// Aplicação 
const app = require('../../app');

//Mock
const transferService = require('../../services/transferService');

// Testes
describe('Transfer Controller', () => {
  let token;
  before(async () => {
    // Cria usuário e faz login para obter token
    await request(app)
      .post('/users/register')
      .send({ username: 'Naty', password: '123456' });
    const loginRes = await request(app)
      .post('/users/login')
      .send({ username: 'Naty', password: '123456' });
    token = loginRes.body.user.token;
  });

  describe('POST /transfer', () => {
    it('Quando informo remetente e destinatario inexistentes recebo 400', async () => {
      const resposta = await request(app)
        .post('/transfer')
        .set('Authorization', `Bearer ${token}`)
        .send({
          from: 'Naty',
          to: 'Nathan',
          amount: 100
        });
      expect(resposta.status).to.equal(400);
      expect(resposta.body).to.have.property('error', 'Usuário remetente ou destinatário não encontrado');
    });

    it('Usando MOKS: Quando informo remetente e destinatario inexistentes recebo 400', async () => {
      // Mockar apenas a função transfer do service
      const transferServiceMock = sinon.stub(transferService, 'transferValue');
      transferServiceMock.throws(new Error('Usuário remetente ou destinatário não encontrado'));

      const resposta = await request(app)
        .post('/transfer')
        .set('Authorization', `Bearer ${token}`)
        .send({
          from: 'Naty',
          to: 'Nathan',
          amount: 100
        });
      expect(resposta.status).to.equal(400);
      expect(resposta.body).to.have.property('error', 'Usuário remetente ou destinatário não encontrado');

      //Reseto o mock
      sinon.restore();
    });
  });

  describe('GET /transfer', () => {
    it('Deve retornar 200 e uma lista de transferências', async () => {
      const resposta = await request(app)
        .get('/transfer')
        .set('Authorization', `Bearer ${token}`);
      expect(resposta.status).to.equal(200);
      expect(resposta.body).to.be.an('array');
    });
  });
});