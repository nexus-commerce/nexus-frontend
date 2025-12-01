import { createStore } from 'vuex'
import api from '../services/api';

export default createStore({
  state: {
    user: null,
    token: localStorage.getItem('token') || '',
    products: [],
    productsNextPage: null,
    cart: { items: [], total_price: 0, total_items: 0 },
    orders: [],
    payments: []
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token;
    },
    SET_USER(state, user) {
      state.user = user;
    },
    LOGOUT(state) {
      state.token = '';
      state.user = null;
      state.cart = { items: [], total_price: 0, total_items: 0 };
      state.orders = [];
      state.payments = [];
    },
    SET_PRODUCTS(state, { products, next_page }) {
      state.products = products;
      state.productsNextPage = next_page;
    },
    APPEND_PRODUCTS(state, { products, next_page }) {
      state.products = [...state.products, ...products];
      state.productsNextPage = next_page;
    },
    SET_CART(state, cart) {
      state.cart = cart;
    },
    SET_ORDERS(state, orders) {
      state.orders = orders;
    },
    SET_PAYMENTS(state, payments) {
      state.payments = payments;
    }
  },
  actions: {
    async login({ commit, dispatch }, credentials) {
      const response = await api.login(credentials);
      const token = response.data.token;
      localStorage.setItem('token', token);
      commit('SET_TOKEN', token);
      await dispatch('fetchUserProfile');
      await dispatch('fetchCart');
    },
    
    async register(context, userInfo) {
      const response = await api.register(userInfo);
      return response.data;
    },
    
    async fetchUserProfile({ commit }) {
      try {
        const response = await api.getUserProfile();
        commit('SET_USER', response.data.user);
      } catch (error) {
        console.error("Could not fetch user profile.", error);
        if (error.response && error.response.status === 401) {
          commit('LOGOUT');
          localStorage.removeItem('token');
        }
      }
    },
    
    async updateUserProfile({ dispatch }, { user, updateMask }) {
      await api.updateUserProfile(user, updateMask);
      await dispatch('fetchUserProfile');
    },
    
    logout({ commit }) {
      localStorage.removeItem('token');
      commit('LOGOUT');
    },
    
    async fetchProducts({ commit }, { filter = '', page = 1, pageSize = 20, append = false } = {}) {
      const response = await api.getProducts(filter, page, pageSize);
      const mutation = append ? 'APPEND_PRODUCTS' : 'SET_PRODUCTS';
      commit(mutation, {
        products: response.data.products || [],
        next_page: response.data.next_page
      });
    },
    
    async fetchCart({ commit, state }) {
      if (!state.token) {
        commit('SET_CART', { items: [], total_price: 0, total_items: 0 });
        return;
      }
      try {
        const response = await api.getCart();
        commit('SET_CART', response.data);
      } catch (error) {
        console.error("Could not fetch cart.", error);
        commit('SET_CART', { items: [], total_price: 0, total_items: 0 });
      }
    },
    
    async fetchOrders({ commit }) {
      try {
        const response = await api.getOrders();
        commit('SET_ORDERS', response.data.orders || []);
      } catch (error) {
        console.error("Could not fetch orders.", error);
      }
    },
    
    async fetchPayments({ commit }) {
      try {
        const response = await api.getPayments();
        commit('SET_PAYMENTS', response.data.payments || []);
      } catch (error) {
        console.error("Could not fetch payments.", error);
      }
    }
  },
  getters: {
    isAuthenticated: state => !!state.token,
    cartItemCount: state => state.cart.total_items || 0,
    cartTotal: state => state.cart.total_price || 0
  }
})