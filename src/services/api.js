import axios from 'axios';

// Relative path — Vite dev server proxies '/api' to https://localhost:7077
// (see vite.config.js). This avoids CORS and self-signed-cert issues.
const API_BASE_URL = '/api/masterdata';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Questions
export const questionsAPI = {
  getAll: () => apiClient.get('/questions'),
  getById: (id) => apiClient.get(`/questions/${id}`),
  create: (data) => apiClient.post('/questions', data),
  update: (id, data) => apiClient.put(`/questions/${id}`, data),
  delete: (id) => apiClient.delete(`/questions/${id}`),
  getComments: (id) => apiClient.get(`/questions/${id}/comments`),
};

// Answers
export const answersAPI = {
  getAll: () => apiClient.get('/answers'),
  getById: (id) => apiClient.get(`/answers/${id}`),
  create: (data) => apiClient.post('/answers', data),
  update: (id, data) => apiClient.put(`/answers/${id}`, data),
  delete: (id) => apiClient.delete(`/answers/${id}`),
};

// Comments
export const commentsAPI = {
  getAll: () => apiClient.get('/comments'),
  getById: (id) => apiClient.get(`/comments/${id}`),
  create: (data) => apiClient.post('/comments', data),
  update: (id, data) => apiClient.put(`/comments/${id}`, data),
  delete: (id) => apiClient.delete(`/comments/${id}`),
};

// Companies
export const companiesAPI = {
  getAll: () => apiClient.get('/companies'),
  getById: (id) => apiClient.get(`/companies/${id}`),
  create: (data) => apiClient.post('/companies', data),
  update: (id, data) => apiClient.put(`/companies/${id}`, data),
  delete: (id) => apiClient.delete(`/companies/${id}`),
};

// Technologies
export const technologiesAPI = {
  getAll: () => apiClient.get('/technologies'),
  getById: (id) => apiClient.get(`/technologies/${id}`),
  create: (data) => apiClient.post('/technologies', data),
  update: (id, data) => apiClient.put(`/technologies/${id}`, data),
  delete: (id) => apiClient.delete(`/technologies/${id}`),
};

// Job Roles
export const jobRolesAPI = {
  getAll: () => apiClient.get('/job-roles'),
  getById: (id) => apiClient.get(`/job-roles/${id}`),
  create: (data) => apiClient.post('/job-roles', data),
  update: (id, data) => apiClient.put(`/job-roles/${id}`, data),
  delete: (id) => apiClient.delete(`/job-roles/${id}`),
};

// Likes
export const likesAPI = {
  toggle: (userId, targetType, targetId) =>
    apiClient.post('/likes/toggle', { userId, targetType, targetId }),
  status: (userId, targetType, targetId) =>
    apiClient.get('/likes/status', { params: { userId, targetType, targetId } }),
  byUser: (userId) => apiClient.get(`/likes/user/${encodeURIComponent(userId)}`),
};

export default apiClient;
