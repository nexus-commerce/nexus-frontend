<template>
  <div class="products-page">
    <div class="page-header">
      <div class="header-content">
        <h1>Products</h1>
        <p class="header-subtitle">Browse our collection of amazing products</p>
      </div>
    </div>
    
    <div class="filters">
      <div class="search-wrapper">
        <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
        <input 
          type="text" 
          v-model="searchFilter" 
          @input="handleSearch"
          placeholder="Search products by name, category, or SKU..."
          class="search-input"
        />
        <button v-if="searchFilter" @click="clearSearch" class="btn-clear-input">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
    
    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
      <p>Loading products...</p>
    </div>
    
    <div v-else-if="products.length > 0" class="product-list">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
      />
    </div>
    
    <div v-else class="no-products">
      <div class="no-products-card">
        <div class="no-products-icon">
          <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M16 16s-1.5-2-4-2-4 2-4 2"></path>
            <line x1="9" y1="9" x2="9.01" y2="9"></line>
            <line x1="15" y1="9" x2="15.01" y2="9"></line>
          </svg>
        </div>
        <h3>No Products Found</h3>
        <p v-if="searchFilter">
          We couldn't find any products matching <strong>"{{ searchFilter }}"</strong>
        </p>
        <p v-else>
          No products are currently available.
        </p>
        <button v-if="searchFilter" @click="clearSearch" class="btn-clear-search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="1 4 1 10 7 10"></polyline>
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
          </svg>
          Clear Search
        </button>
        <router-link v-else to="/" class="btn-go-home">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          Go to Home
        </router-link>
      </div>
    </div>
    
    <div v-if="products.length > 0 && hasNextPage" class="pagination">
      <button @click="loadMoreProducts" class="btn-load-more">
        Load More Products
      </button>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import ProductCard from '@/components/ProductCard.vue';

export default {
  components: {
    ProductCard
  },
  data() {
    return {
      searchFilter: '',
      currentPage: 1,
      loading: false,
      searchTimeout: null
    };
  },
  computed: {
    ...mapState(['products', 'productsNextPage']),
    hasNextPage() {
      return this.productsNextPage !== null && this.productsNextPage !== undefined;
    }
  },
  methods: {
    ...mapActions(['fetchProducts']),
    
    async loadProducts(append = false) {
      this.loading = true;
      try {
        await this.fetchProducts({
          filter: this.searchFilter,
          page: this.currentPage,
          pageSize: 6,
          append
        });
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        this.loading = false;
      }
    },
    
    handleSearch() {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }
      
      this.searchTimeout = setTimeout(() => {
        this.currentPage = 1;
        this.loadProducts(false);
      }, 500);
    },
    
    async loadMoreProducts() {
      if (this.hasNextPage) {
        this.currentPage = this.productsNextPage;
        await this.loadProducts(true);
      }
    },
    
    clearSearch() {
      this.searchFilter = '';
      this.currentPage = 1;
      this.loadProducts(false);
    }
  },
  created() {
    this.loadProducts();
  }
};
</script>

<style scoped>
.products-page {
  max-width: 100%;
  width: 900px;
  margin: 0 auto;
  padding: 40px;
  min-height: 1030px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
}

.page-header {
  margin-bottom: 30px;
}

.header-content h1 {
  margin: 0 0 8px 0;
  font-size: 36px;
  font-weight: 800;
  color: #2d3748;
  letter-spacing: -0.5px;
}

.header-subtitle {
  margin: 0;
  font-size: 16px;
  color: #718096;
  font-weight: 500;
}

.filters {
  margin-bottom: 30px;
}

.search-wrapper {
  position: relative;
  max-width: 600px;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 16px;
  color: #a0aec0;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 14px 48px 14px 48px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 500;
  color: #2d3748;
  background: white;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.search-input::placeholder {
  color: #a0aec0;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1), 0 4px 16px rgba(0, 0, 0, 0.08);
}

.btn-clear-input {
  position: absolute;
  right: 12px;
  padding: 6px;
  background: #f7fafc;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: #718096;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-clear-input:hover {
  background: #e2e8f0;
  color: #2d3748;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  text-align: center;
  padding: 80px 20px;
  min-height: 400px;
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading p {
  margin: 0;
  font-size: 18px;
  color: #718096;
  font-weight: 600;
}

.product-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 10px;
}

@media (max-width: 1024px) {
  .products-page {
    padding: 30px;
  }
  
  .product-list {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

@media (max-width: 768px) {
  .products-page {
    padding: 20px;
  }

  .header-content h1 {
    font-size: 28px;
  }

  .search-wrapper {
    max-width: 100%;
  }

  .search-input {
    padding: 12px 48px 12px 48px;
    font-size: 14px;
  }

  .no-products-card {
    padding: 40px 30px;
  }

  .no-products-icon {
    width: 110px;
    height: 110px;
  }

  .no-products-icon svg {
    width: 64px;
    height: 64px;
  }

  .no-products-card h3 {
    font-size: 32px;
  }

  .no-products-card p {
    font-size: 18px;
  }

  .no-products-card p strong {
    font-size: 20px;
  }
}

@media (max-width: 640px) {
  .products-page {
    padding: 20px 15px;
  }

  .header-content h1 {
    font-size: 24px;
  }

  .header-subtitle {
    font-size: 14px;
  }
  
  .product-list {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .no-products-card {
    padding: 30px 20px;
  }

  .no-products-icon {
    width: 100px;
    height: 100px;
  }

  .no-products-icon svg {
    width: 56px;
    height: 56px;
  }

  .no-products-card h3 {
    font-size: 28px;
  }

  .no-products-card p {
    font-size: 17px;
  }

  .no-products-card p strong {
    font-size: 19px;
  }

  .btn-clear-search,
  .btn-go-home {
    width: 100%;
    justify-content: center;
  }
}

.no-products {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;
  min-height: 400px;
}

.no-products-card {
  text-align: center;
  padding: 70px 50px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 2px dashed #e2e8f0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  max-width: 600px;
  width: 100%;
}

.no-products-icon {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 24px rgba(240, 147, 251, 0.3);
}

.no-products-icon svg {
  width: 72px;
  height: 72px;
}

.no-products-card h3 {
  margin: 0;
  font-size: 36px;
  font-weight: 800;
  color: #2d3748;
  letter-spacing: -0.5px;
}

.no-products-card p {
  margin: 0;
  font-size: 20px;
  color: #718096;
  font-weight: 500;
  line-height: 1.7;
}

.no-products-card p strong {
  color: #2d3748;
  font-weight: 700;
  font-size: 22px;
}

.btn-clear-search,
.btn-go-home {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 15px;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  margin-top: 8px;
}

.btn-clear-search:hover,
.btn-go-home:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.btn-clear-search:active,
.btn-go-home:active {
  transform: translateY(0);
}

.pagination {
  text-align: center;
  margin-top: 10px;
  padding: 0;
}

.btn-load-more {
  padding: 6px 16px;
  background: linear-gradient(135deg, #42b983 0%, #38a169 100%);
  color: white;
  border: none;
  border-radius: 25px;
  margin-top: 20px;
  cursor: pointer;
  font-weight: 700;
  font-size: 13px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(66, 185, 131, 0.3);
}

.btn-load-more:hover {
  transform: translateY(-2px);
  box-shadow: 0 3px 10px rgba(66, 185, 131, 0.4);
}

.btn-load-more:active {
  transform: translateY(0);
}
</style>