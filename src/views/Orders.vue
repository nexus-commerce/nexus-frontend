<template>
  <div class="orders-page">
    <div class="page-header">
      <div class="header-content">
        <h1>My Orders</h1>
        <p>Track and manage all your orders</p>
      </div>
      <div class="header-actions" v-if="orders.length > 0">
        <button @click="refreshOrders" class="btn-refresh">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="23 4 23 10 17 10"></polyline>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
          </svg>
          Refresh
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading your orders...</p>
    </div>

    <div v-else-if="orders.length > 0" class="orders-content">
      <div class="summary-cards">
        <div class="summary-card gradient-purple">
          <div class="summary-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            </svg>
          </div>
          <div class="summary-info">
            <p class="summary-label">Total Orders</p>
            <h3>{{ filteredOrders.length }}</h3>
          </div>
        </div>
        <div class="summary-card gradient-green">
          <div class="summary-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
          <div class="summary-info">
            <p class="summary-label">Total Spent</p>
            <h3>${{ totalSpent.toFixed(2) }}</h3>
          </div>
        </div>
        <div class="summary-card gradient-blue">
          <div class="summary-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div class="summary-info">
            <p class="summary-label">Confirmed</p>
            <h3>{{ confirmedOrders }}</h3>
          </div>
        </div>
        <div class="summary-card gradient-orange">
          <div class="summary-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div class="summary-info">
            <p class="summary-label">Pending</p>
            <h3>{{ pendingOrders }}</h3>
          </div>
        </div>
      </div>
      
      <div class="filters-section">
        <div class="filter-item">
          <label>Status Filter:</label>
          <select v-model="statusFilter" class="filter-select">
            <option value="">All Orders</option>
            <option value="STATUS_PENDING">Pending</option>
            <option value="STATUS_PAID">Paid</option>
            <option value="STATUS_CONFIRMED">Confirmed</option>
            <option value="STATUS_CANCELLED">Cancelled</option>
          </select>
        </div>
        <div class="filter-item">
          <label>Sort By:</label>
          <select v-model="sortOrder" class="filter-select">
            <option value="newest">Newest First</option>
            <option value="amount-high">Highest Amount</option>
            <option value="amount-low">Lowest Amount</option>
          </select>
        </div>
      </div>

      <div v-if="filteredAndSortedOrders.length > 0" class="orders-grid">
        <div v-for="order in filteredAndSortedOrders" :key="order.id" class="order-card" :class="'card-' + getStatusClass(order.status)">
          <div class="card-header">
            <div class="order-id">
              <span class="label">Order #{{ String(order.id).substring(0, 8) }}</span>
              <span class="points">...</span>
            </div>
            <span class="status-badge" :class="getStatusClass(order.status)">
              {{ formatStatus(order.status) }}
            </span>
          </div>

          <div class="card-body">
            <div class="order-info">
              <div class="info-item">
                <span class="icon">💵</span>
                <div class="info-content">
                  <span class="info-label">Total Amount</span>
                  <span class="info-value">${{ order.total_price.toFixed(2) }}</span>
                </div>
              </div>
              
              <div class="info-item">
                <span class="icon">📋</span>
                <div class="info-content">
                  <span class="info-label">Items</span>
                  <span class="info-value">{{ order.items.length }} item{{ order.items.length !== 1 ? 's' : '' }}</span>
                </div>
              </div>
              
              <div class="info-item full-width">
                <span class="icon">📍</span>
                <div class="info-content">
                  <span class="info-label">Shipping Address</span>
                  <span class="info-value address">{{ order.shipping_address }}</span>
                </div>
              </div>
            </div>

            <div class="order-items-preview">
              <h4>Order Items:</h4>
              <div class="items-list">
                <div v-for="(item, index) in order.items.slice(0, 3)" :key="index" class="item-row">
                  <span class="item-sku">{{ item.sku }}</span>
                  <span class="item-quantity">Qty: {{ item.quantity }}</span>
                  <span class="item-price">${{ parseFloat(item.price).toFixed(2) }}</span>
                </div>
                <div v-if="order.items.length > 3" class="more-items">
                  +{{ order.items.length - 3 }} more item{{ order.items.length - 3 !== 1 ? 's' : '' }}
                </div>
              </div>
            </div>
          </div>

          <div class="card-footer">
            <button @click="viewOrderDetails(order.id)" class="btn-details">
              View Full Details →
            </button>
          </div>
        </div>
      </div>

      <div v-else class="no-results">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <p>No orders found with the selected status.</p>
        <button @click="statusFilter = ''" class="btn-reset">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="1 4 1 10 7 10"></polyline>
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
          </svg>
          Show All Orders
        </button>
      </div>
    </div>

    <div v-else class="empty-state">
      <div class="empty-container">
        <div class="empty-icon">📦</div>
        <h3>No Orders Yet</h3>
        <p>You haven't placed any orders yet. Start shopping to see your orders here!</p>
        <router-link to="/products" class="btn-shop">
          Browse Products
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/services/api';

export default {
  data() {
    return {
      orders: [],
      loading: true,
      statusFilter: '',
      sortOrder: 'newest'
    };
  },
  computed: {
    filteredOrders() {
      if (!this.statusFilter) {
        return this.orders;
      }
      return this.orders.filter(order => order.status === this.statusFilter);
    },
    filteredAndSortedOrders() {
      let filtered = [...this.filteredOrders];
      
      filtered.sort((a, b) => {
        if (this.sortOrder === 'newest') {
          return new Date(b.created_at || 0) - new Date(a.created_at || 0);
        } else if (this.sortOrder === 'amount-high') {
          return parseFloat(b.total_price || 0) - parseFloat(a.total_price || 0);
        } else if (this.sortOrder === 'amount-low') {
          return parseFloat(a.total_price || 0) - parseFloat(b.total_price || 0);
        }
        return 0;
      });
      
      return filtered;
    },
    totalSpent() {
      return this.filteredOrders.reduce((sum, order) => {
        return sum + parseFloat(order.total_price || 0);
      }, 0);
    },
    confirmedOrders() {
      return this.filteredOrders.filter(order => 
        order.status === 'STATUS_CONFIRMED'
      ).length;
    },
    pendingOrders() {
      return this.filteredOrders.filter(order => 
        order.status === 'STATUS_PENDING'
      ).length;
    }
  },
  async created() {
    await this.fetchOrders();
  },
  methods: {
    async fetchOrders() {
      this.loading = true;
      try {
        const response = await api.getOrders();
        this.orders = response.data.orders || [];
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        this.orders = [];
      } finally {
        this.loading = false;
      }
    },
    async refreshOrders() {
      await this.fetchOrders();
    },
    formatStatus(status) {
      return status.replace('STATUS_', '').replace('_', ' ').toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    },
    getStatusClass(status) {
      const statusMap = {
        'STATUS_PENDING': 'status-pending',
        'STATUS_PAID': 'status-paid',
        'STATUS_CONFIRMED': 'status-confirmed',
        'STATUS_CANCELLED': 'status-cancelled'
      };
      return statusMap[status] || 'status-default';
    },
    viewOrderDetails(orderId) {
      this.$router.push({ name: 'OrderDetail', params: { id: orderId } });
    }
  }
};
</script>

<style scoped>
.orders-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px 40px;
}

/* Page Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 30px 0;
}

.header-content h1 {
  font-size: 36px;
  font-weight: 800;
  color: #2d3748;
  margin: 0 0 8px 0;
}

.header-content p {
  font-size: 16px;
  color: #718096;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.btn-refresh {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  color: #2d3748;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-refresh:hover {
  border-color: #667eea;
  color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  min-height: 50vh;
  gap: 20px;
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

.loading-state p {
  margin: 0;
  color: #718096;
  font-size: 18px;
  font-weight: 600;
}

/* Summary Cards */
.summary-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.summary-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  color: white;
  position: relative;
  overflow: hidden;
}

.summary-card::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 100px;
  height: 100px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  transform: translate(30%, -30%);
}

.summary-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.summary-card.gradient-purple {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.summary-card.gradient-green {
  background: linear-gradient(135deg, #42b983 0%, #38a169 100%);
}

.summary-card.gradient-blue {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.summary-card.gradient-orange {
  background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
}

.summary-icon {
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.summary-info {
  flex: 1;
}

.summary-label {
  font-size: 13px;
  opacity: 0.9;
  margin: 0 0 4px 0;
  font-weight: 500;
}

.summary-info h3 {
  margin: 0;
  font-size: 32px;
  font-weight: 800;
}

/* Filters Section */
.filters-section {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.filter-item label {
  font-size: 14px;
  font-weight: 600;
  color: #2d3748;
  white-space: nowrap;
}

.filter-select {
  padding: 8px 32px 8px 12px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #2d3748;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%232d3748' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
}

.filter-select:hover {
  border-color: #667eea;
}

.filter-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* Orders Grid */
.orders-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-bottom: 20px;
}

/* Order Card */
.order-card {
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  border-left-width: 4px;
}

.order-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

/* Card Status Border Colors */
.order-card.card-status-pending {
  border-left-color: #f59e0b;
}

.order-card.card-status-paid {
  border-left-color: #3b82f6;
}

.order-card.card-status-confirmed {
  border-left-color: #10b981;
}

.order-card.card-status-cancelled {
  border-left-color: #ef4444;
}

/* Card Header */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
}

.order-id {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.order-id .label {
  font-size: 12px;
  color: #666;
  text-transform: uppercase;
  font-weight: 600;
}

.order-id .id-value {
  font-size: 16px;
  color: #333;
  font-weight: bold;
  font-family: monospace;
}

.status-badge {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-pending {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
}

.status-paid {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.status-confirmed {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

.status-cancelled {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
}

.status-default {
  background-color: #e2e3e5;
  color: #383d41;
}

/* Card Body */
.card-body {
  padding: 20px;
  flex-grow: 1;
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.info-item .icon {
  font-size: 20px;
  min-width: 20px;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex-grow: 1;
}

.info-label {
  font-size: 12px;
  color: #666;
  font-weight: 600;
  text-transform: uppercase;
}

.info-value {
  font-size: 16px;
  color: #333;
  font-weight: 500;
}

.info-value.address {
  font-size: 14px;
  line-height: 1.4;
  color: #555;
}

/* Order Items Preview */
.order-items-preview {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #e0e0e0;
}

.order-items-preview h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #666;
  text-transform: uppercase;
  font-weight: 600;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.item-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: #f8f9fa;
  border-radius: 6px;
  font-size: 13px;
}

.item-sku {
  color: #333;
  font-weight: 500;
  font-family: monospace;
}

.item-quantity {
  color: #666;
}

.item-price {
  color: #28a745;
  font-weight: 600;
}

.more-items {
  padding: 8px 12px;
  text-align: center;
  color: #666;
  font-size: 13px;
  font-style: italic;
}

/* Card Footer */
.card-footer {
  padding: 15px 20px;
  background-color: #f8f9fa;
  border-top: 1px solid #e0e0e0;
}

.btn-details {
  width: 100%;
  padding: 12px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-details:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

/* No Results State */
.no-results {
  text-align: center;
  padding: 60px 40px;
  background: white;
  border-radius: 16px;
  margin-top: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 2px dashed #e2e8f0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.no-results svg {
  color: #a0aec0;
}

.no-results p {
  margin: 0;
  font-size: 16px;
  color: #718096;
  font-weight: 500;
}

.btn-reset {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);
}

.btn-reset:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(108, 117, 125, 0.4);
}

/* Empty State */
.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
  padding: 60px 20px;
}

.empty-container {
  max-width: 500px;
  text-align: center;
  background: white;
  border-radius: 20px;
  padding: 60px 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  animation: fadeIn 0.5s ease;
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

.empty-icon {
  width: 100px;
  height: 100px;
  margin: 0 auto 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
}

.empty-state h3 {
  margin: 0 0 12px 0;
  color: #2d3748;
  font-size: 28px;
  font-weight: 800;
}

.empty-state p {
  margin: 0 0 32px 0;
  color: #718096;
  font-size: 16px;
  line-height: 1.6;
}

.btn-shop {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 32px;
  background: linear-gradient(135deg, #42b983 0%, #38a169 100%);
  color: white;
  text-decoration: none;
  border-radius: 50px;
  font-weight: 700;
  font-size: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(66, 185, 131, 0.3);
}

.btn-shop:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(66, 185, 131, 0.4);
}

/* Responsive */
@media (max-width: 1200px) {
  .summary-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 1024px) {
  .orders-page {
    padding: 0 30px 30px;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .orders-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .orders-page {
    padding: 0 20px 20px;
  }
  
  .page-header {
    padding: 20px 0;
  }
  
  .header-content h1 {
    font-size: 28px;
  }
  
  .header-content p {
    font-size: 14px;
  }
  
  .header-actions {
    width: 100%;
  }
  
  .btn-refresh {
    width: 100%;
    justify-content: center;
  }
  
  .summary-cards {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .filters-section {
    flex-direction: column;
    gap: 12px;
  }
  
  .filter-item {
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    gap: 8px;
  }
  
  .filter-select {
    width: 100%;
  }
  
  .orders-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
</style>