<template>
  <footer class="app-footer">
    <p>&copy; {{ currentYear }} Nexus Commerce. All rights reserved.</p>
    <p class="version" v-if="showVersion">v0.0.1</p>
  </footer>
</template>

<script>
import config from '@/config/environment';

export default {
  name: 'AppFooter',
  data() {
    return {
      currentYear: new Date().getFullYear(),
      showVersion: config.app.debug
    }
  }
}
</script>

<style scoped>
.app-footer {
  background-color: #333;
  color: white;
  text-align: center;
  padding: 20px;
}

.app-footer p {
  margin: 0;
}

.app-footer .version {
  margin-top: 8px;
  font-size: 12px;
  opacity: 0.7;
}
</style>

