# COMPLETE FRONTEND COMPONENTS - COPY & PASTE READY

## 📁 ApplicationForm.jsx - Aquino, Leona's responsibility
**Location:** `/frontend/src/components/student/ApplicationForm.jsx`

```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { applicationService } from '../../services/api';
import '../../App.css';

const ApplicationForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    highSchoolName: '',
    highSchoolGpa: '',
    graduationYear: '',
    intendedMajor: '',
    extracurricularActivities: '',
    personalStatement: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await applicationService.createApplication(formData);
      setMessage({ 
        type: 'success', 
        text: 'Application submitted successfully!' 
      });
      
      // Redirect to application view after 2 seconds
      setTimeout(() => {
        navigate(`/student/applications`);
      }, 2000);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to submit application' 
      });
      setLoading(false);
    }
  };

  return (
    <div className="application-form-container">
      <h2>Submit Application</h2>
      <p className="subtitle">Please fill out all required fields carefully</p>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="application-form">
        <div className="section">
          <h3>Personal Information</h3>
          
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              placeholder="John Doe"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="john@example.com"
              />
            </div>

            <div className="form-group">
              <label>Phone *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+1234567890"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Date of Birth *</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Address *</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              rows="3"
              placeholder="Full address"
            />
          </div>
        </div>

        <div className="section">
          <h3>Academic Information</h3>
          
          <div className="form-group">
            <label>High School Name *</label>
            <input
              type="text"
              name="highSchoolName"
              value={formData.highSchoolName}
              onChange={handleChange}
              required
              placeholder="Name of your high school"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>High School GPA</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="4.0"
                name="highSchoolGpa"
                value={formData.highSchoolGpa}
                onChange={handleChange}
                placeholder="0.00 - 4.00"
              />
            </div>

            <div className="form-group">
              <label>Graduation Year *</label>
              <input
                type="number"
                min="2015"
                max="2030"
                name="graduationYear"
                value={formData.graduationYear}
                onChange={handleChange}
                required
                placeholder="2024"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Intended Major *</label>
            <input
              type="text"
              name="intendedMajor"
              value={formData.intendedMajor}
              onChange={handleChange}
              required
              placeholder="Computer Science"
            />
          </div>
        </div>

        <div className="section">
          <h3>Additional Information</h3>
          
          <div className="form-group">
            <label>Extracurricular Activities</label>
            <textarea
              name="extracurricularActivities"
              value={formData.extracurricularActivities}
              onChange={handleChange}
              rows="4"
              placeholder="Describe your extracurricular activities, volunteer work, sports, etc."
            />
          </div>

          <div className="form-group">
            <label>Personal Statement</label>
            <textarea
              name="personalStatement"
              value={formData.personalStatement}
              onChange={handleChange}
              rows="6"
              placeholder="Tell us about yourself, your goals, and why you want to attend our institution..."
            />
          </div>
        </div>

        <div className="button-group">
          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/student/dashboard')} 
            className="btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApplicationForm;
```

---

## 📁 ApplicationStatus.jsx
**Location:** `/frontend/src/components/student/ApplicationStatus.jsx`

```jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { applicationService } from '../../services/api';
import '../../App.css';

const ApplicationStatus = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await applicationService.getUserApplications();
      setApplications(response.data.applications);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      'submitted': 'badge-info',
      'under_review': 'badge-warning',
      'evaluated': 'badge-primary',
      'accepted': 'badge-success',
      'rejected': 'badge-danger'
    };
    return statusMap[status] || 'badge-default';
  };

  const formatStatus = (status) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="loading">Loading applications...</div>;
  }

  return (
    <div className="application-status-container">
      <div className="page-header">
        <h2>My Applications</h2>
        <button 
          onClick={() => navigate('/student/apply')} 
          className="btn-primary"
        >
          New Application
        </button>
      </div>

      {applications.length === 0 ? (
        <div className="empty-state">
          <p>You haven't submitted any applications yet.</p>
          <button 
            onClick={() => navigate('/student/apply')} 
            className="btn-primary"
          >
            Submit Your First Application
          </button>
        </div>
      ) : (
        <div className="applications-list">
          {applications.map((app) => (
            <div key={app.id} className="application-card">
              <div className="card-header">
                <h3>{app.intended_major}</h3>
                <span className={`badge ${getStatusBadgeClass(app.status)}`}>
                  {formatStatus(app.status)}
                </span>
              </div>
              
              <div className="card-body">
                <div className="info-row">
                  <span className="label">Full Name:</span>
                  <span>{app.full_name}</span>
                </div>
                <div className="info-row">
                  <span className="label">High School:</span>
                  <span>{app.high_school_name}</span>
                </div>
                <div className="info-row">
                  <span className="label">GPA:</span>
                  <span>{app.high_school_gpa || 'N/A'}</span>
                </div>
                <div className="info-row">
                  <span className="label">Submitted:</span>
                  <span>{formatDate(app.submitted_at)}</span>
                </div>
                {app.ai_score && (
                  <div className="info-row">
                    <span className="label">AI Score:</span>
                    <span className="score">{app.ai_score}/100</span>
                  </div>
                )}
              </div>

              <div className="card-footer">
                <button 
                  onClick={() => navigate(`/student/applications/${app.id}`)}
                  className="btn-secondary"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationStatus;
```

---

## 📁 DocumentUpload.jsx - Sulit, Alexandra's responsibility
**Location:** `/frontend/src/components/student/DocumentUpload.jsx`

```jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { documentService } from '../../services/api';
import '../../App.css';

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
    if (applicationId) {
      fetchDocuments();
    }
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
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ 
          type: 'error', 
          text: 'File size must be less than 5MB' 
        });
        return;
      }

      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/jpg',
        'image/png'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        setMessage({ 
          type: 'error', 
          text: 'Only PDF, DOC, DOCX, JPG, and PNG files are allowed' 
        });
        return;
      }

      setUploadForm({ ...uploadForm, file });
      setMessage({ type: '', text: '' });
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!uploadForm.file || !uploadForm.documentType) {
      setMessage({ 
        type: 'error', 
        text: 'Please select a file and document type' 
      });
      return;
    }

    setUploading(true);
    setMessage({ type: '', text: '' });

    try {
      const formData = new FormData();
      formData.append('document', uploadForm.file);
      formData.append('applicationId', applicationId);
      formData.append('documentType', uploadForm.documentType);

      await documentService.uploadDocument(formData);
      
      setMessage({ 
        type: 'success', 
        text: 'Document uploaded successfully!' 
      });
      
      // Reset form
      setUploadForm({ file: null, documentType: '' });
      document.getElementById('fileInput').value = '';
      
      // Refresh documents list
      fetchDocuments();
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to upload document' 
      });
    }

    setUploading(false);
  };

  const handleDelete = async (documentId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      await documentService.deleteDocument(documentId);
      setMessage({ 
        type: 'success', 
        text: 'Document deleted successfully' 
      });
      fetchDocuments();
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Failed to delete document' 
      });
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="document-upload-container">
      <h2>Document Upload</h2>
      
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="upload-section">
        <h3>Upload New Document</h3>
        <form onSubmit={handleUpload} className="upload-form">
          <div className="form-group">
            <label>Document Type *</label>
            <select
              value={uploadForm.documentType}
              onChange={(e) => setUploadForm({ ...uploadForm, documentType: e.target.value })}
              required
            >
              <option value="">Select document type</option>
              <option value="transcript">Academic Transcript</option>
              <option value="recommendation">Letter of Recommendation</option>
              <option value="id">Government ID</option>
              <option value="certificate">Certificate</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Choose File *</label>
            <input
              type="file"
              id="fileInput"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              required
            />
            <small>Max file size: 5MB. Allowed formats: PDF, DOC, DOCX, JPG, PNG</small>
          </div>

          {uploadForm.file && (
            <div className="file-preview">
              <strong>Selected file:</strong> {uploadForm.file.name} 
              ({formatFileSize(uploadForm.file.size)})
            </div>
          )}

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload Document'}
          </button>
        </form>
      </div>

      <div className="documents-section">
        <h3>Uploaded Documents</h3>
        {documents.length === 0 ? (
          <p className="empty-message">No documents uploaded yet.</p>
        ) : (
          <div className="documents-list">
            {documents.map((doc) => (
              <div key={doc.id} className="document-item">
                <div className="document-icon">
                  📄
                </div>
                <div className="document-info">
                  <strong>{doc.original_filename}</strong>
                  <div className="document-meta">
                    <span className="doc-type">{doc.document_type}</span>
                    <span>{formatFileSize(doc.file_size)}</span>
                    <span>{formatDate(doc.uploaded_at)}</span>
                  </div>
                </div>
                <div className="document-actions">
                  <button 
                    onClick={() => handleDelete(doc.id)}
                    className="btn-danger-small"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentUpload;
```

---

## 📁 Dashboard.jsx - Anievas, James' responsibility (Admin Dashboard)
**Location:** `/frontend/src/components/admin/Dashboard.jsx`

```jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services/api';
import '../../App.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchData();
  }, [filter]);

  const fetchData = async () => {
    try {
      const [appsResponse, statsResponse] = await Promise.all([
        adminService.getAllApplications({ status: filter !== 'all' ? filter : undefined }),
        adminService.getStatistics()
      ]);
      
      setApplications(appsResponse.data.applications);
      setStatistics(statsResponse.data.statistics);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      'submitted': 'badge-info',
      'under_review': 'badge-warning',
      'evaluated': 'badge-primary',
      'accepted': 'badge-success',
      'rejected': 'badge-danger'
    };
    return statusMap[status] || 'badge-default';
  };

  const formatStatus = (status) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="admin-dashboard-container">
      <h2>Admin Dashboard</h2>

      {statistics && (
        <div className="statistics-grid">
          <div className="stat-card">
            <h3>Total Applications</h3>
            <div className="stat-number">{statistics.totalApplications}</div>
          </div>
          <div className="stat-card">
            <h3>Submitted</h3>
            <div className="stat-number">{statistics.statusCounts.submitted}</div>
          </div>
          <div className="stat-card">
            <h3>Under Review</h3>
            <div className="stat-number">{statistics.statusCounts.under_review}</div>
          </div>
          <div className="stat-card">
            <h3>Evaluated</h3>
            <div className="stat-number">{statistics.statusCounts.evaluated}</div>
          </div>
          <div className="stat-card">
            <h3>Accepted</h3>
            <div className="stat-number stat-success">{statistics.statusCounts.accepted}</div>
          </div>
          <div className="stat-card">
            <h3>Average AI Score</h3>
            <div className="stat-number">{statistics.averageAIScore}</div>
          </div>
        </div>
      )}

      <div className="filter-section">
        <label>Filter by Status:</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All Applications</option>
          <option value="submitted">Submitted</option>
          <option value="under_review">Under Review</option>
          <option value="evaluated">Evaluated</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="applications-table-container">
        <h3>Applications List</h3>
        {applications.length === 0 ? (
          <p className="empty-message">No applications found.</p>
        ) : (
          <table className="applications-table">
            <thead>
              <tr>
                <th>Applicant Name</th>
                <th>Email</th>
                <th>Major</th>
                <th>GPA</th>
                <th>AI Score</th>
                <th>Status</th>
                <th>Submitted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id}>
                  <td>{app.full_name}</td>
                  <td>{app.users?.email || app.email}</td>
                  <td>{app.intended_major}</td>
                  <td>{app.high_school_gpa || 'N/A'}</td>
                  <td>
                    {app.ai_score ? (
                      <span className="score">{app.ai_score}/100</span>
                    ) : (
                      'Not evaluated'
                    )}
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(app.status)}`}>
                      {formatStatus(app.status)}
                    </span>
                  </td>
                  <td>{formatDate(app.submitted_at)}</td>
                  <td>
                    <button 
                      onClick={() => navigate(`/admin/applications/${app.id}`)}
                      className="btn-secondary-small"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
```

---

## 📁 ApplicationDetail.jsx - Anievas, James' responsibility
**Location:** `/frontend/src/components/admin/ApplicationDetail.jsx`

```jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminService, documentService } from '../../services/api';
import '../../App.css';

const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    fetchApplicationDetails();
  }, [id]);

  const fetchApplicationDetails = async () => {
    try {
      const response = await adminService.getApplicationDetails(id);
      setApplication(response.data.application);
      setDocuments(response.data.documents);
      setNewStatus(response.data.application.status);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching application:', error);
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!newStatus) return;

    try {
      await adminService.updateApplicationStatus(id, newStatus);
      setMessage({ 
        type: 'success', 
        text: 'Status updated successfully!' 
      });
      fetchApplicationDetails();
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Failed to update status' 
      });
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this application?')) {
      return;
    }

    try {
      await adminService.deleteApplication(id);
      setMessage({ 
        type: 'success', 
        text: 'Application deleted successfully' 
      });
      setTimeout(() => navigate('/admin/dashboard'), 1500);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Failed to delete application' 
      });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="loading">Loading application details...</div>;
  }

  if (!application) {
    return <div className="error">Application not found</div>;
  }

  return (
    <div className="application-detail-container">
      <button onClick={() => navigate('/admin/dashboard')} className="back-button">
        ← Back to Dashboard
      </button>

      <h2>Application Details</h2>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="detail-section">
        <h3>Applicant Information</h3>
        <div className="info-grid">
          <div className="info-item">
            <label>Full Name:</label>
            <span>{application.full_name}</span>
          </div>
          <div className="info-item">
            <label>Email:</label>
            <span>{application.email}</span>
          </div>
          <div className="info-item">
            <label>Phone:</label>
            <span>{application.phone}</span>
          </div>
          <div className="info-item">
            <label>Date of Birth:</label>
            <span>{formatDate(application.date_of_birth)}</span>
          </div>
          <div className="info-item">
            <label>Address:</label>
            <span>{application.address}</span>
          </div>
        </div>
      </div>

      <div className="detail-section">
        <h3>Academic Information</h3>
        <div className="info-grid">
          <div className="info-item">
            <label>High School:</label>
            <span>{application.high_school_name}</span>
          </div>
          <div className="info-item">
            <label>GPA:</label>
            <span>{application.high_school_gpa || 'Not provided'}</span>
          </div>
          <div className="info-item">
            <label>Graduation Year:</label>
            <span>{application.graduation_year}</span>
          </div>
          <div className="info-item">
            <label>Intended Major:</label>
            <span>{application.intended_major}</span>
          </div>
        </div>
      </div>

      <div className="detail-section">
        <h3>Additional Information</h3>
        <div className="info-item-full">
          <label>Extracurricular Activities:</label>
          <p>{application.extracurricular_activities || 'None provided'}</p>
        </div>
        <div className="info-item-full">
          <label>Personal Statement:</label>
          <p>{application.personal_statement || 'None provided'}</p>
        </div>
      </div>

      <div className="detail-section">
        <h3>Application Status</h3>
        <div className="status-update-form">
          <div className="form-group-inline">
            <label>Current Status:</label>
            <select 
              value={newStatus} 
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="submitted">Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="evaluated">Evaluated</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
            <button onClick={handleStatusUpdate} className="btn-primary">
              Update Status
            </button>
          </div>
        </div>
        
        <div className="info-grid">
          <div className="info-item">
            <label>Submitted:</label>
            <span>{formatDate(application.submitted_at)}</span>
          </div>
          {application.ai_score && (
            <div className="info-item">
              <label>AI Score:</label>
              <span className="score">{application.ai_score}/100</span>
            </div>
          )}
          {application.ai_ranking && (
            <div className="info-item">
              <label>AI Ranking:</label>
              <span>{application.ai_ranking}</span>
            </div>
          )}
        </div>
      </div>

      <div className="detail-section">
        <h3>Uploaded Documents ({documents.length})</h3>
        {documents.length === 0 ? (
          <p>No documents uploaded</p>
        ) : (
          <div className="documents-list-admin">
            {documents.map((doc) => (
              <div key={doc.id} className="document-item">
                <span>📄 {doc.original_filename}</span>
                <span className="doc-type">{doc.document_type}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="danger-zone">
        <h3>Danger Zone</h3>
        <button onClick={handleDelete} className="btn-danger">
          Delete Application
        </button>
      </div>
    </div>
  );
};

export default ApplicationDetail;
```

---

## 📁 App.jsx - Main routing component
**Location:** `/frontend/src/App.jsx`

```jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Auth components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Student components
import Profile from './components/student/Profile';
import ApplicationForm from './components/student/ApplicationForm';
import ApplicationStatus from './components/student/ApplicationStatus';
import DocumentUpload from './components/student/DocumentUpload';

// Admin components
import Dashboard from './components/admin/Dashboard';
import ApplicationDetail from './components/admin/ApplicationDetail';

import './App.css';

// Protected Route wrapper
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/student/dashboard" />;
  }

  return children;
};

// Navigation component
const Navigation = () => {
  const { user, logout, isAdmin, isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <nav className="navbar">
      <div className="nav-brand">Student Application System</div>
      <div className="nav-links">
        <span className="nav-user">
          {user?.firstName} {user?.lastName} ({isAdmin ? 'Admin' : 'Student'})
        </span>
        <button onClick={logout} className="btn-logout">
          Logout
        </button>
      </div>
    </nav>
  );
};

// Student Dashboard
const StudentDashboard = () => {
  return (
    <div className="dashboard-container">
      <h2>Student Dashboard</h2>
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>My Profile</h3>
          <p>View and update your personal information</p>
          <a href="/student/profile" className="btn-secondary">View Profile</a>
        </div>
        <div className="dashboard-card">
          <h3>My Applications</h3>
          <p>View status of your submitted applications</p>
          <a href="/student/applications" className="btn-secondary">View Applications</a>
        </div>
        <div className="dashboard-card">
          <h3>New Application</h3>
          <p>Submit a new application for admission</p>
          <a href="/student/apply" className="btn-primary">Apply Now</a>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app">
          <Navigation />
          <div className="main-content">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Student routes */}
              <Route
                path="/student/dashboard"
                element={
                  <ProtectedRoute>
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/apply"
                element={
                  <ProtectedRoute>
                    <ApplicationForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/applications"
                element={
                  <ProtectedRoute>
                    <ApplicationStatus />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/applications/:applicationId/documents"
                element={
                  <ProtectedRoute>
                    <DocumentUpload />
                  </ProtectedRoute>
                }
              />

              {/* Admin routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/applications/:id"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <ApplicationDetail />
                  </ProtectedRoute>
                }
              />

              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
```

---

## 📁 index.html
**Location:** `/frontend/index.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Student Application System</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

---

## 📁 main.jsx
**Location:** `/frontend/src/main.jsx`

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './App.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

---

## CONTINUE TO NEXT FILE FOR CSS...
