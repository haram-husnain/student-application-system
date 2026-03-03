const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/application.controller');
const { authenticateToken, requireStudent } = require('../middleware/auth');

/**
 * @route   POST /api/applications
 * @desc    Create a new application
 * @access  Private (Student only)
 */
router.post('/', authenticateToken, requireStudent, applicationController.createApplication);

/**
 * @route   GET /api/applications
 * @desc    Get all applications for current user
 * @access  Private (Student only)
 */
router.get('/', authenticateToken, requireStudent, applicationController.getUserApplications);

/**
 * @route   GET /api/applications/:id
 * @desc    Get specific application by ID
 * @access  Private
 */
router.get('/:id', authenticateToken, applicationController.getApplicationById);

/**
 * @route   PUT /api/applications/:id
 * @desc    Update an application
 * @access  Private
 */
router.put('/:id', authenticateToken, applicationController.updateApplication);

/**
 * @route   DELETE /api/applications/:id
 * @desc    Delete an application
 * @access  Private (Admin only)
 */
router.delete('/:id', authenticateToken, applicationController.deleteApplication);

module.exports = router;
