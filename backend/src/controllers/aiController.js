const { createAIService } = require('../services/aiService');

// Criar uma instância do serviço de IA com base nas variáveis de ambiente
const getAIService = () => {
  const provider = process.env.AI_PROVIDER || 'openai';
  const apiKey = process.env.AI_API_KEY || 'dummy-key';
  
  return createAIService(provider, apiKey);
};

// Gerar imagem com IA
exports.generateImage = async (req, res, next) => {
  try {
    const { prompt, options } = req.body;
    
    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: 'O prompt é obrigatório para gerar uma imagem'
      });
    }
    
    const aiService = getAIService();
    const result = await aiService.generateImage(prompt, options);
    
    res.status(200).json({
      success: true,
      data: result.data
    });
  } catch (error) {
    next(error);
  }
};

// Obter informações sobre os provedores de IA disponíveis
exports.getAIProviders = async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      currentProvider: process.env.AI_PROVIDER || 'openai',
      availableProviders: ['openai', 'stablediffusion']
    }
  });
};