import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ====================================
// Authentication Services
// ====================================

export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/user'),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return api.post('/auth/logout');
  }
};

// ====================================
// Profile Services
// ====================================

export const profileService = {
  getProfile: (userId) => api.get(`/profile/${userId}`),
  updateProfile: (userId, profileData) => api.put(`/profile/${userId}`, profileData),
  deleteProfile: (userId) => api.delete(`/profile/${userId}`)
};

// ====================================
// Application Services
// ====================================

export const applicationService = {
  createApplication: (applicationData) => api.post('/applications', applicationData),
  getUserApplications: () => api.get('/applications'),
  getApplicationById: (id) => api.get(`/applications/${id}`),
  updateApplication: (id, applicationData) => api.put(`/applications/${id}`, applicationData),
  deleteApplication: (id) => api.delete(`/applications/${id}`)
};

// ====================================
// Document Services
// ====================================

export const documentService = {
  uploadDocument: (formData) => 
    api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }),
  getDocumentsByApplication: (applicationId) => api.get(`/documents/${applicationId}`),
  downloadDocument: (documentId) => 
    api.get(`/documents/download/${documentId}`, {
      responseType: 'blob'
    }),
  deleteDocument: (documentId) => api.delete(`/documents/${documentId}`)
};

// ====================================
// Admin Services
// ====================================

export const adminService = {
  getAllApplications: (params) => api.get('/admin/applications', { params }),
  getApplicationDetails: (id) => api.get(`/admin/applications/${id}`),
  updateApplicationStatus: (id, status) => 
    api.put(`/admin/applications/${id}/status`, { status }),
  updateAIEvaluation: (id, aiScore, aiRanking) => 
    api.put(`/admin/applications/${id}/ai-evaluation`, { aiScore, aiRanking }),
  deleteApplication: (id) => api.delete(`/admin/applications/${id}`),
  getStatistics: () => api.get('/admin/statistics'),
  getAdminLogs: (params) => api.get('/admin/logs', { params })
};

export default api;

// ====================================
// AI Evaluation Service
// ====================================
export const aiService = {
  evaluateApplication: (applicationId) => api.post(`/ai/evaluate/${applicationId}`),
  evaluateAllApplications: () => api.post('/ai/evaluate-all')
};
