const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const userController = require('./controllers/userController');
const transferController = require('./controllers/transferController');
const authHS256 = require('./middleware/authHS256');

const app = express();
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/users', userController);
app.use('/transfer', authHS256, transferController);

module.exports = app;
