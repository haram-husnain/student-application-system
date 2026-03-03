import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { applicationService } from '../../services/api';

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

  if (loading) return <div style={{padding: '2rem'}}>Loading applications...</div>;

  return (
    <div style={{padding: '2rem'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '2rem'}}>
        <h2>My Applications</h2>
        <button onClick={() => navigate('/student/apply')} style={{padding: '0.5rem 1rem', cursor: 'pointer', background: '#2563eb', color: 'white', border: 'none', borderRadius: '4px'}}>
          New Application
        </button>
      </div>

      {applications.length === 0 ? (
        <div style={{textAlign: 'center', padding: '3rem', background: '#f9fafb', borderRadius: '8px'}}>
          <p>You haven't submitted any applications yet.</p>
          <button onClick={() => navigate('/student/apply')} style={{marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer'}}>
            Submit Your First Application
          </button>
        </div>
      ) : (
        <div style={{display: 'grid', gap: '1rem'}}>
          {applications.map((app) => (
            <div key={app.id} style={{background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.5rem'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1rem'}}>
                <h3>{app.intended_major}</h3>
                <span style={{padding: '0.25rem 0.75rem', background: '#dbeafe', color: '#1e40af', borderRadius: '9999px', fontSize: '0.875rem'}}>
                  {formatStatus(app.status)}
                </span>
              </div>
              
              <div style={{display: 'grid', gap: '0.5rem', fontSize: '0.875rem'}}>
                <div><strong>Name:</strong> {app.full_name}</div>
                <div><strong>High School:</strong> {app.high_school_name}</div>
                <div><strong>GPA:</strong> {app.high_school_gpa || 'N/A'}</div>
                <div><strong>Submitted:</strong> {formatDate(app.submitted_at)}</div>
                {app.ai_score && <div><strong>AI Score:</strong> {app.ai_score}/100</div>}
              </div>

              <button 
                onClick={() => navigate(`/student/applications/${app.id}`)}
                style={{marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer'}}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationStatus;
