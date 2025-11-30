// src/store/index.js

import { createStore } from 'vuex'
import api from '../services/api';

export default createStore({
  state: {
    user: null,
    token: localStorage.getItem('token') || '',
    products: [],
    cart: { items: [], total_price: 0, total_items: 0 } // Match GetCartResponse
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
    },
    SET_PRODUCTS(state, products) {
      state.products = products;
    },
    SET_CART(state, cart) {
      state.cart = cart;
    }
  },
  actions: {
    async login({ commit, dispatch }, credentials) {
      const response = await api.login(credentials);
      const token = response.data.token;
      localStorage.setItem('token', token);
      commit('SET_TOKEN', token);
      // After login, fetch the user profile
      await dispatch('fetchUserProfile');
    },
    async fetchUserProfile({ commit }) {
      try {
        const response = await api.getUserProfile();
        commit('SET_USER', response.data);
      } catch (error) {
        console.error("Could not fetch user profile.", error);
        // Maybe logout if token is invalid
      }
    },
    logout({ commit }) {
      localStorage.removeItem('token');
      commit('LOGOUT');
    },
    async fetchProducts({ commit }) {
      // The response nests the array in a "products" key
      const response = await api.getProducts();
      commit('SET_PRODUCTS', response.data.products || []);
    },
    async fetchCart({ commit }) {
      const response = await api.getCart();
      commit('SET_CART', response.data);
    }
  },
  getters: {
    isAuthenticated: state => !!state.token,
    cartItemCount: state => state.cart.total_items || 0
  }
})