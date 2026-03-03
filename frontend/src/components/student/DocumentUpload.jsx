import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { documentService } from '../../services/api';

const DocumentUpload = () => {
  const { applicationId } = useParams();
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [uploadForm, setUploadForm] = useState({
    file: null,
    documentType: ''
  });

  useEffect(() => {
    if (applicationId) fetchDocuments();
  }, [applicationId]);

  const fetchDocuments = async () => {
    try {
      const response = await documentService.getDocumentsByApplication(applicationId);
      setDocuments(response.data.documents);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'File size must be less than 5MB' });
        return;
      }
      setUploadForm({ ...uploadForm, file });
      setMessage({ type: '', text: '' });
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!uploadForm.file || !uploadForm.documentType) {
      setMessage({ type: 'error', text: 'Please select a file and document type' });
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('document', uploadForm.file);
      formData.append('applicationId', applicationId);
      formData.append('documentType', uploadForm.documentType);

      await documentService.uploadDocument(formData);
      setMessage({ type: 'success', text: 'Document uploaded successfully!' });
      setUploadForm({ file: null, documentType: '' });
      document.getElementById('fileInput').value = '';
      fetchDocuments();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to upload document' });
    }
    setUploading(false);
  };

  const handleDelete = async (documentId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;

    try {
      await documentService.deleteDocument(documentId);
      setMessage({ type: 'success', text: 'Document deleted successfully' });
      fetchDocuments();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete document' });
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div style={{padding: '2rem', maxWidth: '900px', margin: '0 auto'}}>
      <h2>Document Upload</h2>
      
      {message.text && (
        <div style={{padding: '1rem', marginBottom: '1rem', background: message.type === 'success' ? '#d1fae5' : '#fee2e2', borderRadius: '8px'}}>
          {message.text}
        </div>
      )}

      <div style={{background: 'white', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid #e5e7eb'}}>
        <h3>Upload New Document</h3>
        <form onSubmit={handleUpload}>
          <div style={{marginBottom: '1rem'}}>
            <label>Document Type *</label>
            <select
              value={uploadForm.documentType}
              onChange={(e) => setUploadForm({ ...uploadForm, documentType: e.target.value })}
              required
              style={{width: '100%', padding: '0.5rem'}}
            >
              <option value="">Select document type</option>
              <option value="transcript">Academic Transcript</option>
              <option value="recommendation">Letter of Recommendation</option>
              <option value="id">Government ID</option>
              <option value="certificate">Certificate</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div style={{marginBottom: '1rem'}}>
            <label>Choose File *</label>
            <input
              type="file"
              id="fileInput"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              required
              style={{width: '100%', padding: '0.5rem'}}
            />
            <small>Max file size: 5MB. Allowed formats: PDF, DOC, DOCX, JPG, PNG</small>
          </div>

          {uploadForm.file && (
            <div style={{padding: '0.5rem', background: '#f3f4f6', borderRadius: '4px', marginBottom: '1rem'}}>
              <strong>Selected file:</strong> {uploadForm.file.name} ({formatFileSize(uploadForm.file.size)})
            </div>
          )}

          <button type="submit" disabled={uploading} style={{padding: '0.5rem 1rem', cursor: 'pointer'}}>
            {uploading ? 'Uploading...' : 'Upload Document'}
          </button>
        </form>
      </div>

      <div>
        <h3>Uploaded Documents</h3>
        {documents.length === 0 ? (
          <p>No documents uploaded yet.</p>
        ) : (
          <div style={{display: 'grid', gap: '1rem'}}>
            {documents.map((doc) => (
              <div key={doc.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#f9fafb', borderRadius: '8px'}}>
                <div>
                  <div><strong>{doc.original_filename}</strong></div>
                  <div style={{fontSize: '0.875rem', color: '#6b7280'}}>
                    {doc.document_type} • {formatFileSize(doc.file_size)}
                  </div>
                </div>
                <button onClick={() => handleDelete(doc.id)} style={{padding: '0.5rem 1rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentUpload;
