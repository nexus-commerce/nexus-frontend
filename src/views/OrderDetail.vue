<template>
  <div v-if="order" class="order-detail">
    <div class="page-header">
      <button @click="goBack" class="btn-back">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Back to Orders
      </button>
      <div class="header-content">
        <h1>Order Details</h1>
        <p class="header-subtitle">View complete information about your order</p>
      </div>
      <button @click="fetchOrderDetails" class="btn-refresh">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="1 4 1 10 7 10"></polyline>
          <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
        </svg>
        Refresh
      </button>
    </div>

    <div class="order-info-card">
      <h3 class="card-title">Order Information</h3>
      <div class="info-grid">
        <div class="info-item">
          <label>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 6v6l4 2"></path>
            </svg>
            Order ID
          </label>
          <span class="value order-id">{{ String(order.id).substring(0, 8) }}...</span>
        </div>
        <div class="info-item">
          <label>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            </svg>
            Status
          </label>
          <span :class="'status-badge ' + getStatusClass(order.status)">
            {{ formatStatus(order.status) }}
          </span>
        </div>
        <div class="info-item full-width">
          <label>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            Shipping Address
          </label>
          <span class="value address">{{ order.shipping_address }}</span>
        </div>
        <div class="info-item">
          <label>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
            Total Amount
          </label>
          <span class="value total-price">${{ order.total_price.toFixed(2) }}</span>
        </div>
        <div class="info-item" v-if="order.user_id">
          <label>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            User ID
          </label>
          <span class="value">{{ order.user_id }}</span>
        </div>
      </div>
    </div>

    <div class="items-section">
      <div class="section-header">
        <h3 class="section-title">Order Items</h3>
        <span class="items-count">{{ order.items.length }} {{ order.items.length === 1 ? 'item' : 'items' }}</span>
      </div>
      <div class="items-table-card">
        <div class="table-header">
          <div class="col-sku">SKU</div>
          <div class="col-quantity">Quantity</div>
          <div class="col-price">Unit Price</div>
          <div class="col-total">Total</div>
        </div>
        <div 
          v-for="(item, index) in order.items" 
          :key="index" 
          class="table-row"
        >
          <div class="col-sku">{{ item.sku }}</div>
          <div class="col-quantity">{{ item.quantity }}</div>
          <div class="col-price">${{ parseFloat(item.price).toFixed(2) }}</div>
          <div class="col-total">${{ calculateItemTotal(item) }}</div>
        </div>
      </div>

      <div class="order-summary-card">
        <div class="summary-row">
          <span class="summary-label">Total Items:</span>
          <span class="summary-value">{{ order.items.length }}</span>
        </div>
        <div class="summary-divider"></div>
        <div class="summary-row total-row">
          <span class="summary-label">Order Total:</span>
          <span class="summary-value total-amount">${{ order.total_price.toFixed(2) }}</span>
        </div>
      </div>
    </div>

    <div class="actions-section">
      <button @click="goBack" class="btn-secondary">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Back to Orders
      </button>
      <button 
        v-if="order.status === 'STATUS_PENDING'" 
        @click="cancelOrder" 
        class="btn-danger"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
        Cancel Order
      </button>
    </div>
  </div>

  <div v-else-if="loading" class="loading-state">
    <div class="loading-spinner"></div>
    <p>Loading order details...</p>
  </div>

  <div v-else class="error-state">
    <div class="error-icon">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
    </div>
    <h3>Order Not Found</h3>
    <p>The order you're looking for doesn't exist or you don't have permission to view it.</p>
    <button @click="goBack" class="btn-primary">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M19 12H5M12 19l-7-7 7-7"/>
      </svg>
      Back to Orders
    </button>
  </div>
</template>

<script>
import api from '@/services/api';

export default {
  name: 'OrderDetail',
  data() {
    return {
      order: null,
      loading: true
    };
  },
  async created() {
    await this.fetchOrderDetails();
  },
  methods: {
    async fetchOrderDetails() {
      const orderId = this.$route.params.id;
      this.loading = true;
      
      try {
        const response = await api.getOrder(orderId);
        this.order = response.data.order;
      } catch (error) {
        console.error('Failed to fetch order details:', error);
        this.order = null;
      } finally {
        this.loading = false;
      }
    },
    
    formatStatus(status) {
      if (!status) return 'Unknown';
      
      const statusLower = status.toLowerCase();
      
      if (statusLower.includes('pending')) {
        return 'Pending';
      } else if (statusLower.includes('paid')) {
        return 'Paid';
      } else if (statusLower.includes('confirmed')) {
        return 'Confirmed';
      } else if (statusLower.includes('cancelled')) {
        return 'Cancelled';
      }
      
      return status
        .replace('STATUS_', '')
        .replace(/_/g, ' ')
        .toLowerCase()
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
      return statusMap[status] || '';
    },
    
    calculateItemTotal(item) {
      const price = parseFloat(item.price);
      const quantity = parseInt(item.quantity);
      return (price * quantity).toFixed(2);
    },
    
    goBack() {
      this.$router.push('/orders');
    },
    
    async cancelOrder() {
      if (!confirm('Are you sure you want to cancel this order?')) {
        return;
      }
      
      alert('Order cancellation feature requires backend API support.');
    }
  }
};
</script>

<style scoped>
.order-detail {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
  min-height: calc(100vh - 80px);
}

/* Page Header */
.page-header {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid rgba(0, 0, 0, 0.05);
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

.btn-back {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: white;
  color: #2d3748;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.btn-back:hover {
  border-color: #cbd5e0;
  background: #f7fafc;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn-refresh {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
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

.btn-refresh:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.order-info-card {
  background: white;
  padding: 32px;
  border-radius: 16px;
  margin-bottom: 30px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.card-title {
  margin: 0 0 24px 0;
  font-size: 24px;
  font-weight: 700;
  color: #2d3748;
  padding-bottom: 16px;
  border-bottom: 2px solid #e2e8f0;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.info-item label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #718096;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-item label svg {
  color: #667eea;
}

.info-item .value {
  font-size: 16px;
  font-weight: 500;
  color: #2d3748;
  padding: 12px 16px;
  background: #f7fafc;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
}

.value.order-id {
  font-family: 'Courier New', monospace;
  font-weight: 700;
  color: #667eea;
}

.value.address {
  line-height: 1.6;
}

.total-price {
  font-size: 24px !important;
  font-weight: 800;
  color: #667eea;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%) !important;
  border-color: #667eea !important;
}

.status-badge {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 14px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.status-pending {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: white;
}

.status-paid {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
}

.status-confirmed {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.status-cancelled {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.items-section {
  background: white;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  margin-bottom: 30px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #2d3748;
}

.items-count {
  font-size: 15px;
  color: #718096;
  font-weight: 600;
  padding: 6px 12px;
  background: #f7fafc;
  border-radius: 8px;
}

.items-table-card {
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 24px;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 20px;
  padding: 20px;
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  font-weight: 700;
  font-size: 14px;
  color: #2d3748;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #e2e8f0;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 20px;
  padding: 20px;
  border-bottom: 1px solid #e2e8f0;
  align-items: center;
  transition: all 0.2s;
}

.table-row:last-child {
  border-bottom: none;
}

.table-row:hover {
  background: #f7fafc;
}

.col-sku {
  font-weight: 600;
  color: #2d3748;
  font-family: 'Courier New', monospace;
}

.col-quantity,
.col-price,
.col-total {
  text-align: right;
  font-weight: 500;
  color: #4a5568;
}

.col-total {
  font-weight: 700;
  color: #2d3748;
  font-size: 16px;
}

.order-summary-card {
  background: #f7fafc;
  padding: 28px;
  border-radius: 12px;
  max-width: 400px;
  margin-left: auto;
  border: 2px solid #e2e8f0;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
}

.summary-divider {
  height: 1px;
  background: #e2e8f0;
  margin: 8px 0;
}

.total-row {
  padding: 16px 0 0 0;
  border-top: 2px solid #e2e8f0;
  margin-top: 8px;
}

.summary-label {
  font-size: 15px;
  color: #718096;
  font-weight: 600;
}

.summary-value {
  font-size: 16px;
  color: #2d3748;
  font-weight: 600;
}

.total-row .summary-label {
  font-size: 18px;
  font-weight: 700;
  color: #2d3748;
}

.total-amount {
  font-size: 28px;
  font-weight: 800;
  color: #667eea;
}

.actions-section {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-top: 30px;
  padding-top: 30px;
  border-top: 2px solid #e2e8f0;
}

.btn-secondary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 15px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);
}

.btn-secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(108, 117, 125, 0.4);
}

.btn-danger {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  background: linear-gradient(135deg, #ef5350 0%, #e53935 100%);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 15px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(239, 83, 80, 0.3);
}

.btn-danger:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(239, 83, 80, 0.4);
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  min-height: 60vh;
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
  font-size: 18px;
  color: #718096;
  font-weight: 600;
}

.error-state {
  text-align: center;
  padding: 80px 40px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.error-icon {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ef5350 0%, #e53935 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 24px rgba(239, 83, 80, 0.3);
}

.error-state h3 {
  margin: 0;
  font-size: 28px;
  font-weight: 800;
  color: #2d3748;
}

.error-state p {
  margin: 0;
  font-size: 16px;
  color: #718096;
  line-height: 1.6;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  background: linear-gradient(135deg, #42b983 0%, #10b981 100%);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 15px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(66, 185, 131, 0.4);
}

@media (max-width: 768px) {
  .order-detail {
    padding: 20px;
  }

  .page-header {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .header-content h1 {
    font-size: 28px;
  }

  .btn-refresh {
    width: 100%;
    justify-content: center;
  }

  .order-info-card,
  .items-section {
    padding: 24px;
  }

  .info-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .card-title,
  .section-title {
    font-size: 20px;
  }

  .table-header,
  .table-row {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .table-header {
    display: none;
  }

  .table-row {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 16px;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    margin-bottom: 12px;
    background: #f7fafc;
  }

  .table-row:last-child {
    margin-bottom: 0;
  }

  .col-sku::before {
    content: 'SKU: ';
    font-weight: 700;
    color: #718096;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .col-quantity::before {
    content: 'Quantity: ';
    font-weight: 700;
    color: #718096;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .col-price::before {
    content: 'Unit Price: ';
    font-weight: 700;
    color: #718096;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .col-total::before {
    content: 'Total: ';
    font-weight: 700;
    color: #718096;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .col-quantity,
  .col-price,
  .col-total {
    text-align: left;
  }
  
  .order-summary-card {
    max-width: 100%;
    margin: 0;
  }
  
  .actions-section {
    flex-direction: column;
  }

  .btn-secondary,
  .btn-danger,
  .btn-primary {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 640px) {
  .order-detail {
    padding: 15px;
  }

  .header-content h1 {
    font-size: 24px;
  }

  .order-info-card,
  .items-table-card,
  .order-summary-card {
    padding: 20px;
  }
}
</style>

