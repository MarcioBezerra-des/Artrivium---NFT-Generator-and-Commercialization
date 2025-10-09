const User = require('../models/userModel');

// Serviço para operações relacionadas a usuários
const userService = {
  // Encontrar usuário por ID
  findById: async (id) => {
    return await User.findById(id).select('-password');
  },
  
  // Encontrar usuário por email
  findByEmail: async (email) => {
    return await User.findOne({ email }).select('+password');
  },
  
  // Criar novo usuário
  create: async (userData) => {
    const user = new User(userData);
    await user.save();
    return user;
  },
  
  // Atualizar usuário existente
  update: async (id, updateData) => {
    // Não permitir atualização de role através deste método
    if (updateData.role) {
      delete updateData.role;
    }
    
    return await User.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).select('-password');
  },
  
  // Listar todos os usuários (com paginação)
  list: async (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    
    const users = await User.find()
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
      
    const total = await User.countDocuments();
    
    return {
      users,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    };
  },
  
  // Excluir usuário
  delete: async (id) => {
    return await User.findByIdAndDelete(id);
  },
  
  // Alterar senha do usuário
  changePassword: async (id, currentPassword, newPassword) => {
    const user = await User.findById(id).select('+password');
    
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
    
    // Verificar senha atual
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw new Error('Senha atual incorreta');
    }
    
    // Atualizar senha
    user.password = newPassword;
    await user.save();
    
    return { success: true };
  },
  
  // Alterar role do usuário (apenas admin pode fazer isso)
  changeRole: async (id, newRole) => {
    if (!['user', 'admin'].includes(newRole)) {
      throw new Error('Role inválida');
    }
    
    return await User.findByIdAndUpdate(
      id,
      { role: newRole, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).select('-password');
  }
};

module.exports = { userService };