<template>
  <div>
    <h2>User Profile</h2>
    <form v-if="user" @submit.prevent="updateProfile">
      <div class="form-group">
        <label for="name">Name:</label>
        <input type="text" id="name" v-model="user.name" required>
      </div>
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="user.email" disabled>
      </div>
      <button type="submit">Update Profile</button>
    </form>
    <p v-if="successMessage">{{ successMessage }}</p>
    <p v-if="errorMessage">{{ errorMessage }}</p>
  </div>
</template>

<script>
import api from '@/services/api';

export default {
  data() {
    return {
      user: null,
      successMessage: '',
      errorMessage: ''
    };
  },
  async created() {
    try {
      const response = await api.getUserProfile();
      this.user = response.data;
    } catch (error) {
      this.errorMessage = 'Failed to fetch user profile.';
      console.error(error);
    }
  },
  methods: {
    async updateProfile() {
      this.successMessage = '';
      this.errorMessage = '';
      try {
        const profileData = { name: this.user.name };
        await api.updateUserProfile(profileData);
        this.successMessage = 'Profile updated successfully!';
      } catch (error) {
        this.errorMessage = 'Failed to update profile.';
        console.error(error);
      }
    }
  }
};
</script>

<style scoped>
.form-group {
  margin-bottom: 15px;
}
label {
  display: block;
  margin-bottom: 5px;
}
input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}
input:disabled {
  background-color: #f4f4f4;
  cursor: not-allowed;
}
</style>