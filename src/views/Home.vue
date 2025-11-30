<template>
  <div class="home">
    <h1>Welcome to Our E-commerce Store</h1>
    <p>The best place to find amazing products.</p>
    <router-link to="/products" class="btn-explore">Explore Products</router-link>
  </div>
</template>

<script>
export default {
  name: 'Home'
};
</script>

<style scoped>
.home {
  text-align: center;
  padding: 50px 20px;
}
.btn-explore {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-weight: bold;
}
</style>