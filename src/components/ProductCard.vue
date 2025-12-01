<template>
  <div class="product-card">
    <div class="product-image-container">
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
        <span>No Image</span>
      </div>
      
      <div class="stock-badge" :class="stockClass">
        <span class="stock-icon" v-if="product.stock_quantity > 0">●</span>
        {{ stockStatus }}
      </div>
      
      <div class="category-badge" v-if="product.category">
        {{ product.category }}
      </div>
    </div>
    
    <div class="product-info">
      <div class="product-content">
        <div class="product-header">
          <h3 class="product-name">{{ product.name }}</h3>
          <p class="product-sku" v-if="product.sku">SKU: {{ product.sku }}</p>
        </div>
        
        <p class="product-description">{{ truncateDescription(product.description) }}</p>
        
        <div class="product-meta">
          <div class="price-section">
            <span class="price-label">Price</span>
            <span class="product-price">${{ product.price.toFixed(2) }}</span>
          </div>
          
          <div class="stock-quantity-info" v-if="product.stock_quantity > 0 && product.stock_quantity < 50">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            </svg>
            {{ product.stock_quantity }} left
          </div>
        </div>
      </div>
      
      <router-link 
        :to="{ name: 'ProductDetail', params: { id: product.id }}" 
        class="btn-details"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 16 16 12 12 8"></polyline>
          <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
        View Details
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductCard',
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  computed: {
    stockStatus() {
      if (!this.product.stock_quantity || this.product.stock_quantity === 0) {
        return 'Out of Stock';
      } else if (this.product.stock_quantity < 10) {
        return `Only ${this.product.stock_quantity} left`;
      } else {
        return 'In Stock';
      }
    },
    stockClass() {
      if (!this.product.stock_quantity || this.product.stock_quantity === 0) {
        return 'out-of-stock';
      } else if (this.product.stock_quantity < 10) {
        return 'low-stock';
      } else {
        return 'in-stock';
      }
    }
  },
  methods: {
    truncateDescription(description) {
      if (!description) return '';
      if (description.length <= 80) return description;
      return description.substring(0, 80) + '...';
    }
  }
};
</script>

<style scoped>
.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  border-color: rgba(66, 185, 131, 0.3);
}

/* Image Container */
.product-image-container {
  width: 100%;
  height: 240px;
  overflow: hidden;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  position: relative;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.product-card:hover .product-image {
  transform: scale(1.08);
}

.product-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  gap: 12px;
}

.product-image-placeholder svg {
  width: 48px;
  height: 48px;
  opacity: 0.9;
}

.product-image-placeholder span {
  font-size: 14px;
  font-weight: 500;
  opacity: 0.9;
}

/* Badges */
.stock-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.stock-icon {
  font-size: 8px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
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
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: rgba(255, 255, 255, 0.95);
  color: #667eea;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Product Info */
.product-info {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex-grow: 1;
}

.product-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex-grow: 1;
}

.product-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.product-name {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #2d3748;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 50px;
}

.product-sku {
  margin: 0;
  font-size: 12px;
  color: #a0aec0;
  font-weight: 500;
  font-family: monospace;
}

.product-description {
  font-size: 14px;
  color: #718096;
  margin: 0;
  text-align: left;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 42px;
}

/* Meta Section */
.product-meta {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 12px;
  border-top: 1px solid #e2e8f0;
}

.price-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price-label {
  font-size: 12px;
  color: #a0aec0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
}

.product-price {
  font-size: 24px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  white-space: nowrap;
}

.stock-quantity-info {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #718096;
  font-weight: 500;
  padding: 6px 10px;
  background: #f7fafc;
  border-radius: 6px;
}

.stock-quantity-info svg {
  color: #667eea;
}

/* Button */
.btn-details {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 14px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 15px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  margin-top: auto;
}

.btn-details:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-details:active {
  transform: translateY(0);
}

.btn-details svg {
  transition: transform 0.3s ease;
}

.btn-details:hover svg {
  transform: translateX(4px);
}

/* Responsive */
@media (max-width: 768px) {
  .product-image-container {
    height: 200px;
  }
  
  .product-info {
    padding: 16px;
  }
  
  .product-name {
    font-size: 16px;
    min-height: 44px;
  }
  
  .product-description {
    font-size: 13px;
    min-height: 38px;
  }
  
  .product-price {
    font-size: 20px;
  }
  
  .btn-details {
    padding: 12px 16px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .product-image-container {
    height: 180px;
  }
  
  .product-info {
    padding: 14px;
    gap: 8px;
  }
  
  .product-content {
    gap: 6px;
  }
  
  .stock-badge,
  .category-badge {
    font-size: 10px;
    padding: 5px 10px;
  }
}
</style>