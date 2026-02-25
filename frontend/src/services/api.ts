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
  register: (data: { email: string; password: string; name: string; role: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

// Resumes API
export const resumesAPI = {
  upload: (file: File, title?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    if (title) formData.append('title', title);
    return api.post('/resumes/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getMyResumes: () => api.get('/resumes/my'),
  getAllResumes: () => api.get('/resumes/all'),
  getResume: (id: string) => api.get(`/resumes/${id}`),
  deleteResume: (id: string) => api.delete(`/resumes/${id}`),
  downloadResume: (id: string) => `${API_URL}/resumes/${id}/download`,
};

// Jobs API
export const jobsAPI = {
  create: (data: {
    title: string;
    company: string;
    location: string;
    description: string;
    requirements: string[];
    skills?: string[];
    salaryRange?: string;
  }) => api.post('/jobs', data),
  getAll: () => api.get('/jobs'),
  getMyJobs: () => api.get('/jobs/recruiter/my'),
  getJob: (id: string) => api.get(`/jobs/${id}`),
  updateJob: (id: string, data: any) => api.put(`/jobs/${id}`, data),
  deleteJob: (id: string) => api.delete(`/jobs/${id}`),
};

export default api;
