<template>
  <div class="app">
    <Home />
  </div>
</template>

<script>
import Home from './views/Home.vue'

export default {
  name: 'App',
  components: {
    Home
  }
}
</script>

<style>
.app {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
}
</style>
