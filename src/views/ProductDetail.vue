<template>
  <div class="product-detail-container">
    <div v-if="product" class="product-detail">
      <div class="product-image-section">
        <div class="image-wrapper">
          <img 
            v-if="product.image_url" 
            :src="product.image_url" 
            :alt="product.name" 
            class="product-image"
          />
          <div v-else class="product-image-placeholder">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            <span>No Image Available</span>
          </div>
          
          <div class="stock-badge" :class="stockClass">
            <span class="badge-icon">●</span>
            {{ stockStatus }}
          </div>
        </div>
        
        <div class="category-badge" v-if="product.category">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
            <line x1="7" y1="7" x2="7.01" y2="7"></line>
          </svg>
          {{ product.category }}
        </div>
      </div>
      
      <div class="product-info-section">
        <div class="product-header">
          <h1 class="product-title">{{ product.name }}</h1>
          <div class="product-sku-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
            </svg>
            SKU: {{ product.sku }}
          </div>
        </div>
        
        <p class="product-description">{{ product.description }}</p>
        
        <div class="product-attributes" v-if="product.attributes && Object.keys(product.attributes).length > 0">
          <h3 class="section-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            Specifications
          </h3>
          <div class="attributes-grid">
            <div v-for="(value, key) in product.attributes" :key="key" class="attribute-item">
              <span class="attribute-key">{{ formatKey(key) }}</span>
              <span class="attribute-value">{{ value }}</span>
            </div>
          </div>
        </div>
        
        <div class="product-pricing-card">
          <div class="price-section">
            <span class="price-label">Price</span>
            <span class="price">${{ product.price.toFixed(2) }}</span>
          </div>
          
          <div class="stock-details">
            <div v-if="product.stock_quantity > 0" class="stock-info">
              <div class="stock-header">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                </svg>
                <span class="stock-number">
                  <strong>{{ product.stock_quantity }}</strong> units in stock
                </span>
              </div>
              <div class="stock-bar-container">
                <div class="stock-bar" :style="{ width: stockPercentage + '%' }" :class="stockBarClass"></div>
              </div>
            </div>
            <div v-else class="stock-info out-of-stock-info">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
              <span class="stock-number out-of-stock">Out of Stock</span>
            </div>
          </div>
        </div>
        
        <form @submit.prevent="handleAddToCart" v-if="product.stock_quantity > 0" class="cart-form">
          <div class="quantity-selector">
            <label for="quantity">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Quantity
            </label>
            <input 
              type="number" 
              id="quantity" 
              v-model.number="quantity" 
              :min="1" 
              :max="product.stock_quantity"
            />
          </div>
          <button type="submit" class="btn-add-to-cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            Add to Cart
          </button>
        </form>
        
        <div v-else class="out-of-stock-notice">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <p>This product is currently out of stock.</p>
        </div>
        
        <div v-if="message" :class="['message-alert', messageClass]">
          <svg v-if="messageClass === 'success'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          {{ message }}
        </div>
        
        <router-link to="/products" class="btn-back">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Products
        </router-link>
      </div>
    </div>
    
    <div v-else class="loading">
      <div class="loading-spinner"></div>
      <p>Loading product details...</p>
    </div>
  </div>
</template>

<script>
import api from '@/services/api';

export default {
  data() {
    return {
      product: null,
      quantity: 1,
      message: '',
      messageClass: ''
    }
  },
  computed: {
    stockStatus() {
      if (!this.product || !this.product.stock_quantity || this.product.stock_quantity === 0) {
        return 'Out of Stock';
      } else if (this.product.stock_quantity < 10) {
        return `Only ${this.product.stock_quantity} left in stock`;
      } else {
        return 'In Stock';
      }
    },
    stockClass() {
      if (!this.product || !this.product.stock_quantity || this.product.stock_quantity === 0) {
        return 'out-of-stock';
      } else if (this.product.stock_quantity < 10) {
        return 'low-stock';
      } else {
        return 'in-stock';
      }
    },
    stockPercentage() {
      if (!this.product || !this.product.stock_quantity) return 0;
      const maxStock = 100;
      return Math.min((this.product.stock_quantity / maxStock) * 100, 100);
    },
    stockBarClass() {
      if (!this.product || !this.product.stock_quantity) return 'bar-empty';
      if (this.product.stock_quantity < 10) return 'bar-low';
      if (this.product.stock_quantity < 50) return 'bar-medium';
      return 'bar-high';
    }
  },
  async created() {
    const productId = this.$route.params.id;
    try {
      const response = await api.getProduct(productId);
      this.product = response.data.product;
    } catch (error) {
      console.error("Failed to fetch product:", error);
      this.message = "Could not load product details.";
      this.messageClass = 'error';
    }
  },
  methods: {
    async handleAddToCart() {
      if (!this.product || !this.product.sku) return;
      
      if (!this.$store.getters.isAuthenticated) {
        this.$router.push('/login');
        return;
      }
      
      try {
        const cartItem = {
          sku: this.product.sku,
          quantity: this.quantity
        };
        await api.addToCart(cartItem);
        this.message = `Added ${this.quantity} item(s) to cart!`;
        this.messageClass = 'success';
        
        this.$store.dispatch('fetchCart');
        
        this.quantity = 1;
      } catch (error) {
        console.error("Failed to add to cart:", error);
        const errorMessage = error.response?.data?.error || 'Error adding item to cart.';
        this.message = errorMessage;
        this.messageClass = 'error';
      }
    },
    formatKey(key) {
      return key.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    }
  }
}
</script>

<style scoped>
.product-detail-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
}

.product-detail {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.product-image-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.image-wrapper {
  position: relative;
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.product-image {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.4s ease;
}

.image-wrapper:hover .product-image {
  transform: scale(1.05);
}

.product-image-placeholder {
  width: 100%;
  min-height: 500px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: white;
}

.product-image-placeholder svg {
  width: 80px;
  height: 80px;
  opacity: 0.9;
}

.product-image-placeholder span {
  font-size: 18px;
  font-weight: 600;
  opacity: 0.9;
}

.stock-badge {
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 10px 20px;
  border-radius: 30px;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.badge-icon {
  font-size: 10px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.stock-badge.in-stock {
  background: rgba(40, 167, 69, 0.95);
  color: white;
}

.stock-badge.low-stock {
  background: rgba(255, 193, 7, 0.95);
  color: #000;
}

.stock-badge.out-of-stock {
  background: rgba(220, 53, 69, 0.95);
  color: white;
}

.category-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  font-size: 14px;
  font-weight: 600;
  color: #667eea;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: 2px solid rgba(102, 126, 234, 0.2);
}

.product-info-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.product-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 24px;
  border-bottom: 2px solid #e2e8f0;
}

.product-title {
  margin: 0;
  font-size: 42px;
  font-weight: 800;
  color: #2d3748;
  line-height: 1.2;
}

.product-sku-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #f7fafc;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  color: #718096;
  font-family: monospace;
  width: fit-content;
  border: 1px solid #e2e8f0;
}

.product-sku-badge svg {
  color: #667eea;
}

.product-description {
  font-size: 17px;
  line-height: 1.8;
  color: #4a5568;
  margin: 0;
}

.product-attributes {
  background: white;
  padding: 24px;
  border-radius: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 20px;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 20px 0;
}

.section-title svg {
  color: #667eea;
}

.attributes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.attribute-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px;
  background: #f7fafc;
  border-radius: 12px;
  border-left: 3px solid #667eea;
}

.attribute-key {
  font-size: 12px;
  font-weight: 600;
  color: #a0aec0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.attribute-value {
  font-size: 15px;
  font-weight: 600;
  color: #2d3748;
}

.product-pricing-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 32px;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
  color: white;
}

.price-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.price-label {
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.9;
}

.price {
  font-size: 48px;
  font-weight: 900;
  margin: 0;
}

.stock-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stock-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stock-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.stock-number {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.stock-number strong {
  font-size: 24px;
  font-weight: 800;
}

.stock-bar-container {
  width: 100%;
  height: 10px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  overflow: hidden;
}

.stock-bar {
  height: 100%;
  transition: width 0.5s ease;
  border-radius: 10px;
}

.bar-high {
  background: linear-gradient(90deg, #48bb78 0%, #38a169 100%);
}

.bar-medium {
  background: linear-gradient(90deg, #ed8936 0%, #dd6b20 100%);
}

.bar-low {
  background: linear-gradient(90deg, #fc8181 0%, #f56565 100%);
}

.bar-empty {
  background: #e53e3e;
}

.out-of-stock-info {
  flex-direction: row;
  align-items: center;
  gap: 10px;
}

.out-of-stock {
  opacity: 0.9;
}

.cart-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.quantity-selector {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.quantity-selector label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 16px;
  color: #2d3748;
}

.quantity-selector label svg {
  color: #667eea;
}

.quantity-selector input {
  width: 100%;
  max-width: 150px;
  padding: 14px 18px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  transition: all 0.2s;
}

.quantity-selector input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.btn-add-to-cart {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  padding: 18px 32px;
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  font-weight: 700;
  font-size: 18px;
  transition: all 0.3s ease;
  box-shadow: 0 6px 24px rgba(72, 187, 120, 0.4);
}

.btn-add-to-cart:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 32px rgba(72, 187, 120, 0.5);
}

.btn-add-to-cart:active {
  transform: translateY(-1px);
}

.out-of-stock-notice {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px;
  background: linear-gradient(135deg, #fc8181 0%, #f56565 100%);
  color: white;
  border-radius: 16px;
  box-shadow: 0 6px 24px rgba(245, 101, 101, 0.3);
}

.out-of-stock-notice p {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.message-alert {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 15px;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-alert.success {
  background: #d4edda;
  color: #155724;
  border: 2px solid #c3e6cb;
}

.message-alert.success svg {
  color: #28a745;
}

.message-alert.error {
  background: #f8d7da;
  color: #721c24;
  border: 2px solid #f5c6cb;
}

.message-alert.error svg {
  color: #dc3545;
}

.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  font-size: 16px;
  border: 2px solid #667eea;
  border-radius: 12px;
  transition: all 0.3s ease;
  width: fit-content;
}

.btn-back:hover {
  background: #667eea;
  color: white;
  transform: translateX(-4px);
}

.btn-back svg {
  transition: transform 0.3s ease;
}

.btn-back:hover svg {
  transform: translateX(-4px);
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  min-height: 60vh;
  text-align: center;
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 4px solid #e2e8f0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading p {
  font-size: 18px;
  color: #718096;
  font-weight: 600;
  margin: 0;
}

@media (max-width: 1024px) {
  .product-detail {
    gap: 40px;
  }
  
  .product-title {
    font-size: 36px;
  }
  
  .price {
    font-size: 40px;
  }
}

@media (max-width: 768px) {
  .product-detail-container {
    padding: 20px;
  }
  
  .product-detail {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .product-title {
    font-size: 28px;
  }
  
  .price {
    font-size: 36px;
  }
  
  .product-image-placeholder {
    min-height: 300px;
  }
  
  .attributes-grid {
    grid-template-columns: 1fr;
  }
  
  .stock-badge {
    top: 12px;
    right: 12px;
    padding: 8px 16px;
    font-size: 11px;
  }
}
</style>