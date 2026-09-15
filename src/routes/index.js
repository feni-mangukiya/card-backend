const express = require('express');
const { createSpin, getSpinsBySession } = require('../controllers/spinController');
const { createFinalGift, getFinalGiftBySession } = require('../controllers/finalGiftController');
const { getAdminStats, getAdminSpins, getAdminUsers, getAdminFinalGifts } = require('../controllers/adminController');
const { requireAdminKey } = require('../middleware/adminAuth');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Backend is healthy.',
    timestamp: new Date().toISOString()
  });
});

router.post('/spins', createSpin);
router.get('/spins/:sessionId', getSpinsBySession);
router.post('/final-gift', createFinalGift);
router.get('/final-gift/:sessionId', getFinalGiftBySession);

router.get('/admin/stats', requireAdminKey, getAdminStats);
router.get('/admin/spins', requireAdminKey, getAdminSpins);
router.get('/admin/users', requireAdminKey, getAdminUsers);
router.get('/admin/final-gifts', requireAdminKey, getAdminFinalGifts);

module.exports = router;
