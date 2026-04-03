<template>
  <div class="app-root" :style="bgStyle">
    <router-view />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ASSETS } from './constants/indexAssets.js'

const bgStyle = computed(() => ({
  backgroundImage: ASSETS.background ? `url(${ASSETS.background})` : 'none',
  backgroundRepeat: 'repeat',
  backgroundSize: '600px auto'
}))
</script>

<style scoped>
.app-root {
  min-height: 100vh;
  background-color: #f5f0e6;
}
</style>
