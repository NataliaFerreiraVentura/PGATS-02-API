const { gql } = require('apollo-server-express');

module.exports = gql`
  type User {
    username: String!
    saldo: Float!
    favorecidos: [String]
  }

  type AuthUser {
    username: String!
    saldo: Float!
    favorecidos: [String]
    token: String!
  }

  type Transfer {
    from: String!
    to: String!
    valor: Float!
    date: String!
  }

  type UserBalanceResult {
    username: String!
    saldo: Float!
  }

  type Query {
    users: [User]
    userBalance(username: String!): UserBalanceResult
    transfers: [Transfer]
  }

  type Mutation {
    registerUser(username: String!, password: String!, favorecidos: [String]): User
    loginUser(username: String!, password: String!): AuthUser
    rechargeCredit(username: String!, valor: Float!): RechargeResult
    transfer(from: String!, to: String!, valor: Float!): Transfer
  }

  type RechargeResult {
    username: String!
    saldo: Float!
  }
`;
