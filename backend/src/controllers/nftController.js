const { nftService } = require('../services/nftService');

// Controlador de NFTs
const nftController = {
  // Criar novo NFT
  create: async (req, res, next) => {
    try {
      const { title, description, imageUrl, price, category, tags, aiGenerated, aiModel, aiPrompt } = req.body;
      
      // Validação básica
      if (!title || !description || !imageUrl || price === undefined) {
        return res.status(400).json({ message: 'Dados incompletos para criar NFT' });
      }
      
      // Criar NFT com o usuário atual como criador
      const nft = await nftService.create({
        title,
        description,
        imageUrl,
        price,
        creator: req.user._id,
        category: category || 'arte',
        tags: tags || [],
        aiGenerated: aiGenerated || false,
        aiModel: aiModel || '',
        aiPrompt: aiPrompt || ''
      });
      
      res.status(201).json(nft);
    } catch (error) {
      next(error);
    }
  },
  
  // Obter NFT por ID
  getById: async (req, res, next) => {
    try {
      const nft = await nftService.findById(req.params.id);
      
      if (!nft) {
        return res.status(404).json({ message: 'NFT não encontrado' });
      }
      
      res.json(nft);
    } catch (error) {
      next(error);
    }
  },
  
  // Listar NFTs com filtros
  list: async (req, res, next) => {
    try {
      const { 
        page = 1, 
        limit = 12, 
        creator, 
        owner, 
        forSale, 
        category, 
        minPrice, 
        maxPrice, 
        aiGenerated, 
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;
      
      // Construir objeto de filtros
      const filters = {};
      if (creator) filters.creator = creator;
      if (owner) filters.owner = owner;
      if (forSale !== undefined) filters.forSale = forSale === 'true';
      if (category) filters.category = category;
      if (minPrice !== undefined) filters.minPrice = Number(minPrice);
      if (maxPrice !== undefined) filters.maxPrice = Number(maxPrice);
      if (aiGenerated !== undefined) filters.aiGenerated = aiGenerated === 'true';
      if (search) filters.search = search;
      
      // Construir objeto de ordenação
      const sort = {};
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
      
      const result = await nftService.list(
        filters,
        Number(page),
        Number(limit),
        sort
      );
      
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
  
  // Atualizar NFT
  update: async (req, res, next) => {
    try {
      const { title, description, category, tags } = req.body;
      
      // Validação básica
      if (!title && !description && !category && !tags) {
        return res.status(400).json({ message: 'Nenhum dado fornecido para atualização' });
      }
      
      // Construir objeto de atualização
      const updateData = {};
      if (title) updateData.title = title;
      if (description) updateData.description = description;
      if (category) updateData.category = category;
      if (tags) updateData.tags = tags;
      
      // Atualizar NFT
      const nft = await nftService.update(
        req.params.id,
        req.user._id,
        updateData
      );
      
      res.json(nft);
    } catch (error) {
      if (error.message.includes('Apenas o proprietário')) {
        return res.status(403).json({ message: error.message });
      }
      next(error);
    }
  },
  
  // Comprar NFT
  purchase: async (req, res, next) => {
    try {
      const { sellerId } = req.body;
      
      if (!sellerId) {
        return res.status(400).json({ message: 'ID do vendedor é obrigatório' });
      }
      
      const nft = await nftService.purchase(
        req.params.id,
        req.user._id, // Comprador (usuário atual)
        sellerId
      );
      
      res.json(nft);
    } catch (error) {
      if (error.message.includes('não está à venda') || 
          error.message.includes('não é o proprietário') ||
          error.message.includes('já é o proprietário')) {
        return res.status(400).json({ message: error.message });
      }
      next(error);
    }
  },
  
  // Colocar NFT à venda ou remover da venda
  toggleForSale: async (req, res, next) => {
    try {
      const { forSale, price } = req.body;
      
      if (forSale === undefined) {
        return res.status(400).json({ message: 'Status de venda é obrigatório' });
      }
      
      const nft = await nftService.toggleForSale(
        req.params.id,
        req.user._id,
        forSale,
        price
      );
      
      res.json(nft);
    } catch (error) {
      if (error.message.includes('Apenas o proprietário')) {
        return res.status(403).json({ message: error.message });
      }
      next(error);
    }
  }
};

module.exports = nftController;