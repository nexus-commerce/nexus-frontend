<template>
  <div>
    <h2>Products</h2>
    <div class="product-list">
      <ProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import ProductCard from '@/components/ProductCard.vue'; // <-- Import the new component

export default {
  components: {
    ProductCard
  },
  computed: {
    ...mapState(['products'])
  },
  methods: {
    ...mapActions(['fetchProducts'])
  },
  created() {
    this.fetchProducts();
  }
};
</script>

<style scoped>
.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}
</style>