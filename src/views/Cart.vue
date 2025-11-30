<!-- src/views/Cart.vue -->
<template>
  <div>
    <h2>Your Shopping Cart</h2>
    <div v-if="cart.items && cart.items.length">
      <div v-for="item in cart.items" :key="item.sku" class="cart-item">
        <img :src="item.image_url" :alt="item.name" class="item-image"/>
        <div class="item-details">
          <span>{{ item.name }} ({{ item.sku }})</span>
          <span>Quantity: {{ item.quantity }}</span>
          <span>Unit Price: ${{ item.price.toFixed(2) }}</span>
        </div>
        <div class="item-total">
          <span>Item Total: ${{ item.item_total_price.toFixed(2) }}</span>
          <button @click="removeItem(item.sku)">Remove</button>
        </div>
      </div>
      <hr>
      <div class="cart-summary">
        <h4>Total Items: {{ cart.total_items }}</h4>
        <h3>Order Total: ${{ cart.total_price.toFixed(2) }}</h3>
      </div>
      <div class="checkout-form">
        <h3>Shipping Information</h3>
        <form @submit.prevent="handlePlaceOrder">
          <input type="text" v-model="shippingAddress" placeholder="Enter your full shipping address" required />
          <button type="submit">Place Order</button>
        </form>
        <p v-if="orderMessage">{{ orderMessage }}</p>
      </div>
    </div>
    <div v-else>
      <p>Your cart is empty.</p>
    </div>
  </div>
</template>

<script>
import api from '@/services/api';
import { mapState, mapActions } from 'vuex';
export default {
  data() {
    return {
      shippingAddress: '',
      orderMessage: ''
    }
  },
  computed: {
    ...mapState(['cart']),
  },
  methods: {
    ...mapActions(['fetchCart']),
    async removeItem(sku) {
      await api.removeCartItem(sku);
      this.fetchCart(); // Refresh cart from server
    },
    async handlePlaceOrder() {
      this.orderMessage = 'Processing your order...';
      try {
        // Step 1: Initiate payment to get a client secret (simulation)
        // In a real app, you'd use this secret with a payment library like Stripe.
        // const paymentResponse = await api.initiatePayment();
        // const clientSecret = paymentResponse.data.client_secret;
        //
        // if (!clientSecret) {
        //   throw new Error("Could not initiate payment.");
        // }

        // Step 2: (Simulated) Assume payment was successful and we got an ID.
       //  const paymentIntentId = "pi_dummy_" + clientSecret;

        // Step 3: Create the order with shipping and payment info
        const orderData = {
          shipping_address: this.shippingAddress,
          payment_method: "ON_DELIVERY"
        };

        const orderResponse = await api.createOrder(orderData);
        this.orderMessage = 'Order placed successfully! Order ID: ' + orderResponse.data.id;

        this.fetchCart(); // Clear local cart view after successful order
        setTimeout(() => this.$router.push('/orders'), 2000);

      } catch (error) {
        console.error("Failed to place order:", error);
        this.orderMessage = 'There was an error placing your order.';
      }
    }
  },
  created() {
    this.fetchCart();
  }
}
</script>

<style scoped>
.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}
.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  margin-right: 15px;
}
.item-details {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}
.cart-summary, .checkout-form {
  margin-top: 20px;
  text-align: right;
}
.checkout-form input {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
}
</style>