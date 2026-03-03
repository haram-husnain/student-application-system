import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Profile from './components/student/Profile';
import ApplicationForm from './components/student/ApplicationForm';
import ApplicationStatus from './components/student/ApplicationStatus';
import ApplicationDetail from './components/student/ApplicationDetail';
import DocumentUpload from './components/student/DocumentUpload';
import Dashboard from './components/admin/Dashboard';
import ApplicationsList from './components/admin/ApplicationsList';
import AdminApplicationDetail from './components/admin/ApplicationDetail';
import Navigation from './components/Navigation';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) return <div style={{padding: '2rem'}}>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requireAdmin && !isAdmin) return <Navigate to="/student/dashboard" replace />;

  return children;
};

const StudentDashboard = () => {
  const navigate = useNavigate();
  
  return (
    <div style={{padding: '2rem'}}>
      <h2>Student Dashboard</h2>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '2rem'}}>
        <div style={{background: 'white', padding: '2rem', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
          <h3>My Profile</h3>
          <p>View and update your personal information</p>
          <button onClick={() => navigate('/student/profile')} style={{marginTop: '1rem', padding: '0.5rem 1rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>
            View Profile
          </button>
        </div>
        <div style={{background: 'white', padding: '2rem', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
          <h3>My Applications</h3>
          <p>View status of your submitted applications</p>
          <button onClick={() => navigate('/student/applications')} style={{marginTop: '1rem', padding: '0.5rem 1rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>
            View Applications
          </button>
        </div>
        <div style={{background: 'white', padding: '2rem', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
          <h3>New Application</h3>
          <p>Submit a new application for admission</p>
          <button onClick={() => navigate('/student/apply')} style={{marginTop: '1rem', padding: '0.5rem 1rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
};

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <>
      {isAuthenticated && !isAuthPage && <Navigation />}
      
      <div className={isAuthenticated && !isAuthPage ? 'content-with-sidebar' : ''}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/student/dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
          <Route path="/student/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/student/apply" element={<ProtectedRoute><ApplicationForm /></ProtectedRoute>} />
          <Route path="/student/applications" element={<ProtectedRoute><ApplicationStatus /></ProtectedRoute>} />
          <Route path="/student/applications/:id" element={<ProtectedRoute><ApplicationDetail /></ProtectedRoute>} />
          <Route path="/student/applications/:applicationId/documents" element={<ProtectedRoute><DocumentUpload /></ProtectedRoute>} />

          <Route path="/admin/dashboard" element={<ProtectedRoute requireAdmin={true}><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/applications" element={<ProtectedRoute requireAdmin={true}><ApplicationsList /></ProtectedRoute>} />
          <Route path="/admin/applications/:id" element={<ProtectedRoute requireAdmin={true}><AdminApplicationDetail /></ProtectedRoute>} />

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
