const mongoose = require('mongoose');

const cmsSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['banner', 'featured', 'text', 'section'],
    required: true
  },
  location: {
    type: String,
    required: true,
    enum: ['home', 'marketplace', 'generator', 'gallery', 'global']
  },
  title: {
    type: String,
    trim: true
  },
  content: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String
  },
  active: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Atualizar timestamp antes de salvar
cmsSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const CMS = mongoose.model('CMS', cmsSchema);

module.exports = CMS;