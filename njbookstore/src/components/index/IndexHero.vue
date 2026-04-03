<template>
  <section class="hero-section">
    <div class="hero-container">
      <img :src="ASSETS.heroPicture" alt="书店实景" class="hero-picture" />
      <img :src="ASSETS.heroDecorate" alt="" class="hero-decorate" />
      <img :src="ASSETS.titleRight" alt="实体书店南京" class="hero-title-right" />
      <img :src="ASSETS.titleLeft" alt="引言" class="hero-title-left" />
    </div>
  </section>
</template>

<script setup>
import { ASSETS } from '../../constants/indexAssets.js'
</script>

<style scoped>
.hero-section {
  width: 100%;
  position: relative;
}

.hero-container {
  position: relative;
  width: 100%;
  max-width: 1920px;
  margin: 0 auto;
  aspect-ratio: 1920 / 750;
  overflow: hidden;
}

.hero-picture {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
}

.hero-decorate {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top left;
  z-index: 2;
  pointer-events: none;
}

.hero-title-right {
  position: absolute;
  right: 4%;
  top: 4.5%;
  height: 88%;
  width: auto;
  z-index: 3;
  pointer-events: none;
}

.hero-title-left {
  position: absolute;
  left: 3%;
  bottom: 8%;
  width: 30%;
  height: auto;
  z-index: 3;
  pointer-events: none;
}

/* Hero 底部向下渐隐，衔接第二版面 */
.hero-container::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 22%;
  background: linear-gradient(to bottom, transparent, rgba(242, 236, 220, 0.88));
  z-index: 10;
  pointer-events: none;
}
</style>
