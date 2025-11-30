<template>
  <div>
    <h2>My Orders</h2>
    <div v-if="orders.length > 0">
      <div v-for="order in orders" :key="order.id" class="order-card">
        <h3>Order ID: {{ order.id }}</h3>
        <p><strong>Status:</strong> {{ order.status }}</p>
        <p><strong>Total:</strong> ${{ order.total_price }}</p>
        <p><strong>Date:</strong> {{ new Date(order.created_at).toLocaleDateString() }}</p>
        <h4>Items:</h4>
        <ul>
          <li v-for="item in order.items" :key="item.product_id">
            {{ item.product_name }} - Quantity: {{ item.quantity }}
          </li>
        </ul>
      </div>
    </div>
    <div v-else>
      <p>You have not placed any orders yet.</p>
    </div>
  </div>
</template>

<script>
import api from '@/services/api';

export default {
  data() {
    return {
      orders: []
    };
  },
  async created() {
    try {
      const response = await api.getOrders();
      console.log(response.data.orders)
      this.orders = response.data.orders;
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  }
};
</script>

<style scoped>
.order-card {
  border: 1px solid #ccc;
  padding: 16px;
  margin-bottom: 16px;
  border-radius: 8px;
  background-color: #f9f9f9;
}
ul {
  padding-left: 20px;
}
</style>