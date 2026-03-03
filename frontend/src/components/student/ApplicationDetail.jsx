import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { applicationService, documentService } from '../../services/api';

const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplicationDetails();
  }, [id]);

  const fetchApplicationDetails = async () => {
    try {
      const [appResponse, docsResponse] = await Promise.all([
        applicationService.getApplicationById(id),  // CHANGED: was getApplication
        documentService.getDocumentsByApplication(id)
      ]);
      
      setApplication(appResponse.data.application);
      setDocuments(docsResponse.data.documents || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching application:', error);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatStatus = (status) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) return <div style={{padding: '2rem'}}>Loading...</div>;
  if (!application) return <div style={{padding: '2rem'}}>Application not found</div>;

  return (
    <div style={{padding: '2rem', maxWidth: '1000px', margin: '0 auto'}}>
      <button onClick={() => navigate('/student/applications')} style={{marginBottom: '1rem', padding: '0.5rem 1rem', cursor: 'pointer'}}>
        ← Back to Applications
      </button>

      <h2>Application Details</h2>

      <div style={{background: 'white', padding: '1.5rem', borderRadius: '12px', marginBottom: '1rem', border: '1px solid #e5e7eb'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1rem'}}>
          <h3>Status</h3>
          <span style={{padding: '0.5rem 1rem', background: '#dbeafe', color: '#1e40af', borderRadius: '20px', fontWeight: '600'}}>
            {formatStatus(application.status)}
          </span>
        </div>
        {application.ai_score && (
          <div style={{marginBottom: '1rem'}}>
            <strong>AI Score:</strong> {application.ai_score}/100
          </div>
        )}
        <div><strong>Submitted:</strong> {formatDate(application.submitted_at)}</div>
      </div>

      <div style={{background: 'white', padding: '1.5rem', borderRadius: '12px', marginBottom: '1rem', border: '1px solid #e5e7eb'}}>
        <h3>Personal Information</h3>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem'}}>
          <div><strong>Full Name:</strong> {application.full_name}</div>
          <div><strong>Email:</strong> {application.email}</div>
          <div><strong>Phone:</strong> {application.phone}</div>
          <div><strong>Date of Birth:</strong> {formatDate(application.date_of_birth)}</div>
          <div style={{gridColumn: '1 / -1'}}><strong>Address:</strong> {application.address}</div>
        </div>
      </div>

      <div style={{background: 'white', padding: '1.5rem', borderRadius: '12px', marginBottom: '1rem', border: '1px solid #e5e7eb'}}>
        <h3>Academic Information</h3>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem'}}>
          <div><strong>High School:</strong> {application.high_school_name}</div>
          <div><strong>GPA:</strong> {application.high_school_gpa || 'Not provided'}</div>
          <div><strong>Graduation Year:</strong> {application.graduation_year}</div>
          <div><strong>Intended Major:</strong> {application.intended_major}</div>
        </div>
      </div>

      <div style={{background: 'white', padding: '1.5rem', borderRadius: '12px', marginBottom: '1rem', border: '1px solid #e5e7eb'}}>
        <h3>Additional Information</h3>
        {application.extracurricular_activities && (
          <div style={{marginBottom: '1rem'}}>
            <strong>Extracurricular Activities:</strong>
            <p>{application.extracurricular_activities}</p>
          </div>
        )}
        {application.personal_statement && (
          <div>
            <strong>Personal Statement:</strong>
            <p>{application.personal_statement}</p>
          </div>
        )}
      </div>

      <div style={{background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e5e7eb'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
          <h3>Uploaded Documents ({documents.length})</h3>
          <button 
            onClick={() => navigate(`/student/applications/${id}/documents`)}
            style={{padding: '0.5rem 1rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer'}}
          >
            Upload Documents
          </button>
        </div>
        {documents.length === 0 ? (
          <p>No documents uploaded yet</p>
        ) : (
          <div style={{display: 'grid', gap: '0.5rem'}}>
            {documents.map((doc) => (
              <div key={doc.id} style={{padding: '0.75rem', background: '#f9fafb', borderRadius: '8px', display: 'flex', justifyContent: 'space-between'}}>
                <div>
                  <div><strong>{doc.original_filename}</strong></div>
                  <div style={{fontSize: '0.875rem', color: '#6b7280'}}>{doc.document_type}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationDetail;
