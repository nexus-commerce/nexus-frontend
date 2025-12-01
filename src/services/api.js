import axios from 'axios';
import config from '../config/environment';

const API_BASE_URL = config.api.baseURL;

if (config.app.debug) {
    console.log('API Configuration:', {
        baseURL: API_BASE_URL,
        env: config.app.env
    });
}

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

apiClient.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default {
    login(credentials) {
        return apiClient.post('/auth/login', credentials);
    },
    
    register(userInfo) {
        return apiClient.post('/auth/register', userInfo);
    },
    
    getUserProfile() {
        return apiClient.get('/users/profile');
    },
    
    updateUserProfile(user, updateMask) {
        return apiClient.patch('/users/profile', {
            user: user,
            update_mask: updateMask
        });
    },

    getProducts(filter = '', page = 1, pageSize = 20) {
        return apiClient.get('/products', {
            params: { filter, page, page_size: pageSize }
        });
    },
    
    getProduct(id) {
        return apiClient.get(`/products/${id}`);
    },
    
    createProduct(product) {
        return apiClient.post('/products', product);
    },
    
    updateProduct(id, product, updateMask) {
        return apiClient.patch(`/products/${id}`, {
            product: product,
            update_mask: updateMask
        });
    },
    
    deleteProduct(id) {
        return apiClient.delete(`/products/${id}`);
    },

    getCart() {
        return apiClient.get('/cart');
    },
    
    addToCart(item) {
        return apiClient.post('/cart/items', item);
    },
    
    updateCartItem(sku, quantity) {
        return apiClient.patch(`/cart/items/${sku}`, { quantity });
    },
    
    removeCartItem(sku) {
        return apiClient.delete(`/cart/items/${sku}`);
    },
    
    clearCart() {
        return apiClient.delete('/cart');
    },

    getOrders() {
        return apiClient.get('/orders');
    },
    
    getOrder(id) {
        return apiClient.get(`/orders/${id}`);
    },
    
    createOrder(orderData) {
        return apiClient.post('/orders', orderData);
    },

    processPayment() {
        return apiClient.post('/payments', {});
    },
    
    getPayments() {
        return apiClient.get('/payments');
    }
};