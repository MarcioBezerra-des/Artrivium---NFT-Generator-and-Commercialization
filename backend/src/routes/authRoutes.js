const express = require('express');
const { login, register } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Rotas públicas de autenticação
router.post('/login', login);
router.post('/register', register);

// Rota protegida para verificar o status da autenticação
router.get('/me', protect, (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
});

module.exports = router;