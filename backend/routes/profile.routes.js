const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile.controller');
const { authenticateToken } = require('../middleware/auth');

/**
 * @route   GET /api/profile/:userId
 * @desc    Get student profile
 * @access  Private
 */
router.get('/:userId', authenticateToken, profileController.getProfile);

/**
 * @route   PUT /api/profile/:userId
 * @desc    Update student profile
 * @access  Private
 */
router.put('/:userId', authenticateToken, profileController.updateProfile);

/**
 * @route   DELETE /api/profile/:userId
 * @desc    Delete student profile
 * @access  Private (Admin or Self)
 */
router.delete('/:userId', authenticateToken, profileController.deleteProfile);

module.exports = router;
