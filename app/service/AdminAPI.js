import axios from 'axios';

const API = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
});

// Interceptor to attach Admin Token
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const loginAdmin = async (data) => {
    try {
        const response = await API.post('/admin-auth/login', data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchAllCompanies = async () => {
    try {
        const response = await API.get('/admin/companies');
        console.log('Fetched Companies:', response.data);
        return response.data; // This contains { success, count, data: [] }
    } catch (error) {
        throw error;
    }
};

// POST: Verify (Approve or Reject)
// Updated to send { status, rejectionReason } in the body as required by your controller
export const adminVerifyCompany = async (companyId, payload) => {
    try {
        // payload should be { status: "approved" } or { status: "rejected", rejectionReason: "..." }
        const response = await API.post(`/admin/companies/${companyId}/verify`, payload);
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

export const fetchAllCategories = async () => {
    try {
        const response = await API.get('/categories/');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createCategory = async (data) => {
    try {
        const response = await API.post('/categories', data); // Assuming data is { name: "Category Name" }
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateCategory = async (categoryId, data) => {
    try {
        const response = await API.put(`/categories/${categoryId}`, data); // Assuming data is { name: "New Category Name" }
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteCategory = async (categoryId) => {
    try {
        const response = await API.delete(`/categories/${categoryId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// =====================================================
// PROVIDER MANAGEMENT APIs
// =====================================================

/**
 * Get all providers with filtering and pagination
 * @param {Object} params - { status, search, service, page, limit }
 */
export const adminGetAllProviders = async (params) => {
    try {
        const response = await API.get("/admin-provider/", { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Get details of a single provider
 */
export const adminGetProviderById = async (providerId) => {
    try {
        const response = await API.get(`/admin-provider/${providerId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Approve or Reject a provider
 * @param {Object} payload - { status: "approved" } OR { status: "rejected", rejectionReason: "..." }
 */
export const adminVerifyProvider = async (providerId, payload) => {
    try {
        // Note: I used .patch in the controller, so we use .patch here
        const response = await API.patch(`/admin-provider/${providerId}/verify`, payload);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Block or Unblock a provider
 * @param {Object} payload - { isBlocked: true, blockedReason: "..." }
 */
export const adminToggleBlockProvider = async (providerId, payload) => {
    try {
        const response = await API.patch(`/admin-provider/${providerId}/block`, payload);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Update any provider detail (Admin Override)
 * @param {Object} payload - Any fields in the provider model
 */
export const adminUpdateProvider = async (providerId, payload) => {
    try {
        const response = await API.put(`/admin-provider/${providerId}`, payload);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Soft delete a provider
 */
export const adminDeleteProvider = async (providerId) => {
    try {
        const response = await API.delete(`/admin-provider/${providerId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Get aggregate statistics for the dashboard
 */
export const adminGetProviderStats = async () => {
    try {
        const response = await API.get("/admin-provider/stats/overview");
        return response.data;
    } catch (error) {
        throw error;
    }
};



