<script setup>
import { RouterView } from 'vue-router'
// import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <!-- <header>
    <div>
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/home">About</RouterLink>
      </nav>
    </div>
  </header> -->
  <div class="main">
    <RouterView />
  </div>
</template>

<style scoped>
.main {
  margin-left: 140px
}
</style>
