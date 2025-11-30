<template>
  <header class="app-header">
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/products">Products</router-link>
      <div v-if="isAuthenticated">
        <router-link to="/profile">Profile</router-link>
        <router-link to="/cart">Cart ({{ cartItemCount }})</router-link>
        <router-link to="/orders">My Orders</router-link>
        <a href="#" @click.prevent="logout">Logout</a>
      </div>
      <div v-else>
        <router-link to="/login">Login</router-link>
      </div>
    </nav>
  </header>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'AppHeader',
  computed: {
    ...mapGetters(['isAuthenticated', 'cartItemCount'])
  },
  methods: {
    ...mapActions(['logout']),
    logout() {
      this.$store.dispatch('logout');
      this.$router.push('/login');
    }
  },
  created() {
    if (this.isAuthenticated) {
      this.$store.dispatch('fetchCart');
    }
  }
}
</script>

<style scoped>
.app-header {
  background-color: #333;
  color: white;
  padding: 1rem;
}
nav {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
nav a {
  color: white;
  text-decoration: none;
  font-weight: bold;
  padding: 0 15px;
}
nav a.router-link-exact-active {
  color: #42b983;
}
</style>