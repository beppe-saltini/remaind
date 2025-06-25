import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for loading states
api.interceptors.request.use((config) => {
  // You can add loading indicators here
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.error || error.message || 'An error occurred';
    throw new Error(message);
  }
);

export const personAPI = {
  getAll: () => api.get('/persons'),
  //getStats: () => api.get('/persons/stats'),
  getUpcomingBirthdays: (days = 30) => api.get(`/persons/birthdays?days=${days}`),
  getByRelationship: (relationship) => api.get(`/persons/relationship/${relationship}`),
  add: (personData) => api.post('/persons', personData),
};

export const documentAPI = {
  upload: (formData) => api.post('/documents', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

export default api;
