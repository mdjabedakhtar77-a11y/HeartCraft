/**
 * Card Routes
 */

const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardController');
const { authMiddleware, optionalAuthMiddleware } = require('../middleware/authMiddleware');

// Creator & User Cards Endpoints
router.get('/my/cards', authMiddleware, cardController.getUserCards);
router.post('/', optionalAuthMiddleware, cardController.createCardDraft);
router.get('/:id', cardController.getCardDetails);
router.put('/:id', cardController.updateCard);
router.post('/:id/preview', cardController.generatePreview);
router.post('/:id/publish', cardController.publishCard);
router.post('/:id/share', cardController.generateShare);
router.get('/:id/qr', cardController.getQrCode);

module.exports = router;
