# API de Transferências e Usuários

Esta API permite registrar usuários, realizar login, consultar usuários e efetuar transferências de valores entre usuários. O banco de dados é em memória, ideal para estudos de automação e testes de API.

## Instalação

1. Clone o repositório ou copie os arquivos para seu ambiente local.
2. Instale as dependências:
   ```cmd
   npm install express swagger-ui-express
   ```

## Estrutura de Diretórios

- `controllers/` - Lógica das rotas
- `services/` - Regras de negócio
- `models/` - Dados em memória
- `app.js` - Configuração da aplicação
- `server.js` - Inicialização do servidor
- `swagger.json` - Documentação da API

## Como executar

```cmd
node server.js
```
A API estará disponível em `http://localhost:3000`.

## Documentação Swagger

Acesse `http://localhost:3000/api-docs` para visualizar e testar os endpoints via Swagger UI.

## Endpoints

- `POST /users/register` - Registro de usuário
- `POST /users/login` - Login de usuário
- `GET /users` - Consulta de usuários
- `POST /transfer` - Realiza transferência
- `GET /transfer` - Consulta transferências

## Regras de Negócio

- Login exige usuário e senha.
- Não é permitido registrar usuários duplicados.
- Transferências acima de R$ 5.000,00 só podem ser feitas para favorecidos.

## Testes

Para testar com Supertest, importe o `app.js` em seus testes sem executar o método `listen()`.

---

API criada para fins educacionais e de automação de testes.
