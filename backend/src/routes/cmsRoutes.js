const express = require('express');
const { 
  getAllCmsItems, 
  getCmsItemById, 
  createCmsItem, 
  updateCmsItem, 
  deleteCmsItem 
} = require('../controllers/cmsController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

// Rotas públicas
router.get('/', getAllCmsItems);
router.get('/:id', getCmsItemById);

// Rotas protegidas para administradores
router.use(protect);
router.use(restrictTo('admin'));

router.post('/', createCmsItem);
router.put('/:id', updateCmsItem);
router.delete('/:id', deleteCmsItem);

module.exports = router;