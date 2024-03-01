<script setup>
  const userData = JSON.parse(localStorage.getItem('userData'));
</script>

<template>
  <main>
    <h1>Welcome to the home page, {{ userData.user }}</h1>
  </main>
</template>
