<template>
  <header class="app-header">
    <nav>
      <div class="nav-left">
        <router-link to="/">Home</router-link>
        <router-link to="/products">Products</router-link>
      </div>
      
      <div class="nav-right">
        <div v-if="isAuthenticated" class="user-menu">
          <router-link to="/profile">Profile</router-link>
          <router-link to="/cart">Cart ({{ cartItemCount }})</router-link>
          <router-link to="/orders">Orders</router-link>
          <router-link to="/payments">Payments</router-link>
          <a href="#" @click.prevent="handleLogout">Logout</a>
        </div>
        <div v-else class="user-menu">
          <router-link to="/login">Login</router-link>
        </div>
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
    handleLogout() {
      this.logout();
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
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.nav-right {
  display: flex;
  justify-content: flex-end;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 5px;
}

nav a {
  color: white;
  text-decoration: none;
  font-weight: bold;
  padding: 8px 15px;
  white-space: nowrap;
  transition: color 0.2s;
}

nav a:hover {
  color: #42b983;
}

nav a.router-link-exact-active {
  color: #42b983;
}

@media (max-width: 768px) {
  nav {
    flex-direction: column;
    gap: 15px;
  }
  
  .nav-left,
  .nav-right {
    width: 100%;
    justify-content: center;
  }
  
  .user-menu {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>