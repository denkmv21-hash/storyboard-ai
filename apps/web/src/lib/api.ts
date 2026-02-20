import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired, logout
      localStorage.removeItem('auth-token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API functions
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  signup: (email: string, password: string, name?: string) =>
    api.post('/auth/signup', { email, password, name }),
  
  logout: () => api.post('/auth/logout'),
  
  me: () => api.get('/auth/me'),
};

export const projectsApi = {
  getAll: () => api.get('/projects'),
  getById: (id: string) => api.get(`/projects/${id}`),
  create: (data: { title: string; description?: string }) =>
    api.post('/projects', data),
  update: (id: string, data: Partial<{ title: string; description: string }>) =>
    api.put(`/projects/${id}`, data),
  delete: (id: string) => api.delete(`/projects/${id}`),
};

export const scenesApi = {
  getByProject: (projectId: string) => api.get(`/scenes/project/${projectId}`),
  getById: (id: string) => api.get(`/scenes/${id}`),
  create: (data: {
    projectId: string;
    title: string;
    description: string;
  }) => api.post('/scenes', data),
  update: (id: string, data: Record<string, unknown>) =>
    api.put(`/scenes/${id}`, data),
  delete: (id: string) => api.delete(`/scenes/${id}`),
};

export const generationApi = {
  generate: (data: {
    sceneId: string;
    prompt: string;
    style: string;
    aspectRatio: string;
  }) => api.post('/generation/image', data),
  
  getStatus: (jobId: string) => api.get(`/generation/${jobId}`),
  
  regenerate: (jobId: string) => api.post(`/generation/${jobId}/regenerate`),
};

export const scriptsApi = {
  getAll: () => api.get('/scripts'),
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/scripts/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  parse: (id: string) => api.post(`/scripts/${id}/parse`),
  delete: (id: string) => api.delete(`/scripts/${id}`),
};
