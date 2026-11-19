/**
 * Public Card Routes (Recipient-facing)
 */

const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardController');

router.get('/:slug', cardController.getPublicCard);
router.post('/:slug/verify', cardController.verifyPasscode);

module.exports = router;
