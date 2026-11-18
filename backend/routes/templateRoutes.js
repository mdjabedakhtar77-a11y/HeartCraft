/**
 * Template Routes
 */

const express = require('express');
const router = express.Router();
const templateController = require('../controllers/templateController');

router.get('/', templateController.getAllTemplates);
router.get('/category/:type', templateController.getByCategory);
router.get('/:id', templateController.getTemplateById);

module.exports = router;
