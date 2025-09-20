const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

// JWT middleware for GraphQL context
const getUserFromToken = (token) => {
    if (!token) return null;
    try {
        return jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET || 'X9f8H7j6K5l4M3n2P1q0R9s8T7v6W5z4', { algorithms: ['HS256'] });
    } catch {
        return null;
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        const token = req.headers.authorization || '';
        const user = getUserFromToken(token);
        return { user };
    },
});

async function startApollo() {
    await server.start();
    server.applyMiddleware({ app });
}

startApollo();

module.exports = app;
