<!-- src/views/ProductDetail.vue -->
<template>
  <div v-if="product">
    <img :src="product.image_url" :alt="product.name" class="product-image"/>
    <h2>{{ product.name }}</h2>
    <p>{{ product.description }}</p>
    <h4>Price: ${{ product.price }}</h4>
    <p>In Stock: {{ product.stock_quantity }}</p>
    <form @submit.prevent="handleAddToCart">
      <label for="quantity">Quantity:</label>
      <input type="number" id="quantity" v-model.number="quantity" min="1" />
      <button type="submit">Add to Cart</button>
    </form>
    <p v-if="message">{{ message }}</p>
  </div>
  <div v-else>
    <p>Loading product details...</p>
  </div>
</template>

<script>
import api from '@/services/api';
export default {
  data() {
    return {
      product: null,
      quantity: 1,
      message: ''
    }
  },
  async created() {
    const productId = this.$route.params.id;
    try {
      const response = await api.getProduct(productId);
      // Response is now { "product": { ... } }
      this.product = response.data.product;
    } catch (error) {
      console.error("Failed to fetch product:", error);
      this.message = "Could not load product details."
    }
  },
  methods: {
    async handleAddToCart() {
      if (!this.product || !this.product.sku) return;
      try {
        const cartItem = {
          sku: this.product.sku,
          quantity: this.quantity
        };
        await api.addToCart(cartItem);
        this.message = 'Product added to cart!';
        // Refresh cart count in header
        this.$store.dispatch('fetchCart');
      } catch (error) {
        console.error("Failed to add to cart:", error);
        this.message = 'Error adding item to cart.';
      }
    }
  }
}
</script>

<style scoped>
.product-image {
  max-width: 400px;
  height: auto;
}
</style>