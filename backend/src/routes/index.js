const express = require('express');
const authRoutes = require('./authRoutes');
const nftRoutes = require('./nftRoutes');
const aiRoutes = require('./aiRoutes');
const cmsRoutes = require('./cmsRoutes');

const router = express.Router();

// Rota de status/saúde da API
router.get('/status', (req, res) => {
  res.json({ status: 'online', timestamp: new Date() });
});

// Registrar rotas
router.use('/auth', authRoutes);
router.use('/nfts', nftRoutes);
router.use('/ai', aiRoutes);
router.use('/cms', cmsRoutes);

module.exports = router;