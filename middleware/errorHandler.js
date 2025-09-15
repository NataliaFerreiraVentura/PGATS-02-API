// middleware/errorHandler.js
module.exports = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    const errorId = Date.now(); // pode trocar por UUID

    console.error('--- ERRO CAPTURADO ---');
    console.error('Mensagem:', err.message);
    if (process.env.NODE_ENV !== 'production') {
        console.error('Stack:', err.stack);
    }

    if (err.status && err.status !== 500) {
        res.status(err.status).json({ error: err.message });
    } else {
        // Se o erro lançado tem uma mensagem customizada, retorna ela
        res.status(500).json({
            error: err.message || 'Erro interno do servidor',
            errorId
        });
    }
};
