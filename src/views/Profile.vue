<template>
  <div class="profile-container">
    <div class="page-header">
      <div class="header-content">
        <h1>My Profile</h1>
        <p class="header-subtitle">Manage your account information and preferences</p>
      </div>
      <button @click="loadProfile(); loadStats()" class="btn-refresh">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="1 4 1 10 7 10"></polyline>
          <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
        </svg>
        Refresh
      </button>
    </div>
    
    <div v-if="user" class="profile-content">
      <div class="profile-header-card">
        <div class="profile-avatar">
          <div class="avatar-circle">
            {{ getUserInitials() }}
          </div>
        </div>
        <div class="profile-header-info">
          <h2>{{ user.first_name }} {{ user.last_name }}</h2>
          <p class="user-email">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            {{ user.email }}
          </p>
          <p class="user-id">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            ID: {{ user.id }}
          </p>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card gradient-blue">
          <div class="stat-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="9" y1="3" x2="9" y2="21"></line>
            </svg>
          </div>
          <div class="stat-info">
            <p class="stat-label">Total Orders</p>
            <h3>{{ stats.totalOrders }}</h3>
          </div>
        </div>
        <div class="stat-card gradient-green">
          <div class="stat-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </div>
          <div class="stat-info">
            <p class="stat-label">Cart Items</p>
            <h3>{{ stats.cartItems }}</h3>
          </div>
        </div>
        <div class="stat-card gradient-purple">
          <div class="stat-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
          <div class="stat-info">
            <p class="stat-label">Cart Total</p>
            <h3>${{ stats.cartTotal.toFixed(2) }}</h3>
          </div>
        </div>
      </div>

      <div class="info-section">
        <div class="section-header">
          <h3>Account Information</h3>
          <button 
            v-if="!isEditing" 
            @click="startEditing" 
            class="btn-edit"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Edit Profile
          </button>
        </div>

        <div v-if="!isEditing" class="view-mode">
          <div class="info-row">
            <div class="info-item">
              <label>First Name:</label>
              <span class="value">{{ user.first_name }}</span>
            </div>
            <div class="info-item">
              <label>Last Name:</label>
              <span class="value">{{ user.last_name }}</span>
            </div>
          </div>
          <div class="info-row">
            <div class="info-item full-width">
              <label>Email Address:</label>
              <span class="value">{{ user.email }}</span>
            </div>
          </div>
          <div class="info-row">
            <div class="info-item full-width">
              <label>User ID:</label>
              <span class="value">{{ user.id }}</span>
            </div>
          </div>
        </div>

        <form v-else @submit.prevent="updateProfile" class="edit-form">
          <div class="form-row">
            <div class="form-group">
              <label for="first_name">First Name:</label>
              <input 
                type="text" 
                id="first_name" 
                v-model="editedUser.first_name" 
                required
                placeholder="Enter first name"
              >
            </div>
            <div class="form-group">
              <label for="last_name">Last Name:</label>
              <input 
                type="text" 
                id="last_name" 
                v-model="editedUser.last_name" 
                required
                placeholder="Enter last name"
              >
            </div>
          </div>
          <div class="form-row">
            <div class="form-group full-width">
              <label for="email">Email Address:</label>
              <input 
                type="email" 
                id="email" 
                v-model="editedUser.email" 
                required
                placeholder="Enter email address"
              >
            </div>
          </div>
          
          <div class="form-actions">
            <button type="submit" class="btn-save" :disabled="isSaving">
              <svg v-if="!isSaving" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              {{ isSaving ? 'Saving...' : 'Save Changes' }}
            </button>
            <button type="button" @click="cancelEditing" class="btn-cancel">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
              Cancel
            </button>
          </div>
        </form>
      </div>

      <div class="actions-section">
        <h3>Quick Actions</h3>
        <div class="action-buttons">
          <router-link to="/orders" class="action-btn action-orders">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="9" y1="3" x2="9" y2="21"></line>
            </svg>
            View Orders
          </router-link>
          <router-link to="/cart" class="action-btn action-cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            View Cart
          </router-link>
          <router-link to="/products" class="action-btn action-products">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
            Browse Products
          </router-link>
          <router-link to="/payments" class="action-btn action-payments">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
              <line x1="1" y1="10" x2="23" y2="10"></line>
            </svg>
            Payment History
          </router-link>
          <button @click="logout" class="action-btn logout-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Logout
          </button>
        </div>
      </div>

      <div v-if="successMessage" class="message success">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        {{ successMessage }}
      </div>
      <div v-if="errorMessage" class="message error">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
        {{ errorMessage }}
      </div>
    </div>

    <div v-else class="loading">
      <p>Loading profile...</p>
    </div>
  </div>
</template>

<script>
import api from '@/services/api';
import { mapState, mapGetters } from 'vuex';

export default {
  data() {
    return {
      user: null,
      editedUser: null,
      isEditing: false,
      isSaving: false,
      successMessage: '',
      errorMessage: '',
      stats: {
        totalOrders: 0,
        cartItems: 0,
        cartTotal: 0
      }
    };
  },
  computed: {
    ...mapState(['cart', 'orders']),
    ...mapGetters(['cartItemCount', 'cartTotal'])
  },
  async created() {
    await this.loadProfile();
    await this.loadStats();
  },
  methods: {
    async loadProfile() {
      try {
        const response = await api.getUserProfile();
        this.user = { ...response.data.user };
      } catch (error) {
        this.errorMessage = 'Failed to fetch user profile.';
        console.error(error);
      }
    },
    
    async loadStats() {
      try {
        await this.$store.dispatch('fetchCart');
        this.stats.cartItems = this.cartItemCount;
        this.stats.cartTotal = this.cartTotal;
        
        await this.$store.dispatch('fetchOrders');
        this.stats.totalOrders = this.orders ? this.orders.length : 0;
      } catch (error) {
        console.error('Failed to load statistics:', error);
      }
    },
    
    getUserInitials() {
      if (!this.user) return '';
      const firstInitial = this.user.first_name ? this.user.first_name.charAt(0).toUpperCase() : '';
      const lastInitial = this.user.last_name ? this.user.last_name.charAt(0).toUpperCase() : '';
      return firstInitial + lastInitial;
    },
    
    startEditing() {
      this.editedUser = { ...this.user };
      this.isEditing = true;
      this.successMessage = '';
      this.errorMessage = '';
    },
    
    cancelEditing() {
      this.editedUser = null;
      this.isEditing = false;
      this.successMessage = '';
      this.errorMessage = '';
    },
    
    async updateProfile() {
      this.successMessage = '';
      this.errorMessage = '';
      this.isSaving = true;
      
      try {
        const updateMask = {
          paths: ['first_name', 'last_name', 'email']
        };
        
        await api.updateUserProfile(this.editedUser, updateMask);
        
        this.user = { ...this.editedUser };
        
        await this.$store.dispatch('fetchUserProfile');
        
        this.successMessage = 'Profile updated successfully!';
        this.isEditing = false;
        this.editedUser = null;
        
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      } catch (error) {
        console.error(error);
        if (error.response) {
          this.errorMessage = error.response.data?.error || 'Failed to update profile.';
        } else {
          this.errorMessage = 'Failed to update profile. Please try again.';
        }
      } finally {
        this.isSaving = false;
      }
    },
    
    logout() {
      this.$store.dispatch('logout');
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
.profile-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
  min-height: calc(100vh - 80px);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.profile-header-card {
  display: flex;
  align-items: center;
  gap: 30px;
  padding: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.25);
  color: white;
  position: relative;
  overflow: hidden;
}

.profile-header-card::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  transform: translate(30%, -30%);
}

.profile-avatar {
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

.avatar-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  font-weight: 800;
  color: white;
  border: 4px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.profile-header-info {
  position: relative;
  z-index: 1;
}

.profile-header-info h2 {
  margin: 0 0 12px 0;
  font-size: 32px;
  font-weight: 800;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.user-email {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 8px 0;
  font-size: 16px;
  font-weight: 500;
  opacity: 0.95;
}

.user-id {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 8px 0;
  font-size: 14px;
  font-weight: 500;
  opacity: 0.85;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 28px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.1;
  z-index: 0;
}

.stat-card.gradient-blue::before {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-card.gradient-green::before {
  background: linear-gradient(135deg, #42b983 0%, #10b981 100%);
}

.stat-card.gradient-purple::before {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
  backdrop-filter: blur(10px);
}

.gradient-blue .stat-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.gradient-green .stat-icon {
  background: linear-gradient(135deg, #42b983 0%, #10b981 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.3);
}

.gradient-purple .stat-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(240, 147, 251, 0.3);
}

.stat-info {
  position: relative;
  z-index: 1;
}

.stat-label {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 600;
  color: #718096;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-info h3 {
  margin: 0;
  font-size: 32px;
  font-weight: 800;
  color: #2d3748;
}

.info-section {
  background: white;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e2e8f0;
}

.section-header h3 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #2d3748;
}

.btn-edit {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-edit:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.view-mode {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
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
  font-size: 13px;
  color: #718096;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-item .value {
  font-size: 16px;
  font-weight: 500;
  color: #2d3748;
  padding: 12px 16px;
  background: #f7fafc;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  transition: all 0.2s;
}

.info-item .value:hover {
  background: #edf2f7;
  border-color: #cbd5e0;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-size: 13px;
  color: #718096;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 500;
  color: #2d3748;
  box-sizing: border-box;
  transition: all 0.2s;
  background: #f7fafc;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group input::placeholder {
  color: #a0aec0;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}

.btn-save {
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

.btn-save:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(66, 185, 131, 0.4);
}

.btn-save:disabled {
  background: #a0aec0;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-cancel {
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

.btn-cancel:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(108, 117, 125, 0.4);
}

.actions-section {
  background: white;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.actions-section h3 {
  margin: 0 0 24px 0;
  font-size: 24px;
  font-weight: 700;
  color: #2d3748;
}

.action-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px 24px;
  background: white;
  color: #2d3748;
  text-decoration: none;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  font-weight: 600;
  font-size: 15px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.action-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  border-color: #cbd5e0;
}

.action-orders:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: #667eea;
}

.action-cart:hover {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border-color: #f093fb;
}

.action-products:hover {
  background: linear-gradient(135deg, #42b983 0%, #10b981 100%);
  color: white;
  border-color: #42b983;
}

.action-payments:hover {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  color: white;
  border-color: #fa709a;
}

.logout-btn {
  background: linear-gradient(135deg, #ef5350 0%, #e53935 100%);
  color: white;
  border-color: #ef5350;
  box-shadow: 0 4px 12px rgba(239, 83, 80, 0.3);
}

.logout-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(239, 83, 80, 0.4);
  background: linear-gradient(135deg, #e53935 0%, #d32f2f 100%);
}

.message {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 15px;
  animation: slideIn 0.3s ease-out;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message.success {
  background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
  color: #155724;
  border: 2px solid #28a745;
}

.message.error {
  background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
  color: #721c24;
  border: 2px solid #dc3545;
}

.loading {
  text-align: center;
  padding: 80px 20px;
  font-size: 18px;
  font-weight: 600;
  color: #718096;
}

@media (max-width: 1200px) {
  .profile-container {
    padding: 30px;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  .action-buttons {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .profile-container {
    padding: 20px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .header-content h1 {
    font-size: 28px;
  }

  .btn-refresh {
    width: 100%;
    justify-content: center;
  }

  .profile-header-card {
    flex-direction: column;
    text-align: center;
    padding: 30px 24px;
  }

  .profile-header-info {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .avatar-circle {
    width: 100px;
    height: 100px;
    font-size: 40px;
  }

  .profile-header-info h2 {
    font-size: 24px;
  }

  .user-email,
  .user-id {
    justify-content: center;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .stat-card {
    padding: 20px;
  }

  .stat-icon {
    width: 56px;
    height: 56px;
  }

  .stat-icon svg {
    width: 28px;
    height: 28px;
  }

  .stat-info h3 {
    font-size: 28px;
  }

  .info-section,
  .actions-section {
    padding: 24px;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .btn-edit {
    width: 100%;
    justify-content: center;
  }
  
  .info-row,
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }

  .btn-save,
  .btn-cancel {
    width: 100%;
    justify-content: center;
  }
  
  .action-buttons {
    grid-template-columns: 1fr;
  }
}
</style>