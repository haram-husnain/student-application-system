import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services/api';

const ApplicationsList = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchApplications();
  }, [filter]);

  const fetchApplications = async () => {
    try {
      const response = await adminService.getAllApplications({ 
        status: filter !== 'all' ? filter : undefined 
      });
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
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) return <div style={{padding: '2rem'}}>Loading applications...</div>;

  return (
    <div style={{padding: '2rem'}}>
      <h2>All Applications</h2>

      <div style={{marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center'}}>
        <label style={{fontWeight: '600'}}>Filter by Status:</label>
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)} 
          style={{padding: '0.5rem', borderRadius: '8px', border: '1px solid #e5e7eb'}}
        >
          <option value="all">All Applications</option>
          <option value="submitted">Submitted</option>
          <option value="under_review">Under Review</option>
          <option value="evaluated">Evaluated</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {applications.length === 0 ? (
        <div style={{textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '12px'}}>
          <p>No applications found.</p>
        </div>
      ) : (
        <div style={{background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
          <table style={{width: '100%', borderCollapse: 'collapse'}}>
            <thead>
              <tr style={{background: '#f9fafb'}}>
                <th style={{padding: '1rem', textAlign: 'left', fontWeight: '700'}}>Name</th>
                <th style={{padding: '1rem', textAlign: 'left', fontWeight: '700'}}>Email</th>
                <th style={{padding: '1rem', textAlign: 'left', fontWeight: '700'}}>Major</th>
                <th style={{padding: '1rem', textAlign: 'left', fontWeight: '700'}}>Status</th>
                <th style={{padding: '1rem', textAlign: 'left', fontWeight: '700'}}>Submitted</th>
                <th style={{padding: '1rem', textAlign: 'left', fontWeight: '700'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id} style={{borderBottom: '1px solid #e5e7eb'}}>
                  <td style={{padding: '1rem'}}>{app.full_name}</td>
                  <td style={{padding: '1rem'}}>{app.email}</td>
                  <td style={{padding: '1rem'}}>{app.intended_major}</td>
                  <td style={{padding: '1rem'}}>
                    <span style={{
                      padding: '0.25rem 0.75rem', 
                      background: '#dbeafe', 
                      color: '#1e40af', 
                      borderRadius: '12px', 
                      fontSize: '0.875rem',
                      fontWeight: '600'
                    }}>
                      {formatStatus(app.status)}
                    </span>
                  </td>
                  <td style={{padding: '1rem'}}>{formatDate(app.submitted_at)}</td>
                  <td style={{padding: '1rem'}}>
                    <button 
                      onClick={() => navigate(`/admin/applications/${app.id}`)}
                      style={{
                        padding: '0.5rem 1rem', 
                        background: '#2563eb', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '8px', 
                        cursor: 'pointer'
                      }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ApplicationsList;
