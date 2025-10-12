const express = require('express');
const { generateImage, getAIProviders } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Rotas protegidas
router.use(protect);

// Rotas para geração de imagens com IA
router.post('/generate', generateImage);
router.get('/providers', getAIProviders);

module.exports = router;