<template>
  <div id="app">
    <AppHeader />
    <main class="container">
      <router-view/>
    </main>
  </div>
</template>

<script>
import AppHeader from './components/AppHeader.vue';

export default {
  name: 'App',
  components: {
    AppHeader
  }
}
</script>

<style>
/* Add some basic styling */
body {
  font-family: sans-serif;
  margin: 0;
  background-color: #f4f4f4;
}
.container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
</style>