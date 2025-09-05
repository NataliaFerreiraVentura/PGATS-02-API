// middleware/errorHandler.js
module.exports = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    if (err.status && err.status !== 500) {
        res.status(err.status).json({ error: err.message });
    } else {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};
