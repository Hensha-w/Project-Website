import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 second timeout
});

// Request interceptor to add auth token
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

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data || error.message);

        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (userData) => api.post('/auth/register', userData),
    login: (credentials) => api.post('/auth/login', credentials),
    getCurrentUser: () => api.get('/auth/me'),
};

// Project API
export const projectAPI = {
    createProject: (projectData) => api.post('/projects', projectData),
    getUserProjects: () => api.get('/projects'),
    getProject: (id) => api.get(`/projects/${id}`),
    contestPrice: (id, data) => api.post(`/projects/${id}/contest`, data),
    acceptPrice: (id) => api.post(`/projects/${id}/accept`),
};

// Payment API
export const paymentAPI = {
    createPayment: (paymentData) => {
        const formData = new FormData();
        Object.keys(paymentData).forEach(key => {
            formData.append(key, paymentData[key]);
        });
        return api.post('/payments', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    getUserPayments: () => api.get('/payments'),
};

export default api;