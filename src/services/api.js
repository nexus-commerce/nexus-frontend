// src/services/api.js

import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8000/api/v1', // <-- IMPORTANT: Change this to your actual API URL
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor to add the auth token to requests
apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default {
    // --- UserService ---
    login(credentials) {
        // AuthRequest: { email, password }
        return apiClient.post('/auth/login', credentials);
    },
    register(userInfo) {
        return apiClient.post('/auth/register', userInfo);
    },
    getUserProfile() {
        return apiClient.get('/users/profile');
    },
    updateUserProfile(profileData) {
        // UpdateUserRequest: { email, first_name, last_name }
        return apiClient.put('/users/profile', profileData);
    },

    // --- ProductCatalogService ---
    getProducts() {
        return apiClient.get('/products');
    },
    getProduct(id) {
        return apiClient.get(`/products/${id}`);
    },

    // --- ShoppingCartService ---
    getCart() {
        return apiClient.get('/cart');
    },
    addToCart(item) {
        // AddItemRequest: { sku, quantity }
        return apiClient.post('/cart/items', item);
    },
    updateCartItem(sku, quantity) {
        return apiClient.patch(`/cart/items/${sku}`, { sku, quantity });
    },
    removeCartItem(sku) {
        // RemoveItemRequest uses sku
        return apiClient.delete(`/cart/items/${sku}`);
    },
    clearCart() {
        return apiClient.delete('/cart');
    },

    // --- OrderService ---
    getOrders() {
        return apiClient.get('/orders');
    },
    getOrder(id) {
        return apiClient.get(`/orders/${id}`);
    },
    createOrder(orderData) {
        // CreateOrderRequest: { shipping_address, payment_method, payment_intent_id }
        return apiClient.post('/orders', orderData);
    },

    // --- PaymentService ---
    initiatePayment() {
        return apiClient.post('/payments/initiate', {});
    }
};