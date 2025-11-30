<template>
  <div class="product-card">
    <h3>{{ product.name }}</h3>
    <p>{{ product.description }}</p>
    <p><strong>Price:</strong> ${{ product.price }}</p>
    <router-link :to="{ name: 'ProductDetail', params: { id: product.id }}" class="btn-details">
      View Details
    </router-link>
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
  }
};
</script>

<style scoped>
.product-card {
  border: 1px solid #ccc;
  padding: 16px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}
.btn-details {
  display: inline-block;
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #333;
  color: white;
  text-decoration: none;
  border-radius: 5px;
}
</style>