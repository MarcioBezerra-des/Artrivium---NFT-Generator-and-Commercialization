const mongoose = require('mongoose');

const nftSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Título é obrigatório'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Descrição é obrigatória'],
    trim: true
  },
  imageUrl: {
    type: String,
    required: [true, 'URL da imagem é obrigatória']
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Criador é obrigatório']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Proprietário é obrigatório']
  },
  price: {
    type: Number,
    required: [true, 'Preço é obrigatório'],
    min: [0, 'Preço não pode ser negativo']
  },
  forSale: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    enum: ['arte', 'fotografia', 'música', 'vídeo', 'colecionável', 'outro'],
    default: 'arte'
  },
  tags: [{
    type: String,
    trim: true
  }],
  aiGenerated: {
    type: Boolean,
    default: false
  },
  aiModel: {
    type: String,
    default: ''
  },
  aiPrompt: {
    type: String,
    default: ''
  },
  transactionHistory: [{
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    price: {
      type: Number
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Índices para melhorar a performance das consultas
nftSchema.index({ title: 'text', description: 'text', tags: 'text' });
nftSchema.index({ creator: 1 });
nftSchema.index({ owner: 1 });
nftSchema.index({ forSale: 1, price: 1 });
nftSchema.index({ category: 1 });

const NFT = mongoose.model('NFT', nftSchema);

module.exports = NFT;