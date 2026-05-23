import axios from 'axios';

const API = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    timeout: 15000,
});

// Interceptor to attach the token
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('companyToken'); // Changed from companyToken to token
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const registerCompany = async (data) => {
    try {
        const response = await API.post('/company-auth/register', data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const loginCompany = async (data) => {
    try {
        const response = await API.post('/company-auth/login', data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Add this inside services/CompanyAPI.js
export const uploadCompanyDocuments = async (formData) => {
    try {
        const response = await API.put('/company-auth/upload-documents', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchCompanyProfile = async () => {
    try {
        const response = await API.get('/companies/me');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateCompanyProfile = async (data) => {
    try {
        const response = await API.put('/companies/update-profile', data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createCompanyService = async (data) => {
    try {
        const response = await API.post('/companies/create-service', data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchCompanyServices = async () => {
    try {
        const response = await API.get('/companies/my-services');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateCompanyService = async (serviceId, data) => {
    try {
        const response = await API.put(`/companies/update-service/${serviceId}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const deleteCompanyService = async (serviceId) => {
    try {
        const response = await API.delete(`/companies/delete-service/${serviceId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};