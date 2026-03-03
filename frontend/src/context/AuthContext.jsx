import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          // Verify token is still valid
          const response = await authService.getCurrentUser();
          setUser(response.data.user);
          setToken(storedToken);
        } catch (error) {
          // Token invalid or expired - clear and redirect
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    checkAuth();

    // Auto-check token expiration every 5 minutes
    const interval = setInterval(() => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          // Decode JWT to check expiration
          const payload = JSON.parse(atob(storedToken.split('.')[1]));
          const expirationTime = payload.exp * 1000;
          
          if (Date.now() >= expirationTime) {
            // Token expired - auto logout
            logout();
          }
        } catch (error) {
          console.error('Token validation error:', error);
          logout();
        }
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login({ email, password });
      const { token: newToken, user: newUser } = response.data;
      
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      setToken(newToken);
      setUser(newUser);
      
      return { success: true, user: newUser };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed'
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      const { token: newToken, user: newUser } = response.data;
      
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      setToken(newToken);
      setUser(newUser);
      
      return { success: true, user: newUser };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed'
      };
    }
  };

  const logout = () => {
    authService.logout();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    window.location.href = '/login';
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token,
    isAdmin: user?.role === 'admin',
    isStudent: user?.role === 'student'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
