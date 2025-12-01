<template>
  <div class="stripe-checkout">
    <div v-if="!isReady" class="loading-overlay">
      <div class="loading-spinner"></div>
      <p>Loading secure payment form...</p>
    </div>
    
    <div class="payment-form" :class="{ 'form-loading': !isReady }">
      <div class="form-section">
        <label for="card-element">Card Details</label>
        <div id="card-element" class="card-element"></div>
        <div v-if="cardError" class="card-error">{{ cardError }}</div>
      </div>

      <div class="payment-summary">
        <div class="summary-row">
          <span>Amount to pay:</span>
          <span class="amount">${{ amount.toFixed(2) }}</span>
        </div>
      </div>

      <button 
        @click="handleSubmit" 
        :disabled="isProcessing || !isReady"
        class="btn-pay"
      >
        {{ isProcessing ? 'Processing...' : `Pay $${amount.toFixed(2)}` }}
      </button>

      <div class="stripe-badge">
        <img src="https://stripe.com/img/v3/home/social.png" alt="Powered by Stripe" class="stripe-logo">
        <p class="secure-text">🔒 Secure payment powered by Stripe</p>
      </div>
    </div>
  </div>
</template>

<script>
import { getStripe } from '@/services/stripe';

export default {
  name: 'StripeCheckout',
  props: {
    amount: {
      type: Number,
      required: true
    },
    clientSecret: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      stripe: null,
      cardElement: null,
      isReady: false,
      isProcessing: false,
      cardError: null
    };
  },
  async mounted() {
    await this.$nextTick();
    await this.initializeStripe();
  },
  beforeUnmount() {
    if (this.cardElement) {
      this.cardElement.destroy();
    }
  },
  methods: {
    async initializeStripe() {
      try {
        const cardElementContainer = document.getElementById('card-element');
        if (!cardElementContainer) {
          console.error('Card element container not found in DOM');
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        this.stripe = await getStripe();
        
        if (!this.stripe) {
          throw new Error('Failed to load Stripe');
        }

        const elements = this.stripe.elements();
        
        this.cardElement = elements.create('card', {
          style: {
            base: {
              fontSize: '16px',
              color: '#32325d',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              '::placeholder': {
                color: '#aab7c4'
              },
              padding: '10px'
            },
            invalid: {
              color: '#fa755a',
              iconColor: '#fa755a'
            }
          },
          hidePostalCode: false
        });

        const mountElement = document.getElementById('card-element');
        if (!mountElement) {
          throw new Error('Card element not found in DOM');
        }

        this.cardElement.mount('#card-element');

        this.cardElement.on('change', (event) => {
          this.cardError = event.error ? event.error.message : null;
        });

        this.isReady = true;
      } catch (error) {
        console.error('Failed to initialize Stripe:', error);
        this.$emit('error', 'Failed to load payment form. Please refresh the page.');
      }
    },

    async handleSubmit() {
      if (!this.stripe || !this.cardElement || this.isProcessing) {
        return;
      }

      this.isProcessing = true;
      this.cardError = null;

      try {
        const { error, paymentIntent } = await this.stripe.confirmCardPayment(
          this.clientSecret,
          {
            payment_method: {
              card: this.cardElement
            }
          }
        );

        if (error) {
          this.cardError = error.message;
          this.$emit('error', error.message);
          this.isProcessing = false;
        } else if (paymentIntent.status === 'succeeded') {
          this.$emit('success', paymentIntent);
        } else {
          this.$emit('error', 'Payment processing failed. Please try again.');
          this.isProcessing = false;
        }
      } catch (error) {
        console.error('Payment error:', error);
        this.$emit('error', 'An unexpected error occurred. Please try again.');
        this.isProcessing = false;
      }
    }
  }
};
</script>

<style scoped>
.stripe-checkout {
  width: 100%;
  position: relative;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
  padding: 40px;
}

.loading-overlay p {
  margin-top: 20px;
  color: #666;
  font-size: 16px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #5469d4;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.form-loading {
  opacity: 0.5;
  pointer-events: none;
}

.payment-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-section label {
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.card-element {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  transition: border-color 0.2s;
}

.card-element:focus-within {
  border-color: #5469d4;
  box-shadow: 0 0 0 1px #5469d4;
}

.card-error {
  color: #fa755a;
  font-size: 14px;
  margin-top: 8px;
}

.payment-summary {
  background-color: #f7fafc;
  padding: 16px;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
}

.amount {
  font-size: 24px;
  font-weight: bold;
  color: #28a745;
}

.btn-pay {
  width: 100%;
  padding: 14px 24px;
  background: linear-gradient(135deg, #5469d4 0%, #3949ab 100%);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-pay:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(84, 105, 212, 0.4);
}

.btn-pay:disabled {
  background: #6c757d;
  cursor: not-allowed;
  transform: none;
}

.stripe-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

.stripe-logo {
  height: 26px;
  opacity: 0.7;
}

.secure-text {
  margin: 0;
  font-size: 12px;
  color: #666;
  text-align: center;
}

@media (max-width: 768px) {
  .payment-form {
    gap: 16px;
  }
  
  .amount {
    font-size: 20px;
  }
  
  .btn-pay {
    padding: 12px 20px;
    font-size: 14px;
  }
}
</style>

