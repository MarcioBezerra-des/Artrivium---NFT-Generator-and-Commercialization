const express = require('express');
const nftController = require('../controllers/nftController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Rotas públicas
router.get('/', nftController.list);
router.get('/:id', nftController.getById);

// Rotas protegidas
router.post('/', authMiddleware.authenticate, nftController.create);
router.put('/:id', authMiddleware.authenticate, nftController.update);
router.post('/:id/purchase', authMiddleware.authenticate, nftController.purchase);
router.put('/:id/toggle-sale', authMiddleware.authenticate, nftController.toggleForSale);

module.exports = router;