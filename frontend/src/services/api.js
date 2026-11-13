import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to requests if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('portfolio_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (localStorage.getItem('portfolio_admin_token')) {
        localStorage.removeItem('portfolio_admin_token');
        window.dispatchEvent(new Event('auth_expired'));
      }
    }
    return Promise.reject(error);
  }
);

export const portfolioApi = {
  // Public Client Endpoints
  getPortfolioContent: () => api.get('/portfolio').then((r) => r.data),
  getProjects: (params) => api.get('/projects', { params }).then((r) => r.data),
  getProjectById: (id) => api.get(`/projects/${id}`).then((r) => r.data),
  getFormConfig: () => api.get('/enquiry/form-config').then((r) => r.data),
  submitEnquiry: (data) => api.post('/enquiry/submit', { data }).then((r) => r.data),

  // Auth Endpoints
  login: (email, password) => api.post('/auth/login', { email, password }).then((r) => r.data),
  getProfile: () => api.get('/auth/me').then((r) => r.data),
  changePassword: (currentPassword, newPassword) =>
    api.post('/auth/change-password', { currentPassword, newPassword }).then((r) => r.data),

  // Admin Content Endpoints
  getAdminContent: () => api.get('/admin/content').then((r) => r.data),
  updatePortfolioContent: (content) => api.put('/admin/content', content).then((r) => r.data),

  // Admin Projects Endpoints
  getAdminProjects: () => api.get('/admin/projects').then((r) => r.data),
  createProject: (projectData) => api.post('/admin/projects', projectData).then((r) => r.data),
  updateProject: (id, projectData) => api.put(`/admin/projects/${id}`, projectData).then((r) => r.data),
  deleteProject: (id) => api.delete(`/admin/projects/${id}`).then((r) => r.data),
  reorderProjects: (orderMap) => api.put('/admin/projects/reorder/bulk', orderMap).then((r) => r.data),

  // Admin Enquiry & Dynamic Form Builder Endpoints
  getAdminEnquiries: (params) => api.get('/admin/enquiries', { params }).then((r) => r.data),
  updateEnquiryStatus: (id, status) =>
    api.patch(`/admin/enquiries/${id}/status`, { status }).then((r) => r.data),
  deleteEnquiry: (id) => api.delete(`/admin/enquiries/${id}`).then((r) => r.data),
  getAdminFormConfig: () => api.get('/admin/enquiry-form').then((r) => r.data),
  updateAdminFormConfig: (config) => api.put('/admin/enquiry-form', config).then((r) => r.data),

  // Admin Upload & Cloudinary
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/admin/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data);
  },
  uploadResume: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/admin/upload/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data);
  },
  deleteMedia: (publicId, resourceType = 'image') =>
    api.delete('/admin/upload', { params: { public_id: publicId, resource_type: resourceType } }).then((r) => r.data),
};

export default api;
