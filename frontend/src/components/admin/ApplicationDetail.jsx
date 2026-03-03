import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminService } from '../../services/api';

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
      setMessage({ type: 'success', text: 'Status updated successfully!' });
      fetchApplicationDetails();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update status' });
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this application?')) return;

    try {
      await adminService.deleteApplication(id);
      setMessage({ type: 'success', text: 'Application deleted successfully' });
      setTimeout(() => navigate('/admin/dashboard'), 1500);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete application' });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) return <div style={{padding: '2rem'}}>Loading application details...</div>;
  if (!application) return <div style={{padding: '2rem'}}>Application not found</div>;

  return (
    <div style={{padding: '2rem', maxWidth: '1000px', margin: '0 auto'}}>
      <button onClick={() => navigate('/admin/dashboard')} style={{marginBottom: '1rem', padding: '0.5rem 1rem', cursor: 'pointer'}}>
        ← Back to Dashboard
      </button>

      <h2>Application Details</h2>

      {message.text && (
        <div style={{padding: '1rem', marginBottom: '1rem', background: message.type === 'success' ? '#d1fae5' : '#fee2e2', borderRadius: '8px'}}>
          {message.text}
        </div>
      )}

      <div style={{background: 'white', padding: '1.5rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #e5e7eb'}}>
        <h3>Applicant Information</h3>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem'}}>
          <div><strong>Full Name:</strong> {application.full_name}</div>
          <div><strong>Email:</strong> {application.email}</div>
          <div><strong>Phone:</strong> {application.phone}</div>
          <div><strong>Date of Birth:</strong> {formatDate(application.date_of_birth)}</div>
          <div style={{gridColumn: '1 / -1'}}><strong>Address:</strong> {application.address}</div>
        </div>
      </div>

      <div style={{background: 'white', padding: '1.5rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #e5e7eb'}}>
        <h3>Academic Information</h3>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem'}}>
          <div><strong>High School:</strong> {application.high_school_name}</div>
          <div><strong>GPA:</strong> {application.high_school_gpa || 'Not provided'}</div>
          <div><strong>Graduation Year:</strong> {application.graduation_year}</div>
          <div><strong>Intended Major:</strong> {application.intended_major}</div>
        </div>
      </div>

      <div style={{background: 'white', padding: '1.5rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #e5e7eb'}}>
        <h3>Additional Information</h3>
        <div style={{marginBottom: '1rem'}}>
          <strong>Extracurricular Activities:</strong>
          <p>{application.extracurricular_activities || 'None provided'}</p>
        </div>
        <div>
          <strong>Personal Statement:</strong>
          <p>{application.personal_statement || 'None provided'}</p>
        </div>
      </div>

      <div style={{background: 'white', padding: '1.5rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #e5e7eb'}}>
        <h3>Application Status</h3>
        <div style={{display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem'}}>
          <label><strong>Current Status:</strong></label>
          <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} style={{padding: '0.5rem'}}>
            <option value="submitted">Submitted</option>
            <option value="under_review">Under Review</option>
            <option value="evaluated">Evaluated</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
          <button onClick={handleStatusUpdate} style={{padding: '0.5rem 1rem', cursor: 'pointer'}}>
            Update Status
          </button>
        </div>
        
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem'}}>
          <div><strong>Submitted:</strong> {formatDate(application.submitted_at)}</div>
          {application.ai_score && (
            <div><strong>AI Score:</strong> <span style={{color: '#2563eb', fontWeight: 'bold'}}>{application.ai_score}/100</span></div>
          )}
        </div>
      </div>

      <div style={{background: 'white', padding: '1.5rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #e5e7eb'}}>
        <h3>Uploaded Documents ({documents.length})</h3>
        {documents.length === 0 ? (
          <p>No documents uploaded</p>
        ) : (
          <div style={{display: 'grid', gap: '0.5rem'}}>
            {documents.map((doc) => (
              <div key={doc.id} style={{padding: '0.5rem', background: '#f9fafb', borderRadius: '4px'}}>
                📄 {doc.original_filename} ({doc.document_type})
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{background: '#fee2e2', padding: '1.5rem', borderRadius: '8px', border: '1px solid #fecaca'}}>
        <h3 style={{color: '#991b1b'}}>Danger Zone</h3>
        <button onClick={handleDelete} style={{padding: '0.5rem 1rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>
          Delete Application
        </button>
      </div>
    </div>
  );
};

export default ApplicationDetail;
