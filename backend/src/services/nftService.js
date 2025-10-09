const NFT = require('../models/nftModel');

// Serviço para operações relacionadas a NFTs
const nftService = {
  // Criar novo NFT
  create: async (nftData) => {
    const nft = new NFT({
      ...nftData,
      // Inicialmente, o criador também é o proprietário
      owner: nftData.creator,
      // Adicionar primeira transação ao histórico (criação)
      transactionHistory: [{
        from: null, // Nulo porque é a criação
        to: nftData.creator,
        price: nftData.price
      }]
    });
    
    await nft.save();
    return nft;
  },
  
  // Encontrar NFT por ID
  findById: async (id) => {
    return await NFT.findById(id)
      .populate('creator', 'name email profileImage')
      .populate('owner', 'name email profileImage')
      .populate('transactionHistory.from', 'name email')
      .populate('transactionHistory.to', 'name email');
  },
  
  // Listar NFTs com filtros e paginação
  list: async (filters = {}, page = 1, limit = 12, sort = { createdAt: -1 }) => {
    const skip = (page - 1) * limit;
    
    // Construir query baseada nos filtros
    const query = {};
    
    if (filters.creator) query.creator = filters.creator;
    if (filters.owner) query.owner = filters.owner;
    if (filters.forSale !== undefined) query.forSale = filters.forSale;
    if (filters.category) query.category = filters.category;
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      query.price = {};
      if (filters.minPrice !== undefined) query.price.$gte = filters.minPrice;
      if (filters.maxPrice !== undefined) query.price.$lte = filters.maxPrice;
    }
    if (filters.aiGenerated !== undefined) query.aiGenerated = filters.aiGenerated;
    if (filters.search) {
      query.$text = { $search: filters.search };
    }
    
    // Executar query com paginação
    const nfts = await NFT.find(query)
      .populate('creator', 'name email profileImage')
      .populate('owner', 'name email profileImage')
      .skip(skip)
      .limit(limit)
      .sort(sort);
      
    const total = await NFT.countDocuments(query);
    
    return {
      nfts,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    };
  },
  
  // Atualizar NFT
  update: async (id, userId, updateData) => {
    // Verificar se o NFT existe e se o usuário é o proprietário
    const nft = await NFT.findById(id);
    
    if (!nft) {
      throw new Error('NFT não encontrado');
    }
    
    if (nft.owner.toString() !== userId) {
      throw new Error('Apenas o proprietário pode atualizar o NFT');
    }
    
    // Não permitir alteração de creator ou transactionHistory
    delete updateData.creator;
    delete updateData.transactionHistory;
    
    // Atualizar NFT
    return await NFT.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: Date.now() },
      { new: true, runValidators: true }
    )
    .populate('creator', 'name email profileImage')
    .populate('owner', 'name email profileImage');
  },
  
  // Comprar NFT
  purchase: async (id, buyerId, sellerId) => {
    // Verificar se o NFT existe
    const nft = await NFT.findById(id);
    
    if (!nft) {
      throw new Error('NFT não encontrado');
    }
    
    // Verificar se o NFT está à venda
    if (!nft.forSale) {
      throw new Error('Este NFT não está à venda');
    }
    
    // Verificar se o vendedor é o proprietário atual
    if (nft.owner.toString() !== sellerId) {
      throw new Error('O vendedor não é o proprietário atual do NFT');
    }
    
    // Verificar se o comprador não é o proprietário atual
    if (nft.owner.toString() === buyerId) {
      throw new Error('Você já é o proprietário deste NFT');
    }
    
    // Atualizar proprietário e adicionar transação ao histórico
    return await NFT.findByIdAndUpdate(
      id,
      {
        owner: buyerId,
        forSale: false, // Após a compra, o NFT não está mais à venda
        $push: {
          transactionHistory: {
            from: sellerId,
            to: buyerId,
            price: nft.price,
            date: Date.now()
          }
        },
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    )
    .populate('creator', 'name email profileImage')
    .populate('owner', 'name email profileImage')
    .populate('transactionHistory.from', 'name email')
    .populate('transactionHistory.to', 'name email');
  },
  
  // Colocar NFT à venda ou remover da venda
  toggleForSale: async (id, userId, forSale, price) => {
    // Verificar se o NFT existe
    const nft = await NFT.findById(id);
    
    if (!nft) {
      throw new Error('NFT não encontrado');
    }
    
    // Verificar se o usuário é o proprietário
    if (nft.owner.toString() !== userId) {
      throw new Error('Apenas o proprietário pode alterar o status de venda');
    }
    
    // Atualizar status de venda e preço (se fornecido)
    const updateData = { forSale };
    if (price !== undefined) {
      updateData.price = price;
    }
    
    return await NFT.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: Date.now() },
      { new: true, runValidators: true }
    )
    .populate('creator', 'name email profileImage')
    .populate('owner', 'name email profileImage');
  }
};

module.exports = { nftService };