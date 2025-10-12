const CMS = require('../models/cmsModel');

// Obter todos os itens CMS
exports.getAllCmsItems = async (req, res, next) => {
  try {
    const { location, type, active } = req.query;
    const filter = {};
    
    if (location) filter.location = location;
    if (type) filter.type = type;
    if (active !== undefined) filter.active = active === 'true';
    
    const cmsItems = await CMS.find(filter).sort({ order: 1 });
    
    res.status(200).json({
      success: true,
      count: cmsItems.length,
      data: cmsItems
    });
  } catch (error) {
    next(error);
  }
};

// Obter um item CMS por ID
exports.getCmsItemById = async (req, res, next) => {
  try {
    const cmsItem = await CMS.findById(req.params.id);
    
    if (!cmsItem) {
      return res.status(404).json({
        success: false,
        error: 'Item CMS não encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      data: cmsItem
    });
  } catch (error) {
    next(error);
  }
};

// Criar um novo item CMS
exports.createCmsItem = async (req, res, next) => {
  try {
    // Adicionar o ID do usuário como criador
    req.body.createdBy = req.user.id;
    req.body.updatedBy = req.user.id;
    
    const cmsItem = await CMS.create(req.body);
    
    res.status(201).json({
      success: true,
      data: cmsItem
    });
  } catch (error) {
    next(error);
  }
};

// Atualizar um item CMS
exports.updateCmsItem = async (req, res, next) => {
  try {
    // Adicionar o ID do usuário como atualizador
    req.body.updatedBy = req.user.id;
    req.body.updatedAt = Date.now();
    
    const cmsItem = await CMS.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!cmsItem) {
      return res.status(404).json({
        success: false,
        error: 'Item CMS não encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      data: cmsItem
    });
  } catch (error) {
    next(error);
  }
};

// Excluir um item CMS
exports.deleteCmsItem = async (req, res, next) => {
  try {
    const cmsItem = await CMS.findByIdAndDelete(req.params.id);
    
    if (!cmsItem) {
      return res.status(404).json({
        success: false,
        error: 'Item CMS não encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};