import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Interceptor to attach the token from AsyncStorage
API.interceptors.request.use(async (config) => {
    try {
        const token = await AsyncStorage.getItem('adminToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch (e) {
        console.error("Error reading token", e);
    }
    return config;
});

export const loginAdmin = async (data) => {
    try {
        const response = await API.post('/admin/login', data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchAllCompanies = async () => {
    try {
        const response = await API.get('/admin/companies');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchCompanyDetails = async (companyId) => {
    try {
        const response = await API.get(`/admin/companies/${companyId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const adminVerifyCompany = async (companyId) => {
    try {
        const response = await API.post(`/admin/companies/${companyId}/verify`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

