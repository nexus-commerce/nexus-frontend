<template>
  <div class="cart-page">
    <div class="page-header">
      <div class="header-content">
        <h1>Your Shopping Cart</h1>
        <p class="header-subtitle">Review your items and proceed to checkout</p>
      </div>
      <button v-if="cart.items && cart.items.length" @click="fetchCart" class="btn-refresh">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="1 4 1 10 7 10"></polyline>
          <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
        </svg>
        Refresh
      </button>
    </div>

    <div v-if="cart.items && cart.items.length" class="cart-content">
      <div class="cart-items-section">
        <h2 class="section-title">Cart Items ({{ cart.total_items }})</h2>
        <div class="cart-items-list">
          <div v-for="item in cart.items" :key="item.sku" class="cart-item-card">
            <div class="item-image-container">
              <img v-if="item.image_url" :src="item.image_url" :alt="item.name" class="item-image"/>
              <div v-else class="item-image-placeholder">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
              </div>
            </div>
            <div class="item-details">
              <h3 class="item-name">{{ item.name }}</h3>
              <p class="item-sku">SKU: {{ item.sku }}</p>
              <p class="item-unit-price">Unit Price: <strong>${{ item.price.toFixed(2) }}</strong></p>
              <div class="quantity-control">
                <label>Quantity:</label>
                <div class="quantity-input-wrapper">
                  <button @click="updateQuantity(item.sku, Math.max(1, item.quantity - 1))" class="qty-btn minus">-</button>
                  <input 
                    type="number" 
                    :value="item.quantity" 
                    @change="updateQuantity(item.sku, $event.target.value)"
                    min="1"
                    class="quantity-input"
                  />
                  <button @click="updateQuantity(item.sku, item.quantity + 1)" class="qty-btn plus">+</button>
                </div>
              </div>
            </div>
            <div class="item-total-section">
              <div class="total-price-container">
                <span class="total-label">Item Total</span>
                <span class="total-price">${{ item.item_total_price.toFixed(2) }}</span>
              </div>
              <button @click="removeItem(item.sku)" class="btn-remove">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="cart-summary-card">
        <h3 class="summary-title">Order Summary</h3>
        <div class="summary-row">
          <span class="summary-label">Total Items:</span>
          <span class="summary-value">{{ cart.total_items }}</span>
        </div>
        <div class="summary-row total-row">
          <span class="summary-label">Order Total:</span>
          <span class="summary-value total-amount">${{ cart.total_price.toFixed(2) }}</span>
        </div>
        <button @click="clearCartHandler" class="btn-clear">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
          Clear Cart
        </button>
      </div>
      
      <div class="checkout-section">
        <h3 class="checkout-title">Checkout</h3>
        
        <div class="checkout-steps">
          <div class="step" :class="{ active: checkoutStep >= 1, completed: checkoutStep > 1 }">
            <span class="step-number">1</span>
            <span class="step-label">Shipping</span>
          </div>
          <div class="step-line" :class="{ active: checkoutStep >= 2 }"></div>
          <div class="step" :class="{ active: checkoutStep >= 2, completed: checkoutStep > 2 }">
            <span class="step-number">2</span>
            <span class="step-label">Payment</span>
          </div>
          <div class="step-line" :class="{ active: checkoutStep >= 3 }"></div>
          <div class="step" :class="{ active: checkoutStep >= 3 }">
            <span class="step-number">3</span>
            <span class="step-label">Confirm</span>
          </div>
        </div>

        <div v-if="checkoutStep === 1" class="checkout-step-content">
          <div class="form-group">
            <label for="shipping_address">Shipping Address:</label>
            <textarea 
              id="shipping_address"
              v-model="shippingAddress" 
              placeholder="Enter your full shipping address" 
              rows="3"
              required 
            ></textarea>
          </div>
          
          <div class="step-actions">
            <button @click="goToPaymentMethod" class="btn-next" :disabled="!shippingAddress.trim()">
              Continue to Payment
            </button>
          </div>
        </div>

        <div v-if="checkoutStep === 2" class="checkout-step-content">
          <div class="form-group">
            <label>Select Payment Method:</label>
            <div class="payment-methods">
              <label class="payment-method-card" :class="{ selected: paymentMethod === 'PAYMENT_METHOD_ON_DELIVERY' }">
                <input 
                  type="radio" 
                  v-model="paymentMethod" 
                  value="PAYMENT_METHOD_ON_DELIVERY"
                />
                <div class="method-content">
                  <span class="method-icon">💵</span>
                  <div class="method-info">
                    <strong>Cash on Delivery</strong>
                    <p>Pay when you receive your order</p>
                  </div>
                </div>
              </label>
              <label class="payment-method-card" :class="{ selected: paymentMethod === 'PAYMENT_METHOD_CARD' }">
                <input 
                  type="radio" 
                  v-model="paymentMethod" 
                  value="PAYMENT_METHOD_CARD"
                />
                <div class="method-content">
                  <span class="method-icon">💳</span>
                  <div class="method-info">
                    <strong>Credit/Debit Card</strong>
                    <p>Secure payment via Stripe</p>
                  </div>
                </div>
              </label>
            </div>
          </div>
          
          <div class="step-actions">
            <button @click="checkoutStep = 1" class="btn-back">Back</button>
            <button @click="proceedToPayment" class="btn-next">
              {{ paymentMethod === 'PAYMENT_METHOD_CARD' ? 'Continue to Payment' : 'Place Order' }}
            </button>
          </div>
        </div>

        <div v-if="checkoutStep === 3 && paymentMethod === 'PAYMENT_METHOD_CARD'" class="checkout-step-content">
          <StripeCheckout
            v-if="clientSecret"
            :amount="cart.total_price"
            :client-secret="clientSecret"
            @success="handlePaymentSuccess"
            @error="handlePaymentError"
          />
          <div v-else class="loading">
            Initializing secure payment...
          </div>
          
          <div class="step-actions">
            <button @click="cancelPayment" class="btn-back">Cancel</button>
          </div>
        </div>

        <div v-if="orderMessage" :class="['message', orderMessageType]">
          <svg v-if="orderMessageType === 'success'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <svg v-else-if="orderMessageType === 'error'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          {{ orderMessage }}
        </div>
      </div>
    </div>
    <div v-else class="empty-cart-container">
      <div class="empty-cart-card">
        <div class="empty-cart-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
        </div>
        <h3 class="empty-cart-title">Your cart is empty</h3>
        <p class="empty-cart-description">
          Looks like you haven't added anything to your cart yet. 
          Start shopping to fill it with amazing products!
        </p>
        
        <router-link to="/products" class="btn-shop-enhanced">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          Browse Products
        </router-link>
        
        <div class="empty-cart-benefits">
          <div class="benefit-item">
            <span class="benefit-icon">✓</span>
            <span class="benefit-text">Free shipping on orders over $50</span>
          </div>
          <div class="benefit-item">
            <span class="benefit-icon">✓</span>
            <span class="benefit-text">Easy returns within 30 days</span>
          </div>
          <div class="benefit-item">
            <span class="benefit-icon">✓</span>
            <span class="benefit-text">Secure checkout process</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/services/api';
import { mapState, mapActions } from 'vuex';
import StripeCheckout from '@/components/StripeCheckout.vue';

export default {
  components: {
    StripeCheckout
  },
  data() {
    return {
      checkoutStep: 1,
      shippingAddress: '',
      paymentMethod: 'PAYMENT_METHOD_ON_DELIVERY',
      clientSecret: null,
      paymentIntentId: null,
      orderMessage: '',
      orderMessageType: '',
      isProcessing: false
    }
  },
  computed: {
    ...mapState(['cart']),
  },
  methods: {
    ...mapActions(['fetchCart']),
    
    goToPaymentMethod() {
      if (!this.shippingAddress.trim()) {
        this.showMessage('Please enter a shipping address.', 'error');
        return;
      }
      this.checkoutStep = 2;
    },
    
    async proceedToPayment() {
      if (this.paymentMethod === 'PAYMENT_METHOD_ON_DELIVERY') {
        await this.placeOrder();
      } else {
        await this.initializeStripePayment();
      }
    },
    
    async initializeStripePayment() {
      this.isProcessing = true;
      this.showMessage('Initializing secure payment...', 'info');
      
      try {
        const paymentResponse = await api.processPayment();
        this.clientSecret = paymentResponse.data.client_secret;
        this.paymentIntentId = paymentResponse.data.payment.id;
        
        if (!this.clientSecret) {
          throw new Error("Could not initialize payment.");
        }
        
        this.checkoutStep = 3;
        this.orderMessage = '';
      } catch (error) {
        console.error("Failed to initialize payment:", error);
        const errorMessage = error.response?.data?.error || 'Failed to initialize payment. Please try again.';
        this.showMessage(errorMessage, 'error');
      } finally {
        this.isProcessing = false;
      }
    },
    
    async handlePaymentSuccess(paymentIntent) {
      this.showMessage('Payment successful! Creating your order...', 'success');
      
      await this.placeOrder(paymentIntent.id);
    },
    
    handlePaymentError(errorMessage) {
      this.showMessage(errorMessage, 'error');
      this.isProcessing = false;
    },
    
    async placeOrder(paymentIntentId = null) {
      this.isProcessing = true;
      
      try {
        const orderData = {
          shipping_address: this.shippingAddress,
          payment_method: this.paymentMethod
        };
        
        if (paymentIntentId) {
          orderData.payment_intent_id = paymentIntentId;
        }
        
        const orderResponse = await api.createOrder(orderData);
        const orderId = orderResponse.data.order.id;
        
        this.showMessage(`Order placed successfully! Order ID: ${orderId}`, 'success');
        await this.fetchCart();
        
        setTimeout(() => {
          this.$router.push('/orders');
        }, 2000);
        
      } catch (error) {
        console.error("Failed to place order:", error);
        const errorMessage = error.response?.data?.error || 'There was an error placing your order.';
        this.showMessage(errorMessage, 'error');
      } finally {
        this.isProcessing = false;
      }
    },
    
    cancelPayment() {
      this.checkoutStep = 2;
      this.clientSecret = null;
      this.paymentIntentId = null;
      this.showMessage('Payment cancelled. Please select a payment method.', 'info');
    },
    
    async updateQuantity(sku, newQuantity) {
      const quantity = parseInt(newQuantity);
      if (quantity < 1) return;
      
      try {
        await api.updateCartItem(sku, quantity);
        await this.fetchCart();
      } catch (error) {
        console.error("Failed to update quantity:", error);
        this.showMessage('Failed to update quantity.', 'error');
      }
    },
    
    async removeItem(sku) {
      try {
        await api.removeCartItem(sku);
        await this.fetchCart();
        this.showMessage('Item removed from cart.', 'success');
      } catch (error) {
        console.error("Failed to remove item:", error);
        this.showMessage('Failed to remove item.', 'error');
      }
    },
    
    async clearCartHandler() {
      if (!confirm('Are you sure you want to clear your cart?')) return;
      
      try {
        await api.clearCart();
        await this.fetchCart();
        this.showMessage('Cart cleared.', 'success');
      } catch (error) {
        console.error("Failed to clear cart:", error);
        this.showMessage('Failed to clear cart.', 'error');
      }
    },
    
    showMessage(message, type) {
      this.orderMessage = message;
      this.orderMessageType = type;
    }
  },
  created() {
    this.fetchCart();
  }
}
</script>

<style scoped>
.cart-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px;
  min-height: calc(100vh - 200px);
  background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
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

.cart-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 30px;
}

.cart-items-section {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.section-title {
  margin: 0 0 24px 0;
  font-size: 24px;
  font-weight: 700;
  color: #2d3748;
  padding-bottom: 16px;
  border-bottom: 2px solid #e2e8f0;
}

.cart-items-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.cart-item-card {
  display: flex;
  gap: 20px;
  padding: 20px;
  background: #f7fafc;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.cart-item-card:hover {
  border-color: #cbd5e0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.item-image-container {
  flex-shrink: 0;
}

.item-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.item-image-placeholder {
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  color: #718096;
}

.item-details {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.item-name {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #2d3748;
}

.item-sku {
  margin: 0;
  font-size: 14px;
  color: #718096;
  font-weight: 500;
}

.item-unit-price {
  margin: 0;
  font-size: 15px;
  color: #4a5568;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 12px;
}

.quantity-control label {
  font-size: 14px;
  font-weight: 600;
  color: #4a5568;
}

.quantity-input-wrapper {
  display: flex;
  align-items: center;
  gap: 0;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  background: white;
}

.qty-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: #f7fafc;
  color: #2d3748;
  cursor: pointer;
  font-weight: 700;
  font-size: 18px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qty-btn:hover {
  background: #e2e8f0;
}

.qty-btn:active {
  transform: scale(0.95);
}

.quantity-input {
  width: 60px;
  height: 36px;
  padding: 0;
  border: none;
  border-left: 2px solid #e2e8f0;
  border-right: 2px solid #e2e8f0;
  text-align: center;
  font-size: 15px;
  font-weight: 600;
  color: #2d3748;
  background: white;
}

.quantity-input:focus {
  outline: none;
}

.item-total-section {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  min-width: 150px;
}

.total-price-container {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.total-label {
  font-size: 12px;
  color: #718096;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.total-price {
  font-weight: 800;
  font-size: 24px;
  color: #2d3748;
}

.btn-remove {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #ef5350 0%, #e53935 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(239, 83, 80, 0.3);
}

.btn-remove:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 83, 80, 0.4);
}

.cart-summary-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  height: fit-content;
  position: sticky;
  top: 20px;
}

.summary-title {
  margin: 0 0 24px 0;
  font-size: 24px;
  font-weight: 700;
  color: #2d3748;
  padding-bottom: 16px;
  border-bottom: 2px solid #e2e8f0;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
}

.summary-label {
  font-size: 15px;
  color: #718096;
  font-weight: 500;
}

.summary-value {
  font-size: 16px;
  font-weight: 600;
  color: #2d3748;
}

.summary-divider {
  height: 1px;
  background: #e2e8f0;
  margin: 8px 0;
}

.total-row {
  padding: 16px 0;
  border-top: 2px solid #e2e8f0;
  margin-top: 8px;
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

.btn-clear {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px 24px;
  margin-top: 20px;
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

.btn-clear:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(108, 117, 125, 0.4);
}
.checkout-section {
  margin-top: 30px;
  padding: 32px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  grid-column: 1 / -1;
}

.checkout-title {
  margin: 0 0 24px 0;
  font-size: 24px;
  font-weight: 700;
  color: #2d3748;
  padding-bottom: 16px;
  border-bottom: 2px solid #e2e8f0;
}
.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  margin-bottom: 10px;
  font-size: 15px;
  font-weight: 600;
  color: #2d3748;
}

textarea {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-family: inherit;
  font-size: 15px;
  color: #2d3748;
  resize: vertical;
  transition: all 0.2s;
  background: #f7fafc;
}

textarea:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

textarea::placeholder {
  color: #a0aec0;
}
.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.empty-cart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: 40px 20px;
}

.empty-cart-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 60px 40px;
  max-width: 600px;
  width: 100%;
  text-align: center;
  animation: slideUp 0.5s ease-out;
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

.empty-cart-icon {
  width: 120px;
  height: 120px;
  margin: 0 auto 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
}

.empty-cart-icon svg {
  width: 60px;
  height: 60px;
  color: white;
  stroke-width: 2.5;
}

.empty-cart-title {
  font-size: 32px;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 16px 0;
}

.empty-cart-description {
  font-size: 16px;
  color: #718096;
  line-height: 1.6;
  margin: 0 0 32px 0;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.btn-shop-enhanced {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 16px 36px;
  background: linear-gradient(135deg, #42b983 0%, #38a169 100%);
  color: white;
  text-decoration: none;
  border-radius: 50px;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(66, 185, 131, 0.3);
}

.btn-shop-enhanced:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(66, 185, 131, 0.4);
}

.btn-shop-enhanced svg {
  transition: transform 0.3s ease;
}

.btn-shop-enhanced:hover svg {
  transform: scale(1.1);
}

.empty-cart-benefits {
  margin-top: 48px;
  padding-top: 32px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.benefit-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 14px;
  color: #4a5568;
}

.benefit-icon {
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 12px;
  flex-shrink: 0;
}

.benefit-text {
  text-align: left;
}

@media (max-width: 768px) {
  .empty-cart-card {
    padding: 40px 24px;
  }
  
  .empty-cart-icon {
    width: 100px;
    height: 100px;
    margin-bottom: 24px;
  }
  
  .empty-cart-icon svg {
    width: 50px;
    height: 50px;
  }
  
  .empty-cart-title {
    font-size: 26px;
  }
  
  .empty-cart-description {
    font-size: 14px;
  }
  
  .btn-shop-enhanced {
    padding: 14px 28px;
    font-size: 15px;
  }
  
  .empty-cart-benefits {
    margin-top: 32px;
    padding-top: 24px;
  }
  
  .benefit-item {
    font-size: 13px;
  }
}

.checkout-steps {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
  padding: 24px 0;
  background: #f7fafc;
  border-radius: 12px;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  position: relative;
}

.step-number {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #e2e8f0;
  color: #a0aec0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 18px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.step.active .step-number {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  transform: scale(1.1);
}

.step.completed .step-number {
  background: linear-gradient(135deg, #42b983 0%, #10b981 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.3);
}

.step-label {
  font-size: 14px;
  color: #718096;
  font-weight: 600;
  transition: all 0.3s ease;
}

.step.active .step-label {
  color: #667eea;
  font-weight: 700;
}

.step.completed .step-label {
  color: #42b983;
}

.step-line {
  width: 100px;
  height: 3px;
  background: #e2e8f0;
  margin: 0 12px;
  transition: all 0.3s ease;
  border-radius: 2px;
}

.step-line.active {
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
}

.checkout-step-content {
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.payment-method-card {
  display: flex;
  padding: 20px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.payment-method-card:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
  transform: translateY(-2px);
}

.payment-method-card.selected {
  border-color: #667eea;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.2);
}

.payment-method-card input[type="radio"] {
  margin-right: 12px;
}

.method-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-grow: 1;
}

.method-icon {
  font-size: 32px;
}

.method-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.method-info strong {
  font-size: 16px;
  color: #333;
}

.method-info p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.step-actions {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 28px;
}

.btn-next,
.btn-back {
  padding: 14px 28px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 15px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-next {
  background: linear-gradient(135deg, #42b983 0%, #10b981 100%);
  color: white;
  flex-grow: 1;
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.3);
}

.btn-next:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(66, 185, 131, 0.4);
}

.btn-next:disabled {
  background: linear-gradient(135deg, #a0aec0 0%, #718096 100%);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-back {
  background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);
}

.btn-back:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(108, 117, 125, 0.4);
}

.loading {
  text-align: center;
  padding: 60px 40px;
  color: #718096;
  font-size: 16px;
  font-weight: 600;
}

.message {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  border-radius: 12px;
  margin-top: 20px;
  font-weight: 600;
  font-size: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
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

.message.info {
  background: linear-gradient(135deg, #d1ecf1 0%, #bee5eb 100%);
  color: #0c5460;
  border: 2px solid #17a2b8;
}

@media (max-width: 1200px) {
  .cart-content {
    grid-template-columns: 1fr;
  }

  .cart-summary-card {
    position: relative;
    top: 0;
  }
}

@media (max-width: 768px) {
  .cart-page {
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

  .cart-items-section,
  .cart-summary-card,
  .checkout-section {
    padding: 24px;
  }

  .cart-item-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .item-image-container {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .item-image,
  .item-image-placeholder {
    width: 100%;
    max-width: 200px;
    height: 200px;
  }

  .item-total-section {
    width: 100%;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 2px solid #e2e8f0;
  }

  .checkout-steps {
    padding: 16px 0;
  }
  
  .step-number {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
  
  .step-label {
    font-size: 12px;
  }
  
  .step-line {
    width: 50px;
  }
  
  .payment-method-card {
    padding: 16px;
  }
  
  .method-icon {
    font-size: 28px;
  }
  
  .step-actions {
    flex-direction: column;
  }

  .btn-next,
  .btn-back {
    width: 100%;
  }
}

@media (max-width: 640px) {
  .cart-page {
    padding: 15px;
  }

  .header-content h1 {
    font-size: 24px;
  }

  .section-title,
  .checkout-title,
  .summary-title {
    font-size: 20px;
  }

  .total-price {
    font-size: 20px;
  }

  .total-amount {
    font-size: 24px;
  }
}
</style>