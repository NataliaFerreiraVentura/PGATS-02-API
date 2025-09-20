
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

    it('Quando faço login com credenciais válidas , recebo 200 e token', async () => {
      const resposta = await request(app)
        .post('/users/login')
        .send({
          "username": "Naty",
          "password": "123456"
        });

      expect(resposta.status).to.equal(200);
      expect(resposta.body).to.have.property('user')
      expect(resposta.body.user).to.have.property('token')
      expect(resposta.body.user).to.have.property('saldo')
      expect(resposta.body.user).to.have.property('favorecidos')
    });

    it('Não deve permitir registrar username já existente via REST', async () => {
      const resposta = await request(app)
       .post('/users/register')
       .send({ username: 'Naty', password: '123456' });
      expect(resposta.status).to.equal(400);
      expect(resposta.body).to.have.property('error');
    });

  });

  describe('GET /users/balance', () => {
    let token = null
    beforeEach(async () => {
      const respostaLogin = await request(app)
        .post('/users/login')
        .send({
          "username": "Naty",
          "password": "123456"
        });

      token = respostaLogin.body.user.token;
    });

    it('Devo receber 200 e o valor do meu saldo', async () => {

      const res = await request(app)
        .get('/users/balance')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('saldo');
      expect(res.body.saldo).to.be.a('number');
      expect(res.body.saldo).to.be.at.least(0);
    });

    it('Devo receber 200 e o valor do saldo ao consultar meu saldo', async () => {
      const res = await request(app)
        .get('/users/balance')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('username', 'Naty');
      expect(res.body).to.have.property('saldo');
      expect(res.body.saldo).to.be.a('number');
      expect(res.body.saldo).to.be.at.least(0);
    });

    it('Devo receber 200 ao recarregar meu saldo', async () => {
      const res = await request(app)
        .post('/users/recharge')
        .set('Authorization', `Bearer ${token}`)
        .send({
          "username": "Naty",
          "amount": 100
        });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('username', 'Naty');
      expect(res.body).to.have.property('saldo');
    })

    it('Devo receber 200 ao recarregar meu saldo e o saldo deve ser alterado', async () => {
      // Consulta saldo inicial
      const consultaInicial = await request(app)
        .get('/users/balance')
        .set('Authorization', `Bearer ${token}`);
      const saldoInicial = consultaInicial.body.saldo;
      console.log(`Saldo inicial: ${saldoInicial}`);

      // Realiza recarga
      const valorRecarga = 100;
      const res = await request(app)
        .post('/users/recharge')
        .set('Authorization', `Bearer ${token}`)
        .send({
          "username": "Naty",
          "amount": valorRecarga
        });
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('saldo');
      expect(res.body).to.have.property('username', 'Naty');

      // Consulta saldo após recarga
      const respostaConsulta = await request(app)
        .get('/users/balance')
        .set('Authorization', `Bearer ${token}`);
      console.log(`Saldo após recarga: ${respostaConsulta.body.saldo}`);
      expect(respostaConsulta.status).to.equal(200);
      expect(respostaConsulta.body).to.have.property('saldo');
      expect(respostaConsulta.body.saldo).to.equal(saldoInicial + valorRecarga);
    });
  });
});