/**
 * Admin Routes
 * Protected by authMiddleware and adminMiddleware.
 */

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const templateController = require('../controllers/templateController');
const { authMiddleware } = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Enforce admin guard on all routes in this router
router.use(authMiddleware, adminMiddleware);

// Analytics & KPIs
router.get('/stats', adminController.getDashboardStats);
router.get('/customers', adminController.getCustomers);
router.get('/reviews', adminController.getReviews);

// Template Management
router.post('/templates', templateController.createTemplate);
router.put('/templates/:id', templateController.updateTemplate);
router.delete('/templates/:id', templateController.deleteTemplate);
router.patch('/templates/:id/toggle', adminController.toggleTemplateStatus);

module.exports = router;
