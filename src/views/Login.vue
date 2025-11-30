<!-- src/views/Login.vue -->
<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <input type="email" v-model="loginForm.email" placeholder="Email" required>
      <input type="password" v-model="loginForm.password" placeholder="Password" required>
      <button type="submit">Login</button>
    </form>

    <h2 style="margin-top: 40px;">Register</h2>
    <form @submit.prevent="handleRegister">
      <input type="text" v-model="registerForm.first_name" placeholder="First Name" required>
      <input type="text" v-model="registerForm.last_name" placeholder="Last Name" required>
      <input type="email" v-model="registerForm.email" placeholder="Email" required>
      <input type="password" v-model="registerForm.password" placeholder="Password" required>
      <input type="password" v-model="registerForm.password_confirmation" placeholder="Confirm Password" required>
      <button type="submit">Register</button>
    </form>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script>
import api from '@/services/api';
export default {
  data() {
    return {
      loginForm: { email: '', password: '' },
      registerForm: {
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirmation: ''
      },
      error: ''
    };
  },
  methods: {
    async handleLogin() {
      try {
        await this.$store.dispatch('login', this.loginForm);
        this.$router.push('/profile');
      } catch (err) {
        this.error = 'Failed to login. Please check your credentials.';
        console.error(err);
      }
    },
    async handleRegister() {
      if (this.registerForm.password !== this.registerForm.password_confirmation) {
        this.error = 'Passwords do not match.';
        return;
      }
      try {
        await api.register(this.registerForm);
        // Automatically log in after successful registration
        await this.$store.dispatch('login', {
          email: this.registerForm.email,
          password: this.registerForm.password
        });
        this.$router.push('/products');
      } catch (err) {
        this.error = 'Failed to register. The email might already be in use.';
        console.error(err);
      }
    }
  }
};
</script>