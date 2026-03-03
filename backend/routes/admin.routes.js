const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

/**
 * @route   GET /api/admin/applications
 * @desc    Get all applications (with optional status filter)
 * @access  Private (Admin only)
 */
router.get('/applications', authenticateToken, requireAdmin, adminController.getAllApplications);

/**
 * @route   GET /api/admin/statistics
 * @desc    Get application statistics
 * @access  Private (Admin only)
 */
router.get('/statistics', authenticateToken, requireAdmin, adminController.getStatistics);

/**
 * @route   GET /api/admin/applications/:applicationId
 * @desc    Get single application details
 * @access  Private (Admin only)
 */
router.get('/applications/:applicationId', authenticateToken, requireAdmin, adminController.getApplicationDetails);

/**
 * @route   PUT /api/admin/applications/:applicationId/status
 * @desc    Update application status
 * @access  Private (Admin only)
 */
router.put('/applications/:applicationId/status', authenticateToken, requireAdmin, adminController.updateApplicationStatus);

/**
 * @route   DELETE /api/admin/applications/:applicationId
 * @desc    Delete application
 * @access  Private (Admin only)
 */
router.delete('/applications/:applicationId', authenticateToken, requireAdmin, adminController.deleteApplication);

module.exports = router;
