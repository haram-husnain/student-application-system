const express = require('express');
const router = express.Router();
const documentController = require('../controllers/document.controller');
const { authenticateToken } = require('../middleware/auth');

/**
 * @route   POST /api/documents/upload
 * @desc    Upload a document for an application
 * @access  Private
 */
router.post('/upload', authenticateToken, documentController.uploadDocument);

/**
 * @route   GET /api/documents/:applicationId
 * @desc    Get all documents for an application
 * @access  Private
 */
router.get('/:applicationId', authenticateToken, documentController.getDocumentsByApplication);

/**
 * @route   GET /api/documents/download/:documentId
 * @desc    Download a specific document
 * @access  Private
 */
router.get('/download/:documentId', authenticateToken, documentController.downloadDocument);

/**
 * @route   DELETE /api/documents/:documentId
 * @desc    Delete a document
 * @access  Private
 */
router.delete('/:documentId', authenticateToken, documentController.deleteDocument);

module.exports = router;
