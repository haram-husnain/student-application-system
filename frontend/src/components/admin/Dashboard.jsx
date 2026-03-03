import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService, aiService } from '../../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [statistics, setStatistics] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsResponse, appsResponse] = await Promise.all([
        adminService.getStatistics(),
        adminService.getAllApplications()
      ]);
      
      setStatistics(statsResponse.data.statistics);
      setApplications(appsResponse.data.applications);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleEvaluateAll = async () => {
    if (!window.confirm('Evaluate all pending applications with AI? This will update their scores.')) {
      return;
    }

    setEvaluating(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await aiService.evaluateAllApplications();
      setMessage({ type: 'success', text: response.data.message });
      fetchData(); // Refresh data
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to evaluate applications' });
    }
    setEvaluating(false);
  };

  const formatStatus = (status) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) return <div style={{padding: '2rem'}}>Loading...</div>;

  return (
    <div style={{padding: '2rem'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
        <h2>Admin Dashboard</h2>
        <button 
          onClick={handleEvaluateAll}
          disabled={evaluating}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#8b5cf6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: evaluating ? 'not-allowed' : 'pointer',
            opacity: evaluating ? 0.6 : 1
          }}
        >
          {evaluating ? '🤖 Evaluating...' : '🤖 AI Evaluate All'}
        </button>
      </div>

      {message.text && (
        <div style={{
          padding: '1rem',
          marginBottom: '1.5rem',
          background: message.type === 'success' ? '#d1fae5' : '#fee2e2',
          borderRadius: '8px',
          borderLeft: `4px solid ${message.type === 'success' ? '#10b981' : '#ef4444'}`
        }}>
          {message.text}
        </div>
      )}

      {/* Statistics Cards */}
      {statistics && (
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem'}}>
          <div style={{background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
            <div style={{fontSize: '2rem', fontWeight: '700', color: '#2563eb'}}>{statistics.totalApplications}</div>
            <div style={{color: '#6b7280', marginTop: '0.5rem'}}>Total Applications</div>
          </div>
          <div style={{background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
            <div style={{fontSize: '2rem', fontWeight: '700', color: '#f59e0b'}}>{statistics.statusCounts.submitted}</div>
            <div style={{color: '#6b7280', marginTop: '0.5rem'}}>Submitted</div>
          </div>
          <div style={{background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
            <div style={{fontSize: '2rem', fontWeight: '700', color: '#8b5cf6'}}>{statistics.statusCounts.evaluated}</div>
            <div style={{color: '#6b7280', marginTop: '0.5rem'}}>Evaluated</div>
          </div>
          <div style={{background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
            <div style={{fontSize: '2rem', fontWeight: '700', color: '#10b981'}}>{statistics.statusCounts.accepted}</div>
            <div style={{color: '#6b7280', marginTop: '0.5rem'}}>Accepted</div>
          </div>
          <div style={{background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
            <div style={{fontSize: '2rem', fontWeight: '700', color: '#8b5cf6'}}>
              {statistics.averageAIScore || 'N/A'}
              {statistics.averageAIScore && '/100'}
            </div>
            <div style={{color: '#6b7280', marginTop: '0.5rem'}}>Avg AI Score</div>
          </div>
        </div>
      )}

      {/* Recent Applications */}
      <div style={{background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1rem'}}>
          <h3>Recent Applications</h3>
          <button 
            onClick={() => navigate('/admin/applications')}
            style={{padding: '0.5rem 1rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer'}}
          >
            View All
          </button>
        </div>

        {applications.length === 0 ? (
          <p style={{textAlign: 'center', color: '#6b7280'}}>No applications yet</p>
        ) : (
          <table style={{width: '100%', borderCollapse: 'collapse'}}>
            <thead>
              <tr style={{borderBottom: '2px solid #e5e7eb'}}>
                <th style={{padding: '0.75rem', textAlign: 'left', fontWeight: '700'}}>Name</th>
                <th style={{padding: '0.75rem', textAlign: 'left', fontWeight: '700'}}>Major</th>
                <th style={{padding: '0.75rem', textAlign: 'left', fontWeight: '700'}}>AI Score</th>
                <th style={{padding: '0.75rem', textAlign: 'left', fontWeight: '700'}}>Status</th>
                <th style={{padding: '0.75rem', textAlign: 'left', fontWeight: '700'}}>Date</th>
                <th style={{padding: '0.75rem', textAlign: 'left', fontWeight: '700'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.slice(0, 5).map((app) => (
                <tr key={app.id} style={{borderBottom: '1px solid #e5e7eb'}}>
                  <td style={{padding: '0.75rem'}}>{app.full_name}</td>
                  <td style={{padding: '0.75rem'}}>{app.intended_major}</td>
                  <td style={{padding: '0.75rem'}}>
                    {app.ai_score ? (
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        background: app.ai_score >= 70 ? '#d1fae5' : app.ai_score >= 50 ? '#fef3c7' : '#fee2e2',
                        color: app.ai_score >= 70 ? '#065f46' : app.ai_score >= 50 ? '#92400e' : '#991b1b',
                        borderRadius: '12px',
                        fontWeight: '600',
                        fontSize: '0.875rem'
                      }}>
                        {app.ai_score}/100
                      </span>
                    ) : (
                      <span style={{color: '#6b7280'}}>Not evaluated</span>
                    )}
                  </td>
                  <td style={{padding: '0.75rem'}}>
                    <span style={{padding: '0.25rem 0.75rem', background: '#dbeafe', color: '#1e40af', borderRadius: '12px', fontSize: '0.875rem', fontWeight: '600'}}>
                      {formatStatus(app.status)}
                    </span>
                  </td>
                  <td style={{padding: '0.75rem'}}>{formatDate(app.submitted_at)}</td>
                  <td style={{padding: '0.75rem'}}>
                    <button 
                      onClick={() => navigate(`/admin/applications/${app.id}`)}
                      style={{padding: '0.5rem 1rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer'}}
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
