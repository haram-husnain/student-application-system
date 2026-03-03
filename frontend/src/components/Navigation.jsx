import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const studentLinks = [
    { path: '/student/dashboard', label: 'Home', icon: '🏠' },
    { path: '/student/apply', label: 'Application', icon: '📝' },
    { path: '/student/applications', label: 'Status', icon: '📊' },
    { path: '/student/profile', label: 'Profile', icon: '👤' }
  ];

  const adminLinks = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/applications', label: 'Applications', icon: '📝' }
  ];

  const links = isAdmin ? adminLinks : studentLinks;

  return (
    <>
      {/* Top Bar */}
      <div className="top-bar">
        <div className="top-bar-logo" onClick={() => navigate(isAdmin ? '/admin/dashboard' : '/student/dashboard')}>
          <div className="logo-icon">✱</div>
          <span>Student Application System</span>
        </div>
        <div className="top-bar-right">
          <span className="user-name">{user?.firstName} {user?.lastName}</span>
          <span className="user-badge">{isAdmin ? 'Admin' : 'Student'}</span>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </div>

      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">✱</div>
          <div className="sidebar-title">
            {isAdmin ? 'Admin' : 'Student'}<br/>Portal
          </div>
        </div>

        <div className="sidebar-nav">
          {links.map((link) => (
            <div
              key={link.path}
              className={`sidebar-item ${isActive(link.path) ? 'active' : ''}`}
              onClick={() => navigate(link.path)}
            >
              <span className="sidebar-icon">{link.icon}</span>
              <span className="sidebar-label">{link.label}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Navigation;
