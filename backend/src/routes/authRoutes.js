const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Rotas públicas
router.post('/login', authController.login);
router.post('/register', authController.register);

// Rotas protegidas
router.get('/verify', authMiddleware.authenticate, authController.verifyToken);

module.exports = router;