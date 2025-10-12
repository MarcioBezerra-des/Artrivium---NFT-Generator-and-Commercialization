const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

// Gerar token JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Controlador de autenticação
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    
    // Verificar se o usuário já existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email já está em uso'
      });
    }
    
    // Criar novo usuário
    const user = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 12)
    });
    
    // Gerar token
    const token = generateToken(user);
    
    // Enviar resposta
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// Login de usuário
exports.login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      
      // Validação básica
      if (!email || !password) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios' });
      }
      
      // Buscar usuário pelo email
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({ 
          success: false,
          message: 'Credenciais inválidas' 
        });
      }
      
      // Verificar senha
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ 
          success: false,
          message: 'Credenciais inválidas' 
        });
      }
      
      // Gerar token JWT
      const token = generateToken(user);
      
      // Retornar dados do usuário e token
      res.json({
        success: true,
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