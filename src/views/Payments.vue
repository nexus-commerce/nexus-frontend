<template>
  <div class="payments-container">
    <div class="page-header">
      <div class="header-content">
        <h1>Payment History</h1>
        <p>Track and manage all your payment transactions</p>
      </div>
      <div class="header-actions" v-if="payments.length > 0">
        <button @click="refreshPayments" class="btn-refresh">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="23 4 23 10 17 10"></polyline>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
          </svg>
          Refresh
        </button>
      </div>
    </div>
    
    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
      <p>Loading payment history...</p>
    </div>
    
    <div v-else-if="payments.length > 0" class="payments-content">
      <div class="payments-summary">
        <div class="summary-card gradient-blue">
          <div class="summary-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
              <line x1="1" y1="10" x2="23" y2="10"></line>
            </svg>
          </div>
          <div class="summary-info">
            <p class="summary-label">Total Payments</p>
            <h3>{{ payments.length }}</h3>
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
            <h3>${{ totalAmount.toFixed(2) }}</h3>
          </div>
        </div>
        <div class="summary-card gradient-purple">
          <div class="summary-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div class="summary-info">
            <p class="summary-label">Successful</p>
            <h3>{{ successfulPayments }}</h3>
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
            <p class="summary-label">This Month</p>
            <h3>{{ currentMonthPayments }}</h3>
          </div>
        </div>
      </div>
      
      <div class="filters-section">
        <div class="filter-item">
          <label>Status Filter:</label>
          <select v-model="statusFilter" class="filter-select">
            <option value="">All Payments</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="refunded">Refunded</option>
            <option value="fail">Failed</option>
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

      <div v-if="filteredPayments.length > 0" class="payments-list">
        <div 
          v-for="payment in filteredPayments" 
          :key="payment.id" 
          class="payment-card"
          :class="'card-' + getStatusClass(payment.status)"
        >
          <div class="payment-header">
            <div class="payment-id">
              <span class="label">Payment ID:</span>
              <span class="value">{{ payment.id }}</span>
            </div>
            <span class="payment-status" :class="getStatusClass(payment.status)">
              {{ formatStatus(payment.status) }}
            </span>
          </div>

          <div class="payment-details">
            <div class="detail-row">
              <div class="detail-item">
                <span class="label">Amount:</span>
                <span class="value amount">${{ parseFloat(payment.amount).toFixed(2) }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Currency:</span>
                <span class="value">{{ formatCurrency(payment.currency) }}</span>
              </div>
            </div>

            <div class="detail-row">
              <div class="detail-item">
                <span class="label">Payment Method:</span>
                <span class="value">{{ formatPaymentMethod(payment.payment_method) }}</span>
              </div>
              <div class="detail-item" v-if="payment.order_id">
                <span class="label">Order ID:</span>
                <router-link :to="'/orders/' + payment.order_id" class="order-link">
                  {{ payment.order_id }}
                </router-link>
              </div>
            </div>

            <div 
              v-if="payment.gateway_transaction_id && payment.gateway_transaction_id.string_value" 
              class="detail-row"
            >
              <div class="detail-item full-width">
                <span class="label">Transaction ID:</span>
                <span class="value transaction-id">{{ payment.gateway_transaction_id.string_value }}</span>
              </div>
            </div>
          </div>

          <button 
            @click="viewPaymentDetails(payment)" 
            class="btn-details"
          >
            View Details
          </button>
        </div>
      </div>

      <div v-else-if="payments.length > 0" class="no-results">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <p>No payments found with the selected status.</p>
        <button @click="resetFilters" class="btn-reset">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="1 4 1 10 7 10"></polyline>
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
          </svg>
          Show All Payments
        </button>
      </div>
    </div>
    
    <div v-else class="empty-state">
      <div class="empty-icon">💳</div>
      <h3>No Payment History</h3>
      <p>You haven't made any payments yet.</p>
      <router-link to="/products" class="btn-shop">
        Start Shopping
      </router-link>
    </div>

    <div v-if="selectedPayment" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Payment Details</h3>
          <button @click="closeModal" class="btn-close">&times;</button>
        </div>
        
        <div class="modal-body">
          <div class="detail-section">
            <h4>Payment Information</h4>
            <div class="detail-grid">
              <div class="detail-item">
                <span class="label">Payment ID:</span>
                <span class="value">{{ selectedPayment.id }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Status:</span>
                <span :class="['badge', getStatusClass(selectedPayment.status)]">
                  {{ formatStatus(selectedPayment.status) }}
                </span>
              </div>
              <div class="detail-item">
                <span class="label">Amount:</span>
                <span class="value">${{ parseFloat(selectedPayment.amount).toFixed(2) }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Currency:</span>
                <span class="value">{{ formatCurrency(selectedPayment.currency) }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Payment Method:</span>
                <span class="value">{{ formatPaymentMethod(selectedPayment.payment_method) }}</span>
              </div>
              <div class="detail-item" v-if="selectedPayment.order_id">
                <span class="label">Order ID:</span>
                <router-link :to="'/orders/' + selectedPayment.order_id" class="order-link">
                  {{ selectedPayment.order_id }}
                </router-link>
              </div>
            </div>
          </div>

          <div 
            v-if="selectedPayment.gateway_transaction_id && selectedPayment.gateway_transaction_id.string_value" 
            class="detail-section"
          >
            <h4>Transaction Details</h4>
            <div class="transaction-box">
              <p class="transaction-id">{{ selectedPayment.gateway_transaction_id.string_value }}</p>
              <button @click="copyTransactionId" class="btn-copy">
                {{ copiedToClipboard ? '✓ Copied' : 'Copy ID' }}
              </button>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="closeModal" class="btn-close-modal">Close</button>
          <router-link 
            v-if="selectedPayment.order_id"
            :to="'/orders/' + selectedPayment.order_id"
            class="btn-view-order"
          >
            View Order
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/services/api';

export default {
  name: 'Payments',
  data() {
    return {
      payments: [],
      loading: true,
      selectedPayment: null,
      copiedToClipboard: false,
      statusFilter: '',
      sortOrder: 'newest'
    };
  },
  computed: {
    totalAmount() {
      return this.payments.reduce((sum, payment) => {
        return sum + parseFloat(payment.amount || 0);
      }, 0);
    },
    successfulPayments() {
      return this.payments.filter(p => 
        p.status && (p.status.toLowerCase().includes('completed') || p.status.toLowerCase().includes('success') || p.status.toLowerCase().includes('succeeded'))
      ).length;
    },
    currentMonthPayments() {
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      
      return this.payments.filter(p => {
        if (!p.created_at) return false;
        const paymentDate = new Date(p.created_at);
        return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
      }).length;
    },
    filteredPayments() {
      let filtered = [...this.payments];
      
      if (this.statusFilter) {
        filtered = filtered.filter(p => {
          const statusLower = (p.status || '').toLowerCase();
          if (this.statusFilter === 'completed') {
            return statusLower.includes('completed') || statusLower.includes('success') || statusLower.includes('succeeded') || statusLower.includes('paid');
          } else if (this.statusFilter === 'pending') {
            return statusLower.includes('pending') || statusLower.includes('processing');
          } else if (this.statusFilter === 'refunded') {
            return statusLower.includes('refund');
          } else if (this.statusFilter === 'fail') {
            return statusLower.includes('fail') || statusLower.includes('canceled') || statusLower.includes('cancelled');
          }
          return true;
        });
      }
      
      filtered.sort((a, b) => {
        if (this.sortOrder === 'newest') {
          return new Date(b.created_at || 0) - new Date(a.created_at || 0);
        } else if (this.sortOrder === 'amount-high') {
          return parseFloat(b.amount || 0) - parseFloat(a.amount || 0);
        } else if (this.sortOrder === 'amount-low') {
          return parseFloat(a.amount || 0) - parseFloat(b.amount || 0);
        }
        return 0;
      });
      
      return filtered;
    }
  },
  async created() {
    await this.fetchPayments();
  },
  methods: {
    async fetchPayments() {
      this.loading = true;
      try {
        const response = await api.getPayments();
        this.payments = response.data.payments || [];
      } catch (error) {
        console.error('Failed to fetch payments:', error);
        this.payments = [];
      } finally {
        this.loading = false;
      }
    },
    
    async refreshPayments() {
      await this.fetchPayments();
    },
    
    formatStatus(status) {
      if (!status) return 'Unknown';
      
      const statusLower = status.toLowerCase();
      
      if (statusLower.includes('completed') || statusLower.includes('success') || statusLower.includes('succeeded') || statusLower.includes('paid')) {
        return 'Completed';
      } else if (statusLower.includes('pending') || statusLower.includes('processing')) {
        return 'Pending';
      } else if (statusLower.includes('refund')) {
        return 'Refunded';
      } else if (statusLower.includes('fail') || statusLower.includes('canceled') || statusLower.includes('cancelled')) {
        return 'Failed';
      }
      
      return status
        .replace(/_/g, ' ')
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    },
    
    getStatusClass(status) {
      if (!status) return 'status-unknown';
      const statusLower = status.toLowerCase();
      
      if (statusLower.includes('completed') || statusLower.includes('success') || statusLower.includes('succeeded') || statusLower.includes('paid')) {
        return 'status-completed';
      } else if (statusLower.includes('pending') || statusLower.includes('processing')) {
        return 'status-pending';
      } else if (statusLower.includes('refund')) {
        return 'status-refunded';
      } else if (statusLower.includes('fail') || statusLower.includes('canceled') || statusLower.includes('cancelled')) {
        return 'status-fail';
      } else {
        return 'status-unknown';
      }
    },
    
    formatPaymentMethod(method) {
      if (!method) return 'Unknown';
      
      if (method.includes('CARD')) return 'Credit/Debit Card';
      if (method.includes('ON_DELIVERY')) return 'Cash on Delivery';
      
      return method
        .replace(/_/g, ' ')
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    },
    
    formatCurrency(currency) {
      if (!currency) return '';
      
      const cleaned = currency.replace(/^CURRENCY_/i, '');
      
      return cleaned.toUpperCase();
    },
    
    resetFilters() {
      this.statusFilter = '';
      this.sortOrder = 'newest';
    },
    
    viewPaymentDetails(payment) {
      this.selectedPayment = payment;
      this.copiedToClipboard = false;
    },
    
    closeModal() {
      this.selectedPayment = null;
      this.copiedToClipboard = false;
    },
    
    async copyTransactionId() {
      if (this.selectedPayment && this.selectedPayment.gateway_transaction_id) {
        const transactionId = this.selectedPayment.gateway_transaction_id.string_value;
        try {
          await navigator.clipboard.writeText(transactionId);
          this.copiedToClipboard = true;
          setTimeout(() => {
            this.copiedToClipboard = false;
          }, 2000);
        } catch (error) {
          console.error('Failed to copy:', error);
        }
      }
    }
  }
};
</script>

<style scoped>
.payments-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px 40px;
}

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

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #42b983;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading p {
  margin-top: 20px;
  color: #666;
  font-size: 16px;
}

.payments-summary {
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

.summary-card.gradient-blue {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.summary-card.gradient-green {
  background: linear-gradient(135deg, #42b983 0%, #38a169 100%);
}

.summary-card.gradient-purple {
  background: linear-gradient(135deg, #9333ea 0%, #7e22ce 100%);
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

.payments-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.payment-card {
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  border-left-width: 4px;
}

.payment-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.payment-card.card-status-completed {
  border-left-color: #10b981;
}

.payment-card.card-status-pending {
  border-left-color: #f59e0b;
}

.payment-card.card-status-refunded {
  border-left-color: #3b82f6;
}

.payment-card.card-status-fail {
  border-left-color: #ef4444;
}

.payment-card.card-status-unknown {
  border-left-color: #6b7280;
}

.payment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.payment-id .label {
  font-size: 12px;
  color: #666;
  margin-right: 8px;
}

.payment-id .value {
  font-size: 14px;
  color: #333;
  font-weight: 500;
  font-family: monospace;
}

.payment-status {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-completed {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

.status-pending {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
}

.status-refunded {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.status-fail {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
}

.status-unknown {
  background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(107, 114, 128, 0.3);
}

.payment-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 15px;
}

.detail-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-item.full-width {
  grid-column: 1 / -1;
}

.detail-item .label {
  font-size: 12px;
  color: #666;
  font-weight: 600;
}

.detail-item .value {
  font-size: 14px;
  color: #333;
}

.detail-item .amount {
  font-size: 18px;
  font-weight: bold;
  color: #28a745;
}

.order-link {
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
}

.order-link:hover {
  text-decoration: underline;
}

.transaction-id {
  font-size: 12px;
  color: #666;
  font-family: monospace;
  word-break: break-all;
}

.btn-details {
  width: 100%;
  padding: 10px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
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

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-state h3 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 24px;
}

.empty-state p {
  margin: 0 0 30px 0;
  color: #666;
  font-size: 16px;
}

.btn-shop {
  display: inline-block;
  padding: 12px 24px;
  background-color: #42b983;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: bold;
  transition: background-color 0.2s;
}

.btn-shop:hover {
  background-color: #379668;
}

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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  animation: slideUp 0.3s;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  color: #333;
}

.btn-close {
  background: none;
  border: none;
  font-size: 32px;
  color: #999;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  width: 32px;
  height: 32px;
}

.btn-close:hover {
  color: #333;
}

.modal-body {
  padding: 20px;
}

.detail-section {
  margin-bottom: 20px;
}

.detail-section:last-child {
  margin-bottom: 0;
}

.detail-section h4 {
  margin: 0 0 15px 0;
  color: #555;
  font-size: 16px;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.detail-grid .detail-item {
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.transaction-box {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.transaction-box p {
  flex-grow: 1;
  margin: 0;
  font-family: monospace;
  font-size: 12px;
  word-break: break-all;
}

.btn-copy {
  padding: 6px 12px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  white-space: nowrap;
}

.btn-copy:hover {
  background-color: #5a6268;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 20px;
  border-top: 1px solid #eee;
}

.btn-close-modal {
  padding: 10px 20px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.btn-close-modal:hover {
  background-color: #5a6268;
}

.btn-view-order {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 500;
}

.btn-view-order:hover {
  background-color: #0056b3;
}

@media (max-width: 1200px) {
  .payments-summary {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 1024px) {
  .payments-container {
    padding: 0 30px 30px;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .payments-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .payments-container {
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
  
  .payments-summary {
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
  
  .payments-list {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .detail-row,
  .detail-grid {
    grid-template-columns: 1fr;
  }
  
  .payment-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .modal-content {
    width: 95%;
    max-height: 90vh;
  }
  
  .modal-footer {
    flex-direction: column;
  }
  
  .btn-close-modal,
  .btn-view-order {
    width: 100%;
  }
}
</style>



