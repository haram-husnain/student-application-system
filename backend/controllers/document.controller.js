const supabase = require('../config/supabase');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp-randomstring-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    cb(null, `${nameWithoutExt}-${uniqueSuffix}${ext}`);
  }
});

// File filter to accept only specific file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/jpg',
    'image/png'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, DOCX, JPG, JPEG, and PNG files are allowed.'), false);
  }
};

// Configure multer upload
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
}).single('document'); // 'document' is the field name

/**
 * Upload a document for an application
 * POST /api/documents/upload
 */
const uploadDocument = async (req, res) => {
  upload(req, res, async (err) => {
    try {
      // Handle multer errors
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ 
            error: 'File too large. Maximum size is 5MB.' 
          });
        }
        return res.status(400).json({ 
          error: `Upload error: ${err.message}` 
        });
      } else if (err) {
        return res.status(400).json({ 
          error: err.message 
        });
      }

      // Check if file was uploaded
      if (!req.file) {
        return res.status(400).json({ 
          error: 'No file uploaded.' 
        });
      }

      const { applicationId, documentType } = req.body;
      const userId = req.user.id;
      const userRole = req.user.role;

      // Validation
      if (!applicationId || !documentType) {
        // Delete uploaded file if validation fails
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ 
          error: 'Application ID and document type are required.' 
        });
      }

      // Verify application exists and user has permission
      const { data: application, error: appError } = await supabase
        .from('applications')
        .select('user_id')
        .eq('id', applicationId)
        .single();

      if (appError || !application) {
        fs.unlinkSync(req.file.path);
        return res.status(404).json({ 
          error: 'Application not found.' 
        });
      }

      // Authorization check: students can only upload to their own applications
      if (userRole === 'student' && application.user_id !== userId) {
        fs.unlinkSync(req.file.path);
        return res.status(403).json({ 
          error: 'You can only upload documents to your own applications.' 
        });
      }

      // Save document metadata to database
      const { data: newDocument, error: docError } = await supabase
        .from('documents')
        .insert([
          {
            application_id: applicationId,
            document_type: documentType,
            original_filename: req.file.originalname,
            stored_filename: req.file.filename,
            file_path: req.file.path,
            file_size: req.file.size,
            mime_type: req.file.mimetype
          }
        ])
        .select()
        .single();

      if (docError) {
        console.error('Document save error:', docError);
        fs.unlinkSync(req.file.path);
        return res.status(500).json({ 
          error: 'Failed to save document information.' 
        });
      }

      res.status(201).json({
        message: 'Document uploaded successfully.',
        document: {
          id: newDocument.id,
          documentType: newDocument.document_type,
          originalFilename: newDocument.original_filename,
          fileSize: newDocument.file_size,
          uploadedAt: newDocument.uploaded_at
        }
      });

    } catch (error) {
      console.error('Upload document error:', error);
      // Clean up uploaded file if it exists
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({ 
        error: 'An error occurred while uploading the document.' 
      });
    }
  });
};

/**
 * Get all documents for an application
 * GET /api/documents/:applicationId
 */
const getDocumentsByApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Verify application exists and user has permission
    const { data: application, error: appError } = await supabase
      .from('applications')
      .select('user_id')
      .eq('id', applicationId)
      .single();

    if (appError || !application) {
      return res.status(404).json({ 
        error: 'Application not found.' 
      });
    }

    // Authorization check
    if (userRole === 'student' && application.user_id !== userId) {
      return res.status(403).json({ 
        error: 'You can only view documents for your own applications.' 
      });
    }

    // Fetch documents
    const { data: documents, error: docError } = await supabase
      .from('documents')
      .select('id, document_type, original_filename, file_size, mime_type, uploaded_at')
      .eq('application_id', applicationId)
      .order('uploaded_at', { ascending: false });

    if (docError) {
      console.error('Fetch documents error:', docError);
      return res.status(500).json({ 
        error: 'Failed to fetch documents.' 
      });
    }

    res.status(200).json({
      documents: documents || []
    });

  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ 
      error: 'An error occurred while fetching documents.' 
    });
  }
};

/**
 * Download a specific document
 * GET /api/documents/download/:documentId
 */
const downloadDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Fetch document details
    const { data: document, error: docError } = await supabase
      .from('documents')
      .select(`
        id,
        application_id,
        original_filename,
        stored_filename,
        file_path,
        mime_type,
        applications (user_id)
      `)
      .eq('id', documentId)
      .single();

    if (docError || !document) {
      return res.status(404).json({ 
        error: 'Document not found.' 
      });
    }

    // Authorization check
    if (userRole === 'student' && document.applications.user_id !== userId) {
      return res.status(403).json({ 
        error: 'You can only download documents from your own applications.' 
      });
    }

    // Check if file exists
    if (!fs.existsSync(document.file_path)) {
      return res.status(404).json({ 
        error: 'File not found on server.' 
      });
    }

    // Send file
    res.download(document.file_path, document.original_filename, (err) => {
      if (err) {
        console.error('File download error:', err);
        res.status(500).json({ 
          error: 'Failed to download file.' 
        });
      }
    });

  } catch (error) {
    console.error('Download document error:', error);
    res.status(500).json({ 
      error: 'An error occurred while downloading the document.' 
    });
  }
};

/**
 * Delete a document (admin only or document owner)
 * DELETE /api/documents/:documentId
 */
const deleteDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Fetch document details
    const { data: document, error: docError } = await supabase
      .from('documents')
      .select(`
        id,
        file_path,
        applications (user_id)
      `)
      .eq('id', documentId)
      .single();

    if (docError || !document) {
      return res.status(404).json({ 
        error: 'Document not found.' 
      });
    }

    // Authorization check
    if (userRole === 'student' && document.applications.user_id !== userId) {
      return res.status(403).json({ 
        error: 'You can only delete documents from your own applications.' 
      });
    }

    // Delete file from filesystem
    if (fs.existsSync(document.file_path)) {
      fs.unlinkSync(document.file_path);
    }

    // Delete document record from database
    const { error: deleteError } = await supabase
      .from('documents')
      .delete()
      .eq('id', documentId);

    if (deleteError) {
      console.error('Document deletion error:', deleteError);
      return res.status(500).json({ 
        error: 'Failed to delete document record.' 
      });
    }

    res.status(200).json({ 
      message: 'Document deleted successfully.' 
    });

  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ 
      error: 'An error occurred while deleting the document.' 
    });
  }
};

module.exports = {
  uploadDocument,
  getDocumentsByApplication,
  downloadDocument,
  deleteDocument
};
