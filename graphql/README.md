# API GraphQL

Esta API GraphQL expõe os serviços de Usuários e Transferências usando ApolloServer e Express.

## Como executar

1. Instale as dependências (use express@4.18.2 para compatibilidade):
   ```bash
   npm install express@4.18.2 apollo-server-express graphql jsonwebtoken bcryptjs
   ```
2. Execute o servidor:
   ```bash
   node graphql/server.js
   ```
3. Acesse o playground GraphQL em: [http://localhost:4000/graphql](http://localhost:4000/graphql)

## Autenticação
- Para Mutations de transferência e recarga, envie o header:
  ```
  Authorization: Bearer <token>
  ```
  O token é obtido via mutation `loginUser`.

## Estrutura
- Toda a API GraphQL está na pasta `graphql`.
- O arquivo `app.js` exporta o app Express sem listen, para facilitar testes.
- O arquivo `server.js` faz o listen.
- Types, Queries e Mutations foram definidos com base nos testes da API Rest.

## Bibliotecas necessárias
- apollo-server-express
- express
- graphql
- jsonwebtoken
- bcryptjs

## Observações
- As Mutations de Transfer exigem autenticação JWT.
- Os Types e métodos refletem os dados e regras dos testes REST.
