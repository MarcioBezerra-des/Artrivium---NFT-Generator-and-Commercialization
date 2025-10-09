const jwt = require('jsonwebtoken');
const { userService } = require('../services/userService');

// Middleware para verificar autenticação
const authMiddleware = {
  // Verificar se o usuário está autenticado
  authenticate: async (req, res, next) => {
    try {
      // Verificar se o token está presente no header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Acesso não autorizado. Token não fornecido' });
      }
      
      // Extrair o token
      const token = authHeader.split(' ')[1];
      
      // Verificar e decodificar o token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Buscar o usuário pelo ID
      const user = await userService.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ message: 'Usuário não encontrado ou token inválido' });
      }
      
      // Adicionar o usuário ao objeto de requisição
      req.user = user;
      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Token inválido' });
      }
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expirado' });
      }
      next(error);
    }
  },
  
  // Verificar se o usuário é admin
  isAdmin: (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acesso negado. Permissão de administrador necessária' });
    }
    next();
  }
};

module.exports = authMiddleware;