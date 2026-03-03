const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

/**
 * @route   POST /api/ai/evaluate/:applicationId
 * @desc    Evaluate single application with AI
 * @access  Private (Admin only)
 */
router.post('/evaluate/:applicationId', authenticateToken, requireAdmin, aiController.evaluateApplication);

/**
 * @route   POST /api/ai/evaluate-all
 * @desc    Evaluate all pending applications
 * @access  Private (Admin only)
 */
router.post('/evaluate-all', authenticateToken, requireAdmin, aiController.evaluateAllApplications);

module.exports = router;
