const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { userService } = require('../services/userService');

// Controlador de autenticação
const authController = {
  // Login de usuário
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      
      // Validação básica
      if (!email || !password) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios' });
      }
      
      // Buscar usuário pelo email
      const user = await userService.findByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }
      
      // Verificar senha
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }
      
      // Gerar token JWT
      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      // Retornar dados do usuário e token
      res.json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      });
    } catch (error) {
      next(error);
    }
  },
  
  // Registro de novo usuário
  register: async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      
      // Validação básica
      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Nome, email e senha são obrigatórios' });
      }
      
      // Verificar se o email já está em uso
      const existingUser = await userService.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'Este email já está em uso' });
      }
      
      // Criar novo usuário
      const newUser = await userService.create({
        name,
        email,
        password,
        role: 'user' // Por padrão, todos os novos usuários são do tipo 'user'
      });
      
      // Gerar token JWT
      const token = jwt.sign(
        { id: newUser._id, email: newUser.email, role: newUser.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      // Retornar dados do usuário e token
      res.status(201).json({
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role
        },
        token
      });
    } catch (error) {
      next(error);
    }
  },
  
  // Verificar token atual
  verifyToken: async (req, res) => {
    // O middleware de autenticação já verificou o token
    // Apenas retornar os dados do usuário
    res.json({
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role
      }
    });
  }
};

module.exports = authController;