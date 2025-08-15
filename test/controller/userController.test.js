// Bibliotecas
const request = require('supertest');
const sinon = require('sinon');
const { expect } = require('chai');

// Aplicação 
const app = require('../../app');

//Mock
const userService = require('../../services/userService');

describe('User Controller', () => {
  describe('GET /users', () => {
    it('Quando pesquiso usuários, recebo uma lista', async () => {
      const resposta = await request(app)
        .get('/users');
      expect(resposta.status).to.equal(200);
      expect(resposta.body).to.be.an('array');
    });
  });

  describe('POST /users/login', () => {
    it('MOCK: Quando faço login com credenciais invalidas , recebo 401', async () => {
      // Mockar apenas a função transfer do service
      const userServiceMock = sinon.stub(userService, 'loginUser');
      userServiceMock.throws(new Error('Credenciais inválidas'));
      const resposta = await request(app)
        .post('/users/login')
        .send({
          username: "QA",
          password: "12345"
        });
      expect(resposta.status).to.equal(401);
      expect(resposta.body).to.have.property('error', 'Credenciais inválidas');

      sinon.restore();
    });


    it('Quando faço login com credenciais invalidas , recebo 401', async () => {
      const resposta = await request(app)
        .post('/users/login')
        .send({
          username: "QA",
          password: "12345"
        });
      expect(resposta.status).to.equal(401);
      expect(resposta.body).to.have.property('error', 'Credenciais inválidas');



    });

  });

});