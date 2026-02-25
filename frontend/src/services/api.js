import axios from 'axios';

const API_URL = 'http://localhost:4000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

// Resumes API
export const resumesAPI = {
  upload: (file, title) => {
    const formData = new FormData();
    formData.append('file', file);
    if (title) formData.append('title', title);
    return api.post('/resumes/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getMyResumes: () => api.get('/resumes/my'),
  getAllResumes: () => api.get('/resumes/all'),
  getResume: (id) => api.get(`/resumes/${id}`),
  deleteResume: (id) => api.delete(`/resumes/${id}`),
  downloadResume: (id) => `${API_URL}/resumes/${id}/download`,
};

// Jobs API
export const jobsAPI = {
  create: (data) => api.post('/jobs', data),
  getAll: () => api.get('/jobs'),
  getMyJobs: () => api.get('/jobs/recruiter/my'),
  getJob: (id) => api.get(`/jobs/${id}`),
  updateJob: (id, data) => api.put(`/jobs/${id}`, data),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
};

export default api;
