/**
 * Middleware para tratamento de erros
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  
  res.status(statusCode).json({
    success: false,
    error: {
      message: err.message || 'Erro interno do servidor',
      stack: process.env.NODE_ENV === 'production' ? null : err.stack
    }
  });
};

module.exports = { errorHandler };